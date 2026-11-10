# Changelog

This file documents released behaviour. Entries were maintained only up to
`0.1.38`; the add-on has since reached `0.1.309` and the intervening releases
are not itemised here. Rather than backfill ~270 versions, the release history
lives in `git log` — treat that as authoritative for what changed and when.
Future releases should add an entry here.

## Unreleased

- **An image is only called an ESP8266 when its header proves it.** The ESP8266 detector fired on the mere absence of the `0xEEEE` extended header at offset 8, so an image whose header was truncated, synthetic or otherwise incomplete was reported as an ESP8266 — with an invented chip name and a flash size decoded from a byte that meant nothing. The check is now positive about the ESP8266 header shape: no extended header, a segment count of 1–16 in byte 1, and an entry point in the `0x4010xxxx` range at offset 4. Anything else keeps its ESP32 chip id. This is what made `test_firmware_version_identity.py` fail: its minimal ESP32 fixture carried only the chip id, so the parser took it for an ESP8266 and the app descriptor was never read. The fixture now builds a real ESP32 header (entry point plus extended-header magic), and a regression test pins the no-extended-header case to the chip id.

- **Choosing the USB device is no longer silent, and no longer guesses.** Add Remote's *Detect from USB* reused any single port Chrome had already granted without showing a chooser — so with three boards on the desk it could open the wrong one, and a board plugged in for the first time is invisible to `getPorts()` anyway. The port decision is now explicit: exactly one live grant is reused silently, and every other case (none, several, or *Choose a different device…*) opens the native chooser, which is the only surface that lists ungranted boards. Both detection and flashing name the device they are using (`USB 303a:1001`, from the descriptor — Web Serial exposes nothing richer), so "the selected USB device" is checkable. A dismissed chooser now says so instead of resetting the spinner in silence, and a chooser blocked for want of a user gesture reports "click the USB button again" rather than Chrome's raw `SecurityError` text. A held port that can no longer be opened (board unplugged, or re-enumerated after a reset) falls back to the chooser instead of failing with an opaque "Failed to open serial port". The same fixes apply wherever a USB device is selected: the bridge setup wizard, the remote wizard, and the device page's *Flash by USB*.

## 0.1.361

- **An ESP8266 image is now recognised as ESP8266, with its flash size.** `bin_parser` read the ESP32 chip-id field unconditionally, so every ESP8266 build came back `Unknown 0x….` and its flash size — the one number that decides whether an ESP-NOW OTA can fit — was never read. Images are now told apart by the missing `0xEEEE` extended header, the size is decoded from header byte 3, and a 1 MB module (ESP-01S class) raises a preflight warning that it can only be reflashed over USB instead of failing after the transfer.

- **An ESP8266 leaf now reports the MD5 of the image it is actually running.** `remote_protocol.cpp` left `firmware_md5` all zeros on that platform and sent the compile time of one translation unit (`__DATE__`) as the "build" — so an ESP-NOW OTA could never be confirmed, only called unverified. It now hashes the running sketch with `ESP.getSketchMD5()` once per boot, which is the same digest the add-on records for the `.ota.bin` (`ota_jobs.ota_md5`) and, on ESP8266, the same bytes as the `.bin`/`.factory.bin`. The date/time remain a human-readable fallback.
- **No more invented signal strength on ESP8266.** Setting up a parent used to seed `-40 dBm  // assume good link`, which was published as a real reading and could keep a link that never measured anything looking healthy (and, before the floor check was guarded, drive topology refreshes every tick). The leaf now keeps the internal "no reading" sentinel and publishes the wire value `0`, which the UI already renders as unknown.

