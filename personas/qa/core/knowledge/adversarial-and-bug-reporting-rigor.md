# Adversarial & bug-reporting rigor — reference

The depth behind `attack-like-a-real-user`, `reproduce-and-grade`, `write-the-bug-to-get-it-fixed`, and
`reconstruct-the-oracle`. Read when attacking a build, grading a finding, or writing it up. This is a
toolkit to reach for — lead with risk; reconstruct your own model of "correct" and test against *that*.

## The attack catalog (real users don't behave; neither should you)
- **Input:** empty · whitespace-only · malformed · boundary / off-by-one (0, 1, max, max+1, negative) ·
  huge (paste a novel) · unicode / emoji / RTL / homoglyph · injection (SQL · HTML/XSS · shell · path
  traversal · template).
- **State & timing:** concurrent actions (two tabs, two users on one record) · double-submit · the
  **second** time (re-run / re-submit / revisit) · stale data / lost update · a race on save · ordering.
- **Flow:** network failure mid-flow (kill it between request and response) · refresh / back-button /
  deep-link into a mid-flow URL · partial completion · timeout & retry · close-and-return.
- **Auth & permissions:** IDOR (change the id to reach another's object) · missing authorization on an
  endpoint · acting after session expiry · privilege you shouldn't have.
- **Resource & environment:** quota/limit exceeded · disk full · slow device / slow network · the
  platform/locale/timezone the author didn't use.
- **Journeys (static, before you run):** the empty state · the error state · the returning user · "I
  changed my mind" / cancel · **the journey nobody scoped** (a missing journey is a defect → product).

## Risk-based: where to spend the budget first
risk = likelihood × impact. **Impact** top = data loss · auth bypass · core flow broken · money.
**Likelihood** high = new/complex/recently-changed code, fuzzy specs, hairy integrations, concurrency,
bug history. Hammer high×high first; cosmetic last. Exhaustive testing is impossible — prioritization
*is* the job. Re-rank after an incident, an architecture change, or an auth/payments feature.

## The oracle problem — how you *know* it's wrong (Bach & Bolton)
You can only call it a bug against an **oracle** (a basis for the expectation). Triangulate several;
note conflicts. **HICCUPPS** consistency heuristics — is it consistent with:
**H**istory · **I**mage · **C**omparable products · **C**laims (docs/marketing) · **U**ser expectations ·
**P**roduct (internal consistency) · **P**urpose · **S**tandards/statutes. A violation of any = candidate
bug. When the oracle is ambiguous, file a **question**, not a verdict — a confident false-positive burns a
cycle and the founder's trust (worse than an honest question).

## Severity — grade honestly; don't inflate, don't bury a P0
- **P0** — data loss / auth bypass / core flow broken / money mishandled. Ship-blocker.
- **P1** — major function broken, **no workaround.** Ship-blocker.
- **P2** — minor, **or has a workaround.** Not a blocker for this build.
- **P3** — cosmetic.

Severity = **user/business impact**, not fix-difficulty or annoyance. P0/P1 = **hard gate** → engineer
(code) or escalate architect (fragile-by-construction). P2/P3 → **initiatives** on the board.

## The bug report — written to get it *fixed* (Kaner, *Bug Advocacy*)
A bug report is a **persuasive document**, not a neutral log; the goal is high-quality information that
gets stakeholders to fix it. Fields: **title (specific/searchable) · severity · minimal deterministic
repro · expected (+ the oracle it violates) · actual (+ evidence: error/screenshot/log/ids) · impact ·
env**. Advocacy moves: **sell the impact** (show the worst credible case, does it generalize/lose data?),
**lower the fix cost** (minimal repro, exact error), **stay neutral/factual** (credibility is currency),
**state uncertainty**. *"The best tester isn't the one who finds the most bugs — it's the one who gets the
most bugs fixed."*

## Reproduce — yourself, exactly
Trigger on demand → make intermittent **deterministic** (find the timing/ordering/concurrency/data/platform
variable) → **shrink to minimal repro** → never theorize from reading code (a code-read suspicion is a
*question* to the engineer, labeled as such). One bug per report; don't bundle a P0 with three P3s.

## Authorities
- **Cem Kaner** — *Testing Computer Software*; *Lessons Learned in Software Testing* (w/ Bach, Pettichord);
  *Bug Advocacy* (BBST). Bug reports as persuasion; context-driven testing.
- **James Bach & Michael Bolton** — Rapid Software Testing; **testing vs. checking**; HICCUPPS oracles.
- **Context-Driven Testing** — "the value of any practice depends on its context; there are no best
  practices, only good practices in context." Match the technique to the situation.
