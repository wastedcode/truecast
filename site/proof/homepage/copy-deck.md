# truecast.dev homepage: the visual copy deck

product-marketer 1.6.0 · 2026-10-17 · for ui-ux-designer, who builds the page.

> Published copy of the hand-off as ui-ux-designer received it (the working file is git-ignored). Where it says
> `internal/count-deck.py`, run [`count-deck.py`](count-deck.py) from this folder. What the designer changed from it is
> in [`designer.md`](designer.md); every later change is in [`changes.md`](changes.md).

The founder's verdict on the live page: too long, droning, dense; make it visual. The live page is 12,200px
at 1440, 17,200px at 390, about 2,600 visible words. This deck tells the same true story in **7 beats and
under 800 words** (§6 has the exact count). Each beat is carried by a figure built from real data, and words
appear only where the figure can't speak. Everything cut from the homepage already lives one click away
(site/proof/, docs/, GitHub).

---

## 1. The 5-second belief

A Claude Code developer who lands should leave the first screen believing:

> **"There are ready-made specialists I can call with @. One of them found a real hole in its makers' own
> installer, and they show me the receipt. It's one command to install."**

The skeptic's sentence, which the page must survive: *"It tied a 76-word agent at catching holes, and most
runs didn't even open the playbook."* The page survives it because it never sells catching more, and never
sells the playbook as the reason it caught anything. It sells what one hand-written file doesn't give you:
twelve roles already written, each with an agent file that ends on a call (GO or NO-GO, invest or pass…), a
brief in your repo that updates never touch, updates you approve from a plan (and, for product-marketer,
a version change tested blind: beat 6), and an install plan you approve. The
proof is two published tests and the page itself.

**Who:** a developer already working in Claude Code. They're solution-aware: they know subagents exist, and
may have written an agent file or pulled one from a free collection. **Their alternatives today:** ask the
main session directly, write their own `.claude/agents/*.md`, or download a one-file agent from a free
collection. **Category:** expert teammates (subagents) for Claude Code. **Unique and true:** twelve roles
written in depth (11–24 Markdown files each), a brief in your repo that updates never touch, an install
plan you approve, and tests published including where we tied.

---

## 2. The story, in seven beats

| # | Beat (what the reader learns) | The visual that carries it | Motion |
|---|---|---|---|
| 1 | Hero: what it is, one command, and it works | **Fig. 1** our security-engineer reviewing our own installer: the prompt, the 2 skills it opened, its verdict | plays once: bands drop in, the 2 opened skills light, the verdict lands |
| 2 | Why trust it: the fair test, losses shown | **Fig. 2** 3 agents × 6 runs, one square per run, playbooks to scale as column heads | squares fill run by run, once |
| 3 | What you're installing | **Fig. 3** the anatomy (agent file / playbook / your brief) + **Fig. 4** its context vs your session | updates arrive and stop at your brief; the context bar fills, a small report crosses back |
| 4 | How install works | **Fig. 5** real terminal output and the real install plan, verbatim | the plan prints, then each line you're approving is highlighted in turn |
| 5 | The range | **Fig. 6** all twelve playbooks to one scale, each with its question | the drill (brand motion), once |
| 6 | The page proves itself | **Fig. 7** the hand-off chain that made this page + **Fig. 8** the blind test that chose the marketer's version | static |
| 7 | Close | the install command again | none |

Order logic (Schwartz awareness): the reader is solution-aware, so show the product working first (1), then
answer "why not my own agent?" with the fair test (2), then explain what it is (3), then hand them the
install (4). Range (5) and the page's own making (6) are the reasons to stay and to share.

**Fig. 1 to Fig. 2 is one story told in two moves.** The hero shows the find; beat 2's headline, the live
page's tuned line, turns it: "It found a real hole in our installer. So did a 76-word agent."

---

## 3. Budget

Visible words: **§6** (counted by `internal/count-deck.py` over every "On the page" block, including figure
panel labels; cap 800).

Height targets I wrote to (the designer owns layout):

| Beat | 1440 | 390 |
|---|---|---|
| Nav + 1 Hero | 860 | 1,450 |
| 2 Fair test | 800 | 1,300 |
| 3 Anatomy + context | 820 | 1,300 |
| 4 Install | 1,000 | 1,700 |
| 5 The twelve | 760 | 1,250 |
| 6 Made by them | 640 | 1,050 |
| 7 Close + footer | 420 | 650 |
| **Total** | **5,300** (cap 6,000) | **8,700** (cap 9,000) |

