"""Regressions for bridge state, queue ordering and firmware-artifact ownership.

These cover the long-uptime failures: two bridges enabled at once, "last seen"
that never aged, a browser stream that grew without limit, a flash job that
consumed the compile job's binary, compile artefacts that never expired, and a
cancel that lost to an in-flight compile.
"""
from __future__ import annotations

import asyncio
import json
import time
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.bridge_v2_client import BridgeV2Manager, TopologyBroadcast
from app.compile_worker import CompileWorker
from app.db import Database, migration_019_single_enabled_bridge
from app.firmware_store import FirmwareStore
from app.models import COMPILE_SUCCESS, COMPILING, FAILED, QUEUED
from app.yaml_store import YAMLStore

BRIDGE = "F4:2D:C9:58:33:10"
REMOTE = "E8:3D:C1:9D:6C:D0"


@pytest.fixture()
def db(tmp_path: Path) -> Database:
    database = Database(tmp_path / "esp_tree.db")
    database.init()
    return database


def test_activating_a_bridge_deactivates_the_previous_one(db: Database) -> None:
    first = db.add_bridge("10.0.0.1", 80, api_key="k1")
    second = db.add_bridge("10.0.0.2", 80, api_key="k2")
    assert db.get_active_bridge()["uuid"] == second["uuid"]
    assert [r["uuid"] for r in db.list_all_bridges() if r["enabled"]] == [second["uuid"]]

    db.set_active_bridge(first["uuid"])

    assert db.get_active_bridge()["uuid"] == first["uuid"]
    assert [r["uuid"] for r in db.list_all_bridges() if r["enabled"]] == [first["uuid"]]


def test_migration_collapses_legacy_multi_enabled_bridges(db: Database) -> None:
    first = db.add_bridge("10.0.0.1", 80, api_key="k1")
    second = db.add_bridge("10.0.0.2", 80, api_key="k2")
    with db.connect() as conn:
        conn.execute("DROP INDEX IF EXISTS idx_bridges_single_enabled")
        conn.execute("UPDATE bridges SET enabled = 1")
        assert conn.execute("SELECT COUNT(*) FROM bridges WHERE enabled = 1").fetchone()[0] == 2

        migration_019_single_enabled_bridge(conn)

        enabled = [dict(r) for r in conn.execute("SELECT uuid FROM bridges WHERE enabled = 1")]
    assert len(enabled) == 1
    assert enabled[0]["uuid"] == second["uuid"]
    with db.connect() as conn:
        with pytest.raises(Exception):
            conn.execute("UPDATE bridges SET enabled = 1 WHERE uuid = ?", (first["uuid"],))


def _manager_with_remote(bridge_uptime_ago_s: float, last_seen_stamp: int) -> BridgeV2Manager:
    manager = BridgeV2Manager(MagicMock())
    manager._topology_nodes[BRIDGE] = {"mac": BRIDGE, "is_bridge": True, "bridge_mac": BRIDGE, "online": True}
    manager._topology_nodes[REMOTE] = {
        "mac": REMOTE,
        "bridge_mac": BRIDGE,
        "online": True,
        "last_seen_bridge_uptime_s": last_seen_stamp,
        "_last_seen_observed_at": time.time(),
        "uptime_s": 100,
        "_uptime_observed_at": time.time(),
    }
    # Bridge uptime reading taken `bridge_uptime_ago_s` ago; the helper advances it
    # with wall time, which is how a quiet bridge reports a growing clock.
    manager._bridge_uptime_observed[BRIDGE] = (1000, time.time() - bridge_uptime_ago_s)
    return manager


def test_last_seen_ages_while_the_node_is_silent() -> None:
    manager = _manager_with_remote(bridge_uptime_ago_s=60, last_seen_stamp=995)
    node = next(n for n in manager.get_topology_list() if n["mac"] == REMOTE)
    # 1060 - 995 = 65. The old arithmetic added the elapsed time to the stamp too,
    # which cancelled out and reported the same age forever.
    assert node["last_seen_ago"] == pytest.approx(65, abs=1)


def test_last_seen_reports_the_real_gap_for_an_old_stamp() -> None:
    manager = _manager_with_remote(bridge_uptime_ago_s=0, last_seen_stamp=400)
    node = next(n for n in manager.get_topology_list() if n["mac"] == REMOTE)
    assert node["last_seen_ago"] == pytest.approx(600, abs=1)


def test_topology_broadcast_queue_is_bounded_and_keeps_the_newest() -> None:
    broadcast = TopologyBroadcast()
    queue = broadcast.add_client(maxsize=2)
    for index in range(5):
        broadcast.emit("topology.snapshot", {"index": index})

    assert queue.qsize() == 2
    messages = [json.loads(queue.get_nowait()), json.loads(queue.get_nowait())]
    assert [m["payload"]["index"] for m in messages] == [3, 4]


def test_flash_retention_moves_only_the_owned_copy(tmp_path: Path) -> None:
    store = FirmwareStore(tmp_path / "firmware", 7)
    store.init()
    original = store.active_dir / "compile.bin"
    original.parent.mkdir(parents=True, exist_ok=True)
    original.write_bytes(b"firmware-image")

    flash_copy = store.clone_retained(str(original))
    retained, retained_until = store.retain(str(flash_copy), 42)

    assert original.exists(), "the compile job's binary must survive the flash"
    assert Path(retained).exists()
    assert Path(retained) != original
    assert retained_until is not None


def _compile_worker(db: Database, tmp_path: Path, compiler) -> CompileWorker:
    return CompileWorker(
        db=db,
        compiler=compiler,
        bridge_manager=MagicMock(),
        firmware_store=FirmwareStore(tmp_path / "firmware", 7),
        yaml_store=YAMLStore(tmp_path / "devices"),
        settings=SimpleNamespace(firmware_dir=tmp_path / "firmware"),
    )


