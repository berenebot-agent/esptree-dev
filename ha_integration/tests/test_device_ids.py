"""`device_entry_ids` must mirror Home Assistant's deprecated shim exactly.

HA 2026.x keeps `DeviceEntry.config_entries` as a compatibility shim that
reports a deprecation warning (removable in Core 2027.10); the non-deprecated
value is the single `config_entry_id`, except for restored composite devices
where the property is genuinely multi-entry and does not warn.
"""
from __future__ import annotations

from types import SimpleNamespace

from tests.conftest import import_entity


def _device(*, config_entry_id=None, composite=False, entries=None):
    device = SimpleNamespace(
        config_entry_id=config_entry_id,
        is_composite_device=composite,
    )
    if entries is not None:
        device.config_entries = set(entries)
    return device


def test_normal_device_reports_only_its_owning_entry():
    module = import_entity("device_ids")

    assert module.device_entry_ids(_device(config_entry_id="hub-entry")) == {"hub-entry"}


def test_composite_device_keeps_the_union_of_its_entries():
    module = import_entity("device_ids")

    device = _device(config_entry_id="hub-entry", composite=True, entries={"hub-entry", "remote-entry"})

    assert module.device_entry_ids(device) == {"hub-entry", "remote-entry"}


def test_orphaned_device_mirrors_cores_none_placeholder():
    module = import_entity("device_ids")

    # Core's shim returns {config_entry_id} even when it is None; membership
    # tests behave identically, but the helper must not invent a different shape.
    assert module.device_entry_ids(_device(config_entry_id=None)) == {None}
