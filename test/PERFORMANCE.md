# Test suite performance

The Python regression gate used to take **~9 minutes**; it now takes **under 3
seconds** on the same machine with the same 360 tests. Nothing was deleted,
skipped or weakened: the two suites still report 186 and 174 tests, the same
assertions run, and the counts are identical to the pre-change baseline.

This file is the measurement record. It is deliberately specific: the numbers
below were produced by the commands in § Reproducing them, on the machine
described in § Baseline, and they are what the defaults were chosen from.

## The short version

| | before | after | |
|---|---|---|---|
| Whole gate (`test/run-unit-tests.sh`) | 539.5 s | **2.8 s** | 193× |
| Add-on suite (`test/tests`, 186 tests) | 534.1 s | **1.83 s** | 292× |
| Integration suite (`ha_integration/tests`, 174 tests) | 1.58 s | **0.42 s** | 3.8× |
| One DB-touching test (`test_late_joining_remote_is_persisted`) | 11.2 s | **0.15 s** | 75× |
| Slowest single test (`test_activating_a_bridge_deactivates_the_previous_one`) | 28.5 s | **0.01 s** | 2800× |

## Baseline (Phase 0)

Measured 2026-11-28 on commit `eb86dd0`, clean tree, before any change:

| | |
|---|---|
| Machine | 6 vCPU, 26.5 GB RAM, `/opt/data` on ext4 (`/dev/sda2`), no Docker daemon |
| Runtime | Python 3.14.9, pytest 9.0.3, pytest-asyncio 1.4.0 |
| Add-on suite | 186 passed in **534.12 s** (wall 537.9 s) |
| Integration suite | 170 passed, 4 skipped, 0.38 s of test time, **1.58 s** wall |
| Canonical command | `test/run-unit-tests.sh` (Docker path unavailable here: the daemon is not running, so the baseline and all "after" numbers were taken with the same pinned venv instead — see § Environment) |

Per-test timings were captured with `pytest --durations=0`; the top of that
table is reproduced in § Where the time went.

## Where the time went (Phase 1)

Classifying the 534 s by bucket:

| bucket | share | evidence |
|---|---|---|
| **I/O stalls** | ~99% | `Database.init()` cost **21.6 s** wall with **0.28 s** of CPU over 5 runs. Each of its ~120 schema statements commits — and fsyncs — on its own (`isolation_level=None`), and this filesystem's fsync is slow. |
| Real compute | ~1% | The whole suite's test bodies are 1.1 s of CPU once the I/O is gone. |
| Fixed startup | ~1.3 s | Interpreter + import + collection; unchanged by any of this and now the largest remaining term. |
| Setup/readiness, serial execution | 0 | Nothing in the suite waits on a service or a port. |

The `Database.init()` figure is the whole story: 58 test nodes paid for one or
more of them, and 15 of them cost 15–29 s each.

## What changed

1. **RAM-backed scratch for `tmp_path`** (`test/perf/perfharness.py`). pytest's
   per-test directories moved from the data disk to `/dev/shm` (chosen only if
   present, writable, and ≥24 MB; disk fallback otherwise, and the fallback was
   measured: a DB test costs 2.59 s on disk vs 0.15 s in RAM). This is the single
   largest win and it changes no product code. Pytest's own directories,
   naming, retention and cleanup are untouched — only the base path moves.
2. **One transaction per schema run** (`app/db.py`, `init()`). The base schema and
   all migrations now run inside a single `BEGIN IMMEDIATE … COMMIT`, so the
   schema lands atomically and pays one fsync instead of ~120. Verified on the
   slow disk: 19.8 s → 2.75 s per init with the RAM scratch disabled. This is a
   product improvement as well as a test one — the add-on calls `init()` on
   every start, and a half-applied migration was previously possible.
