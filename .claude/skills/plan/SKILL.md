# /plan [target]

Preview a change before applying it — the "look before you leap" half of
the plan → review → apply pattern. Never modifies real state.

<FILL IN: replace the steps below with this project's actual preview
command. Examples from prior projects this template is distilled from:
Terraform → `terraform plan -out plan.out`; Kubernetes → `kubectl diff -f
<file>` or `kubectl apply --dry-run=server -f <file>`; Pulumi → `pulumi
preview`; a database migration tool → its `--dry-run`/`plan` equivalent.>

## Arguments

- `target` — <FILL IN: e.g. environment name (`dev`/`prod`), or a specific
  file/module path>

## Steps

1. Determine what's being planned based on `target`.
2. Run the project's preview command, saving output to a file if the tool
   supports it (so `/apply` can consume the exact same reviewed plan later,
   not a fresh one that might differ).
3. Summarize the output:
   - What would be added / changed / destroyed
   - Any warnings or errors
   - **Explicitly call out anything destructive** — this needs the most
     careful review of anything in the output.

## Important

- Never apply anything from this skill — it only previews.
- Always save the plan output if the tool supports it, so `/apply` uses
  the exact reviewed plan, not a re-computed one.
- If the preview step itself fails, show the error and suggest likely
  fixes (auth, missing config, syntax error) rather than guessing silently.
