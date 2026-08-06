#!/usr/bin/env bash
# Hook: suggest-validation.sh (PostToolUse on Write|Edit)
# Purpose: After editing a config/infra file, suggests the matching
#          validation command. Purely informational — never blocks.
# Why: Config and infra files (Terraform, K8s YAML, CI workflows) can have
#      subtle errors that only a validator/linter catches. A tip right
#      after the edit catches it before it reaches plan/apply/deploy.
# How: Matches the edited file path against known patterns, prints a tip.
# This project has no Kubernetes/Helm, so those template blocks were
# removed — what's left below is what this repo actually uses: Terraform,
# the Dockerfile, the GitHub Actions workflow, and package.json.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

if echo "$FILE_PATH" | grep -qE '\.tf$'; then
  TF_DIR=$(dirname "$FILE_PATH")
  echo "Tip: edited a Terraform file. Run 'terraform validate' and 'terraform fmt -check' in ${TF_DIR}/."
fi

if echo "$FILE_PATH" | grep -qE '\.github/workflows/.*\.(yaml|yml)$'; then
  echo "Tip: edited a CI workflow. Review it (or the pipeline-reviewer agent) before pushing —"
  echo "     a broken workflow only fails once it's already running in CI."
fi

if echo "$FILE_PATH" | grep -qE 'package\.json$'; then
  echo "Tip: edited package.json. Run the project's lint/test scripts before committing."
fi

if echo "$FILE_PATH" | grep -qiE 'dockerfile'; then
  echo "Tip: edited a Dockerfile. Consider 'hadolint <file>' if available, and a local build/run to confirm it still works."
fi

exit 0
