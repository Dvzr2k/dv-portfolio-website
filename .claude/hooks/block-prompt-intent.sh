#!/usr/bin/env bash
# Hook: block-prompt-intent.sh (UserPromptSubmit)
# Purpose: Catches clearly destructive intent in the user's own prompt,
#          before Claude starts acting on it at all.
# Why: The other hooks catch dangerous commands right before they'd run —
#      this one is an earlier layer that catches the *request* itself
#      (e.g. "delete all the buckets", "nuke the database"). Defense in
#      depth: a typo or an ambiguous request gets a chance to be caught
#      before Claude even starts planning a response.
# How: Reads the prompt text from stdin, checks it against a short list of
#      unambiguous destructive-intent phrases. Outputs a JSON block decision
#      on a match. This is intentionally narrow — broad matching here would
#      block normal requests like "help me clean up this file" and train
#      the user to find ways around the hook.
# Project-specific danger zones: the GCP project itself, the Cloud Run
# service, the Terraform state bucket, and the live domain — this is a
# solo personal site, so any of these three things listed as a *request*
# should be caught before Claude ever starts planning a response.

set -euo pipefail

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')

if [ -z "$PROMPT" ]; then
  exit 0
fi

if echo "$PROMPT" | grep -iqE 'delete (all|everything)|destroy everything|remove all resources|wipe (the )?(database|db|bucket|cluster)|nuke|drop all (tables|databases)|delete the (gcp )?project|tear down cloud ?run|destroy (the )?(domain|bucket|tfstate)'; then
  echo '{"decision": "block", "reason": "This prompt reads as a request for broad, irreversible destruction. If this is really what you want, be specific about the exact target (a single resource/table/file), or run the destructive command directly in your own terminal instead of through Claude Code."}'
  exit 0
fi

exit 0
