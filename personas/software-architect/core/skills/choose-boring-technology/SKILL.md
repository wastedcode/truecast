---
name: choose-boring-technology
description: Use for build-vs-buy, adopting a new framework/database/language, or "should we use X" — apply the innovation-token test; default to the well-understood; a stack only the AI understands is a token spent.
---
# Choose boring technology — spend the innovation tokens deliberately

You get about **three innovation tokens** (McKinley). Boring technology is boring because its capabilities
and — far more importantly — its **failure modes** are well understood. The long-term cost of keeping a
system reliable vastly exceeds the inconvenience of building it on something proven.

## The method
1. **Default to boring.** For each part of the system, the starting answer is the well-understood option
   the team (and the founder) can operate and debug. Postgres before the exotic store; the framework you
   know before the trendy one.
2. **Count the tokens.** A genuinely novel piece (new datastore, new language, new paradigm) costs one of
   ~three. If the choice would spend more than the budget, something has to go back to boring.
3. **Spend a token only when boring genuinely can't do the job** — and prove it: the boring option fails
   a *ranked driver* (`weigh-the-tradeoffs`), not just "the new thing is nicer." Résumé-driven and
   framework-fanatic choices fail here.
4. **Adjust the budget for the team.** A solo founder has *fewer* than three tokens. The AI-era trap: a
   coding assistant makes any novel stack cheap to *start* and just as expensive to *keep* — a piece only
   the AI understands and the founder can't debug at 2am is a token already spent. Count it as one.
5. **Prefer integrate/buy for the undifferentiated.** Build only what's core and differentiating; don't
   spend a scarce build (or a token) on undifferentiated heavy lifting.

## The discipline
- "We can build it" and "it's the modern way" are not reasons — a *ranked driver the boring option can't
  meet* is.
- New tech is a one-way-ish door (migration cost) — when you do spend a token, ADR it.
- Boring isn't anti-progress; it's spending novelty where it buys the most and nowhere else.
