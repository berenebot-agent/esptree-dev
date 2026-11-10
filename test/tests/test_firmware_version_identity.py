"""What the image's app descriptor is allowed to claim about the firmware version.

`app_version` in the descriptor is `PROJECT_VER`. A project build sets it to the
project's own version; a project-less ESPHome build leaves it at the *toolchain*
version. No scaffold in this repo emits `esphome: project:`, so treating the raw
field as the device's firmware version put "2026.6.5" (the esphome version) on a
bridge's job card as if it were the firmware's identity.

`project_name` is not empty in such an image either: PlatformIO writes the build
environment's name there (the ESPHome node name), so the guard has to look at the
name's shape - ESPHome's documented `author.project` form - rather than at whether
it is present.
"""

from __future__ import annotations

import re
from pathlib import Path

from app.bin_parser import APP_DESC_MAGIC, ESP_IMAGE_MAGIC, parse_firmware

ROOT = Path(__file__).resolve().parents[2]


def _image(tmp_path: Path, *, app_version: str, project_name: str, idf_version: str = "v5.5.4") -> Path:
    """A minimal ESP app image: header, app descriptor at offset 32.

    The image header is a real ESP32 one - an entry point at offset 4 and the 0xEEEE
    extended-header magic at offset 8 - so the ESP8266 detector does not claim it.
    """
    desc = 32
    data = bytearray(desc + 160)
    data[0] = ESP_IMAGE_MAGIC
    data[1] = 0x02  # segment count
    data[2] = 0x02  # SPI mode
    data[3] = 0x60  # flash size / frequency
    data[4:8] = (0x40380000).to_bytes(4, "little")  # entry point
    data[8:10] = b"\xee\xee"  # extended-header magic
    data[12:14] = (0x0005).to_bytes(2, "little")  # ESP32-C3
    data[desc : desc + 4] = APP_DESC_MAGIC

    def put(offset: int, text: str, size: int) -> None:
        raw = text.encode("utf-8")[: size - 1]
        data[desc + offset : desc + offset + len(raw)] = raw

    put(16, app_version, 32)
    put(48, project_name, 32)
    put(80, "22:11:56", 16)
    put(96, "Nov  6 2026", 16)
    put(112, idf_version, 32)

    path = tmp_path / "firmware.ota.bin"
    path.write_bytes(bytes(data))
    return path


def test_a_projectless_image_claims_no_firmware_version(tmp_path: Path) -> None:
    info = parse_firmware(_image(tmp_path, app_version="2026.6.5", project_name=""))

    # The toolchain version is still visible, but it is not the firmware's version.
    assert info.app_version == "2026.6.5"
    assert info.parsed_version == ""


def test_the_platformio_env_name_is_not_a_project_name(tmp_path: Path) -> None:
    # What an image built from this repo's scaffold actually carries: PlatformIO
    # names the project after the build environment, not after a `project:` block.
    info = parse_firmware(_image(tmp_path, app_version="2026.6.5", project_name="espnow-bridge-c3"))

    assert info.project_name == "espnow-bridge-c3"
    assert info.parsed_version == ""


def test_a_project_build_keeps_its_own_version(tmp_path: Path) -> None:
    info = parse_firmware(_image(tmp_path, app_version="1.4.2", project_name="esptree.remote"))

    assert info.project_name == "esptree.remote"
    assert info.parsed_version == "1.4.2"


def test_the_build_date_is_read_from_the_descriptor(tmp_path: Path) -> None:
    info = parse_firmware(_image(tmp_path, app_version="1.4.2", project_name="esptree.remote"))

    assert info.formatted_build_date == "Nov  6 2026 22:11:56"
    assert info.chip_name == "ESP32-C3"


def test_the_firmware_version_tracks_the_addon_release() -> None:
    """The version a node reports is the add-on release its components shipped in."""
    header = (ROOT / "device_code/components/esp_tree_common/esp_tree_version.h").read_text(encoding="utf-8")
    matches = re.findall(r'#define ESP_TREE_VERSION "([^"]+)"', header)
    assert len(matches) == 1, "esp_tree_version.h must define ESP_TREE_VERSION exactly once"
    firmware = matches[0]

    config = (ROOT / "config.yaml").read_text(encoding="utf-8")
    addon = re.search(r"^version: (\S+)$", config, re.MULTILINE)
    assert addon is not None, "config.yaml has no version line"
    assert firmware == addon.group(1), (
        "esp_tree_version.h and config.yaml disagree — the release script bumps both"
    )

    # The ESP-NOW identity descriptor carries the version in a fixed 16-byte field.
    assert len(firmware) <= 15, "ESP_TREE_VERSION must fit ESPNOW_PROJECT_VERSION_LEN (16)"
