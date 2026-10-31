"""Config entries a device belongs to, without the deprecated property.

Home Assistant 2026.x stores one owning entry per device (``config_entry_id``)
and keeps ``DeviceEntry.config_entries`` only as a compatibility shim that
reports a deprecation warning (removable in Core 2027.10). The one exception is
a restored composite device -- a read-only entry synthesized for a device id
from before the split -- where the property is genuinely multi-entry and does
not warn.

This helper mirrors Home Assistant's own ``DeviceEntry._config_entries``
implementation, so callers get the same set semantics at every call site
without tripping the deprecation report.
"""
from __future__ import annotations

from typing import Protocol


class DeviceLike(Protocol):
    config_entry_id: str | None
    is_composite_device: bool

    @property
    def config_entries(self) -> set[str]: ...


def device_entry_ids(device: DeviceLike) -> set[str | None]:
    """Return the config entry ids ``device`` belongs to.

    Mirrors Core's shim: a composite device keeps its union of entries, every
    other device reports exactly its single owning entry. ``config_entry_id``
    can be ``None`` for an orphaned device, and Core's shim returns ``{None}``
    in that case; membership tests behave identically either way.
    """
    if device.is_composite_device:
        return set(device.config_entries)
    return {device.config_entry_id}
