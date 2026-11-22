# Agent guidance (ESP Tree)

Binding rules for any agent working in this repository. `CONTRIBUTING.md` holds the
full workflow; `README.md` the product/install view. Where prose disagrees with
executable configuration (`dev.sh`, `.github/workflows/ci.yml`, `test/*.sh`), the
executable configuration wins — and say so when you report.

## What this project is

A Home Assistant add-on (FastAPI, `app/`) plus integration
(`ha_integration/custom_components/esp_tree/`) that manages an ESP-NOW network of
ESPHome nodes over one bridge, through a Lit/Vite UI (`ui/`) served over HA ingress.

| Path | Responsibility |
|---|---|
| `app/` | Add-on backend: `server.py` (routes/WS, ~4k lines), `bridge_v2_client.py` (WiFi protobuf bridge), `bridge_serial_client.py` (COBS/UART bridge), `db.py` (SQLite under `/data`), OTA/compile workers and stores |
| `ha_integration/custom_components/esp_tree/` | Integration: entities, services, config flow, repairs. A **client of the add-on**, never of the bridge |
| `ui/src/` | Lit + TypeScript UI. `ui/dist/` is **committed build output** |
| `device_code/components/` | ESPHome external components: `esp_tree_bridge`, `esp_tree_remote`, `espnow_82xx_remote` (ESP8266), `esp_tree_common` (shared headers/crypto) |
| `device_code/demos/` | Firmware YAML. `secrets.yaml` is gitignored — never commit it |
| `device_code/tests/` | Host C++ unit tests (CMake/CTest, links OpenSSL) |
| `device_code/native_serial_bridge/` | Experimental ESP-IDF (non-ESPHome) serial bridge — not consumed by the add-on or wizard |
| `test/` | Standalone add-on harness + the Python regression suites (`test/tests`, `ha_integration/tests`) |
| `rootfs/` | s6 init; installs the integration into `/config` |
| `docs/` | Live specs. Historical material lives **outside** the tree in `docs/archive/` and is not current |

## Branch: `master` only

- `master` is the only branch and the release path. `main` was retired and has been
  resurrected once by a checkout still sitting on it — that is the failure mode to prevent.
- Do not create a branch for an ordinary change; work on `master` and commit in place.
- Never force-push and never rewrite `master`.

## Releases and versions

The installed add-on is built by the Supervisor from the repository's **default branch
(`master`)**. A commit on any other ref never deploys.

- Never hand-edit or hand-bump version lines. `dev.sh qc [global|addon]` owns four of them:
  `app/server.py`, `config.yaml`, `ui/package.json` (add-on, bumped together) and
  `ha_integration/.../manifest.json` (integration, bumped independently). **They are not
  meant to be equal** — do not "fix" the drift.
- Release paths: `./dev.sh qc` (verify → bump → build → regenerate → commit → push) or
  `bash /opt/data/skills/embedded/esptree-bump-push/scripts/bump-push.sh`
  (`--push-only` / `--deploy`). QC is mutating; run it only when a release is intended,
  and review what it staged.
- `dev.sh qc` finishes with a bare `git push`, which the Claude hook blocks.
  Expect to push by hand afterwards; report the mismatch rather than loosening the rule.
- `CHANGELOG.md` entries are hand-written: add one under `## Unreleased` for user-visible
  behaviour changes.
- Never bump twice for one change.

## Development and verification

Run from the repository root. Pick the smallest command that covers the change.

```bash
./dev.sh verify addon     # Python suites in the pinned python:3.11-slim-bookworm image
./dev.sh verify device    # C++ build + ctest + ESPHome smoke compile
./dev.sh verify global    # both
./dev.sh build-cpp && ./dev.sh run-cpp
./dev.sh compile-local <demo>   # ESPHome compile in a local venv, no Docker (ESPHOME_BIN=...)
./dev.sh native-test            # host tests for native_serial_bridge; needs IDF_PATH
./test/build.sh && ./test/start.sh   # standalone add-on UI on :8099, no HA
cd ui && npm ci && npm run build
python3 scripts/check_doc_anchors.py # CI gate: docs cite code as file.ext:123
```

