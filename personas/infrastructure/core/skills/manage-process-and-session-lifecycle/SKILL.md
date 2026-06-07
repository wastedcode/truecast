---
name: manage-process-and-session-lifecycle
description: Use whenever the system spawns processes, sessions, jobs, workers, or connections (background daemons, tmux/PTY sessions, worker pools, cron jobs, subprocesses) — model the full lifecycle, enforce clean shutdown/draining, and VERIFY nothing was left running; no zombies, no stragglers.
---
# Manage process & session lifecycle — no zombies, no stragglers

Anything you spawn, you own until it's gone. The recurring failure is the **straggler**: a session, daemon,
worker, or job that was supposed to end but is still running — burning money, holding a lock, pinning a
connection, or quietly corrupting state on the next run. "Why are two empty sessions still running after it
said done?" is the smell. The rule: **a spawned thing is not done until you've confirmed it spun down.**

## Model the lifecycle explicitly (every spawned thing has all of these)
Treat process/session life as a small state machine, and design each transition before you build:
- **spawn** — who creates it, with what identity/limits, recorded *where* (a registry/PID file/session list you
  can enumerate later — you can't reap what you can't find).
- **run** — bounded: a timeout/TTL/max-lifetime so a hung one can't run forever; a heartbeat/liveness signal.
- **drain** — stop taking new work, finish or checkpoint in-flight work, release locks/connections cleanly.
- **shutdown** — graceful first (SIGTERM + grace period), forced second (SIGKILL) only after drain times out;
  handle the signals so shutdown isn't a hard kill that orphans children or leaves half-written state.
- **reap & verify** — confirm it actually exited, child processes too (no orphans/zombies), resources released.

## The non-negotiable: verify the spin-down (don't assume it)
- **Enumerate, then confirm zero.** After a run/teardown, *list* the processes/sessions/jobs/connections that
  should be gone (`ps`, the session list, the job queue, open FDs/connections) and confirm the count is what you
  expect — usually zero. "I called shutdown" is a description; "I listed sessions and there are none" is done.
  (This is `own-prod-mindset` — verify the spin-down, not the shutdown call — applied to lifecycle.)
- **Idempotent, self-healing cleanup.** Cleanup must run on every exit path including crash/timeout/error — not
  only the happy path (`try/finally`, trap handlers, `defer`, a reaper sweep for orphans on the next start).
  Crash-only thinking: assume the process can die at any instant and still leave the system reap-able.
- **Bound the population.** Cap concurrency / pool size / max sessions so a leak can't spawn unboundedly; alert
  when the live count drifts above the expected steady state (a slow leak is an incident in waiting).

## Common straggler classes to hunt
Orphaned child processes after a parent dies · tmux/PTY/SSH sessions never closed · idle dev/test environments
left up · connection-pool / DB-connection / file-descriptor leaks · cron jobs that overlap because the previous
run never finished · "background" jobs detached and forgotten · retries that double-spawn the same work · test
harnesses that don't tear down what they spun up (poisons the next run — pairs with QA runtime forensics).

## The discipline
- The cost of a straggler compounds: a billed-by-uptime zombie (`know-the-platform`) bills forever; a leaked
  lock blocks the next deploy; a leftover session corrupts the next run's state. Reap aggressively.
- Make spin-down *observable* (`observability-that-pages-on-symptoms`): the live-process/session count is a
  first-class signal, and "count not returning to baseline after a run" is an alert, not a mystery.
