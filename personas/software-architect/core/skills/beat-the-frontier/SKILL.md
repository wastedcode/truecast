---
name: beat-the-frontier
description: Use before any substantive design or brief and as the last pass before handing it over — your version of the engine's "beat the frontier" loop. Name who designs this kind of system best today, set the bar above them, pre-empt every ask a demanding reviewer would make (fit with what exists, concrete records walked through the lifecycle, every parameter justified, failure modes, simplicity), and critique the design as that architect would until nothing material is left.
---
# Beat the frontier — architecture

A tidy diagram is the floor. The bar is **the best architect designing this kind of system today, and past
them** — the user should never have to design it themselves, or come back with "how does this fit what we
already have?", "why one hour, what else did you consider?", "every time you propose tables I find a bug",
or "isn't this over-engineered?". Every one of those is an ask you could have answered first. You can trace
every record, failure mode and interleaving that a human architect has to skip. Do that.

## 1. Name the frontier (seeds as of 2026-10 — search for who's leading now before you rely on them)
| Kind of work | Who sets the bar | Look at |
|---|---|---|
| Distributed-systems failure design | Marc Brooker (AWS); AWS Builders' Library authors | metastability posts; shuffle sharding, static stability |
| Decisions written in public | Oxide RFDs (Bryan Cantrill) | a recent RFD's options + rejected alternatives |
| Patterns + evolution | Martin Fowler / Thoughtworks; Neal Ford & Rebecca Parsons | *Building Evolutionary Architectures*, fitness functions |
| Architecture as a business conversation | Gregor Hohpe | *The Software Architect Elevator* |
| Formal analysis of protocols/data | Hillel Wayne; Jack Vanlightly | TLA+ / model write-ups |
| Data-system fundamentals | Martin Kleppmann | *Designing Data-Intensive Applications* |
Cover every leader relevant to *this* problem. Read the relevant piece and write down the specific move you're
applying.

## 2. What their work does that competent work doesn't
- Drivers ranked; every trade-off named against them; the rejected options recorded (ADR).
- Failure mechanisms designed explicitly: isolation, static stability, backoff with jitter, load shedding,
  resumable stages.
- Constraints turned into automated fitness functions, not prose.
- The data model and its ownership decomposed before the services.
- One code path per capability across every surface.
- Boring technology by default; novelty spent once, on purpose.

## 3. Table stakes — the canon you already exceed
Kleppmann, *DDIA* · AWS Builders' Library · Hohpe · Ford et al., *Building Evolutionary Architectures* ·
Nygard's ADRs · McKinley, "Choose Boring Technology". Meeting these is the entry ticket, not the bar.

## 4. Where you go past them
- **The composite, first:** one deliverable that carries the signature move of *every* leader in §1 at
  once — something none of them could produce alone — and then the coverage below, which none of them can
  afford. Beating any one of them is a miss.
- Walk **concrete records** through **every** lifecycle state, not one happy path.
- Enumerate **every** failure mode, dependency limit and state transition.
- Check the design against **every** existing store, job and module it touches.
- Write the model or fitness function the human would skip as too expensive.

## 5. The asks to pre-empt (do these before anyone asks)
- **Fit with what exists:** inventory the existing stores, jobs, modules and prior decisions the design
  touches; reuse/extend/diverge per concept (`survey-prior-art`). Never propose a second database, user,
  worker or service without saying why the existing one can't do it.
- **Walk ~10 concrete records** through the whole lifecycle — created, updated, silent for months,
  expired, retried mid-crash, delayed, duplicated — and show where each lands (`model-the-state-machine`).
- **Justify every parameter:** each number (interval, batch size, retention, timeout, count) names the
  alternatives and why this one; test it where it's cheap.
- **How practitioners do it:** check what the field actually does (vendor docs, published limits, prior
  art) before setting a rule; serve the goal, not a literal reading of it.
- **Decoupled, resumable stages** by default for pipelines: capture vs process, per-item status, restart
  safe, oldest-first.
- **Simplicity pass:** delete every component, table, rule and state the drivers don't demand; say what
  you removed (`design-the-simplest-thing-that-lasts`).
- **Hard constraints first:** the constraints and decisions already ratified, listed up front; any option
  that breaks one is flagged, not built.
- **Gate before spend:** no run that costs money or touches credentials before the design is approved.
- **Explain simply:** a diagram and a few plain lines; decisions for the founder as a short numbered list
  with your recommendation.

## 6. The critique pass — be the architect you named
Review it in their voice: Where would Brooker see a metastable retry storm? What would an Oxide RFD
reviewer say about the rejected options? What fitness function would Ford demand? Would Hohpe's founder
understand the cost-value-risk case? Then run `review-the-design` and `design-for-failure`. Fix, repeat
until a pass finds nothing material.

## 7. The Frontier check (end of the deliverable, ≤6 lines)
- **Benchmark:** every leading exemplars/practices you held it against (named).
- **Where this beats each of them:** concretely, one line per leader.
- **Covered:** the founder's constraints + the pre-empted asks above (any judged N/A, and why).
- **Critique caught:** what the last passes found and you fixed.
- **Verified:** records walked, prior-art inventory, parameters tested, limits sourced.
