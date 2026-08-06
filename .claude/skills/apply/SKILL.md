# /apply [target]

Apply a previously saved plan from `/plan`. Never applies without one, and
never auto-approves.

```
cd terraform && terraform apply plan.out
```

Never `-auto-approve` — always the saved plan file from `/plan`, reviewed first.

## Arguments

- `target` — not used by this project (single environment, single `terraform/` root). Kept for template compatibility, ignore it.

## Steps

1. Check that a saved plan from `/plan` actually exists for this target.
   If it doesn't, stop and tell the user to run `/plan` first — **never**
   silently fall back to computing and applying a fresh plan in the same
   step.
2. Show the plan summary again, so the user is confirming what they
   actually reviewed, not trusting memory.
3. Ask for explicit confirmation before applying:
   - "About to apply this plan to **{target}**. This will modify real
     resources."
   - If `target` looks like a production environment, add an extra explicit
     warning naming it as such.
4. Only after confirmation, run the apply command using the saved plan
   (not a fresh computation).
5. After it completes, show what was actually created/changed/destroyed,
   and any outputs/values the user would need next.

## Important

- **Never** apply without a saved, previously-reviewed plan.
- **Never** use an auto-approve/`--yes`/`-y` flag that skips confirmation.
- Always get explicit confirmation, with extra emphasis for anything that
  looks like a production target.
- If the apply fails partway through, show the error and do not
  automatically retry — a partial apply needs human judgment about what
  state things are actually in before trying again.
