from __future__ import annotations

import os
import re
import tempfile
from pathlib import Path

import yaml


_COMPONENTS_ABSOLUTE = "/opt/esp-tree/components"


class ESPHomeLoader(yaml.SafeLoader):
    """``yaml.SafeLoader`` that survives ESPHome's ``!secret`` tag.

    Every bridge and remote scaffold this add-on writes references its credentials
    as ``psk: !secret espnow_psk``. ``SafeLoader`` has no constructor for that tag,
    so ``construct_undefined`` raises ``ConstructorError`` - a ``YAMLError`` - and
    any code that parsed a real config with ``yaml.safe_load`` saw a parse failure
    on perfectly valid YAML. That is exactly how the ESP-NOW mode lookup came to
    report "active bridge YAML is invalid" for every bridge it was supposed to
    describe.

    Resolving ``!secret`` to the referenced name (rather than to its value) keeps
    the parse purely structural: no file is read and no arbitrary constructor is
    reachable, so untrusted config text stays as safe to load as with SafeLoader.
    """


def _construct_secret(loader: yaml.SafeLoader, node: yaml.Node) -> str:
    return loader.construct_scalar(node)


ESPHomeLoader.add_constructor("!secret", _construct_secret)


def load_esphome_config(content: str) -> dict:
    """Parse ESPHome config text, tolerating ``!secret``.

    Returns a mapping always, so callers can index into it without a second
    ``isinstance`` check; a document that is empty, a scalar, or a sequence is
    treated as carrying no keys and yields ``{}``.

    Raises ``yaml.YAMLError`` for text that genuinely does not parse.
    """
    loaded = yaml.load(content, Loader=ESPHomeLoader)
    return loaded if isinstance(loaded, dict) else {}


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
            # secrets.yaml holds no !secret tags, but parsing it with the same
            # loader as device configs keeps a hand-edited file that does reference
            # one from raising an unhandled YAMLError (a 500) out of a merge.
            existing = load_esphome_config(path.read_text(encoding="utf-8"))
        existing.update(new_values)
        path.parent.mkdir(parents=True, exist_ok=True)
        self._atomic_write(path, yaml.dump(existing, default_flow_style=False))

    def get_factory_binary(self, esphome_name: str) -> Path | None:
        path = self._device_dir(esphome_name) / f"{esphome_name}.factory.bin"
        return path if path.exists() else None

    def has_config(self, esphome_name: str) -> bool:
        return self._yaml_path(esphome_name).exists()