- **A node now reports the firmware version it is running, so the Firmware column has something to show.** Nothing ever put a version in the identity push: the components return `ESPHOME_PROJECT_VERSION`, which ESPHome only defines for a YAML with `esphome: project:`, and no scaffold emits one — so every node, bridge included, reported `""` and the Network page, the device page, Home Assistant's `sw_version`, the MQTT `project_version` sensor and the `devices.current_firmware_version` column all rendered empty. The components now fall back to `esp_tree_common/esp_tree_version.h`, which the release tooling bumps with the add-on version, so a firmware reports the release its sources shipped in. The wire needed nothing: the ESP-NOW identity descriptor (`project_version[16]`) and both protobuf identities have carried the field all along. Firmware already flashed stays blank until it is reflashed — for those, the Firmware cell now shows the first 8 digits of the running app's MD5 instead of `—`.
- **A project-less image no longer claims the ESPHome version as its firmware version.** `bin_parser` decided "this is a project build" from a non-empty `project_name`, but PlatformIO fills that field with the build environment's name (the node name), so it is never empty and a fresh image claimed `2026.6.5` — the toolchain version — on its job card while the device itself reported nothing. The check now requires ESPHome's documented `author.project` shape (a dot), which a build environment name never has.

## 0.1.360

- **Remote flashing now follows the active bridge's ESP-NOW mode.** Add Remote used to send LR by default even when the Wi-Fi bridge was configured for regular mode. The wizard now reads the bridge config, the add-on enforces that mode for new and regenerated remote YAML, and missing/invalid bridge mode fails closed rather than producing an isolated remote.

## 0.1.359

- **An ESP8266 leaf now follows the bridge's channel instead of needing to be told it (no more hidden ch 11).** `channel` on `espnow_82xx_remote` defaults to `0`, meaning *follow the radio*: the discovery sweep already walked 1–13, but every transmit forced `wifi_set_channel(espnow_channel_)` first, so the sweep was cosmetic and a leaf could only ever talk on the configured channel — 11 unless someone said otherwise. Transmit now leaves the radio where the sweep (or the WiFi stack) put it, `add_peer` registers on the live channel, and `apply_tx_channel_()` re-registers the peer table when the radio moves, which is the `peer.channel = 0` reasoning `esp_tree_bridge` has always used. `channel: 1`–`13` still pins the radio for anyone who wants it (the ESP8266 demos do). Consequence: a bridge on any channel is reachable without the leaf knowing it in advance, and a leaf recovers from an AP channel change on its next discovery instead of cold-rebooting after ten seconds of no outbound progress. Verified by compile on ESPHome 2026.6.5 in both modes (auto: SUCCESS, RAM 44.3 %, flash 41.6 %; pinned `channel: 11`: SUCCESS); not yet exercised on a board.

## 0.1.358

- **ESP8266 remotes are back in the wizard.** The chip is offered and scaffolds a config that actually compiles. The leaf's receiver links ESPHome's ESP8266 OTA backend and the component calls the ESP8266 WiFi API, and ESPHome copies a component — and links `ESP8266WiFi` — only when it is loaded, so an ESP-NOW-only leaf could never build on that platform. `generate_scaffold()` now emits, for ESP8266 remotes only, `wifi:` with a password-protected `ap:` plus `captive_portal:`, `network:` and `ota: - platform: esphome`. Firmware still arrives over ESP-NOW; the access point is a recovery portal at `192.168.4.1`. The AP password is derived from the device name, so regenerating the scaffold yields the same one the flashed device uses and cannot lock anyone out of a portal they already noted. No channel is pinned — the component sets the radio channel and the AP follows it. Verified: ESPHome 2026.6.5 compiles the generated config clean (RAM 44.2 %, flash 41.6 %, 438 896-byte `.ota.bin`/`.factory.bin`). ESP8266 remotes are scaffolded as `esp12e` (4 MB) because a 1 MB ESP-01S has no second app slot and cannot take an OTA image. The chip gate in `flash_wizard.py` stays, with an empty table, so a future scaffold regression can still disable a chip with a reason.

## 0.1.353