3. **The two suites run as concurrent lanes** (`test/run-unit-tests.sh`). They
   were already two separate processes by design (a shared process breaks the
   add-on's protobuf import); they now also run at the same time instead of
   back-to-back, so the gate costs the slower lane rather than the sum.
4. **Persistent, path-independent caches.** The local mode keeps one project
   venv under `.local/venv` and skips the install entirely when
   `requirements.txt` + `test/requirements-test.txt` hash unchanged (the hash is
   also the cache key, so it is path-independent). The Docker mode mounts a
   wheel cache at `.local/cache/pip` instead of re-downloading on every run.
   Cold first run: 97.6 s (venv + pinned install); warm: 2.8 s.
5. **Two-tier logging, always on.** A summary to stdout plus a full per-test
   detail log, timestamped relative to run start, written to
   `.local/perf/runs/<run>-<suite>-<pid>/detail.log`. Verbosity is not a flag —
   the detail is already on disk when a test fails, so a failure never needs a
   re-run. Under xdist each worker writes `detail-worker-<pid>.log` next to the
   master's aggregate.
6. **Artifacts kept on failure, cleaned on success.** A failing run leaves the
   whole scratch tree (each failing test's `tmp_path` intact) and prints its
   path plus the first traceback inline; a passing run removes its scratch.
   Proved by injecting a deliberate failure: exit status 1, first error inline,
   `why.txt` still on disk under the run's basetemp.
7. **Run metadata + append-only ledger.** `metadata.json` and `summary.txt` per
   run; one JSON line per suite per run in `.local/perf/ledger.jsonl` plus one
   runner-level line with the gate's wall clock, worker count and exit status.
   Fields include commit, branch, dirty flag, Python/pytest versions, CPU count,
   RAM, scratch location and phase split.
8. **Host-aware sizing with overrides.** CPU count is detected (`nproc`, then
   `getconf`), the RAM ceiling is a fraction of `MemTotal`, and every value has
   an environment override plus an off switch (see § Knobs). The per-test
   watchdog limit is configurable via pytest-timeout.

## Sharding: measured, available, and off by default

The suites are shardable and were validated sharded (`186 passed` with 3
workers, same 186 tests). But measured, sharding **costs** time at the current
suite size:

| workers per lane | add-on suite | whole gate |
|---|---|---|
| 1 (serial) | 1.80 s | **2.75 s** |
| 2 | 1.81 s | 2.78 s |
| 3 | 2.90 s | 3.80 s |

Each xdist worker costs ~0.6 s of interpreter + collection startup, and there
is only ~0.9 s of test body to divide. So the default is serial, with the
reason printed on every run (`per-test sharding off (measured: …)`).
`ESP_TREE_TEST_WORKERS=auto` sizes from the detected CPU count;
`ESP_TREE_TEST_WORKERS=N` sets it exactly. Re-measure when the suite grows: the
crossover is roughly a 4 s serial suite.

Lane-level concurrency (the two suites) is on by default — that one is free,
because the integration lane is 0.4 s and runs entirely inside the add-on lane.

## What stays serial, and why

- **Everything, by default** — see above: sharding is a measured regression, not
  a safety decision. There is no test in either suite that must run alone for
  correctness.
- **The two suites themselves** must stay separate *processes*
  (`ha_integration/tests/conftest.py` replaces `google.protobuf` in
  `sys.modules` during collection, which breaks the add-on's
  `esp_tree_runtime_pb2`). They are concurrent, not merged.
- Under xdist, process-wide state (`monkeypatch.setenv`, the `sys.modules` mock
  tree) is per worker process, so it is isolated by construction rather than
  serialised — this is why sharding was safe to enable at all.
- `test/run-tests.sh` (the standalone-container harness) is untouched: it tests
  a *running* container, not this tree, and has its own lifecycle.

## Knobs

| variable | default | meaning |
|---|---|---|
| `ESP_TREE_TEST_MODE` | `auto` | `docker` when the daemon answers, else `local` (project venv) |
| `ESP_TREE_TEST_WORKERS` | `1` | per-test shards; `auto` = detected CPUs (capped 8), `N` = exact |
| `ESP_TREE_TEST_SERIAL` | `0` | `1` runs the two lanes back-to-back |
| `ESP_TREE_TEST_RAMDISK` | `auto` | `1` require RAM scratch, `0` force disk (documented off switch) |
| `ESP_TREE_TEST_SCRATCH_DIR` | — | explicit `tmp_path` base, bypassing detection |
| `ESP_TREE_TEST_MEM_MB` | `auto` (60% of RAM) | per-process `RLIMIT_AS`; `0` disables the cap |
| `ESP_TREE_TEST_PYTHON` | `python3` | interpreter used to create the local venv |
| `ESP_TREE_TEST_VENV` | `.local/venv` | venv used by local mode |
| `ESP_TREE_TEST_REPORT_DIR` | `.local/perf` | logs, per-run detail, ledger |
| `PYTHON_TEST_IMAGE` | `python:3.11-slim-bookworm` | container image for Docker mode |

The memory cap is a real rlimit on each pytest process (and on its workers), so
an OOM kills the run rather than the machine. It is skipped, not fatal, where
`RLIMIT_AS` is unavailable.

## Fast local loop

```bash
# one test, ~1 s including startup
.local/venv/bin/python -m pytest test/tests/test_remote_device_row.py::test_late_joining_remote_is_persisted -q

# one file
.local/venv/bin/python -m pytest test/tests/test_v2_ota.py -q

# one lane of the gate
test/run-unit-tests.sh --local addon
```

## Diagnosing a failure without a re-run

Every run leaves, under `.local/perf/`:

- `runs/<run>-<suite>-<pid>/detail.log` — one line per test, `+<seconds since start>`,
  outcome, duration, setup/call split, plus captured stdout/stderr and the full
  traceback for failures.
- `runs/<run>-<suite>-<pid>/summary.txt` — the same summary the terminal printed,
  with the ten slowest tests and the first error.
- `runs/<run>-<suite>-<pid>/metadata.json` — commit, branch, dirty state, Python
  and pytest versions, CPU count, RAM, scratch location, memory cap, phase split.
- `ledger.jsonl` — one line per suite per run and one per gate, appended forever.

## Reproducing the numbers

The Docker path is the canonical isolated environment (`python:3.11-slim-bookworm`,
repo mounted read-only, pinned requirements). It could not be exercised on the
machine these numbers come from — no Docker daemon — so every measurement here
was taken with the **local venv** path, which installs the same pinned
requirement set (`requirements.txt` + `test/requirements-test.txt`) into
`.local/venv` and runs the same two pytest commands. That substitution is the
main unverified gap: the container path's command construction was checked with
a stub `docker` (arguments, mounts, generated inner script syntax) but not
executed.

```bash
bash test/run-unit-tests.sh                 # canonical gate (Docker if available)
bash test/run-unit-tests.sh --local        # pinned venv instead
./dev.sh verify addon                      # the same gate via dev.sh
```

Baseline, for comparison, on a checkout without these changes:

```bash
python -m pytest -p no:cacheprovider test/tests -q --durations=0
cd ha_integration && python -m pytest -p no:cacheprovider tests -q --durations=0
```

## Deferred / needs a decision

- **Docker-mode execution** is unverified here (no daemon). The script's argument
  construction and generated shell are syntax-checked; a run on a Docker host is
  the remaining proof.
- **Python version**: numbers come from the host's Python 3.14; the container and
  CI use 3.11. Nothing in the harness is version-specific, but the exact seconds
  will differ.
- **`test/run-tests.sh`** (standalone container harness) still installs pytest
  with `pip3` on every run and does not use the harness. It is a different
  target; left alone deliberately.
- **Coverage tooling** is not wired in, so "no assertion was lost" is evidenced by
  the identical test counts and the identical pass set, not by a coverage diff.
