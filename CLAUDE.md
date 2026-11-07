# ESP Tree — instructions for Claude Code

Read `AGENTS.md` in this directory first; it is the source of truth and `CONTRIBUTING.md` has the full
workflow. This file exists because Claude Code loads `CLAUDE.md` by name.

## The one hard rule: `master` is the only branch

- `main` does not exist and must not be recreated. It was GitHub's initial branch, was retired onto
  `master`, and came back once because a checkout was still sitting on `main` and pushed there — the
  work sat invisible to the add-on store until it was merged by hand.
- Before you commit: `git rev-parse --abbrev-ref HEAD` must print `master`. If it prints `main`, stop and
  run `git checkout -B master origin/master` — do not commit on `main`, do not push `main`.
- Push only with an explicit refspec: `git push origin HEAD:master`. Never `git push`, never
  `git push origin`, never `git push origin main` — a bare push follows the upstream branch, which is how
  the branch got recreated.
- `git ls-remote --heads origin` must show exactly one head, `refs/heads/master`. If anything else
  appears, report it; do not push around it.

A PreToolUse hook enforces this: `.claude/hooks/block-main-branch.sh` blocks any git command that names
`main` and blocks bare `git push` / `git push origin` / branch deletion (exit 2). If the hook fires, the
fix is the checkout/refspec above, not a workaround.

## Releasing

- Never hand-edit version lines; the release tooling owns them. Upstream QC path is `./dev.sh qc`;
  the deploy path is `bash /opt/data/skills/embedded/esptree-bump-push/scripts/bump-push.sh`
  (`--push-only` or `--deploy`).
- The installed add-on is built by the Home Assistant Supervisor from the repository's **default
  branch**, which is `master`. Work on any other ref never deploys.

## Untracked by design

`.impeccable/`, review screenshots, agent scratch directories and mock backends stay out of commits.
