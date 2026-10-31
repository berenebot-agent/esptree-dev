# Native ESP-IDF serial bridge (experimental)

This is an **isolated development implementation** of the ESP Tree ESP32-C5
serial bridge. It leaves existing ESPHome bridge firmware, add-on, integration,
and all existing development/build paths unchanged.

**Status: unverified prototype.** No ESP32-C5 hardware test or actual ESP-IDF
compile was possible in the authoring environment. This is source code, **not
a verified flashable firmware release**. Do not flash a production bridge
before completing the validation checklist.

## Design

The new ESP-IDF application builds the production source files directly:

- ESP-NOW mesh protocol, radio routing, session crypto and schema handling
- serial Protobuf v2 API with COBS framing and HMAC authentication
- topology snapshots, remote state events, commands and state receipts
- existing remote-node ESP-NOW OTA manager

It replaces ESPHome's Wi-Fi, UART, lifecycle, logging and JSON service
dependencies with **small local compatibility adapters**. It does not copy
or fork the protocol implementation.

An ESP32 still needs its Wi-Fi driver to operate ESP-NOW, but no Wi-Fi
association, MQTT, TCP/IP transport, or ESPHome device runtime is required.

## Requirements

- ESP-IDF 5.4+ with ESP32-C5 target installed.
- ESP32-C5 devkit with a compatible USB-to-UART adapter.
- ESP Tree add-on configured with a **serial** bridge and matching API key.
- Remote nodes configured with matching ESP-NOW network ID, 64-hex PSK,
  PHY mode, and radio channel.

## Build and flash (development hardware only)

```bash
. /path/to/esp-idf/export.sh
cd device_code/native_serial_bridge
idf.py set-target esp32c5
idf.py menuconfig
# Set network ID, PSK and serial API key under:
#   ESP Tree Native Serial Bridge (experimental)
idf.py build
idf.py -p /dev/ttyUSB0 flash
```

For subsequent builds: `bash build.sh`.

Do not commit `sdkconfig` or any compiled firmware containing your PSK.
The `.gitignore` in this folder excludes build artefacts and local settings.

### UART and logs

Default reference wiring is **UART0, 460800 baud, TX GPIO1 / RX GPIO3**,
matching `device_code/demos/espnow-bridge-c5-serial.yml`. This is a
**binary-only port**: ESP-IDF console and application/bootloader logging
are disabled in `sdkconfig.defaults` to avoid injecting text into the
COBS/protobuf stream. ROM startup messages may still be emitted on reset.

The existing add-on `app/bridge_serial_client.py` speaks the same
binary transport and handles keepalive, authentication, snapshots, commands,
state receipts and remote OTA.

### Radio

The bridge initialises Wi-Fi STA solely for ESP-NOW, without joining an AP,
then selects the configured fixed channel (default **11**).

- **Regular mode**: required for ESP8266 remotes. Match their softAP channel.
- **Long Range mode**: only for compatible ESP32 radios/remotes.
- The channel is fixed at boot; no auto-scanning or channel negotiation.

### Validation before enabling in the add-on wizard

1. Compile with ESP-IDF 5.4+ for `esp32c5`; review and fix any API or
   toolchain-version errors.
2. Verify UART framing on the actual C5, HMAC authentication, full snapshot,
   ping/pong, fresh ClientHello, timeout and reconnect.
3. Verify ESP32 regular mode joins, state receipt/ack, commands and topology;
   then ESP8266 channel 11 joins; then compatible ESP32 LR nodes.
4. Verify end-to-end remote OTA, transfer interruptions, rejoin and rollback.
5. Run sustained frame throughput tests (460800 baud), watch RX overflow,
   RAM, stuck sessions and reset behaviour.
6. Only after these pass, add a native firmware option to the add-on
   compiler and new-bridge wizard.

## Boundaries

- First target is **ESP32-C5 hardware UART**. Native USB CDC is not included.
- No Wi-Fi/MQTT upstream or bridge over-the-air update; flash the bridge
  physically when updating its firmware.
- Credentials compile into firmware (as for the existing ESPHome builds).
- `main/compat` is a deliberately limited compatibility shim, not a general
  ESPHome implementation.
- No changes to the existing firmware or Home Assistant integration.

## Source map

- `main/main.cpp`: native entry point and radio/channel/serial setup.
- `main/CMakeLists.txt`: references existing bridge/protocol/OTA sources.
- `main/compat/`: ESPHome clock, scheduler, name, logs, UART and JSON adapters.
- `main/Kconfig.projbuild`: selectable credentials, mode, channel, pins.
