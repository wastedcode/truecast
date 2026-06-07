---
name: heuristic-evaluation
description: Use to audit an interface for usability problems fast and cheap — reviewing your own or someone else's design/screen/flow without users. Walk Nielsen's 10 heuristics, name the specific violation, and propose the specific fix.
---
# Heuristic evaluation — the expert usability audit

A fast, cheap, no-users audit (Nielsen's "discount usability") against the **10 usability heuristics** —
the most widely used checklist in the field for 30 years. Name the *specific* heuristic violated and the
*specific* fix; a vague "this is confusing" doesn't carry the correction.

## Nielsen's 10 — walk every screen against these
1. **Visibility of system status.** Does the UI always tell the user what's happening? (Loading shown,
   saved confirmed, progress visible.) Silence is a violation.
2. **Match between system and the real world.** Words, concepts, order in the *user's* language and mental
   model — not internal jargon, not DB field names.
3. **User control and freedom.** A clear "emergency exit" — undo, redo, cancel, back. No dead ends, no
   irreversible action without confirmation (critical for AI actions — see `design-the-ai-interaction`).
4. **Consistency and standards.** Same thing, same word/look/behavior everywhere; follow platform
   conventions. (Leans on `build-on-the-design-system`.)
5. **Error prevention.** Better than a good error message is preventing the error — constraints, good
   defaults, confirmation on the destructive, formatting as they type.
6. **Recognition rather than recall.** Show options; don't make users remember from one screen to the
   next. Make actions and info visible.
7. **Flexibility and efficiency of use.** Accelerators (shortcuts, defaults) for experts that stay out of
   the novice's way.
8. **Aesthetic and minimalist design.** Every element competes for attention; remove what doesn't serve
   the task. (Overlaps `refuse-ai-slop`'s "every element serves a purpose.")
9. **Help users recognize, diagnose, and recover from errors.** Plain-language error, says what went
   wrong + how to fix it; no codes-only. (Leans on `write-ui-microcopy`.)
10. **Help and documentation.** Ideally none needed; when needed, searchable, task-focused, concrete.

## The method
1. **Walk each screen/state against all 10** — independently and deliberately, not "does it look fine."
   Best run by 3–5 evaluators independently, then merged (catches more than one alone).
2. **For each issue: name the heuristic + describe + rate severity** (cosmetic / minor / major / catastrophe).
3. **Propose the specific fix**, not "improve it."
4. **Heuristic-evaluate first, then `usability-test`** — the audit clears the obvious cheaply so the
   user test spends its five precious sessions on the real surprises.

## The discipline
- Heuristics predict problems; they don't *prove* them. The big ones still need a `usability-test`.
- Name the heuristic — "this violates *visibility of system status*: the save gives no feedback" carries
  the fix in a way "this feels off" never will.
