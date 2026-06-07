# UX/UI craft foundations — reference

The craft the skills lean on. Read when a design decision is load-bearing.

## Usability is the floor (Nielsen, Norman)
- **You are not the user.** The thing obvious to you, who designed it, is not obvious to the person seeing
  it cold. Design from evidence (`research-the-user`, `usability-test`), not introspection. (Nielsen)
- **Nielsen's 10 usability heuristics** (1994, still the field's most-used checklist) — the audit reflex
  (`heuristic-evaluation`): visibility of system status · match to the real world · user control & freedom
  (undo/exit) · consistency & standards · error prevention · recognition over recall · flexibility &
  efficiency · aesthetic & minimalist design · help users recover from errors · help & documentation.
- **Norman's principles** (*The Design of Everyday Things*): **affordances** (what an object lets you do),
  **signifiers** (the perceivable cue that an affordance exists), **mapping** (controls match their
  effects spatially), **feedback** (every action gets a perceivable response), **constraints** (limit
  actions to prevent error), and the **gulfs of execution & evaluation** (the gap between intent→action
  and action→understanding-the-result). A discoverable, understandable interface closes both gulfs.
- **Discount usability** (Nielsen): cheap, fast, frequent beats slow and perfect. **Five users find ~85%
  of usability problems** — so run three small tests + fix between, not one big one. Heuristic-evaluate to
  clear the obvious, then usability-test for the surprises (the methods are complementary).
- **The right method for the question** (NN/g): generative/discovery research *before* designing
  (what/who/why); evaluative research (usability test) *after* (does it work). Card sort builds IA, tree
  test validates it. Don't use a discovery method to evaluate or vice versa.

## Interaction & information design
- **Microinteractions** (Saffer, *Microinteractions*): trigger → rules → feedback → loops/modes. "The
  difference between a product that's tolerated and one that's beloved" lives in these details
  (`design-microinteractions`).
- **Motion conveys meaning or it's noise.** Default to none; CSS transitions for interactive (cancelable)
  states, keyframes for one-shots; subtle exits preserve spatial context.
- **Information architecture**: structure by the *user's* mental model (card sort), label in the user's
  language (match-to-real-world), validate findability (tree test). JTBD (Christensen, Ulwick) frames the
  *job* the user is hiring the product for — design the flow around the job, not the feature.
- **Fidelity is a cost/learning tradeoff** — low-fi validates flow cheaply and keeps feedback on the idea;
  high-fi anchors on polish and is wasteful for an unvalidated direction (`prototype-at-the-right-fidelity`).

## Composition: visual hierarchy + Gestalt (`compose-the-layout`)
- **Visual hierarchy** = arranging elements to control the order information is processed. Levers: scale,
  contrast, weight, color, position, and **whitespace**. One focal point per view; rank everything into a
  few levels (primary/secondary/tertiary); size+weight before color. The squint test: what do you see
  first — is it what should win?
- **Scan patterns**: F-pattern for text-dense layouts, Z-pattern for sparse/marketing; place key elements
  where the eye already goes.
- **Gestalt principles** (how the eye organizes): **proximity** (closeness groups — spacing groups more
  reliably than boxes, so reach for whitespace before a card), **similarity** (alike = same kind),
  **common region/enclosure** (shared bg/border binds — sparingly), **continuity/alignment** (shared edge =
  related + a path the eye follows). Don't-make-me-think (Krug): a self-evident layout needs no thought.
- **Grid + whitespace as structure**: a grid is the skeleton (columns, consistent gutters, alignment);
  whitespace is structure not waste; **progressive disclosure** — essential now, advanced on demand; one
  primary action per surface.

## Responsive / mobile-first (`design-responsive-layout`)
- **Mobile-first = content-first** (Wroblewski, *Mobile First*): design the smallest, hardest context first
  (tiny screen, drop-out network, divided attention) — the constraint forces ruthless content priority —
  then **progressively enhance up** the breakpoint range. The reverse (desktop-first, then cram) ships a
  bloated phone view. **62%+ of web traffic is mobile** (2025).
