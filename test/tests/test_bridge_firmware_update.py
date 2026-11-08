"""Bridge in-place firmware update: routing, refusals and post-flash verification.

The property under test is that a flash job whose target is a *bridge* takes the
ESPHome-OTA branch (a bridge cannot relay an image to itself), keeps the per-bridge
OTA password rather than the shared secrets.yaml one, and is refused with an
actionable reason when the bridge cannot take an over-the-air image at all.

Each Database init runs ~20 migrations and costs seconds on this filesystem, so the
cases that need one share it rather than paying that per assertion.
"""

from __future__ import annotations

from pathlib import Path
from types import SimpleNamespace
from typing import Any
import asyncio

import pytest

from app import models


class DummyFirmwareStore:
    def retain(self, path, job_id):  # noqa: ANN001 - test double
        return path, None

    def delete_file(self, path):  # noqa: ANN001 - test double
        return None


def _worker(tmp_path: Path, *, compiler: Any = None, bridge_manager: Any = None):
    from app.db import Database
    from app.ota_worker import OTAWorker

    db = Database(tmp_path / "esp_tree.db")
    db.init()
    worker = OTAWorker(
        db=db,
        firmware_store=DummyFirmwareStore(),
        rejoin_timeout_s=1,
        transfer_timeout_s=1,
        bridge_manager=bridge_manager or SimpleNamespace(),
    )
    worker.compiler = compiler
    return worker, db


def _bridge_row(db, *, host="10.1.1.150", mac="11:22:33:44:55:66", transport="wifi", ota_password="s3cret"):
    return db.add_bridge(
        host=host,
        port=80,
        name="esptree-bridge",
        api_key="key",
        mac=mac,
        transport=transport,
        ota_password=ota_password,
    )


def _flash_job(
    db,
    tmp_path: Path,
    *,
    mac="11:22:33:44:55:66",
    esphome_name="esptree-bridge",
    parsed_build_date: str | None = None,
    ota_md5: str | None = None,
):
    """A flash job for an artifact with the given identity.

    `parsed_build_date`/`ota_md5` are what the add-on read out of the .ota.bin it is
    about to send - the facts a post-reboot check has to compare against.
    """
    firmware = tmp_path / f"{mac.replace(':', '')}.ota.bin"
    firmware.write_bytes(b"image")
    job = db.create_job(
        {
            "mac": mac,
            "status": models.STARTING,
            "firmware_path": str(firmware),
            "esphome_name": esphome_name,
            "parsed_build_date": parsed_build_date,
            "ota_md5": ota_md5,
        }
    )
    return job, firmware


def _events(job: dict[str, Any]) -> list[dict[str, Any]]:
    import json

    raw = job.get("log_events") or []
    return json.loads(raw) if isinstance(raw, str) else list(raw)


# ── routing ────────────────────────────────────────────────────────────────


@pytest.mark.asyncio
async def test_flash_job_routes_by_target_type(tmp_path: Path, monkeypatch) -> None:
    worker, db = _worker(tmp_path)
    _bridge_row(db)
    bridge_job, bridge_image = _flash_job(db, tmp_path)
    remote_job, remote_image = _flash_job(db, tmp_path, mac="AA:BB:CC:DD:EE:01", esphome_name="leaf")
    seen: dict[str, object] = {}

    async def fake_bridge(proc_job, path):  # noqa: ANN001
        seen["bridge"] = (proc_job["id"], str(path))

    async def fake_remote(proc_job, path):  # noqa: ANN001
        seen["remote"] = (proc_job["id"], str(path))

    monkeypatch.setattr(worker, "_process_bridge", fake_bridge)
    monkeypatch.setattr(worker, "_process_v2", fake_remote)

    await worker._process(bridge_job)
    await worker._process(remote_job)

    assert seen["bridge"] == (bridge_job["id"], str(bridge_image))
    assert seen["remote"] == (remote_job["id"], str(remote_image))


