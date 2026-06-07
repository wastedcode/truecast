---
name: eval-driven-ai-product
description: Use when the feature is AI/LLM-powered (generation, summarization, classification, agents, RAG) — its acceptance is an EVAL, not "it runs." Define the dataset, graders, thresholds, and failure taxonomy before shipping.
---
# Eval-driven AI product — the eval IS the spec's acceptance

For a probabilistic feature, "it works on my one example" is not acceptance and a screenshot is not
proof. The acceptance criterion is an **eval**: a measured pass rate over real cases, with guardrails.
Define it *before* the build, like any other spec's bar.

## The method
1. **Build the eval set from reality.** Collect real (or realistic) inputs spanning the easy case, the
   common cases, the **hard/edge cases**, and the adversarial/abuse cases. Tens to start, grow over time;
   capture production failures back into it.
2. **Define graders.** Match the grader to the task: **programmatic** (exact/format/contains) where
   possible; an **LLM-as-judge** with a written rubric for open-ended quality (and spot-check the judge);
   **human** review for the cases that matter most. State what "correct" means — vague graders hide bugs.
3. **Set the acceptance threshold + guardrails.** A target pass rate on the set, PLUS guardrails the
   feature must not breach: refusal/safety behavior, hallucination/groundedness, latency, **cost per
   call**, and a floor on the worst-case (a 95% average that fails catastrophically 5% of the time may be
   unacceptable).
4. **Keep a failure taxonomy.** Bucket the misses (wrong facts, ignored instruction, format break,
   over-refusal, prompt-injection) so improvement is targeted, not vibes.
5. **Regression-eval before every ship.** Re-run the set on each prompt/model/version change — model and
   prompt updates silently regress. The eval is the unit test of a probabilistic system.

## The discipline
- The eval is **the acceptance section of the PRD** for an AI feature — write it at spec time, not after.
- Don't trust a demo; trust the pass rate on the hard cases.
- Versions move under you — pin the model, and treat a model swap as a change that must re-pass evals.
