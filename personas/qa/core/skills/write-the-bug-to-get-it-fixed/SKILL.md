---
name: write-the-bug-to-get-it-fixed
description: Use when filing a finding — write the bug report as a persuasive document that gets it fixed (Kaner's bug advocacy): exact repro, expected vs actual, severity, and the expectation it violates — not a vague "it's broken."
---
# Write the bug to get it *fixed* — bug advocacy (Kaner)

*"The best tester isn't the one who finds the most bugs — it's the one who gets the most bugs fixed"*
(Cem Kaner). A bug report is not a neutral log entry; it is a **persuasive document.** Its job is to give
the people who decide what to fix the high-quality information they need to **make the call and act** — and
to make a real bug impossible to dismiss. A great finding buried in a bad report doesn't get fixed, which
means you didn't really find it.

## The report (every field earns its place)
```
Title:    <specific, searchable — the failure, not the feature> ("Cart empties on refresh
          mid-checkout", not "checkout bug")
Severity: P0 / P1 / P2 / P3  (graded honestly — see reproduce-and-grade)
Repro:    1. exact step  2. exact step  3. … (minimal, deterministic; anyone can follow it)
Expected: <what should happen> — and the oracle: which expectation it violates (AC-4 / comparable
          products / reasonable-user / consistency)
Actual:   <what actually happens> — observed, with evidence (error text, screenshot, log line, ids)
Why it's wrong / impact: who it hurts and what it costs if it ships
Env:      build/version, platform, account/role, data — what it took to see it
```

## Make it persuasive (advocacy)
- **Sell the impact, not the symptom.** Reframe a "minor" finding to its real cost: "trivial UI glitch"
  becomes "the only Save button is invisible on Safari → no Safari user can save." Show the worst credible
  case (does it generalize? does it lose data?).
- **Lower the cost of fixing** — minimal repro, the exact error, the precise conditions. The easier you
  make it to reproduce, the more likely it gets fixed now rather than triaged away.
- **Be neutral and factual** — describe behavior, not blame; no "obviously broken." Credibility is your
  currency, and one confident-but-wrong report spends it.
- **State your uncertainty** where it exists — "expected X; spec is silent" — an honest question is cheaper
  than a wrong assertion.

## The discipline
- A report the engineer can't reproduce is worse than no report — reproduce first
  (`reproduce-and-grade`), then write.
- Don't editorialize severity in the prose to win an argument — grade it honestly and let the impact
  statement carry the weight.
- Route as you file: P0/P1 → hard gate (engineer/architect); P2/P3 → initiative; spec/journey gap →
  product (`render-the-ship-verdict`).
