# Architecture foundations — reference

The craft and authorities the skills lean on. Read when a structural call is load-bearing.

## What architecture is (Fowler, Booch)
- Architecture is *"the decisions that are hard to change"* (Fowler) — *"the significant decisions, where
  significant is measured by the cost of change"* (Booch). Your job: make *few* of those, make them right,
  keep their number small.
- *"An architect's value is inversely proportional to the number of decisions you make"* (Fowler). You add
  value by **removing** architecture — eliminating irreversibility, keeping the system soft.
- Great = **Architectus Oryzus** (enables the team, hands-on in real code, makes change easier, writes the
  *why* down). Mediocre = **Reloadus** (sole bottleneck, locks decisions in early, ivory-tower abstractions
  whose feasibility was never tested).

## The two laws (Richards & Ford, *Fundamentals of Software Architecture*)
- **First Law: everything is a trade-off.** *"If you think you've found something that isn't a trade-off,
  you just haven't found it yet."* Never sell a "best" design — sell the best *set* of trade-offs, named.
- **Second Law: why is more important than how.** A successor can read *how* the structure works from the
  code, but not *why* it was chosen over the alternatives — that's what the ADR preserves.
- Architecture is driven by its **characteristics** (the *-ilities*: performance, scalability,
  availability, security, evolvability, testability, operability, cost...). You cannot maximize all; rank
  the few that matter for this system and consciously trade the rest.

## Simplicity & complexity (Brooks, Johnson, Ousterhout)
- **Essential vs accidental complexity** (Brooks, *No Silver Bullet*): essential is inherent in the
  problem; accidental is what we add. Add none of the accidental.
- *"Complexity is what makes software hard to change — that, and duplication"* (Johnson).
- **Deep modules, simple interfaces** (Ousterhout): much capability behind a small contract; pull
  complexity downward into the implementation so callers stay simple. **YAGNI** — no speculative
  abstraction before you have the cases.
- *Simple + scalable* = doesn't paint you into a corner; **not** built for imagined scale now. Premature
  scaling is accidental complexity with an excuse. The **gas factory** anti-pattern = a simple problem
  drowned in patterns.

## Boring technology (McKinley)
- ~**Three innovation tokens.** Boring tech wins because its *failure modes* are well understood; the cost
  of keeping a system reliable dwarfs the inconvenience of building it. Spend a token only when the boring
  option fails a ranked driver.
- A solo founder has *fewer* tokens. **AI-era revisit (2025):** AI assistants make any novel stack cheap to
  *start* and just as expensive to *keep* — a piece only the AI understands, the founder can't debug at
  2am, is a token already spent.

## Boundaries & org (Conway, Team Topologies)
- **Conway's Law:** the system comes to mirror the communication structure of the org that builds it.
  Design boundaries for the *actual* team (a solo founder ships a modular monolith); use **Inverse Conway**
  deliberately to get a different shape. Skelton & Pais (*Team Topologies*) operationalize this.
- The **distributed monolith** — services that deploy in lockstep or share a DB — is the worst of both
  worlds; microservices are a trade-off (independent deployability for distributed complexity), not a default.

## Evolutionary architecture (Ford, Parsons, Kua)
- Three legs: **incremental change**, **fitness functions**, **appropriate coupling**.
- A **fitness function** is an objective, usually automated, test of an architectural characteristic
  (dependency direction, layering, no cycles, latency budget). Protect invariants as CI tests, not docs.
- **Sell options; decide at the last responsible moment** (Hohpe) — live in the *first derivative* (how
  fast/cheap the system can change), not its static state. **Strangler fig** over big-bang rewrite (Gall:
  a from-scratch complex system rarely works).

## ADRs (Nygard, adr.github.io, Fowler)
- Shape: Title (numbered) · Status · Context · Decision · Consequences · Alternatives-rejected.
- **Immutable once accepted** — supersede with a new ADR, never silently edit; that's what makes the log
  trustworthy. Store in the repo; **link from the code seam** or it's invisible when most needed. Write one
  for one-way doors; don't ADR a two-way door.

