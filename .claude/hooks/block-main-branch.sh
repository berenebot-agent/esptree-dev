#!/bin/bash
# Claude Code PreToolUse guard for ESP Tree: the repository is master-only.
#
# Blocks any command that would put work on `main` (the retired branch), and blocks
# bare `git push` / `git push origin`, which follow the upstream branch and are how
# `main` was resurrected once already. Use `git push origin HEAD:master`.
#
# Exit 2 = block; the message on stderr is shown to the agent.

INPUT=$(cat)
COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)
if [ -z "$COMMAND" ] && command -v python3 >/dev/null 2>&1; then
  COMMAND=$(printf '%s' "$INPUT" | python3 -c 'import json,sys
try:
    print(json.load(sys.stdin).get("tool_input", {}).get("command", ""))
except Exception:
    pass' 2>/dev/null)
fi
[ -n "$COMMAND" ] || COMMAND=$(printf '%s' "$INPUT" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p')

block() {
  echo "BLOCKED: $1" >&2
  echo "This repository is master-only (see AGENTS.md / CONTRIBUTING.md)." >&2
  echo "  Switch first:      git checkout master && git pull --ff-only" >&2
  echo "  Push explicitly:   git push origin HEAD:master" >&2
  exit 2
}

# Normalise for matching.
flat=$(printf '%s' "$COMMAND" | tr '\n' ' ')

# 1. Anything that targets the retired branch by name.
if printf '%s' "$flat" | grep -qE '(^|[^[:alnum:]_/.-])main([^[:alnum:]_/.-]|$)'; then
  case "$flat" in
    *"git push"*|*"git checkout"*|*"git switch"*|*"git branch"*|*"git merge"*|*"git rebase"*|*"git reset"*|*"git pull"*|*"git fetch"*)
      block "command references 'main': $COMMAND" ;;
  esac
fi

# 2. push forms that do not name a destination branch.
if printf '%s' "$flat" | grep -qE 'git[[:space:]]+push([[:space:]]+[^[:space:];&|]+)?[[:space:]]*($|;|&|\|)'; then
  block "bare 'git push' follows the upstream branch: $COMMAND"
fi
if printf '%s' "$flat" | grep -qE 'git[[:space:]]+push[[:space:]]+(-u[[:space:]]+)?origin[[:space:]]*($|;|&|\|)'; then
  block "'git push origin' without a refspec: $COMMAND"
fi

# 3. Deleting or force-moving any branch is never an agent action in this repo.
if printf '%s' "$flat" | grep -qE 'git[[:space:]]+branch[[:space:]]+(-D|-d|--delete)'; then
  block "deleting a branch is a human decision: $COMMAND"
fi

exit 0
