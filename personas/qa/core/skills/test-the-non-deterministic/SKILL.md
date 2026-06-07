---
name: test-the-non-deterministic
description: Use when a verdict rests on a measured quantity rather than a single deterministic assertion — a noisy/probabilistic output, a performance number, an accuracy or conversion rate. "It ran" or one lucky sample is not a verdict; bring experimental rigor (labelled reference set, a baseline/control, saved structured results, significance on the delta) and, for an AI/probabilistic component, score the distribution and red-team the guardrails.
---
# Test the non-deterministic — measure with rigor, don't eyeball one sample

Some claims can't be settled by a single assertion. When the thing under test is a **measured quantity** —
a noisy or probabilistic output, a latency, an accuracy/conversion/error rate — one sample is an anecdote
and "it ran / it looks faster" is not a verdict. You settle it the way an experimentalist would: against a
**fixed reference set**, compared to a **baseline**, with **results saved**, and a **delta you can trust is
real** rather than noise.

## Measurement rigor — the general discipline (applies to any measured claim)
1. **A labelled reference set.** A fixed, representative collection of cases — inputs spanning
   easy / common / hard-edge / adversarial — with the *expected* outcome (the label / the oracle) recorded.
   It's fixed so runs are comparable; it grows as every escaped failure becomes a permanent case. One
   hand-picked example is not a reference set.
2. **A baseline / control.** A number is meaningless alone — you measure the **change** against the prior
   version, the current production behavior, or a control group. "9s" means nothing; "9s vs. 1.2s before"
   is the finding. Hold everything else fixed (same data, same environment, same load) so the comparison is
   honest.
3. **Saved, structured results.** Persist each run — per-case outcome, the score, the conditions, the
   version/commit, the timestamp — not a glance at a console. You can't claim a regression or an
   improvement you can't put two saved runs next to.
4. **Significance on the delta.** Before you call a difference real, ask whether it's bigger than the
   run-to-run noise: repeat the measurement, look at the spread (not just one number), and don't report a
   move that's within the variance you'd see from re-running the same thing. A 3% wobble on a 50-case set
   is probably noise; a consistent shift across repeated runs is a finding.

This is general experimental rigor — the same discipline backs a perf claim, an accuracy claim, or an AI
eval below. It is **not** an LLM-specific harness; it's how any measured verdict earns trust.

## When the component is AI/probabilistic — score the distribution
A traditional assertion expects **one** correct output. An LLM (or any probabilistic component) returns a
*distribution* — the same input can yield different, sometimes-acceptable, sometimes-wrong answers.
Pass/fail assertion-based QA **breaks** against this: a green run proves nothing, and "it ran" is not a
verdict. Apply the measurement rigor above — the reference set, baseline, saved results, significance — and
score for **meaning, quality, accuracy, and safety** across many cases rather than checking one.

## Build the eval, don't write one assertion
1. **Eval set** — a dataset of real inputs spanning **easy / common / hard-edge / adversarial** cases.
   Grow it from production failures and from every bug you find. One example is an anecdote; an eval set is
   evidence.
2. **Graders** (define "correct" explicitly), in order of preference:
   - **Deterministic** — exact match, format/JSON-schema/regex, contains/excludes a required fact. Use
     wherever the output has a checkable shape.
   - **Rubric-based (LLM-as-judge or human)** — score against a *written* rubric for the fuzzy parts
     (helpfulness, groundedness). Spot-check the judge against humans; an unverified judge is a guess.
   - **Composite** — combine several into one score for multi-dimensional quality.
3. **Acceptance = a target pass rate PLUS a worst-case floor.** A 95% average can hide a catastrophic 5% —
   so check the **tail**, not just the mean. Pair the pass rate with guardrails: **groundedness /
   hallucination rate, refusal & safety, latency, cost per call.**
4. **Failure taxonomy** — bucket the misses (hallucination, wrong format, refusal-when-shouldn't,
   unsafe-when-shouldn't) so fixes are targeted and you can tell if a change helped or moved the problem.

## Red-team the guardrails (the adversarial pass for AI)
- **Prompt injection / jailbreak** — input that tries to override instructions or exfiltrate the system
  prompt/data.
- **Unsafe content** — does it refuse what it must refuse, and *not* over-refuse the benign?
- **Hallucination under pressure** — ambiguous or out-of-scope inputs; does it invent confidently?
- **Bias / fairness** — same task across demographics/locales; does quality or safety differ?

## The discipline
- **Re-run the measurement on every relevant change against the same reference set + baseline** — measured
  behavior regresses *silently*; a change that "looks fine" can quietly tank the hard-edge cases or the
  tail. Compare saved run to saved run, don't re-decide from memory.
- Don't grade by eyeballing one output/one timing — that's the trap; measure the set and weigh the delta
  against the noise.
- The reference set is a living asset — every escaped failure becomes a new case so it can't escape twice.
- Acceptance *thresholds* for the product (the target rate, the floor, the budget) are the
  **product-manager's** call; you build and run the measurement and report where it lands against them.
