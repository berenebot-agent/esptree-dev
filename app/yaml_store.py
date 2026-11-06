from __future__ import annotations

import os
import re
import tempfile
from pathlib import Path

import yaml


_COMPONENTS_ABSOLUTE = "/opt/esp-tree/components"


class YAMLStore:
    def __init__(self, root: Path) -> None:
        self.root = root

    def _device_dir(self, esphome_name: str) -> Path:
        return self.root / esphome_name

    def _yaml_path(self, esphome_name: str) -> Path:
        return self._device_dir(esphome_name) / f"{esphome_name}.yaml"

    def get_config(self, esphome_name: str) -> str | None:
        path = self._yaml_path(esphome_name)
        if not path.exists():
            return None
        return path.read_text(encoding="utf-8")

    @staticmethod
    def _normalize_components_path(content: str) -> str:
        return re.sub(
            r"^(\s*path\s*:\s*)\.\./components\s*$",
            rf"\1{_COMPONENTS_ABSOLUTE}",
            content,
            flags=re.MULTILINE,
        )

    @staticmethod
    def _atomic_write(path: Path, content: str) -> None:
        """Replace ``path`` atomically so a failed write cannot truncate it.

        ``secrets.yaml`` holds the only copy of the ESP-NOW PSK, and device
        YAML is the last usable configuration for a node. A plain
        ``write_text`` truncates first, so a full disk or a kill between the
        open and the flush leaves an empty file and there is nothing to
        recover from. Write a sibling temp file, fsync it, then rename.
        """
        path.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp_name = tempfile.mkstemp(
            prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent)
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as handle:
                handle.write(content)
                handle.flush()
                os.fsync(handle.fileno())
            os.replace(tmp_name, path)
        except BaseException:
            try:
                os.unlink(tmp_name)
            except OSError:
                pass
            raise
        try:
            dir_fd = os.open(path.parent, os.O_DIRECTORY)
            try:
                os.fsync(dir_fd)
            finally:
                os.close(dir_fd)
        except OSError:
            pass

    def save_config(self, esphome_name: str, content: str) -> None:
        device_dir = self._device_dir(esphome_name)
        device_dir.mkdir(parents=True, exist_ok=True)
        content = self._normalize_components_path(content)
        self._atomic_write(self._yaml_path(esphome_name), content)

    def delete_config(self, esphome_name: str) -> None:
        path = self._yaml_path(esphome_name)
        path.unlink(missing_ok=True)

    def list_configs(self) -> list[str]:
        names: list[str] = []
        if not self.root.exists():
            return names
        for entry in sorted(self.root.iterdir()):
            if entry.is_dir():
                yaml_file = entry / f"{entry.name}.yaml"
                if yaml_file.exists():
                    names.append(entry.name)
        return names

    def get_secrets(self) -> str:
        path = self.root / "secrets.yaml"
        if not path.exists():
            return ""
        return path.read_text(encoding="utf-8")

    def save_secrets(self, content: str) -> None:
        self._atomic_write(self.root / "secrets.yaml", content)

    def merge_secrets(self, new_values: dict[str, str]) -> None:
        path = self.root / "secrets.yaml"
        existing: dict = {}
        if path.exists():
            loaded = yaml.safe_load(path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                existing = loaded
        existing.update(new_values)
        path.parent.mkdir(parents=True, exist_ok=True)
        self._atomic_write(path, yaml.dump(existing, default_flow_style=False))

    def get_factory_binary(self, esphome_name: str) -> Path | None:
        path = self._device_dir(esphome_name) / f"{esphome_name}.factory.bin"
        return path if path.exists() else None

    def has_config(self, esphome_name: str) -> bool:
        return self._yaml_path(esphome_name).exists()
