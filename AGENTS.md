# Agent guidance (ESP Tree)

Short, binding rules for any agent working in this repository. The full workflow is in
`CONTRIBUTING.md`.

## Branch: `master` only

- `master` is the only branch and the release path. `main` was retired long ago; it was recreated
  once by a clone that still had `main` checked out, and that is the failure mode to prevent.
- Before committing, confirm the checkout is on `master`: `git rev-parse --abbrev-ref HEAD`.
  If it prints anything else, switch (`git checkout master && git pull --ff-only`) before working.
- Push by explicit refspec: `git push origin HEAD:master`. Never `git push origin main`, never a bare
  `git push` from a branch you did not verify.
- If `git ls-remote --heads origin` lists any head besides `master`, stop and report it instead of
  pushing — that is a resurrected branch, not a feature.

## Releases

The installed add-on is built by the Home Assistant Supervisor from the repository's **default
branch**, which is `master`. A commit on any other branch is not deployed, whatever was pushed.

- Do not hand-edit version lines. Use the release tooling:
  `bash /opt/data/skills/embedded/esptree-bump-push/scripts/bump-push.sh` (`--push-only` or
  `--deploy`), or `dev.sh qc` for the upstream QC path.
- Never force-push, never rewrite `master`, never bump twice for one change.

## Local-only guidance

- `.impeccable/`, agent scratch directories and review screenshots are untracked by design; keep them
  out of commits (`AGENTS.md` itself is tracked so every clone sees these rules).
