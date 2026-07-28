---
paths:
  - "terraform/**/*.tf"
  - "terraform/**/*.tfvars"
---

# Terraform Rules

<Example/starting-point rule file — fill in the `<FILL IN>` markers below,
delete this file entirely if the project has no Terraform, or replace its
contents wholesale if this project's actual conventions differ.>

## Module Structure

Every module directory MUST contain:
- `main.tf` — resource definitions
- `variables.tf` — input variables with descriptions and types
- `outputs.tf` — exported values (IDs, ARNs, endpoints)
- `versions.tf` — required_providers block with version constraints

Environment root modules (`terraform/environments/{env}/`) additionally have:
- `backend.tf` — remote state backend configuration
- `terraform.tfvars` — environment-specific variable values (do NOT commit secrets)

## Naming Conventions

- Resource names: `<FILL IN: e.g. {project}-{env}-{resource}>`
- Terraform resource identifiers: snake_case (e.g., `aws_vpc.main`, `aws_subnet.private`)
- Variable names: snake_case, descriptive (e.g., `vpc_cidr_block`, `instance_type`)
- Output names: snake_case, prefixed by resource type (e.g., `vpc_id`, `cluster_endpoint`)

## Required Tags

Every taggable resource MUST include:

```hcl
tags = {
  Project     = "<FILL IN>"
  Environment = var.environment
  ManagedBy   = "terraform"
}
```

## Variable Conventions

- Always include `description` and `type`
- Use `validation` blocks for constrained values (e.g., environment must be "dev" or "prod")
- Use `sensitive = true` for any secret values
- Provide sensible `default` values where appropriate

## Security Requirements

- No inline credentials or hardcoded secrets — use a secrets manager data source
- No public storage buckets — block public access by default
- No wildcard IAM — use specific actions and resource ARNs
- Encrypt all storage at rest
- <FILL IN: any project-specific perimeter/network rule, e.g. "all resources
  in public subnets rely on security groups for access control, no NAT — see
  ADR-000X" — delete if not applicable>

## State Management

- Backend: <FILL IN: e.g. S3 bucket with versioning + DynamoDB for locking>
- State key pattern: `<FILL IN: e.g. {project}/{env}/terraform.tfstate>`
- Never store state locally in production
- Use `terraform_remote_state` data source for cross-module references

## Workflow

1. `terraform fmt -recursive` — format before committing
2. `terraform validate` — syntax check after every edit
3. `terraform plan -out plan.out` — always save the plan
4. Review the plan — check resource counts, changes, deletions
5. `terraform apply plan.out` — apply the saved plan only
