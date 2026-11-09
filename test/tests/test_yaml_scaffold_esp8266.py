from __future__ import annotations

from app.flash_wizard import is_unbuildable_chip, validate_remote_chip_buildable
from app.yaml_scaffold import CHIP_NAME_TO_BOARD, esp8266_ap_password, generate_scaffold

ESP8266_BOARD = CHIP_NAME_TO_BOARD["ESP8266"]
ESP32_C3_BOARD = CHIP_NAME_TO_BOARD["ESP32-C3"]


def _remote_node(**overrides):
    node = {
        "esphome_name": "bench-remote-1",
        "is_bridge": False,
        "chip_name": "ESP8266",
        "board_info": dict(ESP8266_BOARD),
        "espnow_mode": "regular",
        "ap_password": "esp-tree-0123456789ab",
    }
    node.update(overrides)
    return node


def test_esp8266_remote_scaffold_loads_wifi_network_and_ota():
    """The leaf's headers and WiFi calls only exist when those blocks are loaded.

    remote_file_receiver.h includes ESPHome's ESP8266 OTA backend and the component
    calls wifi_set_channel/wifi_get_channel; ESPHome copies a component and links
    ESP8266WiFi only when it is loaded. Dropping any of these three blocks puts the
    build back on "#include ... No such file or directory".
    """
    yaml_text, chip_unknown = generate_scaffold(_remote_node())
    lines = yaml_text.splitlines()

    assert chip_unknown is False
    assert "wifi:" in lines
    assert "captive_portal:" in lines
    assert "network:" in lines
    assert "ota:" in lines
    assert "  - platform: esphome" in lines

    # The component the ESP8266 leaf actually is, and no framework block: ESPHome
    # rejects `framework:` under esp8266: outright.
    assert "espnow_82xx_remote:" in lines
    assert "esp_tree_remote:" not in lines
    assert "  framework:" not in lines
    assert "  board: esp12e" in lines

    # The recovery AP is the device's own and is password protected.
    wifi_at = lines.index("wifi:")
    assert lines[wifi_at + 1] == "  ap:"
    assert lines[wifi_at + 2] == "    ssid: bench-remote-1"
    assert lines[wifi_at + 3] == '    password: "esp-tree-0123456789ab"'


def test_esp32_remote_scaffold_inherits_active_bridge_mode():
    node = _remote_node(
        chip_name="ESP32-C3",
        board_info=dict(ESP32_C3_BOARD),
        espnow_mode="lr",
    )
    node.pop("ap_password")

    regular_lines = generate_scaffold(node, bridge_config={"espnow_mode": "regular"})[0].splitlines()
    lr_lines = generate_scaffold(node, bridge_config={"espnow_mode": "lr"})[0].splitlines()

    assert "  espnow_mode: regular" in regular_lines
    assert "  espnow_mode: lr" in lr_lines
    assert all(block not in regular_lines for block in ("wifi:", "captive_portal:", "network:", "ota:"))


def test_esp32_remote_scaffold_without_bridge_mode_defaults_to_regular():
    node = _remote_node(chip_name="ESP32-C3", board_info=dict(ESP32_C3_BOARD))
    node.pop("ap_password")

    lines = generate_scaffold(node)[0].splitlines()

    assert "  espnow_mode: regular" in lines


def test_esp32_remote_scaffold_stays_espnow_only():
    node = _remote_node(chip_name="ESP32-C3", board_info=dict(ESP32_C3_BOARD), espnow_mode="lr")
    node.pop("ap_password")
    lines = generate_scaffold(node)[0].splitlines()

    for block in ("wifi:", "captive_portal:", "network:", "ota:"):
        assert block not in lines
    assert "esp_tree_remote:" in lines


def test_esp8266_ap_password_is_stable_when_the_node_record_is_missing_one():
    first = esp8266_ap_password({"esphome_name": "bench-remote-1"})
    second = esp8266_ap_password({"esphome_name": "bench-remote-1"})
    assert first == second
    assert first.startswith("esp-tree-")
    assert len(first) >= 12
    assert first != esp8266_ap_password({"esphome_name": "bench-remote-2"})


def test_esp8266_remote_is_not_refused_by_the_wizard():
    assert is_unbuildable_chip("ESP8266", ESP8266_BOARD) is False
    validate_remote_chip_buildable("ESP8266", ESP8266_BOARD)  # must not raise
