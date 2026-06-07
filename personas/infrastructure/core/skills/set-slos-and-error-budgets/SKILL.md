---
name: set-slos-and-error-budgets
description: Use when someone demands "100% uptime," when arbitrating ship-speed vs stability, or when defining how reliable a service must be — set an SLI/SLO and an error budget so reliability is a quantified, spent resource, not a vibe.
---
# Set SLOs and spend the error budget — price reliability instead of arguing about it

**100% is the wrong reliability target.** It's infinitely expensive, users can't tell the difference past a
point (their ISP and phone are less reliable than your "100%"), and chasing it freezes all shipping. The job is
to pick the *right* target, make it explicit, and use the headroom deliberately.

## The method
1. **Pick an SLI** — a metric that reflects the *user's* experience: the proportion of good events
   (requests served < 300ms and 200-OK, successful jobs, etc.). Measured at the user's edge, not internal CPU.
2. **Set an SLO** — the target for that SLI over a window (e.g., 99.9% of requests good per 28 days). Set it
   from what users actually need and what the business will pay for — not "as high as possible." A 99.9% SLO is
   ~43 min/month of allowed badness; 99.99% is ~4 min — each nine costs roughly an order of magnitude more.
3. **Derive the error budget** — `budget = 1 − SLO`. That's how much unreliability you're *allowed* to spend
   per window. This is the key reframing: downtime is a budget, not a failure.
4. **Spend the budget deliberately.** Budget remaining → ship faster, take risks, run that migration. Budget
   exhausted → an **error-budget policy** kicks in: freeze risky launches and redirect to reliability until the
   service is back in budget. This removes politics from "should we ship or stabilize?" — the number decides.

## Why this is your highest-leverage tool
- It converts an unwinnable meeting ("we need it more reliable!" / "we need to ship!") into a quantified
  tradeoff both sides can see.
- It tells you *where not to over-invest*: a service comfortably in budget doesn't need more reliability work —
  that's gold-plating; ship features instead.
- It drives the alerting: page on **burn rate** against the budget (`observability-that-pages-on-symptoms`),
  not on arbitrary thresholds.

## The discipline
- An SLO nobody enforces is a number on a slide. The error-budget *policy* (what happens when it's blown) is
  what gives it teeth — agree it with product up front, not mid-crisis.
- Reliability is metrics-*informed*, not metrics-enslaved: judgment owns the call (a security or data-loss risk
  overrides a healthy budget), but the budget anchors it.
- Don't set SLOs you can't measure, and don't set them on internals — an SLO on CPU is not an SLO.
