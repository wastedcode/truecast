# ui-ux-designer 1.3.6: hand-off for the truecast.dev homepage

2026-10-17 · built from [`copy-deck.md`](copy-deck.md) (product-marketer 1.6.0) and `site/brand/`.
Files: `site/index.html`, `site/styles.css`, `site/app.js`, `scripts/brand/page.py`,
`site/proof/rerun/security-engineer-1.2.2-core.json`.

## Against the budget

Measured in headless Chromium on the built page (visible words = whitespace-split tokens of the rendered
text containing a letter, digit, `$`, `~`, `/` or `@`; screen-reader-only text excluded; code and figure
labels counted).

| | budget | 1440 | 390 |
|---|---|---|---|
| page height | ≤ 6,000 / ≤ 9,000 | **5,821px** (dark; 5,818 light) | **8,789px** (dark, JS on; 8,706 with JS off) |
| visible words | ≤ 800 | **797** | **795** (two nav links hide on phones) |

The old page: 12,200px / 17,200px, about 2,600 words. Other widths: 320 → about 9,600px, 768 → 7,510px,
1024 → 5,965px, 1920 → 5,818px (no budget was set for these). Rendered at 320, 390, 768, 1024, 1440 and
1920, light and dark, plus JS off and reduced motion at 390 and 1440: no horizontal overflow, no console
errors, every figure fully drawn with JS off and with reduced motion.

## What carries each beat

