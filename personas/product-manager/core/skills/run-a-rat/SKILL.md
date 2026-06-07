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

## The painkiller-vs-vitamin acuity test (on Value)
Value is usually the killer, and the sharpest Value question is: **is this a painkiller or a vitamin?**
A painkiller addresses a pain acute enough that someone *changes behavior* to get relief; a vitamin is
"nice, sure" — wanted in the abstract, never prioritized. Most ideas that pass a polite "would you use
this?" are vitamins, and vitamins quietly die.
- **Ask the switching question, not the liking question.** Not "do you like it?" but **"would anyone
  actually switch to it / install it / abandon their current workaround for it?"** Real demand shows up
  as behavior change — switching, installing, paying, ripping out the spreadsheet — not as approval.
- **Find the existing pain + the current workaround.** If there's no workaround today, the pain probably
  isn't real; if the workaround is "they just live with it," the bar to switch is high — say so.
- **Be honest about your own n=1.** "I'd use it" from the builder is a vitamin signal until a real
  prospect switches. Label it.

If you can't articulate a painkiller and a believable reason someone would switch, that *is* the finding —
the riskiest assumption is that anyone wants this at all, and that's the test to run first.

## Pre-mortem (a complement, for a committed plan)
Before a big / one-way-door launch, run a **pre-mortem** (Shreyas Doshi): *"It's six months later and
this failed — why?"* Everyone writes the most likely causes; mitigate the top ones now. RAT tests the
single killer assumption cheaply *before* building; the pre-mortem surfaces the failure modes of a plan
you've already committed to ship.

## The discipline
- One assumption, the riskiest — ranking matters more than completeness.
- Bias the test toward **falsification**, not confirmation — you are hunting for the *no*.
- If you can't name a test that could fail, the assumption isn't concrete yet — that's the finding.
