from __future__ import annotations

from types import SimpleNamespace
from unittest.mock import MagicMock

from tests.conftest import import_entity


def test_last_seen_sensor_returns_elapsed_bridge_uptime(monkeypatch):
    """The age must be the gap between the two stamps, with no wall-clock added
    to the stamp itself: adding elapsed time to both sides cancelled out and the
    sensor stuck at its first reading."""
    module = import_entity("remote_diagnostic_sensor")
    bridge_uptime = 60005
    now = 1000.0
    remote = SimpleNamespace(
        bridge_mac="AA:BB:CC:DD:EE:00",
        last_seen_bridge_uptime_s=bridge_uptime - 4,
        last_seen_observed_at=now - 2,
    )
    runtime = SimpleNamespace(
        remotes={"AA:BB:CC:DD:EE:FF": remote},
        _effective_bridge_uptime=MagicMock(return_value=bridge_uptime + 2),
    )
    monkeypatch.setattr(module.time, "time", lambda: now)
    monkeypatch.setattr(module, "get_runtime", lambda hass: runtime)
    sensor = module.RemoteDiagnosticSensor("AA:BB:CC:DD:EE:FF", "last_seen_s", "Last Seen", "duration", "s", "measurement")
    sensor.hass = MagicMock()

    assert sensor.native_value == 6


def test_last_seen_sensor_keeps_growing_while_idle(monkeypatch):
    module = import_entity("remote_diagnostic_sensor")
    now = [1000.0]
    remote = SimpleNamespace(
        bridge_mac="AA:BB:CC:DD:EE:00",
        last_seen_bridge_uptime_s=60000,
        last_seen_observed_at=now[0],
    )

    def effective_uptime(_mac):
        # Simulates the bridge clock advancing with wall time.
        return 60000 + int(now[0] - 1000.0)

    runtime = SimpleNamespace(remotes={"AA:BB:CC:DD:EE:FF": remote}, _effective_bridge_uptime=effective_uptime)
    monkeypatch.setattr(module.time, "time", lambda: now[0])
    monkeypatch.setattr(module, "get_runtime", lambda hass: runtime)
    sensor = module.RemoteDiagnosticSensor("AA:BB:CC:DD:EE:FF", "last_seen_s", "Last Seen", "duration", "s", "measurement")
    sensor.hass = MagicMock()

    assert sensor.native_value == 0
    now[0] += 60
    assert sensor.native_value == 60


def test_last_seen_sensor_returns_none_without_bridge_timing():
    module = import_entity("remote_diagnostic_sensor")
    remote = SimpleNamespace(
        bridge_mac="AA:BB:CC:DD:EE:00",
        last_seen_bridge_uptime_s=0,
        last_seen_observed_at=0,
    )
    runtime = SimpleNamespace(remotes={"AA:BB:CC:DD:EE:FF": remote}, _effective_bridge_uptime=lambda _: 60000)
    module.get_runtime = lambda hass: runtime
    sensor = module.RemoteDiagnosticSensor("AA:BB:CC:DD:EE:FF", "last_seen_s", "Last Seen", "duration", "s", "measurement")
    sensor.hass = MagicMock()

    assert sensor.native_value is None
