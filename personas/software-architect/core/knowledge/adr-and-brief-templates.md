# ADR & architecture-brief templates — fill these

Ready-to-fill templates for `record-the-decision` and `write-the-architecture-brief`. Copy, fill, keep in
the repo. Right-size — a two-way door doesn't get an ADR; a small change gets a short brief.

## ADR template (Nygard)

```markdown
# NNNN: <short imperative title, e.g. "store money as integer minor units, never floats">

- Status: proposed | accepted | superseded-by-NNNN
- Date: YYYY-MM-DD
- Deciders: <who> · Consulted: <product / security / etc. if relevant>

## Context
<The forces at play. What is true that makes this a real, hard-to-change decision — not an obvious one.
The ranked drivers it serves. What we know now and what we don't yet.>

## Decision
<What we are doing, stated plainly. One or two sentences.>

## Consequences
<What gets EASIER and what gets HARDER. What this now constrains downstream. The fitness function /
test that will protect this invariant in CI, if any.>

## Alternatives rejected
<Each serious option considered and WHY NOT — scored against the ranked drivers. This section is the
reason the ADR exists: it stops the decision being silently re-litigated or unknowingly defeated later.>
```

Rules: numbered + indexed; **immutable once accepted** (supersede with a new ADR, link both ways, never
silently edit); store in repo (e.g. `docs/adr/`); **link it from the code seam** it governs (a one-line
comment). Write for one-way doors; defer to the last responsible moment.

## Architecture-brief template

```markdown
# Brief: <initiative / chunk> — for the engineer

## Goal & drivers
<What this achieves, and the top ~3 ranked characteristics it must serve (+ what we trade away).
One line of the economic case: what this costs (roughly), what it buys the business, any deliberate
debt taken and its repayment trigger.>

## Structure (C4 — pick the altitude)
<Context / Container / Component view: the pieces involved and how they communicate. One clear diagram
or description. Link the relevant ADR(s) for the why.>

## Contract / interface
<Exact signatures, types, data shapes, API surface, error behavior. Precision removes ambiguity.>

## End-to-end flow & seams
<For each new field/state: entry → transit → persistence → read-back. Name the integration seams and
where data could silently drop/transform.>

## Failure modes handled
<From risk storming: which load / partition / restart / concurrency / boundary failures are handled,
and resilient-vs-fail-fast for each.>

## Acceptance (tests the engineer must write)
- [ ] <seam test: arrange at entry → act at the real surface → assert persisted state + read-back>
- [ ] <failure-mode test per handled risk>
- [ ] <fitness function, if this introduces an invariant to protect in CI>

## File / seam pointers
<Where this plugs into THIS codebase: files to touch, seams to integrate at.>

## Illustrative code (tricky part only)
<A sketch of the non-obvious bit. Not the whole implementation — that's the engineer's craft.>

## Out of scope / consult
<What this brief deliberately excludes; who to consult (product for the what, security/infra for posture).
Surface any whole-project refactor as its OWN initiative, not folded in here.>
```

Test of a good brief: the engineer starts building confidently **without re-deriving your design**, and
understands the *why* well enough to flag it if it won't hold against reality.
