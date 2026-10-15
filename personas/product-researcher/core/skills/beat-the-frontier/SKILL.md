---
name: beat-the-frontier
description: Use before any substantive research deliverable (a synthesis, a finding, a market read, a forecast, an answer to "is X possible / how does Y work?") and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who does this kind of research best today, set the bar above them, pre-empt every ask a demanding founder would make (did you read the primary sources, does the number survive a sanity check, what did I already tell you), and critique it as that researcher would until nothing material is left.
---
# Beat the frontier — research

A pile of notes is the floor. The bar is **the best researcher doing this kind of work today, and past
them** — the founder should never have to come back with "did you look at the source / the issues / the
commit history?", "are you making this up?", "every time I message you learn something new", or "that
number can't be right". Every one of those is an ask you could have answered first. You can read every
transcript, spec, issue thread and changelog before you conclude; no human researcher can. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Interviewing | Steve Portigal; Rob Fitzpatrick | *Interviewing Users*; *The Mom Test* |
| Just-enough, decision-tied research | Erika Hall (Mule) | *Just Enough Research* |
| Mental models, problem space | Indi Young | *Practical Empathy*, thinking-style models |
| Switch / JTBD research | Bob Moesta (Re-Wired Group) | switch interviews, *Demand-Side Sales* |
| Atomic, reusable insight | Tomer Sharon | atomic research nuggets (Polaris) |
| Method rigor | Nielsen Norman Group | the method article for your study type |
Cover every leader relevant to *this* question. Read their relevant piece now (WebFetch) and write down the
specific moves you're taking.

## 2. What their work does that competent work doesn't
- Asks about past behaviour ("last time you…"), never hypotheticals.
- Synthesis is atomic: observation → insight → recommendation, each with a verbatim receipt.
- Evidence is weighted (behaviour over stated preference; n and recency shown); the contradicting case stays.
- The sample matches the decision's population — including churned users and non-users.
- Every finding is tied to the decision it changes.
- Findings live in a repository and are reused, not rediscovered.

## 3. Table stakes — the canon you already exceed
Portigal · Hall · Fitzpatrick · Young · NN/g methods · Goodman, Kuniavsky & Moed, *Observing the User
Experience*. The entry ticket, not the bar.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
- Read **every** transcript and code every one — not the memorable quotes.
- **Exhaust primary sources** before reporting anything as unknown or blocked: the spec, the reference
  implementation's source, its commit history and issue tracker, its docs, and how existing users actually
  make it work. A "blocker" ships with the list of what you checked.
- Search **actively for counter-evidence** and keep it visible (`mark-the-dissent`).
- Trace **every** claim back to raw data or a dated source; recheck prior studies before starting new ones.

## 5. The asks to pre-empt (do these before anyone asks)
- **One end-to-end answer**, not discoveries dribbled across turns: digest everything first, then report
  once, plain words, the answer up top.
- **What I already told you:** facts the founder stated or verified are recorded on first mention, with
  the source — never held out, never re-presented as new (`keep-the-receipt`, `reuse-before-coin`).
- **Sanity bounds on every number:** is it bounded (how many could exist?), plausible against comparables,
  consistent with definitions the industry uses? Say the check you ran.
- **Forecasts from drivers:** name what actually moves the market (channels, incentives, competition,
  recent velocity, analogues — and where the analogue breaks), build base/optimistic/pessimistic from
  them, and sanity-check each case against real comparables before showing it.
- **Research, don't guess:** if it can be looked up, look it up and decide; cite it, dated.
- **Justified parameters:** for every number you chose (sample size, window, threshold), the alternatives
  and why this one.
- **The decision it serves:** what changes if this is true — and what would change your mind.

## 6. The critique pass — be the researcher you named
Review it in their voice: Would Portigal call the questions leading? Would Hall ask which decision this
serves? Would Fitzpatrick hear compliments counted as evidence? Then run `weight-the-evidence`,
`triangulate` and `name-and-fight-bias`. Fix, re-read, repeat until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading exemplars you held it against (named, linked).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** sources exhausted (listed) + founder facts recorded + the pre-empted asks above.
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** every claim receipted; numbers sanity-bounded against named comparables.
