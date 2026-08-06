# ADR-0001: Cloud Run + Terraform + CI/CD, not Vercel/Netlify/Firebase

**Status:** Accepted

## Context

This is a fully static site — every route is pre-built HTML at build
time, no server-side rendering, no database, no dynamic API. For a
workload like that, purpose-built static hosts (Vercel, Netlify, Firebase
Hosting, GitHub Pages) are the objectively simpler choice: connect a
repo, set a build command, done — no containers, no IaC, no cloud IAM to
configure. What this project actually uses instead — a GCP project,
Terraform-managed Cloud Run and Artifact Registry, Workload Identity
Federation, a 3-job GitHub Actions pipeline — took an entire session of
infrastructure work that a static host would have made unnecessary in
about fifteen minutes.

## Decision

Deploy to GCP Cloud Run via Terraform-managed infrastructure and a real
CI/CD pipeline anyway, deliberately choosing the more complex path.

The reason: this is a DevOps/AgileOps portfolio. The site's job isn't
only to display content — it's also a live artifact proving the owner
can containerize an application, write infrastructure as code, and wire
up a secure CI/CD pipeline with keyless auth. A visiting recruiter can
open the GitHub repo and see real Terraform, a real multi-stage
pipeline, and real infrastructure decisions with written rationale (this
document) — none of which a Vercel deploy would demonstrate.

## Consequences

**Gained:**
- A working, live demonstration of container/Terraform/CI-CD skills,
  sitting right next to the content it's hosting — not a separate,
  disconnected portfolio project
- Full control over the exact infrastructure shape, rather than a
  platform's opinionated defaults

**Given up / accepted cost:**
- Meaningfully more setup time and ongoing surface area than the site's
  actual hosting needs justify — a static site does not need a
  container registry or IAM federation to serve HTML files
- More moving parts that can break (the pipeline, the domain mapping,
  the Terraform state) than a static host would ever expose
- This tradeoff is only justified *because* the audience is explicitly
  DevOps-literate (recruiters, engineers) who would recognize and value
  the infrastructure — it would be the wrong call for a portfolio in a
  field where nobody looking at it cares how it's hosted
