# CLAUDE.md

This file gives Claude Code full context on this repository. Fill in every
`<PLACEHOLDER>` before starting real work — an unfilled CLAUDE.md is worse
than none, since Claude will otherwise guess at conventions instead of
following real ones.

## Project Overview

<ONE PARAGRAPH: what this project is, what it does, who it's for.>

## Directory Layout

```
<PASTE A REAL TREE OF THE REPO HERE — keep it updated as structure changes.
This is the single most useful section for orienting a fresh session; a
stale tree actively misleads.>
```

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| <e.g. Language/Runtime> | <e.g. Node 20 / Python 3.12 / Go 1.22> | |
| <e.g. IaC> | <e.g. Terraform, Pulumi, CDK, none> | |
| <e.g. Cloud/Hosting> | <e.g. AWS, GCP, Vercel, self-hosted> | |
| <e.g. CI/CD> | <e.g. GitHub Actions> | |
| <e.g. Database> | | |

## Conventions

<Naming conventions, formatting rules, where tests live, commit message
style, branch naming — whatever is real and non-obvious. Don't restate
what a linter already enforces; write down the things a linter can't
check, like "resource names use {project}-{env}-{resource}" or "every
new endpoint needs an integration test in tests/api/".>

## Security Rules (non-negotiable)

<List the hard constraints for this project specifically. Examples from
two real projects this template is distilled from:
- No secrets in code — use a secrets manager / vault, never .env in git
- No public storage buckets — block public access by default
- Least-privilege IAM/roles — no wildcard actions or resources
- Encryption at rest and in transit by default
- No destructive commands without a saved plan/dry-run reviewed first
Delete the ones that don't apply, add ones that do. A short real list
beats a long generic one nobody reads.>

## Environments

<If this project has multiple environments (dev/staging/prod), a table
here of what differs between them (replicas, approval gates, resource
sizes, sync/deploy policy) is one of the highest-value sections in this
file — reference it constantly instead of re-deriving it each time.>

|  | Dev | Prod |
|--|-----|------|
| <e.g. Deploy policy> | <e.g. auto> | <e.g. manual approval> |

## MCP Servers (`.mcp.json`)

<List what's actually enabled and why — not every option that exists.
`context7` ships by default (library/framework docs, no credentials
needed). Add anything else this project actually relies on, e.g.:>

| Server | Purpose |
|--------|---------|
| `context7` | Up-to-date library/framework documentation |
| <FILL IN or delete> | |

## Workflow Commands

```bash
npm run dev      # start the Astro dev server
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

When starting the dev server in this workflow, use background mode so the
session isn't blocked:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.

Astro docs, consult before working on related tasks:
- [Routing / dynamic routes / middleware](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components (React/Vue/Svelte)](https://docs.astro.build/en/guides/framework-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)

## Safety Layers (see .claude/hooks/)

| Hook | Type | What it catches |
|------|------|------------------|
| `block-prompt-intent.sh` | Block | Clearly destructive intent in the prompt itself ("delete everything"), before any tool call is attempted |
| `block-destructive-commands.sh` | Block | Irreversible commands (destroy, force-push, drop table) run via Bash |
| `block-mcp-destroy.sh` | Block | Same 'destroy' operations, issued through an MCP tool call instead of Bash |
| `block-rm-critical-dirs.sh` | Block | `rm -rf` targeting this project's own code directories |
| `block-secret-commit.sh` | Block | Committing `.env`, `.pem`, `.key`, or other likely-secret files |
| `warn-risky-action.sh` | Warn | Running an apply/deploy-type command with no preceding plan/dry-run in this session |
| `suggest-validation.sh` | Info | Suggests running lint/validate/test after editing config or infra files |
| `log-deploy-activity.sh` | Info | Appends a timestamped line to `.claude/deploy.log` whenever an apply/deploy command runs |

These are starting points, not a finished set — add a hook whenever the
same kind of mistake gets made twice. See `.claude/hooks/README.md`.

## Agents (see .claude/agents/)

| Agent | Use for |
|-------|---------|
| `security-reviewer` | Security-focused review before merging/deploying |
| `cost-reviewer` | Flag expensive resources / cost regressions (delete if this project has no metered cloud spend) |
| `quality-reviewer` | Reuse, simplification, dead code, drift between docs and reality |
| `docs-reviewer` | Checks docs stay accurate against the actual code/paths/commands |
| `drift-detector` | Diffs Terraform state against real cloud resources (delete if this project isn't Terraform-managed) |
| `tf-writer` | Generates Terraform code — the only agent here that writes, not just reviews (delete if this project isn't Terraform-managed) |

## Rules (see .claude/rules/)

<Stack-specific convention that's too detailed for this file and shouldn't
load into every conversation regardless of what's being touched — module
structure, naming, required tags/labels, per-layer security requirements.
Each file auto-loads only when a matching path is touched (frontmatter
`paths:` glob). See `.claude/rules/README.md` for the format;
`.claude/rules/terraform.md` is a filled-out example — copy it for a new
stack layer, or delete it if this project has no Terraform.>

## Skills (see .claude/skills/)

| Skill | Does |
|-------|------|
| `/plan` | Preview a change before applying it (terraform plan, `--dry-run`, whatever this stack's equivalent is) |
| `/apply` | Apply a previously reviewed plan — never auto-approves, always requires the plan to exist first |
| `/audit` | Multi-angle review: security + cost + quality in one pass |
| `/deploy` | Build + deploy, matching however this specific project actually ships |

Each skill file in `.claude/skills/` has a `<FILL IN>` marker showing
exactly what needs project-specific commands substituted in.
