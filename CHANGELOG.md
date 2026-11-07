# Changelog

This file documents released behaviour. Entries were maintained only up to
`0.1.38`; the add-on has since reached `0.1.309` and the intervening releases
are not itemised here. Rather than backfill ~270 versions, the release history
lives in `git log` — treat that as authoritative for what changed and when.
Future releases should add an entry here.

## Unreleased

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
