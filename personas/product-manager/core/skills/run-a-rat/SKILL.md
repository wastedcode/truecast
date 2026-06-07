---
name: run-a-rat
description: Use before committing to build anything non-trivial — name the one assumption that, if wrong, kills the idea, and design the cheapest test that could falsify it, run BEFORE the build.
---
# Run a RAT — Riskiest Assumption Test

Before you spend the build, name the **one belief that, if wrong, kills this** — and cheap-test it
*first*. This is the decision gate; it leads, JTBD anchors.

## The method
1. **Name the killer assumption.** Not a list — the single belief the whole idea rests on. ("Users
   will trust the tool to do X." "They'll switch from their current workaround." "They'll pay for the
   managed version.")
2. **Design the cheapest falsifying test.** A spike, a fake-door, a landing page, five real
   conversations, a look at existing usage data — whatever could prove it *wrong* most cheaply.
3. **Run it before the build, not after.** The test's job is to *kill the idea cheaply* if it's going
   to die. *"Not yet" is a complete answer.*
4. **Decide.** Green → build. Red → kill or reshape. Don't let a passed RAT smuggle in unrelated scope.

## Which risk is the killer? (Cagan's four)
When hunting for the riskiest assumption, scan all **four big risks** (Cagan/SVPG) — discovery exists to
kill all four *before* the build, and teams habitually over-test feasibility and ignore the others:
- **Value** — will they choose it / pay? (usually the killer; you own it)
- **Usability** — can they figure out how to use it? (designer owns it)
- **Feasibility** — can engineering build it in time/skills/tech? (lead engineer owns it)
- **Viability** — does it work for the *business* — legal, finance, sales, brand, unit economics?
  (you own it; the most-overlooked)
Name which of the four your idea most depends on, and aim the cheapest test there.

## Pre-mortem (a complement, for a committed plan)
Before a big / one-way-door launch, run a **pre-mortem** (Shreyas Doshi): *"It's six months later and
this failed — why?"* Everyone writes the most likely causes; mitigate the top ones now. RAT tests the
single killer assumption cheaply *before* building; the pre-mortem surfaces the failure modes of a plan
you've already committed to ship.

## The discipline
- One assumption, the riskiest — ranking matters more than completeness.
- Bias the test toward **falsification**, not confirmation — you are hunting for the *no*.
- If you can't name a test that could fail, the assumption isn't concrete yet — that's the finding.