At 390, long mono lines (the 63-character install command, the `@agent-…` line, the plan's paths) must
scroll sideways inside their block rather than wrap; wrapping them would cost the 300px of slack.

---

## 4. The beats, with exact words

Conventions: **On the page** blocks are the exact visible copy, including every figure label. `code` stays
code. "[Copy]" and "[Replay]" are icon buttons with an `aria-label` and no visible text (a "Copied" state
appears only after a click), so they're not counted; the live page's text "Copy" buttons would add 5 words.
`{gen:…}` marks a value that must come from a generated block (§7). Links are `text → target`, and the link
text in the block is the text to build.

### Beat 0: Nav

On the page:
```
truecast   Proof   Install   Teammates   GitHub ↗
```
Proof → #proof · Install → #install · Teammates → #teammates · GitHub → https://github.com/wastedcode/truecast

---

### Beat 1: Hero

**What it must do:** say what it is and for whom, show it working on something real, and put the install
command on the first screen.

**Headline: kept.** "The expert teammates Claude Code doesn't ship with." is founder-tuned, and it's the
headline on the social card (`og.png`), the README header and the GitHub description. I wrote 31
alternatives (§8); none beat it on clarity plus distinctiveness.

On the page:
```
The expert teammates Claude Code doesn't ship with.

{gen:Twelve} ready-made specialists, from security engineer to seed investor. Type @, pick one, and it takes the job.

claude plugin install truecast --marketplace wastedcode/truecast   [Copy]
Then in Claude Code: /truecast:install security-engineer
Claude Code 2.1.292 or later · free, MIT
```

**Fig. 1: our own installer, reviewed** (right column at 1440; under the command at 390).

What it shows, top to bottom:
1. who and what: our security-engineer, pointed at truecast's own installer;
2. the question it was given (the prompt's last sentence; the rest is cut and marked);
3. its playbook as the core device (21 bands, one per file, to scale), with the **two skills it opened**
   picked out in accent and named;
4. its verdict and top finding, verbatim, in the verdict colours (no-go red on "NO-GO", the P1 chip).

Built from: `site/proof/rerun/truecast-2.md` (l.7 verdict, l.9 F1) and the receipt I added to
`site/proof/rerun/README.md` ("What `truecast-2` opened"), which I read from the run's own session log: 17
tool calls; the 11th printed `grade-and-remediate-risk/SKILL.md` and `write-the-security-verdict/SKILL.md`;
no other playbook file and no knowledge note was opened. The fix: `CHANGELOG.md` "Installer plugin 0.1.1 …
Found by truecast's own `security-engineer`" (found by the earlier review; this run is the fair-test rerun on
the pre-fix tree, and the caption says so).

Why this run and not the live page's Fig. 1: the fair-test prompt is neutral (it never asks for GO/NO-GO),
while the first review's prompt was written by the main session and asked for GO/NO-GO itself. The
caption says this is one of the two runs that opened skills, so the pick is disclosed.

Drawing rule: the agent file is the crossbar (BRAND.md: it's the name, not the stem). In the stem, the two
skills it opened are solid and named; the other 18 bands are hollow (BRAND.md "read vs not read"), which
the session log supports. Don't reuse page.py's `FIG1_READ`, which comes from the earlier review's log; add
`FAIRTEST2_SKILLS = {grade-and-remediate-risk, write-the-security-verdict}`.

Motion (about 4s, once, on load): the bands drop in (the drill), the two skills go solid one after the
other as their names appear, then the verdict line and the F1 chip appear, with "fixed in 0.1.1" as a quiet
text-2 tag on the F1 line (not a verdict colour). The first screen must not read as a live warning. It shows the order that matters: it
read these, then it made this call. A [Replay] control. With reduced motion or JS off, the final frame is
fully drawn.

On the page:
```
security-engineer, reviewing our own installer
› … Can anything here get a user owned?
its playbook · 21 files · it opened 2 skills
grade-and-remediate-risk · write-the-security-verdict
Verdict: yes, someone can get owned, but only through --project. That path is NO-GO until F1 is fixed. …
F1 · P1  a hostile repo can write any file in your home …   fixed in 0.1.1
Fig. 1  Fair-test run 2 of 6, rerun on the pre-fix code. Verbatim; … marks a cut.  Full report →
```
"Full report →" → https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/truecast-2.md

---

### Beat 2: The fair test (id `proof`)

**What it must do:** answer "why not my own agent file?" with the receipt, loss first.

On the page:
```
It found a real hole in our installer. So did a 76-word agent.

Hand-written · 76 words | VoltAgent collection · 1,007 words | truecast · 12,697 words in 21 files
Hostile repo writes into your home      6 of 6 | 5 of 6 | 5 of 6
Hooks the install plan didn't show      1 of 6 | 1 of 6 | 2 of 6
Unrestricted Bash, pre-approved         2 of 6 | 0 of 6 | 2 of 6
Total                                   9 of 18 | 6 of 18 | 9 of 18
Ended on GO or NO-GO                    0 of 6 | 0 of 6 | 6 of 6
Average run                             $0.85 | $0.68 | $1.04

The GO or NO-GO comes from our agent file; you could ask yours for one. A one-file agent, yours or a collection's, stops there. Ours has a playbook behind it, your
brief beside it, and updates you approve.

Fig. 2  Same prompt, six runs each, 2026-10-16. Model: claude-opus-5-5; 8 of 18 runs switched to
claude-opus-4-8 partway.  All 18 reports →
```
"All 18 reports →" → https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/README.md

**Fig. 2** (the block above is its content, not a text table): three columns, each headed by its agent's
playbook drawn to one scale (a hairline, one band, 21 bands: the existing `ledger-hw/fc/se` blocks), then
one square per run per row, filled if that run's report raised it. "Ended on GO or NO-GO" sits apart under a
rule, because it measures something different. Built from both tables in `site/proof/rerun/README.md`.
`truecast-6` ended "CONDITIONAL GO"; it counts as GO or NO-GO, as the README counts it. The VoltAgent column
links to the exact file
(https://github.com/VoltAgent/awesome-claude-code-subagents/blob/408d3c9eee2d0c75c12a3abb5de29e53c2ca6b9e/categories/03-infrastructure/security-engineer.md).
Naming it passes the good-look check: the live page already names it, the comparison is published in full,
and the README notes we changed only its tools and model lines.

Motion: the squares fill in run order (run 1 to 6), 60ms apart, once, when the figure enters view. It
teaches "one square is one run" without a legend sentence. With reduced motion or JS off, they're filled.

---

### Beat 3: What you're installing

**What it must do:** make "a teammate" concrete in one picture (the agent file Claude Code sees, the
playbook behind it, your brief beside it) and show why your session stays clean.

On the page:
```
Behind each name, a playbook you can read.

security-engineer.md   the agent file, listed when you type @
its playbook   {gen:21} files, {gen:12,697} words. It can open any of them mid-job.
your brief   .truecast/agents/security-engineer/instance/mandate.md in your repo. It reads this first.
updates replace the playbook · stop at your brief
Fig. 3  Open the folder on GitHub →

Each teammate is a native Claude Code subagent.
its context   66,578 tokens · 10 tool calls
your session gets   2,780 tokens: the report
Fig. 4  From an earlier review's session log, to one scale. How we counted →
```
"Open the folder on GitHub →" → https://github.com/wastedcode/truecast/tree/main/personas/security-engineer/core
"How we counted →" → https://github.com/wastedcode/truecast/blob/main/site/proof/README.md#method

**Fig. 3, the anatomy.** The brand mark, exploded into one real teammate: the crossbar is the agent file
(labelled), the stem is security-engineer's current core (generated), and to one side, inside a dashed
boundary labelled with the repo path, a single page for the brief. An arrow labelled "updates" comes down
onto the playbook and stops at a hairline wall before the brief. This replaces the live page's Fig. 3 (a
21-row file list) and Fig. 4 (the update map). The full file list is one click away on GitHub.

**Fig. 4, its own context.** This answers "why not just ask the main session?". Two columns to one scale:
"its context" fills to 66,578 tokens while ten tick marks count the tool calls, then a 2,780-token block (to
scale) moves across into "your session". This is the earlier site's subagent animation, the one the founder
remembers, now drawn from real numbers instead of as decoration. Source: `site/proof/README.md` Method, the
"Context, for truecast's run" line, added in this change (2 + 1,523 + 62,113 + 2,940 = 66,578; 2,940 − 160
= 2,780). I checked it against the session log itself on 2026-10-17: the subagent's `toolUseResult` has
`totalTokens: 66578`, `totalToolUseCount: 10`, `usage` 2 / 1,523 / 62,113 / 2,940, and
`thinking_tokens: 160`. The log isn't published (it holds a sandbox exploit transcript); the proof README
names the fields.

Motion (about 3s, once, on view): the big bar grows, the ten ticks appear, the small block slides across.
It explains why your main session stays clean. With reduced motion or JS off, both bars are drawn and the
block is already in "your session".

---

### Beat 4: Install (id `install`)

**What it must do:** give the two commands, what you'll see at each, and the moment you consent. "Then use
it" is unnumbered on purpose: the headline promises two commands.

On the page:
```
Two commands. A teammate is written only after you approve its plan.

terminal
1  Once, the installer
claude plugin install truecast --marketplace wastedcode/truecast   [Copy]
✔ Successfully installed plugin: truecast@truecast (scope: user)

in Claude Code
2  Once per teammate
/truecast:install security-engineer   [Copy]
Claude shows you the installer's plan, then asks "Install it?"
plan: install security-engineer@1.2.2   (from your local marketplace copy)
  tools granted to @security-engineer: Read, Grep, Glob, Bash, WebSearch, WebFetch
  writes:
    craft    ~/.truecast/personas/security-engineer/1.2.2/core/
    …
    agent    ~/.claude/agents/security-engineer.md
  nothing has been written yet.
Claude Code already open? /reload-plugins first.

in Claude Code
Then use it
@agent-security-engineer review the changes on this branch before I merge   [Copy]
Or type @ and pick it. Missing? Restart Claude Code once.

Already in a session? /plugin install truecast --marketplace wastedcode/truecast (2.1.275 or later)
Your brief: start from the template →
No truecast server: it installs from the copy Claude Code cloned.
Update, remove, Windows: the docs →
Fig. 5  Output verbatim, 2026-10-17; home shown as ~; … marks a cut.
```
Links: "start from the template →" → https://github.com/wastedcode/truecast/tree/main/personas/security-engineer/instance-template ·
"the docs →" → https://github.com/wastedcode/truecast/blob/main/docs/install.md ·
the "Already in a session?" line keeps the live page's anchor, `id="install-session"`, so inbound links survive.

**Fig. 5.** Not a fake Claude Code window (BRAND.md forbids UI chrome): three plain mono panels labelled
"terminal", "in Claude Code" and "in Claude Code", each showing the command, then its real output. Panel 2
is labelled as what it is: the installer's printed plan, which Claude relays before asking
(`plugin/truecast/commands/install.md`, Step 2: "Show the user the plan (version, the tools it will be
granted, the exact files). Ask: 'Install it?'").

Motion (once, on view): in panel 2 the plan prints top to bottom (40ms a line), then the lines you're
approving are highlighted in turn: the tools line, each `writes:` path, and last "nothing has been written
yet." It shows exactly what you're agreeing to. The live page spent a whole trust section on that. No
invented post-"yes" output. With reduced motion or JS off, you get the plan as captured.

**The install path, exactly as it works today.** I walked it on 2026-10-17 in a throwaway HOME, on Claude
Code 2.1.302, against GitHub `main`:
- **Step 1** printed "Cloning repository…" progress lines, then `✔ Successfully added marketplace: truecast (declared in user settings)` and the ✔ line shown (the page shows only the last line; mark the panel's cut with …).
- **The plan:** the installer script in the marketplace clone printed the plan above byte for byte. The page
  trims two of its four `writes:` lines (`record`, `pointer`) at "…", and leaves off two lines:
  - `note: the agents directory does not exist yet — you will need to restart Claude Code once.` This
    appears only on a home with no `~/.claude/agents/`; "Missing? Restart Claude Code once." covers it.
  - `TRUECAST_RESULT …`, the machine-readable line.
- **Versions:** the installer plugin served was 0.1.2.
- **The flag:** `claude plugin install --help` documents `--marketplace <source>`: "A marketplace not added
  yet is added first, in user settings".
- **In-session path and version floors:** `docs/install.md` §"In Claude Code".

The judge independently re-walked the same path and got the same output.

---

### Beat 5: The twelve (id `teammates`)

On the page:
```
{gen:Twelve} teammates. Pick the call you'd rather not make alone.

software-architect   How should this be built so it lasts?
software-engineer    Can I trust this code?
qa                   What breaks before a user finds it?
security-engineer    Can this get someone owned?
infrastructure       Will this hold up in production?
product-manager      Are we building the right thing?
product-researcher   What are users telling us?
ui-ux-designer       Can people use this?
brand-designer       Would anyone remember us?
product-marketer     Why would anyone care?
sales                Who would pay for this?
vc-seed              Would an investor write the check?

/truecast:install <name>
Fig. 6  One band per file, one scale. Tested so far: security-engineer, product-marketer.
```
**Fig. 6:** the existing generated `roster` rows, slimmed to name, question and the core lying flat. The six lane labels (Build, Ship…) are cut for the budget; keep the lane order and group the rows with spacing
(BRAND.md "on its side"). Each name links to its folder on GitHub, and each row has a [Copy] icon that copies
`/truecast:install <name>`. The "Its agent file asks for" and "Can touch" lines move off the homepage: the
tools are in the install plan the user approves, and the asks are in each folder. Motion: the drill, once,
row by row.

---

### Beat 6: Made by its own teammates

**What it must do:** carry the founder-approved bold idea, made true for *this* page.

**Decision (recorded): publish, one click deep.** The page gets one beat: the hand-off chain that made this
page, and one small figure from the blind test that chose the marketer's version. Everything else lives at
`site/proof/bakeoff/`: the eight drafts, all 19 judgements, the rubrics, the key and the scores. I curated
it in this change: local paths are replaced and memory references removed. The roadmap evidence one run
created is not published, because it is internal roadmap advice.

**Alternative not taken:** the judges' bolder versions, an inline "swap to the losing page" toggle or
per-section margin notes. Both would put the old 2,600-word page's process back on a page that has to stay
under 800 words, and those drafts were written for the old page, not this one.

**GATE (blocker at merge; the orchestrator checks it).** The headline "written and built by two of them"
ships only if `site/proof/homepage/` exists with:
- (a) this deck, copied to `copy-deck.md`. `internal/` is git-ignored, so it won't ship otherwise.
- (b) ui-ux-designer's hand-off.
- (c) `changes.md`, which lists every change a person or the orchestrator made after the hand-offs, one line
  each, with the diff stat.
- (d) the outside-judge reports (mine are summarized in §8; the designer's, if it ran one).
- Recommended, not required: `briefs.md`, the brief each teammate was given, with local paths removed.
- The public copy of this deck must carry no placeholder, and `internal/count-deck.py` goes with it.

If (b) is missing, use "This page's words were written by one of them." and drop the designer node. If (a)
is missing, cut the whole beat: the figure links to it.

On the page:
```
This page was written and built by two of them.

product-marketer 1.6.0 → ui-ux-designer 1.3.6 → this page
Fig. 7  Every hand-off, review and later change →

Before writing this, product-marketer was tested blind: four versions, two drafts each of our last
homepage, scored by fresh Claude sessions. As shipped, it did no better than the bare model. With one rule
added (have a fresh session check the work before handing off), all three judges ranked its drafts first and
second. It still made more serious mistakes, and cost five times as much. That's 1.6.0.

                               as shipped | + the rule | bare model | rewrite
mistakes per draft                  10.0 | 7.8 | 9.8 | 7.8
serious ones                         3.8 | 3.3 | 1.8 | 1.3
boldest-idea rank (1 is best)        4.3 | 1.5 | 6.0 | 6.2
Fig. 8  Every draft, score and rubric →
```
Links: "Every hand-off, review and later change →" → https://github.com/wastedcode/truecast/tree/main/site/proof/homepage ·
"Every draft, score and rubric →" → https://github.com/wastedcode/truecast/blob/main/site/proof/bakeoff/README.md

**Fig. 7:** three nodes on one line. The versions are pinned to who actually ran (not generated:
the next release must not rewrite who made this page), with the brand's surface line running under them. Each node is a small
labelled card that links to its hand-off file. **Fig. 8:** two rows, the four arms in the same column order
in all three rows, each value a dot labelled with its number. No tick labels, but fixed domains: mistakes
0 to 12, serious 0 to 5, rank 1 to 8 (so the scale doesn't exaggerate gaps). The
"+ outside judge" dot is accent blue and the others text-3. Static: nothing here needs motion.

Why this beat stays: it's the one proof of range a competitor can't copy and a reader can check without
leaving the page. It's also the update loop a hand-written agent file doesn't have: a change tested blind,
then shipped as a version.

---

### Beat 7: Close + footer

On the page:
```
Put a specialist on the call you're about to make.
claude plugin install truecast --marketplace wastedcode/truecast   [Copy]
Runs on your own Claude Code usage. Open source, made by Inder Singh (wastedcode).

MIT · © 2026 Inder Singh   GitHub · Docs · Changelog · Security · Issues
```
Visual: the generated `close-cores` block (all twelve playbooks hanging from one surface line, as on the
social card) sits behind or beside the line. The footer links are unchanged. The live page's second CTA ("Used one? Tell us what it caught") is cut:
one page, one CTA. Issues stays in the footer.

---

## 5. What leaves the homepage (and where it lives)

| Live page block | Now |
|---|---|
| Fig. 1, the 10-call tool log of the first review | proof/README.md; the hero uses the fair-test run instead |
| Fig. 2's long paragraphs, the model-switch detail, the fourth hole | one caption line; rerun/README.md has the rest |
| Fig. 3's 21-file list, Fig. 4's update map | merged into the Fig. 3 anatomy; the file list is on GitHub |
| Step 4, the brief `curl` one-liner | a link to the template |
| "Later" (update/remove, 6 commands), in-session steps for versions before 2.1.275, Windows | one line pointing to docs/install.md |
| Roster "asks for" and "Can touch" | the install plan and each folder |
| Trust section (4 cards, the refusal output) | beat 4's headline, the plan in Fig. 5 and one line; the refusal stays in docs/install.md |
| FAQ (6 questions) | "my own agent file" in beat 2; "ask the main session" in Fig. 4; cost in Fig. 2 and the close; team setup, "does it learn" and authoring in docs |

This also fixes three defects on the live page:
- **The `834b03d` links.** That commit isn't an ancestor of `main`; the fix landed on main as `d70aa8d`
  (PR #50). The GitHub URL still resolves, so the proof READMEs can keep it, but the homepage no longer
  links it.
- **The 66,578 / 2,780 token figures had no published source.** The derivation is now published.
- **Fig. 1 was a run whose prompt asked for the verdict.** The hero now uses a neutral-prompt run.

---

## 6. Word count

`python3 internal/count-deck.py` counts every "On the page" block. It excludes [Copy] and [Replay] and
includes every figure and panel label.

```
   5  truecast   Proof   Install   Teammates   GitHub ↗
  45  The expert teammates Claude Code doesn't ship with
  73  security-engineer, reviewing our own installer
 156  It found a real hole in our installer. So did a 76
  91  Behind each name, a playbook you can read.
 155  Two commands. A teammate is written only after you
 102  Twelve teammates. Pick the call you'd rather not m
 128  This page was written and built by two of them.
  39  Put a specialist on the call you're about to make.
 794  TOTAL
```

---

## 7. For the build: generated numbers and page.py

Every number drawn from the repo must come from `scripts/brand/page.py`, and `--check` must fail if it
drifts.

- **Keep:**
  - `ledger-hw`, `ledger-fc`, `ledger-se` (the Fig. 2 column heads);
  - `roster` (Fig. 6), slimmed: drop the asks and "Can touch" lines and the visible per-row command; keep the
    name link and the copy button;
  - `fig1-core` / `fig1-core-h` (Fig. 1), switched to `FAIRTEST2_SKILLS`, drawn as beat 1 says;
  - `close-cores` (the close).
- **Pin what was tested.** Fig. 1 and Fig. 2 show security-engineer *as it was tested* (1.2.2: 21 files,
  12,697 words). Snapshot its core today into `site/proof/rerun/security-engineer-1.2.2-core.json` and draw
  Fig. 1, the Fig. 2 column head and their labels from that snapshot, so a playbook edit can't put a new
  size on an old test. `--check` verifies the snapshot matches `cores.json` while security-engineer is still
  1.2.2, and stops comparing once it moves on.
- **Drop:** `tree`, `tree-h`, `roster-ref`.
  Remove them from `BLOCKS` too, or `main()` raises "index.html has no block for".
- **Add:** small generated spans for the numbers in prose, so a playbook edit can't leave the page stale:
  - from `cores.json`: Fig. 3's live file and word counts for security-engineer;
  - the team size: "Twelve" in the hero subhead and the beat 5 headline (`len(ROSTER)`);
  - ROSTER's three questions lose "actually" (What are users telling us? / Can people use this? / Who would
    pay for this?), cut for the budget.
- **Pinned, never generated:** Fig. 7's versions (who made this page), the `1.2.2` in the Fig. 5 plan
  (a verbatim capture), Fig. 1 and Fig. 2's sizes (via the snapshot above).
- **Add (recommended):**
  - generate Fig. 2's cells from the two tables in `site/proof/rerun/README.md`;
  - generate Fig. 8's twelve values from `site/proof/bakeoff/scores-blind.json`, `key.json` and the `ranks`
    JSON line that ends each `ambition-judgements/*.md`.

  Then a proof edit can't leave the page stale.
- **Not generated** (dated, labelled captures): the verdict and finding lines, the install outputs, the $
  figures, and 66,578 / 2,780.

---

## 8. Search, decisions, ledger, judge

**Headlines tried: 31,** across these families:
- keep the tuned line (1);
- outcome: "Get a security review that ends on a call";
- contrast: "Your agent file, plus the eleven you haven't written";
- moment: "Put a specialist on the call you're about to make" (kept as the close);
- range: "Your security engineer, PM and seed investor, on @";
- candour: "We published where our agent tied";
- proof: "A 76-word agent caught as much. Here's why you'd still install ours.";
- meta: "This page was written by the product".

I read each one cold against the 5-second belief with the skeptic's sentence beside it. The tuned H1 won on
instant category clarity (Claude Code, teammates, and what's missing), and it's already the social card.
The candour line works as the beat-2 headline, where the live page's tuned version ("It found a real hole in
our installer. So did a 76-word agent.") already says it better, with the figure right under it. The meta
line belongs in beat 6, beside its receipts.

**Decisions I took without the founder (all reversible):**
1. **Kept the H1.** Alternative: "Put a specialist on the call you're about to make.", now the close.
2. **The hero run is fair-test truecast-2, framed as "reviewing our own installer".** Alternative: the live
   Fig. 1 run, which has more tool calls to show but whose prompt asked for the verdict.
3. **The bake-off is published at site/proof/bakeoff/ with one beat on the page.** Alternative: the judges'
   "swap to the losing page" toggle.
4. **The `product-manager` roadmap run from the bake-off is not published.** It's internal roadmap advice.
5. **The FAQ is off the homepage.** Alternative: a 3-question FAQ, which costs about 120 words and repeats
   beat 2.
6. **The token derivation is now in site/proof/README.md,** so Fig. 4 keeps its numbers.
7. **The playbook claim is narrowed to "it can open any of them".** The proof shows 2 of 6 runs opened
   skills, so the page never says the playbook is why it caught anything.
8. **Sizes and versions of tested or authoring teammates are pinned, not generated.** Alternative: generate
   everything (the round-2 judge showed that turns history into a moving claim).
9. **Fig. 8 shows serious mistakes too,** where the winning arm did worse. Alternative: ambition rank only,
   which flatters it.

**Claim ledger.** Every on-page claim and its source. "Public" means what a visitor gets from `main`, GitHub
and the live plugin once this branch is merged.

| Claim | Source |
|---|---|
| Twelve specialists; lanes; the 12 questions; "eleven more roles" | `.claude-plugin/marketplace.json` (12 personas + the installer); `page.py` ROSTER |
| "from security engineer to seed investor" | `personas/security-engineer`, `personas/vc-seed` |
| Type @, pick one; `@agent-security-engineer` | `docs/install.md`: "type `@` and pick it from the list (it inserts `@agent-…`)" |
| A native Claude Code subagent | the installer writes `~/.claude/agents/<name>.md` (the plan) |
| Install commands, outputs, plan; installer 0.1.2 served | walked 2026-10-17 on Claude Code 2.1.302 against GitHub main; `claude plugin install --help`; re-walked by the judge |
| "Claude shows it to you and asks 'Install it?'" | `plugin/truecast/commands/install.md` Step 2 |
| 2.1.292 / 2.1.275 floors | `docs/install.md` |
| Fig. 1 "reviewing our own installer", prompt sentence, verdict, F1 | `site/proof/rerun/README.md` (the prompt); `truecast-2.md` l.7, l.9 |
| "it opened 2 skills", their names; 18 bands hollow | `site/proof/rerun/README.md` "What `truecast-2` opened" (added; read from the run's session log: call 11 of 17) |
| "rerun on the pre-fix code" | rerun README Method: `git archive 834b03d^` |
| "fixed in 0.1.1" | `CHANGELOG.md` "Installer plugin 0.1.1 … Found by truecast's own `security-engineer`" |
| "It found a real hole in our installer. So did a 76-word agent." | rerun table: temp files 6 of 6 (hand-written), 5 of 6 (truecast) |
| Every Fig. 2 cell, the $ averages, 8 of 18 switched to claude-opus-4-8 | `site/proof/rerun/README.md` tables and Method |
| "The GO or NO-GO comes from our agent file" | rerun README: "The form comes from the agent file" |
| "A one-file agent … stops there. Ours has a playbook behind it, your brief beside it, and updates you approve." | the hand-written and VoltAgent agents are one file each (rerun README); `personas/*/core`; `docs/install.md` (brief; `/truecast:update` shows a plan) |
| 21 files, 12,697 words | `cores.json` (generated) |
| "It can open any of them mid-job" | the agent file points the teammate at its playbook; 2 of 6 fair-test runs did |
| 66,578 / 2,780 / 10 tool calls | `site/proof/README.md` (derivation added); checked by me against the session log's `toolUseResult` on 2026-10-17 |
| Updates stop at your brief | `docs/install.md`: "Your brief … none of these touch it"; the installer writes only the paths in its plan |
| "No truecast server: it installs from the copy Claude Code cloned." | `docs/install.md`: "Everything it copies comes from the marketplace clone … there is no truecast server" |
| Bake-off: 4 versions × 2 drafts of the last homepage, blind, fresh Claude sessions as judges; "did no better than the bare model"; mistakes 10.0 / 7.8 / 9.8 / 7.8; serious 3.8 / 3.3 / 1.8 / 1.3; ranks 4.3 / 1.5 / 6.0 / 6.2; first and second with all three; "more serious mistakes"; five times the cost | `site/proof/bakeoff/` scores-blind.json + key.json (means recomputed), ambition-judgements (ranks: A 26/6, B 9/6, C 36/6, D 37/6), runs.json ($15.28 / $2.85 = 5.4) |
| "That's 1.6.0" | `personas/product-marketer/core/agent.md` (commit 9693e51; its added section is word-for-word the bake-off's arm-B addition) |
| Written and built by two of them | gated (beat 6); this deck is by product-marketer 1.6.0 |
| Free, MIT; open source, made by Inder Singh (wastedcode) | LICENSE, package.json |

**Public-channel check (2026-10-17):**
- GitHub's default branch is `main`, and truecast.dev returns 200.
- The installer plugin served is 0.1.2.
- npm `@wastedcode/truecast` latest is 0.2.0. The page doesn't mention npm, so there's nothing to contradict.
- product-marketer 1.6.0 and site/proof/bakeoff/ reach visitors only after this branch merges, which is
  also when this page deploys.

**Testing the message before it scales.**
- **5-second test** with 5 Claude Code users: show the first screen for 5s, then ask "what does this give
  you, and what would you type first?" It passes if 4 of 5 say "specialist subagents for Claude Code" and
  name the install command or @.
- **Skeptic test:** show beat 2 and ask "would you still install it?", and why.

Until then (pre-users), the positioning above is a hypothesis.

**Outside judge.** A fresh general-purpose agent, given only this deck, the repo and the brief.

- **Why that judge:** it can disagree with me. It reads the receipts I cite and walks the install itself.
- **Round 1** returned 27 findings. There were 4 blockers:
  - the hero showed a NO-GO without saying it was our own installer, now fixed;
  - the page oversold the playbook against the rerun README's "2 of 6 opened skills";
  - beat 6 said "no better than no persona" next to a rank figure where as-shipped looked better;
  - the `site/proof/homepage/` gate was unmet.

  The material findings:
  - Fig. 5 labelled raw script output "in Claude Code" and animated an invented post-yes state;
  - the opened-file set came from the wrong run's log;
  - "every file" should be "every path";
  - figure labels were missing from the word count;
  - link text differed between the rationale and the page;
  - "call" carried four meanings;
  - undefined terms ("installer", "essay rebuild");
  - the VoltAgent attribution was hover-only;
  - "Nothing runs on our servers" was wider than the docs.
- **What changed:** all of the above, plus the tweaks: the `install-session` anchor kept, the row labels
  tightened, generated spans for "twelve"/"eleven", the ledger refreshed, the comma-spliced lines rewritten,
  and the model-switch caption spelled out.
- **Round 2** (a new fresh agent, same brief, on the revised deck and the public bake-off README) returned 4
  blockers, 9 material, ~15 tweaks:
  - **Blockers:**
    - the two skill names had no public receipt. I read the run's session log, confirmed them (call 11 of
      17, no other playbook file), and published the receipt in rerun/README.md;
    - beat 4's headline was false for step 1, which writes settings with no plan. New headline;
    - this deck still had placeholders, and the public copy has to follow 1.6.0's own rule;
    - Fig. 7's "brief" node linked nothing. It's dropped; briefs are recommended for the proof folder.
  - **Material:**
    - versions and sizes were generated when they record history. They're pinned now (§7);
    - Fig. 8 showed only the winning metrics. A serious-mistakes row was added, and the prose says it lost
      there;
    - the hero read as the discovery; the caption now says it's a rerun on the pre-fix code;
    - the cost figure had no receipt. `runs.json` is published;
    - the token figures rested on an unseen log. I found the log and checked every field;
    - the free collection got no answer. Beat 2 now says what a one-file agent, yours or a collection's,
      lacks;
    - "built by two of them" vs "Built by Inder Singh". The close now says "made by", and Fig. 7's caption
      includes reviews;
    - the rule was misstated as "first". It now reads "before handing off";
    - the rationale overclaimed "tested updates".
  - **Tweaks applied:** "Then use it" unnumbered; "Output verbatim"; the F1 cut marked; "Verdict:" restored;
    "install plan" in the row label; "It reads this first."; fixed axis domains; a close visual
    (`close-cores`). The bake-off README now names the essay as the rubric does and states the noise caveat
    on B vs C, the double-blocker draft, the adjusted figures and the published prompts.
  - **Not changed:**
    - "0 of 6" for the hand-written agent on GO or NO-GO stays literal. handwritten-3's "Don't ship this
      until…" is a call but not GO/NO-GO, and the README counts it that way.
    - "playbook" on the page vs the `core/` folder name stays. BRAND.md decides it ("In copy, call it the
      playbook").
- **Where it stands:** the round-2 findings are resolved or ruled on above. Two items hang on others: the
  beat 6 gate (the designer's hand-off and the orchestrator's `changes.md`), and the 5-second test with real
  users, which can't run before launch.
