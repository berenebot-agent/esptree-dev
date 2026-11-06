"""Regressions in the integration's runtime: discovery order, event gating,
link-loss availability, callback lifetime, event dedupe and command failures.
"""
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest

from tests.conftest import EntityModel, import_entity

_PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "esp_tree"

REMOTE = "E8:3D:C1:9D:6C:D0"
BRIDGE = "F4:2D:C9:58:33:10"
SESSION = "ce9174559732d1c6"


def _load_runtime():
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


def _runtime_with_remote(*, value=None, online=True, counter=20):
    rt_mod = _load_runtime()
    runtime = rt_mod.EspTreeRuntime.__new__(rt_mod.EspTreeRuntime)
    runtime.hass = MagicMock()
    # Close coroutines handed to the (mocked) task factory so pytest does not warn
    # about an un-awaited ensure_remote_device.
    runtime.hass.async_create_task = lambda coro: coro.close() if hasattr(coro, "close") else None
    runtime.remotes = {}
    runtime.entities = {}
    runtime.entity_callbacks = {}
    runtime.update_callbacks = {}
    runtime._remote_entry_ids = {}
    runtime._pending_remote_discoveries = set()
    runtime._bridge_uptime_observed = {BRIDGE: (1000, 1_000_000.0)}
    runtime._schedule_remote_discovery = MagicMock()
    runtime._schedule_device_id_map_send = MagicMock()
    runtime._notify_remote = MagicMock()

    remote = rt_mod.RemoteModel(
        remote_mac=REMOTE, bridge_mac=BRIDGE, session_id=SESSION, online=online, last_tx_counter=counter
    )
    remote.last_live_observed_ms = 5000
    entity = rt_mod.EntityModel(
        remote_mac=REMOTE, object_id="probe", platform="sensor", name="Probe", available=online, value=value
    )
    runtime.remotes[REMOTE] = remote
    runtime.entities[(REMOTE, "probe")] = entity
    remote.entities = {"probe": entity}
    return runtime, remote, entity


class _Event:
    def __init__(self, kind: str, payload) -> None:
        self._kind = kind
        self._payload = payload

    def WhichOneof(self, _oneof: str) -> str:
        return self._kind

    def __getattr__(self, name):
        if name in ("_kind", "_payload"):
            raise AttributeError(name)
        return self._payload


class _State:
    def __init__(self, object_id: str, value: float, observed_ms: int) -> None:
        self.object_id = object_id
        self.available = True
        self.observed_unix_ms = observed_ms
        self.float_value = value

    def WhichOneof(self, _oneof: str) -> str:
        return "float_value"


def test_descriptor_is_populated_before_the_creation_callback() -> None:
    """Platforms read capabilities in __init__; announcing the model first left a
    fan with speed_count=0 and a light with no colour modes for its whole life."""
    runtime, _, _ = _runtime_with_remote()
    runtime._remote_entry_ids[REMOTE] = "entry-1"
    captured: list[str] = []
    runtime.register_platform("fan", lambda model: captured.append(model.options_json), "entry-1")

    desc = SimpleNamespace(
        object_id="fan-1",
        platform="fan",
        friendly_name="Fan",
        native_type="fan",
        unit_of_measurement="",
        device_class="",
        state_class="",
        options_json="color_modes=rgb;speeds=3",
        writable=True,
    )
    snapshot = SimpleNamespace(
        identity=SimpleNamespace(
            remote_mac=REMOTE, esphome_name="shed", friendly_name="Shed", manufacturer="ESPHome",
            model="esp_tree_remote", project_name="", project_version="", firmware_build_date="",
            firmware_md5="", schema_hash="abc", entity_count=1, chip_name="ESP32-C3",
            can_relay=False, relay_enabled=False,
        ),
        runtime=SimpleNamespace(
            online=True, bridge_mac=BRIDGE, parent_mac="", hops_to_bridge=1, rssi=-50,
            session_id=SESSION, last_tx_counter=20, uptime_s=10, last_seen_bridge_uptime_s=990,
        ),
        descriptor_set=SimpleNamespace(entities=[desc]),
        states=[],
    )

    runtime._merge_remote_snapshot(snapshot, BRIDGE, 1000)

    assert captured == ["color_modes=rgb;speeds=3"]


