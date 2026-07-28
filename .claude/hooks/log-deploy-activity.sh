#!/usr/bin/env bash
# Hook: log-deploy-activity.sh (PostToolUse on Bash)
# Purpose: Appends a line to .claude/deploy.log every time an apply/deploy
#          command runs. Purely an audit trail — never blocks anything.
# Why: A plain "who ran what, when" record is cheap and useful after the
#      fact — e.g. correlating an incident with whether a deploy just ran.
# How: Matches the command against common apply/deploy patterns, appends a
#      timestamped line if it matches. <FILL IN>: add this project's actual
#      deploy command if it isn't one of the ones already listed below.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

if echo "$COMMAND" | grep -qE '(terraform|terragrunt)\s+apply|pulumi\s+up|kubectl\s+apply|cdk\s+deploy|argocd\s+app\s+sync'; then
  REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
  mkdir -p "$REPO_ROOT/.claude"
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $COMMAND" >> "$REPO_ROOT/.claude/deploy.log"
fi

exit 0