- **A bridge update can now be confirmed instead of always reading as a failure.** The post-reboot check demanded a *changed* build date, but the bridge reported `__DATE__`/`__TIME__` expanded in its own `setup()` — the compile time of one translation unit — and the add-on compiles into a persistent PlatformIO build tree, so an image rebuilt from unchanged component sources booted with the same string. Every in-place bridge update therefore ended `rejoined_unverified`, and the device page rendered that as a red **failure** card (its banner was `status === 'success' ? success : failure`), so a flash that had in fact landed read as "your update failed". The bridge now reports the ESP-IDF app descriptor's `date`/`time` — the same fields the add-on parses out of the `.ota.bin` in `bin_parser.py` — plus the MD5 of its running app partition, exactly as the leaves have always done in `remote_protocol.cpp`. The check is now "is the device running the artifact we sent" rather than "did something change": an MD5 match confirms, a build-date match confirms when the date moved or no digest was available, and a bridge still reporting its pre-upload build now says so plainly. `rejoined_unverified` renders amber, "Delivered — build unconfirmed", with the artifact and reported builds side by side, in the OTA card, the queue history and the job log.
- **The flash job records the `.ota.bin` digest separately (migration 21).** `firmware_md5` covers the merged full-flash image, while a device reports the digest of its app partition only — the two can never match, so the existing MD5 could not be used to confirm a flash. `ota_jobs.ota_md5` now records the digest of the `.ota.bin`, which is the same bytes the device hashes after booting it; the merged-image `firmware_md5` is unchanged for the preflight and download paths.
- **A bridge running the previous firmware reports no identity, and is not failed for it.** Those bridges still report the old date and no MD5, so the first update after installing this version closes amber with "this bridge firmware predates the change; reflash it once over USB to enable verification". One USB reflash is enough; every update after it can be confirmed. The bridge's `firmware_md5` also reaches the add-on now — the `BridgeIdentity` protobuf message gained field 12, and the runtime encoder fills it (the JSON topology page already carried it, but always empty).

## 0.1.351

- **The device page refreshes straight after a config change.** The page reloaded the topology through a 30-second client cache, so a relay toggle (or any config or flash change) showed stale state until a hard refresh. It now bypasses the cache after `config-changed` and `ota-changed`.

## 0.1.350

- **The Relay config button follows the remote's real state.** A remote never reports its relay flag, so the page kept showing the first value it saw and every toggle looked like it did nothing. The add-on now records the value from an `ok` ack and shows it until the remote starts a new session (a reboot or reflash reverts it to its YAML default).

## 0.1.349

- **A bridge flash no longer claims a failed update it cannot prove.** A bridge reports no project version and no firmware MD5, so the post-reboot check compared the build date it reported before and after the upload and called an unchanged value "the upload did not take effect". That date is `__DATE__`/`__TIME__` expanded in the bridge's own `setup()`, i.e. the compile time of one translation unit, and the add-on compiles into a persistent build tree — an image rebuilt from unchanged components boots with the same string, so a real reflash read as a failure and an absent baseline quietly read as success. The job now closes `rejoined_unverified` (amber, "…so the image it booted could not be confirmed"), with a `flash_identity_unverified` event carrying the build date either side of the upload and why it settled nothing. The job page shows the artifact's own descriptor date as **Image build** and prints expected/reported builds on those events, and a project-less image no longer advertises the ESPHome toolchain version as its firmware version.

## 0.1.348

- **The toolbar mark follows the repo logo.** `brandMark` is now a chip with right-angle traces fanning out to round nodes (teal, green, amber) instead of a bare trunk with three dots; chip and traces still draw in `currentColor`.

## 0.1.347

- **The whole device row opens the device.** Only the name was a link, so the other five cells were dead space; the name link's hit area now stretches over the row (`position: relative` row plus a `.title::after` overlay), making every cell open `#/device/<mac>`. Row actions (Update firmware, YAML, Hide) sit above the overlay and are unchanged; the row takes `cursor: pointer`, and keyboard focus on the name rings the whole row instead of the text. No click handler was added, so middle-click and ctrl-click still open the device in a new tab.

## 0.1.339

- **Fixed a leaf's OTA job being taken over by a superseded bridge record.** Provisioning a new bridge disables the previous row instead of deleting it, so the `bridges` table can hold a *disabled* record for a board that has since been repurposed as a remote. `_bridge_row_for_mac()` matched on MAC alone, so that leaf's flash job was routed down the bridge branch: it uploaded nothing and failed in a second with "this bridge's stored config has no `ota:` block", against the dead bridge's host, instead of going over the ESP-NOW relay. Bridge records that are not enabled are now ignored (the provisioning-bridge placeholder still routes as a bridge), and a host test pins both halves.

## 0.1.338

