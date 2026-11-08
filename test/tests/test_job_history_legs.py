"""Upload history carries the transfer leg only.

Regression for "a single build-and-upload shows as two jobs". `list_history` returned
every `ota_jobs` row except `pending_confirm` and stamped each one `job_type="flash"`,
so the Jobs page rendered a running build as `Upload / Building` and a finished build
twice -- once from upload history, once from compile history. One operation, two rows,
one of them lying about what it is.

The two legs still share the `ota_jobs` table, so the split is by status: the build
leg (`compile_queued`, `compiling`, `compile_success`) belongs to compile history, and
everything else is an upload.
"""
from __future__ import annotations

from pathlib import Path

import pytest

from app.db import Database
from app.models import (
    COMPILE_QUEUED,
    COMPILE_SUCCESS,
    COMPILING,
    FAILED,
    QUEUED,
    STARTING,
    SUCCESS,
)

MAC = "AA:BB:CC:DD:EE:FF"


@pytest.fixture()
def db(tmp_path):
    database = Database(Path(tmp_path) / "esp_tree.db")
    database.init()
    return database


def _job(db: Database, status: str, **values) -> dict:
    return db.create_job({"mac": MAC, "status": status, "percent": 0, "esphome_name": "espnow-bridge-c3", **values})


def test_upload_history_excludes_the_build_leg(db):
    """A compiling/finished build must not be listed as an upload."""
    compile_queued = _job(db, COMPILE_QUEUED)
    compiling = _job(db, COMPILING)
    finished_build = _job(db, COMPILE_SUCCESS, firmware_name="espnow-bridge-c3.ota.bin")

    history = db.list_history(limit=50)

    listed = {row["id"] for row in history}
    assert compile_queued["id"] not in listed
    assert compiling["id"] not in listed
    assert finished_build["id"] not in listed
    # Every row that IS returned is honestly an upload.
    assert all(row["job_type"] == "flash" for row in history)


def test_upload_history_still_lists_the_transfer_leg(db):
    """The flash job created from the build, running or finished, stays in history."""
    queued = _job(db, QUEUED)
    starting = _job(db, STARTING)
    done = _job(db, SUCCESS, firmware_name="espnow-bridge-c3.ota.bin")

    listed = {row["id"] for row in db.list_history(limit=50)}

    assert listed == {queued["id"], starting["id"], done["id"]}


def test_build_leg_keeps_its_own_history(db):
    """Hiding the build from upload history must not lose it from build history."""
    finished_build = _job(db, COMPILE_SUCCESS, firmware_name="espnow-bridge-c3.ota.bin")

    builds = db.compile_history_all(limit=10)

    assert [row["id"] for row in builds] == [finished_build["id"]]
    assert builds[0]["job_type"] == "compile"


def test_failed_build_reports_each_leg_once(db):
    """A build-failure row belongs to build history, not upload history."""
    failed_build = _job(db, FAILED, error_msg="boom")
    db.append_job_event(int(failed_build["id"]), "compile_failed", error="boom")

    assert failed_build["id"] not in {row["id"] for row in db.list_history(limit=50)}
    assert failed_build["id"] in {row["id"] for row in db.compile_history_all(limit=10)}
