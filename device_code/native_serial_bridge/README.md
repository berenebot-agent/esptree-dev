# Native ESP-IDF serial bridge (experimental, multi-target)

**One source tree, several ESP32 chip targets.** The same native serial bridge
code can be compiled for `esp32`, `esp32s2`, `esp32s3`, `esp32c2`,
`esp32c3`, `esp32c5`, and `esp32c6`. The target selects an appropriate
toolchain, Wi-Fi radio implementation, and default UART pins. **You still need
a separate .bin for each chip**: ESP32 binaries are not universal.

This is an **isolated development implementation**, not a replacement for the
existing ESPHome bridge. The add-on, integration, ESPHome bridge firmware, and
remote firmware are unchanged.

**Status: source-only prototype; not verified to compile or run on any target.**
There has been no target-specific ESP-IDF compilation or physical radio/serial
validation. Do not flash a production bridge until the checklist passes.

## Hardware and targets

Supported *source targets*, subject to ESP-IDF version and hardware testing:

| ESP-IDF target | Default UART0 TX | Default UART0 RX | Radio |
| --- | ---: | ---: | --- |
| `esp32` | GPIO1 | GPIO3 | Regular, LR if supported |
| `esp32s2` | GPIO43 | GPIO44 | Regular; verify LR on hardware |
| `esp32s3` | GPIO43 | GPIO44 | Regular, LR if supported |
| `esp32c2` | GPIO20 | GPIO19 | Regular; verify LR on hardware |
| `esp32c3` | GPIO21 | GPIO20 | Regular, LR if supported |
| `esp32c5` | GPIO11 | GPIO12 | Regular, LR if supported |
| `esp32c6` | GPIO16 | GPIO17 | Regular, LR if supported |

These are the **silicon UART0 default pins** already listed in
`docs/BOARD_MATRIX.md` and `app/yaml_scaffold.py`. They are **not guaranteed
to be exposed or connected** on an individual dev board. For example, the
existing C5 serial demonstration uses an alternate GPIO1/GPIO3 routing: if
you use that wiring, explicitly set TX=1, RX=3 in `idf.py menuconfig` instead
of using the native project's C5 defaults (GPIO11/GPIO12).

Only **hardware UART + USB-to-UART adapters** are implemented currently;
USB CDC / USB-Serial-JTAG require a different transport adapter.
The ESP32-H2 and ESP32-P4 have no integrated Wi-Fi for this purpose and are
not valid standalone ESP-NOW bridges. ESP8266 firmware requires a different
SDK and is not an ESP-IDF target here. ESP32-C61 and other newer targets can
be added after validation and an updated board pin mapping.

## Build (ESP-IDF 5.4+)

Load ESP-IDF and choose the **target chip**, not a particular board:

```bash
. /path/to/esp-idf/export.sh
cd device_code/native_serial_bridge

# FIRST build: choose one of the targets above (example uses C3)
./build.sh esp32c3

# Fill out ESP Tree Native Serial Bridge settings:
idf.py menuconfig

# Rebuild with your configured network ID, 64-character hex PSK, API key,
# regular/LR mode, channel and board UART pins:
./build.sh

# Flash only after the build and physical pin configuration are verified:
idf.py -p /dev/ttyUSB0 flash
```

Or use `idf.py set-target esp32s3`, `idf.py menuconfig`, `idf.py build`
directly. This is the same project for all supported targets.

**Important:** Changing target using `idf.py set-target` can reset your local
configuration and credentials. `build.sh` refuses a target mismatch with an
existing `sdkconfig`; keep separate working copies per target or save the
settings and build artefacts before resetting. `sdkconfig` and `build/` are
gitignored and must stay private because compiled firmware contains the PSK
and API key.

```bash
python3 -m unittest discover -s tests -v
```

The included source-level test compares the seven Kconfig UART defaults with
the existing ESP Tree board map. It is **not a substitute for an IDF build**.

## Architecture

The native application compiles the **production sources directly**, rather
than duplicating the mesh protocol:

- ESP-NOW radio/mesh, encryption, joins, topology, entities and commands
- existing serial Protobuf v2 API, COBS framing and HMAC authentication
- remote state receipts, event handling, and ESP-NOW remote-node OTA manager

A minimal compatibility layer implements only the ESPHome services referenced
by that code: clock, scheduler, name, UART, logging and JSON. Wi-Fi STA is
initialised **without associating with a Wi-Fi AP**; the radio still operates
ESP-NOW at the configured 2.4GHz channel.

The hardware UART defaults to 460800 baud and is **binary-only**. The ESP-IDF
console and normal logging are disabled to avoid corrupting COBS frames.
ROM boot messages may still appear during a reset; a host must tolerate such
malformed/partial frames.

Regular ESP-NOW is required for ESP8266 leaves and their fixed channel must
match the bridge (channel 11 by default). LR is an opt-in setting for hardware
that supports the proprietary PHY; do not assume every listed chip supports it.
Switching channels or PHY mode requires a rebuild/reflash.

## Validation gates before integration or production use

1. Compile against the real ESP-IDF toolchain **for each intended chip**.
2. Confirm physical UART pins, 460800baud COBS/protobuf framing, HMAC
   authentication, ClientHello, snapshot, ping/pong and reconnect.
3. Verify joins and discovery for ESP32 regular-mode leaves, including state
   delivery receipts and commands; then ESP8266 on the same channel.
4. Independently validate LR on compatible chips, and remote ESP-NOW OTA.
5. Exercise sustained serial/ESP-NOW traffic, memory pressure and reset recovery.
6. Only then integrate a target-aware native option into the add-on wizard.

## Files

- `main/main.cpp`: native entry, config checks, serial and radio channel setup
- `main/Kconfig.projbuild`: per-target UART pin defaults, PHY and keys
- `main/CMakeLists.txt`: common protocol, serial API, OTA and radio sources
- `main/compat/`: small, isolated ESPHome compatibility adapters
- `build.sh`: explicitly selects a chip and protects existing sdkconfig
- `tests/test_target_defaults.py`: checks target pin defaults against the
  repository's existing board map

There are **no changes** to existing firmware, add-on UI or HA integration.