- **The bridge can now be updated in place from the topology page.** The bridge row shows the firmware build date it is running and an **Update firmware** button, which recompiles the bridge's stored config against the components in the running add-on image and pushes the result with ESPHome OTA. A bridge cannot deliver an image to itself — `ota_start` resolves a *remote* session for the target MAC — so a flash job whose MAC belongs to a bridge now takes the ESPHome-upload path instead of the ESP-NOW relay, and the job still counts as successful only once the bridge rejoins with a *different* build date. A serial-transport bridge, a bridge that is not listening on its OTA port, and one that has not joined the network yet are refused with the reason and the route that does work (a USB flash) rather than being attempted.
- **The bridge OTA password is stored per bridge.** `secrets.yaml` holds one `ota_password` for the whole network, so provisioning a second bridge silently overwrote the password the first one was compiled with and every later over-the-air update to it failed with a password error. The wizard now records it on the bridge row (`bridges.ota_password`, migration 20), the upload prefers it over the shared value, and `PUT /api/bridges/{uuid}` can set it on an existing bridge without re-provisioning.
- **A bridge flash no longer ends in "bridge for remote is not connected".** The device page already offered an `.ota.bin` upload for a bridge, which could only ever fail at the ESP-NOW transfer leg.

- **Discovery is published only for entity types the bridge can render.** The bridge carried a denylist naming the five reserved codes it does not implement (CLIMATE, HUMIDIFIER, DEHUMIDIFIER, TIME, DATETIME), so any *other* unknown type — a code from a newer leaf, or a corrupted schema — fell through and was published as a `sensor` whose state can only ever read `null`. Discovery now uses one allowlist of the fifteen implemented types in both publish paths, and a host test pins that 0x0F and 0x99 are skipped while a sensor still publishes.
- **Fixed the single-enabled-bridge migration keeping an arbitrary row.** `created_at` has one-second resolution, so a bulk import that left several bridges enabled inside the same second handed the survivor to a UUID sort. The tie now breaks on rowid, which is insertion order, so the newest row is the one that stays enabled.
- **Fixed the bridge corrupting its stack once a network had more than 128 nodes.** The session table was unbounded, while the low-RAM eviction copied every session into a fixed 128-entry stack array — a 129th node wrote past the end of it. `MAX_SESSIONS` is now enforced where a session is created (the 129th node is refused with a log line and its frame dropped, so known nodes keep working), the eviction walks a heap-backed list, and a full table reclaims offline sessions during the 60-second cleanup instead of locking new nodes out. The eviction floor guard also subtracted the evicted count from a map that was already shrinking, so it stopped at twice `MIN_SESSIONS_TO_PROTECT`; it now stops at the floor it names.
- **Fixed an OTA retry that could never succeed.** When a flash write failed mid-increment, the leaf re-wrote the increment from its first chunk. The OTA backend appends (`esp_ota_write`, the ESP8266 backend), so that duplicated the bytes already written and the image could not verify — and the leaf still answered the bridge as if the increment had landed. It now retries only the chunk that failed and aborts the transfer on a second failure, so the bridge sees `flash_error` instead of a silent corruption. Same fix in both leaf components.
- **ESP-NOW peers now follow the bridge's current channel.** Peers were registered with whatever channel the bridge happened to be on, and a peer record is only written when the peer is first added. After the access point moved the bridge to another channel, every send to an already-registered node failed until a reboot. Peers are now registered with channel 0 ("use the interface's current channel"), which is what the leaves already did.
- **Command values are length-checked before use.** A COMMAND frame may carry an empty value — the parser accepts it — and the leaf then read byte 0 of a zero-length buffer for switch, light, lock, cover, valve and alarm commands. Each of those types now checks `value_len` first, so an empty command is refused instead of moving a cover to a random position.
- **The bridge's HTTP API fails closed when no API key is configured.** `/api/v1/*` returned everything when `api_key` was empty, while the protobuf WebSocket already refused to start in that state. Both now refuse. `/api/auth/login` also stopped echoing the submitted key back in its response body (the embedded page keeps the key it was given, so nothing depended on the echo), and `/api/v1/*` no longer accepts the key as a URL argument. `/topology.json` and `/bridge.json` stay open: they are what the standalone topology page reads.
- **The AES implementation the nodes actually run is now covered by a test.** `espnow_crypto.cpp` compiled its hand-written AES-256 only for ESP32/ESP8266, so on a host the suite exercised the OpenSSL branch and the code every device runs was never compiled. `ESPNOW_CRYPTO_SOFTWARE_AES` forces that branch and `software_aes_test` compares it against NIST-derived and OpenSSL-generated vectors.
- **Added host tests for the join path and the session table.** `protocol_join_test` runs a real leaf protocol against a real bridge protocol over in-memory queues — discovery, schema exchange, state sync, join completion, and a replayed STATE frame that must not publish twice — and `bridge_session_cap_test` pins the 128-node cap and the eviction path. Neither protocol file was compiled by any test before this.
- **Removed dead bridge code.** `send_command_ack_` and `compute_request_fingerprint_` were never called (`send_deauth_` inlined the fingerprint), and two flash-write paths carried an unused local and a repeated chunk-length calculation.

