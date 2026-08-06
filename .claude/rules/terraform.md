---
paths:
  - "terraform/**/*.tf"
  - "terraform/**/*.tfvars"
---

# Terraform Rules

This project has **one environment** (no dev/staging/prod split) — a
single flat `terraform/` root, not `terraform/environments/{env}/`. If
that ever changes, restructure into environment roots and update this
file accordingly.

## Module Structure

`terraform/` contains, flat, no subdirectories:
- `main.tf` — resource definitions
- `variables.tf` — input variables with descriptions and types
- `outputs.tf` — exported values (Cloud Run URL, WIF provider, etc.)
- `versions.tf` — required_providers block with version constraints
- `backend.tf` — remote state backend configuration

## Naming Conventions

- Resource names: `dv-portfolio-website` (the project/service/repo name is
  the same string everywhere — there's no `{env}` segment since there's
  only one environment)
- Terraform resource identifiers: snake_case (e.g., `google_cloud_run_v2_service.site`)
- Variable names: snake_case, descriptive (e.g., `project_id`, `github_repo`)
- Output names: snake_case (e.g., `cloud_run_url`, `workload_identity_provider`)

## Labels

GCP uses labels, not AWS-style tags. Terraform auto-applies
`goog-terraform-provisioned = "true"` to every resource that supports
labels — no additional custom labels have been added, since this is a
single-resource-per-type project where a `Project`/`Environment` label
pair would be redundant (the project ID already identifies it, and there's
only one environment).

## Variable Conventions

- Always include `description` and `type`
- Use `sensitive = true` for any secret values (none currently exist —
  auth is via Workload Identity Federation, not stored credentials)
- Provide sensible `default` values — this project's variables all have
  defaults since there's only one real configuration, not a menu of
  environments to choose between

## Security Requirements

- No inline credentials or hardcoded secrets — this project uses Workload
  Identity Federation instead of a service account key, so there is no
  credential to store in the first place
- No wildcard IAM — the deploy service account has exactly three scoped
  roles (`run.admin`, `artifactregistry.writer`, `iam.serviceAccountUser`)
- Encrypt all storage at rest (GCS default — no override needed)
- **Exception, deliberate:** `google_cloud_run_v2_service_iam_member.public`
  grants `roles/run.invoker` to `allUsers` — this is a public portfolio
  site, so public read access to the Cloud Run service itself is correct,
  not a security gap. Nothing else should be public.

## State Management

- Backend: GCS bucket `dv-portfolio-website-tfstate`, versioning enabled
- State key pattern: `terraform/state` (single environment, no `{env}` segment needed)
- The state bucket itself is created once, by hand (`gsutil mb` + `gsutil versioning set on`),
  outside Terraform — a backend can't bootstrap the bucket it depends on

## Workflow

1. `terraform fmt -recursive` — format before committing
2. `terraform validate` — syntax check after every edit
3. `terraform plan -out plan.out` — always save the plan
4. Review the plan — check resource counts, changes, deletions
5. `terraform apply plan.out` — apply the saved plan only
