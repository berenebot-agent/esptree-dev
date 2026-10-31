#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v idf.py >/dev/null 2>&1; then
  echo "Load ESP-IDF first: . /path/to/esp-idf/export.sh" >&2
  exit 1
fi
if [[ ! -f sdkconfig ]]; then
  idf.py set-target esp32c5
fi
idf.py build
