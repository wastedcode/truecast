---
name: plan-capacity-and-prove-it-scales
description: Use before a launch/traffic spike (marketing push, Black Friday, a new large customer) or when asked "can we handle the load / will this scale" — model the expected and worst-case load, load-test against the real bottleneck, and prove the system holds (or autoscales) before traffic does it for you.
---
# Plan capacity and prove it scales — find the breaking point before your users do

"Will it hold the traffic?" is one of the most common questions put to an infra engineer, and the wrong answer
is **"it should be fine."** A system you have never driven to its limit has an unknown limit — and you will
discover it during the launch, at the worst possible moment, as an incident. The job is to find the breaking
point *deliberately, in advance,* and to know the system either has the headroom or scales into it.

## Model the load first
- **Name the expected load and the worst case.** Requests/sec, concurrent users, payload sizes, the spike shape
  (a marketing email or a flash sale is a near-vertical step, not a ramp). The worst case — a thundering herd, a
  retry storm, a cache-cold cold-start — is usually 5–50× the average, not 2×.
- **Find the bottleneck, don't guess it.** The limit is almost never CPU. It's the database connection pool,
  a downstream rate limit, a single-threaded queue consumer, lock contention, disk IOPS, or a third-party
  quota. Reason about which resource saturates *first* (USE: utilization/saturation/errors per resource).
- **Little's Law sanity check.** Concurrency ≈ throughput × latency. If a dependency adds latency under load,
  concurrency (and connection/thread pools) balloons — model it before it surprises you.

## Prove it (don't assume it)
1. **Load-test against a realistic target** — production-like data volume and a copy of real traffic shape, not
   a flat hammer on one endpoint. Ramp to expected load, then past it, until something breaks. **A load test
   that never breaks the system told you nothing** — you must find the knee of the curve.
2. **Watch what degrades and how.** Does it degrade gracefully (slower, sheds load, returns a clear error) or
   catastrophically (falls over, corrupts, cascades)? Graceful degradation is a design property you verify here.
3. **Verify the scaling actually works.** If you're relying on autoscaling, *prove it scales out fast enough for
   the spike shape* — autoscaling that takes 5 minutes to add capacity does not save you from a 30-second flash.
   Pre-warm / pre-scale for known events. Confirm there's no hard ceiling (instance quota, IP exhaustion, a
   stateful component that can't scale) hiding behind the elastic tier.

## Build for load, not just test for it
- **Backpressure and load-shedding** — under overload, shed or queue rather than collapse; a bounded queue and
  a fast "try later" beats an unbounded queue that OOMs and takes everything with it.
- **Timeouts, retries-with-jitter, circuit breakers** — a retry storm with no jitter is how a small blip
  becomes a self-inflicted DDoS. Bound every outbound call.
- **Keep headroom.** Run with margin below the proven limit; the gap between "average load" and "the limit" is
  your safety budget — don't let `tame-cloud-cost` right-size it to zero.

## The discipline
- Capacity is a number you've **measured**, not a feeling. "It handled it last year" is not a plan for this
  year's traffic.
- Stage the launch by load the way you stage a deploy by blast radius (`ship-progressively`) — ramp real
  traffic where you can, so the spike is gated, not all-at-once.
- This composes with `software-architect` (who owns whether the architecture *can* scale — a stateful singleton
  can't) — you prove the operable limit and flag the design ceiling; you don't redesign the system.
