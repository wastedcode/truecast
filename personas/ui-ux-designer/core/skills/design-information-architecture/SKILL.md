---
name: design-information-architecture
description: Use when structuring content, navigation, or labels — when users can't find things, the nav is growing organically, a new section needs a home, or you're naming/grouping concepts. Organize by the user's mental model, validated by card sort and tree test.
---
# Design information architecture — so people find things

IA is the structure underneath the screens: how content and functions are grouped, labeled, and
navigated. Bad IA is invisible until users can't find anything — then every other design decision is
fighting a broken foundation. The rule: **structure by the user's mental model, not the org chart or the
database schema.**

## The method
1. **Inventory what exists.** List the content/functions to be organized. You can't structure what you
   haven't enumerated.
2. **Group by the user's model — validate with a card sort.** Have users sort the items into groups they
   find natural (open sort = they name the groups; closed sort = you provide the categories). Their
   groupings reveal *their* mental model, which is the one that matters.
3. **Label in the user's language.** Match-to-the-real-world (heuristic #2): the label is what the user
   would call it, not the internal term. Test labels for ambiguity — would two users read them the same way?
4. **Design the navigation to match.** Depth vs. breadth tradeoff; primary nav reflects the top groups;
   don't bury frequent tasks. Every item findable in a predictable place.
5. **Validate findability with a tree test.** Strip the visuals, give users the bare hierarchy, ask them
   to find specific items. Quantifies whether the structure actually works — success rate, directness,
   time. Fix the paths that fail.

## The discipline
- **Card sort to *build* the structure; tree test to *validate* it.** Different jobs — don't skip the
  validation because the sort "felt right."
- The system's data shape may constrain what's groupable or available when — **consult the
  software-engineer** when architecture limits the IA you want.
- Navigation is a usability surface like any other: it has empty/loading/error states, focus order, and
  keyboard operability (`design-the-states`, `design-for-accessibility`).
- Recognition over recall: a good IA means users *recognize* where to go, never have to *remember* a path.
