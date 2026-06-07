---
name: frame-the-flow
description: Use before drawing any screen — when asked to "design a page/feature/screen," map the user's task end to end (entry, happy path, branches, every empty/loading/error/edge state, exit) so the screens fall out of the flow, not the other way round.
---
# Frame the flow — design the journey, then the screens

The most common design failure is starting at the screen. A screen is a *frozen frame* of a task; if you
design the frame before the task, you design the happy path and discover the rest in production. Start
with the **flow**: the sequence of states a user moves through to get the job done. The screens fall out
of it.

## The method
1. **Name the job and the actor.** What is the user trying to accomplish, and who are they (their
   context, device, expertise)? One sentence: "A new user wants to connect their repo so they can see
   the first build." If the job is fuzzy, that's a product question — `research-the-user` or consult the
   product-manager before you design.
2. **Map the entry points.** How does the user *arrive* at this flow? (Deep link, nav, empty state of
   another surface, an error from elsewhere.) A flow with one assumed entry breaks for the other three.
3. **Walk the happy path as discrete states.** Each step = a state with an input and a next step. Keep
   steps minimal — every step is a chance to drop off.
4. **Branch every decision and failure.** At each step ask: what can go wrong here? No data yet (empty),
   data loading (loading), the call failed (error), invalid input, permission denied, the slow network,
   the back button, the refresh mid-flow. **These branches are where real users live** — design them now,
   not later (`design-the-states`).
5. **Define the exit + the loop.** Where does success land them? What do they do next? Does the flow
   feed back into itself (continuous use) or complete once?
6. **Now lay out the screens** — each meaningful state gets its frame; shared chrome is consistent across
   them. The flow map *is* the spec for what to design.

## Walk the temporal journey — hour-1, day-1, week-10
A flow isn't designed once; the *same* user is a different person at three points in their life with the
product, and a surface tuned for one fails the others. Walk all three as distinct states with distinct
designs:
- **Hour-1 (first run).** Zero context, empty everything, doesn't know what's possible or what to do
  first. Needs orientation, a guided first action, generous empty states that teach (`design-the-states`),
  and sensible defaults so nothing must be configured to start. The cost of confusion here is abandonment.
- **Day-1 (returning).** Has done it once, building a habit, wants to *resume* — pick up where they left
  off, repeat the core action fast, find the thing they made yesterday. Needs recall→recognition (history,
  recents, saved state) and the friction stripped out of the path they already understand.
- **Week-10 (power user at scale).** Lives in the tool daily, has *volume* (hundreds of items, many
  projects), and the hour-1 hand-holding is now in the way. Needs density, keyboard/shortcut paths, bulk
  actions, search/filter, configurable defaults, and a surface that stays legible at scale — the empty-state
  teaching collapses, the data-dense view expands. What scales the onboarding usually breaks the power user
  and vice versa; design both, don't pick one.

Design tension: the affordances that orient hour-1 (tips, empty-state guidance, conservative defaults) are
clutter at week-10; the density that serves week-10 (terse, packed, shortcut-driven) is bewildering at
hour-1. Resolve it deliberately — progressive disclosure, dismissible guidance, scale-aware layouts — not
by averaging into a flow that serves nobody.

## The discipline
- **You are not the user** (Nielsen). The flow that's obvious to you, who built it, is not obvious to
  someone seeing it cold — validate with `usability-test`, don't assume.
- Count the steps and the decisions; **minimize both**. Every extra step and every extra choice is
  friction and a drop-off.
- A flow that only has a happy path is half-designed. The empty/loading/error states are not edge cases —
  they are the *first* thing a real user often sees.
- When the data shape constrains the flow (what's available when, what's expensive to fetch), **consult
  the software-engineer** before committing to a sequence the system can't deliver.
