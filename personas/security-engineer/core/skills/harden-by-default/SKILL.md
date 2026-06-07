---
name: harden-by-default
description: Use when recommending controls or evaluating whether a system is secure by construction — apply the classic security principles (least privilege, fail-safe defaults, complete mediation, economy of mechanism, no security-through-obscurity).
---
# Harden by default — the principles that still bite

The classic Saltzer & Schroeder principles are decades old and still explain most modern breaches. Apply them
as the lens for "is this secure by construction?" — and as the cheapest controls to build in early
(`secure-design-review`).

## The principles
- **Least privilege.** Every user, service, token, and component gets the **minimum** access to do its job, and
  no more. The blast radius of a compromise is whatever the compromised thing could reach — shrink it. Applies
  to DB grants, IAM roles, API scopes, file permissions, and AI-agent tools alike.
- **Fail-safe (default-deny) defaults.** Access is denied unless explicitly granted; when a control can't run,
  it **denies**, it doesn't fail open. The secure setting is the *default*; insecurity requires a deliberate,
  visible opt-in.
- **Complete mediation.** Check authorization on **every** access to **every** object — not once at login and
  then trusted, not at the UI and skipped at the API. (This is why broken access control is #1 —
  `review-authn-authz`.)
- **Economy of mechanism — simplicity is security.** The simpler the security-relevant code, the fewer places
  for a flaw to hide. Complex auth logic, sprawling permission matrices, and clever schemes are where bugs
  live. Prefer the boring, auditable mechanism.
- **No security-through-obscurity.** A secret URL, an obfuscated payload, or a hidden endpoint is not a control
  — assume the attacker has your source and your design. Security must hold when the mechanism is known; the
  *key* is the secret, not the *method*.
- **Defense in depth.** No single control is trusted to be perfect (especially where no perfect control exists,
  like prompt injection — `secure-ai-systems`). Layer independent controls so one failure isn't a breach.
- **Secure by design / secure by default.** The out-of-box configuration is the safe one; users shouldn't have
  to harden it to be safe.
- **Separation of duties** for high-impact actions — no single actor (or single compromised credential) can
  both initiate and approve something irreversible.

## Blast radius of a destructive write — the broad-scope-token trap
Least privilege isn't only about read access. The sharpest, most-missed version: a token that is **legitimately
scoped** for the task can still let a routine actor **overwrite or delete EXISTING resources that belong to
someone else.** A worker given "write to the workers namespace" can trample a *co-tenant's* already-running
worker; an agent given "manage deployments" can roll back a deployment it didn't create; a CI token scoped to
"the bucket" can clobber another team's objects in it. The scope is broad enough to be plausible and broad
enough to be catastrophic — the privilege is fine for *creating its own*, fatal for *destroying others'*.

Ask, on every credential that can do a **destructive or overwriting write** (delete, overwrite, rename,
force-push, drop, truncate, deploy-replace, rotate, cancel):
- **Whose existing resources can this token reach?** Enumerate the *current* co-tenant / co-actor resources in
  the token's scope — not just what this actor will create. If a routine actor can overwrite/delete a
  *different* actor's existing resource, the blast radius is the trap, even if the scope reads "reasonable."
- **Per-resource scoping, not namespace-wide.** Scope writes to resources this actor **owns** (owner/created-by
  predicate, per-resource ACL, name-prefix/namespace-per-actor), so the token physically cannot touch a
  neighbour's. "Write to the namespace" is too coarse when the namespace is shared.
- **Namespace / name-collision guards.** If actors share a flat namespace, a collision lets one silently
  overwrite another — require unique, actor-scoped names (or claim/lock-on-create) so a routine create can't
  clobber an existing resource by name reuse.
- **Human gate on destructive writes.** Irreversible or cross-actor-destructive actions (mass delete, replace,
  force-push, prod rollback affecting others) get a **human-in-the-loop confirmation or an explicit
  separation-of-duties approval** (below) — never a silent, automatic, unscoped path. This is also why an
  **AI agent** must not hold a broad destructive-write token (`secure-ai-systems`, excessive agency).

This is a **flaw**, not a leaf bug, when the *design* hands out the broad token — escalate to
**software-architect** with the per-resource-scoping alternative; grade the concrete trample path
(`grade-and-remediate-risk`). The trust model decides severity: trivial on a single-user local tool, a **P0**
the moment the resources are shared across tenants/actors (`map-the-trust-boundary`).

## The discipline
- These are most valuable **applied at design time** — building them in is nearly free; bolting them on later is
  expensive (`secure-design-review`).
- Use them to distinguish a *bug* (a missed escape) from a *flaw* (a design that violates a principle and can't
  be patched safe) — flaws go to **software-architect**.
- A principle violation is a real finding only when it enables a concrete attack — grade it like any other
  (`grade-and-remediate-risk`); don't cite "least privilege" as theatre with no exploit behind it.
