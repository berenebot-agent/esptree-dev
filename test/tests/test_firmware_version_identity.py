"""What the image's app descriptor is allowed to claim about the firmware version.

`app_version` in the descriptor is `PROJECT_VER`. A project build sets it to the
project's own version; a project-less ESPHome build leaves it at the *toolchain*
version. No scaffold in this repo emits `esphome: project:`, so treating the raw
field as the device's firmware version put "2026.6.5" (the esphome version) on a
bridge's job card as if it were the firmware's identity.
"""

from __future__ import annotations

from pathlib import Path

from app.bin_parser import APP_DESC_MAGIC, ESP_IMAGE_MAGIC, parse_firmware


def _image(tmp_path: Path, *, app_version: str, project_name: str, idf_version: str = "v5.5.4") -> Path:
    """A minimal ESP app image: header, app descriptor at offset 32."""
    desc = 32
    data = bytearray(desc + 160)
    data[0] = ESP_IMAGE_MAGIC
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


def test_a_project_build_keeps_its_own_version(tmp_path: Path) -> None:
    info = parse_firmware(_image(tmp_path, app_version="1.4.2", project_name="esp_tree"))

    assert info.project_name == "esp_tree"
    assert info.parsed_version == "1.4.2"


def test_the_build_date_is_read_from_the_descriptor(tmp_path: Path) -> None:
    info = parse_firmware(_image(tmp_path, app_version="1.4.2", project_name="esp_tree"))

    assert info.formatted_build_date == "Nov  6 2026 22:11:56"
    assert info.chip_name == "ESP32-C3"
