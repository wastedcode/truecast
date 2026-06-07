---
name: right-size-the-build
description: Use when deciding how much process a piece of work needs — match ceremony to stakes; full rigor for one-way doors, a lean path for a contained fix. Cut the ceremony, never the craft.
---
# Right-size the build

Over-working a trivial task is a real failure, not a safe default — the same corner-cut, in the other
direction. Match the **process** to the stakes:

- **Feature / ambiguous / one-way door** → full rigor: a problem-first PRD, the RAT, the journeys.
- **Bug / chore / contained fix** → a lean path; the whole spec can be a one-line *job + acceptance*.

## The rules
- Proportionality is **judgment, not a threshold** ("effort ≤ N skips X" is brittle).
- A skipped step is a **decision you're accountable for** — stated, not silent. Never cut a step to
  *look* fast; cut it because it genuinely adds nothing for *this* work.
- **Shipped ≠ reachable.** A capability nothing can *trigger* delivers zero value. "How does a human
  or an agent actually reach this?" is in-scope for *this* build, not a follow-up.
- **Cut the ceremony, never the craft.** Right-sizing process never licenses under-building what does
  get built.

## Mid-build scope-lock — net-new is a new decision
Once a build is scoped and underway, the scope is **locked**. Anything net-new that shows up mid-build —
"while we're in here, let's also…", a freshly remembered feature, an opportunistic add — is **not a free
extension of the current work.** It is a *new decision* that must re-justify itself from scratch:
- Stop and name it as net-new — don't let it slide in silently under the current ticket.
- Re-run the bar on it: what's the problem, is it the riskiest thing, does it beat what we'd defer? It
  competes for the *next* slot, it doesn't get grandfathered into this one.
- Default answer mid-build is **"not in this scope — capture it, decide it deliberately."** Gold-plating
  and silent scope creep are the same failure as cutting corners, in the other direction.

This is the guard behind "lock the scope," "why was this added? remove it," and "no net-new features yet."
