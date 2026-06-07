# Metrics & experiment rigor — reference

The depth behind `define-success-metrics` and `eval-driven-ai-product`. Read when choosing a metric,
reading an experiment, or settling whether a result is real.

## North Star & the metric stack
- **North Star Metric (NSM):** the one metric that best captures the *value exchange* — a leading
  indicator of delivered value that the business follows. Good NSMs move *down* when the product gets
  worse (that's how you know it's not vanity). Examples: Slack "messages sent in active teams," Airbnb
  "nights booked," Uber "weekly completed rides."
- **OMTM (one metric that matters):** for the current phase, the single number to move. Beats a
  dashboard nobody acts on.
- **Input metrics:** the few levers that drive the NSM — what teams actually act on week to week.
- **Guardrail / counter-metrics:** must-not-degrade metrics watched alongside the NSM and every
  experiment (retention/churn, quality/CSAT, latency, unit economics, support load).
- **Vanity metrics:** counts that only rise (total signups/pageviews/downloads). Can't signal harm →
  don't steer by them.

## Goodhart's law
*"When a measure becomes a target, it ceases to be a good measure."* Anything you optimize gets gamed.
For each target metric, ask *how would I move this without creating value?* and pair it with the
guardrail that closes the gap (support ticket-close-time ↔ CSAT; engagement ↔ healthy-session-rate;
NSM ↔ churn).

## Experiment validity (before you trust an A/B win)
- **Power / sample size:** enough exposure to detect the effect; underpowered tests "find" noise.
- **Novelty & primacy effects:** new things spike (novelty) or confuse at first (primacy) then settle —
  read the result after the curve flattens, not on day one.
- **Guardrails moved right:** a primary +X% with a guardrail degrading is not a win.
- **Segment & interaction checks:** an aggregate win can hide a losing segment (Simpson's paradox).
- **One change at a time** (or a real factorial design) — confounded tests teach nothing.

## Product-market fit — is it real yet?
- **Sean Ellis 40% test (leading signal):** survey users who've used it enough (e.g. ≥2× in 14 days) —
  *"How would you feel if you could no longer use this?"* If **≥40% say "very disappointed,"** you likely
  have PMF. It predicts whether retention/growth will be healthy *before* the trailing metrics confirm it.
- **Retention curve (the truth):** cohort-based retention that **flattens** (a stable plateau of users
  who keep coming back) is the clearest sign of fit; a curve decaying to zero means no fit, however good
  acquisition looks. Look at cohorts over time, not aggregate counts.
- **Push → pull:** PMF shows up as a shift from pushing the product to organic pull/word-of-mouth
  (Lenny/Andreessen). Path: get *one* user to love it (and pay), then more, then notice the pull.
- NPS and aggregate retention are **trailing** indicators — they confirm what the 40% test already showed.

## Evals (for AI/LLM features) — the probabilistic analogue of acceptance
- **Eval set:** real inputs across easy / common / hard-edge / adversarial cases; grows from production
  failures.
- **Graders:** programmatic (exact/format) > LLM-judge (with a written rubric, spot-checked) > human for
  the highest-stakes. Define "correct" explicitly.
- **Acceptance:** a target pass rate **plus** guardrails — groundedness/hallucination, refusal/safety,
  latency, cost per call, and a worst-case floor (a high average can hide catastrophic tails).
- **Failure taxonomy:** bucket misses so fixes are targeted.
- **Regression evals:** re-run on every prompt/model/version change — these regress silently.