def test_rejected_state_event_does_not_overwrite_values() -> None:
    runtime, remote, entity = _runtime_with_remote(value="old", counter=20)
    stale = _Event(
        "remote_state",
        SimpleNamespace(
            remote_mac=REMOTE,
            bridge_mac=BRIDGE,
            session_id=SESSION,
            tx_counter=19,
            observed_unix_ms=1000,
            states=[_State("probe", 99.0, 1000)],
        ),
    )

    runtime._handle_events(SimpleNamespace(events=[stale]))

    assert entity.value == "old", "a rejected batch must not write values"
    assert remote.last_tx_counter == 20


def test_accepted_state_event_still_applies() -> None:
    runtime, remote, entity = _runtime_with_remote(value="old", counter=20)

    fresh = _Event(
        "remote_state",
        SimpleNamespace(
            remote_mac=REMOTE,
            bridge_mac=BRIDGE,
            session_id=SESSION,
            tx_counter=21,
            observed_unix_ms=6000,
            states=[_State("probe", 42.0, 6000)],
        ),
    )
    runtime._handle_events(SimpleNamespace(events=[fresh]))

    assert entity.value == 42.0
    assert remote.last_tx_counter == 21


def test_link_loss_marks_entities_unavailable() -> None:
    runtime, remote, entity = _runtime_with_remote(online=True, value=21.4)
    assert entity.available is True

    runtime.mark_link_down()

    assert remote.online is False
    assert entity.available is False


def test_remove_entry_drops_platform_callbacks() -> None:
    runtime, _, _ = _runtime_with_remote()
    runtime.register_platform("switch", MagicMock(), "entry-1")
    runtime.register_platform("switch", MagicMock(), "entry-2")

    entry = SimpleNamespace(entry_id="entry-1", data={"type": "remote", "remote_mac": REMOTE})
    # remove_entry is async; drive it without an event loop by using its callback
    # pruning directly is not possible, so run it.
    import asyncio

    asyncio.run(runtime.remove_entry(entry))

    remaining = runtime.entity_callbacks.get("switch", [])
    assert [reg[1] for reg in remaining] == ["entry-2"]


def test_event_fires_again_for_the_same_type_when_the_timestamp_advances() -> None:
    module = import_entity("event")
    model = EntityModel(platform="event", value="pressed", observed_unix_ms=1000)
    entity = module.EspTreeEvent(model)
    entity._trigger_event = MagicMock()
    entity._last_observed_ms = 1000

    entity._process_event()  # availability/state notification, same observation
    assert entity._trigger_event.call_count == 0

    model.observed_unix_ms = 2000
    entity._process_event()
    assert entity._trigger_event.call_count == 1

    model.observed_unix_ms = 3000
    entity._process_event()
    assert entity._trigger_event.call_count == 2, "a second press must fire again"


def test_command_failure_raises(monkeypatch) -> None:
    ic_mod = import_entity("integration_client")
    monkeypatch.setattr(
        ic_mod,
        "pb",
        SimpleNamespace(
            COMMAND_STATUS_ACCEPTED=1,
            COMMAND_STATUS_DELIVERED=2,
            COMMAND_STATUS_UNAVAILABLE=4,
        ),
    )
    ok = SimpleNamespace(status=1, error_message="")
    timed_out = SimpleNamespace(status=1, error_message="timeout")
    unavailable = SimpleNamespace(status=4, error_message="", error_code="unknown_remote")

    assert ic_mod.command_result_error(ok) is None
    assert ic_mod.command_result_error(timed_out) == "timeout"
    assert ic_mod.command_result_error(unavailable) == "unknown_remote"


@pytest.mark.asyncio
async def test_command_raises_home_assistant_error(monkeypatch) -> None:
    ic_mod = import_entity("integration_client")
    monkeypatch.setattr(
        ic_mod,
        "pb",
        SimpleNamespace(
            COMMAND_STATUS_ACCEPTED=1,
            COMMAND_STATUS_DELIVERED=2,
            COMMAND_STATUS_UNAVAILABLE=4,
            CommandArgument=lambda **kwargs: SimpleNamespace(**kwargs),
            CommandRequest=lambda **kwargs: SimpleNamespace(**kwargs),
            Envelope=lambda **kwargs: SimpleNamespace(**kwargs),
        ),
    )
    client = ic_mod.IntegrationWSClient.__new__(ic_mod.IntegrationWSClient)

    async def fake_request(envelope, timeout=10):
        return SimpleNamespace(
            command_result=SimpleNamespace(status=4, error_message="", error_code="unknown_remote")
        )

    client.request = fake_request
    errors = sys.modules["homeassistant.exceptions"]

    with pytest.raises(errors.HomeAssistantError):
        await client.command(REMOTE, "probe", "turn_on")