@pytest.mark.asyncio
async def test_a_repurposed_board_is_not_its_old_bridge_record(tmp_path: Path, monkeypatch) -> None:
    """A superseded bridge row keeps its MAC, but must not keep the bridge route.

    Provisioning a new bridge disables the old row instead of deleting it, so the
    table can hold a *disabled* bridge record for a board that now runs remote
    firmware. Routing by MAC alone sent that leaf's OTA job down the ESPHome-upload
    branch, pointed at the dead bridge host, where it failed at config load because
    a leaf's YAML has no `ota:` block.
    """
    worker, db = _worker(tmp_path)
    _bridge_row(db, mac="11:22:33:44:55:66", host="10.1.1.147")
    _bridge_row(db, mac="AA:BB:CC:DD:EE:02", host="10.1.1.165")  # supersedes the first

    assert worker._bridge_row_for_mac("11:22:33:44:55:66") is None
    assert worker._bridge_row_for_mac("AA:BB:CC:DD:EE:02") is not None

    leaf_job, leaf_image = _flash_job(db, tmp_path, mac="11:22:33:44:55:66", esphome_name="esp32")
    seen: list[str] = []

    async def fake_bridge(proc_job, path):  # noqa: ANN001
        seen.append("bridge")

    async def fake_remote(proc_job, path):  # noqa: ANN001
        seen.append("remote")

    monkeypatch.setattr(worker, "_process_bridge", fake_bridge)
    monkeypatch.setattr(worker, "_process_v2", fake_remote)

    await worker._process(leaf_job)

    assert seen == ["remote"]


# ── the transfer itself ────────────────────────────────────────────────────


class FakeCompiler:
    def __init__(self, *, success: bool = True, error: str | None = None) -> None:
        self.calls: list[dict[str, object]] = []
        self._success = success
        self._error = error

    async def ota_upload(self, esphome_name, host, *, firmware_path=None, ota_password=""):
        self.calls.append(
            {
                "esphome_name": esphome_name,
                "host": host,
                "firmware_path": str(firmware_path),
                "ota_password": ota_password,
            }
        )
        return SimpleNamespace(success=self._success, error=self._error)


class RejoiningBridgeManager:
    """Topology that reports the bridge back online, then hands out values in order.

    The first read is what the worker records before the upload; subsequent reads are
    what the bridge reports after its reboot - a *lower* uptime (it restarted) and a
    different build date.
    """

    def __init__(
        self,
        *build_dates: str,
        uptimes: tuple[int, ...] = (500, 5),
        mac: str = "11:22:33:44:55:66",
        md5: str = "",
    ) -> None:
        self._build_dates = list(build_dates)
        self._uptimes = list(uptimes)
        self._mac = mac
        self._md5 = md5
        self.calls = 0

    async def topology(self):
        index = self.calls
        self.calls += 1
        build_date = self._build_dates[min(index, len(self._build_dates) - 1)]
        uptime = self._uptimes[min(index, len(self._uptimes) - 1)]
        return [
            {
                "mac": self._mac,
                "online": True,
                "is_bridge": True,
                "uptime_s": uptime,
                "firmware_build_date": build_date,
                "firmware_md5": self._md5,
            }
        ]


@pytest.mark.asyncio
async def test_bridge_update_uses_stored_password_and_verifies_the_new_build(tmp_path: Path) -> None:
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("Nov 6 2026 13:00:00", "Nov 6 2026 14:02:11")
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db, ota_password="per-bridge-secret")
    # The bridge comes back reporting exactly the build the artifact declares, which
    # is what confirms the upload landed.
    job, firmware = _flash_job(db, tmp_path, parsed_build_date="Nov 6 2026 14:02:11")

    await worker._process_bridge(job, firmware)

    assert len(compiler.calls) == 1
    call = compiler.calls[0]
    assert call["esphome_name"] == "esptree-bridge"
    assert call["host"] == "10.1.1.150"
    # The password on the bridge row wins over secrets.yaml: provisioning another
    # bridge overwrites the shared key, and this device only accepts its own.
    assert call["ota_password"] == "per-bridge-secret"
    assert call["firmware_path"] == str(firmware)

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.SUCCESS
    events = completed.get("log_events") or []
    if isinstance(events, str):
        import json

        events = json.loads(events)
    assert any(event.get("type") == "flash_starting" for event in events)
    assert any(event.get("type") == "flash_rejoined" for event in events)


