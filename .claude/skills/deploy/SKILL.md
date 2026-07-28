# /deploy [env]

Build and ship this project's actual artifact — the specifics are entirely
project-dependent, so this file is the one most likely to need a full
rewrite rather than light editing.

<FILL IN: this is the biggest gap between any two real projects. Replace
the whole Steps section with what this project actually does to deploy.
Examples from prior projects this template is distilled from:
- Static site: `npm run build` → sync the build output to object storage →
  invalidate the CDN cache
- Containerized app: build image → push to registry → update the
  deployment manifest → let GitOps (ArgoCD/Flux) or a direct rollout apply it
- Serverless: package function → deploy via the platform's CLI>

## Arguments

- `env` — target environment (default: whatever this project calls its
  primary/dev environment)

## Steps

1. Build the deployable artifact.
2. <FILL IN: the actual ship step for this project>
3. Verify the deploy actually worked — hit a health endpoint, check a
   status API, whatever this project's real signal of "it's live" is. Do
   not report success just because the deploy *command* exited 0 — a
   command succeeding is not the same as the app actually being healthy.

## Important

- If this project uses GitOps (ArgoCD, Flux, etc.), this skill should stop
  at "commit + push" — it should **never** run `kubectl apply` directly
  against a cluster the GitOps tool is supposed to own. Committing and
  letting the GitOps tool sync is the deploy; running kubectl apply
  yourself bypasses and conflicts with it.
- For a production-like `env`, treat this the same as `/apply` — explicit
  confirmation before doing anything, no auto-approve.
