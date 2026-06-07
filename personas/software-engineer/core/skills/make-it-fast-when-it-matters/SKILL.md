---
name: make-it-fast-when-it-matters
description: Use when performance matters or something is slow — measure before optimizing, profile to find the real bottleneck, fix that; resist optimizing on a guess, but don't ship lazily slow either.
---
# Make it fast when it matters — measure, don't guess

*"Premature optimization is the root of all evil"* (Knuth) — but so is shipping something needlessly slow
because you never looked. The resolution is the same word: **measure.**

## The method
1. **Have a target.** What's "fast enough" here (latency budget, throughput, cost per call)? Optimize
   toward a number, not vibes.
2. **Profile — find the real bottleneck.** Performance intuition is usually wrong. Profile/measure to find
   where the time/allocations/queries actually go; the hot path is rarely where you'd guess.
3. **Fix the biggest measured cost first.** Often it's **algorithmic** (an O(n²) or **N+1 query** loop —
   one query per row instead of a batch), not micro-tuning. Batch, cache, index, or change the algorithm
   — then **re-measure** to confirm the win.
4. **Don't micro-optimize cold paths.** Effort spent where it doesn't matter is its own failure; leave
   the rest clear and simple.

## The "is this premature?" test
Ask: *do I need to measure to know this is slower?* If **no** (an obvious O(n²) or N+1 in a hot loop) —
it's basic competence, fix it now. If **yes** — finish the feature correctly and measure later.

## The discipline
- Correctness and clarity first; a fast wrong answer is worthless, and a clever optimization that
  obscures the code costs every future reader.
- Re-measure after every change — "should be faster" is not a result.
