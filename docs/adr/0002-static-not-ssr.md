# ADR-0002: Static output, not server-rendered

**Status:** Accepted

## Context

Astro supports both a static build (every route pre-rendered to HTML at
build time) and a server-rendered/SSR mode via an adapter (Node, etc.),
where pages render per-request. This site has no dynamic content, no
user input, and no database — every visitor sees the same HTML for a
given route.

## Decision

Use Astro's default static output. No SSR adapter. The Docker image just
packages the pre-built `dist/` folder and serves it with a small static
file server (`serve`).

## Consequences

**Gained:**
- No per-request rendering cost — Cloud Run just hands back a file that
  already existed, cheaper and faster than computing a response each time
- A far smaller, simpler container — no Node server process running the
  app, no request-handling code that could have its own bugs
- A real routing bug surfaced and got fixed *because* of this choice:
  the static server was initially misconfigured with SPA-fallback mode
  (`serve -s`), silently serving the homepage for every route. That bug
  was specific to static serving and wouldn't exist under SSR — but
  neither would the performance/cost benefit this decision is for.

**Given up / accepted cost:**
- No path to dynamic, per-request content (personalization, live data)
  without a real architecture change later
- Every language/route combination must be built as a separate physical
  file at build time — fine at this site's scale (14 pages), would not
  scale to thousands of dynamic routes