- A surface is a **range**, not one canvas: design at least small (~360–390) / medium (~768) / large
  (~1024–1280) and check the awkward in-between band (~600–760). Set breakpoints where the *content* breaks.
- **Touch vs. pointer** is a real fork: touch targets ≥44×44 with spacing, no hover (every hover affordance
  needs a tap/focus equivalent), reachability/thumb-zone, safe areas. **Reflow, never sidescroll**; text
  reflows at 320px / 200% zoom (WCAG 2.2 reflow). Tables need a designed small-screen representation.

## Accessibility is design, not a dev tax (W3C WCAG 2.2)
- **~80% of accessibility issues are design decisions** (contrast, hierarchy, target size, focus order,
  copy, labels) made before code. It's the designer's job, up front.
- **POUR**: Perceivable, Operable, Understandable, Robust.
- **WCAG 2.2 AA = the floor** (and the legal bar: EAA, US Section 508, Canada AODA). Key numbers: text
  contrast **4.5:1** (large text / UI components **3:1**); target size **≥24×24px**; full keyboard
  operability with visible focus and no traps; never rely on color alone; real labels and alt text.
- The most common failures for 5+ years: low-contrast text, missing alt text, empty links/buttons,
  missing form labels — **94.8% of home pages had WCAG failures in 2025, ~51 errors/page**. The bar is
  routinely missed; designing it in up front is the fix.
- Most accessibility fixes improve the product for *everyone* — clear focus, good contrast, big targets,
  plain errors. Not a tax; the floor of usable.

## The craft / anti-slop bar (Impeccable, Anthropic frontend-design, Krehel)
- **Never contemporary AI slop.** Named anti-patterns (`refuse-ai-slop`): purple gradients, Cardocalypse,
  Inter-everywhere, indigo-600, rounded-2xl-on-everything, Lorem empty states, gradient text, generic
  CTAs, animated-everything. Name the anti-pattern; propose the specific antidote.
- **The polish layer** (`polish-the-interface`): tabular nums on dynamic numbers, optical (not geometric)
  alignment, concentric border radius (outer = inner + padding), shadow-for-elevation /
  border-for-structure, `scale(0.96)` press, visible-but-quiet focus, type hierarchy via weight+size.
  These values are exact on purpose — the consistency *is* the feel.
- **The honest gate:** *would Linear / Vercel / Raycast / Apple ship this?* Steal the *pattern* (Linear's
  density, Vercel's tabular-nums + monochrome+accent, Raycast's command surface, Apple's optical alignment
  + restraint), never the look.
- **Design in the system** (Frost, atomic design): tokens (subatomic single source of truth) → components
  → patterns. Extend in place; one-off styling drifts into slop (`build-on-the-design-system`).

## Sources
- Jakob Nielsen / Don Norman — Nielsen Norman Group: 10 Usability Heuristics; "When to Use Which UX
  Research Method"; discount usability / 5-user rule (nngroup.com).
- Don Norman — *The Design of Everyday Things* (affordances, signifiers, mapping, feedback, gulfs).
- Dan Saffer — *Microinteractions: Designing with Details*.
- W3C — *Web Content Accessibility Guidelines (WCAG) 2.2* (w3.org/TR/WCAG22); CorsoUX / Bird Eats Bug
  designer guides; "80% of a11y is design"; 2025 WebAIM-style failure stats.
- Brad Frost — *Atomic Design* + design tokens (atomicdesign.bradfrost.com, bradfrost.com).
- Christensen / Ulwick — Jobs To Be Done.
- Luke Wroblewski — *Mobile First* (content-first, progressive enhancement, touch constraints); lukew.com.
- Gestalt psychology + Steve Krug *Don't Make Me Think* — visual hierarchy, grouping, scan patterns
  (F/Z-pattern); Figma / NN/g / UX Tigers Gestalt references.
- Impeccable (impeccable.style), Anthropic frontend-design skill, Krehel make-interfaces-feel-better —
  anti-slop + polish craft.
