#!/usr/bin/env bash
# Hook: warn-risky-action.sh (PreToolUse on Bash)
# Purpose: Warns (doesn't block) when running an apply/deploy-type command
#          without having previewed the change first.
# Why: The safe pattern for any stateful change is preview → review → apply.
#      Skipping the preview step means the actual effect of a command is
#      only discovered after it's already run.
# How: Checks common apply-type commands across IaC tools for a preceding
#      plan/dry-run indicator. Exits 1 (warn, ask user) if missing, 0 if a
#      plan/dry-run marker is present or the command isn't apply-type.
# <FILL IN>: this covers Terraform/Terragrunt/Pulumi/kubectl generically —
# add this project's actual deploy command if it's something else entirely.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# --- Terraform / Terragrunt ---
if echo "$COMMAND" | grep -qE '(terraform|terragrunt)\s+apply'; then
  if echo "$COMMAND" | grep -qE 'apply\s+.*\.(out|tfplan)'; then
    exit 0  # a saved plan file was passed — safe pattern, allow
  fi
  if echo "$COMMAND" | grep -qE '\-auto-approve'; then
    echo "WARNING: 'apply -auto-approve' with no saved plan skips both the"
    echo "preview step AND the confirmation prompt."
    echo ""
    echo "Recommended: terraform plan -out plan.out  →  review  →  terraform apply plan.out"
    exit 1
  fi
  echo "WARNING: Running 'apply' without a saved plan file."
  echo "Recommended: terraform plan -out plan.out  →  review  →  terraform apply plan.out"
  exit 1
fi

# --- Pulumi ---
if echo "$COMMAND" | grep -qE 'pulumi\s+up' && echo "$COMMAND" | grep -qE '\-\-yes|\-y\b'; then
  echo "WARNING: 'pulumi up --yes' skips the interactive review of the diff."
  echo "Recommended: run 'pulumi preview' first, review it, then 'pulumi up' without --yes."
  exit 1
fi

# --- kubectl apply against a PROD-like namespace with no dry-run first ---
# Deliberately scoped to prod only — warning on every routine dev apply
# would fire constantly and train the user to ignore this hook entirely.
# <FILL IN>: replace 'prod' with this project's actual prod namespace name.
if echo "$COMMAND" | grep -qE 'kubectl\s+apply' \
   && echo "$COMMAND" | grep -qE '(-n|--namespace)[= ]?.*prod' \
   && ! echo "$COMMAND" | grep -qE '\-\-dry-run'; then
  echo "WARNING: Applying directly to a prod-like namespace with no dry-run first."
  echo "Recommended: kubectl apply --dry-run=client -f ... first, review the diff, then apply for real."
  exit 1
fi

exit 0
