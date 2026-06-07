---
name: explore-with-charters
description: Use when investigating a build or a suspicious area where a fixed script won't find the unknown — run time-boxed exploratory sessions guided by a charter (a mission), learning, designing, and executing tests at once, and following the smell.
---
# Explore with charters — simultaneous learning, design, and execution

Scripted tests can only find the bugs someone already imagined. The **unknown** — the failure nobody
scoped — is found by *exploration*: learning the system, designing tests, and running them **at the same
time**, steering by what you discover. This is the heart of testing (vs. checking). But unstructured
exploration drifts and can't be accounted for — so you structure it with **charters and time-boxed
sessions** (session-based test management).

## Run a session
1. **Write a charter** — a one-line mission: *"Explore the checkout flow under network failure to discover
   how partial payments are handled."* It names **what** to investigate and **why** (the risk), and bounds
   the area. Lead with the highest-risk charters (`target-the-risk`).
2. **Time-box it** — typically 60–120 minutes of focused, uninterrupted investigation per charter. A box
   keeps it accountable and forces you to move on.
3. **Learn → design → execute, in a loop** — as you discover how it actually behaves, design the next test
   from what you just learned. **Follow the smell**: when something feels off, abandon the plan and dig —
   the bug cluster is where the system wobbled.
4. **Take notes as you go** — what you tested, what you found, what you couldn't get to, new questions,
   and any setup/environment that mattered. The notes *are* the coverage record for work that had no
   pre-written script.
5. **Debrief** — turn findings into reproduced, graded bugs (`reproduce-and-grade`) and spin off the
   open questions into new charters.

## When to reach for it (vs. scripted checks)
- A new or risky area where you don't yet *know* the failure modes → explore.
- A reproduced bug that hints at a deeper cluster → a charter to map the cluster.
- A vague "something's wrong here" → a charter beats flailing.
- A stable, well-understood path you must protect on every release → that's a *regression check*, not
  exploration (`guard-against-regression`).

## The discipline
- Exploration is **structured freedom**, not aimless clicking — the charter and the time-box are what make
  it testing, not noodling.
- Account for what you did: an exploratory session that produced "looks fine" and no notes is not a result.
- Sessions compound: each one teaches you *this product's* recurring failure modes — record them so the
  next session starts sharper.