def test_previous_compile_binaries_are_discarded(db: Database, tmp_path: Path) -> None:
    store = FirmwareStore(tmp_path / "firmware", 7)
    store.init()
    old_path = store.active_dir / "old.bin"
    new_path = store.active_dir / "new.bin"
    old_path.parent.mkdir(parents=True, exist_ok=True)
    old_path.write_bytes(b"old")
    new_path.write_bytes(b"new")

    old_job = db.create_job({"mac": REMOTE, "status": COMPILE_SUCCESS, "firmware_path": str(old_path)})
    new_job = db.create_job({"mac": REMOTE, "status": COMPILE_SUCCESS, "firmware_path": str(new_path)})

    worker = _compile_worker(db, tmp_path, MagicMock())
    worker._discard_previous_compile_artifacts(REMOTE, int(new_job["id"]), str(new_path))

    assert new_path.exists()
    assert not old_path.exists()
    assert db.get_job(int(old_job["id"]))["firmware_path"] is None


def test_compile_artifact_in_use_by_a_flash_job_is_kept(db: Database, tmp_path: Path) -> None:
    store = FirmwareStore(tmp_path / "firmware", 7)
    store.init()
    shared = store.active_dir / "shared.bin"
    shared.parent.mkdir(parents=True, exist_ok=True)
    shared.write_bytes(b"shared")

    old_job = db.create_job({"mac": REMOTE, "status": COMPILE_SUCCESS, "firmware_path": str(shared)})
    db.create_job({"mac": REMOTE, "status": QUEUED, "firmware_path": str(shared)})
    new_job = db.create_job({"mac": REMOTE, "status": COMPILE_SUCCESS, "firmware_path": str(shared)})

    worker = _compile_worker(db, tmp_path, MagicMock())
    worker._discard_previous_compile_artifacts(REMOTE, int(new_job["id"]), str(shared))

    assert shared.exists()
    assert db.get_job(int(old_job["id"]))["firmware_path"] == str(shared)


@pytest.mark.asyncio
async def test_cancelled_compile_does_not_publish_success(db: Database, tmp_path: Path) -> None:
    yaml_store = YAMLStore(tmp_path / "devices")
    yaml_store.save_config("shed", "esphome:\n  name: shed\n")
    job = db.create_job({"mac": REMOTE, "status": COMPILING, "esphome_name": "shed"})

    class Compiler:
        compile_store = SimpleNamespace(
            set_status=MagicMock(), clear_status=MagicMock(), get_log_tail=lambda *a, **k: ""
        )

        async def compile(self, esphome_name):
            # Simulate the user cancelling while ESPHome boots: there is no process
            # to kill, so only the job row records the cancellation.
            db.mark_terminal(int(job["id"]), FAILED, error_msg="cancelled by user")
            return SimpleNamespace(success=True, ota_bin_path=None, factory_bin_path=None, firmware_info=None)

    worker = CompileWorker(
        db=db,
        compiler=Compiler(),
        bridge_manager=MagicMock(),
        firmware_store=FirmwareStore(tmp_path / "firmware", 7),
        yaml_store=yaml_store,
        settings=SimpleNamespace(firmware_dir=tmp_path / "firmware"),
    )

    await worker._process(db.get_job(int(job["id"])))

    assert db.get_job(int(job["id"]))["status"] == FAILED
    assert not db.list_jobs_by_status(COMPILE_SUCCESS)
    assert not db.queued_jobs()


def test_offline_retry_moves_the_job_behind_the_others(db: Database) -> None:
    first = db.create_job({"mac": REMOTE, "status": QUEUED, "queue_order": 10})
    second = db.create_job({"mac": BRIDGE, "status": QUEUED, "queue_order": 11})

    # Positions are not renumbered when jobs leave the queue, so assigning
    # "len-1" directly left the retried job at 1 -- still ahead of 10 and 11.
    db.reorder_queue(int(first["id"]), 1)

    order = {int(j["id"]): j["queue_order"] for j in db.queued_jobs()}
    assert order[int(first["id"])] > order[int(second["id"])]


@pytest.mark.asyncio
async def test_esphome_bootstrap_runs_once_under_concurrency(tmp_path: Path, monkeypatch) -> None:
    from app.compiler import ESPHomeCompiler

    monkeypatch.setenv("ESP_TREE_DATA_DIR", str(tmp_path / "data"))
    state = {"installed": None, "bootstraps": 0}
    compiler = ESPHomeCompiler(
        compile_store=MagicMock(),
        devices_root=tmp_path / "devices",
        components_root=tmp_path / "components",
        platformio_cache=tmp_path / "pio",
    )
    monkeypatch.setattr(compiler, "_pinned_esphome_version", lambda: "2026.6.5")
    monkeypatch.setattr(compiler, "_installed_esphome_version", lambda: state["installed"])

    def bootstrap(log_path, installed, pinned):
        state["bootstraps"] += 1
        bin_dir = tmp_path / "data" / "esphome_venv" / "bin"
        bin_dir.mkdir(parents=True, exist_ok=True)
        (bin_dir / "esphome").write_text("", encoding="utf-8")
        time.sleep(0.05)
        state["installed"] = pinned

    monkeypatch.setattr(compiler, "_bootstrap_esphome_sync", bootstrap)

    await asyncio.gather(
        compiler._ensure_esphome(tmp_path / "a.log"),
        compiler._ensure_esphome(tmp_path / "b.log"),
    )

    assert state["bootstraps"] == 1
