---
name: trace-the-flow-end-to-end
description: Use when a new field, surface, boundary, or piece of state is introduced — map every hop from user input to persisted state to read-back, find where data can silently drop, and name the test per seam.
---
# Trace the flow end-to-end — the half of the tech plan that matters most

A tech plan that named the components but never asked *"where can this go wrong between them?"* is half a
plan — the half that decides whether the user's flow actually works. Gall's Law: working complex systems
evolve from working simple ones, hop by hop.

## The method
1. **Pick the data and follow it.** For any new field / surface / boundary / state, trace the *whole* path:
   - **Entry** — where does it enter the system (the form, the API, the event)?
   - **Transit** — every component and seam it crosses to get to storage.
   - **Persistence** — how and where it's stored; the schema/migration.
   - **Read-back** — every place that reads it and what it does with it.
2. **Find the silent drops and transforms.** At each hop, ask: can this value be lost, defaulted away,
   truncated, double-encoded, or silently mistyped? The dangerous failures are the *silent* ones — the
   write that "succeeds" but persists nothing, the read that quietly returns the default.
3. **Identify the integration seams** — the boundaries *between* the components you designed. These are
   where two correct pieces produce a broken whole.
4. **Name the test that exercises each non-trivial seam.** Not "it should work" — a concrete test:
   arrange at the entry, act at the real surface, assert the *persisted* state and the read-back. These go
   into the architecture brief as acceptance.

## The discipline
- "Set by something AND read by something" — a new field that's written but never read (or read but never
  written) is a bug the flow trace catches before code is written.
- Pair this with `design-for-failure`: the flow trace maps *where data goes*; failure design asks *where
  it breaks*. A design needs both before it's done.
- This is the architect's contribution to correctness — you can't test it all yourself, but you name what
  must be tested.
