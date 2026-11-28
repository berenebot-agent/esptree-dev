#!/usr/bin/env bash
# Canonical Python regression gate for the add-on and the HA integration.
#
# Two suites run as independent pytest processes — never one process, because
# ha_integration/tests/conftest.py replaces `google.protobuf` in sys.modules and
# a shared process breaks the add-on's esp_tree_runtime_pb2 import.
#
#   test/run-unit-tests.sh                 # both suites, host-sized, as two lanes
#   test/run-unit-tests.sh addon           # add-on suite only
#   test/run-unit-tests.sh integration     # integration suite only
#   test/run-unit-tests.sh --local addon   # force the local venv instead of Docker
#
# Everything the runner decides is overridable:
#
#   ESP_TREE_TEST_MODE        auto|docker|local   (auto: Docker when its daemon answers)
#   ESP_TREE_TEST_WORKERS     total xdist workers (default: CPU count, capped at 8)
#   ESP_TREE_TEST_SERIAL      1 = run the lanes back-to-back instead of concurrently
#   ESP_TREE_TEST_RAMDISK     auto|1|0  RAM-backed scratch for tmp_path (default auto)
#   ESP_TREE_TEST_MEM_MB      per-process address-space cap in MB; auto|0 (default auto)
#   ESP_TREE_TEST_PYTHON      interpreter for local mode (default python3)
#   ESP_TREE_TEST_VENV        venv used by local mode (default .local/venv)
#   ESP_TREE_TEST_REPORT_DIR  logs, per-run detail and ledger (default .local/perf)
#   PYTHON_TEST_IMAGE         container image (default python:3.11-slim-bookworm)
#
# See test/PERFORMANCE.md for the measured cost breakdown behind these choices.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

T0="$(date +%s%N)"
elapsed_ms() { echo $(( ($(date +%s%N) - T0) / 1000000 )); }
phase() {
    local ms
    ms="$(elapsed_ms)"
    printf '[%4d.%03ds] %s\n' "$(( ms / 1000 ))" "$(( ms % 1000 ))" "$*"
}
die() { echo "ERROR: $*" >&2; exit 2; }

# --- arguments ---------------------------------------------------------------
MODE="${ESP_TREE_TEST_MODE:-auto}"
SCOPE="all"
for arg in "$@"; do
    case "$arg" in
        --local) MODE=local ;;
        --docker) MODE=docker ;;
        addon | integration | all) SCOPE="$arg" ;;
        -h | --help)
            sed -n '2,29p' "$0" | sed 's/^# \{0,1\}//'
            exit 0
            ;;
        *) die "unknown argument: $arg (expected addon, integration, all, --local, --docker)" ;;
    esac
done

# --- host-aware sizing -------------------------------------------------------
detect_cpus() {
    local n=""
    command -v nproc >/dev/null 2>&1 && n="$(nproc 2>/dev/null || true)"
    if [ -z "${n}" ] && command -v getconf >/dev/null 2>&1; then
        n="$(getconf _NPROCESSORS_ONLN 2>/dev/null || true)"
    fi
    case "${n}" in '' | *[!0-9]*) n=2 ;; esac
    [ "${n}" -ge 1 ] || n=2
    echo "${n}"
}

CPUS="$(detect_cpus)"
WORKERS="${ESP_TREE_TEST_WORKERS:-1}"
SHARD_WHY="per-test sharding off (measured: 3 workers cost +1.2s on a 1.9s suite)"
case "${WORKERS}" in
    auto)
        WORKERS="${CPUS}"
        [ "${WORKERS}" -gt 8 ] && WORKERS=8
        SHARD_WHY="auto: ${CPUS} CPUs detected"
        ;;
    '' | *[!0-9]*) die "ESP_TREE_TEST_WORKERS must be an integer or 'auto'" ;;
esac
[ "${WORKERS}" -ge 1 ] || WORKERS=1

REPORT_DIR="${ESP_TREE_TEST_REPORT_DIR:-${ROOT}/.local/perf}"
PIP_CACHE="${ROOT}/.local/cache/pip"
mkdir -p "${REPORT_DIR}"
RUN_STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

# The lanes are separate processes, so divide the total worker budget between
# them: the machine runs at the size that was detected, not twice it.
LANES=1
if [ "${SCOPE}" = "all" ] && [ "${ESP_TREE_TEST_SERIAL:-0}" != "1" ]; then
    LANES=2
fi
if [ "${LANES}" -eq 2 ]; then
    PER_LANE=$((WORKERS / 2))
else
    PER_LANE="${WORKERS}"
fi
[ "${PER_LANE}" -ge 1 ] || PER_LANE=1

# --- mode selection ----------------------------------------------------------
docker_usable() { command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; }

if [ "${MODE}" = "auto" ]; then
    if docker_usable; then MODE=docker; else MODE=local; fi
fi
if [ "${MODE}" = "docker" ] && ! docker_usable; then
    die "Docker mode requested but the daemon is not reachable"
fi

phase "mode=${MODE} scope=${SCOPE} workers=${WORKERS} (per lane ${PER_LANE}) cpus=${CPUS}"
phase "${SHARD_WHY}"

PYTEST_ARGS=(-p no:cacheprovider -o addopts= -q)
if [ "${PER_LANE}" -gt 1 ]; then
    PYTEST_ARGS+=(-n "${PER_LANE}" --dist load)
fi

# --- local mode: project venv with the pinned requirement set ---------------
VENV="${ESP_TREE_TEST_VENV:-${ROOT}/.local/venv}"