## The architect elevator & the economics of quality (Hohpe, Fowler)
- **The architect elevator** (Hohpe, *The Software Architect Elevator*): the architect's distinctive value
  is riding between the **engine room** (code, trade-offs) and the **penthouse** (strategy, money, risk) —
  and *translating* in both directions. A technical decision unconnected to a business argument can't be
  funded or defended. Sell the design in **cost, value, and risk**, not only in -ilities.
- **Sell options** (Hohpe, real-options thinking): architecture decisions are options; an option has a
  price to buy (the work now) and a value to hold (flexibility kept). Defer to the **last responsible
  moment**; price the **cost of delay** of deciding too late vs. the carrying cost of deciding too early.
- **Is high quality worth it? / design stamina** (Fowler): internal quality is invisible to the business,
  so it's cut first — but the economic case is that good-enough design **pays back in delivery speed**
  within weeks. Quality is an investment in velocity, not a tax. Argue debt the same way: deliberate,
  dated, with a payoff trigger — never silent.

## The Hard Parts — decomposing data & distributed transactions (Richards & Ford, Newman)
- Pulling **code** apart is easy; pulling **shared data** apart is the hard part teams get wrong. The real
  coupling is the shared table / cross-boundary join, not the call graph. A boundary that still shares a
  database is a distributed monolith.
- A write spanning two owners has left ACID behind: choose **one transaction (keep them together)** or
  **eventual consistency via a saga / compensating action** with a reconciliation path. Never pretend a
  distributed write is atomic.
- **Dual-write** (same fact to two stores, no single source of truth) drifts silently — prefer one owner
  + a change feed / replica / event the others consume. (Newman, *Monolith to Microservices*: decompose
  incrementally behind a strangler fig; split the data first.)

## Production stability patterns (Nygard, *Release It!*)
- Every remote call gets a **timeout** (no unbounded wait). **Circuit breaker** stops hammering a failing
  dependency. **Bulkhead** isolates resource pools so one failure can't sink the whole. **Backpressure /
  bounded queue** sheds load instead of OOM-ing. **Idempotency key** makes retries/double-submits safe.
  **Graceful degradation** = a defined reduced mode beats a hard down. Name the *mechanism*, not just
  "be resilient."

## AI-era architecture (2026)
- LLMs are primary code readers/writers. Favour small self-contained units, explicit/verbose code, typed
  seams, and **flat abstraction** (deep inheritance/indirection degrades model reasoning most). Enforce
  with AI-aware CI linters. For AI features: isolate the probabilistic component behind a guardrailed
  boundary; make acceptance an **eval**, not "it runs."

## Sources
- Fowler — *Architecture (bliki)*, *ArchitectureDecisionRecord (bliki)*, *Conway's Law (bliki)*,
  *Who Needs an Architect?* (Architectus Oryzus). martinfowler.com
- Richards & Ford — *Fundamentals of Software Architecture* (2e); *Software Architecture: The Hard Parts*.
- Ford, Parsons, Kua, Sadalage — *Building Evolutionary Architectures* (2e); InfoQ fitness-functions.
- Booch (significance = cost of change); Brooks — *No Silver Bullet*; Johnson; Ousterhout — *A Philosophy
  of Software Design*; Gall — *Systemantics*; Hohpe — *The Software Architect Elevator* (the elevator,
  "sell options"), *Cloud Strategy*; Fowler — *Is High Quality Software Worth the Cost?* (design stamina).
- Richards & Ford — *Software Architecture: The Hard Parts* (data decomposition, sagas); Newman —
  *Building Microservices*, *Monolith to Microservices*; Nygard — *Release It!* (stability patterns).
- McKinley — *Choose Boring Technology* (+ 2025 revisit, brethorsting.com); Skelton & Pais — *Team Topologies*.
- Nygard — *Documenting Architecture Decisions*; adr.github.io.
- AI era — dasroot.net *Code for the AI Reader* (2026); O'Reilly *Signals for 2026*.
