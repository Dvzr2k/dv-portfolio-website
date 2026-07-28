#!/usr/bin/env bash
# Hook: suggest-validation.sh (PostToolUse on Write|Edit)
# Purpose: After editing a config/infra file, suggests the matching
#          validation command. Purely informational — never blocks.
# Why: Config and infra files (Terraform, K8s YAML, CI workflows) can have
#      subtle errors that only a validator/linter catches. A tip right
#      after the edit catches it before it reaches plan/apply/deploy.
# How: Matches the edited file path against known patterns, prints a tip.
# <FILL IN>: delete the blocks for tools this project doesn't use, add
# blocks for ones it does (package.json → npm run lint, *.tf → terraform
# validate, Dockerfile → hadolint, etc.)

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

if echo "$FILE_PATH" | grep -qE '\.(yaml|yml)$' && echo "$FILE_PATH" | grep -qiE 'k8s|kubernetes|manifests?/'; then
  echo "Tip: edited a K8s manifest. Validate with: kubectl apply --dry-run=client -f ${FILE_PATH}"
fi

if echo "$FILE_PATH" | grep -qiE 'helm/.*\.(yaml|yml|tpl)$'; then
  echo "Tip: edited a Helm file. Validate with: helm lint <chart-dir> && helm template <chart-dir>"
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
