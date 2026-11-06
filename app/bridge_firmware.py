"""Bridge self-update policy: can this bridge take an over-the-air image, and is it listening?

A bridge cannot relay an image to itself - the protobuf OTA leg resolves a *remote*
session for the target MAC and answers "remote not found or offline" for the bridge's
own - so updating a bridge is an ESPHome OTA push to its own OTA port, fed by a fresh
compile of its stored config. These two helpers decide whether that is possible and
carry the reasons; they live here rather than inside ``create_app`` so they can be
tested without standing up the whole add-on.
"""

from __future__ import annotations

import asyncio
import time
from typing import Any, Mapping

# ESPHome's native-API OTA port. Fixed by the device's `ota: platform: esphome` block,
# which the flash wizard's scaffold emits without a `port:` override.
BRIDGE_OTA_PORT = 3232

# A bridge cannot be on these as a real address: 0.0.0.0 is what the wizard writes for a
# bridge that has not joined yet, and a serial-transport row has no host at all.
_UNUSABLE_HOSTS = {"", "0.0.0.0", "::"}


def update_blocker(bridge: Mapping[str, Any], *, has_config: bool) -> str | None:
    """Why this bridge cannot be rebuilt and uploaded, or None when it can.

    Every reason names the route that *does* work. "Serial bridge" and "no OTA server"
    both end at a USB flash, so saying only "not supported" would leave the user with
    a disabled button and no next step.
    """
    transport = str(bridge.get("transport") or "wifi").strip().lower()
    host = str(bridge.get("host") or "").strip()
    name = str(bridge.get("name") or "").strip()
    if not name:
        return "this bridge has no ESPHome name, so it cannot be rebuilt from the add-on"
    if not has_config:
        return (
            f"no stored ESPHome config for '{name}' — this bridge was not provisioned by "
            "the flash wizard, so there is nothing to rebuild. Reflash it once over USB."
        )
    if transport == "serial":
        return (
            "this bridge is on the serial transport: it has no network to receive an "
            "over-the-air image. Reflash it over USB from the device page."
        )
    if host in _UNUSABLE_HOSTS:
        return "this bridge has not joined the network yet, so there is no host to upload to"
    if int(bridge.get("flash_wizard_pending") or 0):
        return "this bridge is still provisioning — finish the flash wizard first"
    return None


def ota_unreachable_reason() -> str:
    return (
        "the bridge is not listening on its OTA port — its running firmware was built "
        "without `ota: platform: esphome`, so it needs one flash over USB"
    )


class OtaPortProbe:
    """Is something listening on the bridge's OTA port?

    This is the real "can it be updated in place" test, not the transport label: a
    hand-written config can carry both `wifi:` and `serial_transport:`, and that bridge
    would accept an upload while its row still says serial.

    The answer is cached for a short while because the UI reads the status on every
    topology refresh (3 s) and an unreachable bridge costs the full TCP timeout each
    time - but a bridge does not grow an OTA server between polls either.
    """

    def __init__(self, ttl_s: float = 20.0, timeout_s: float = 2.0) -> None:
        self._ttl_s = ttl_s
        self._timeout_s = timeout_s
        self._cache: dict[str, tuple[float, bool]] = {}

    def forget(self, host: str | None = None) -> None:
        if host is None:
            self._cache.clear()
            return
        for key in [key for key in self._cache if key.startswith(f"{host}:")]:
            self._cache.pop(key, None)

    async def is_open(self, host: str, port: int = BRIDGE_OTA_PORT) -> bool:
        if str(host or "").strip() in _UNUSABLE_HOSTS:
            return False
        key = f"{host}:{port}"
        cached = self._cache.get(key)
        now = time.monotonic()
        if cached is not None and now - cached[0] < self._ttl_s:
            return cached[1]
        reachable = False
        try:
            _reader, writer = await asyncio.wait_for(
                asyncio.open_connection(host, port), timeout=self._timeout_s
            )
        except Exception:
            reachable = False
        else:
            reachable = True
            try:
                writer.close()
                await writer.wait_closed()
            except Exception:
                pass
        self._cache[key] = (now, reachable)
        return reachable
