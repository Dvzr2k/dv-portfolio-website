#!/usr/bin/env bash
# Hook: block-destructive-commands.sh (PreToolUse on Bash)
# Purpose: Hard-blocks irreversible commands. Generic across stacks — extend
#          the patterns below for whatever this project actually uses.
# Why: An irreversible command run by an agent, with no human in the loop
#      at the moment it executes, is the single highest-blast-radius mistake
#      an AI coding assistant can make. Destructive actions should always
#      require a human typing the command themselves, in their own terminal.
# How: Reads tool input JSON from stdin, checks the command against known
#      destructive patterns. Exits 2 (deny) on a match, 0 (allow) otherwise.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

deny() {
  echo "BLOCKED: $1"
  echo ""
  echo "This is irreversible. If intentional, run it directly in your own"
  echo "terminal — not through Claude Code — so a human explicitly executes it."
  exit 2
}

# --- Infrastructure-as-code destroy commands ---
echo "$COMMAND" | grep -qE '(terraform|terragrunt|pulumi)\s+destroy' && \
  deny "'destroy' on infrastructure state is not allowed via Claude Code."

echo "$COMMAND" | grep -qE '(terraform|terragrunt)\s+apply\s+.*-destroy' && \
  deny "'apply -destroy' is equivalent to a full destroy."

echo "$COMMAND" | grep -qE 'cdk\s+destroy' && \
  deny "'cdk destroy' is not allowed via Claude Code."

# --- Force-push / history rewrite on protected branches ---
# This repo has one branch, 'main' — already covered by the default pattern.
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force' && \
   echo "$COMMAND" | grep -qE '(main|master|prod(uction)?)'; then
  deny "Force-pushing a protected branch is not allowed via Claude Code."
fi

# --- GCP project / Cloud Run / bucket deletion ---
# This project has no database, Kubernetes, or AWS compute — those blocks
# from the template were removed as genuinely not applicable. What's real
# here: the GCP project itself, the Cloud Run service, and the two GCS
# buckets (Terraform state + nothing else).
echo "$COMMAND" | grep -qE 'gcloud\s+projects\s+delete' && \
  deny "Deleting the GCP project is not allowed via Claude Code."
echo "$COMMAND" | grep -qE 'gcloud\s+run\s+services\s+delete' && \
  deny "Deleting the Cloud Run service is not allowed via Claude Code."
echo "$COMMAND" | grep -qE 'gsutil\s+rm\s+.*-r.*gs://dv-portfolio-website-tfstate' && \
  deny "Deleting the Terraform state bucket is not allowed via Claude Code."

exit 0
