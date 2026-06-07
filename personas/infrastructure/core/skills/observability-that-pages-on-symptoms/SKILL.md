---
name: observability-that-pages-on-symptoms
description: Use when adding monitoring/alerting or when alerts are noisy/missing — instrument golden signals, make the system debuggable (metrics/logs/traces), and page humans only on user-facing symptoms, not on causes like CPU%.
---
# Observability that pages on symptoms — actionable alerts, not noise

You can't run what you can't see, and you can't keep a team that's woken up every night by alerts nobody can
act on. The goal is twofold: **the system is debuggable when it breaks**, and **alerts page a human only when a
user is being hurt and a human must act.**

## Instrument the signals
- **Golden signals** (Google) for any request-driven service: **latency, traffic, errors, saturation.** This
  is the floor for "is the service healthy from the user's side."
- **RED** (rate, errors, duration) per endpoint/service for request-driven work; **USE** (utilization,
  saturation, errors) for resources (hosts, queues, pools, disks).
- **Metrics, logs, traces** (and increasingly profiling) — but these are *means*, not the goal. The goal is
  being able to ask new questions of prod without shipping new code. Emit high-cardinality, structured
  context (ids, inputs, the *why*) so you can slice to the one broken tenant/request.
- **Standardize on OpenTelemetry** for instrumentation so you're not locked to one vendor's agent.

## Trace every step, time every step (for any multi-step pipeline/job/workflow)
A single duration for a multi-step operation ("the job took 40s") tells you nothing about *which* step. For any
multi-stage work — a pipeline, a request that fans out, a batch job, a multi-call workflow — make each step
individually visible:
- **A per-step trace.** Each step is a span under one trace/correlation id you can follow end-to-end: step name,
  start/end, success/failure, the inputs/ids that identify *which* work it was. You should be able to pull up one
  run and see every step it took, in order, with its outcome — *without* adding logging and re-running it.
- **Per-step timing.** Record each step's duration, not just the total, so the slow step is obvious at a glance
  and you can see *where* the time went. The bottleneck is a step, and step timing is how you find it instead of
  guessing (pairs with `plan-capacity-and-prove-it-scales`).
- **General, not vendor-specific.** This is the discipline for any workload — count/duration/outcome per step.
  Whatever the per-call resource units of *your* platform are, attribute them per step the same way you attribute
  time (`know-the-platform` tells you what those units are; `tame-cloud-cost` attributes the spend).

## Page on symptoms, not causes (the rule that kills alert fatigue)
- **Alert on user-facing symptoms**: "checkout error rate is up," "p99 latency breaches the SLO," "the SLO is
  burning fast." These mean a user is hurting.
- **Do NOT page on causes**: "CPU > 80%," "memory at 70%," "disk filling." High CPU with happy users is not an
  incident — it's a dashboard. These thresholds generate the non-actionable noise that burns out on-call.
- **Tie pages to the error budget** (`set-slos-and-error-budgets`). Use **multi-window, multi-burn-rate**
  alerting: page fast when you're burning the budget fast, ticket (don't page) when burning slow. This is the
  difference between paging on every blip and paging only when it matters.

## Every alert must be actionable
- An alert that fires must mean: *something is wrong, a human must do something, and the runbook says what.*
  If it's not actionable, it's a dashboard or a ticket, not a page.
- Each alert links to a runbook (`author-the-runbook`). A page with no runbook is a puzzle handed to a
  half-asleep engineer.
- Prune relentlessly: every flaky/ignored alert trains the team to ignore the next one — including the real one.

## The discipline
- The test of observability is an incident: could you find root cause from what's already emitted, *without*
  adding logging and redeploying? If not, instrument before you need it.
- Symptom-based + SLO-based alerting is what turns on-call from reactive noise into a humane, focused practice.
