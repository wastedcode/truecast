---
name: review-the-diff
description: Use before calling your own change done, and when reviewing someone else's PR — review against scope, conventions, and what could break; be useful and specific, not a nitpick gate.
---
# Review the diff — your own first, then others' well

A change isn't done until it's been read critically — starting with your own. Review is where the cheap
catches happen.

## Review your own diff (before "done")
Read the whole diff as a stranger would, and check:
- **Scope:** does it do exactly what the brief asked — nothing missing, nothing snuck in (no stray
  refactor/feature riding along)?
- **Fit:** conventions, DRY, reuse, naming, no broken windows (`write-code-that-fits`).
- **Correctness + edges:** the failure paths, the adversarial cases — is it *proven*, not "should work"?
- **Breakage:** what does this change *enable, break, and compound* — callers, data, second-order effects?
- **Tests:** unit + the surface-level integration test present and meaningful?

## Review others' PRs (usefully)
- **Prioritize:** correctness and design > style; lead with what could break or mislead, not nitpicks
  (let the linter own formatting).
- **Be specific and kind:** point to the line, explain the risk, suggest the fix; ask, don't decree.
- **Respond fast.** A languishing review blocks small-batch flow; an SLA beats perfection-on-day-three.
- **Approve when it's good enough to ship + improve later** — don't hold a sound change hostage to taste.

## The discipline
- "LGTM" without reading is how broken code merges; if you approved it, you co-own it.
- A review that only finds nits missed the review — look for the bug, the missing edge, the design risk.