- The add-on Python runtime is containerized: **do not** validate imports or syntax with
  host `python`/`python3`. `test/run-unit-tests.sh` runs both suites **in one container**
  but as **separate `pytest` processes** — `ha_integration/tests/conftest.py` replaces
  `google.protobuf` with a stub during collection, so a combined run breaks the add-on's
  `esp_tree_runtime_pb2`. Keep them separate.
- `dev.sh verify` and the Docker-backed compile scripts are the release path. `compile-local`
  is for iteration only.
- C++ tests fall back to the Debian OpenSSL sysroot at `/opt/data/sysroot/openssl-prefix`;
  override with `OPENSSL_ROOT_DIR`. A `device_code/tests/build/` copied from another
  checkout is detected and recreated (`CMakeCache.txt` holds an absolute source path).
- Build the smallest affected target: shared or bridge component changes need a bridge
  build; remote-only changes do not.
- For documentation-only changes, `git diff --check` plus the anchor check is enough.
- Report the exact commands run, their results, and anything not run. Never claim a build,
  test, flash or verification that did not happen.

## Architecture invariants

- Bridge communication is **protobuf over WebSocket** (WiFi) or **protobuf over COBS/UART**
  (serial). No HTTP polling, no third transport.
- The integration talks to the add-on, never to a bridge. At most one bridge is active;
  multiple records may be stored.
- OTA control and transfer use the protobuf WebSocket flow. The REST upload endpoint is
  only firmware ingress.
- `device_code/components/esp_tree_common/espnow_types.h` is the source of truth for
  protocol types, packet layouts, constants and field enums.
- These two `.proto` files must stay byte-identical, **including their generated
  `generated/esp_tree_runtime_pb2.py` / `.pyi`**:
  `app/protobuf/esp_tree_runtime.proto` and
  `ha_integration/custom_components/esp_tree/protobuf/esp_tree_runtime.proto`.
  `dev.sh qc` enforces both; it also asserts expected field names survive regeneration.
- Protocol fields, packet sizes, entity mappings and bridge↔integration compatibility are
  load-bearing. Treat a change there as a compatibility decision, not a refactor.

## Security boundaries

- Trust is decided by **exact socket peer IP** (`app/access_control.py`): loopback,
  `172.30.32.1`, `172.30.32.2`. Never trust `X-Ingress-Path`, `X-Forwarded-For` or any
  caller-supplied header. `ESP_TREE_TRUSTED_PEERS` takes exact unicast addresses for
  standalone development only — never a subnet, never a default.
- Persistent state: add-on data under `/data`, integration runtime state under
  `/share/esp_tree`.
- Never commit credentials, keys, tokens, WiFi/MQTT secrets, or
  `device_code/demos/secrets.yaml`.
- Stop and ask before changing authentication, encryption, persistence, destructive
  migrations, firmware flashing, or public protocol compatibility unless the request
  explicitly covers it.

## UI notes

- **`ui/dist/` is committed.** `npm run build` rewrites it; commit the result with the
  source change. CI's `ui-dist` job fails if `git status --porcelain -- ui/dist` is dirty.
- Vite embeds the git hash/date, so `dist` must be rebuilt **after** the final commit that
  changes UI source — expect to add the dist commit deliberately.
- No left sidebar or rail navigation (the add-on renders inside HA ingress, which owns the
  sidebar). Design tokens and rules are in `DESIGN.md`; product constraints in `PRODUCT.md`.

## Local-only guidance

- `.local/` is the in-repo scratch space for build artefacts, one-off scripts and test
  output; it is gitignored. Keep temp work there rather than in ad-hoc directories.
- `.impeccable/`, `.agents/`, `.opencode/`, review screenshots and mock backends stay out of
  commits. `AGENTS.md` itself is tracked so every clone sees these rules.
- `esplog-master.py` (OTA log collector, HTTP `:5555`) is a bench tool outside the repo
  (`tools/archive/`); it is not part of the add-on. Use `./dev.sh esplog` for OTA logs and
  `docs/ESP_guide_usblog.md` for direct USB logging.
