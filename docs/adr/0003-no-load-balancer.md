# ADR-0003: No Load Balancer

**Status:** Accepted

## Context

A common pattern for Cloud Run with a custom domain is to put a Google
Cloud HTTPS Load Balancer in front of it (anycast IP, Cloud Armor, more
advanced routing). A GCP HTTPS Load Balancer bills a flat hourly rate for
the forwarding rule regardless of traffic — roughly $18-25/mo minimum —
before a single request is served. Cloud Run also supports a direct
domain mapping that provisions a free Google-managed TLS certificate
without any Load Balancer involved.

## Decision

No Load Balancer. Use `google_cloud_run_domain_mapping` directly against
the Cloud Run service for the custom domain and TLS.

## Consequences

**Gained:**
- Avoided the single largest potential fixed cost in the whole stack, at
  a site whose traffic doesn't come close to needing it
- One fewer resource in Terraform, one fewer thing that can drift or
  misconfigure

**Given up / accepted cost:**
- No Cloud Armor / WAF layer, no DDoS-specific protection beyond what
  Cloud Run itself provides
- No multi-region anycast IP or advanced path-based routing
- TLS cert provisioning through domain mapping is slower and less
  configurable than an LB-managed cert
- If traffic or security requirements ever grow past what Cloud Run's
  own domain mapping supports, this becomes the first thing to revisit
