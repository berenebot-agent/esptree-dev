from __future__ import annotations

import struct

from app.bin_parser import ESP_IMAGE_MAGIC, parse_firmware
from app.preflight import preflight_comparison


def _esp8266_image(flash_nibble: int = 0x4, size: int = 4096) -> bytes:
    """A minimal ESP8266 image: 0xE9, segments, flash mode, size/freq, entry, then
    a segment load address (0x4010xxxx) where an ESP32 image would carry 0xEEEE."""
    header = bytes([ESP_IMAGE_MAGIC, 0x02, 0x03, (flash_nibble << 4) | 0x0F])
    header += struct.pack("<I", 0x40100000)
    return header + b"\x00" * (size - len(header))


def _esp32_image() -> bytes:
    header = bytes([ESP_IMAGE_MAGIC, 0x02, 0x02, 0x60])
    header += struct.pack("<I", 0x00001000)  # entry point
    header += b"\xee\xee"  # extended header magic
    header += bytes([0x00, 0x00])  # extended header count
    header += struct.pack("<H", 0x0005)  # chip id: ESP32-C3
    return header + b"\x00" * (4096 - len(header))


def test_esp8266_image_is_recognised_and_reports_flash_size(tmp_path):
    path = tmp_path / "esp8266.ota.bin"
    path.write_bytes(_esp8266_image(flash_nibble=0x4))
    info = parse_firmware(path)

    assert info.valid is True
    assert info.chip_name == "ESP8266"
    assert info.chip_type == 0x8266
    # No app descriptor exists on this platform; that is what the UI must say.
    assert info.metadata_unavailable is True
    assert info.flash_size == "4M"


def test_one_megabyte_esp8266_image_decodes_as_1m(tmp_path):
    path = tmp_path / "esp8266-1m.bin"
    path.write_bytes(_esp8266_image(flash_nibble=0x2))
    assert parse_firmware(path).flash_size == "1M"


def test_esp32_image_still_uses_the_chip_id(tmp_path):
    path = tmp_path / "esp32c3.bin"
    path.write_bytes(_esp32_image())
    info = parse_firmware(path)

    assert info.chip_name == "ESP32-C3"
    assert info.flash_size is None


def test_one_megabyte_module_warns_that_ota_cannot_fit(tmp_path):
    path = tmp_path / "esp8266-1m.bin"
    path.write_bytes(_esp8266_image(flash_nibble=0x2))
    info = parse_firmware(path).as_dict()

    preflight = preflight_comparison({}, info)

    assert preflight["metadata_unavailable"] is True
    assert preflight["flash_size"] == "1M"
    assert preflight["has_warnings"] is True
    assert any("1 MB" in warning for warning in preflight["warnings"])


def test_four_megabyte_module_does_not_warn(tmp_path):
    path = tmp_path / "esp8266-4m.bin"
    path.write_bytes(_esp8266_image(flash_nibble=0x4))

    preflight = preflight_comparison({}, parse_firmware(path).as_dict())

    assert preflight["flash_size"] == "4M"
    assert preflight["has_warnings"] is False
