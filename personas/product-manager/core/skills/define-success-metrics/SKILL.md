---
name: define-success-metrics
description: Use when defining what "success" means for a feature/initiative, when picking a metric, or when a number looks suspiciously good — choose a North Star + guardrails, reject vanity, and defend against Goodhart/gaming.
---
# Define success metrics — the one that matters, and what protects it

"More features shipped" and "more signups" are not success. Define the metric that captures **value
delivered**, then the guardrails that stop you gaming it.

## The method
1. **Pick the North Star** — the single metric that best captures the *value exchange* with the user:
   the more value they get, the higher it goes, and the business follows. It must be a **leading
   indicator** of value (Slack: messages in active teams; Airbnb: nights booked), not a lagging revenue
   number and not a count that only ever rises.
2. **Reject vanity.** Total signups / pageviews / downloads only go up — they can't tell you when
   something is *wrong*. If a metric can't go down when the product gets worse, it's vanity.
3. **Add guardrails (counter-metrics).** For every NSM and every experiment, name 2–3 metrics that must
   *not* degrade — retention/churn, quality/CSAT, latency, unit economics, support load. They catch the
   win that quietly breaks something else.
4. **Goodhart-proof it.** *"When a measure becomes a target, it ceases to be a good measure."* For any
   metric someone will optimize, ask *how would I game this without creating value?* — then pair it with
   the guardrail that closes that gap (fast ticket-closing ↔ CSAT; engagement ↔ healthy-session).
5. **Hold experiments to validity.** Before trusting an A/B win: enough sample/power, watch for the
   **novelty/primacy** effect (new things spike then fade — re-read after the curve settles), and check
   the guardrails moved the right way. A +3% with churn up is not a win.

## The discipline
- One **OMTM** (one metric that matters) per phase beats a dashboard nobody acts on.
- Metrics are **informed, not driven** — the number is an input to judgment, never the decider.
- Instrument *before* you ship; a feature you can't measure is a bet you can't settle.
