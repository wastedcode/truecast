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

## Written for a named reader
A doc without a named reader is written for everyone, which is how AI-assisted docs drift into slop —
fluent, complete, and useless to any actual person. Before writing, name who this is for and what they
must be able to **decide or do** after reading: the engineer building it, the exec funding it, and
future-you six months out are different readers who get different documents (a PRD is not the exec
one-pager). Calibrate language to *that* reader — their vocabulary (`user-interviews`,
`pressure-test-personas` feed this), their level of detail, their open question. **Done = the named
reader can act without coming back to ask what you meant.**

## The hedge scrub — every hedge is an undecided decision
Generated and hurried docs share a texture: hedges where decisions should be. "Should probably," "aims
to," "we could potentially," "initially we may want to" — each is a decision hiding in prose. On the
final pass, challenge every hedge into one of exactly two forms: a **decision** (said plainly, with the
why) or an **explicit open question** (with an owner and a date, in its own section). A hedge that
survives is a bug.

The companion tells that a doc was generated rather than decided (scrub as a cluster): symmetric
alternatives lists where no option is chosen; bold-bullet walls where a paragraph should argue; a table
for something that isn't tabular; every section the same shape and length. Each is the *form* of
thinking without the decision — and this doc's whole design is that the thinking can't be faked
(`capture-decisions` holds what was chosen; the RAT branch holds why).