- **Stopped reading the restart marker on the event loop.** `update_repair` re-read the add-on's `.restart_required.json` every 60 seconds and `async_setup` read and deleted it, all synchronously — HA reports each as "Detected blocking call ... inside the event loop". The marker's existence check, parse and unlink now run through `hass.async_add_executor_job`; the stale/fresh decision and the repair issue are unchanged.
- **Stopped using the deprecated `DeviceEntry.config_entries`.** HA 2026.x keeps that property as a shim that reports a deprecation warning (removable in Core 2027.10) because a device now belongs to a single config entry. Device lookups in `__init__.py` and `bridge_runtime.py` go through `device_entry_ids()`, which mirrors Core's own implementation: the single `config_entry_id` for normal devices, and the real multi-entry set for a restored composite device, whose union semantics the hub-owned/orphan cleanup depends on.

- **The integration no longer fails to import when `/share` is missing or read-only.** `__init__.py` calls `ActivityLogger.get()` at module scope, and that used to `mkdir /share/esp_tree` unconditionally; any `OSError` there aborted the package import and surfaced as the same "Config flow could not be loaded: 500 Internal Server Error" as a broken pip requirement. The file handler is now best-effort: when the shared log cannot be opened the logger propagates to the Home Assistant log instead, and the module-level call is guarded so logging setup can never block loading.
- **Fixed the ESP Tree integration failing to add with "Config flow could not be loaded: 500 Internal Server Error".** The integration manifest capped its protobuf requirement at `<7`, while Home Assistant core pins `protobuf==7.36.0` in `package_constraints.txt`. HA could not install the requirement, so it never loaded `config_flow.py` and the frontend showed only the generic 500. The requirement is now `protobuf>=6.31.1,<8`, which accepts both the protobuf 6.x line and the runtime HA actually ships; the bundled gencode (6.31.1) loads unchanged on 7.36.0.

- **Fixed a wedged serial bridge that stopped delivering topology entirely.** On the serial transport a snapshot refresh sent a bare `ClientHello`, which the bridge's UART handler treats as the start of a new session and re-challenges (a UART has no disconnect signal, so a new client must prove possession of the API key again). Nothing was listening for that challenge, so the bridge sat in `CHALLENGE_SENT` — answering keepalive Pings with more challenges, never a Pong, never a snapshot — and the bridge node itself disappeared from the topology. Only a manual reconnect cleared it. `refresh_snapshot()` now drives the full HMAC handshake, so the challenge is answered and the snapshot is delivered.
- **Rate-limited the empty-topology refresh retry.** It had no spacing and `topology()` is called by the UI's 3s poll, so a genuinely empty topology (or a wedged session) produced a continuous refresh stream — an HMAC handshake every ~3s on the UART. Now spaced to one attempt per 30s, so it stays a recovery path rather than a polling loop.
- **Removed the separate USB recovery route and device-detail button.** Existing devices continue
  to use the normal Edit YAML → Compile and Flash (USB via Browser) flow.
- **Moved permanent deletion into Hidden Devices.** Visible devices must be hidden first; the hidden
  list now offers equal-width Restore and Delete pills, with a confirmation before permanent deletion.