@pytest.mark.asyncio
async def test_a_reported_build_matching_the_artifact_confirms_the_flash(tmp_path: Path) -> None:
    """The device running the build we sent is the only claim worth a green tick.

    The previous check demanded the reported date be *different* from the one recorded
    before the upload, which cannot distinguish a real reflash from an image rebuilt
    from unchanged sources (the add-on compiles into a persistent build tree, and a
    bridge reported `__DATE__`/`__TIME__` from one translation unit). Comparing against
    the artifact's own descriptor is positive evidence instead.
    """
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("Nov 6 2026 14:02:11", uptimes=(5,))
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db)
    job, _firmware = _flash_job(db, tmp_path, parsed_build_date="Nov 6 2026 14:02:11")

    await worker._wait_for_rejoin(
        db.get_job(job["id"]) or job,
        initial_uptime_s=100,
        expected_build_date="Nov 6 2026 14:02:11",
        expect_changed_build_date="Nov 6 2026 13:00:00",
        verify_bridge_identity=True,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.SUCCESS
    events = _events(completed)
    confirmed = next(event for event in events if event.get("type") == "flash_identity_confirmed")
    assert confirmed["method"] == "build_date"
    assert confirmed["actual_build_date"] == "Nov 6 2026 14:02:11"


@pytest.mark.asyncio
async def test_a_reported_md5_matching_the_artifact_confirms_even_with_a_stale_date(tmp_path: Path) -> None:
    """The partition digest is conclusive where a date is only strong.

    A rebuild of identical sources can legitimately share a build date with the image
    already running, so the date alone cannot always prove a reflash. The MD5 of the
    running partition can.
    """
    digest = "0123456789abcdef0123456789abcdef"
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("Nov 6 2026 13:00:00", uptimes=(5,), md5=digest.upper())
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db)
    job, _firmware = _flash_job(db, tmp_path, parsed_build_date="Nov 6 2026 13:00:00", ota_md5=digest)

    await worker._wait_for_rejoin(
        db.get_job(job["id"]) or job,
        initial_uptime_s=100,
        expected_build_date="Nov 6 2026 13:00:00",
        expect_changed_build_date="Nov 6 2026 13:00:00",
        expected_md5=digest,
        verify_bridge_identity=True,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.SUCCESS
    confirmed = next(
        event for event in _events(completed) if event.get("type") == "flash_identity_confirmed"
    )
    assert confirmed["method"] == "md5"


@pytest.mark.asyncio
async def test_a_bridge_still_reporting_its_previous_build_is_unverified(tmp_path: Path) -> None:
    """The upload did not land: say so plainly instead of a vague "unconfirmed".

    This is the one genuinely diagnostic case, and it must stay amber rather than
    red — the transfer leg succeeded, the device simply booted the old image.
    """
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("Nov 6 2026 13:00:00", uptimes=(5,))
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db)
    job, _firmware = _flash_job(db, tmp_path, parsed_build_date="Nov 6 2026 14:02:11")

    await worker._wait_for_rejoin(
        db.get_job(job["id"]) or job,
        initial_uptime_s=100,
        expected_build_date="Nov 6 2026 14:02:11",
        expect_changed_build_date="Nov 6 2026 13:00:00",
        verify_bridge_identity=True,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.REJOINED_UNVERIFIED
    assert models.is_terminal(completed["status"])
    events = _events(completed)
    types = [event.get("type") for event in events]
    unverified = next(event for event in events if event.get("type") == "flash_identity_unverified")
    assert unverified["reason"] == "device still reports its previous build"
    assert unverified["expected_build_date"] == "Nov 6 2026 14:02:11"
    assert unverified["actual_build_date"] == "Nov 6 2026 13:00:00"
    # An amber outcome must not also log a red "flash failed" line.
    assert "flash_failed" not in types
    assert "flash_version_mismatch" not in types


@pytest.mark.asyncio
async def test_a_bridge_that_reports_no_identity_is_unverified_and_says_why(tmp_path: Path) -> None:
    """Old bridge firmware reports nothing; that is not evidence the upload failed.

    It used to fall through to SUCCESS when no baseline existed, i.e. an unverified
    flash was reported as a success.
    """
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("", uptimes=(5,), md5="")
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db)
    job, _firmware = _flash_job(db, tmp_path, parsed_build_date="Nov 6 2026 14:02:11")

    await worker._wait_for_rejoin(
        db.get_job(job["id"]) or job,
        initial_uptime_s=100,
        expected_build_date="Nov 6 2026 14:02:11",
        expect_changed_build_date=None,
        verify_bridge_identity=True,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.REJOINED_UNVERIFIED
    unverified = next(event for event in _events(completed) if event.get("type") == "flash_identity_unverified")
    assert unverified["expected_build_date"] == "Nov 6 2026 14:02:11"
    assert unverified["actual_build_date"] == ""
    assert unverified["reason"] == "no build date reported"
    # The message must point at the remedy, not just shrug.
    assert "reflash it once over USB" in (completed["error_msg"] or "")


@pytest.mark.asyncio
async def test_a_flash_with_no_artifact_build_date_is_unverified(tmp_path: Path) -> None:
    """No artifact descriptor is no evidence either.

    A project-less or metadata-stripped image yields no build date to compare, so
    nothing about the upload can be confirmed.
    """
    compiler = FakeCompiler()
    manager = RejoiningBridgeManager("Nov 6 2026 13:00:00", uptimes=(5,))
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=manager)
    _bridge_row(db)
    job, _firmware = _flash_job(db, tmp_path, parsed_build_date=None)

    await worker._wait_for_rejoin(
        db.get_job(job["id"]) or job,
        initial_uptime_s=100,
        expected_build_date=None,
        expect_changed_build_date=None,
        verify_bridge_identity=True,
    )

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.REJOINED_UNVERIFIED
    unverified = next(event for event in _events(completed) if event.get("type") == "flash_identity_unverified")
    assert unverified["reason"] == "no artifact build date"


