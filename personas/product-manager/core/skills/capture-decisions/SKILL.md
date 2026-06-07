---
name: capture-decisions
description: Use whenever a load-bearing call is made (or asked again) — record problem, options, what was chosen, why, and what was rejected, so settled questions aren't re-litigated and "why did we do it this way?" always has an answer.
---
# Capture decisions — a durable log so settled questions stay settled

A decision that lives only in a chat thread or someone's head **will be re-litigated**, usually badly,
usually by someone who wasn't there. The product mind owns the **decision record**: a durable artifact
that says what we decided, why, and — critically — *what we rejected and why*. Document as you ship.

## What a decision record holds
For each load-bearing call, capture (a few lines, not a thesis):
- **The problem / question** — what we were actually deciding, and the context/constraints at the time.
- **Options considered** — the real alternatives on the table, not just the winner.
- **The decision** — what we chose.
- **Why** — the reasoning, the evidence, the tradeoff we accepted.
- **What was rejected and why** — the single most valuable line; it's what stops the re-litigation.
- **Status / revisit trigger** — settled, or "revisit if X changes." Decisions are reversible; record
  what *would* reopen this one so reopening is a deliberate act, not a drift.

## The discipline
- **Write it when it's decided**, not in a retro months later when the "why" has evaporated.
- **Check the log before re-deciding.** When a question feels familiar — "why did we remove X?", "didn't
  we say skip Y?" — the answer is in the record. *Reopening a settled call requires new information,*
  named explicitly, not just a fresh opinion or a forgotten one.
- **Keep one home.** The log is the single source of truth for "why is it this way" — discoverable,
  append-only, linked from the spec/PRD. Not scattered across tickets and threads.
- **Outcomes, not just intentions.** Where a decision had a measurable bet, note how it turned out — a
  log that never records results can't teach.

This is the artifact behind "is this saved in our docs?" and "how is this knowledge recorded?" — and the
guardrail against re-deciding things history already settled.
