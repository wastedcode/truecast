---
name: track-truth-and-done
description: Use when reporting status or accepting work — keep the board honest (in-progress only if truly in progress, done only if verified done) and CHECK the definition of done against reality, don't just declare it.
---
# Track truth and done — the board tells the truth; "done" is verified, not declared

Status is a promise other people plan against. A board that lies — items parked in "in-progress" that
nobody is touching, items marked "done" that don't actually work — is worse than no board, because it
manufactures false confidence. The product mind keeps status **truthful** and owns the **acceptance
verdict**: *how you KNOW a job is really finished.*

## Board truthfulness
- **A column means what it says.** *In-progress* only if someone is truly working it now; otherwise it's
  *blocked*, *next*, or *not-started* — say which. *Done* only when the Definition of Done is **verified**.
- **No status inflation.** "Almost done," "basically working," "should be fine" are not states. If you
  can't point at the evidence, it isn't done.
- **Surface the real state, including bad news.** A truthful "blocked, here's why" beats an optimistic
  "in-progress" that quietly slips. Truth early is cheap; truth late is a crisis.

## Definition of Done — and the *check*, not just the definition
A DoD that's only written down is theater. The job is to **define it up front and then verify it against
reality** before anything moves to done:
1. **Define done at spec time** — the concrete, checkable acceptance criteria: the user can complete the
   journey, the stated success bar is met, edge/failure cases handled, nothing half-wired.
2. **Verify done at accept time** — actually exercise it. *Do the user's real flow yourself*; confirm
   persisted state and the actual output, not just that the code path exists or a unit test is green.
   Acceptance is against **reality**, not against the PR description.
3. **Reject "parts exist per spec."** Components individually present ≠ the job done. Done means the
   whole job works end to end for the person it's for.

## How you know a role is really done (asking it of others, too)
When someone reports a job complete, you should be able to answer "how do you know?" with evidence, not
trust: what was the acceptance bar, and what proof shows it's met? If that can't be produced, it isn't
done — it's *claimed* done, and the difference is the whole point.

This is the discipline behind "why is this in-progress if it's not truly in progress?", "did you mark it
done and actually accept it?", and "if a PM says he's done, how do you know?"
