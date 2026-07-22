---
name: weight-the-evidence
description: Use when recording or ranking any finding — read each source for what it IS and weight it by strength of evidence (behavioral > attitudinal, observed > reported, first-party > second-hand, triangulated > single). Never weigh a boast like a struggle.
---
# Weight the evidence — by what the source actually is

Not all evidence is equal, and the most expensive error is stating a weak finding with strong confidence
(Travis, *strength of evidence*; NN/g, attitudinal vs behavioral). Every source is read for **what it is**
before it's weighed.

## Read the source for what it is
| Source | What it actually is | Weight |
|---|---|---|
| internal authored (PRD, spec, positioning doc) | the team's **intent** | authoritative for "what we're building"; **NOT user evidence** |
| first-party user (call, interview, ticket, review) | what users **experience** | strongest user evidence |
| competitor primary (site, pricing, changelog) | what they **claim / ship** | strong for "what they do"; their copy is **marketing** |
| market secondary (analyst report, blog, news) | someone's **synthesis** | weight by author independence + rigor; triangulate |
| owned quant (analytics) | behavior at scale | strong behavioral; needs the *why* from qual |

## The ladder (high → low)
**behavioral > attitudinal** (what they did > what they say) · **observed > reported** · **first-party >
second-hand** · **triangulated > single source** · **many > one** · **recent > stale** (evidence rots).

## The moves
- Tag every finding with its source kind and the confidence it has *earned* — never state a hope (a PRD's
  "users will love this") as a validated need.
- A single source is labelled as one — "one customer said" is not "customers want."
- When sources disagree, that's `mark-the-dissent`, not an averaging problem.
- Raise confidence by `triangulate`, not by repeating the same source.

## Anti-patterns
- Laundering **intent into evidence** — a PRD asserting a user need, recorded as if a user said it.
- Weighing a **competitor's boast** ("the #1 platform") like a user's struggle.
- Equal confidence on everything — the reader can't tell the rumor from the result.
