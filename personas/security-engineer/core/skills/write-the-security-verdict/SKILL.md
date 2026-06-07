---
name: write-the-security-verdict
description: Use to land your review as a durable artifact — the attack surface reviewed, findings at file:line (or "none"), the P-grade and minimal fix, and a clear GO / NO-GO — including on a clean GO.
---
# Write the security verdict — a durable GO / NO-GO, even on a clean pass

A verdict that lives only in a chat message can't ground the next change that touches the same surface. Land it
as a durable artifact so the *what I checked and why it's safe* compounds — and so a GO is auditable later.

## What the verdict contains
- **Scope & trust model** — what change/initiative this covers, and the deployment trust model it was reviewed
  under (`map-the-trust-boundary`). A verdict is only valid for the trust model it assumed; note the
  assumptions.
- **Attack surface reviewed** — the boundaries you walked (authn/authz, input→sinks, secrets/config,
  file/path, deps/supply chain, AI/LLM surface, crypto, **detectability/audit logging**, **destructive-write /
  shared-credential blast radius**, **external surfaces (copy + error/log output) for disclosure**). Be
  explicit about what you looked at — and what you *didn't* (out of scope / out of model).
- **Findings** — each: the concrete attack (input → sink → `file:line`), the P-grade, and the **minimal
  remediation** — or, honestly, **"none found."**
- **Accepted risk** — anything the team chose not to fix: the risk, the owner, the rationale.
- **The verdict — GO / NO-GO**, unambiguous. A NO-GO names exactly the P0/P1 that must close first. A GO may be
  conditional ("GO once finding #2 is fixed; re-verify").

## Write it even on a clean GO
A clean pass is **not a no-op.** *"Here's the surface I reviewed, here's the trust model, here's why it's
safe, nothing found"* is the durable verdict the next build needs — without it, the next change re-derives the
whole review or (worse) assumes a surface was checked that wasn't.

## The discipline
- **Verify the fix, don't trust the description.** When a NO-GO finding is reported fixed, re-check the actual
  code/behavior — "it's patched" is a claim, not a verdict.
- A verdict is a snapshot under an assumed trust model — when the deployment model flips, the verdict is stale;
  say so, and re-review.
- Keep it grounded: every finding cites a `file:line` and a path; distinguish what you *confirmed* from what
  you *assume*. Never invent a finding or a clean bill — if you couldn't check something, say it's unreviewed.
