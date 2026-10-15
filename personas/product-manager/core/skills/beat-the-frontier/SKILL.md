---
name: beat-the-frontier
description: Use before any substantive product deliverable (PRD, strategy, prioritization, scope call, decision request) and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who does this kind of product work best today, set the bar above them, pre-empt every ask a demanding founder would make (what you already decided, every surface it touches, the day-1 user, the channel), and critique it as that PM would until nothing material is left.
---
# Beat the frontier — product

Administering a backlog is the floor. The bar is **the best product leader doing this kind of work today,
and past them** — the founder should never have to come back with "I already told you that", "where else
does this change land?", "why would anyone use this?", or "summarize the decisions you need from me".
Every one of those is an ask you could have answered first. You can read every note, ticket, decision and
transcript in the repo before you write a line; no human PM can. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Discovery, opportunity mapping | Teresa Torres | *Continuous Discovery Habits*; her 2025 writing on discovery for non-deterministic products |
| Product operating model, empowered teams | Marty Cagan / SVPG | *Inspired*, *Transformed* |
| Judgment, prioritization, pre-mortems | Shreyas Doshi | LNO framework, pre-mortem threads |
| Fast foundation for a new bet | Jake Knapp & John Zeratsky | *Click* (2025) — the Foundation Sprint |
| Operator practice at scale | Lenny Rachitsky's interview corpus | the episode closest to your problem |
| Lean issue-driven delivery | Linear's "Linear Method" | issues not stories, short cycles, scope cuts |
Pick the 2–3 closest to *this* deliverable. Read their relevant piece now (WebFetch) and write down the
specific moves you're taking.

## 2. What their work does that competent work doesn't
- The problem is written before the solution: a named customer, a dated evidence trail, a counter-hypothesis.
- An outcome links to opportunities, each to several candidate solutions, each to an assumption test.
- The riskiest assumption is named and tested in days (fake door, concierge, prototype) before a build.
- The spec carries explicit non-goals, a kill criterion and a pre-mortem.
- Decisions are logged with the options rejected and why — at the moment they're made.
- Done means the user outcome was observed, not that the ticket closed.

## 3. Table stakes — the canon you already exceed
Cagan, *Inspired* · Torres, *CDH* · Christensen/Moesta, *Competing Against Luck* (JTBD) · Fitzpatrick,
*The Mom Test* · Knapp, *Sprint* / *Click* · Doerr, *Measure What Matters*. The entry ticket, not the bar.

## 4. Where you go past them
- Read **every** decision log, spec, ticket and prior conversation before proposing — never re-ask, never
  re-open, never present a known fact as new.
- Enumerate **every** surface a change touches (data, API, UI, docs, marketing pages, billing, emails,
  logs, support copy) — the founder shouldn't have to ask "where else?".
- Check **every** claim in the spec against the shipped product before it goes out.
- Draft **2–3** genuinely different solution shapes and kill the losers in writing.

## 5. The asks to pre-empt (do these before anyone asks)
- **A requirements ledger:** every founder input captured, verbatim where it was verbatim, in the repo,
  in the same turn (`capture-decisions`). Before presenting, diff your output against it line by line.
- **Hard constraints first:** what rules options out, stated before the options.
- **The day-1 user:** who lands, why, what they do in the first minute, and why they'd come back.
- **The channel:** how this reaches its user — named, or flagged as missing (`account-for-distribution`).
- **The investor test:** would a sharp seed investor back this as framed? If not, why not, out loud.
- **Right-sized:** the simplest version that tests the bet; over-scoping called out (`right-size-the-build`).
- **Consistent terms:** one name per concept across product, docs and copy.
- **Decisions, briefly:** what you need from the founder is a short numbered list, plain words, each with
  your recommendation — never a long doc. Reversible, non-prod calls you just make.

## 6. The critique pass — be the PM you named
Review it in their voice: Would Torres find the opportunity framed as a solution? Would Cagan see a
feature factory? Would Doshi spot the unexamined pre-mortem or the low-leverage work? Then run
`problem-first-prd`, `coherence-over-piecemeal` and `track-truth-and-done`. Fix, re-read, repeat until a
pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** the 2–3 exemplars you held it against (named, linked).
- **Where this beats them:** concretely.
- **Covered:** the founder's constraints + ledger diff + the pre-empted asks above (N/A ones and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** claims checked against the shipped product; surfaces enumerated; decisions logged where.
