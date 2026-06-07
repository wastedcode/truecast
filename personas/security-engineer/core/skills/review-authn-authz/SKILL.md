---
name: review-authn-authz
description: Use when reviewing anything that authenticates users, checks permissions, or exposes objects by id — broken access control is the #1 web risk; verify authz is enforced server-side at every object, deny-by-default.
---
# Review authn / authz — broken access control is the #1 web risk

Broken access control is the most prevalent serious web vulnerability (OWASP A01:2021 — found in ~94% of
tested apps). **Authentication** is *who you are*; **authorization** is *what you're allowed to do.* Most
real breaches live in authorization, and the client can never be trusted to enforce it.

## Authorization — the heart of it
- **Enforce server-side, at every object, every request.** Never trust a client-supplied role, a hidden
  field, or "the UI doesn't show the button." The server checks on every call.
- **Deny by default.** Access is denied unless a rule explicitly grants it. A new endpoint with no authz
  check is open, not safe.
- **Kill IDOR (Insecure Direct Object Reference).** For every request that takes a resource id, verify the
  authenticated subject **owns or may access that specific object** — not just that they're logged in.
  `GET /invoice/123` must check that 123 belongs to the caller. This is the single most common breach class.
- **Check the function and the data.** Function-level (can this role call this endpoint at all?) **and**
  object-level (may they touch *this* record / *this* tenant's data?). Both, every time.
- **Tenant isolation** in multi-tenant systems — scope every query by tenant; a missing `WHERE tenant_id`
  is a cross-tenant data breach.

## Authentication — the failure modes
- **Sessions/tokens**: short-lived, rotated on privilege change, invalidated on logout, `HttpOnly`+`Secure`
  cookies, CSRF protection for cookie-based auth.
- **JWT pitfalls**: reject `alg:none`; verify the signature with a **server-chosen** algorithm (never trust
  the header's `alg`); validate `iss`, `aud`, `exp`; prefer asymmetric keys; don't put secrets in the
  (decodable) payload.
- **OAuth/OIDC**: OIDC for authentication (validate the ID token's `iss`/`aud`/signature/`exp`), OAuth for
  API authorization; use PKCE; validate `state`/`redirect_uri`; prefer short-lived, sender-constrained tokens.
- **Passwords/MFA**: strong adaptive hashing (argon2/bcrypt/scrypt), rate-limit + lockout on auth endpoints,
  MFA for sensitive actions, no user enumeration in error messages.

## The discipline
- Apply this **only where the trust model puts untrusted callers in scope** (`map-the-trust-boundary`) — on a
  single-user local tool, authz bypass is often out of model. On multi-tenant SaaS it's the top priority.
- Extend the same rigor to **AI agents and service identities** — they're subjects too; an agent calling
  tools needs scoped, least-privilege authz like any user (`secure-ai-systems`).
- Every finding gets a concrete path (which call, which object, which subject) and a P-grade
  (`grade-and-remediate-risk`).
