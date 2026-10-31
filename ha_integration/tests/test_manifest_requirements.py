"""Guards for the pip requirements the integration declares.

A custom integration whose requirement range cannot be satisfied together with
Home Assistant core's own pins does not fail at import: HA refuses to install the
requirement, `RequirementsNotFound` is raised while loading the config-flow
handler, and the frontend reports the opaque
"Config flow could not be loaded: 500 Internal Server Error".

That happened here: the manifest said `protobuf>=6.31.1,<7` while HA core
2026.10.4 pins `protobuf==7.36.0` in `homeassistant/package_constraints.txt`.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

from packaging.requirements import Requirement
from packaging.version import Version

_PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "esp_tree"
_MANIFEST = _PKG_DIR / "manifest.json"
_GENCODE = _PKG_DIR / "protobuf" / "generated" / "esp_tree_runtime_pb2.py"

# Home Assistant core's pin, from homeassistant/package_constraints.txt.
HA_CORE_PROTOBUF = "7.36.0"


def _protobuf_requirement() -> Requirement:
    manifest = json.loads(_MANIFEST.read_text(encoding="utf-8"))
    requirements = [Requirement(entry) for entry in manifest["requirements"]]
    matches = [req for req in requirements if req.name == "protobuf"]
    assert matches, "manifest.json no longer declares a protobuf requirement"
    return matches[0]


def _gencode_version() -> Version:
    header = _GENCODE.read_text(encoding="utf-8")[:512]
    match = re.search(r"^# Protobuf Python Version: (\S+)$", header, re.MULTILINE)
    assert match, "esp_tree_runtime_pb2.py has no gencode version header"
    return Version(match.group(1))


def test_requirement_accepts_bundled_gencode_version():
    """The runtime must never be older than the generated code it loads."""
    assert _gencode_version() in _protobuf_requirement().specifier


def test_requirement_accepts_home_assistant_core_pin():
    """HA installs its own protobuf; a cap below it makes the config flow 500."""
    assert Version(HA_CORE_PROTOBUF) in _protobuf_requirement().specifier
