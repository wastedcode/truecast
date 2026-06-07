---
name: design-the-boundaries
description: Use when defining modules, services, interfaces, or data ownership — or when "let's go microservices" comes up — design for cohesion/coupling and Conway's Law; refuse the distributed monolith.
---
# Design the boundaries — cohesion, coupling, and Conway's Law

The hard-to-change calls live at the **boundaries**: where modules/services split, what the interfaces
are, who owns each piece of data. Get these right and the inside can stay soft; get them wrong and every
change crosses a seam.

## The method
1. **Group by cohesion, split by coupling.** Things that change together belong together; a boundary
   should sit where coupling is genuinely low. A split that forces two "services" to deploy in lockstep
   or share a database is a **distributed monolith** — the worst of both worlds (network cost + monolith
   coupling). Don't draw it.
2. **One owner per piece of data.** Each piece of state has exactly one authoritative writer; everyone
   else reads through a contract. Shared mutable ownership across a boundary is a future incident.
   **Decompose the data, or you haven't decomposed anything** (Newman, Richards — *the Hard Parts*).
   Pulling code apart is easy; pulling *shared data* apart is the hard part most teams get wrong:
   - Find the **shared tables / joins that cross the proposed boundary** — those are the real coupling,
     not the call graph. A boundary that still shares a database is a distributed monolith wearing a
     service costume.
   - If a write must span two owners, you've left transactional consistency behind. Name the choice:
     keep them in one boundary (one transaction), or accept eventual consistency with a **saga /
     compensating action** and a reconciliation path. Don't pretend a distributed write is atomic.
   - Beware the **dual-write** (writing the same fact to two stores with no single source of truth) — it
     drifts silently. Prefer one owner + a change feed / read replica / event the others consume.
3. **Make interfaces explicit and narrow.** A boundary is a promise (Hyrum's Law: every observable
   behavior becomes someone's dependency). Keep the surface small and the contract precise.
4. **Respect Conway's Law.** The system *will* come to mirror the org that builds it. Design boundaries
   for the **actual** team — a solo founder ships a modular monolith, not 12 microservices; a two-team
   org gets boundaries that match the two teams. Use **Inverse Conway** deliberately if you want a
   different shape, but never pretend org structure won't push back.
5. **Right-size the distribution.** Default to the simplest topology (modular monolith) and split out a
   service only when a *ranked driver* demands it (independent scaling, independent deploy, isolation) —
   not because "microservices."

## The discipline
- Microservices are a trade-off, not a default — they buy independent deployability at the cost of
  distributed-systems complexity. Make the buyer pay knowingly (`weigh-the-tradeoffs`).
- A boundary or data-ownership change is hard-to-change — ADR it (`record-the-decision`).
- Boundaries are where the next decision can *defeat* an earlier one — guard them with fitness functions
  (`keep-it-evolvable`).
