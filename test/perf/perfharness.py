"""Performance harness for the ESP Tree Python test suites.

Loaded by ``test/tests/conftest.py`` and ``ha_integration/tests/conftest.py`` so
that both suites get the same behaviour from a bare ``pytest`` invocation (CI
runs exactly that) and from ``test/run-unit-tests.sh``.

What it does, in the order the cost buckets were measured:

1. **Scratch on RAM, not on the slow data disk.** Every ``tmp_path`` in both
   suites lives under this filesystem's data disk, where an fsync costs tens of
   milliseconds. ``Database.init()`` commits once per statement, so a single
   test fixture cost ~20s of pure I/O wait there and ~4ms on tmpfs. The harness
   re-points pytest's basetemp at a RAM-backed directory when one is available
   (``/dev/shm`` on Linux), keeping pytest's own per-test directories and
   cleanup semantics untouched.
2. **Two-tier logging.** A summary goes to stdout; full per-test detail with
   timestamps relative to run start always goes to a file, so a failure never
   needs a re-run to diagnose. Artifacts are kept on failure and removed on
   success.
3. **Run metadata and an append-only ledger** so trends and regressions survive
   log pruning.
4. **A host-aware memory ceiling** applied as a process rlimit, so a runaway
   test kills the worker instead of the machine.

Every knob is an environment variable with a working default, and every
feature has an off switch. Sizing *workers* is deliberately not done here: the
suite runner (``test/run-unit-tests.sh``) owns that, because it also decides how
many suites run as concurrent lanes.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import pytest

ENV_SCRATCH = "ESP_TREE_TEST_SCRATCH_DIR"
ENV_RAMDISK = "ESP_TREE_TEST_RAMDISK"
ENV_REPORT_DIR = "ESP_TREE_TEST_REPORT_DIR"
ENV_MEM_MB = "ESP_TREE_TEST_MEM_MB"
ENV_SUITE = "ESP_TREE_TEST_SUITE"
ENV_LEDGER = "ESP_TREE_TEST_LEDGER"

RAMDISK_CANDIDATES = ("/dev/shm", "/run/shm")
RAMDISK_MIN_FREE_MB = 24
RAMDISK_FALLBACK = "/tmp"

# A test whose call phase exceeds this is called out in the summary; it is
# reporting only, never a failure.
SLOW_TEST_S = 1.0


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _truthy(value: str) -> bool:
    return value.strip().lower() in {"1", "yes", "true", "on", "auto"}


def _mem_total_mb() -> int:
    try:
        with open("/proc/meminfo", encoding="utf-8") as fh:
            for line in fh:
                if line.startswith("MemTotal:"):
                    return int(line.split()[1]) // 1024
    except OSError:
        pass
    try:
        return int(os.sysconf("SC_PHYS_PAGES") * os.sysconf("SC_PAGE_SIZE") / (1024 * 1024))
    except (ValueError, OSError, AttributeError):
        return 0


def _pick_ramdisk() -> Path | None:
    """First writable RAM-backed directory with room, or None."""
    for candidate in RAMDISK_CANDIDATES:
        path = Path(candidate)
        if not path.is_dir() or not os.access(path, os.W_OK):
            continue
        try:
            usage = shutil.disk_usage(path)
        except OSError:
            continue
        # tmpfs reports the mount's size; refuse a mount too small to hold a
        # full run's scratch (each test directory is a few hundred KB).
        if usage.total >= RAMDISK_MIN_FREE_MB * 1024 * 1024:
            return path
    return None


def _git(*args: str) -> str:
    try:
        out = subprocess.run(
            ("git", "-C", str(_repo_root()), *args),
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except (OSError, subprocess.SubprocessError):
        return ""
    return out.stdout.strip() if out.returncode == 0 else ""


def _apply_memory_cap() -> int:
    """Cap this process's address space; returns the cap in MB (0 = none).

    The cap is a fraction of physical RAM by default so a runaway test dies
    instead of taking the host with it. ``ESP_TREE_TEST_MEM_MB=0`` disables it,
    which is the documented off switch for platforms where RLIMIT_AS upsets the
    interpreter.
    """
    raw = os.environ.get(ENV_MEM_MB, "auto").strip()
    if raw in {"", "0", "off", "none", "no"}:
        return 0
    if raw.lower() == "auto":
        total = _mem_total_mb()
        if not total:
            return 0
        mb = max(int(total * 0.6), 512)
    else:
        try:
            mb = int(raw)
        except ValueError:
            return 0
    if mb <= 0:
        return 0
    try:
        import resource

        soft, hard = resource.getrlimit(resource.RLIMIT_AS)
        cap = mb * 1024 * 1024
        if hard != resource.RLIM_INFINITY and hard < cap:
            cap = hard
        if soft == resource.RLIM_INFINITY or soft > cap:
            resource.setrlimit(resource.RLIMIT_AS, (cap, hard))
    except (ImportError, ValueError, OSError):
        # Non-fatal: a platform without RLIMIT_AS still runs the suite.
        return 0
    return mb


def _rel(start: float, now: float | None = None) -> str:
    return f"+{(now if now is not None else time.time()) - start:8.3f}s"


class PerfHarness:
    """Pytest plugin: run scratch, logging, metadata, ledger, memory cap."""

    def __init__(self) -> None:
        self.start = time.time()
        self.enabled = False
        self.mem_cap_mb = 0
        self.ramdisk: Path | None = None
        self.basetemp: Path | None = None
        self.report_dir: Path | None = None
        self.run_dir: Path | None = None
        self.detail_path: Path | None = None
        self.detail = None
        self.suite = "suite"
        self.is_worker = False
        self.tests: dict[str, dict] = {}
        self.collected = 0
        self.exitstatus = 0
        self.failures: list[str] = []
        self.first_error = ""

    # -- options -------------------------------------------------------

    def pytest_addoption(self, parser) -> None:
        group = parser.getgroup("esptree-perf", "ESP Tree test performance harness")
        group.addoption(
            "--perf-no-ramdisk",
            action="store_true",
            default=False,
            help="keep pytest's temp dirs on disk instead of RAM-backed scratch",
        )
        group.addoption(
            "--perf-report-dir",
            action="store",
            default=None,
            help="where to write run logs/ledger (default: <repo>/.local/perf)",
        )

    # -- setup ---------------------------------------------------------

    def pytest_configure(self, config) -> None:
        self.config = config
        if config.option.collectonly:
            return
        self.enabled = True
        register_xdist_bridge(config)
        self.suite = os.environ.get(ENV_SUITE) or Path(str(config.rootpath)).name or "suite"
        self.mem_cap_mb = _apply_memory_cap()

        self.report_dir = Path(
            config.getoption("--perf-report-dir")
            or os.environ.get(ENV_REPORT_DIR)
            or (_repo_root() / ".local" / "perf")
        )
        # Under xdist the master owns the run (summary, metadata, ledger); each
        # worker only appends its own detail log. Without this every worker
        # would file a separate "run" and the ledger would read as N runs.
        workerinput = getattr(config, "workerinput", None) or {}
        self.is_worker = bool(workerinput)
        run_id = time.strftime("%Y%m%dT%H%M%S", time.localtime(self.start))
        if self.is_worker and workerinput.get("perf_run_dir"):
            self.run_dir = Path(workerinput["perf_run_dir"])
            log_name = f"detail-worker-{os.getpid()}.log"
        else:
            self.run_dir = self.report_dir / "runs" / f"{run_id}-{self.suite}-{os.getpid()}"
            log_name = "detail.log"
        try:
            self.run_dir.mkdir(parents=True, exist_ok=True)
            self.detail_path = self.run_dir / log_name
            self.detail = self.detail_path.open("w", encoding="utf-8", buffering=1)
        except OSError:
            # Reporting must never be the reason a suite cannot run.
            self.detail = None
            self.run_dir = None

        self._point_basetemp(config)

        if self.detail:
            self.detail.write(
                f"# suite={self.suite} run={self.run_dir.name} pid={os.getpid()}\n"
                f"# cwd={os.getcwd()} rootdir={config.rootpath}\n"
                f"# basetemp={self.basetemp} ramdisk={'yes' if self.ramdisk else 'no'}\n"
                f"# mem_cap_mb={self.mem_cap_mb}\n"
            )

    def pytest_configure_node(self, node) -> None:
        """xdist master hook: tell each worker where the run's logs belong."""
        if self.run_dir is not None:
            try:
                node.workerinput["perf_run_dir"] = str(self.run_dir)
            except (AttributeError, TypeError):
                pass

    def _point_basetemp(self, config) -> None:
        explicit = config.getoption("--basetemp") or os.environ.get(ENV_SCRATCH)
        if explicit:
            self.basetemp = Path(str(explicit))
            # An xdist worker inherits the master's basetemp; report what it
            # actually sits on rather than assuming it is a disk path.
            if self.ramdisk is None and any(
                str(self.basetemp).startswith(str(Path(c))) for c in RAMDISK_CANDIDATES
            ):
                self.ramdisk = self.basetemp
            return

        use_ramdisk = _truthy(os.environ.get(ENV_RAMDISK, "auto")) and not config.getoption(
            "--perf-no-ramdisk"
        )
        root: Path | None = None
        if use_ramdisk:
            root = _pick_ramdisk()
            self.ramdisk = root
        if root is None:
            # Disk fallback: the repo's ignored scratch space when it is
            # writable (a read-only checkout, or the container's /repo mount,
            # is not), otherwise the system temp dir.
            root = _repo_root() / ".local" / "perf" / "tmp"
            try:
                root.mkdir(parents=True, exist_ok=True)
            except OSError:
                root = Path(tempfile.gettempdir()) / "esptree-tests"
                root.mkdir(parents=True, exist_ok=True)

        base = root / f"esptree-tests-{os.getuid()}-{os.getpid()}"
        self.basetemp = base
        try:
            config.option.basetemp = str(base)
        except (AttributeError, TypeError):
            pass
        # tmpdir's pytest_configure may already have built the factory; retarget
        # it so an already-created session fixture still lands on the new base.
        factory = getattr(config, "_tmp_path_factory", None)
        try:
            if factory is not None and factory._basetemp is None:
                factory._given_basetemp = base
        except (AttributeError, TypeError):
            pass

    def pytest_report_header(self, config) -> list[str]:
        if not self.enabled:
            return []
        bits = [f"perf: scratch={self.basetemp}"]
        bits.append("ramdisk=yes" if self.ramdisk else "ramdisk=no")
        if self.mem_cap_mb:
            bits.append(f"mem_cap={self.mem_cap_mb}MB")
        if self.report_dir:
            bits.append(f"reports={self.report_dir}")
        return [" ".join(bits)]

    # -- per test ------------------------------------------------------

    def pytest_collection_finish(self, session) -> None:
        self.collected = len(session.items)

    def pytest_runtest_logreport(self, report) -> None:
        if not self.enabled:
            return
        entry = self.tests.setdefault(
            report.nodeid,
            {"setup": 0.0, "call": 0.0, "teardown": 0.0, "outcome": "passed", "start": None, "logged": False},
        )
        entry[report.when] = getattr(report, "duration", 0.0)
        if entry["start"] is None:
            entry["start"] = getattr(report, "start", time.time())
        if report.failed:
            entry["outcome"] = "failed"
        elif report.skipped and entry["outcome"] != "failed":
            entry["outcome"] = "skipped"
        if report.failed:
            self.failures.append(report.nodeid)
            if not self.first_error:
                self.first_error = str(getattr(report, "longreprtext", "") or report.longrepr)[-4000:]
        # One line per test: emitted at teardown (the last report), or as soon as
        # a setup/call report fails so a crashed test is never silent in the log.
        if not entry["logged"] and (report.when == "teardown" or report.failed):
            entry["logged"] = True
            self._log_test(report.nodeid, entry, report)

    def _log_test(self, nodeid: str, entry: dict, report) -> None:
        if not self.detail:
            return
        total = sum(entry.get(p, 0.0) for p in ("setup", "call", "teardown"))
        self.detail.write(
            f"{_rel(self.start, entry['start'] or time.time())} "
            f"{entry['outcome'].upper():8s} {total:8.3f}s "
            f"(setup {entry['setup']:.3f}s call {entry['call']:.3f}s) {nodeid}\n"
        )
        for section, attr in (("stdout", "capstdout"), ("stderr", "capstderr")):
            chunk = getattr(report, attr, "")
            if chunk:
                self.detail.write(f"    --- {section} ---\n")
                for line in chunk.rstrip("\n").splitlines():
                    self.detail.write(f"    {line}\n")
        if report.failed:
            text = str(getattr(report, "longreprtext", "") or report.longrepr)
            self.detail.write("    --- failure ---\n")
            for line in text.rstrip("\n").splitlines():
                self.detail.write(f"    {line}\n")

    # -- teardown ------------------------------------------------------

    def pytest_sessionfinish(self, session, exitstatus) -> None:
        if not self.enabled:
            return
        self.exitstatus = int(exitstatus)
        totals = {"passed": 0, "failed": 0, "skipped": 0}
        for entry in self.tests.values():
            totals[entry["outcome"]] += 1
        elapsed = time.time() - self.start
        setup = sum(e.get("setup", 0.0) for e in self.tests.values())
        call = sum(e.get("call", 0.0) for e in self.tests.values())
        teardown = sum(e.get("teardown", 0.0) for e in self.tests.values())

        meta = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(self.start)),
            "suite": self.suite,
            "elapsed_s": round(elapsed, 3),
            "tests": len(self.tests),
            "collected": self.collected or len(self.tests),
            **totals,
            "setup_s": round(setup, 3),
            "call_s": round(call, 3),
            "teardown_s": round(teardown, 3),
            "overhead_s": round(max(elapsed - setup - call - teardown, 0.0), 3),
            "exitstatus": self.exitstatus,
            "workers": os.environ.get("ESP_TREE_TEST_WORKERS", "1"),
            "ramdisk": bool(self.ramdisk),
            "basetemp": str(self.basetemp) if self.basetemp else "",
            "mem_cap_mb": self.mem_cap_mb,
            "python": sys.version.split()[0],
            "pytest": _pytest_version(self.config),
            "cpu_count": os.cpu_count(),
            "mem_total_mb": _mem_total_mb(),
            "sha": _git("rev-parse", "HEAD"),
            "branch": _git("rev-parse", "--abbrev-ref", "HEAD"),
            "dirty": bool(_git("status", "--porcelain", "--untracked-files=no")),
        }
        self.metadata = meta

        if self.is_worker:
            # The master aggregates every report (including ours) and owns the
            # summary/metadata/ledger, so a worker only closes its detail log.
            if self.detail:
                self.detail.write(f"# worker-summary {json.dumps(meta)}\n")
                self.detail.close()
                self.detail = None
            return

        if self.run_dir:
            try:
                (self.run_dir / "metadata.json").write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
                (self.run_dir / "summary.txt").write_text(self._summary_text(meta) + "\n", encoding="utf-8")
            except OSError:
                pass
        self._append_ledger(meta)

        if self.detail:
            self.detail.write(f"# summary {json.dumps(meta)}\n")
            self.detail.close()
            self.detail = None

        # Artifacts on failure, clean up on success (RAM scratch only: a
        # disk-backed basetemp is inside the repo's own ignored scratch tree).
        if self.basetemp and self.basetemp.exists() and not self.failures:
            try:
                shutil.rmtree(self.basetemp, ignore_errors=True)
            except OSError:
                pass

    def _append_ledger(self, meta: dict) -> None:
        path = Path(os.environ.get(ENV_LEDGER) or (self.report_dir / "ledger.jsonl"))
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(meta, sort_keys=True) + "\n")
        except OSError:
            pass

    def _summary_text(self, meta: dict) -> str:
        lines = [
            f"suite:      {meta['suite']}",
            f"commit:     {meta['sha'][:12]} ({meta['branch']}{', dirty' if meta['dirty'] else ''})",
            f"tests:      {meta['tests']} run of {meta['collected']} collected "
            f"({meta['passed']} passed, {meta['failed']} failed, {meta['skipped']} skipped)",
            f"elapsed:    {meta['elapsed_s']:.2f}s",
            f"phases:     setup {meta['setup_s']:.2f}s, call {meta['call_s']:.2f}s, "
            f"teardown {meta['teardown_s']:.2f}s, harness/collect {meta['overhead_s']:.2f}s",
            f"workers:    {meta['workers']}  scratch: {'ramdisk' if meta['ramdisk'] else 'disk'} "
            f"({meta['basetemp']})  mem cap: {meta['mem_cap_mb']}MB",
            "",
            "slowest tests:",
        ]
        slowest = sorted(
            self.tests.items(), key=lambda kv: sum(kv[1].get(p, 0.0) for p in ("setup", "call", "teardown")), reverse=True
        )[:10]
        for nodeid, entry in slowest:
            total = sum(entry.get(p, 0.0) for p in ("setup", "call", "teardown"))
            lines.append(f"  {total:7.3f}s  {entry['outcome']:8s} {nodeid}")
        if self.first_error:
            lines.extend(["", "first failure:", self.first_error])
        return "\n".join(lines)

    def pytest_terminal_summary(self, terminalreporter, exitstatus, config) -> None:
        if not self.enabled or self.is_worker:
            return
        meta = getattr(self, "metadata", None)
        if not meta:
            return
        tr = terminalreporter
        tr.write_sep("-", "esptree test performance")
        tr.write_line(
            f"{meta['tests']} tests in {meta['elapsed_s']:.2f}s "
            f"({meta['passed']} passed, {meta['failed']} failed, {meta['skipped']} skipped) "
            f"| setup {meta['setup_s']:.2f}s call {meta['call_s']:.2f}s teardown {meta['teardown_s']:.2f}s "
            f"harness {meta['overhead_s']:.2f}s"
        )
        tr.write_line(
            f"scratch: {'ramdisk' if meta['ramdisk'] else 'disk'} {meta['basetemp']} | "
            f"workers {meta['workers']} | mem cap {meta['mem_cap_mb']}MB"
        )
        slow = sorted(
            self.tests.items(), key=lambda kv: sum(kv[1].get(p, 0.0) for p in ("setup", "call", "teardown")), reverse=True
        )[:5]
        for nodeid, entry in slow:
            total = sum(entry.get(p, 0.0) for p in ("setup", "call", "teardown"))
            if total < SLOW_TEST_S:
                break
            tr.write_line(f"  slow: {total:7.3f}s {nodeid}")
        if self.failures:
            tr.write_line(f"artifacts kept for {len(self.failures)} failure(s): {self.run_dir}")
            if self.first_error:
                tr.write_line("first error:")
                for line in self.first_error.splitlines():
                    tr.write_line(f"  {line}")
        elif self.run_dir:
            tr.write_line(f"logs: {self.run_dir}  ledger: {self.report_dir / 'ledger.jsonl'}")


def _pytest_version(config) -> str:
    return getattr(pytest, "__version__", "")


PLUGIN = PerfHarness()


class _XdistBridge:
    """Carries the one xdist-only hook, registered only when xdist is active.

    Declaring ``pytest_configure_node`` in a conftest (or on an always-registered
    plugin) is a ``PluginValidationError`` wherever xdist's hook spec is absent,
    including the ``-p no:xdist`` case, so it is registered conditionally.
    """

    def __init__(self, harness: PerfHarness) -> None:
        self.harness = harness

    def pytest_configure_node(self, node) -> None:
        self.harness.pytest_configure_node(node)


def register_xdist_bridge(config) -> None:
    pluginmanager = config.pluginmanager
    if not pluginmanager.has_plugin("xdist"):
        return
    try:
        pluginmanager.register(_XdistBridge(PLUGIN), "esptree-perf-xdist")
    except ValueError:
        # Already registered (a second suite in the same process, or a re-configure).
        pass
