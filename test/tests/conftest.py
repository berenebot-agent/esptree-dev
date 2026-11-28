"""Add-on suite conftest: loads the shared performance harness.

The harness (``test/perf/perfharness.py``) is what keeps a bare
``python -m pytest test/tests`` fast and diagnosable: RAM-backed scratch for
``tmp_path``, per-test timing with always-on detail logs, run metadata and the
append-only ledger. See ``test/PERFORMANCE.md``.

The hooks are delegated rather than imported with ``pytest_plugins`` because
pytest refuses a ``pytest_plugins`` declaration in a non-root conftest.
"""

from __future__ import annotations

import sys
from pathlib import Path

_PERF_DIR = Path(__file__).resolve().parents[1] / "perf"
if str(_PERF_DIR) not in sys.path:
    sys.path.insert(0, str(_PERF_DIR))

import perfharness  # noqa: E402  (path set up above)

PLUGIN = perfharness.PLUGIN

pytest_addoption = PLUGIN.pytest_addoption
pytest_configure = PLUGIN.pytest_configure
pytest_report_header = PLUGIN.pytest_report_header
pytest_collection_finish = PLUGIN.pytest_collection_finish
pytest_runtest_logreport = PLUGIN.pytest_runtest_logreport
pytest_sessionfinish = PLUGIN.pytest_sessionfinish
pytest_terminal_summary = PLUGIN.pytest_terminal_summary
