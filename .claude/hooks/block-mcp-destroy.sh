#!/usr/bin/env bash
# Hook: block-mcp-destroy.sh (PreToolUse on MCP tool calls, e.g. mcp__*__ExecuteTerraformCommand)
# Purpose: Blocks destroy-type operations issued through an MCP server.
# Why: block-destructive-commands.sh only inspects Bash commands typed into
#      the terminal. An MCP server (e.g. the Terraform MCP server) has its
#      own way of executing operations that never goes through Bash at all —
#      so a 'destroy' run through MCP would bypass that hook entirely. This
#      closes that specific gap.
# How: Reads the tool input JSON from stdin, checks known destroy-shaped
#      parameters. Exits 2 (deny) on a match, 0 (allow) otherwise.
# This project's only MCP server is `context7` (library docs lookup) — it
# has no mutation/execution capability, so there's no other MCP server
# parameter shape to add here. This hook stays generic (matches a bare
# 'destroy' command) in case a Terraform-executing MCP server is ever added
# later.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ "$COMMAND" = "destroy" ]; then
  echo "BLOCKED: 'destroy' via an MCP tool is not allowed via Claude Code."
  echo ""
  echo "This is irreversible. If intentional, run it directly in your own"
  echo "terminal — not through Claude Code — so a human explicitly executes it."
  exit 2
fi

exit 0
