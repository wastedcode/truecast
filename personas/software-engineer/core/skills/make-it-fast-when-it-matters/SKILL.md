---
name: make-it-fast-when-it-matters
description: Use when performance matters, something is slow, or a job is failing/timing out — measure before optimizing, profile to find the real bottleneck, parallelize independent work and set timeouts on anything that can hang; resist optimizing on a guess, but don't ship lazily slow either.
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
4. **Parallelize the independent work.** When a slow job is a batch of independent units (per-row, per-file,
   per-request) run serially, the win is often **concurrency**, not micro-tuning each unit — fan them out
   (worker pool / async gather / batched query) with a sane bound, and keep a serial path only where there's
   a true data dependency. One batched/parallel pass beats a hundred sequential round-trips.
5. **Don't micro-optimize cold paths.** Effort spent where it doesn't matter is its own failure; leave
   the rest clear and simple.

## When jobs are slow, failing, or hanging — bound the time, don't guess it
A job that "sometimes hangs" or "fails under load" is usually a missing **timeout**, not a mystery. Don't
guess a number and move on:
- **Put a timeout on every call that can block** — network, subprocess, lock acquisition, the whole job.
  An unbounded wait is a hang waiting to happen and a resource leak when many pile up.
- **Set the value from the measured distribution**, not a hunch — base it on observed p99 + headroom, and
  make it configurable. A timeout pulled from thin air either fires on healthy work or never protects you.
- **Decide what happens when it fires** — retry with backoff (idempotent only), fail fast and surface, or
  shed load. Pair with `make-it-robust` so a fired timeout doesn't corrupt state or leak a process.

## The "is this premature?" test
Ask: *do I need to measure to know this is slower?* If **no** (an obvious O(n²) or N+1 in a hot loop) —
it's basic competence, fix it now. If **yes** — finish the feature correctly and measure later.

## The discipline
- Correctness and clarity first; a fast wrong answer is worthless, and a clever optimization that
  obscures the code costs every future reader.
- Re-measure after every change — "should be faster" is not a result.