setup_local_venv() {
    if [ ! -x "${VENV}/bin/python" ]; then
        phase "creating venv at ${VENV}"
        "${ESP_TREE_TEST_PYTHON:-python3}" -m venv "${VENV}" ||
            die "could not create a venv (set ESP_TREE_TEST_PYTHON)"
    fi
    local want have
    want="$(cat requirements.txt test/requirements-test.txt | sha256sum | cut -d' ' -f1)"
    have="$(cat "${VENV}/.requirements-hash" 2>/dev/null || true)"
    if [ "${want}" != "${have}" ]; then
        phase "installing pinned test dependencies (wheel cache: ${PIP_CACHE})"
        PIP_CACHE_DIR="${PIP_CACHE}" "${VENV}/bin/python" -m pip install \
            --disable-pip-version-check --quiet \
            -r requirements.txt -r test/requirements-test.txt
        echo "${want}" >"${VENV}/.requirements-hash"
    else
        phase "test dependencies unchanged (install skipped)"
    fi
}

run_lane() { # run_lane <name> <workdir> <target>
    local name="$1" workdir="$2" target="$3"
    local log="${REPORT_DIR}/lane-${RUN_STAMP}-${name}.log"
    phase "lane ${name} starting -> ${log}"
    (
        cd "${workdir}"
        ESP_TREE_TEST_SUITE="${name}" \
            "${VENV}/bin/python" -m pytest "${PYTEST_ARGS[@]}" "${target}"
    ) >"${log}" 2>&1
}

# --- docker mode -------------------------------------------------------------
run_docker() {
    local image="${PYTHON_TEST_IMAGE:-python:3.11-slim-bookworm}"
    phase "container ${image}; wheel cache ${PIP_CACHE}"
    mkdir -p "${PIP_CACHE}"

    local lane_cmd_addon lane_cmd_integ
    lane_cmd_addon="cd /repo && python -m pytest ${PYTEST_ARGS[*]} test/tests >/perf/lane-${RUN_STAMP}-addon.log 2>&1"
    lane_cmd_integ="cd /repo/ha_integration && python -m pytest ${PYTEST_ARGS[*]} tests >/perf/lane-${RUN_STAMP}-integration.log 2>&1"

    local inner
    case "${SCOPE}" in
        addon) inner="${lane_cmd_addon}" ;;
        integration) inner="${lane_cmd_integ}" ;;
        *)
            inner="$(
                cat <<EOF
${lane_cmd_addon} & a=\$!
${lane_cmd_integ} & i=\$!
rc=0
wait \$a || rc=1
wait \$i || rc=1
exit \$rc
EOF
            )"
            ;;
    esac

    docker run --rm \
        -e PYTHONDONTWRITEBYTECODE=1 \
        -e PYTHONUNBUFFERED=1 \
        -e ESP_TREE_TEST_WORKERS="${PER_LANE}" \
        -e ESP_TREE_TEST_REPORT_DIR=/perf \
        -e ESP_TREE_TEST_RAMDISK="${ESP_TREE_TEST_RAMDISK:-auto}" \
        -e ESP_TREE_TEST_MEM_MB="${ESP_TREE_TEST_MEM_MB:-auto}" \
        -v "${ROOT}:/repo:ro" \
        -v "${REPORT_DIR}:/perf:rw" \
        -v "${PIP_CACHE}:/root/.cache/pip:rw" \
        -w /repo \
        "${image}" \
        sh -euc "python -m pip install --disable-pip-version-check --quiet \
                   -r requirements.txt -r test/requirements-test.txt
                 ${inner}"
}

# --- main -------------------------------------------------------------------
overall_rc=0
case "${MODE}" in
    local)
        setup_local_venv
        if [ "${LANES}" -eq 2 ]; then
            run_lane addon "${ROOT}" test/tests & a_pid=$!
            run_lane integration "${ROOT}/ha_integration" tests & i_pid=$!
            wait "${a_pid}" || overall_rc=1
            wait "${i_pid}" || overall_rc=1
        elif [ "${SCOPE}" = "addon" ]; then
            run_lane addon "${ROOT}" test/tests || overall_rc=1
        else
            run_lane integration "${ROOT}/ha_integration" tests || overall_rc=1
        fi
        ;;
    docker)
        run_docker || overall_rc=1
        ;;
esac

total_ms="$(elapsed_ms)"
phase "suites finished in $((total_ms / 1000))s (rc=${overall_rc})"

# --- report ------------------------------------------------------------------
shopt -s nullglob
lane_logs=("${REPORT_DIR}"/lane-"${RUN_STAMP}"-*.log)
for log in "${lane_logs[@]}"; do
    echo
    echo "===== $(basename "${log}") ====="
    # The harness summary comes last; on failure pytest's short summary sits
    # just above it, so a tail is the useful window rather than the whole log.
    tail -n 30 "${log}"
done

# --- append-only ledger ------------------------------------------------------
printf '{"ts":"%s","role":"runner","mode":"%s","scope":"%s","workers":%d,"per_lane":%d,"cpus":%d,"wall_ms":%d,"rc":%d,"sha":"%s","branch":"%s"}\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "${MODE}" "${SCOPE}" "${WORKERS}" "${PER_LANE}" "${CPUS}" \
    "${total_ms}" "${overall_rc}" \
    "$(git rev-parse HEAD 2>/dev/null || echo unknown)" \
    "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)" \
    >>"${REPORT_DIR}/ledger.jsonl"

echo
echo "lane logs:  ${REPORT_DIR}/lane-${RUN_STAMP}-*.log"
echo "detail:     ${REPORT_DIR}/runs/*/detail.log"
echo "ledger:     ${REPORT_DIR}/ledger.jsonl"
echo "wall clock: $((total_ms / 1000)).$(printf '%03d' $((total_ms % 1000)))s"

exit "${overall_rc}"
