#!/usr/bin/env python3
"""Check that documentation citations point at a real file and a real line.

Docs cite code as ``path/to/file.ext:123`` or ``file.ext:123-130``. The line
number is the part that rots: a file grows above the cited region and every
citation below it silently points at unrelated code. There is no way to keep
those numbers true by hand, so this check is deliberately shallow — it proves
the file exists and the cited line is inside it. It cannot prove the line still
holds the thing the prose describes; that is why new citations should name a
symbol or quote a log literal next to the number.

Run from anywhere: python3 scripts/check_doc_anchors.py [--quiet]
Exit code 1 when any citation is unresolvable or out of range.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

DOC_GLOBS = ("docs/**/*.md", "README.md", "CONTRIBUTING.md")

CITATION_RE = re.compile(
    r"(?P<path>[A-Za-z0-9_][A-Za-z0-9_./-]*\.(?:py|cpp|h|hpp|yml|yaml|sh|json|proto|ts|tsx|js|md))"
    r":(?P<start>\d+)(?:-(?P<end>\d+))?"
)

SKIP_DIRS = {
    ".git",
    ".github",
    "node_modules",
    "__pycache__",
    ".esphome",
    ".pio",
    "dist",
    "build",
    "ui/dist",
}

LINE_CACHE: dict[Path, int] = {}
BASENAME_INDEX: dict[str, list[Path]] | None = None


def iter_doc_files() -> list[Path]:
    files: list[Path] = []
    for pattern in DOC_GLOBS:
        files.extend(REPO_ROOT.glob(pattern))
    return sorted(set(files))


def build_basename_index() -> dict[str, list[Path]]:
    index: dict[str, list[Path]] = {}
    for root, dirs, names in os.walk(REPO_ROOT):
        root_path = Path(root)
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        for name in names:
            index.setdefault(name, []).append(root_path / name)
    return index


def line_count(path: Path) -> int:
    cached = LINE_CACHE.get(path)
    if cached is not None:
        return cached
    try:
        with path.open("rb") as handle:
            count = sum(1 for _ in handle)
    except OSError:
        count = -1
    LINE_CACHE[path] = count
    return count


def resolve(raw: str, index: dict[str, list[Path]]) -> list[Path]:
    direct = REPO_ROOT / raw
    if direct.is_file():
        return [direct]
    # Docs often cite a component-relative path (`esp_tree_remote/__init__.py`).
    # Match any file in the tree whose path ends with the cited one.
    suffix = "/" + raw.lstrip("./")
    return [c for c in index.get(Path(raw).name, []) if str(c).endswith(suffix)]


def check_file(doc: Path, index: dict[str, list[Path]], quiet: bool) -> int:
    problems = 0
    text = doc.read_text(encoding="utf-8")
    for line_no, line in enumerate(text.splitlines(), start=1):
        for match in CITATION_RE.finditer(line):
            raw_path = match.group("path")
            start = int(match.group("start"))
            end = int(match.group("end") or start)
            candidates = resolve(raw_path, index)
            rel_doc = doc.relative_to(REPO_ROOT)

            if not candidates:
                print(f"{rel_doc}:{line_no}: {match.group(0)} -> no such file")
                problems += 1
                continue

            existing = [c for c in candidates if c.is_file()]
            if not existing:
                print(f"{rel_doc}:{line_no}: {match.group(0)} -> no such file")
                problems += 1
                continue

            # A basename can exist twice (the two leaf components). Accept the
            # citation when at least one candidate is long enough.
            if not any(line_count(c) >= end for c in existing):
                longest = max(existing, key=line_count)
                print(
                    f"{rel_doc}:{line_no}: {match.group(0)} -> "
                    f"{longest.relative_to(REPO_ROOT)} has {line_count(longest)} lines"
                )
                problems += 1

    if not quiet and problems == 0:
        pass
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--quiet", action="store_true", help="only print problems")
    args = parser.parse_args()

    global BASENAME_INDEX
    BASENAME_INDEX = build_basename_index()

    docs = iter_doc_files()
    if not docs:
        print("No documentation files found.", file=sys.stderr)
        return 1

    total = 0
    for doc in docs:
        total += check_file(doc, BASENAME_INDEX, args.quiet)

    if total:
        print(f"\n{total} citation(s) point outside their file.", file=sys.stderr)
        return 1

    if not args.quiet:
        citations = sum(
            len(CITATION_RE.findall(d.read_text(encoding="utf-8"))) for d in docs
        )
        print(f"{citations} citations in {len(docs)} files resolve to a real line.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
