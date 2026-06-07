---
name: design-microinteractions
description: Use when designing motion, feedback, or any single interactive moment (a toggle, a like, a save, a panel opening). Design the microinteraction deliberately (trigger → rules → feedback → loops) so motion conveys meaning; default to none and add only where it carries information.
---
# Design microinteractions — the details users feel

A microinteraction is a single contained moment — toggling a setting, liking a post, the save confirming,
a panel opening. They're "the difference between a product that's tolerated and one that's beloved"
(Saffer). But motion is a tool, not decoration: **motion conveys meaning, or it's noise.** Default to
none; add only where it carries information.

## The anatomy (Saffer's four parts)
1. **Trigger** — what initiates it (user action: click/hover/drag; or system event: a notification, a
   threshold reached).
2. **Rules** — what happens and in what order; what's possible and what's not.
3. **Feedback** — what the user perceives (the visual/motion/sound that says "it worked"). This is
   visibility of system status (heuristic #1) at the micro scale.
4. **Loops & modes** — what happens over time / on repeat (does it remember, escalate, change state).

## When motion earns its place — and when it's noise
**Earns it:** state change (a panel opens *from where*, preserving spatial context); confirmation (the row
shipped); progress (a heartbeat, sparingly); stagger (a list renders, the eye follows order).
**Noise — cut it:** decorative fade-ins on mount; animated icons carrying no info; page transitions on a
desktop SPA (users want speed, not theatre).

## The technique (exact values — consistency is the feel)
- **CSS transitions** for interactive state changes — cancelable, retargetable mid-flight. **Keyframes**
  for one-shot staged sequences only.
- **Enter:** opacity 0→1 + translateY 12px→0 + (optional) blur 4px→0; ~300ms.
- **Exit:** opacity 1→0 + translateY 0→−12px; ~150ms — faster than enter, but **never zero** (exits
  preserve spatial context; vanishing is jarring).
- **Stagger** lists/grids ~100ms between *semantic groups* (heading → description → buttons). Not 80ms.
- **Press feedback:** `scale(0.96)` on `:active`. Always 0.96.
- **Icon swap:** scale 0.25→1, opacity 0→1, blur 4px→0 (spring if available; else cross-fade both icons).
- Respect `prefers-reduced-motion` — offer a reduced/none path (`design-for-accessibility`).

## The discipline
- If removing the motion loses no information, remove it.
- Microinteractions are where polish lives, but they ride the system's motion tokens — don't fork timing
  per surface (`build-on-the-design-system`).
- A microinteraction with no feedback is a usability bug, not a missing flourish — the user can't tell it
  worked.
