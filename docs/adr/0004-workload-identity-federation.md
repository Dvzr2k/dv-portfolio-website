# ADR-0004: Workload Identity Federation, not a stored service account key

**Status:** Accepted

## Context

GitHub Actions needs to authenticate to GCP to push images and deploy.
The two common options: generate a service account JSON key and store it
as a GitHub secret, or use Workload Identity Federation (WIF) — GitHub's
OIDC token gets exchanged for short-lived GCP credentials at runtime,
with no long-lived secret stored anywhere.

## Decision

Use WIF. Terraform provisions a workload identity pool and provider with
`attribute_condition = "assertion.repository == \"Dvzr2k/dv-portfolio-website\""`,
scoping the trust relationship to exactly this repo.

## Consequences

**Gained:**
- No long-lived credential exists anywhere that could leak — nothing to
  rotate, nothing sitting in GitHub secrets that outlives its usefulness
- The trust is scoped to one exact repo, so a leaked token from a
  different project can't be used to impersonate this one

**Given up / accepted cost:**
- More upfront setup complexity — a pool, a provider, and an IAM trust
  relationship, versus pasting one secret into GitHub
- Auth failures are harder to debug than "the key is wrong" — a
  misconfigured `attribute_condition` or pool/provider ID fails in less
  obvious ways than an invalid key would
