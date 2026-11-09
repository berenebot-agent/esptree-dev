from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

from .db import Database
from .firmware_store import FirmwareStore
from .models import (
    ANNOUNCING,
    FAILED,
    QUEUED,
    REJOIN_TIMEOUT,
    REJOINED_UNVERIFIED,
    STARTING,
    SUCCESS,
    TRANSFERRING,
    VERIFYING,
    VERSION_MISMATCH,
    WAITING_REJOIN,
    find_node_by_mac,
    is_terminal,
    normalize_mac,
    now_ts,
)
from .protobuf.generated import esp_tree_runtime_pb2 as pb

if TYPE_CHECKING:
    from .bridge_v2_client import BridgeV2Manager

logger = logging.getLogger(__name__)

BRIDGE_STATE_LABELS: dict[str, str] = {
    "OTA_STATE_IDLE": "Idle",
    "OTA_STATE_ANNOUNCING": "Waiting for device",
    "OTA_STATE_TRANSFERRING": "Transferring",
    "OTA_STATE_VERIFYING": "Verifying",
    "OTA_STATE_SUCCESS": "Success",
    "OTA_STATE_FAILED": "Failed",
    "OTA_STATE_ABORTED": "Aborted",
}


def _bridge_state_label(enum_name: str) -> str:
    return BRIDGE_STATE_LABELS.get(enum_name, enum_name)


def _read_file_chunk(path: Path, seq: int, chunk_size: int) -> bytes:
    if chunk_size <= 0:
        raise ValueError("bridge reported an invalid chunk size")
    with path.open("rb") as handle:
        handle.seek(seq * chunk_size)
        return handle.read(chunk_size)


def _extract_increment_fields(status: dict[str, Any], updates: dict[str, Any]) -> None:
    for key in ("current_increment", "total_increments", "retransmit_round", "buffer_size_kb"):
        val = status.get(key)
        if val is not None:
            try:
                updates[key] = int(val)
            except (ValueError, TypeError):
                pass


