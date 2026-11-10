"""The active bridge's ESP-NOW mode drives what every new remote is built as.

`_get_active_bridge_espnow_mode` used to parse the bridge config with
`yaml.safe_load`, which raises for `!secret` - the tag every scaffold this add-on
writes uses for its credentials. The lookup therefore reported "active bridge YAML
is invalid" for every real bridge, and the remote wizard, the flash wizard and
scaffold regeneration all refused to proceed. These tests parse the actual
`generate_scaffold` output rather than a hand-written YAML sample, so a scaffold
change that reintroduces the problem fails here.
"""

from __future__ import annotations

import pytest
import yaml
from fastapi import HTTPException

from app.server import _get_active_bridge_espnow_mode
from app.yaml_scaffold import CHIP_NAME_TO_BOARD, generate_scaffold
from app.yaml_store import YAMLStore, load_esphome_config

ESP32_BOARD = CHIP_NAME_TO_BOARD["ESP32-C6"]
BRIDGE_NAME = "esp-tree-bridge-1"


class _FakeDB:
    """Minimal stand-in for Database: only the two lookups the helper performs."""

    def __init__(self, name: str = BRIDGE_NAME, mac: str | None = None, esphome_name: str | None = None):
        self._bridge = {"name": name, "mac": mac or ""}
        self._device = {"esphome_name": esphome_name} if esphome_name else None

    def get_active_bridge(self) -> dict:
        return dict(self._bridge)

    def get_device(self, mac: str) -> dict | None:
        return self._device


def _store(tmp_path, content: str, name: str = BRIDGE_NAME) -> YAMLStore:
    store = YAMLStore(tmp_path)
    store.save_config(name, content)
    return store


def _bridge_scaffold(espnow_mode: str) -> str:
    node = {
        "esphome_name": BRIDGE_NAME,
        "is_bridge": True,
        "chip_name": "ESP32-C6",
        "board_info": dict(ESP32_BOARD),
        "espnow_mode": espnow_mode,
        "api_key": "!secret bridge_api_key",
        "web_server_port": 80,
        "wifi_ssid_secret": "wifi_ssid",
        "wifi_password_secret": "wifi_password",
    }
    content, _ = generate_scaffold(node)
    return content


def test_generated_bridge_scaffold_contains_secret_tags():
    """Guard the precondition: if scaffolds stop using !secret, these tests are moot."""
    assert "!secret espnow_psk" in _bridge_scaffold("lr")


def test_generated_lr_bridge_reads_back_as_lr(tmp_path):
    store = _store(tmp_path, _bridge_scaffold("lr"))
    assert _get_active_bridge_espnow_mode(_FakeDB(), store) == "lr"


def test_generated_regular_bridge_reads_back_as_regular(tmp_path):
    store = _store(tmp_path, _bridge_scaffold("regular"))
    assert _get_active_bridge_espnow_mode(_FakeDB(), store) == "regular"


def test_mode_is_looked_up_by_device_esphome_name_when_bridge_name_has_no_config(tmp_path):
    """Activation can record a name that has no file; the device row is the fallback."""
    store = _store(tmp_path, _bridge_scaffold("lr"))
    db = _FakeDB(name="stale-name", mac="AA:BB:CC:DD:EE:FF", esphome_name=BRIDGE_NAME)
    assert _get_active_bridge_espnow_mode(db, store) == "lr"


def test_legacy_espnow_bridge_block_is_still_understood(tmp_path):
    content = "esphome:\n  name: old-bridge\nespnow_bridge:\n  psk: !secret espnow_psk\n  espnow_mode: lr\n"
    store = _store(tmp_path, content)
    assert _get_active_bridge_espnow_mode(_FakeDB(), store) == "lr"


def test_missing_mode_defaults_to_regular_rather_than_failing(tmp_path):
    """The component defaults the key, so a hand-edited config without it is not corrupt."""
    content = "esphome:\n  name: b\nesp_tree_bridge:\n  psk: !secret espnow_psk\n"
    store = _store(tmp_path, content)
    assert _get_active_bridge_espnow_mode(_FakeDB(), store) == "regular"


def test_unsupported_mode_is_reported(tmp_path):
    content = "esp_tree_bridge:\n  espnow_mode: turbo\n"
    store = _store(tmp_path, content)
    with pytest.raises(HTTPException) as excinfo:
        _get_active_bridge_espnow_mode(_FakeDB(), store)
    assert excinfo.value.status_code == 400
    assert "turbo" in str(excinfo.value.detail)


def test_genuinely_invalid_yaml_is_still_rejected(tmp_path):
    """The fix must not turn a real parse error into a silent default."""
    store = _store(tmp_path, "esp_tree_bridge:\n  espnow_mode: [unclosed\n")
    with pytest.raises(HTTPException) as excinfo:
        _get_active_bridge_espnow_mode(_FakeDB(), store)
    assert excinfo.value.status_code == 400
    assert "invalid" in str(excinfo.value.detail)


def test_missing_config_still_reports_missing(tmp_path):
    store = YAMLStore(tmp_path)
    with pytest.raises(HTTPException) as excinfo:
        _get_active_bridge_espnow_mode(_FakeDB(), store)
    assert excinfo.value.status_code == 400
    assert "missing" in str(excinfo.value.detail)


# ── the loader itself ──────────────────────────────────────────────────────────


def test_load_esphome_config_resolves_secret_to_its_name():
    parsed = load_esphome_config("esp_tree_bridge:\n  psk: !secret espnow_psk\n  espnow_mode: lr\n")
    assert parsed["esp_tree_bridge"] == {"psk": "espnow_psk", "espnow_mode": "lr"}


def test_load_esphome_config_always_returns_a_mapping():
    assert load_esphome_config("") == {}
    assert load_esphome_config("just a scalar\n") == {}
    assert load_esphome_config("- 1\n- 2\n") == {}


def test_load_esphome_config_rejects_real_syntax_errors():
    with pytest.raises(yaml.YAMLError):
        load_esphome_config("esp_tree_bridge:\n  espnow_mode: [unclosed\n")


def test_merge_secrets_tolerates_a_secret_tag(tmp_path):
    """merge_secrets used plain safe_load and would 500 on a tagged secrets file."""
    store = YAMLStore(tmp_path)
    store.save_secrets("espnow_psk: existing\nwifi_ssid: !secret nowhere\n")
    store.merge_secrets({"espnow_network_id": "tree-1234"})

    reread = load_esphome_config(store.get_secrets())
    assert reread["espnow_network_id"] == "tree-1234"
    assert reread["espnow_psk"] == "existing"