| Beat | Visual | Motion (JS on, no reduced motion; the resting frame is the final frame) |
|---|---|---|
| 1 Hero | Fig. 1: security-engineer 1.2.2's playbook drawn as the mark (agent file = crossbar, 20 files = stem), the two skills run 2 opened solid and named, the other 18 hollow; verdict and F1 verbatim | bands drop in, the two skills fill in turn as their names appear, then the verdict, then F1. Replay button |
| 2 Fair test | Fig. 2: one square per run per hole, playbooks to one scale as column heads; "Ended on GO or NO-GO" under a heavy rule | squares fill in run order |
| 3 What it is | Fig. 3: the live playbook as the mark, labelled; the brief in a dashed box with a solid top "wall". Fig. 4: its context (66,578) and the report (2,780) drawn to one scale | an update arrow lands and the playbook redraws while the brief's wall holds; the context bar fills while ten tool-call ticks appear, then only the report block crosses to your session |
| 4 Install | Fig. 5: three plain panels (terminal / in Claude Code / in Claude Code), no fake app chrome; the four plan lines you approve carry an accent rule | the plan prints line by line, then each approved line lights in turn |
| 5 The twelve | Fig. 6: name, question, playbook lying flat at one scale, copy button, on the ink field | the drill, row by row |
| 6 Made by them | Fig. 7: the hand-off chain on a surface line. Fig. 8: four arms × three measures, dot on a fixed domain, the shipped arm in blue | none |
| 7 Close | all twelve playbooks hanging off a true-blue field (the social card's frame) | none |

## Generated, pinned, checked

`python3 scripts/brand/page.py --check` and `python3 scripts/brand/build.py --check` pass; the brand
conformance test (`src/publish/brand.conformance.test.ts`) passes. `page.py` now:
- draws Figs. 1 and 2 from `site/proof/rerun/security-engineer-1.2.2-core.json`, a snapshot of the playbook
  as tested. It fails if the rerun README stops saying "21 files · 12,697 words", or if security-engineer is
  still 1.2.2 but its playbook changed;
- builds every Fig. 2 square and average from the two tables in `site/proof/rerun/README.md`, and fails if
  the per-run marks don't add up to the summary row;
- builds Fig. 8 from `site/proof/bakeoff/` (scores-blind.json, key.json, each ambition judgement's ranks
  line), rounding half up;
- generates "Twelve" (twice), Fig. 3's file and word counts, the roster and the close;
- dropped `tree`, `tree-h`, `roster-ref`, `fig1-core-h`, `ledger-*` (now inside `fig2`).
I tested the new checks by tampering in a scratch copy: a changed run mark fails with the mismatch, a
changed blind score names `fig8`.

Pinned on purpose: Fig. 7's versions (who made this page), the plan's `1.2.2` (a capture), Fig. 1's
verdict lines, Fig. 4's tokens, the install output.

## Where I departed from the deck (all reversible)

1. **Commands wrap at spaces on narrow screens instead of scrolling sideways.** The deck asked for sideways
   scroll at 390 to save height. Wrapping costs one line, keeps the whole command visible, and still copies
   (by button or by selection) as one runnable line; the page still came in under 9,000px. `--marketplace`
   and `wastedcode/truecast` are each unbreakable. The install plan does scroll sideways (its columns are
   the point).
2. **Fig. 3 is drawn smaller than Fig. 1** (60 words/px against 40), so the same playbook doesn't read as
   the same figure twice; each figure is one scale within itself.
3. **The crossbar is drawn area-true**: three stems wide and a third as tall, the same words per px² as the
   stem. Alternative: crossbar at stem width, which loses the mark.
4. **The roster bars carry a hover title with files and words.** No visible words added; it also keeps
   the drift test sensitive to a playbook's total.
5. **The close sits on a true-blue field**, not ink: BRAND.md reserves the ink field for the roster, and a
   blue field is the brand's one colour "used hard". Alternative: ink, as the old page.
6. **Two word changes, both truth fixes from the outside judge** (+4 words): Fig. 1's prompt now ends
   "… Can anything here get a user owned? …", because the real prompt continues ("Give your full verdict and
   findings.") and the caption promises "… marks a cut"; Fig. 3's brief now reads "in your repo, once you add
   it", because a user-scope install doesn't create the brief (docs/install.md: only `--project` scaffolds it).
7. **The install plan wraps below 1024px** (hanging lines, paths break only after a `/`, `security-engineer`
   never splits) instead of scrolling, so every line you approve is visible on a phone. The text is unchanged.
8. **Fig. 2's "Hand-written" links to the 76-word agent itself** (`site/proof/README.md#the-hand-written-agent-76-words-verbatim`),
   not to `handwritten-agent.md`, which is that agent's report from the *first* comparison and opens on a verdict.
9. **Fig. 8 draws each value as a dot on its own fixed-domain track per cell** (0–12, 0–5, 1–8, as the deck
   set), so equal values (7.8 and 7.8) never collide.

## Bake-off: published, one click deep

I kept product-marketer's decision: one beat on the page (Figs. 7 and 8), and everything else at
`site/proof/bakeoff/` and here. This folder is the gate the deck set for "written and built by two of
them": the deck ([`copy-deck.md`](copy-deck.md), with [`count-deck.py`](count-deck.py)), this hand-off,
[`changes.md`](changes.md) and the outside-judge reports (the marketer's are in the deck's §8; mine below).

## Outside judge

**Who:** a fresh general-purpose agent with no part in the build, given the brief, the deck, the brand and
the repo, told to render the page itself and to find what's wrong (no praise section). It measured heights
and words on its own (1440: 5,836px, 390: 8,773px, about 793 words, matching mine), recomputed every Fig. 2
cell and Fig. 8 value from source, checked the verdict, plan, versions, CHANGELOG and token lines, and tested
every copy button with a clipboard read (all correct).

**What it found, and what I did:**

| # | finding | action |
|---|---|---|
| B1 | `designer.md`, `changes.md` and the judge reports were missing, so Fig. 7 would 404 and the gate fails | written (this file, [`changes.md`](changes.md), this section) |
| B2 | `site/proof/bakeoff/`, `site/proof/homepage/`, the 1.2.2 snapshot and the two proof README edits are untracked or uncommitted, yet the page cites them | **for the orchestrator:** commit all of them with the page; `page.py` reads the snapshot |
| B3 | "Hand-written" linked a report from a different test that opens "Verdict: CONDITIONAL" next to a 0-of-6 row | relinked to the 76-word agent itself |
| M4 | Fig. 1's prompt was cut at the end without a marker | trailing "…" added |
| M5 | with JS off, copy and Replay buttons showed and did nothing (`display` beat `hidden`); Replay showed under reduced motion | `[hidden]` now wins; 0 visible buttons with JS off, Replay hidden under reduced motion |
| M6 | print lost Fig. 2's squares and every band; the ink and blue sections printed pale | print styles: armed figures print final, colours print exact, ink/blue sections print on white |
| M7 | Figs. 3, 5, 6 rested drawn, then blanked and redrew when scrolled in | armed figures wait in their first frame; nothing already on screen is ever armed |
| M8 | Fig. 3's arrow hit the crossbar (the agent file) and no wall was drawn | the update arrow enters the stem; a dashed line runs on to a drawn stop at the brief's solid wall |
| M9 | the plan scrolled sideways on phones, hiding what you approve | it wraps below 1024px |
| M10 | the brief path broke mid-token (`overflow-wrap: anywhere`) | removed; breaks only at its `<wbr>`s |
| M11 | the page implied the brief already exists | "once you add it" |
| T | tiny hand-written band; Fig. 4 slide offset fixed at 1440's layout; 320px command crowding the button; 16px footer link; table semantics on phones | band min 2px; offset is a variable per layout; smaller command type at ≤360px; 28px target; ARIA table roles in `page.py` |

**Not changed, with reasons:**
- "cost five times as much": the sentence compares against "as shipped", which it names one sentence earlier;
  "as much as shipped" would push the page to 799 words. The bake-off README gives both costs.
- No copy button on the "Already in a session?" and hero "Then in Claude Code" lines: the deck makes the two
  numbered steps the copy targets; both lines are selectable text.
- Fig. 6 "longer reads as better": the caption says "One band per file, one scale", and each bar's hover
  title gives files and words.
- Fig. 8 dots per column: a single shared track per row collides 7.8 with 7.8 and 9.8 with 10.0; the fixed
  domain keeps the dots honest, and the numbers carry the comparison.
- The judge's "still too long" watch-list (install and roster are the tallest sections; the 70-word paragraph
  in beat 6) is the founder's call; both sections are inside the budget.

After the fixes I re-ran the matrix (6 widths × light/dark, plus JS off and reduced motion), the two gates
and the brand conformance test: all in budget, no overflow, no console errors, gates green.
