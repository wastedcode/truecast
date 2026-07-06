---
name: survey-prior-art
description: Use before ANY design that would add a mechanism, helper, or dependency — concept-search the WHOLE repo (not the feature's neighborhood) for existing owners and produce the prior-art inventory the brief must carry; "nothing exists" only counts after the sweep.
---
# Survey prior art — the repo already voted; find out how

The expensive miss isn't building the wrong thing — it's building a **second** thing. A shared library
three modules already use, sitting in a section you weren't thinking about, is invisible to a
feature-focused read. "Relevant surface" judged from the feature is exactly how it stays invisible:
relevance is what the sweep *discovers*, not what it starts from.

## The method
1. **Name the concepts, not the files.** List the mechanisms the design will need as domain-neutral
   concepts — retry, pagination, config, caching, validation, export, auth-check. These are your search
   keys; a file list scoped to the feature is the trap this skill exists to break.
2. **Concept-search the whole repo.** Grep every concept (and its synonyms) across *all* of it — every
   module, not the target's neighborhood. You are hunting for existing owners, not browsing for context.
3. **Walk the shared-code homes end to end.** `lib/`, `shared/`, `common/`, `utils/`, `pkg/`, internal
   packages — read their tables of contents. This is where the thing you're about to rebuild lives.
4. **Read the dependency manifest.** package.json / go.mod / Cargo.toml / pyproject: which libraries are
   already paid for? A dependency already in the tree costs ~nothing; a new one is an innovation token.
5. **Read the nearest analogues.** Find 2–3 features *anywhere* in the codebase that solved a similar
   shape of problem, and read how. Three modules converging on one helper is the codebase telling you
   what the pattern is.
6. **Write the inventory.** One line per concept: where it already lives (file / lib) →
   **reuse / extend / diverge (with the reason)**. This table goes into the brief's *Prior art* section
   verbatim — it is the artifact that proves the sweep happened.

## The discipline
- **A new mechanism must cite the inventory.** The design may introduce something new only by pointing at
  the inventory line showing nothing existing serves. "I didn't find it" is evidence only *after*
  steps 2–5 — never before.
- **Diverging from found prior art is a recorded decision, not a silent one.** If the existing pattern is
  wrong for this case, say why in the inventory — and if the divergence is hard to reverse, that's an ADR.
- **This runs before the design exists** — it feeds `design-the-simplest-thing-that-lasts` and
  `choose-boring-technology`; run after, it's decoration on a decision already made.
- **Bad prior art is still a finding.** One flawed owner you extend or fix beats a second, cleaner
  implementation — two owners is the defect (`converge-on-one-surface`).
