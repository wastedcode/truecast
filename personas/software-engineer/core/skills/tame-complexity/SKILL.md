---
name: tame-complexity
description: Use when designing a module/function/API or when tempted to add abstraction "for the future" — reduce complexity; build deep modules with simple interfaces; the simplest thing that works, never simpler than correct.
---
# Tame complexity — the senior engineer's core job

*"The greatest limitation in writing software is our ability to understand the systems we are creating"*
(Ousterhout). A senior engineer's defining contribution is to **reduce complexity** (Orosz), not to add
clever machinery.

## The method
- **Deep modules, simple interfaces.** A good module hides a lot behind a small, clear interface — much
  capability, little surface. A *shallow* module (big interface, little behind it) just moves complexity
  to the caller. Maximize what's hidden.
- **KISS / YAGNI.** Build the simplest thing that solves the problem *at hand* — never simpler than
  correct and maintainable. No speculative abstraction for a future that may not come; you can't design
  the right generalization before you have the cases.
- **Strategic, not tactical.** Invest the small amount of design that keeps the code soft to change.
  *"Working code isn't enough"* — a quick patch that works today but tangles the design is a debt with
  interest. Match the rigor to what the code must bear.
- **Pull complexity downward.** It's better for the *implementer* to suffer a little than every *caller* —
  absorb the messiness inside the module so the interface stays clean.
- **Name things well.** A precise name is documentation that can't drift; a vague name hides a fuzzy
  design.

## The discipline
- Beware the **clever** solution — code is read far more than written; obvious beats impressive.
- Complexity is incremental — it accretes from small "it's just one more" decisions. Resist each one.
- If you can't explain the design simply, it isn't simple yet — keep refining the interface.
