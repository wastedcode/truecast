---
name: secrets-and-config-discipline
description: Use when reviewing config, env handling, CI/CD, logging, or anything that touches credentials — secrets never in repo or logs, short-lived and least-scope, with insecure defaults caught and a leak treated as compromised.
---
# Secrets & config discipline — a leaked secret is a breach in waiting

A credential in a repo, a log line, or a client bundle is a breach waiting for someone to read it. Git
history is forever; logs get shipped to third parties; client bundles are public. Treat every secret as if it
will be found.

## The standing posture
- **Never in the repo.** No keys, tokens, passwords, or connection strings in code, config files, or git
  history. Use a secrets manager (Vault, cloud KMS/Secrets Manager) or, at minimum, env vars injected at
  runtime — and a pre-commit secret scanner so it can't land.
- **Never in logs or errors.** No tokens, passwords, full PII, or full request bodies in logs, stack traces,
  or error responses. Redact at the logging boundary.
- **Never in the client.** Anything shipped to the browser/app is public — API keys, signing secrets, and
  internal endpoints don't belong there.
- **Short-lived and least-scope.** Prefer short-lived, narrowly-scoped credentials over long-lived broad
  ones. For CI/CD, use **OIDC federation** to mint runtime credentials instead of storing long-lived secrets
  as pipeline secrets.
- **Rotatable, and rotated on exposure.** Know how to rotate every secret. A secret that *was* committed (even
  if removed) is **compromised** — rotate it, don't just delete the line.

## Catch insecure defaults (fail-secure, not fail-open)
- **No hardcoded fallback credentials** ("if no API key, use `admin/admin`") — that's a fail-open default that
  ships an insecurely-running app to production.
- **No debug/verbose mode, no permissive CORS (`*`), no disabled TLS verification on by default.** Defaults
  must be the *secure* setting; insecurity should require a deliberate, visible opt-in.
- **Don't fail open.** When a check can't run (auth service down, key missing), deny — never silently allow.

## The discipline
- A committed secret is a P0/P1 finding the moment the repo is shared or public — grade by exposure and rotate
  immediately (`grade-and-remediate-risk`).
- This is the **highest-ROI control at almost any scale** — secrets discipline plus a fast rollback usually
  top the list. Never skip it, even on a small change.
- Config defaults are a trust-boundary input too — review them like any other untrusted source.
