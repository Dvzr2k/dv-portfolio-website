# /commit [message-hint]

Stage, commit, and push a change following this project's real git
conventions — so committing doesn't require re-explaining the same rules
every time.

## Arguments

- `message-hint` — optional short description of what changed, if it
  isn't obvious from context (e.g. "fix header padding"). If omitted,
  infer the message from the actual diff — don't ask the user to
  restate what they just watched happen.

## Steps

1. Run `git status` and `git diff` to see exactly what changed — never
   guess at what's being committed from memory.
2. Stage files **explicitly by name** — never `git add -A`/`--all`/`.`.
   This project's `block-secret-commit.sh` hook blocks bulk adds
   outright; explicit staging is the convention here regardless of
   whether a given repo happens to enforce it with a hook.
3. Review the staged diff (`git diff --staged`) for anything that
   shouldn't be committed — secrets, debug output, an unrelated file
   swept in by accident.
4. Write the commit message:
   - **Summary line** — imperative mood ("Fix X", "Add Y", "Update Z"),
     roughly under 70 characters, no trailing period.
   - **Body** (blank line, then prose) — explain *why*, not just what.
     The diff already shows what changed; the message should carry
     context the diff can't: a bug that was found and how, a decision
     that was made and the reasoning, what would break without this.
   - **No `Co-Authored-By` trailer** — explicit project convention,
     stated directly by the project owner. Don't add one by default.
5. Commit.
6. Push to the current branch.
7. Report back plainly: what was committed (the summary line is enough,
   don't re-paste the whole body), and confirm the push actually
   succeeded — show the remote update (`abc123..def456  main -> main`),
   not just "pushed."

## Important

- If `git status` shows files you didn't just edit, stop and ask before
  staging them — don't silently sweep in changes you don't have context on.
- If a hook blocks the add/commit (e.g. a suspected secret file), don't
  route around it — figure out whether it's a real match or a false
  positive, and fix the actual issue rather than bypassing the hook.
- This skill handles the git mechanics only. If the change is app code
  that should go live, follow up with `/deploy` — this skill doesn't
  watch a pipeline or verify anything on the live site.
