---
name: problem-first-prd
description: Use when writing a spec for a feature or a one-way-door decision — a Working-Backwards PRD whose whole top half is WHY before any WHAT.
---
# The problem-first PRD

Problem-first by construction: you cannot fill it without understanding the problem deeper than the
solution. If a section is hard to fill honestly, that's the signal the idea isn't ready — not a section
to skip. **Right-size it** (`right-size-the-build`): full for features / one-way doors; a one-line
*"job + acceptance"* for a bug or chore.

## 🎯 Why?
- **Problem** — what are we solving, for whom *specifically*?
  - **Opportunity** — how big? (users · impact · strategic value)
  - **Why now** — what changed; the urgency
  - **Evidence** — user / behavioral / competitor research (before external users: your own usage —
    label dogfood as dogfood)
  - **Analogies** — who solved this, how; the gap they leave
- **Alternatives considered**
  - **What we're NOT doing** (scope edges, said out loud)
  - **Cost of inaction**

## 🗺️ What are we doing?
- **Solution** — the **user journeys + scenarios** (walk the real persona through it; find where it
  breaks *before* the build does) · the **resources** it needs
- **Success criteria**
  - **Acceptance** — what must be true to call it done (concrete enough to enforce)
  - **Leading signal** — the earliest sign it's working; if you can't name it, the idea isn't concrete
  - **Rollout** · **What could go wrong** (risks, failure modes)

The "Alternatives / Cost of Inaction / NOT doing" branch is the **kill-or-justify discipline** made
structural — the RAT, written into the document.