class OTAWorker:
    def __init__(
        self,
        db: Database,
        firmware_store: FirmwareStore,
        rejoin_timeout_s: int,
        transfer_timeout_s: int,
        bridge_manager: BridgeV2Manager | None = None,
    ) -> None:
        self.db = db
        self.firmware_store = firmware_store
        self.rejoin_timeout_s = rejoin_timeout_s
        self.transfer_timeout_s = transfer_timeout_s
        self.bridge_manager = bridge_manager
        # Set by create_app once the compiler exists (the worker is constructed first).
        # Only the bridge-target branch needs it: a remote's image goes over ESP-NOW
        # through the bridge, never through a local ESPHome upload.
        self.compiler: Any | None = None
        self._wake_event = asyncio.Event()
        self._stop_event = asyncio.Event()
        self._task: asyncio.Task | None = None
        self._total_chunks: int | None = None
        self._chunks_sent: int = 0
        self._paused: bool = False
        self._retry_counts: dict[int, int] = {}
        self._dequeue_failure_counts: dict[int, int] = {}
        self._last_percent_10: dict[int, int] = {}
        self._startup_recovered = False

    def start(self) -> None:
        if self._task is None:
            self._task = asyncio.create_task(self._run(), name="ota-worker")

    async def recover_startup(self) -> None:
        await self._recover_startup()
        self._startup_recovered = True

    async def stop(self) -> None:
        self._stop_event.set()
        self._wake_event.set()
        if self._task is not None:
            try:
                await asyncio.wait_for(self._task, timeout=1.0)
            except asyncio.TimeoutError:
                self._task.cancel()
                try:
                    await self._task
                except asyncio.CancelledError:
                    pass

    def wake(self) -> None:
        self._wake_event.set()

    def pause(self) -> None:
        self._paused = True

    def resume(self) -> None:
        self._paused = False
        self._wake_event.set()

    def is_paused(self) -> bool:
        return self._paused

    async def _run(self) -> None:
        logger.info("OTA worker starting, recovering any stale jobs")
        try:
            if not self._startup_recovered:
                await self._recover_startup()
                self._startup_recovered = True
        except Exception as exc:
            logger.exception("OTA worker error during startup recovery: %s", exc)
        logger.info("OTA worker running")
        while not self._stop_event.is_set():
            try:
                job = self.db.active_job()
            except Exception as exc:
                logger.exception("OTA worker error querying active job: %s", exc)
                await asyncio.sleep(1.0)
                continue
            if job and job["status"] in {STARTING, ANNOUNCING, TRANSFERRING, VERIFYING, WAITING_REJOIN}:
                logger.info("OTA worker picked up job id=%s mac=%s status=%s", job["id"], job.get("mac"), job["status"])
                try:
                    await self._process(job)
                except Exception as exc:
                    logger.exception("OTA worker error processing job id=%s: %s", job["id"], exc)
                    self._fail(job["id"], f"OTA worker error: {exc}")
                if not self._paused:
                    await self._dequeue_next()
                continue
            self._wake_event.clear()
            try:
                await asyncio.wait_for(self._wake_event.wait(), timeout=5.0)
            except asyncio.TimeoutError:
                await self._cleanup_expired_files()
            if not self._paused:
                await self._dequeue_next()

    async def _recover_startup(self) -> None:
        if self._stop_event.is_set():
            return
        job = self.db.active_job()
        if job and job["status"] not in {QUEUED}:
            self._fail(job["id"], "add-on restarted, active OTA job could not be recovered")
        from .models import PENDING_CONFIRM
        for stale in self.db.list_jobs_by_status(PENDING_CONFIRM):
            self.firmware_store.delete_file(stale.get("firmware_path"))
            self.db.abort_queued_job(stale["id"])
        if self.db.has_queued_jobs():
            self._paused = True

    async def _dequeue_next(self) -> None:
        next_job = self.db.next_queued_job()
        if not next_job:
            return
        if not self.bridge_manager:
            self._handle_dequeue_failure(next_job, "bridge manager not available")
            self.wake()
            return
        try:
            topology = await self.bridge_manager.topology()
        except Exception:
            self._handle_dequeue_failure(next_job, "bridge unreachable when starting queued job")
            self.wake()
            return
        node = find_node_by_mac(topology, normalize_mac(str(next_job["mac"])))
        logger.info("OTA dequeue: job id=%s mac=%s node_found=%s online=%s",
                    next_job["id"], next_job.get("mac"), node is not None, bool(node.get("online")) if node else False)
        if not node or not bool(node.get("online")):
            self._handle_dequeue_failure(next_job, "device offline when starting queued job")
            self.wake()
            return
        self._dequeue_failure_counts.pop(next_job["id"], None)
        self.db.update_job(next_job["id"], status=STARTING, percent=0, error_msg=None)
        self.db.append_job_event(next_job["id"], "flash_dequeued")
        self.wake()

    def _handle_dequeue_failure(self, job: dict[str, Any], reason: str) -> None:
        job_id = int(job["id"])
        count = self._dequeue_failure_counts.get(job_id, 0) + 1
        if count < 3:
            self._dequeue_failure_counts[job_id] = count
            self.db.update_job(job_id, error_msg=f"{reason} (attempt {count}/3, will retry)")
            self.db.append_job_event(job_id, "dequeue_retry", attempt=count, reason=reason)
            return
        self._dequeue_failure_counts.pop(job_id, None)
        queued_jobs = self.db.queued_jobs()
        if len(queued_jobs) <= 1:
            self._dequeue_failure_counts[job_id] = 3
            self.db.update_job(job_id, error_msg=f"{reason} (retried 3x, waiting for device to come online)")
            self.db.append_job_event(job_id, "dequeue_moved_back", reason=f"{reason} (3 retries, no other jobs)")
            return
        new_order = len(queued_jobs) - 1
        # Assigning queue_order directly does not renumber the others: a job
        # retried when the queue is numbered 10, 11 would land on 1 and stay first
        # forever, so the online job behind it never starts.
        self.db.reorder_queue(job_id, new_order)
        self.db.update_job(job_id, error_msg=f"{reason} (retried 3x, moved to back of queue)")
        self.db.append_job_event(job_id, "dequeue_moved_back", reason=reason)

    async def _process(self, job: dict[str, Any]) -> None:
        current = self.db.get_job(int(job["id"]))
        if not current or is_terminal(current["status"]):
            return
        if current["status"] == WAITING_REJOIN:
            await self._wait_for_rejoin(current)
            return
        path = Path(str(current.get("firmware_path") or ""))
        if not path.exists():
            self._fail(current["id"], "firmware file is missing")
            return
        if self._bridge_row_for_mac(str(current.get("mac") or "")) is not None:
            await self._process_bridge(current, path)
            return
        await self._process_v2(current, path)

    def _bridge_row_for_mac(self, mac: str) -> dict[str, Any] | None:
        """The bridges row this MAC belongs to, when the target IS a bridge itself.

        A bridge cannot relay an image to itself: `ota_start` on the bridge resolves a
        *remote session* for the target MAC and answers "remote not found or offline"
        for its own. So a flash job whose target is a bridge takes the ESPHome-upload
        path instead of the ESP-NOW relay path.
        """
        nm = normalize_mac(mac)
        if not nm:
            return None
        for row in self.db.list_bridges():
            # A superseded bridge record keeps its MAC after the board has been
            # repurposed (or replaced): it is still in the table, just disabled.
            # Matching it would route that device's OTA job down the ESPHome-upload
            # branch against a host that may no longer exist, instead of the
            # ESP-NOW relay it actually needs.
            if not row.get("enabled"):
                continue
            if normalize_mac(str(row.get("mac") or "")) == nm:
                return row
        # list_bridges() hides a bridge that is still provisioning. A flash job can
        # still target it (the placeholder MAC), and treating that as a *remote* is the
        # wrong branch - it must reach the bridge path and be refused with a reason.
        prov = self.db.get_provisioning_bridge()
        if prov and normalize_mac(str(prov.get("mac") or "")) == nm:
            return prov
        return None

    async def _process_bridge(self, job: dict[str, Any], path: Path) -> None:
        current = self.db.get_job(int(job["id"]))
        if not current:
            return
        job_id = int(current["id"])
        bridge = self._bridge_row_for_mac(str(current.get("mac") or "")) or {}
        esphome_name = str(current.get("esphome_name") or bridge.get("name") or "")
        host = str(bridge.get("host") or "").strip()
        transport = str(bridge.get("transport") or "wifi").strip().lower()

        if not esphome_name:
            self._fail(job_id, "bridge has no ESPHome name, so it cannot be rebuilt")
            return
        if transport == "serial":
            self._fail(
                job_id,
                "this bridge is on the serial transport: it has no network to push an "
                "image over. Reflash it over USB from the device page.",
            )
            return
        if int(bridge.get("flash_wizard_pending") or 0) or not host or host in {"0.0.0.0", "::"}:
            self._fail(
                job_id,
                "this bridge has not joined the network yet, so there is nothing to "
                "upload to. Finish the flash wizard first.",
            )
            return
        if self.compiler is None:
            self._fail(job_id, "compiler is not available to the OTA worker")
            return

        initial_uptime_s: float | None = None
        initial_build_date = ""
        try:
            topo = await self.bridge_manager.topology() if self.bridge_manager else []
            node = find_node_by_mac(topo, normalize_mac(str(current.get("mac") or "")))
            if node:
                initial_uptime_s = node.get("uptime_s")
                initial_build_date = str(node.get("firmware_build_date") or "").strip()
        except Exception:
            pass

        self.db.update_job(
            job_id,
            status=TRANSFERRING,
            started_at=now_ts(),
            percent=0,
            error_msg=None,
            bridge_state="Uploading",
        )
        self.db.append_job_event(
            job_id,
            "flash_starting",
            mechanism="esphome_ota",
            host=host,
            current_build_date=initial_build_date,
            md5=str(current.get("firmware_md5") or ""),
        )

        error = await self._ota_upload_with_timeout(
            esphome_name,
            host,
            path,
            str(bridge.get("ota_password") or ""),
        )
        if error:
            # ota_upload already phrases the actionable cause; do not wrap it in a
            # generic "flash failed" that hides which of the three it was.
            self._fail(job_id, error)
            return

        self.db.update_job(job_id, status=WAITING_REJOIN, percent=100, bridge_state="Rebooting")
        self.db.append_job_event(job_id, "flash_rejoin_waiting", mechanism="esphome_ota")
        latest = self.db.get_job(job_id) or current
        # Verify against the artifact we just sent, not against what the device used to
        # report. The old check demanded a *changed* build date, which can never
        # confirm anything (see _wait_for_rejoin), and told the user nothing when it
        # failed. The job already parsed the .ota.bin's own app descriptor
        # (parsed_build_date) and its digest, so matching those is positive proof.
        await self._wait_for_rejoin(
            latest,
            initial_uptime_s=initial_uptime_s,
            expected_build_date=str(latest.get("parsed_build_date") or "").strip() or None,
            expect_changed_build_date=initial_build_date or None,
            expected_md5=str(latest.get("ota_md5") or "").strip() or None,
            verify_bridge_identity=True,
        )

    async def _ota_upload_with_timeout(
        self,
        esphome_name: str,
        host: str,
        path: Path,
        ota_password: str,
    ) -> str | None:
        """Run the upload under the transfer timeout; return the failure reason or None.

        An upload that never returns is the failure mode this guards: the worker would
        hold the single-flash lock forever and every later job would queue behind it.
        """
        try:
            result = await asyncio.wait_for(
                self.compiler.ota_upload(  # type: ignore[union-attr]
                    esphome_name,
                    host,
                    firmware_path=path,
                    ota_password=ota_password,
                ),
                timeout=max(60, int(self.transfer_timeout_s)),
            )
        except asyncio.TimeoutError:
            try:
                await self.compiler.cancel_bridge_ota()  # type: ignore[union-attr]
            except Exception:
                pass
            return "The OTA upload timed out before the bridge accepted the image."
        if result.success:
            return None
        return str(result.error or "OTA upload failed")

    async def _process_v2(self, job: dict[str, Any], path: Path) -> None:
        current = self.db.get_job(int(job["id"]))
        if not current:
            logger.warning("OTA process_v2: job id=%s not found in DB", job["id"])
            return
        job_id = int(current["id"])
        mac = str(current["mac"])
        logger.info("OTA process_v2: job id=%s mac=%s status=%s firmware=%s size=%s",
                     job_id, mac, current["status"], current.get("firmware_path"), current.get("firmware_size"))
        if self.bridge_manager is None:
            logger.error("OTA process_v2: bridge_manager is None for job id=%s", job_id)
            self._fail(current["id"], "bridge manager not available")
            return
        logger.info("OTA process_v2: bridge_manager.connected=%s for job id=%s",
                     self.bridge_manager.connected, job_id)
        if not self.bridge_manager.connected:
            waited = 0
            while not self.bridge_manager.connected and waited < 15:
                logger.info("OTA process_v2: waiting for bridge connection (%d/15) for job id=%s", waited + 1, job_id)
                await asyncio.sleep(1.0)
                waited += 1
            if not self.bridge_manager.connected:
                logger.error("OTA process_v2: bridge not connected after 15s wait for job id=%s", job_id)
                self._fail(current["id"], "bridge protobuf WebSocket not connected")
                return

        try:
            ota_client = self.bridge_manager.ota_client_for_remote(mac)
            logger.info("OTA process_v2: created ota_client for mac=%s job id=%s", mac, job_id)
        except Exception as exc:
            logger.error("OTA process_v2: failed to get ota_client for mac=%s job id=%s: %s", mac, job_id, exc)
            self._fail(current["id"], f"bridge for OTA target is not connected: {exc}")
            return

        terminal_event = asyncio.Event()
        unique_delivered: set[int] = set()
        transfer_started = now_ts()
        last_event_at = now_ts()
        terminal_action: str | None = None
        fired_events: set[str] = set()

        async def on_chunk_request(request: Any) -> None:
            nonlocal last_event_at
            last_event_at = now_ts()
            sequences = [int(seq) for seq in request.sequences]
            logger.info("OTA on_chunk_request: job id=%s sequences=%d progress pct=%d inc=%d/%d",
                        current["id"], len(sequences),
                        _bounded_percent(getattr(request, "progress", None) and request.progress.percent or 0),
                        getattr(request, "progress", None) and request.progress.current_increment or 0,
                        getattr(request, "progress", None) and request.progress.total_increments or 0)
            latest = self.db.get_job(current["id"])
            if not latest or is_terminal(latest["status"]) or self._stop_event.is_set():
                return
            if now_ts() - transfer_started > self.transfer_timeout_s:
                try:
                    await ota_client.abort(reason="timeout")
                except Exception:
                    pass
                self._fail(current["id"], "OTA transfer timed out")
                terminal_event.set()
                return
            sequences = [int(seq) for seq in request.sequences]
            await ota_client.send_chunks(request.request_id, sequences, path)
            unique_delivered.update(sequences)
            progress = request.progress
            self.db.update_job(
                current["id"],
                status=TRANSFERRING,
                bridge_state=_bridge_state_label(pb.OtaState.Name(pb.OTA_STATE_TRANSFERRING)),
                chunks_sent=len(unique_delivered),
                current_increment=int(progress.current_increment),
                total_increments=int(progress.total_increments),
                retransmit_round=int(progress.retransmit_round),
                buffer_size_kb=int(progress.buffer_size_kb),
                percent=_bounded_percent(progress.percent),
            )

        async def on_status(status: Any) -> None:
            nonlocal last_event_at, terminal_action
            last_event_at = now_ts()
            job_id = int(current["id"])
            percent = _bounded_percent(status.percent)
            state_name = pb.OtaState.Name(int(status.state))
            logger.info("OTA on_status: job id=%s state=%s percent=%d error=%s",
                        job_id, state_name, percent, status.error_detail or "")
            updates: dict[str, Any] = {"bridge_state": _bridge_state_label(state_name), "percent": percent}
            if status.error_detail:
                updates["error_msg"] = status.error_detail
            if status.state == pb.OTA_STATE_ANNOUNCING:
                updates["status"] = ANNOUNCING
                self.db.append_job_event(job_id, "flash_announcing")
            elif status.state == pb.OTA_STATE_TRANSFERRING:
                updates["status"] = TRANSFERRING
                last_p10 = self._last_percent_10.get(job_id, 0)
                new_p10 = percent // 10
                if new_p10 > last_p10 and percent > 0:
                    self._last_percent_10[job_id] = new_p10
                    self.db.append_job_event(job_id, "flash_progress", percent=percent, chunks_sent=len(unique_delivered), total_chunks=ota_client.total_chunks)
            elif status.state == pb.OTA_STATE_VERIFYING:
                updates["status"] = VERIFYING
                if "verifying" not in fired_events:
                    fired_events.add("verifying")
                    self.db.append_job_event(job_id, "flash_verifying")
            elif status.state == pb.OTA_STATE_SUCCESS:
                updates["status"] = WAITING_REJOIN
                updates["percent"] = 100
                self.db.append_job_event(job_id, "flash_rejoin_waiting")
                self.db.update_job(current["id"], **updates)
                terminal_action = "rejoin"
                terminal_event.set()
                return
            elif status.state in (pb.OTA_STATE_FAILED, pb.OTA_STATE_ABORTED):
                self._fail(current["id"], status.error_detail or "bridge OTA failed")
                terminal_event.set()
                return
            self.db.update_job(current["id"], **updates)

        async def on_aborted(aborted: Any) -> None:
            logger.warning("OTA on_aborted: job id=%s reason=%s", job_id, aborted.reason or "unknown")
            self._fail(current["id"], f"OTA aborted: {aborted.reason or 'bridge'}")
            terminal_event.set()

        ota_client.set_handlers(on_chunk_request=on_chunk_request, on_status=on_status, on_abort=on_aborted)
        logger.info("OTA process_v2: handlers set for job id=%s", job_id)
        initial_uptime_s: float | None = None
        initial_session_id = ""
        initial_partition_md5 = ""
        if current["status"] == STARTING:
            self._total_chunks = None
            self._chunks_sent = 0
            self._last_percent_10.pop(int(current["id"]), None)
            self.db.update_job(current["id"], started_at=now_ts(), percent=0, error_msg=None)

            current_md5 = ""
            try:
                topo = await self.bridge_manager.topology()
                node = find_node_by_mac(topo, normalize_mac(str(current["mac"])))
                if node:
                    current_md5 = str(node.get("firmware_md5") or "").strip()
                    initial_uptime_s = node.get("uptime_s")
                    initial_session_id = str(node.get("session_id") or "")
                    initial_partition_md5 = current_md5
            except Exception:
                pass
            new_md5 = str(current.get("firmware_md5") or "").strip()
            self.db.append_job_event(int(current["id"]), "flash_starting", current_md5=current_md5, md5=new_md5)
            logger.info("OTA process_v2: calling ota_client.start() for job id=%s mac=%s file_size=%s md5=%s",
                        job_id, mac, current["firmware_size"], new_md5[:8] + "..." if new_md5 else "")
            try:
                accepted = await ota_client.start(
                    target_mac=str(current["mac"]),
                    file_size=int(current["firmware_size"]),
                    md5=str(current["firmware_md5"]),
                    sha256="",
                    filename=Path(current["firmware_path"]).name,
                    preferred_chunk_size=0,
                )
                logger.info("OTA process_v2: ota_client.start() succeeded for job id=%s, total_chunks=%s max_chunk_size=%s",
                            job_id, accepted.total_chunks, accepted.max_chunk_size)
            except Exception as exc:
                msg = str(exc)
                logger.error("OTA process_v2: ota_client.start() FAILED for job id=%s: %s", job_id, msg)
                self.db.append_job_event(int(current["id"]), "flash_start_failed", error=msg)
                retry_count = self._retry_counts.get(current["id"], 0)
                permanent_tags = ["remote_not_found", "ota_busy", "rejected", "md5", "size"]
                if retry_count < 1 and not any(tag in msg.lower() for tag in permanent_tags):
                    self._retry_counts[current["id"]] = retry_count + 1
                    queued = self.db.queued_jobs()
                    self.db.update_job(
                        current["id"],
                        status=QUEUED,
                        queue_order=len(queued),
                        error_msg=f"ota.start retry: {msg}",
                    )
                    self.db.append_job_event(int(current["id"]), "ota_start_retry", reason=msg)
                    ota_client.close()
                    return
                self._retry_counts.pop(current["id"], None)
                self._fail(current["id"], f"ota.start failed: {msg}")
                ota_client.close()
                return
            self.db.update_job(
                current["id"],
                status=TRANSFERRING,
                bridge_state=_bridge_state_label(pb.OtaState.Name(pb.OTA_STATE_TRANSFERRING)),
                total_chunks=int(accepted.total_chunks),
            )
            new_md5 = str(current.get("firmware_md5") or "").strip()
            self.db.append_job_event(int(current["id"]), "flash_transferring", md5=new_md5)

        logger.info("OTA process_v2: entering transfer loop for job id=%s status=%s", job_id, current["status"])
        while not self._stop_event.is_set():
            latest = self.db.get_job(current["id"])
            if not latest or is_terminal(latest["status"]):
                logger.info("OTA process_v2: job id=%s is terminal (status=%s), closing", current["id"], latest["status"] if latest else "gone")
                ota_client.close()
                return

            if now_ts() - transfer_started > self.transfer_timeout_s:
                logger.error("OTA process_v2: transfer timeout for job id=%s after %ds", current["id"], self.transfer_timeout_s)
                try:
                    await ota_client.abort(reason="timeout")
                except Exception:
                    pass
                self._fail(current["id"], "OTA transfer timed out")
                ota_client.close()
                return

            try:
                await asyncio.wait_for(terminal_event.wait(), timeout=5.0)
                logger.info("OTA process_v2: terminal event fired for job id=%s action=%s", current["id"], terminal_action)
                if terminal_action == "rejoin":
                    latest_job = self.db.get_job(current["id"]) or current
                    await self._wait_for_rejoin(
                        latest_job,
                        initial_uptime_s=initial_uptime_s,
                        initial_session_id=initial_session_id,
                        initial_partition_md5=initial_partition_md5,
                    )
                ota_client.close()
                return
            except asyncio.TimeoutError:
                if now_ts() - last_event_at > 60 and latest["status"] in {TRANSFERRING, VERIFYING}:
                    logger.error("OTA process_v2: stalled for job id=%s (no event for %ds, status=%s)",
                                current["id"], now_ts() - last_event_at, latest["status"])
                    try:
                        await ota_client.abort(reason="stalled")
                    except Exception:
                        pass
                    self._fail(current["id"], "OTA transfer stalled")
                    ota_client.close()
                    return

    async def _wait_for_rejoin(
        self,
        job: dict[str, Any],
        *,
        initial_uptime_s: float | None = None,
        expect_changed_build_date: str | None = None,
        expected_build_date: str | None = None,
        expected_md5: str | None = None,
        verify_bridge_identity: bool = False,
        initial_session_id: str = "",
        initial_partition_md5: str = "",
    ) -> None:
        target_mac = normalize_mac(str(job["mac"]))
        deadline = now_ts() + self.rejoin_timeout_s
        job_id = int(job["id"])

        if initial_uptime_s is None:
            try:
                topo = await self.bridge_manager.topology()
                node = find_node_by_mac(topo, target_mac)
                if node:
                    initial_uptime_s = node.get("uptime_s")
            except Exception:
                pass

        while now_ts() <= deadline and not self._stop_event.is_set():
            latest = self.db.get_job(job_id)
            if not latest or is_terminal(latest["status"]):
                return
            try:
                topology = await self.bridge_manager.topology()
            except Exception:
                await asyncio.sleep(3.0)
                continue

            node = find_node_by_mac(topology, target_mac)
            if node and bool(node.get("online")):
                current_uptime = node.get("uptime_s", 0)
                session_changed = bool(
                    initial_session_id and str(node.get("session_id") or "") not in ("", initial_session_id)
                )
                if initial_uptime_s is None or current_uptime < initial_uptime_s or session_changed:
                    self.db.append_job_event(job_id, "flash_rejoined")
                    if verify_bridge_identity:
                        # A bridge used to report only `__DATE__`/`__TIME__` expanded in
                        # its own setup(), i.e. the compile time of ONE translation unit.
                        # The add-on compiles into a persistent build tree, so a rebuild
                        # from unchanged sources booted with the same string, and this
                        # check - which demanded a *changed* date - reported a real
                        # reflash as a failure while an absent baseline read as success.
                        #
                        # The bridge now reports the same ESP-IDF app descriptor fields
                        # the add-on parses out of the .ota.bin (see app/bin_parser.py)
                        # plus the MD5 of its running partition. So the check is no
                        # longer "did something change" but "is the device running the
                        # artifact we sent", which is the only claim worth a green tick.
                        actual_build_date = str(node.get("firmware_build_date") or "").strip()
                        actual_md5 = str(node.get("firmware_md5") or "").strip().lower()
                        expected_date = (expected_build_date or "").strip()
                        expected_digest = (expected_md5 or "").strip().lower()
                        previous_date = (expect_changed_build_date or "").strip()

                        # An MD5 match is conclusive; a build-date match is strong but a
                        # rebuild of identical sources can share a date with the image
                        # already running, so it only confirms when the date actually
                        # moved or no digest was available to compare.
                        if expected_digest and actual_md5 and actual_md5 == expected_digest:
                            self.db.append_job_event(
                                job_id,
                                "flash_identity_confirmed",
                                method="md5",
                                expected_build_date=expected_date,
                                actual_build_date=actual_build_date,
                                actual_md5=actual_md5,
                            )
                            self._finish(job_id, SUCCESS)
                            return
                        if expected_date and actual_build_date == expected_date:
                            # Same date as the artifact. Only proof of a reflash if it
                            # differs from what the device ran before the upload.
                            if not previous_date or previous_date != actual_build_date or not expected_digest:
                                self.db.append_job_event(
                                    job_id,
                                    "flash_identity_confirmed",
                                    method="build_date",
                                    expected_build_date=expected_date,
                                    actual_build_date=actual_build_date,
                                    actual_md5=actual_md5,
                                )
                                self._finish(job_id, SUCCESS)
                                return
                        reason, message = _bridge_identity_unverified(
                            expected_date, actual_build_date, actual_md5, previous_date
                        )
                        self.db.append_job_event(
                            job_id,
                            "flash_identity_unverified",
                            expected_build_date=expected_date,
                            actual_build_date=actual_build_date,
                            actual_md5=actual_md5,
                            reason=reason,
                        )
                        self._finish(job_id, REJOINED_UNVERIFIED, message)
                        return
                    latest_job = self.db.get_job(job_id) or job
                    # The remote reports the running partition digest, not the OTA file
                    # digest. A changed partition digest proves a changed image; an
                    # unchanged one on a rejoin means it rebooted onto the old image,
                    # unless this exact artifact was already flashed successfully.
                    before = initial_partition_md5.strip().lower()
                    after = str(node.get("firmware_md5") or "").strip().lower()
                    if before and after and before == after and set(after) != {"0"}:
                        wanted = str(latest_job.get("firmware_md5") or "").strip().lower()
                        if not self._same_as_last_success(latest_job, wanted):
                            self.db.append_job_event(job_id, "flash_image_unchanged", partition_md5=after)
                            self._finish(
                                job_id, FAILED,
                                "device rejoined but its running image did not change "
                                f"(partition md5 {after[:8]}) - the new firmware was not applied",
                            )
                            return
                    expected_version = (latest_job.get("parsed_version") or "").strip()
                    actual_version = (node.get("firmware_version") or "").strip()
                    if expected_version and actual_version:
                        if actual_version == expected_version:
                            self._finish(job["id"], SUCCESS)
                        else:
                            self.db.append_job_event(
                                job_id,
                                "flash_version_mismatch",
                                expected_version=expected_version,
                                actual_version=actual_version,
                            )
                            self._finish(
                                job["id"],
                                VERSION_MISMATCH,
                                "firmware version mismatch after rejoin — device may not have updated",
                            )
                        return
                    self._finish(job["id"], SUCCESS)
                    return

            await asyncio.sleep(3.0)

        self.db.append_job_event(job_id, "flash_rejoin_timeout", timeout_s=self.rejoin_timeout_s)
        self._finish(job["id"], REJOIN_TIMEOUT, "bridge transfer succeeded but the device did not rejoin before timeout")

    def _same_as_last_success(self, job: dict[str, Any], wanted_md5: str) -> bool:
        if not wanted_md5:
            return False
        try:
            history = self.db.list_history(mac=str(job["mac"]), limit=50)
        except Exception:
            return False
        for prior in history:
            if int(prior["id"]) == int(job["id"]):
                continue
            if prior.get("status") == SUCCESS:
                return str(prior.get("firmware_md5") or "").strip().lower() == wanted_md5
        return False

    def _finish(self, job_id: int, status: str, error_msg: str | None = None) -> None:
        job = self.db.get_job(job_id)
        if not job:
            return
        retained_path, retained_until = self.firmware_store.retain(job.get("firmware_path"), job_id)
        self.db.update_job(job_id, firmware_path=retained_path, retained_until=retained_until)
        if status == SUCCESS:
            elapsed = None
            if job.get("started_at"):
                elapsed = now_ts() - int(job["started_at"])
            self.db.append_job_event(job_id, "flash_success", duration_s=elapsed)
        elif status != REJOINED_UNVERIFIED:
            # An unverified rejoin already logged `flash_identity_unverified` with the
            # dates either side of the upload; "Flash failed" here would contradict it.
            self.db.append_job_event(job_id, "flash_failed", error=error_msg or status)
        self.db.mark_terminal(job_id, status, error_msg=error_msg, percent=100 if status == SUCCESS else job.get("percent"))

    def _fail(self, job_id: int, message: str) -> None:
        self._finish(job_id, FAILED, message)

    async def _cleanup_expired_files(self) -> None:
        for job in self.db.expired_retained():
            self.firmware_store.delete_file(job.get("firmware_path"))
            self.db.clear_job_firmware(int(job["id"]))


