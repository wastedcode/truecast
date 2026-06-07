---
name: map-the-trust-boundary
description: Use FIRST, before hunting any bug — write down the system's trust model (who can reach what, which callers are already trusted, what the deployment model is). It decides what is even in scope.
---
# Map the trust boundary — the deployment model decides the threat model

Before you hunt a single bug, write down **who can reach what and which callers are already trusted.** The
same code is safe in one deployment and a critical hole in another; without the trust model you'll either
miss real findings or cry wolf on out-of-scope ones.

## Write the trust model first
- **Identify the trust boundaries.** A boundary is anywhere data or control crosses from a less-trusted zone
  to a more-trusted one: the network edge, the authn check, a process/service boundary, the DB, the
  filesystem, a third-party call, the LLM↔tool seam. Everything crossing a boundary is **untrusted until
  validated**.
- **Name the actors and what each can reach.** Anonymous internet, authenticated user, another tenant, an
  internal service, an admin, a CI job, an AI agent. For each: what's their privilege, what should they be
  unable to do?

## The deployment model changes what's in scope
- **Local / single-user / loopback-bound** — the caller who can reach the port already owns the box. The
  classic web findings (authz bypass, CSRF, IDOR, session fixation) are often **out of the current model.**
  Spend energy on: input reaching a dangerous sink, data-loss / blast-radius on teardown, concurrency
  correctness, and secrets on disk.
- **Hosted / multi-tenant / publicly bound** — now there are untrusted callers. Real authn/authz, tenant
  isolation, IDOR/CSRF, and rate-limiting are all **back in scope**, and broken access control becomes the
  top risk.
- **Open-source / on-prem distributed** — the secrets, the config defaults, and the supply chain are now
  exposed to anyone; "internal-only" assumptions evaporate.

## The discipline
- **Re-run the threat model from scratch the moment the deployment model flips** (local → hosted, loopback →
  public, private → open-source, single-tenant → multi). Record the flip as a decision; until then, the
  written trust model **is** the boundary, and a finding "out of model" is a documented assumption, not a
  silent omission.
- Don't grade a finding without the trust model — "IDOR" on a single-user local tool is a note; on a
  multi-tenant SaaS it's a P0. Context is the difference between a real finding and theatre.
