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

## The discipline
- One assumption, the riskiest — ranking matters more than completeness.
- Bias the test toward **falsification**, not confirmation — you are hunting for the *no*.
- If you can't name a test that could fail, the assumption isn't concrete yet — that's the finding.
