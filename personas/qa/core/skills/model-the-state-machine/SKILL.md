---
name: model-the-state-machine
description: Use before attacking a build that has any lifecycle, phases, or persisted progress — enumerate the states, transitions, and guards, then probe every transition under crash / kill / resume / double-send (the transition × interrupt matrix) to find where an interrupted transition corrupts or strands state.
---
# Model the state machine — most bugs live in a transition, not a state

A feature with a lifecycle — a draft that becomes published, a job that runs then completes, a session
that opens, resumes, and closes, a payment that authorizes then captures — is a **state machine** whether
the author drew it or not. The author tested the states ("a draft renders", "a completed job shows
results"). The bugs live in the **transitions**, and especially in **transitions that get interrupted**:
the process dies between two writes, the user double-sends, the network drops mid-flight, a resume lands on
half-written state. You can't attack a machine you haven't drawn — so draw it first.

## Step 1 — enumerate the machine (before you touch the build)
- **States** — every distinct condition the thing can be in (empty, draft, in-progress, paused, completed,
  failed, cancelled, expired). Include the *implicit* ones the author didn't name (partial, orphaned,
  zombie, "started but never finished").
- **Transitions** — every legal move between states, and the **event** that triggers it (user action,
  timer, external callback, retry).
- **Guards & invariants** — what must be true to take a transition, and what must *stay* true across one
  (a balance never goes negative; a record has exactly one owner; an idempotency key is consumed once).
- **Illegal transitions** — moves that must be *rejected* (complete a cancelled job, pay an expired
  invoice, resume a session that was torn down). These are where authz/state-confusion bugs hide.

## Step 2 — the transition × interrupt matrix
For **each transition**, walk it under each interrupt and ask "where does the state land, and is it legal?"

| interrupt | the probe |
|---|---|
| **crash** | kill the process *mid-transition* (between the two writes, before the commit, after the side-effect but before the ack). Does it recover to a legal state, or strand a half-written one? |
| **kill / cancel** | user (or operator) cancels mid-transition. Is the partial work rolled back, or left orphaned? |
| **resume** | restart / reopen / reload *into* the interrupted transition. Does resume re-derive correct state, or trust stale/half-written state? |
| **double-send** | fire the triggering event twice (double-click, retried request, redelivered callback). Is the transition **idempotent**, or does it run twice (double charge, duplicate row, doubled counter)? |
| **out-of-order / stale** | the event arrives late, twice, or after a newer one (a callback after cancel; a resume before the prior write landed). Does a guard reject it, or does it clobber? |

The richest seam is **crash + resume on the same transition**: kill between write A and write B, then
resume — almost all "it worked once but the second time it's broken" and "stuck in a phantom state" bugs
are an interrupted transition the resume path trusted.

## The discipline
- **Draw it, even as ASCII** — `empty → draft → published`, with the interrupt-probes noted per arrow. The
  drawing *is* the coverage record; a transition with no probe is untested.
- A transition that isn't **idempotent** and isn't **guarded** is a P0 waiting for a double-send or a
  redelivery — grade it accordingly (`reproduce-and-grade`).
- This feeds the runtime attack: the matrix is the target list for `attack-like-a-real-user` (state &
  timing, flow, the second time) — model first, then attack the transitions you found.
- A lifecycle that is *fragile by construction* (no guards possible because the design has no single owner
  of state) is an architecture finding — grade it and escalate the **architect**, don't try to redesign it.
