---
name: know-the-platform
description: Use before building on or committing to a vendor/runtime (cloud, PaaS, serverless, queue, DB, third-party API) — read the actual pricing, runtime-limits, and execution-model docs first, so the charging unit, hardcoded limits, and statefulness aren't discovered in production.
---
# Know the platform — read the pricing & limits docs before you build on it

Most expensive infra surprises aren't bugs — they're the platform behaving exactly as documented, by someone
who never read the docs. The charging unit, a hardcoded timeout, a cold start, a concurrency cap: each is
written down, and each reshapes the design. **Ground the design in the vendor's actual docs, not in how you
assume the platform works** — "I think it bills by request" is the sentence that precedes the bill spike.

## What to read before you commit (and re-read before you scale)
1. **The charging unit — what exactly are you billed for.** Per-invocation vs. per-second-of-uptime vs.
   provisioned-capacity vs. **egress/cross-AZ/cross-region data transfer** vs. per-request vs. per-row/-GB-stored.
   This single fact decides the architecture: a billed-by-uptime runtime wants scale-to-zero and no idle
   daemons; a billed-by-invocation runtime wants batching and fewer calls; an egress-priced one wants data
   locality. Find the *free tier and its cliff* — what happens at the edge of it.
2. **Runtime limits — the hardcoded ceilings.** Max execution time / request timeout (the classic "is there a
   hidden 240s/900s cap?"), max payload/response size, memory/CPU ceiling, **concurrency and rate limits/quotas**
   (per-second and per-day), connection caps, max cron frequency, retention windows. Anything you can hit is a
   failure mode you must design around — find it now, not at 3am.
3. **The execution model — statefulness & cold start.** Is the runtime stateful or does it reset between
   invocations (no local disk/memory persistence)? Is there a **cold-start** penalty, and how big? Does it
   suspend idle? Long-lived connections / WebSockets / background work allowed, or request-scoped only? This
   decides whether your workload even fits the platform — a long-lived stateful daemon on a request-scoped
   serverless runtime is a category error.
4. **The operational seams.** How deploy/rollback actually work here, what observability the platform exposes
   natively, how secrets are injected, regions/availability, and the **stated SLA** (and its exclusions).

## The discipline
- **Quote the doc, link the doc.** A platform claim that matters ("billed per request," "10MB response cap,"
  "240s max") gets a citation to the vendor's current docs — not memory, not a year-old blog post. Vendors
  change pricing and limits; verify against *current* docs (`WebFetch`/`WebSearch`), and note the date.
- **Pick the platform for the workload** (pairs with `right-size-reliability`): a long-lived stateful daemon vs.
  a bursty request handler vs. a batch job want different runtimes. Name the workload shape, then match it to a
  platform whose charging unit and execution model fit — don't retrofit the workload to a platform you already
  like.
- **Feed the numbers into the cost and capacity skills.** The charging unit is the input to `tame-cloud-cost`;
  the hardcoded limits/quotas are inputs to `plan-capacity-and-prove-it-scales` (a vendor quota is a real knee).
- The business call ("is this platform worth it?") is the founder's — your job is to put the *real* charging
  unit, limits, and execution model on the table so the decision is informed, not a guess.