- **Standardized device action pills.** Settings and Edit YAML controls now use the same fixed width.
- **Dropped the config-state badge from topology rows.** The small bordered glyph left of each status
  light (`—` / `✓` / `↑`) read as a disabled button and was ambient state nobody acts on from the row.
  Config state is still on the device page. The one case that changes what the row's button does — no
  YAML yet, so Edit YAML opens "Create Config" instead of an editor — is now a small amber dot on that
  button. The `compile_queued`/`compiling` states also no longer render as a misleading `—`, since the
  badge is gone.

- **Browser USB flashing no longer asks for the device twice.** `esp-web-tools`' install
  dialog calls `navigator.serial.requestPort()` itself, so the USB chooser appeared again
  even when the wizard had just detected the chip over the same port. The detected port is
  now passed straight into the dialog, so a board already granted needs no second prompt at
  all. The flash step also reuses any port the browser has previously granted, and the
  `esp-web-tools`/`esptool-js` bundles are now vendored through `npm` instead of being
  fetched from `unpkg.com` at runtime (so browser flashing works without outbound internet
  access, and the versions are pinned).
- **Browser USB flashing no longer asks redundant questions.** The install manifests set
  `new_install_prompt_erase: false` and `new_install_improv_wait_time: 0`: the erase decision
  is already made by pressing Compile and Flash, and the firmware implements no Improv, so
  the dialog's post-write Improv probe could only ever stall for its 10 s default before
  continuing. Boards are still erased — the dialog erases by default when no erase prompt is
  configured and the device reports no Improv.
- **Bug fix — the Create Remote wizard advanced on an event that never fires.** It listened
  for `esp-web-tools`' `state-changed` `FINISHED` event to move to the Home Assistant step,
  but `esp-web-tools@10`'s dialog never dispatches `state-changed`; the event belongs to the
  Improv serial client. The wizard only appeared to work because of a manual "I've flashed
  it" button beside it, which is now removed in favour of watching the dialog's real state
  (with a manual continue offered if the dialog is dismissed before that completes).
- **Licensed AGPL-3.0-only.** Added the top-level `LICENSE` file. Previously the
  repository had no licence, which meant no one was permitted to use, modify or
  redistribute it.
- **Corrected `repository.yaml`.** It advertised the development fork
  (`berenebot-agent/esptree-dev`) as the add-on repository URL, which meant
  users' add-on stores pointed at a development snapshot rather than the
  canonical project. Now points at `dellarb/esphomenow-tree-ha`.
- **CI now runs the full test suite.** It previously ran 4 add-on tests and 1
  integration test out of ~180, so a change breaking any of the others merged
  green. Both suites now run in full, mirroring `test/run-unit-tests.sh`.
- **Documentation accuracy pass.** The README no longer claims HA presents a
  discovery confirmation for new remotes (remotes are auto-added), no longer
  carries a warning about a `repository.yaml` URL that has since been fixed, and
  its release-readiness gap list reflects the current tree.
- **Correction:** Native compilation is now implemented. The add-on bootstraps a local ESPHome venv (via `requirements-compile.txt`) and exposes `POST /api/devices/{mac}/compile`. The 0.1.38 note about "Native compilation not yet implemented" is obsolete — the compile button and compile queue are functional.

## 0.1.38

- **Breaking: Removed Docker-based compilation.** The add-on no longer requires `docker_api: true` and no longer spawns sibling ESPHome Docker containers for firmware compilation. All Docker-related code has been stripped from the backend, frontend, config schema, and init scripts.
- Compilation is disabled; the compile button will fail with "Native compilation not yet implemented." The compile queue system, config editor, OTA queue, and all other features remain fully functional.
- Removed: `docker` Python package, `docker_api: true` config, `docker_socket` option, Docker debug endpoints, Docker socket discovery in init script.
- Added: Placeholder panel in settings UI indicating compilation is unavailable.

## 0.1.33

- Disable AppArmor protection for the add-on so Home Assistant can mount the Docker socket when `docker_api: true` is enabled.
- Clarify Docker compilation troubleshooting in the add-on docs.

## 0.1.0

- Initial V1 add-on implementation.
- FastAPI backend with SQLite persistence.
- Lit/Vite ingress frontend.
- Topology proxy and recursive topology UI.
- Add-on-managed firmware upload, retention, OTA state machine, and bridge chunk feeding.