@pytest.mark.asyncio
async def test_bridge_update_failure_keeps_the_compilers_reason(tmp_path: Path) -> None:
    compiler = FakeCompiler(success=False, error="The bridge rejected the OTA password.")
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=RejoiningBridgeManager("x"))
    _bridge_row(db)
    job, firmware = _flash_job(db, tmp_path)

    await worker._process_bridge(job, firmware)

    completed = db.get_job(job["id"])
    assert completed is not None
    assert completed["status"] == models.FAILED
    # Wrapping this in "flash failed" would hide which of the three causes it was.
    assert completed["error_msg"] == "The bridge rejected the OTA password."


@pytest.mark.asyncio
async def test_bridge_updates_are_refused_with_an_actionable_reason(tmp_path: Path) -> None:
    compiler = FakeCompiler()
    worker, db = _worker(tmp_path, compiler=compiler, bridge_manager=RejoiningBridgeManager("x"))
    _bridge_row(db, mac="11:22:33:44:55:01")
    _bridge_row(db, mac="11:22:33:44:55:02", transport="serial", host="0.0.0.0")
    db.add_bridge(
        host="0.0.0.0",
        port=0,
        name="esptree-bridge",
        mac="FF:FF:FF:FF:FF:FF",
        flash_wizard_pending=1,
        enabled=0,
    )
    serial_job, serial_image = _flash_job(db, tmp_path, mac="11:22:33:44:55:02")
    provisioning_job, provisioning_image = _flash_job(db, tmp_path, mac="FF:FF:FF:FF:FF:FF")

    # A provisioning bridge is a *bridge* target even though list_bridges() hides it:
    # treating the placeholder MAC as a remote would send the image over ESP-NOW.
    assert worker._bridge_row_for_mac("FF:FF:FF:FF:FF:FF") is not None

    await worker._process_bridge(serial_job, serial_image)
    await worker._process_bridge(provisioning_job, provisioning_image)

    serial_done = db.get_job(serial_job["id"])
    provisioning_done = db.get_job(provisioning_job["id"])
    assert serial_done is not None and provisioning_done is not None
    assert serial_done["status"] == models.FAILED
    assert "USB" in (serial_done["error_msg"] or "")
    assert provisioning_done["status"] == models.FAILED
    assert "not joined the network" in (provisioning_done["error_msg"] or "")
    assert compiler.calls == []


# ── compiler helpers ──────────────────────────────────────────────────────


def _compiler(tmp_path: Path):
    from app.compile_store import CompileStore
    from app.compiler import ESPHomeCompiler

    devices = tmp_path / "devices"
    (devices / "esptree-bridge").mkdir(parents=True, exist_ok=True)
    (devices / "secrets.yaml").write_text(
        'wifi_ssid: "home"\nota_password: "shared-secret"\n', encoding="utf-8"
    )
    return ESPHomeCompiler(
        compile_store=CompileStore(devices),
        devices_root=devices,
        components_root=tmp_path / "components",
        platformio_cache=tmp_path / "pio",
    )


def test_staged_secrets_swap_only_the_ota_password(tmp_path: Path) -> None:
    compiler = _compiler(tmp_path)
    staged = compiler._stage_ota_secrets("esptree-bridge", "per-bridge-secret")
    assert staged is not None
    text = staged.read_text(encoding="utf-8")
    assert 'ota_password: "per-bridge-secret"' in text
    assert "shared-secret" not in text
    # Unrelated secrets must survive: ESPHome refuses to load a config whose !secret
    # references have no value.
    assert 'wifi_ssid: "home"' in text

    # With no per-bridge password on record the shared one is what gets used.
    staged_again = compiler._stage_ota_secrets("esptree-bridge", "")
    assert staged_again is not None
    assert 'ota_password: "shared-secret"' in staged_again.read_text(encoding="utf-8")


