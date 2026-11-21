"""Host serial-port discovery for the add-on UI and serial client.

Split out of ``server.py`` so the enumeration rules are unit-testable without
standing up the FastAPI app. The rules that matter:

* ``/dev/serial/by-id/*`` is preferred: the symlink carries the adapter's serial
  number and survives the ``ttyUSB0`` → ``ttyUSB1`` renumbering that happens on
  replug and reboot, so a saved bridge keeps resolving.
* ``/dev/ttyUSB*`` and ``/dev/ttyACM*`` are the real USB-UART adapters.
* ``/dev/ttyS*`` is deliberately excluded. Those are the host's virtual/legacy
  UARTs (a VM exposes several), never an ESP bridge, and offering one lets a user
  pick a phantom port the serial client can never read through.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any


def list_serial_ports(dev_dir: str = "/dev") -> list[dict[str, Any]]:
    """Enumerate candidate serial devices, stable names first."""
    dev = Path(dev_dir)

    candidates: list[Path] = []
    by_id_dir = dev / "serial" / "by-id"
    if by_id_dir.exists():
        candidates.extend(by_id_dir.glob("*"))
    for pattern in ("ttyUSB*", "ttyACM*"):
        candidates.extend(dev.glob(pattern))

    seen: set[str] = set()
    ports: list[dict[str, Any]] = []
    for path in sorted(candidates, key=lambda p: str(p)):
        try:
            resolved = str(path.resolve())
        except OSError:
            resolved = str(path)
        # Deduplicate on the resolved target so a by-id symlink and its ttyUSBn
        # node do not both appear.
        key = resolved
        if key in seen:
            continue
        seen.add(key)

        port = str(path)
        is_by_id = port.startswith(str(by_id_dir))
        # A by-id symlink can point at a device node outside the container's view;
        # fall back to the symlink's own access bits when the target is absent.
        target = Path(resolved)
        if target.exists():
            available = os.access(resolved, os.R_OK | os.W_OK)
        else:
            available = os.access(port, os.R_OK | os.W_OK)

        ports.append(
            {
                "port": port,
                "label": path.name,
                "path": port,
                "resolved": resolved,
                "available": available,
                "by_id": is_by_id,
            }
        )
    return ports


def stable_serial_path(port: str, dev_dir: str = "/dev") -> str:
    """Return the ``/dev/serial/by-id/*`` alias for ``port`` when one exists.

    ``/dev/ttyUSB0`` renumbers on replug and reboot, so saving it means a bridge
    can later point at a different adapter or at nothing. The by-id symlink carries
    the adapter's serial number and survives that. URLs (``socket://``,
    ``rfc2217://``), paths that are already by-id, and ports with no by-id alias
    (unplugged, or a host without udev links) are returned unchanged.
    """
    port = (port or "").strip()
    if not port or "://" in port:
        return port
    by_id_dir = Path(dev_dir) / "serial" / "by-id"
    if port.startswith(str(by_id_dir)) or not by_id_dir.is_dir():
        return port
    try:
        resolved = Path(port).resolve(strict=True)
    except OSError:
        return port
    for link in sorted(by_id_dir.glob("*")):
        try:
            if link.resolve(strict=True) == resolved:
                return str(link)
        except OSError:
            continue
    return port
