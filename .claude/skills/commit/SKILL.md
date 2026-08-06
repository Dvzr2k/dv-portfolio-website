# /commit [message-hint]

Stage, commit, and push — short, scannable messages, git mechanics only.

## Message format

**Title:** `type: subject` — subject is max 5 words, imperative, no
trailing period. Type is one of:

| Type | Use for |
|---|---|
| `add` | A genuinely new thing (a component, a skill, a resource) |
| `fix` | Correcting something that was wrong/broken |
| `update` | Changing something that already existed and worked |
| `remove` | Deleting something |
| `docs` | README/CLAUDE.md/comments only, no code behavior change |

Examples: `fix: routing bug on static pages` · `add: LinkedIn to contact
page` · `update: gradient landing color` · `remove: unused card class`

**Description:** one line, max 15 words, states *why* — not a restatement
of the title, not a file list. The diff already shows what changed; this
line is for context the diff can't carry (what broke, what was decided
and why).

If a change is too big to summarize honestly in 5+15 words, that's a
signal to split it into smaller commits — not a reason to stretch the format.

## Arguments

- `message-hint` — optional short description of what changed, if it
  isn't obvious from context. If omitted, infer the message from the
  actual diff — don't ask the user to restate what they just watched happen.

## Steps

1. `git status` — see exactly what changed.
2. `git diff` — read the actual changes, don't guess from memory.
3. `git add <file1> <file2> ...` — explicit filenames only, never
   `-A`/`--all`/`.`. This project's `block-secret-commit.sh` hook blocks
   bulk adds outright; treat this as the convention regardless.
4. `git diff --staged` — confirm only intended changes are staged,
   nothing sensitive, nothing swept in by accident.
5. Write the message: title (`type: subject`, ≤5 words) + blank line +
   description (≤15 words, states why). No `Co-Authored-By` trailer —
   explicit project convention.
6. `git commit -m "title" -m "description"`.
7. `git push origin <branch>`.
8. Report back: the title, and the actual remote update line
   (`abc123..def456  main -> main`) — not just "pushed."

## Important

- If `git status` shows files you didn't just edit, stop and ask before
  staging them — don't silently sweep in changes you don't have context on.
- If a hook blocks the add/commit, don't route around it — figure out
  whether it's a real match or a false positive, and fix the actual issue.
- Git mechanics only. If the change is app code that should go live,
  follow up with `/deploy` — this skill doesn't watch a pipeline or
  verify anything on the live site.
