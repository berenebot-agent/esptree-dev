# Native ESP-IDF serial bridge (experimental, multi-target)

**One source tree, seven ESP32 chip targets.** The same native serial bridge code
compiles for `esp32`, `esp32s2`, `esp32s3`, `esp32c2`, `esp32c3`, `esp32c5` and
`esp32c6`. The target selects the toolchain, the Wi-Fi radio implementation and
the default UART pins. **You still need a separate .bin for each chip**: ESP32
images are not universal.

This is an **isolated development implementation**, not a replacement for the
existing ESPHome bridge. The add-on, integration, ESPHome bridge firmware and
remote firmware are unchanged.

**Status: builds clean for all seven targets, nothing flashed.** Compilation was
verified against upstream ESP-IDF v5.5.4 — the version this repo's ESPHome
firmware is built against — with its stock `-Wall -Wextra -Werror`. Every target
builds with **zero errors** and links inside the configured app partition, and
every target now also compiles the shared bridge sources that previously failed
under those flags. The only remaining diagnostics are `-Wunused-function` /
`-Wunused-variable` in code paths the serial build compiles out (ESP-IDF marks
those `-Wno-error`); ESPHome's PlatformIO toolchain comments `-Wall` out
entirely, which is why they were invisible there. No binary has been flashed and
no radio or serial link has been exercised, so treat this as compiled code, not a
validated bridge.

## Hardware and targets

| ESP-IDF target | Default UART0 TX | Default UART0 RX | Image | App partition free |
| --- | ---: | ---: | ---: | ---: |
| `esp32` | GPIO1 | GPIO3 | 937,056 B | 39% |
| `esp32s2` | GPIO43 | GPIO44 | 900,016 B | 41% |
| `esp32s3` | GPIO43 | GPIO44 | 930,256 B | 39% |
| `esp32c2` | GPIO20 | GPIO19 | 825,344 B | 46% |
| `esp32c3` | GPIO21 | GPIO20 | 969,216 B | 37% |
| `esp32c5` | GPIO11 | GPIO12 | 1,049,760 B | 32% |
| `esp32c6` | GPIO16 | GPIO17 | 999,024 B | 35% |

Sizes are the release flavour with the defaults in `sdkconfig.defaults` (4 MB
flash, single 1.5 MB factory app partition). C5 is the tightest at 32% free; C2
is the smallest image and fits comfortably despite its small SRAM.

These pins are the **silicon UART0 defaults** already listed in
`docs/BOARD_MATRIX.md` and `app/yaml_scaffold.py` (`UART0_PINS_BY_VARIANT`), i.e.
what the add-on's serial wizard emits. They are **not guaranteed to be exposed
or wired** on a given dev board: a board whose USB-UART bridge sits on GPIO1/GPIO3
must override TX=1, RX=3 in `idf.py menuconfig` — there is no automatic fallback.

Only **hardware UART + USB-to-UART adapters** are implemented; USB CDC and
USB-Serial-JTAG need a different transport adapter. ESP32-H2 and ESP32-P4 have no
integrated Wi-Fi and are rejected at compile time; ESP8266 needs a different SDK
and is not an ESP-IDF target here. ESP32-C61 and newer targets can be added once
the board map and radio are validated.

## Build (ESP-IDF 5.4+)

Load ESP-IDF, then name the **chip target**:

```bash
. /path/to/esp-idf/export.sh
cd device_code/native_serial_bridge

# First build of a target: sets the target and creates sdkconfig.<chip>
./build.sh esp32c5

# Fill in network ID, 64-hex PSK, API key, regular/LR mode, channel and pins:
idf.py -B build-esp32c5 -DSDKCONFIG=sdkconfig.esp32c5 menuconfig

# Rebuild (target inferred from the one configured sdkconfig in this directory):
./build.sh

# Flash only after the pins are confirmed against the physical board:
idf.py -B build-esp32c5 -DSDKCONFIG=sdkconfig.esp32c5 -p /dev/ttyUSB0 flash
```

Each target keeps its own `sdkconfig.<chip>` and `build-<chip>/` tree, so building
several targets in one checkout never resets another target's credentials.
`./build.sh` with no argument infers the target when exactly one
`sdkconfig.<chip>` exists and refuses to guess otherwise. A legacy single
`sdkconfig` from an earlier revision is never overwritten with a different
target. `sdkconfig.*` (except the tracked `*.defaults`) and `build*/` are
gitignored and must stay private: compiled firmware contains the PSK and API key.

### Debug flavour

The data UART is binary-only, so a release build that refuses to boot looks
exactly like a dead board. For bring-up:

