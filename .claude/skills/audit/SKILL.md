# /audit [scope]

Run a multi-angle review in parallel — security, cost, and quality in one
pass — using the reviewer subagents defined in `.claude/agents/`.

## Arguments

- `scope` — what to audit (default: the whole repo). Can be narrowed to a
  specific directory/module if only part of the project changed.

## Steps

1. Launch the relevant reviewer agents against `scope`, in parallel (not
   sequentially — they're independent and read-only, so there's no reason
   to wait for one before starting the next):
   - `security-reviewer`
   - `cost-reviewer` (skip if this project has no metered cloud spend —
     delete this line and the agent file if so)
   - `quality-reviewer`
   - `docs-reviewer` (only if `scope` includes documentation changes)
   - `drift-detector` (skip if this project isn't Terraform-managed —
     delete this line and the agent file if so)
2. Collect all findings once every agent has returned.
3. Present a single combined summary, findings ordered most-severe first
   across all categories — not grouped by agent, since severity matters
   more than which reviewer found it.
4. If any [CRITICAL] or [HIGH] findings exist, call them out explicitly at
   the top, separate from the full list, so they can't be missed by
   scrolling past.

## Output Format

```
## Audit: {scope}

### Needs attention now
{any CRITICAL/HIGH findings, or "None"}

### Full findings
{everything else, grouped by severity}

### Clean
{categories with zero findings — state this explicitly, don't omit}
```

## Important

- This skill only reports. It never fixes anything automatically — that's
  a separate, explicit step the user asks for after seeing the findings.
