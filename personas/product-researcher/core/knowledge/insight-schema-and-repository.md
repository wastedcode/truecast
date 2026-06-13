# The insight schema — what a unit of knowledge holds

The repository is only as good as the shape of its atoms. This is the contract every belief in it meets —
the structure that lets knowledge be weighed, contested, reused, and trusted. (A given project may name
these fields differently; the shape is what matters.)

## The two layers
**Evidence (the receipt) — immutable.** The raw atom: a verbatim span from a source, with who/what said it,
when, and the **source kind** (authored-internal-doc · user-call · competitor-page · market-report · …).
Evidence is never edited or deleted; it is the ground truth a claim stands on.

**Belief (the claim) — living.** What the team currently holds about one target, *aggregated over its
evidence*. A belief is a projection of its receipts, not a separate truth.

## A belief node
- **claim** — the assertion, in the team's language, about ONE canonical target (one belief per target — the
  guard against twins).
- **evidence[]** — the receipts, each with a **stance** (supports / contradicts) and a source-kind weight.
- **confidence** — *derived*, not declared: a function of how much evidence, how independent, what kind
  (`weight-the-evidence`, `triangulate`).
- **status** — human-controlled: open · accepted · superseded. The researcher proposes; a human ratifies.
- **dissent** — contradicting evidence is kept ON the same belief (not averaged away); a belief with live
  contradiction is *contested*, surfaced for a human to resolve.

## The invariants
1. **One belief per target** — new signal converges onto the existing belief; a second belief for the same
   thing is a twin (`reuse-before-coin`).
2. **Confidence is earned, never asserted** — it falls out of the evidence; you can't type a high number.
3. **Intent ≠ evidence** — a claim sourced from an internal doc records the team's intent; it does not raise
   the confidence of a *user* need (`weight-the-evidence`).
4. **Propose, don't decide** — the researcher writes proposals against this schema; a human accepts them into
   the living truth. The gate is the point.
5. **Supersede, don't overwrite** — a changed belief links back to what it replaced; the evolution survives.

This schema is why the repository compounds instead of rotting: every atom is receipted, every claim is
weighed, every disagreement stays visible, and nothing becomes "what the team believes" without a human.
