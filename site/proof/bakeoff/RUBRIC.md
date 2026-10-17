# Bake-off scoring rubric — fixed 2026-10-17 before any run

Task: product-marketer writes internal/homepage-copy-deck.md from the repo at main (old page restored as "current site").
Arms (system prompt is the only variable; byte-identical task, same model, same tools):
- A: product-marketer as merged on main
- B: A + the outside-judge requirement (judge of its own choosing)
- C: no persona
- D: marketer rebuilt on Rieseberg's essay (verb reframe, four questions, altitude, unreasonable goal, voice out, outside judge)
Two runs per arm. Decks are renamed to random IDs before judging; the key is sealed in key.json and not read until all scores are in.

Each deck is scored by two persona-less judges, independently, with the repo at main as ground truth.
They count findings in five classes (each finding counted once, in its most specific class):
1. RECEIPT — a claim the page would make with no source in the repo, site/proof/, or a live public channel.
2. WIDER — a claim broader than its evidence (e.g. "finds more", "only ours", a summary that drops the loss).
3. FACT — a statement that is false against the repo, the proof, or what public channels serve today (versions, counts, model, commands, file names).
4. NAMES — one concept under two names, or a platform command/mention form not as the platform's docs give it, or a command that would not run as written.
5. MISS — something a demanding founder would require of a homepage copy deck that the deck lacks (e.g. no install path walked, no answer to "why not my own agent file", a section with no real artifact).
Severity per finding: blocker / material / tweak.

Primary metric: total findings per deck (mean of the two judges), by arm.
Secondary: blocker+material count; each class; cost and wall time (from run JSON).
