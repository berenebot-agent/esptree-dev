#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

usage() {
  echo "Usage: $0 [--debug] <chip>  # one of: esp32, esp32s2, esp32s3, esp32c2, esp32c3, esp32c5, esp32c6" >&2
  echo "       $0 [--debug]         # rebuild the one target already configured here" >&2
  echo "" >&2
  echo "  Each target keeps its own sdkconfig.<chip> and build-<chip>/ tree, so" >&2
  echo "  switching targets never resets another target's credentials." >&2
  echo "" >&2
  echo "  --debug   bring-up flavour: console and logs on UART0 at 115200, in" >&2
  echo "            build-<chip>-debug/ with sdkconfig.<chip>.debug. Not usable" >&2
  echo "            with the add-on: that link is COBS/protobuf, not text." >&2
}

if ! command -v idf.py >/dev/null 2>&1; then
  echo "Load ESP-IDF 5.4+: . /path/to/esp-idf/export.sh" >&2
  exit 1
fi

debug=0
requested=""
for arg in "$@"; do
  case "$arg" in
    --debug) debug=1 ;;
    -h|--help) usage; exit 0 ;;
    esp32|esp32s2|esp32s3|esp32c2|esp32c3|esp32c5|esp32c6) requested="$arg" ;;
    *) echo "Unsupported argument: $arg" >&2; usage; exit 2 ;;
  esac
done

# A single-config tree left by an earlier version of this script still holds
# real credentials; never reset its target silently.
if [[ -f sdkconfig ]]; then
  configured="$(sed -n 's/^CONFIG_IDF_TARGET="\([^"]*\)"$/\1/p' sdkconfig | head -n 1)"
  if [[ -n "$requested" && "$configured" != "$requested" ]]; then
    echo "Legacy sdkconfig targets '$configured'; requested '$requested'." >&2
    echo "Save your sdkconfig/credentials and remove it, or use a separate" >&2
    echo "working copy. Refusing to reset the current firmware settings." >&2
    exit 1
  fi
fi

if [[ -z "$requested" ]]; then
  shopt -s nullglob
  candidates=()
  for existing in sdkconfig.esp32*; do
    [[ "$existing" == *.debug ]] && continue
    candidates+=("${existing#sdkconfig.}")
  done
  shopt -u nullglob
  if (( ${#candidates[@]} != 1 )); then
    if (( ${#candidates[@]} == 0 )); then
      echo "No target configured yet: run '$0 <chip>' first." >&2
    else
      echo "Several targets configured here (${candidates[*]}); name one." >&2
    fi
    usage
    exit 2
  fi
  requested="${candidates[0]}"
fi

sdkconfig="sdkconfig.${requested}"
build_dir="build-${requested}"
build_args=(-B "$build_dir" -DSDKCONFIG="$sdkconfig")
if (( debug )); then
  sdkconfig="${sdkconfig}.debug"
  build_dir="${build_dir}-debug"
  build_args=(-B "$build_dir" -DSDKCONFIG="$sdkconfig"
              "-DSDKCONFIG_DEFAULTS=sdkconfig.defaults;sdkconfig.debug.defaults")
  echo "==> Debug flavour for ${requested}: console and logs on UART0 at 115200." >&2
fi

if [[ ! -f "$sdkconfig" ]]; then
  # idf.py set-target refuses to clean a directory that is not a CMake build
  # tree. An interrupted first build leaves exactly that, and the resulting
  # "Refusing to automatically delete files" error looks like a permissions
  # problem rather than a half-written build directory.
  if [[ -d "$build_dir" && ! -f "$build_dir/CMakeCache.txt" ]]; then
    echo "==> Removing incomplete ${build_dir} left by an interrupted build" >&2
    rm -rf "$build_dir"
  fi
  idf.py "${build_args[@]}" set-target "$requested"
fi

idf.py "${build_args[@]}" build