def test_ota_upload_refuses_before_starting_a_process(tmp_path: Path) -> None:
    compiler = _compiler(tmp_path)

    no_host = asyncio.run(compiler.ota_upload("esptree-bridge", ""))
    assert no_host.success is False
    assert "no bridge host" in (no_host.error or "")

    no_config = asyncio.run(compiler.ota_upload("missing-bridge", "10.0.0.5"))
    assert no_config.success is False
    assert "No stored ESPHome config" in (no_config.error or "")

    # A stored config with no compiled artefact must not shell out either.
    (compiler.devices_root / "esptree-bridge" / "esptree-bridge.yaml").write_text(
        "esphome:\n  name: esptree-bridge\n", encoding="utf-8"
    )
    no_binary = asyncio.run(compiler.ota_upload("esptree-bridge", "10.0.0.5"))
    assert no_binary.success is False
    assert "No compiled OTA image" in (no_binary.error or "")


@pytest.mark.parametrize(
    ("log", "expected"),
    [
        ("Invalid password", "OTA password"),
        ("ConnectionRefusedError: [Errno 111] Connection refused", "OTA port"),
        ("Timed out waiting for response", "did not answer"),
        ("Cannot upload Over the Air as the ota configuration is not present", "no `ota:` block"),
        ("Could not find secret 'ota_password'", "no OTA password is on record"),
    ],
)
def test_ota_failure_reason_names_the_cause(log: str, expected: str) -> None:
    from app.compiler import _ota_failure_reason

    assert expected in _ota_failure_reason(1, log)


# ── storage ───────────────────────────────────────────────────────────────


def test_ota_password_survives_the_bridges_table(tmp_path: Path) -> None:
    _worker_result, db = _worker(tmp_path)
    created = _bridge_row(db, ota_password="alpha")
    assert created["ota_password"] == "alpha"
    assert db.update_bridge(created["uuid"], ota_password="beta")["ota_password"] == "beta"
    # Default for rows that predate the column: empty, not NULL, so callers can treat
    # "no password on record" as a plain falsy value.
    plain = db.add_bridge(host="10.0.0.9", port=80, name="other")
    assert plain["ota_password"] == ""


# ── update policy (app/bridge_firmware.py) ────────────────────────────────


def test_update_blocker_names_the_route_that_works() -> None:
    from app.bridge_firmware import update_blocker

    ok = {"name": "esptree-bridge", "host": "10.1.1.150", "transport": "wifi"}
    assert update_blocker(ok, has_config=True) is None

    assert "no ESPHome name" in (update_blocker({"host": "10.0.0.1"}, has_config=True) or "")
    assert "no stored ESPHome config" in (update_blocker(ok, has_config=False) or "")
    assert "USB" in (update_blocker({**ok, "transport": "serial"}, has_config=True) or "")
    assert "not joined the network" in (
        update_blocker({**ok, "host": "0.0.0.0"}, has_config=True) or ""
    )
    assert "still provisioning" in (
        update_blocker({**ok, "flash_wizard_pending": 1}, has_config=True) or ""
    )


@pytest.mark.asyncio
async def test_ota_probe_sees_a_listener_and_remembers_it() -> None:
    from app.bridge_firmware import OtaPortProbe

    server = await asyncio.start_server(lambda r, w: w.close(), "127.0.0.1", 0)
    port = server.sockets[0].getsockname()[1]
    probe = OtaPortProbe(ttl_s=60.0, timeout_s=1.0)
    try:
        assert await probe.is_open("127.0.0.1", port) is True
    finally:
        server.close()
        await server.wait_closed()

    # Cached: the listener is gone but the answer is not re-probed until it expires.
    assert await probe.is_open("127.0.0.1", port) is True
    probe.forget("127.0.0.1")
    assert await probe.is_open("127.0.0.1", port) is False
    # A placeholder host is never dialled - it would just burn the timeout.
    assert await probe.is_open("0.0.0.0", 3232) is False


