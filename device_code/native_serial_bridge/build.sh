#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

usage() {
  echo "Usage: $0 <chip>     # first build: esp32, esp32s2, esp32s3, esp32c2, esp32c3, esp32c5, esp32c6" >&2
  echo "       $0            # subsequent build, using existing sdkconfig" >&2
}

if ! command -v idf.py >/dev/null 2>&1; then
  echo "Load ESP-IDF 5.4+: . /path/to/esp-idf/export.sh" >&2
  exit 1
fi
if (( $# > 1 )); then usage; exit 2; fi

requested="${1:-}"
if [[ -n "$requested" ]]; then
  case "$requested" in
    esp32|esp32s2|esp32s3|esp32c2|esp32c3|esp32c5|esp32c6) ;;
    *) echo "Unsupported target: $requested" >&2; usage; exit 2 ;;
  esac
fi

if [[ -f sdkconfig ]]; then
  configured="$(sed -n 's/^CONFIG_IDF_TARGET="\([^"]*\)"$/\1/p' sdkconfig | head -n 1)"
  if [[ -n "$requested" && "$configured" != "$requested" ]]; then
    echo "Existing sdkconfig targets '$configured'; requested '$requested'." >&2
    echo "Save your existing sdkconfig/credentials and use a separate working copy" >&2
    echo "for each target. Refusing to reset the current firmware settings." >&2
    exit 1
  fi
else
  if [[ -z "$requested" ]]; then
    usage
    exit 2
  fi
  idf.py set-target "$requested"
fi
idf.py build
