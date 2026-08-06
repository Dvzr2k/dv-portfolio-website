# /rollback [target] [env]

Undo a bad deploy — the reverse of `/deploy`. Like `/deploy`, this is the
skill most likely to need a full rewrite per project rather than light
editing, since "previous known-good state" means something different for
every stack.

Cloud Run keeps prior revisions around by default — a rollback here means
shifting traffic back to the previous revision, not redeploying anything.

## Arguments

- `target` — not used. There's only one Cloud Run service.
- `env` — not used. One environment.

## Steps

1. List recent revisions and show them to the user before doing anything:
   ```
   gcloud run revisions list --service=dv-portfolio-website --region=us-central1 --project=dv-portfolio-website
   ```
2. Identify the current (bad) revision and the previous known-good one.
3. **Require explicit confirmation before proceeding** — this is the only
   environment there is, so every rollback here is effectively a
   production rollback. State exactly which revision traffic is moving to.
4. Shift 100% of traffic to the previous revision:
   ```
   gcloud run services update-traffic dv-portfolio-website --region=us-central1 --project=dv-portfolio-website --to-revisions=<PREVIOUS_REVISION>=100
   ```
5. Verify it actually took effect — a command exiting 0 is not the same as
   the previous version actually being live:
   - `curl -s https://app-valdezr.link/ | grep -o "intro.yml #1"` (or
     whatever content marker distinguishes the two versions)
6. Show a summary: which revision was live, which it's now on, and the
   verification result from step 5.
7. Note that this doesn't undo the *code* — the bad commit is still on
   `main`, so the next push (even an unrelated one, since the pipeline has
   no path filters yet) will redeploy it again unless the code itself is
   also reverted.

## Important

- If this project uses GitOps, rolling back means reverting the commit
  and letting the GitOps tool sync — never bypass it with a direct
  cluster command, same rule as `/deploy`.
- If the rollback itself fails partway through, stop and show the error —
  do not automatically retry. A partially-rolled-back system needs a
  human to assess actual state before trying anything else.
- After a rollback, suggest verifying with whatever this project's
  smoke-test/health-check process is, if one exists.
