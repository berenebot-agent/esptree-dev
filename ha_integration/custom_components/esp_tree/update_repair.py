from __future__ import annotations

import json
import logging
import time
from collections.abc import Callable
from datetime import timedelta
from pathlib import Path

from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.event import async_track_time_interval

from .const import CONF_TYPE, DOMAIN

_LOGGER = logging.getLogger(__name__)
_MODULE_IMPORTED_AT = int(time.time())

MARKER_FILE = ".restart_required.json"
MARKER_PATH = Path(__file__).resolve().parent / MARKER_FILE
ISSUE_ID = "restart_required"


async def async_start_update_repair_watcher(hass: HomeAssistant) -> None:
    domain_data = hass.data.setdefault(DOMAIN, {})
    if domain_data.get("update_repair_unsub"):
        return

    async def _tick(_now=None) -> None:
        await _sync_restart_issue(hass)

    await _sync_restart_issue(hass)
    unsub: Callable[[], None] = async_track_time_interval(hass, _tick, timedelta(seconds=60))
    domain_data["update_repair_unsub"] = unsub


def _read_restart_marker(marker_path: Path) -> tuple[bool, int]:
    """Read the add-on's restart marker. Runs in the executor, never on the loop.

    Returns ``(exists, created_at)``. A marker that exists but cannot be parsed
    counts as undated, which the caller treats as stale -- the same outcome as
    the previous inline ``except`` branch.
    """
    try:
        payload = json.loads(marker_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return False, 0
    except Exception:
        return True, 0
    return True, int(payload.get("created_at") or 0)


def _delete_restart_marker(marker_path: Path) -> None:
    try:
        marker_path.unlink()
    except OSError as exc:
        _LOGGER.debug("Could not remove stale ESP Tree restart marker: %s", exc)


async def _sync_restart_issue(hass: HomeAssistant) -> None:
    exists, created_at = await hass.async_add_executor_job(_read_restart_marker, MARKER_PATH)
    if not exists:
        _LOGGER.info("RESTART_ISSUE: marker NOT found at %s", MARKER_PATH)
        ir.async_delete_issue(hass, DOMAIN, ISSUE_ID)
        return
    _LOGGER.info("RESTART_ISSUE: marker EXISTS at %s", MARKER_PATH)

    has_hub_entries = any(
        entry.data.get(CONF_TYPE) == "hub"
        for entry in hass.config_entries.async_entries(DOMAIN)
    )
    _LOGGER.info("RESTART_ISSUE: has_hub_entries=%s", has_hub_entries)

    marker_is_stale = created_at <= _MODULE_IMPORTED_AT
    _LOGGER.info("RESTART_ISSUE: stale=%s (MODULE_IMPORTED_AT=%s)", marker_is_stale, _MODULE_IMPORTED_AT)

    if marker_is_stale and has_hub_entries:
        _LOGGER.info("RESTART_ISSUE: stale+hub → DELETING marker + issue")
        await hass.async_add_executor_job(_delete_restart_marker, MARKER_PATH)
        ir.async_delete_issue(hass, DOMAIN, ISSUE_ID)
        return

    _LOGGER.info("RESTART_ISSUE: CREATING issue")
    ir.async_create_issue(
        hass,
        DOMAIN,
        ISSUE_ID,
        is_fixable=True,
        severity=ir.IssueSeverity.WARNING,
        translation_key=ISSUE_ID,
        translation_placeholders={"name": "ESP Tree"},
    )
