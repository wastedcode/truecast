---
name: converge-on-one-surface
description: Use when more than one entry surface exists or is proposed (CLI, API, MCP, UI, webhook, cron) — make every surface route to one shared core code path, and run a DRY pass for the same thing hand-rolled twice.
---
# Converge on one surface — many doors, one room

A system grows entry points: a CLI, an HTTP API, an MCP server, a UI, a webhook, a scheduled job. The
failure mode is each one growing *its own* copy of the logic — its own validation, its own orchestration,
its own error handling — so the same behavior drifts three ways and a fix in one never reaches the others.
The architectural rule is blunt: **every surface is a thin adapter over one shared core.** The CLI and the
MCP server and the UI should all route to the same code path; if they don't, ask why not.

## The method
1. **Name every entry surface.** List the doors into the system: CLI, API/HTTP, MCP, UI, webhook, cron/job,
   library import. Each is a *door*, not a *room* — none should contain business logic.
2. **Define the one core path the doors route to.** The real work (validate → authorize → orchestrate →
   persist → respond) lives in **one** place, callable as a plain function/service. A surface's only job is
   transport translation: parse its own input shape into the core's call, render the core's result into its
   own output shape. Nothing load-bearing happens in the adapter.
   - Litmus test: *"shouldn't the CLI and the MCP server just call the API's code path?"* If the answer is
     "they each reimplement it," that's the bug. Collapse them onto the shared core.
3. **Push the seam to the right altitude.** Share the *domain logic*, not the HTTP layer — the core
   shouldn't know it's behind HTTP or a terminal. Surfaces own auth-context extraction and serialization;
   the core owns the decision and the write.
4. **Run the DRY pass — "where have we hand-rolled the same thing twice?"** Sweep for duplicated logic that
   should be one function: two code paths building the same command/query, two validators for the same
   shape, two retry/error blocks, copy-pasted parsing, the same constant redefined. Duplication is the
   leading indicator of future drift — one copy gets fixed, the other rots.
   - Distinguish *true* duplication (same reason to change → unify) from *incidental* similarity (looks
     alike, changes for different reasons → leave it; premature unification couples the unrelated).
5. **Protect convergence as an invariant.** Once collapsed, keep it collapsed: a fitness function / test
   that exercises the core directly, plus a thin per-surface test that proves the adapter delegates — so a
   future surface can't quietly fork the logic again (`keep-it-evolvable`).

## The discipline
- This is DRY at the architecture level — *single source of truth for behavior*, not just for constants.
- A surface that needs behavior the core doesn't have is a signal to extend the *core*, not to special-case
  the adapter.
- Don't over-rotate into a god-core: shared logic that genuinely changes for different reasons per surface
  is not duplication. Unify what shares a reason to change; the First Law still applies
  (`weigh-the-tradeoffs`).
- When you collapse surfaces onto one path, that's a hard-to-change boundary call — record it
  (`record-the-decision`).
