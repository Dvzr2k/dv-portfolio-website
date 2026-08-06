# CLAUDE.md

This file gives Claude Code full context on this repository.

## Project Overview

Diego Valdez's personal portfolio — a bilingual (English/Spanish) Astro
site styled entirely around a DevOps/GitHub-Actions visual identity (a
"live-running pipeline" hero, dark GHA-card project pages, a terminal-style
boot intro). Built statically, deployed to Google Cloud Run via Terraform
and a GitHub Actions CI/CD pipeline, with DNS on AWS Route 53. The site is
itself a demonstration piece — containers, IaC, and a real (if
right-sized) CI/CD pipeline are the point, not just the cheapest way to
host a static page. Live at https://app-valdezr.link.

## Directory Layout

```
.
├── src/
│   ├── components/       # Astro components — Hero, Header, Footer, ProjectCard,
│   │                      #   ProjectDetail, BootIntro, About, Contact, TechIcon, etc.
│   ├── pages/             # file-based routing — index/about/contact/projects at
│   │                      #   the root (English), mirrored under pages/es/ (Spanish);
│   │                      #   pages/projects/[slug].astro is a dynamic per-project route
│   ├── data/              # projects.ts, skills.ts, experience.ts — real content,
│   │                      #   not hardcoded into components
│   ├── i18n/               # ui.ts (translation strings), utils.ts (lang/localizePath helpers)
│   ├── layouts/           # BaseLayout.astro — <head>, OG/Twitter meta, global <script>
│   ├── styles/            # global.css — design tokens, the body gradient, JetBrains Mono @font-face
│   └── assets/            # photo.jpg, self-hosted brand icon SVGs (icons/ — AWS/Azure/LinkedIn,
│                           #   pulled from devicon since simple-icons dropped those brands)
├── public/                # static passthrough — favicon, self-hosted font file, og-image.png
├── terraform/              # GCP infra — flat, single environment (see .claude/rules/terraform.md)
├── .github/workflows/      # deploy.yml — build → artifact → deploy, 3 separate jobs
├── Dockerfile              # packages the pre-built dist/ into a container (build happens
│                           #   in the pipeline, not inside Docker — see terraform/main.tf comments)
├── .claude/                # hooks, agents, skills, rules — see below
└── README.md               # architecture diagram + why-these-choices reasoning
```

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Framework | Astro (static output) | No SSR/Node adapter — every route is a pre-built HTML file |
| Language | TypeScript | |
| Styling | Plain CSS, component-scoped | No framework (no Tailwind/etc.) |
| Typography | JetBrains Mono, self-hosted | Single family for everything — see global.css comments |
| Container | Docker | Packages already-built `dist/`, doesn't build inside the image |
| Hosting | Google Cloud Run | Scale-to-zero, `cpu_idle: true` |
| Image registry | Google Artifact Registry | |
| IaC | Terraform | Single environment, flat `terraform/` root, GCS remote state |
| CI/CD | GitHub Actions | 3 jobs: build / artifact / deploy |
| Deploy auth | Workload Identity Federation | Keyless — no stored GCP key anywhere |
| DNS | AWS Route 53 | `app-valdezr.link`, managed outside GCP |

## Conventions

- **`git add` — always explicit file names, never `-A`/`--all`/`.`** —
  enforced by `block-secret-commit.sh`; the hook will reject a bulk add
  and tell you to name files explicitly.
- **No `Co-Authored-By` trailer in commits** — explicit preference, stated
  directly by the project owner.
- **Terraform: always plan → review → apply a saved file** — `terraform
  plan -out plan.out`, review it, then `terraform apply plan.out`. Never
  `-auto-approve`. `warn-risky-action.sh` enforces this.
- **i18n keys**: `section.key` (e.g. `project.viewRepo`, `hero.tagline`).
  Content strings get translated; terminal/chrome text that's meant to
  read as real system output (`workflow_dispatch`, `Run whoami`, project
  card status labels like `deployed`/`shipped`) stays English-only in both
  locales, matching how a real CLI/CI tool would actually behave.
- **The dark GHA-card palette (`#0d1117`/`#30363d`/etc.) is redefined as
  local CSS custom properties inside each component** that uses it (Hero,
  ProjectCard, ProjectDetail, Contact, BootIntro) rather than promoted to
  global tokens — an established repeated pattern, not duplication by accident.
- **Reveal-on-scroll**: the `.reveal` class + a single shared
  `IntersectionObserver` in `BaseLayout.astro`'s `<script>` — components
  opt in by adding the class and a `--reveal-delay` custom property, not by
  writing their own observer.
- Self-hosted assets only — no font/icon CDN links anywhere (fonts, icons,
  and the OG image are all committed into the repo or generated at build time).

## Security Rules (non-negotiable)

