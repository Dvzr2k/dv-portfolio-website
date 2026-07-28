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
# <FILL IN>: replace 'main|master|prod(uction)?' with this repo's actual
# protected branch name(s) if different.
if echo "$COMMAND" | grep -qE 'git\s+push\s+.*--force' && \
   echo "$COMMAND" | grep -qE '(main|master|prod(uction)?)'; then
  deny "Force-pushing a protected branch is not allowed via Claude Code."
fi

# --- Database drops/truncates ---
echo "$COMMAND" | grep -qiE '(DROP\s+(TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE)' && \
  deny "Dropping/truncating a database object is not allowed via Claude Code."

# --- Kubernetes: deleting whole namespaces or core workload objects in prod ---
# <FILL IN>: replace 'prod' below with this project's actual prod namespace name.
if echo "$COMMAND" | grep -qE 'kubectl\s+delete\s+(namespace|ns)\s+.*prod' ; then
  deny "Deleting a production namespace is not allowed via Claude Code."
fi
if echo "$COMMAND" | grep -qE 'kubectl\s+delete\s+(deployment|deploy|service|svc|ingress|secret|configmap|cm|pvc|statefulset|sts)\b' && \
   echo "$COMMAND" | grep -qE '(-n|--namespace)[= ]?.*prod'; then
  deny "Deleting workload resources in a production namespace is not allowed via Claude Code."
fi

# --- Cloud resource bulk-deletion (S3 buckets, RDS instances, etc.) ---
echo "$COMMAND" | grep -qE 'aws\s+s3\s+rb\s+.*--force' && \
  deny "Force-removing an S3 bucket (deletes all contents) is not allowed via Claude Code."
echo "$COMMAND" | grep -qE 'aws\s+rds\s+delete-db-instance' && \
  deny "Deleting an RDS instance is not allowed via Claude Code."

exit 0
