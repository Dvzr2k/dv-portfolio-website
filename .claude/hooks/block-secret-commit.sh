#!/usr/bin/env bash
# Hook: block-secret-commit.sh (PreToolUse on Bash)
# Purpose: Blocks git add/commit of files that may contain secrets.
# Why: Committing .env files, credentials, or key files to git is a security
#      incident. Once pushed, secrets are in git history forever — even
#      after deletion. Prevention is much cheaper than rotation.
# How: Checks git add/commit commands for bulk-add patterns and known
#      secret-like filenames. Exits 2 to deny. This hook is stack-agnostic
#      as written — extend SECRET_FILE_PATTERNS for anything project-specific
#      (e.g. a non-standard secrets file this project uses).

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

if echo "$COMMAND" | grep -qE 'git\s+(add|commit)'; then

  # 'git add .' / '-A' / '--all' can sweep in secret files without a human
  # actually looking at what's being staged.
  if echo "$COMMAND" | grep -qE 'git\s+add\s+(-A|--all|\.)'; then
    echo "BLOCKED: 'git add .' / 'git add -A' can accidentally stage secret files."
    echo ""
    echo "Add files explicitly by name instead, e.g.:"
    echo "  git add src/app.js src/config.js"
    echo ""
    echo "Or use 'git add -p' interactively in your terminal to review each hunk."
    exit 2
  fi

  SECRET_FILE_PATTERNS=(
    '\.env($|\s|/)'
    '\.tfvars($|\s)'
    '\.pem($|\s)'
    '\.key($|\s)'
    '\.p12($|\s)'
    '\.pfx($|\s)'
    'kubeconfig'
    'credentials\.json'
    'credentials\.yaml'
    '\.tfplan($|\s)'
    '\.plan($|\s)'
    'secrets\.ya?ml$'
    # <FILL IN>: add any project-specific secret filename patterns here
  )

  for pattern in "${SECRET_FILE_PATTERNS[@]}"; do
    if echo "$COMMAND" | grep -qiE "$pattern"; then
      echo "BLOCKED: Detected a likely secret file in this git command (matched: ${pattern})."
      echo ""
      echo "Files that may contain secrets should never be committed. Instead:"
      echo "  - Add the file to .gitignore"
      echo "  - Store real secrets in a secrets manager / vault"
      echo "  - Commit an .example version with placeholder values only"
      echo ""
      echo "If this is a false positive, run the git command directly in your terminal."
      exit 2
    fi
  done
fi

exit 0
