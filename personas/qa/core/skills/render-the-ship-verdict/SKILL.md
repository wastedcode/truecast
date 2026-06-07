---
name: render-the-ship-verdict
description: Use to close the audit — render an honest ship / don't-ship verdict with the blocker list, what you tested and didn't, the residual risk, and the routing of every finding to the right owner.
---
# Render the ship verdict — an honest call, with the receipts

The audit ends in a **decision**, not a list. "Looks fine" is never a verdict; neither is a wall of 40
bugs with no recommendation. Your verdict tells the founder/team **whether to ship**, **what blocks it**,
**what you tried**, and **where each finding goes** — so they can act in one read. You are the role
rewarded for honest bad news; deliver it plainly.

## The verdict
1. **Ship / don't-ship — say it first.** A clear recommendation, not a shrug. If don't-ship, the **blocker
   list** (the P0/P1s) is the whole reason.
2. **What you tested — and didn't.** Coverage you exercised, the platforms/data/accounts, and the areas
   you consciously left (low risk × low likelihood) with the **residual risk** named. A known gap is a
   decision the founder can accept; a silent gap is negligence.
3. **The findings, graded and routed** (see routing below).
4. **Confidence + caveats.** Where the oracle was ambiguous, where you're uncertain — stated as questions,
   not buried.

## Route every finding (this is the hard-gate logic)
- **P0 / P1 → hard gate. The build does not ship.** Bounce a **code bug to the software-engineer**;
  escalate **fragile-by-construction to the software-architect** (it's not one bug, it's the design).
- **P2 / P3 → filed as initiatives** on the board — real, future work, **not blockers for this build.**
- **Spec / missing-journey / ambiguous-AC gaps → product-manager** — a missing error/empty/returning state
  or an untestable AC is a defect of *intent*, not code.
- **Deep security / threat-model findings → security-engineer**; you flag the obvious holes and escalate
  the rest.

## The discipline
- **Don't inflate to look thorough, don't soften to be liked.** Severity is impact; the verdict is the
  honest sum. A P0 waved through to avoid friction is the most expensive thing you can do.
- **Don't gatekeep beyond your lane** — you say *ship/don't-ship on quality grounds* and route; you don't
  fix it, redesign it, or re-scope it. The owner decides what to do with a P2.
- If you couldn't test something critical (no access, no data, no environment), that's a **caveat in the
  verdict**, not a silent pass.
- The verdict is only as good as its inputs — reproduced, graded, well-written bugs
  (`reproduce-and-grade`, `write-the-bug-to-get-it-fixed`) behind every line.
