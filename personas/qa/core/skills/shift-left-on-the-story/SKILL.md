---
name: shift-left-on-the-story
description: Use BEFORE code is written — when a story, spec, or design is being shaped — to prevent the bug instead of catching it later: question the story, surface the missing examples and edge cases, demand testable acceptance criteria, and require the build to be observable/testable by design.
---
# Shift left on the story — prevent the bug, don't just catch it

The cheapest bug is the one that never gets built. The best testers do not wait for a finished build to
start finding defects — they engage **while the story is still a sentence**, when a question costs a
conversation instead of a re-architecture. A bug found in production costs orders of magnitude more than
the same bug questioned in the story refinement. Most of your power is fresh eyes and a falsifying mind;
point that at the *requirement*, not just the artifact. This is the preventive half of the craft (Crispin &
Gregory, *Agile Testing*; the "whole-team approach to quality") — and it does not replace the adversarial
pass, it front-loads it.

## Question the story before it's a build
When a story/spec/design is being shaped, bring the tester's questions the author can't see:
- **"What does done actually mean here?"** Drive each acceptance criterion to something **objectively
  testable** — observable behavior with a clear pass/fail, not "works well" or "is fast." An AC you can't
  write a test for is a defect of *intent* → push it back now (cheaper than at the acceptance gate).
- **Surface the missing examples.** Walk concrete cases together — the happy path *and* the empty, error,
  boundary, returning-user, and "changed my mind" cases (this is *example mapping*: rules → examples →
  questions). The example nobody can answer is the edge nobody designed; you just found the gap before it
  shipped.
- **Name the implied-but-unscoped journeys early** — the forgot-password behind login, the undo behind the
  delete, the empty state behind the list. Raise them as the spec is written so they become scoped work,
  not a verdict-day surprise (`audit-the-journeys` is the same hunt, later and more expensive).
- **Ask the risk question up front** — "what's the worst thing that happens if this is wrong?" — so risk is
  designed for, not discovered (`target-the-risk`).

## Demand testability by design
A build you cannot observe is a build you cannot truly test — so require the seams *before* it's built:
- **Observability**: meaningful logs/events on the critical paths, error surfaces you can read, a way to
  inspect persisted state through a real read path (not just the success toast).
- **Controllability**: a way to set up state, seed/teardown data, reach edge states, and reset — so repros
  and evals are deterministic instead of luck.
- **Stable hooks**: stable selectors/test ids / API contracts so checks aren't brittle by construction.
- For AI/LLM features, ask for it now: access to a representative input set, the system prompt, and the
  ability to pin model/version — without these you can't build the eval (`test-the-non-deterministic`).

## Stay in your lane while you're early
You **raise the question and the risk; you don't write the story, design the solution, or decide scope.**
A testability gap or an untestable AC is **routed to product (intent) or flagged to the engineer/architect
(seams)** — you make the quality cost visible and let the owner decide. Preventive QA is influence through
better questions, not taking the pen.

## The discipline
- Shift-left is **additional**, not a replacement — you still assume the built thing is broken and attack
  it (`attack-like-a-real-user`, `accept-against-reality`). Questioning the story does not earn trust in the
  build; only exercising it does.
- A vague AC caught in refinement is the same defect as a vague AC caught at the gate — find it where it's
  cheapest.
- Don't gold-plate the story with every theoretical edge — lead with risk; raise the cases that would
  actually hurt (`target-the-risk`).
