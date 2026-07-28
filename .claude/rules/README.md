# Rules

Files here are auto-loaded into context only when Claude touches a file
matching their `paths:` frontmatter glob — unlike CLAUDE.md (always loaded)
or a skill (loaded on invocation), a rule loads itself in based on what's
being edited.

This exists so CLAUDE.md can stay a short skeleton. Detailed, stack-specific
convention (module structure, naming, required tags/labels, security
requirements for *this* layer of the stack) belongs in a rule file next to
the code it governs, not crammed into CLAUDE.md where it bloats every
conversation regardless of whether that stack is even touched.

## Format

```markdown
---
paths:
  - "terraform/**/*.tf"
  - "terraform/**/*.tfvars"
---

# Terraform Rules

## Module Structure
...
```

- `paths:` — one or more globs, relative to repo root. As soon as a tool
  call touches a matching file, this rule's content loads into context.
- Everything below the frontmatter is plain markdown — structure it however
  reads clearly (headings, tables, code blocks of the required shape).

## Adding a rule

One file per stack layer/directory that has real, non-obvious conventions —
`terraform.md`, `kubernetes.md`, `helm.md`, `pipelines.md`, `api.md`,
whatever this project actually has. Don't create a rule file for a
directory that's just "follow the linter" — a rule earns its place by
encoding something a linter or type checker can't check (naming schemes,
required tags/labels, ordering/dependency requirements, security
requirements specific to that layer).

`terraform.md` in this directory is a filled-out example of the shape —
copy it as a starting point for a new rule file, or delete it if this
project has no Terraform.
