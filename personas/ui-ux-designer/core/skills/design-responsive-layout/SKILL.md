---
name: design-responsive-layout
description: Use whenever a surface will be seen on more than one screen size or input — which is almost always (62%+ of web traffic is mobile). Design mobile-first content priority, then the breakpoint range and the touch-vs-pointer differences; the layout is a range, never one fixed canvas.
---
# Design the responsive layout — the surface is a range, not a canvas

A screen is not one width. The same surface is a phone in one hand on a flaky network, a tablet, a laptop,
an ultrawide — and **62%+ of web traffic is mobile**. Designing one fixed desktop canvas and "letting it
reflow" is how the real majority of users get the broken version. The discipline (Wroblewski, *Mobile
First*): **design for the smallest, hardest context first, then progressively enhance up** — because mobile
constraints (tiny screen, drop-out network, divided attention) force you to prioritize the content and the
one job that matters. What survives the phone is what mattered.

## The method
1. **Prioritize content, smallest screen first.** List everything on the surface, then rank ruthlessly:
   what is the *one* job here? On the phone you have room for the essential and almost nothing else — that
   forced ranking is the gift. Decide what's primary, what's secondary, what gets disclosed on demand
   (progressive disclosure), what's cut. Design *that* layout first.
2. **Then enhance up the breakpoint range.** As width grows, don't just stretch — reveal secondary content,
   move from stacked to multi-column, surface navigation that was behind a menu, widen the measure to the
   ~60–75ch cap (not the full viewport). Each breakpoint is a *content* decision (what shows / how it's
   grouped), not just a pixel width. Set breakpoints where the *content* breaks, not at device-model widths.
3. **Design the real breakpoints, not just two mockups.** At minimum design the small (≈360–390), the
   medium (≈768), and the large (≈1024–1280) — and check the in-between widths don't fall apart. The
   awkward 600–760 "tablet/large-phone" band is where layouts most often break.
4. **Touch vs. pointer is a real fork, not a width.** Touch targets ≥44×44 with spacing (fat fingers, no
   hover); hover affordances must have a tap/focus equivalent (you cannot hover on a phone); reachability —
   put primary actions in the thumb zone (bottom), not a top-corner that needs a hand shuffle; respect safe
   areas/notches. Pointer gets density and hover; touch gets size and reach.
5. **Reflow, don't sidescroll.** Content reflows to a single column on small; **no horizontal scroll**
   (except deliberate carousels); text reflows at 320px / 200% zoom without loss (WCAG 2.2 reflow —
   `design-for-accessibility`). Tables are the classic trap — design the small-screen representation
   (stacked cards, priority columns), don't shrink a 7-column table to 360px.
6. **Test the extremes with real content.** The longest plausible string on the narrowest screen; the empty
   and error states at every breakpoint (`design-the-states`); the slow network the phone user actually has.

## The discipline
- **Mobile-first is content-first.** It's not "shrink the desktop" — it's decide what matters when you have
  no room, then add as you get room. The reverse (desktop-first, then cram) ships a bloated phone view.
- "Responsive breakpoints" is one of the three things AI-generated UI reliably **misses** (with a11y and
  edge states) — so this is core to the quality-gate role (`design-the-ai-interaction`): check every
  breakpoint of AI output, not just the desktop screenshot it proudly returns.
- The breakpoint logic and container/grid live in the system as tokens, not re-derived per surface
  (`build-on-the-design-system`); consult the **software-engineer** on the implementation (container
  queries, fluid type, the grid system actually in the codebase).
- Every state has a layout at every breakpoint — a surface isn't done until empty/loading/error hold on the
  phone too (`design-the-states`, `frame-the-flow`).