```bash
./build.sh --debug esp32c5          # -> build-esp32c5-debug/, sdkconfig.esp32c5.debug
idf.py -B build-esp32c5-debug -DSDKCONFIG=sdkconfig.esp32c5.debug -p /dev/ttyUSB0 flash
idf.py -B build-esp32c5-debug -DSDKCONFIG=sdkconfig.esp32c5.debug monitor
```

It puts the console and logs on UART0 at 115200 and reports why the firmware
refused to start (missing credentials, failed bridge setup, channel read-back
mismatch). It is **not usable with the add-on**: that link is COBS/protobuf at
460800. Verified: the release image contains no failure strings at all, the debug
image does.

## Tests

```bash
IDF_PATH=/path/to/esp-idf ./dev.sh native-test
```

Host-only: no target, no hardware. It compiles ESP-IDF's cJSON plus the compat
shim and the COBS codec for the host and checks:

- COBS framing round-trips (empty payload, zeros, the 254/255/256-byte block
  boundaries, random payloads, and no `0x00` in the encoded output).
- JSON command parsing: string/int/bool typing, nested objects, malformed and
  non-object roots, and that a fractional `speed_level` is rejected instead of
  truncated.
- The Kconfig UART pin defaults still match `app/yaml_scaffold.py` for all seven
  targets, and `build.sh` never silently selects a target.

## Architecture

The native application compiles the **production sources directly**, rather than
duplicating the mesh protocol:

- ESP-NOW radio/mesh, session crypto, joins, topology, entities and commands
- the existing serial Protobuf v2 API with COBS framing and HMAC authentication
- remote state receipts, event handling and the ESP-NOW remote OTA manager

A small compatibility layer under `main/compat/` implements only the ESPHome
services those sources reference: clock, scheduler, application name, UART and
JSON. Wi-Fi STA is initialised **without joining an AP**; the radio still runs
ESP-NOW on the configured 2.4 GHz channel.

Two consequences worth knowing:

- The serial transport path in `esp_tree_bridge.cpp` is selected by
  `USE_SERIAL=1`. An include that only the Wi-Fi/web builds need
  (`esphome/components/network/ip_address.h`) is now guarded by the same macro,
  so the serial build does not have to fake an ESPHome network stack.
- `ESPTreeBridge` owns `unique_ptr` members whose pointed-to types are defined
  only in its own translation unit, so it is allocated with `new` and never
  destroyed here — exactly what ESPHome's generated code does. A namespace-scope
  instance would fail on an incomplete type.

The UART runs at 460800 and is **binary-only**: the console and application
logging are compiled out (`CONFIG_ESP_CONSOLE_NONE`, `CONFIG_LOG_MAXIMUM_LEVEL=0`).
ROM boot messages can still appear during reset, so a host must tolerate
malformed/partial frames — the add-on's serial client already resynchronises on
the `0x00` delimiter.

Regular ESP-NOW is the default because ESP8266 leaves need it; LR is opt-in and
only for compatible radios (a bench network of LR remotes needs
`ESP_TREE_RADIO_LR=y`). The channel is fixed at the configured value (default 11)
and is written to the driver before the protocol loop starts, with a read-back
check: a bridge left on the wrong channel still answers the add-on and still
reports online while hearing nothing on air. Switching channel or PHY mode
requires a rebuild.

## Validation gates before integration or production use

1. ~~Compile against the real ESP-IDF toolchain for each intended chip.~~ Done
   for all seven targets with ESP-IDF 5.5.4.
2. Confirm physical UART pins, 460800 baud COBS/protobuf framing, HMAC
   authentication, ClientHello, snapshot, ping/pong and reconnect against the
   add-on.
3. Verify joins, state receipts and commands for ESP32 regular-mode leaves, then
   ESP8266 on the same channel.
4. Validate LR against LR remotes, and remote ESP-NOW OTA end to end.
5. Exercise sustained serial/ESP-NOW traffic, memory pressure and reset recovery.
6. Only then integrate a target-aware native option into the add-on wizard.

## Files

- `main/main.cpp`: native entry, config checks, UART, radio channel setup
- `main/Kconfig.projbuild`: per-target UART pin defaults, PHY mode, channel, keys
- `main/CMakeLists.txt`: production protocol, serial API, OTA and radio sources
- `main/compat/`: isolated ESPHome compatibility adapters
- `sdkconfig.defaults`, `sdkconfig.debug.defaults`: release and bring-up defaults
- `build.sh`: per-target config/build trees, `--debug` flavour
- `tests/run_host_tests.sh`, `tests/shim_selftest.cpp`: host-side shim/COBS tests
- `tests/test_target_defaults.py`: Kconfig pins vs the repository board map