@pytest.mark.asyncio
async def test_ota_upload_invokes_esphome_with_the_verified_cli_contract(tmp_path: Path, monkeypatch) -> None:
    """Pins the ESPHome CLI surface the upload depends on.

    Verified against esphome 2026.6.5 (`__main__.py`): `upload` takes
    `--device <host>`, `--file <binary>` and `--ota-platform esphome`; the password is
    read from the config's `ota:` block after `!secret` resolution.
    """
    compiler = _compiler(tmp_path)
    device_dir = compiler.devices_root / "esptree-bridge"
    (device_dir / "esptree-bridge.yaml").write_text(
        "esphome:\n  name: esptree-bridge\nota:\n  - platform: esphome\n    password: !secret ota_password\n",
        encoding="utf-8",
    )
    binary = device_dir / "esptree-bridge.ota.bin"
    binary.write_bytes(b"\xe9image")

    captured: dict[str, object] = {}

    class FakeStream:
        def __init__(self, lines: list[str]) -> None:
            self._lines = [(line + "\n").encode() for line in lines]

        async def readline(self) -> bytes:
            return self._lines.pop(0) if self._lines else b""

    class FakeProc:
        returncode = 0

        def __init__(self) -> None:
            self.stdout = FakeStream(["INFO Successfully uploaded program."])

        async def wait(self) -> int:
            return 0

    async def fake_exec(*args, **kwargs):  # noqa: ANN001
        captured["args"] = [str(a) for a in args]
        captured["env"] = kwargs.get("env") or {}
        return FakeProc()

    async def no_bootstrap(log_path):  # noqa: ANN001
        return None

    monkeypatch.setattr(compiler, "_ensure_esphome", no_bootstrap)
    monkeypatch.setattr(asyncio, "create_subprocess_exec", fake_exec)

    result = await compiler.ota_upload(
        "esptree-bridge", "10.1.1.150", firmware_path=binary, ota_password="per-bridge-secret"
    )

    assert result.success is True
    args = captured["args"]
    assert args[1] == "upload"
    assert str(device_dir / "esptree-bridge.yaml") in args
    assert "--device" in args and args[args.index("--device") + 1] == "10.1.1.150"
    assert "--file" in args and args[args.index("--file") + 1] == str(binary)
    assert "--ota-platform" in args and args[args.index("--ota-platform") + 1] == "esphome"
    # The staged secrets carried the per-bridge password and must not survive the run.
    assert not (device_dir / "secrets.yaml").exists()
    status = compiler.bridge_ota_status("esptree-bridge")
    assert status["status"] == "success"
    assert status["uploaded_bytes"] == len(b"\xe9image")


# ── the digest a flash is checked against ──────────────────────────────────


def test_ota_md5_is_the_ota_image_digest_not_the_merged_bin(tmp_path: Path) -> None:
    """The two digests cover different bytes and must not be conflated.

    `firmware_md5` is taken over the merged full-flash image, but a device reports the
    digest of its app partition after booting the .ota.bin. Comparing the merged
    digest against a device reading can never match, which is why the flash job
    records the .ota.bin digest separately.
    """
    import hashlib

    from app.db import Database

    db = Database(tmp_path / "esp_tree.db")
    db.init()

    ota_bytes = b"\xe9ota-image-bytes"
    merged_bytes = b"\xe9merged-factory-image-with-bootloader-and-partitions"
    ota_path = tmp_path / "firmware.ota.bin"
    merged_path = tmp_path / "firmware.bin"
    ota_path.write_bytes(ota_bytes)
    merged_path.write_bytes(merged_bytes)

    ota_md5 = hashlib.md5(ota_bytes).hexdigest()
    merged_md5 = hashlib.md5(merged_bytes).hexdigest()
    assert ota_md5 != merged_md5

    job = db.create_job(
        {
            "mac": "11:22:33:44:55:66",
            "status": models.STARTING,
            "firmware_path": str(merged_path),
            "firmware_md5": merged_md5,
            "ota_md5": ota_md5,
            "parsed_build_date": "Nov 6 2026 14:02:11",
        }
    )

    stored = db.get_job(job["id"])
    assert stored is not None
    # Both survive, so the preflight/download paths keep the merged digest while the
    # rejoin check has the comparable one.
    assert stored["firmware_md5"] == merged_md5
    assert stored["ota_md5"] == ota_md5


def test_migration_21_adds_ota_md5_to_an_existing_jobs_table(tmp_path: Path) -> None:
    """An upgraded install gains the column instead of failing on an unknown field."""
    from app.db import Database

    db = Database(tmp_path / "esp_tree.db")
    db.init()

    import sqlite3

    conn = sqlite3.connect(tmp_path / "esp_tree.db")
    try:
        columns = {row[1] for row in conn.execute("PRAGMA table_info(ota_jobs)")}
    finally:
        conn.close()
    assert "ota_md5" in columns
