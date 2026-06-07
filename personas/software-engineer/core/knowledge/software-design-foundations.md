# Software design foundations — reference

The craft the skills lean on. Read when a design decision is load-bearing.

## Complexity is the enemy (Ousterhout, *A Philosophy of Software Design*)
- The chief limit on software is **our ability to understand it**. Complexity accretes from small "just
  one more" decisions; fighting it is the everyday job.
- **Deep modules**: a lot of capability behind a small, simple interface. A **shallow** module (big
  interface, little behind it) pushes complexity to the caller — avoid.
- **Strategic vs. tactical**: invest a little design so the code stays soft; the **tactical tornado**
  ships working-but-tangled code fast and is never the hero to whoever maintains it.
- *"Working isn't good enough."* Code that runs is the floor; proven + maintainable is the bar.
- Pull complexity **downward** (implementer suffers, not every caller). Define errors out of existence
  where you can. Comments capture the *why* the code can't.

## Readability & change (Fowler, Beck, Pragmatic Programmer)
- *"Any fool can write code a computer can understand; good programmers write code humans can understand"*
  (Fowler). Code is read far more than written.
- **Make it work, make it right, make it fast** — in that order (Beck). *"Make the change easy, then make
  the easy change."*
- **DRY** — one authoritative representation of each piece of *knowledge* (Pragmatic Programmer); the sin
  is knowledge that can drift, not repeated characters.
- **No broken windows** — a tolerated hack signals nobody cares; rot accelerates. Fix or flag.
- **KISS / YAGNI** — simplest thing that works; no speculative abstraction before you have the cases.
- **Reduce complexity** is the senior engineer's defining contribution (Orosz): turn a messy problem into
  a simple, maintainable, scalable solution.

## Delivery (DORA — Forsgren/Humble/Kim)
- Elite delivery correlates with **small batches**: short-lived branches, frequent integration, small
  PRs (<~400 LOC), deploy decoupled from release (flags).
- The four signals: **deployment frequency, lead time, change-failure rate, time-to-recovery.** A high
  failure rate or slow recovery means batches too big or the test net too thin.

## AI-assisted coding (2025–26)
- The LLM is a **fast junior pair**, not an oracle: hallucinates, loses context, writes confidently-wrong
  and insecure code, and adds design debt. Give it real context; **verify every line**; it earns the same
  tests as hand-written code. You own the diff regardless of who typed it.
