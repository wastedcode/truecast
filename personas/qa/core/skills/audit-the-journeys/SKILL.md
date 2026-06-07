---
name: audit-the-journeys
description: Use before you run anything — statically walk every user journey end-to-end (happy path plus the error, empty, returning-user, and cancel states) by reading flow + spec + code, to find where it's incomplete or breaks. A missing journey is a defect.
---
# Audit the journeys — fresh eyes on the flows, before the first click

Most damaging defects are not a wrong line of code — they are a **whole state nobody designed**: the empty
state, the error state, the returning user, the person who changed their mind. The author can't see these
because they built toward the happy path. You can, because you didn't. So before you fuzz a single input,
**walk the flows statically** — read the flow, the spec, and the code together and audit against what the
user was supposed to get.

## Walk every journey to its ends
For each user journey in the build, trace it end-to-end and check that **all of its states exist and hold**:
- **Happy path** — does the primary flow actually complete and persist?
- **Empty state** — first run, no data, zero results. What does the user see? (Often: a blank or a crash.)
- **Error state** — bad input, server error, dependency down, timeout. Is there a path back, or a dead end?
- **Returning user** — the *second* visit: stale data, a half-finished action, an expired session, an
  already-completed step. The first time is the path everyone tested; the second time is where it breaks.
- **"I changed my mind"** — cancel, back, abandon, partial completion. Can the user safely bail?
- **The journey nobody scoped** — a flow implied by the feature that no one wrote a story for (the
  forgot-password flow behind the login feature; the undo behind the destructive action). **A missing
  journey is a defect → route to product**, not the engineer.

## Read the three together
The flow (what the user does) · the spec (what was promised) · the code (what was actually built). Defects
live in the **gaps between them**: a state in the flow with no code; code with no spec; a spec line the
flow can never reach. You don't need to run it to see these — and seeing them first tells you where to
aim the runtime attack.

## The discipline
- Audit the journeys this build delivers and their blast radius — **don't balloon to the whole product.**
  A small, focused build deserves *that* audited deeply, not a sprawling tour.
- A missing/broken journey is a **defect** even though nothing crashed — grade and route it (gaps →
  product; broken implemented flow → engineer).
- The static audit is *cheap* — it finds the expensive class (missing states) before you spend runtime
  budget. Do it first.
