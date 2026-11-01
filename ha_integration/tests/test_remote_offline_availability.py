"""An offline availability notice must land even when the session changed.

Regression for the UAT finding: a remote was OTA-flashed, rebooted into a new
session, started its join and dropped before it was ever marked online. The
bridge reported it offline, the add-on agreed (`online: false`,
`offline_reason: timeout`), but Home Assistant kept `online: true` and every
entity stayed available with the values frozen at the moment of the reboot.

Cause: the offline branch required

    remote.bridge_mac == bridge_mac and remote.session_id == ev.session_id

while the bridge stamps an availability event with the session it currently
holds (`api_runtime_encode_remote_availability` -> `runtime_session_id_`), and a
session id is an HMAC over nonces regenerated on every JOIN
(`bridge_protocol.cpp`, `handle_join_`). A session change therefore made the
offline notice unmatchable and it was dropped silently.

The surrounding code already accepts a session change in the other direction:
`_accept_live` returns True when the session differs, and
`_merge_remote_snapshot` applies `runtime.online` with no session check at all.
Only the event path was strict, so only the event path leaked liveness.
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock

_PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "esp_tree"

REMOTE = "E8:3D:C1:9D:6C:D0"
BRIDGE = "F4:2D:C9:58:33:10"
OLD_SESSION = "3f27fa84ff9adaa9"
NEW_SESSION = "ce9174559732d1c6"


def _load_runtime():
    """Import bridge_runtime with the mocked Home Assistant surface from conftest."""
    fqn = "custom_components.esp_tree.bridge_runtime"
    mod = sys.modules.get(fqn)
    if mod is not None and hasattr(mod, "__spec__"):
        return mod
    spec = importlib.util.spec_from_file_location(fqn, _PKG_DIR / "bridge_runtime.py")
    assert spec is not None and spec.loader is not None
    mod = importlib.util.module_from_spec(spec)
    sys.modules[fqn] = mod
    spec.loader.exec_module(mod)
    return mod


class _Event:
    """Stand-in for a protobuf EventBatch entry (conftest mocks the pb module)."""

    def __init__(self, kind: str, payload) -> None:
        self._kind = kind
        self._payload = payload

    def WhichOneof(self, _oneof: str) -> str:
        return self._kind

    def __getattr__(self, name):
        if name in ("_kind", "_payload"):
            raise AttributeError(name)
        return self._payload


def _availability(*, online: bool, session_id: str, observed_ms: int = 1_000) -> _Event:
    return _Event(
        "remote_availability",
        SimpleNamespace(
            remote_mac=REMOTE,
            online=online,
            bridge_mac=BRIDGE,
            session_id=session_id,
            tx_counter=0,
            observed_unix_ms=observed_ms,
            rssi=-50,
            hops_to_bridge=1,
            uptime_s=12,
            reason="timeout",
        ),
    )


def _runtime():
    """A runtime holding one online remote (OLD_SESSION) with one entity."""
    rt_mod = _load_runtime()
    runtime = rt_mod.EspTreeRuntime.__new__(rt_mod.EspTreeRuntime)
    runtime.hass = MagicMock()
    runtime.remotes = {}
    runtime.entities = {}
    runtime.update_callbacks = {}
    runtime._remote_entry_ids = {}
    runtime._pending_remote_discoveries = set()
    runtime._bridge_uptime_observed = {}
    # Discovery/notify fan-out is not what this test is about; keep it inert.
    runtime._schedule_remote_discovery = MagicMock()
    runtime._notify_remote = MagicMock()

    remote = rt_mod.RemoteModel(remote_mac=REMOTE, bridge_mac=BRIDGE, session_id=OLD_SESSION, online=True)
    entity = rt_mod.EntityModel(
        remote_mac=REMOTE, object_id="uat_probe", platform="sensor", name="UAT Probe", available=True
    )
    runtime.remotes[REMOTE] = remote
    runtime.entities[(REMOTE, "uat_probe")] = entity
    remote.entities = {"uat_probe": entity}
    return runtime, remote, entity


def _dispatch(runtime, event) -> None:
    runtime._handle_events(SimpleNamespace(events=[event]))


def test_offline_lands_after_the_remote_rebooted_into_a_new_session():
    runtime, remote, entity = _runtime()

    _dispatch(runtime, _availability(online=False, session_id=NEW_SESSION))

    assert remote.online is False
    assert remote.offline_started_at is not None
    assert entity.available is False


def test_offline_lands_for_the_session_we_already_hold():
    runtime, remote, entity = _runtime()

    _dispatch(runtime, _availability(online=False, session_id=OLD_SESSION))

    assert remote.online is False
    assert entity.available is False


def test_offline_from_another_bridge_is_ignored():
    runtime, remote, entity = _runtime()
    event = _availability(online=False, session_id=NEW_SESSION)
    event._payload.bridge_mac = "11:22:33:44:55:66"

    _dispatch(runtime, event)

    assert remote.online is True
    assert entity.available is True
