---
name: beat-the-frontier
description: Use before any test plan or ship verdict and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who tests this kind of system best today, set the bar above them, pre-empt every ask a demanding reviewer would make (proof in prod, real rows vs an external reference, plausibility bounds, every control clicked, break attempts made permanent), and critique your own verdict as that tester would until nothing material is left.
---
# Beat the frontier — QA

A green suite is the floor. The bar is **the best tester working on this kind of system today, and past
them** — the user should never be the one who finds the bug, or have to ask "did you verify in prod?",
"did you actually look at the data?", "what about the cases I didn't list?". Every one of those is an ask
you could have answered first. You can enumerate inputs, interleavings and states no human team can afford
to. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Consistency under faults | Kyle Kingsbury (Jepsen) | a recent Jepsen analysis |
| Deterministic simulation testing | Antithesis; FoundationDB team; TigerBeetle VOPR | DST write-ups |
| Exploratory testing + oracles | James Bach & Michael Bolton (RST); Elisabeth Hendrickson | *Explore It!*, RST notes |
| Property-based testing | David MacIver (Hypothesis) | Hypothesis docs/articles |
Cover every leader relevant to *this* system. Read the relevant piece and write down the specific technique
you're applying.

## 2. What their work does that competent work doesn't
- Failures are reproducible from a seed or exact steps.
- Faults injected (crash, kill, partition, clock skew, disk full) at every lifecycle transition.
- The oracle is explicit — invariants and properties, not hand-picked expected outputs.
- Effort allocated by risk, not spread by coverage percentage.
- Flaky tests root-caused, never retried green.

## 3. Table stakes — the canon you already exceed
Kaner, Bach & Pettichord, *Lessons Learned in Software Testing* · Hendrickson, *Explore It!* · Crispin &
Gregory, *Agile Testing* · Jepsen analyses · the practical test pyramid. Meeting these is the entry ticket,
not the bar.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
- Enumerate **every** state transition and the input classes for each, not a sample.
- Check **every** number the user will see against its source.
- Click **every** control on **every** surface the change touches, at mobile and desktop widths.
- Re-verify the environment **every** time observed ≠ expected (live build? stale cache? old process?).

## 5. The asks to pre-empt (do these before anyone asks)
- **Prove it in prod:** after deploy, exercise the live API/pages with real parameters and show the
  output; "deployed" is not "verified".
- **Look at the real data:** spot-check actual rows and reconcile totals against an external or
  independent reference; the same figure shown in two places must agree.
- **Plausibility bounds:** is the count even possible? does the growth make sense? does the definition
  match the domain's? Flag anything implausible before anyone else sees it.
- **Every control, every state:** click everything; walk empty/loading/error/signed-in/out/first-visit/
  cached; check speed.
- **Domain-messy inputs:** the real world's edge cases (multiple of a thing, cancellations, duplicates,
  transfers, decimals, timezones), not just tidy fixtures.
- **The cases nobody listed:** systematic break attempts — known attack and failure classes for this
  domain — and fold every break attempt into the permanent suite (`guard-against-regression`).
- **The user's real accounts/paths** where safe — test what they will actually do first.
- **Verdict, not narration:** ship/don't-ship, the evidence, and the one-line repro for each bug.

## 6. The critique pass — be the tester you named
Review your plan and verdict in their voice: What fault would Kingsbury inject that you didn't? What
interleaving would a deterministic simulator find? What would Bach call checking-not-testing in your plan?
Then run `model-the-state-machine`, `attack-like-a-real-user` and `render-the-ship-verdict`. Fix gaps,
repeat until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading techniques/exemplars you held it against (named).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** the user's constraints + the pre-empted asks above (any judged N/A, and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** live checks, data reconciliations, states/controls walked — with the evidence.
