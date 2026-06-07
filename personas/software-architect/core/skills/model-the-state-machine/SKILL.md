---
name: model-the-state-machine
description: Use when designing any lifecycle, workflow, phase, or status field (order, job, session, document, deployment, request) — model it as explicit states, transitions, and guards rather than scattered boolean flags.
---
# Model the state machine — make the lifecycle explicit

Anything that moves through phases — an order, a job, a session, a document, a deployment, a request, an
onboarding — is a state machine whether or not anyone wrote it down. Left implicit, the lifecycle becomes a
pile of boolean flags (`is_started`, `is_done`, `is_cancelled`, `was_retried`) whose combinations encode
illegal states nobody designed, and "what happens if it's cancelled *and* retried?" has no answer. Making
the machine **explicit — states, transitions, guards** — is the architect's move: it turns a fog of edge
cases into a finite, reviewable, testable shape.

## The method
1. **Enumerate the states.** List the distinct phases the thing can be in — one field with one value
   (`pending → running → succeeded | failed | cancelled`), not a soup of independent booleans. Name the
   **initial** state and the **terminal** state(s). If two booleans can produce a combination that "can't
   happen," that combination is an illegal state your model should make *unrepresentable*.
2. **Define the legal transitions.** For each state, list exactly which states it may move to and what
   **event** triggers the move (`running --finish--> succeeded`). Everything not listed is illegal. Draw it
   — a small transition table or an ASCII diagram makes the gaps obvious:

   ```
   pending ──start──▶ running ──finish──▶ succeeded   (terminal)
              │           │
              │           ├──error───▶ failed         (terminal)
              └──cancel───┴──cancel──▶ cancelled      (terminal)
   ```

3. **Put a guard on each transition.** A transition fires only if its **precondition** holds — the guard
   (e.g. "may cancel only from `pending` or `running`, never from `succeeded`"). Guards are where illegal
   transitions get rejected loudly instead of corrupting state silently.
4. **Decide terminal behavior and idempotency.** Terminal states don't transition out — re-sending
   `finish` on something already `succeeded` should be a **no-op or a rejected guard**, never a second
   side effect. This is what makes the lifecycle safe under retries and double-delivery.
5. **Probe each transition under interruption.** For every transition ask: what if the process crashes,
   is killed, or the event arrives twice *mid-transition*? Where is the state persisted, and is the
   write atomic with the side effect? A transition that updates state and does its side effect
   non-atomically can land in a torn in-between — design the recovery (re-derive from persisted state,
   or make the step idempotent so resume is safe). Pair with `design-for-failure`.
6. **Make it the single source of truth.** The state field is owned by one writer (`design-the-boundaries`);
   every surface reads the same field and respects the same transition rules — don't let one path move the
   state by a rule another path doesn't know (`converge-on-one-surface`).

## The discipline
- Prefer **one explicit state field with a small enum** over a constellation of booleans — the enum can't
  represent the illegal combinations the booleans can.
- The transition table *is* a test plan: every legal transition gets a test, every illegal one gets a test
  that it's rejected. Hand them to the engineer in the brief and to QA as the matrix to attack.
- A lifecycle change (new state, new transition) is a hard-to-change boundary call — record it
  (`record-the-decision`) so a later change can't quietly add a transition that breaks an invariant.
- This is a general modeling tool — it applies to any lifecycle, deterministic or otherwise; the value is
  the explicit shape, not the mechanism that drives it.
