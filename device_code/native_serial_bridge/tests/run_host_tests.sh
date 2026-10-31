#!/usr/bin/env bash
# Host-side tests for the native serial bridge: no ESP-IDF toolchain, no target,
# no hardware. Runs the compat-shim/COBS self-test plus the Kconfig/board-map
# consistency test.
#
# Requires: g++, gcc, python3, and IDF_PATH pointing at ESP-IDF 5.4+ (only its
# cJSON source is used, to prove the shim behaves like the device build).
set -euo pipefail
cd "$(dirname "$0")"

native_dir="$(cd .. && pwd)"
repo_root="$(cd "$native_dir/../.." && pwd)"
idf="${IDF_PATH:-}"

if [[ -z "$idf" || ! -f "$idf/components/json/cJSON/cJSON.c" ]]; then
  echo "Set IDF_PATH to an ESP-IDF 5.4+ checkout (cJSON is compiled for the host)." >&2
  exit 1
fi

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

gcc -std=c11 -O1 -c "$idf/components/json/cJSON/cJSON.c" -o "$work/cJSON.o"
g++ -std=c++17 -O1 -Wall -Wextra -Werror \
  -I "$native_dir/main/compat" \
  -I "$native_dir/../components" \
  -I "$native_dir/../components/esp_tree_common" \
  -I "$idf/components/json/cJSON" \
  shim_selftest.cpp "$work/cJSON.o" -o "$work/shim_selftest"

"$work/shim_selftest"

cd "$repo_root"
python3 device_code/native_serial_bridge/tests/test_target_defaults.py
