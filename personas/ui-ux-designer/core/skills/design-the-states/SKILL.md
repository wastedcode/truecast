---
name: design-the-states
description: Use whenever designing any surface or component — design the full set of states, not just the happy path. The underrated trio (empty, loading, error) plus every interaction state (hover, active, focus, disabled, success) are deliberate moments, not afterthoughts.
---
# Design the states — the happy path is the easy 20%

A surface is not one screen; it's a set of states. The trio engineers cut first and AI invents worst —
**empty, loading, error** — is often the *first* thing a real user sees, and the interaction states
(hover/active/focus/disabled/success) are where the interface either feels alive or feels broken. Design
all of them deliberately.

## The underrated trio
**Empty state — a *moment*, not a placeholder.**
- Never "Nothing here yet 🎉." Write what the user can do next, in the product's voice, and show the
  affordance (a button, a sample, a clear path). The empty state is a first impression — often it deserves
  *more* care than the populated one.
- Bad: "No items yet — get started!" Good: "Nothing on the board. Talk one through →"

**Loading state — skeleton over spinner.**
- **Skeleton** when the shape is known (a list, a card grid) — the user sees structure forming.
- **Spinner** only for indeterminate, short, modal work (saving, sending).
- Anything **<300ms**: show *no* loading state — the flash is worse than the wait.

**Error state — name what's wrong + the next step.**
- Specific over generic: not "Something went wrong" but "We couldn't reach the server — retry, or check
  your connection." Plain language, names the cause, gives a way out (`write-ui-microcopy`, heuristic #9).

## Every interaction state
For each interactive element, design: **default · hover · active/pressed · focus · disabled · loading ·
success/error.**
- **Hover** reveals an affordance or carries information — never does nothing.
- **Active/pressed** is visible (`scale(0.96)` tactile feedback).
- **Focus** is present, visible, quiet, consistent — keyboard users depend on it (`design-for-accessibility`).
- **Disabled** is distinguishable from inactive and, if non-obvious, explains *why* it's disabled.
- **Success/error** confirm the result (visibility of system status, heuristic #1).

## The method
1. When you `frame-the-flow`, every node already named its empty/loading/error branch — now design each.
2. For every component, enumerate its interaction states and design them explicitly; a component spec
   without its states is half a spec.
3. Test the states with real conditions: empty account, slow network, forced failure, longest string.

## The discipline
- "An empty/loading/error in the diff" is part of the ship bar — a happy-path-only design is not done.
- These states carry the product's voice and trust more than the happy path does; they're where users are
  frustrated or lost, so they deserve the most care, not the least.
