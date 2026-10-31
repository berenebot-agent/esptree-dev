"""ActivityLogger must never stop the integration from importing.

`custom_components/esp_tree/__init__.py` calls `ActivityLogger.get()` at module
scope, and importing the package is a prerequisite for loading `config_flow.py`.
`/share` only exists on a Supervisor install, so an exception there reached users
as "Config flow could not be loaded: 500 Internal Server Error".
"""
from __future__ import annotations

import logging

from tests.conftest import import_entity


def test_unusable_share_dir_falls_back_to_the_ha_log(monkeypatch, tmp_path):
    module = import_entity("activity_logger")
    module.ActivityLogger.reset()
    blocker = tmp_path / "not-a-directory"
    blocker.write_text("x")
    monkeypatch.setattr(module, "SHARED_LOG_PATH", str(blocker / "activity.log"))

    try:
        logger = module.ActivityLogger.get()
        assert isinstance(logger, logging.Logger)
        assert logger.handlers == []
        assert logger.propagate is True
    finally:
        module.ActivityLogger.reset()


def test_writable_share_dir_gets_the_rotating_file_handler(monkeypatch, tmp_path):
    module = import_entity("activity_logger")
    module.ActivityLogger.reset()
    log_path = tmp_path / "esp_tree" / "activity.log"
    monkeypatch.setattr(module, "SHARED_LOG_PATH", str(log_path))

    try:
        logger = module.ActivityLogger.get()
        assert len(logger.handlers) == 1
        logger.info("activity probe")
        assert "activity probe" in log_path.read_text(encoding="utf-8")
        assert logger.propagate is False
    finally:
        module.ActivityLogger.reset()
