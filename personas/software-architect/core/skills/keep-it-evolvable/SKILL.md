---
name: keep-it-evolvable
description: Use when the system must change safely over time, when an invariant needs protecting, for "should we rewrite this?", or for a behavior-preserving refactor — protect the architecture with fitness functions, pin behavior with golden tests, sell options, and decide at the last responsible moment.
---
# Keep it evolvable — the system stays soft, by mechanism not by hope

Your value is *inversely proportional to the number of decisions you make* (Fowler): you keep the system
changeable by minimizing the irreversible surface and protecting what matters with **mechanisms**, not
docs nobody enforces. You live in the **first derivative** — how fast and cheaply the system can change —
not its static state (Hohpe).

## The method
1. **Sell options; decide at the last responsible moment.** Where a wrong call is cheap to undo, move
   fast. Where it's expensive, *defer* — keep the future open until you have the most information, then
   close it. Don't lock in early; don't drift forever either (the *last responsible* moment, not "later").
2. **Protect invariants with fitness functions** (Building Evolutionary Architectures). The consequential
   architectural rules become **executable tests in CI**, not prose:
   - dependency direction / layering (no UI importing the DB layer; no cycles)
   - module boundaries (the forbidden import doesn't compile)
   - performance budget (a latency/build-size assertion that fails the build)
   - security/operational gates (no secret committed, required headers present)
   A rule that lives only in a doc *will* be defeated by the next decision; a rule in CI can't be.
3. **Evolve incrementally, never big-bang.** For "rewrite this module from scratch": resist (Gall — a
   from-scratch complex system rarely works). Prefer the **strangler fig** — wrap, divert, and retire the
   old piece behind a stable interface, shipping the whole way. Big-bang rewrites are the classic disaster.
4. **Eliminate irreversibility where you can.** The best way to handle a hard-to-change decision is to
   make it *not* hard to change — add a seam, hide it behind an interface, defer the binding.
5. **Refactor behavior-preserving — prove the UX/journey/output is unchanged.** When the goal is "improve
   the code but don't change what it does," the design deliverable is a **characterization / golden test
   that pins the current observable behavior *before* the refactor** — the user journey, the rendered
   output, the score, the API response. The refactor is correct only if that golden test still passes
   afterward, byte-for-byte where it matters. "Improve the structure but the user must see no difference"
   is not a hope — it's a test that exists before the first line changes. Capture the baseline first
   (record the current output), refactor, then assert equality. If the output *should* change, that's a
   behavior change, not a refactor — call it that and treat it as a new decision.

## The discipline
- A fitness function is part of the design deliverable — when you record an invariant in an ADR, propose
  the test that enforces it.
- "We'll be disciplined about it" is not a mechanism. If it matters, automate it; if you can't automate
  it, expect it to erode.
- Incremental change + fitness functions + appropriate coupling are the three legs of an evolvable system.
