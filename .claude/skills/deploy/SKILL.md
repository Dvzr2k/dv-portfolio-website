# /deploy [env]

Build and ship this project's actual artifact — the specifics are entirely
project-dependent, so this file is the one most likely to need a full
rewrite rather than light editing.

This project deploys via CI, not a local build-and-ship command. Pushing
to `main` is the deploy — this skill's job is to push (if there are
committed-but-unpushed changes) and then watch the pipeline through to a
verified, real result.

## Arguments

- `env` — not used. This project has one environment; there's no dev/staging to target.

## Steps

1. Confirm the working tree is clean and the intended changes are already
   committed. Never push uncommitted or unreviewed changes.
2. `git push origin main`.
3. Watch the pipeline: `gh run watch <run-id> --exit-status` (get the run
   id via `gh run list --limit 1 --json databaseId -q '.[0].databaseId'`).
   It runs three jobs — build, artifact, deploy.
4. **Verify the live site, not just that the pipeline exited 0** — a green
   checkmark means the deploy *command* succeeded, not that the app is
   actually healthy:
   - `curl -s -o /dev/null -w "%{http_code}" https://app-valdezr.link/` — expect `200`
   - Check actual page *content* for at least one non-home route (e.g.
     `curl -s https://app-valdezr.link/about | grep -o "Zoluxiones"`) —
     status-code-only checks previously missed a real routing bug where
     every page silently served the homepage's content
5. Report the result with the real evidence gathered in step 4, not just "the workflow succeeded."

## Important

- If this project uses GitOps (ArgoCD, Flux, etc.), this skill should stop
  at "commit + push" — it should **never** run `kubectl apply` directly
  against a cluster the GitOps tool is supposed to own. Committing and
  letting the GitOps tool sync is the deploy; running kubectl apply
  yourself bypasses and conflicts with it.
- For a production-like `env`, treat this the same as `/apply` — explicit
  confirmation before doing anything, no auto-approve.