def _bridge_identity_unverified(
    expected: str,
    actual: str,
    actual_md5: str = "",
    previous: str = "",
) -> tuple[str, str]:
    """Why a bridge's post-reboot identity could not settle what it booted.

    Returns (short reason for the event log, sentence for the job's message). Each
    case is a different missing fact, so each gets its own wording rather than one
    blanket "mismatch": an absent report is not evidence of a failed upload, and a
    device still running the old image is.
    """
    if not actual and not actual_md5:
        return (
            "no build date reported",
            "bridge rejoined without reporting a build date or firmware MD5, so the "
            "image it booted could not be confirmed - this bridge firmware predates "
            "the change; reflash it once over USB to enable verification",
        )
    if not expected:
        return (
            "no artifact build date",
            "the uploaded image carried no build date to compare against, so the image "
            "the bridge booted could not be confirmed",
        )
    if previous and actual == previous:
        return (
            "device still reports its previous build",
            "bridge rejoined still reporting the build it ran before the upload, so the "
            "new image did not take effect",
        )
    return (
        "reported build does not match the uploaded image",
        "bridge rejoined running "
        f"{actual or 'an unidentified build'} but {expected} was uploaded, so the image "
        "it booted could not be confirmed",
    )


def _bounded_percent(value: Any) -> int:
    try:
        percent = int(value)
    except (TypeError, ValueError):
        return 0
    return max(0, min(100, percent))
