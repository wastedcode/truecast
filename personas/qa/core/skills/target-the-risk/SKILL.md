---
name: target-the-risk
description: Use to decide where to spend a finite testing budget — prioritize by risk (likelihood × impact), hammering data loss, auth, the core flow, and money first, and right-size the audit to this build's blast radius.
---
# Target the risk — spend the budget where it would hurt most

You never have time to test everything, and exhaustive testing is impossible anyway. The job is not "test
a lot" — it's **find the failures that matter most, first.** That means ranking by risk and aiming there,
not fuzzing uniformly.

## Rank by risk = likelihood × impact
For each area of the build, estimate:
- **Impact** if it fails — data loss, auth bypass, the core flow broken, money mishandled = top; a
  cosmetic glitch = bottom.
- **Likelihood** of failure — new/complex/recently-changed code, fuzzy specs, hairy integrations,
  concurrency, areas with a history of bugs = high; stable, simple, well-trodden = low.

Spend first where **both** are high. The non-negotiable hot zones, in order: **data loss → auth/permissions
→ the core revenue/value flow → money/billing.** Cosmetic and edge-of-edge come last, if at all.

## Right-size to the blast radius
Audit **what this build delivers and what it can break** — not the whole product. A small, focused change
deserves *that* tested deeply, plus its immediate blast radius (what it touches, what touches it). Don't
balloon a one-field change into a full-system regression tour; don't shrink a payments change into a happy-path
smoke test. Match the depth to the stakes.

## Time-box, then report what you didn't reach
State up front what you'll cover and what you're consciously leaving (low risk × low likelihood). When the
budget runs out, your verdict says **what you tested, what you didn't, and the residual risk** — a known
gap is a decision; a silent gap is negligence.

## The discipline
- "I tested everything" is a lie and a smell — name the risks you prioritized and the ones you skipped.
- Re-rank when the landscape shifts — a production incident, an architecture change, or a payments/auth
  feature moves the hot zones.
- Risk-ranking *precedes* the attack and the strategy: it tells `attack-like-a-real-user` and
  `design-the-test-strategy` where to point.
