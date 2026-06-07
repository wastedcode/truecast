# Trade-off & evaluation methods — reference

The structured methods behind `define-the-drivers`, `weigh-the-tradeoffs`, `design-for-failure`,
`keep-it-evolvable`, and `write-the-architecture-brief`.

## ATAM — Architecture Tradeoff Analysis Method (SEI: Kazman, Klein, Clements)
Scenario-based evaluation of how well an architecture meets — and trades off — its quality attributes.
The useful machinery to borrow even when you're not running a formal ATAM:
- **Utility tree.** Decompose "quality" into concrete, *prioritized, measurable* scenarios. Root =
  utility; branches = characteristics (performance, availability, modifiability, security...); leaves =
  scenarios with a stimulus, a response, and a measure ("a new payment provider is added in < 1 day with
  no checkout change"; "p99 < 200ms at 10× load"). Prioritize each leaf (importance × difficulty).
- **Architectural approaches** are then examined against the high-priority scenarios.
- The outputs that matter:
  - **Sensitivity point** — a decision strongly affecting one characteristic (one knob moves latency a lot).
  - **Trade-off point** — a decision that's a sensitivity point for *two+ conflicting* characteristics
    (the cache: latency ↑, consistency ↓). The real architectural choices live here.
  - **Risks / non-risks** — decisions that endanger a scenario vs. those confirmed safe.
Lightweight version for a small team: write the top ~5 prioritized quality scenarios, list 2-3 approaches,
mark the sensitivity/trade-off points, recommend with the cost. That *is* `weigh-the-tradeoffs`.

## Risk storming (design-for-failure)
A deliberate, structured attack on the design before reality runs it. Walk each component/seam and probe:
- **Load** — 10× traffic: bottleneck, unbounded queue, O(n²), thundering herd.
- **Partition / dependency-down** — external service times out / returns garbage; DB unreachable.
- **Restart / crash mid-operation** — partial state; is recovery idempotent?
- **Concurrency** — two writers, double-submit, the second-time case, the race.
- **Boundary inputs** — empty / malformed / oversized / malicious at each seam.
For each meaningful risk decide **resilient (retry/fallback/degrade) vs fail-fast (loud, clean error)** —
a silent wrong answer is worse than a clean failure. When resilient, name the **mechanism** (Nygard,
*Release It!*): timeout on every remote call · circuit breaker · bulkhead · backpressure/bounded queue ·
idempotency key · graceful degradation. Don't insure against impossible failures (over-engineering); spend
resilience where the blast radius justifies it. Name a test per handled risk.

## The economic case (make-the-economic-case)
Translating the technical decision into the business argument — the architect-elevator skill.
- **Map each ranked -ility to money / time-to-market / risk** ("p99 latency" → "carts that time out at
  next quarter's traffic"). The business funds consequences, not characteristics.
- **Price the option**: cost to buy (work now) · value to hold (flexibility kept) · **cost of delay**
  (what waiting costs). Rough and honest beats false precision — "days vs weeks," "small vs large blast
  radius."
- **Both costs of being wrong**: over-build (time-to-market, carrying complexity) vs under-build
  (irreversible-wrong, the rewrite). Give the founder a real two-sided choice.
- **Deliberate debt**: what shortcut, what it buys, repayment cost, the **trigger** to repay. ADR it.
- **Design stamina** (Fowler): internal quality pays back in delivery speed within weeks — argue quality
  as an investment in velocity, not a tax.

## C4 model (Simon Brown) — communicating structure
Four altitudes; show only the one(s) the audience needs:
1. **Context** — the system + the people/systems it interacts with (the big picture for a new initiative).
2. **Container** — the deployable/runnable units (apps, services, DBs) and how they communicate.
3. **Component** — the major modules inside a container (the common altitude for a feature brief).
4. **Code** — class/function level; rarely worth drawing by hand — let the IDE/agent generate it.
One clear diagram per altitude beats a UML wall. The model the engineer and founder can hold in their
heads is the deliverable.

## Fitness-function catalog (keep-it-evolvable)
Architectural invariants worth making executable in CI rather than trusting to discipline:
- **Dependency direction / layering** — domain doesn't import infrastructure; no UI → DB shortcut.
- **No cycles** between modules/packages.
- **Boundary enforcement** — the forbidden import doesn't compile; a service can't reach another's DB.
- **Performance budget** — a latency / bundle-size / query-count assertion that fails the build.
- **Operational/security gates** — no committed secret, required security headers present, public API
  schema is backward-compatible.
- **AI-era** — function-length cap, strict typing, docstring/contract presence (keeps agent output honest).
A rule in CI can't be unknowingly defeated by the next decision; a rule in a doc will be.

## The architecture brief checklist (write-the-architecture-brief)
A complete brief carries: **structure** (right C4 altitude) · **exact contract/interface** (signatures,
types, error behavior) · **acceptance** (checkable, incl. failure-mode + seam tests) · **file/seam
pointers** (where it plugs into this codebase) · **illustrative code** for the tricky part only · **the
why** (linked ADRs). Test of a good brief: the engineer starts building without re-deriving the design.

## Sources
- Kazman/Klein/Clements (SEI) — *ATAM: Method for Architecture Evaluation* (sei.cmu.edu).
- Ford/Parsons/Kua — *Building Evolutionary Architectures* (fitness functions); InfoQ fitness-functions.
- Simon Brown — *The C4 model for software architecture* (c4model.com).
- Nygard / adr.github.io — ADR templates & operational patterns.
