# /rollback [target] [env]

Undo a bad deploy — the reverse of `/deploy`. Like `/deploy`, this is the
skill most likely to need a full rewrite per project rather than light
editing, since "previous known-good state" means something different for
every stack.

<FILL IN: replace the whole Steps section with this project's actual
rollback mechanism. Examples from prior projects this template is
distilled from:
- Kubernetes/GitOps: `kubectl rollout undo deployment/{target} -n {env}`
  (or, if GitOps-managed, revert the commit that changed the image tag and
  let ArgoCD/Flux sync it back — never `kubectl rollout undo` directly
  against a cluster GitOps owns, same rule as `/deploy`)
- Static site (S3/CDN-style): re-sync the previous build artifact/version
  to the bucket, re-invalidate the CDN cache
- Terraform-managed infra: this is rarely a clean "rollback" — usually
  means applying a previous, previously-reviewed plan (go through
  `/plan` → `/apply` again with the last-known-good config), not a single
  rollback command
- Serverless: redeploy the previous function version/alias via the
  platform's CLI>

## Arguments

- `target` — <FILL IN: e.g. service/component name, or `all`>
- `env` — target environment (default: whatever this project calls its
  primary/dev environment)

## Steps

1. Identify the current revision and the previous known-good one — show
   both to the user before doing anything (image tag, commit SHA, plan
   file, build artifact version, whatever this project's unit of "a
   revision" actually is).
2. **For a production-like `env`, require explicit confirmation before
   proceeding** — same rule as `/apply`: name the environment explicitly,
   state what will change, wait for a real yes.
3. Execute the rollback to the previous revision.
4. Monitor/verify it actually took effect (rollout status, a health
   check, whatever this project's real signal is) — a rollback command
   exiting 0 is not the same as the previous version actually being live.
5. Show a summary: what was rolled back, from which revision to which,
   and current status.

## Important

- If this project uses GitOps, rolling back means reverting the commit
  and letting the GitOps tool sync — never bypass it with a direct
  cluster command, same rule as `/deploy`.
- If the rollback itself fails partway through, stop and show the error —
  do not automatically retry. A partially-rolled-back system needs a
  human to assess actual state before trying anything else.
- After a rollback, suggest verifying with whatever this project's
  smoke-test/health-check process is, if one exists.