- No secrets in code, ever — this project has none to begin with, since
  deploy auth is Workload Identity Federation, not a stored service
  account key
- No wildcard IAM — the deploy service account has exactly three scoped
  roles (`run.admin`, `artifactregistry.writer`, `iam.serviceAccountUser`)
- Public access is scoped to exactly one resource on purpose: Cloud Run's
  `roles/run.invoker` for `allUsers` — this is a public portfolio site.
  Nothing else (Artifact Registry, the Terraform state bucket) should ever
  be public.
- HTTPS enforced everywhere via Cloud Run's Google-managed certificate
- No destructive commands without a saved Terraform plan reviewed first

## Environments

Single environment — no dev/staging/prod split. There is exactly one GCP
project (`dv-portfolio-website`), one Cloud Run service, one domain. If
this project ever needs more than one environment, restructure
`terraform/` into `terraform/environments/{env}/` and update
`.claude/rules/terraform.md` accordingly — don't bolt a second environment
onto the current flat layout.

## MCP Servers (`.mcp.json`)

| Server | Purpose |
|--------|---------|
| `context7` | Up-to-date library/framework documentation |

No GCP or Terraform MCP server is configured — direct `gcloud`/`terraform`
CLI access (both installed locally) covers everything needed, and is more
capable than a wrapped MCP tool would be for this project's size.

## Workflow Commands

```bash
npm run dev       # start the Astro dev server
npm run build     # production build → dist/
npm run preview   # preview the production build locally

cd terraform && terraform plan -out plan.out   # preview infra changes
cd terraform && terraform apply plan.out       # apply a reviewed plan — never -auto-approve
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
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styling](https://docs.astro.build/en/guides/styling/)

## Safety Layers (see .claude/hooks/)

| Hook | Type | What it catches |
|------|------|------------------|
| `block-prompt-intent.sh` | Block | Destructive intent in the prompt itself — generic phrases plus this project's real danger zones (deleting the GCP project, tearing down Cloud Run, destroying the state bucket) |
| `block-destructive-commands.sh` | Block | `terraform destroy`, force-push to `main`, deleting the GCP project/Cloud Run service/state bucket |
| `block-mcp-destroy.sh` | Block | Same 'destroy' intent via an MCP tool call — currently a no-op in practice since `context7` has no mutation capability, kept in case a Terraform-executing MCP server is added later |
| `block-rm-critical-dirs.sh` | Block | `rm -rf` targeting `.claude`, `terraform`, `.github`, or `src` |
| `block-secret-commit.sh` | Block | Bulk `git add`, and known secret-like filenames. Had a real false-positive bug (matched any dotfile as if it were `git add .`) found and fixed during this project's own setup |
| `warn-risky-action.sh` | Warn | `terraform apply` with no preceding saved plan |
| `suggest-validation.sh` | Info | Suggests `terraform validate`/`fmt` after editing `.tf` files, similar tips for the Dockerfile/workflow/package.json |
| `log-deploy-activity.sh` | Info | Logs `terraform apply` runs to `.claude/deploy.log` — the real deploy (`git push` → GitHub Actions) happens outside this hook's reach entirely |

## Agents (see .claude/agents/)

| Agent | Use for |
|-------|---------|
| `security-reviewer` | Security review — adapted to this stack: the public Cloud Run invoker is a known, intentional exception, not a finding |
| `cost-reviewer` | Cloud Run/Artifact Registry cost review — knows this site should realistically stay within Cloud Run's permanent free tier |
| `quality-reviewer` | Reuse, simplification, dead code, drift between docs and reality |
| `docs-reviewer` | Checks docs stay accurate against the actual code/paths/commands — this README was itself substantially out of date until a review caught it |
| `drift-detector` | Runs `cd terraform && terraform plan -detailed-exitcode` and reports any drift |
| `tf-writer` | Generates Terraform for GCP specifically (Cloud Run, Artifact Registry, WIF) — the only agent here that writes, not just reviews |

## Rules (see .claude/rules/)

`.claude/rules/terraform.md` documents this project's real Terraform
conventions — flat single-environment structure, GCS backend, the
intentional public-Cloud-Run exception. Loads automatically when a `.tf`
file is touched.

## Skills (see .claude/skills/)

| Skill | Does |
|-------|------|
| `/plan` | `terraform plan -out plan.out` |
| `/apply` | `terraform apply plan.out` — never auto-approves |
| `/audit` | Multi-angle review: security + cost + quality in one pass |
| `/deploy` | Push to `main` and watch the real pipeline through to a *verified* live result — not just a green checkmark |
| `/rollback` | Shifts Cloud Run traffic back to the previous revision via `gcloud run services update-traffic` |

All five are filled in for this project's real GCP/Terraform/Cloud Run
stack — none are still template placeholders.
