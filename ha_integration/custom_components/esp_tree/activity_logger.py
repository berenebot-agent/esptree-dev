from __future__ import annotations

import logging
import logging.handlers
from pathlib import Path

from .const import SHARED_LOG_PATH

_LOGGER = logging.getLogger(__name__)


def _ensure_share_dir() -> bool:
    """Create the shared log directory and report whether it is usable.

    `/share` only exists on a Supervisor install. This runs at package-import
    time, so a missing or read-only share must not raise: an exception here
    reaches the user as "Config flow could not be loaded" rather than as any
    message about logging.
    """
    try:
        Path(SHARED_LOG_PATH).parent.mkdir(parents=True, exist_ok=True)
    except OSError:
        return False
    return True


class ActivityLogger:
    _instance: logging.Logger | None = None

    @classmethod
    def get(cls) -> logging.Logger:
        if cls._instance is None:
            logger = logging.getLogger("esp_tree.activity")
            logger.setLevel(logging.INFO)
            if not logger.handlers and _ensure_share_dir():
                try:
                    handler = logging.handlers.RotatingFileHandler(
                        SHARED_LOG_PATH,
                        maxBytes=5 * 1024 * 1024,
                        backupCount=3,
                    )
                except OSError as err:
                    _LOGGER.warning("Shared activity log %s unavailable: %s", SHARED_LOG_PATH, err)
                else:
                    handler.setFormatter(
                        logging.Formatter(
                            "%(asctime)s %(levelname)-8s %(message)s",
                            datefmt="%Y-%m-%d %H:%M:%S",
                        )
                    )
                    logger.addHandler(handler)
            # With no file handler the records belong in the HA log instead.
            logger.propagate = not logger.handlers
            cls._instance = logger
        return cls._instance

    @classmethod
    def reset(cls) -> None:
        if cls._instance:
            for h in cls._instance.handlers[:]:
                cls._instance.removeHandler(h)
                h.close()
            cls._instance = None
