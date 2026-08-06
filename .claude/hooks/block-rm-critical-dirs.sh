#!/usr/bin/env bash
# Hook: block-rm-critical-dirs.sh (PreToolUse on Bash)
# Purpose: Blocks 'rm -rf' (or -fr/--recursive/--force) targeting directories
#          that hold this project's critical code.
# Why: block-destructive-commands.sh guards *cloud-side* destruction
#      (terraform destroy, DROP TABLE, etc.) but nothing previously guarded
#      against locally deleting the files that describe that infrastructure
#      in the first place — an 'rm -rf terraform/' is recoverable from git
#      history, but only if someone notices before it's committed over.
# How: Checks for rm with force/recursive flags targeting a directory in
#      PROTECTED_DIRS. Exits 2 (deny) on a match, 0 (allow) otherwise.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

PROTECTED_DIRS=".claude terraform .github src"

if echo "$COMMAND" | grep -qE 'rm\s+(-[a-zA-Z]*[rf][a-zA-Z]*\s+|--recursive|--force)'; then
  for dir in $PROTECTED_DIRS; do
    if echo "$COMMAND" | grep -qE "rm\s+.*(\s|/|^)\.?/?${dir}(/|\s|$)"; then
      echo "BLOCKED: Cannot 'rm -rf' the '${dir}/' directory."
      echo ""
      echo "This directory contains critical project code."
      echo "If you need to remove specific files, delete them individually."
      echo "If you need to reset the directory, use 'git checkout -- ${dir}/'."
      exit 2
    fi
  done
fi

exit 0
