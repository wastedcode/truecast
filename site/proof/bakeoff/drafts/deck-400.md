# truecast.dev — homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) → ui-ux-designer (page).
Every number below was checked against the repo or real command output on 2026-10-17. Each artifact
carries its source path. If a number changes, change it at the source and re-derive; never hand-edit it
into the page.

---

## 0. Read this first: what ships on merge

**The staged `site/` is a regression, and it must not merge as it stands.** The working tree has
`site/index.html`, `site/app.js` and `site/styles.css` staged (−1,518 / +1,413 lines) and `site/404.html`
deleted. The staged page is an older draft: "Eleven teammates", an invented terminal ("Claude Code
v2.1.177 · Opus 4.8 (1M context) · Claude Max"), and a made-up "Verdict: GO" for a review whose real
verdict was NO-GO. truecast.dev serves HEAD's page today (checked with `curl https://truecast.dev/`
on 2026-10-17), and that page is far more accurate. Merging the working tree as it stands would replace
an honest page with a false one. §6 lists every false claim on it. The new page that comes out of this
deck replaces both.

**What a visitor actually gets, checked 2026-10-17:**

| Channel | What it serves | What the page may say |
|---|---|---|
| GitHub default branch | `main` = `90b49d8`; this branch merges into it | Marketplace and persona versions = this tree |
| Marketplace (`.claude-plugin/marketplace.json`, served from `main`) | installer `truecast` **0.1.2** + 12 personas | "Twelve", installer 0.1.2 |
| Persona versions (`personas/*/core/persona.toml`) | security-engineer 1.2.2 · qa 1.3.2 · infrastructure 1.2.2 · software-architect 1.4.2 · software-engineer 1.4.2 · product-manager 2.4.2 · product-researcher 0.2.2 · ui-ux-designer 1.3.6 · brand-designer 0.1.6 · product-marketer 1.5.6 · sales 2.2.2 · vc-seed 0.2.2 | Quote only `security-engineer@1.2.2` (in the plan artifact) |
| npm `@wastedcode/truecast` | **0.2.0** (latest, 2026-07-22). `package.json` says 0.3.0, which is unpublished | Don't put the CLI on the page. Link docs from the footer only. Never write "0.3.0" or "shared lanes" as something npm gives you |
| Git tags / GitHub releases | `v0.1.0`, `v0.1.1`, `v0.2.0`; release "truecast 0.2.0" | No "latest release" badge |
| Users who already installed the installer | Could be on 0.1.0 or 0.1.1; auto-update is off for third-party marketplaces (docs/install.md) | Tell existing users how to update (§4, S6 "Later") |
| GitHub stars | 8 | Show no social proof. It would read as weakness, and inventing any is out |
| truecast.dev today | HEAD page (12 teammates, fair test, Figs 1–5) | — |

---

## 1. Audience and the 5-second belief

**Who it's for.** A developer who already uses Claude Code daily and has hit a call they'd rather not
make alone: merge this, ship this, build it this way, is this worth building. They know what a subagent
is, or they will after one sentence. They are skeptical of "AI expert" claims, because they've seen
`act like a senior X` do nothing.

**What they do today** (the real alternatives, in order of how common they are):
1. Ask the main session: "review this like a security expert." No structure, and the digging fills the
   main context.
2. Write their own agent file in `~/.claude/agents/`. It works. Our fair test shows a 76-word one caught
   as many holes as ours. But it's one role, they wrote it, and they keep it current.
3. Download from a free collection (VoltAgent, wshobson). One file per role. Editing it to fit the repo
   means losing the update, or never updating.

**The 5-second belief** (what they must hold after the hero, and nothing more):
> "Twelve specialist agents for Claude Code, already written and deep. Two commands and I can @ one. It
> hands back a decision, not an essay, and they publish their tests, even the one they didn't win."

**The one action:** copy `claude plugin install truecast --marketplace wastedcode/truecast`, then run
`/truecast:install <name>`.

---

## 2. Positioning

**Category:** expert teammates (subagents) for Claude Code. Use "teammate" on the page. "Persona" is the
authoring word and lives only in docs.

**What only truecast does,** and what each one beats:

| Attribute | Beats which alternative | Proof that actually discriminates | Proof that's true but weak (don't lead with it) |
|---|---|---|---|
| **Ends on a call you can act on.** Each agent file asks for a verdict: GO/NO-GO, ship/don't, invest/pass, findings ranked by when to fix them | Your own agent; free collections | Fair test: **6 of 6** truecast runs closed on a ship call, against **0 of 12** for the other two agents. Six runs closed on that call: 4 NO-GO, 1 split (NO-GO for `--project`, GO for user scope), 1 CONDITIONAL GO (`site/proof/rerun/README.md`) | "Graded P0–P3" alone. Others graded severity too |
| **Twelve roles already written, and deep.** 199 skills and 136,385 words of playbook across 12 roles; security-engineer alone has 17 skills in 21 files (12,697 words) | Writing your own; one-file collections (VoltAgent's is 1,007 words) | The depth figure, drawn to scale from the files (`site/brand/cores.json`, `wc -w` on `personas/*/core/**/*.md`) | Word count as a quality claim. **Never imply depth = catches more.** The fair test says it doesn't, on security |
| **Your brief survives every update.** The playbook is the author's, in `~/.truecast`. The brief is yours, in your repo at `.truecast/agents/<name>/instance/mandate.md`. Updates write only the first | Collections (edit = fork); your own file (you are the updater) | The plan output: every path an install writes, none of them in your repo (§4) | "Versioned". Every plugin is versioned |
| **You see the plan before anything is written,** and it won't overwrite a file it didn't write, even with `--force` | Any `curl \| sh` installer; manual copying | Real plan output and real refusal output, both re-run 2026-10-17 (§4, S7) | "Secure", "safe" (adjectives) |
| **Candid evidence.** Every run is published, including the test where a 76-word agent tied | Every competitor homepage (claims, no receipts) | `site/proof/` (21 reports, prompts, agent files, scoring fixed before reading) | — |

**Not a differentiator, so it's demoted:** "own context window". Every subagent has one, including the
visitor's own 76-word file. It only beats alternative 1 (asking the main session). Mention it once, in
"What a teammate is", with the real numbers only if they get a public receipt (see §6, B1).

**Positioning statement** (internal, not page copy): For developers on Claude Code who face specialist
calls without a specialist, truecast is twelve ready-written expert teammates. Each opens a deep playbook
on the job, reads the brief you keep in your repo, and ends on a decision you can act on. Unlike writing
your own or downloading a one-file collection, you don't write or maintain the role, updates never undo
your brief, and every test of it is published, losses included.

**Painkiller check:** for most visitors this is a vitamin. It becomes a painkiller at one moment: "I'm
about to merge or ship or commit to this, and nobody here is a security / QA / infra / product person."
Every CTA and the final section are aimed at that moment ("the call you're about to make"), not at
"build a team".

**Growth loop (named so the page serves it):** the repo-shared teammate (`.claude/settings.json`,
FAQ "Can my whole team get it?") puts a teammate in front of everyone who opens the repo. That's the one
loop the product has. The page keeps it in the FAQ, not the hero, because the bare-`@name` lane is the
better first experience. Also: every report a teammate writes into a repo (e.g. truecast-2 wrote
`docs/security/verdict-plugin-installer.md`) carries its name. No page work is needed for that.

---

## 3. Voice spec (for every line below and any line the designer adds)

- **Register:** an engineer telling another engineer what they measured. Short declaratives. Numbers you
  can click through to.
- **Stance:** candid, not modest. Say where it lost, in the same breath as where it won.
- **Their words:** "merge", "ship", "review", "agent file", "@", "brief", "two commands". Not:
  "unlock", "supercharge", "seamless", "AI-powered", "10x", "elevate", "leverage", "harness", "journey".
- **No:** exclamation marks, rhetorical questions in headlines (except the FAQ), emoji, "not X, but Y"
  constructions stacked more than once on the page, triplets for rhythm, invented personas or quotes.
- **Every number** links to or sits beside its receipt.
- **Mention form:** `@agent-security-engineer` when typed by hand (what the installer prints; a bare
  `@security-engineer` typed by hand can resolve as a file, CHANGELOG 0.1.2). "Type @ and pick it" is
  the friendly form. Never show a bare `@name` as something to type.

---

## 4. The install path, exactly as it works today

Verified 2026-10-17: `claude plugin install --help` (Claude Code 2.1.302) lists `--marketplace <source>`.
The installer script was run in plan mode and apply mode against this tree in a throwaway HOME. Version
floors (2.1.292 for the terminal command, 2.1.275 for the in-session `/plugin install … --marketplace`)
come from `docs/install.md`. I couldn't test older Claude Code builds, so the page quotes the docs' floors.

**Step 1. In your terminal, once per machine** (Claude Code 2.1.292+; `claude --version`):
```sh
claude plugin install truecast --marketplace wastedcode/truecast
```
Ends with (verbatim, captured 2026-10-16 on HEAD's page):
```
✔ Successfully added marketplace: truecast (declared in user settings)
Installing plugin "truecast@truecast"...
✔ Successfully installed plugin: truecast@truecast (scope: user)
```

**Step 2. In Claude Code, in any project:**
```
/truecast:install security-engineer
```
If Claude Code was already open: `/reload-plugins` first. It prints the plan and waits for a yes. Real
output from 2026-10-17, home shown as `~`, machine-readable last line left off:
```
plan: install security-engineer@1.2.2   (from your local marketplace copy)
  tools granted to @security-engineer: Read, Grep, Glob, Bash, WebSearch, WebFetch
  writes:
    craft    ~/.truecast/personas/security-engineer/1.2.2/core/
    record   ~/.truecast/personas/security-engineer/meta.json
    pointer  ~/.truecast/personas/security-engineer/current → 1.2.2
    agent    ~/.claude/agents/security-engineer.md
  nothing has been written yet.
  note: the agents directory does not exist yet — you will need to restart Claude Code once.
```
After yes:
```
✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
```
(The `note:` line appears only if `~/.claude/agents/` didn't exist. Then restart Claude Code once.)

**Step 3. Call it:** `@agent-security-engineer review the changes on this branch before I merge`. Or type
`@` and pick it.

**Step 4 (optional). Give it a brief:** save the template to
`.truecast/agents/<name>/instance/mandate.md` in the repo. All 12 templates exist at
`personas/<name>/instance-template/mandate.md`, and the teammate reads that path first
(`personas/security-engineer/subagent.md:169`). HEAD's one-liner (`curl -fsSL --create-dirs …
raw.githubusercontent.com/wastedcode/truecast/main/personas/<name>/instance-template/mandate.md`, guarded
by `[ -e "$f" ]`) is correct. Keep it.

**Alternatives** (put them behind a disclosure, not on the main path):
- Already in a session, 2.1.275+: `/plugin install truecast --marketplace wastedcode/truecast`, choose
  **Install for you**, then Step 2.
- Older: `/plugin marketplace add wastedcode/truecast`, then `/plugin install truecast@truecast`, choose
  **Install for you**, then Step 2.
- Windows: run Claude Code in WSL. Native Windows isn't tested.

**Later:**
- Take the improvements: in the terminal, `claude plugin marketplace update truecast` (new teammate
  versions), then `claude plugin update truecast@truecast` (the installer; restart Claude Code), then in
  a session `/truecast:update <name>`. It shows the plan first, and your brief is never touched.
- Take it out: `/truecast:remove <name>` (lists, then waits), then `claude plugin uninstall
  truecast@truecast`, then `claude plugin marketplace remove truecast`.
- See what you have: `/truecast:list`.

---

## 5. The page, section by section

Order: **Hero → Today vs. a teammate → The test → The twelve → Install → What you approve → Questions → Close.**
Changed from HEAD: "Today vs. a teammate" is new and comes second, because the brief's core question
("why better than what they do today") had no section of its own. The long "a teammate is a playbook,
a brief and a context window" section is folded into it. The catalog now sits before the full install,
because step 2 needs a name and each catalog row carries its own install line.

### Meta
- `<title>`: **truecast: expert teammates for Claude Code**
- description: **Twelve specialist subagents for Claude Code, already written: security, QA, architecture,
  product, design, sales. Each works from a deep playbook, reads the brief you keep in your repo, and ends
  on a decision. Two commands to set up. Every test we ran is published.**
- og:title: **The expert teammates Claude Code doesn't ship with.**
- og:description: **Twelve specialists, already written. We tested ours against a 76-word agent; it tied on
  holes found and was the only one to end every run on a ship call. All 18 runs are published.**
- og:image: `site/brand/og.png` (exists; the brand designer may redraw it).
- Keep `site/404.html` (deleted in the working tree). Without it, Cloudflare Pages treats the site as a
  single-page app and serves the homepage, with a 200, for every mistyped URL, including broken proof links.

### Nav
`Proof` · `Teammates` · `Install` · `GitHub ↗`. The wordmark links to `/`. No `>` prompt glyph (the brand
retired it).

---

### S1 · Hero
**Purpose:** in five seconds: what it is, that it's better than what they do, and the first command.

**Headline (H1):** **The expert teammates Claude Code doesn't ship with.**
*(Kept, and on merit rather than because it exists. It names the platform, the category and the gap in
nine words, and it's already the GitHub description, the README line and the social card, so it builds
recognition. The alternative I weighed was "Twelve specialists for Claude Code. Each one ends on a
decision." It's sharper on the differentiator but loses the gap. The subhead carries the differentiator
instead.)*

**Subhead:**
> Twelve specialists, already written: security, QA, architecture, infrastructure, product, design, sales.
> Each opens a deep playbook on the job, reads the brief you keep in your repo, and ends on a call you can
> act on: ship or don't, GO or NO-GO.

**Primary CTA (copyable code block, the hero's main object):**
```
claude plugin install truecast --marketplace wastedcode/truecast
```
Under it, one line: **In your terminal, Claude Code 2.1.292 or later. Then in Claude Code:
`/truecast:install security-engineer`.** Link: **Already in a session? →** (goes to S5's disclosure).

**Proof line (directly under the CTA, small):**
> We tested ours against a 76-word agent you could write yourself. Same holes found. Only ours ended every
> run on a ship call. **All 18 runs are published ↓**

**Trust line:** **Free and open source (MIT). You approve every file before it's written.**

**Artifact: one real run, in the shape you'd see it.** Source: `site/proof/rerun/truecast-2.md`, the fair
test (prompt byte-identical across agents, no main-session rewrite). Show:
- the prompt, verbatim: `Review plugin/truecast/bin/truecast-plugin.sh and the slash commands in
  plugin/truecast/commands/. … Can anything here get a user owned? Give your full verdict and findings.`
  (trim to the first and last sentence with "…")
- the verdict, verbatim (line 7): **"Verdict: yes, someone can get owned, but only through `--project`.
  That path is NO-GO until F1 is fixed. The user-scope lane is GO, as long as F2 is fixed before the next
  release."**
- two finding headings, verbatim: **"F1 — P1: a hostile repo can write any file in your home, which leads to
  code execution (reproduced)"** and **"F2 — P2: the install plan shows only `tools:`, so `hooks:` and
  `permissionMode: bypassPermissions` go in without the user seeing them (reproduced)"**
- caption: **security-engineer@1.2.2 reviewing our own installer, 2026-10-16. $1.14, 4.3 min. We fixed
  both in [`834b03d`](https://github.com/wastedcode/truecast/commit/834b03d). Full report →**

*Why truecast-2 rather than HEAD's Fig. 1:* Fig. 1's prompt was rewritten by the main session. By our own
account (`site/proof/README.md`) that prompt alone asked about `~/.claude` writes, so its F2 can't be
credited. HEAD's figure also lists "all 10 tool calls from its log", and the log isn't published (§6, B2).
truecast-2 has a clean provenance, is in the scored test, and found two of the three holes. It's
the best real run, and labelling it "one run" keeps it honest.

---

### S2 · Today vs. a teammate
**Purpose:** answer "why is this better than what I do now?" against each real alternative. Include the
one where we don't win.

**Headline:** **You could write this agent yourself. Here's what you'd still be missing.**

**Body: three rows, alternative → what truecast adds.** Show it as a table or three columns. Each row
carries one artifact.

| What you do today | What it gets you | What a truecast teammate adds |
|---|---|---|
| **Ask the main session** "review this like a security expert" | An answer, with all the digging in your main context | Its own context window and a playbook it opens mid-task. It reads and tests off your thread and hands back the report |
| **Write your own agent file** | One role. On our security test, as many holes found as ours | Twelve roles written, and an author who keeps them current: 199 skills across twelve playbooks. Each one ends on a call |
| **Download a free collection** | One file per role (VoltAgent's security agent: 1,007 words) | A playbook, not a page: security-engineer's is 21 files, 12,697 words. And your brief lives apart from it, so you take updates without losing your edits |

**Below the table: the two-owner idea in one line plus the figure.**
> **The playbook is ours. The brief is yours.** An update rewrites the playbook in `~/.truecast` and stops
> there. Your brief, one file in your repo, is never written by an update.

**Artifact A:** the depth figure for security-engineer (`site/brand/cores/security-engineer.svg`, data in
`site/brand/cores.json`): 21 files to scale, beside the 76-word and 1,007-word agents drawn to the same
scale (`cores/handwritten.svg`; the VoltAgent file's word count is in `site/proof/rerun/README.md`).
Caption: **Size shows what's inside. It isn't a score: on our test the 76-word agent caught as much.**
That caveat is required.

**Artifact B:** the update boundary (HEAD's Fig. 4, kept). Playbook `~/.truecast/personas/security-engineer/`
1.1.0 → 1.2.2, "updates stop here", then `your-repo/.truecast/agents/security-engineer/instance/mandate.md`,
"never written by an update". The path names come from the real plan output.

**Context-window numbers:** HEAD used "66,578 tokens in its context, 2,780-token report". Use them
**only if** the token counts for that run are published under `site/proof/`. Today they aren't (§6, B1).
Otherwise say it without numbers, as in the table.

**CTA:** none. This section persuades, and the next one proves.

---

### S3 · The test
**Purpose:** the discriminating proof, and the trust that comes from publishing the tie.

**Headline (kept from HEAD; it's the most ownable line on the site):**
**It found a real hole in our installer. So did a 76-word agent.**

**Body:**
> Our security-engineer showed that a hostile repo could get its text written into your `~/.bashrc` through
> our installer. We fixed it. Then we gave the same prompt, byte for byte, to three security agents: a
> 76-word one, a 1,007-word one from a free collection, and ours. Six runs each.
>
> Ours found no more holes than the 76-word agent. What only ours did was end every run on a ship call,
> with its findings ranked by when to fix them. None of the other twelve runs did.

**Artifact: the scoreboard** (from `site/proof/rerun/README.md`, every cell linked to its run; HEAD's
Fig. 2 is correct and stays as the base):

| | Hand-written · 1 file, 76 words | Free collection · 1 file, 1,007 words | truecast · 21 files, 12,697 words |
|---|---|---|---|
| Hostile repo writes into `~/.bashrc` (temp files) | 6 of 6 | 5 of 6 | 5 of 6 |
| Agent files carry hooks the plan never showed | 1 of 6 | 1 of 6 | 2 of 6 |
| Claude could run the commands unasked, all Bash allowed | 2 of 6 | 0 of 6 | 2 of 6 |
| **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
| **Ended on a ship call** | **0 of 6** | **0 of 6** | **6 of 6** |
| Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

Row-label footnote, required: **truecast's six calls: four NO-GO, one split (NO-GO for `--project`, GO for
user scope), one CONDITIONAL GO.** (HEAD says "an explicit GO or NO-GO" without this. A reader who opens
truecast-6 finds CONDITIONAL GO and feels misled. §6, B3.)

**Fine print** (one paragraph, small): Claude Code 2.1.301, `claude-opus-5-5`, `claude -p --agent`. In 8 of
18 runs Claude Code switched to `claude-opus-4-8` partway (hand-written 4, free 2, ours 2). A safety
classifier interrupted 10 of 18 runs; every one still returned a report. The scoring was fixed to the three
holes fixed in `834b03d` before any report was read. The free-collection agent is VoltAgent's
`security-engineer.md` at `408d3c9`, with only its tools and model lines changed to match.

**The honest close (keep it short):**
> So on catching holes, a short prompt held its own, and ours cost 19¢ more a run. The ship call comes from
> its agent file, and you could ask your own agent for one. What you'd still be writing yourself is the
> other eleven roles, and keeping them current. This is one review of one kind of work. It says nothing yet
> about the other eleven.

**CTAs (text links):** **All 18 reports and how we scored them →** (`site/proof/rerun/README.md`) ·
**The first review, and why we reran it →** (`site/proof/README.md`)

**Follow-up note** (small, keep it): **The test also turned up a fourth hole: an update could write
somewhere other than its plan showed. Installer 0.1.2 fixes all four. `claude plugin list` shows your
version; to update, see Later ↓.**

---

### S4 · The twelve
**Purpose:** let them pick the one for the call in front of them, and install it from the row.

**Headline:** **Twelve teammates. Pick the call you'd rather not make alone.**
(Kept from HEAD. It names the job, not the feature.)

**Row format:** name · `/truecast:install <name>` [Copy] · the call (a question) · "Its agent file asks
for:" (the deliverable) · Can touch · `N skills · N files · N words` · See inside → (GitHub
`personas/<name>/core/`). Group by lane: Build · Ship · Decide · Design · Market · Raise.

Counts were recomputed 2026-10-17 from `personas/*/core` and match HEAD. Tools come from `persona.toml`.
The deliverables match each agent's `agent.md`.

| Lane | Teammate | The call | Its agent file asks for | Can touch | Size |
|---|---|---|---|---|---|
| Build | software-architect | "How should this be built so it lasts?" | a design doc with a real diagram, and an ADR for each hard-to-change call | reads, writes files, web | 18 skills · 22 files · 13,025 words |
| Build | software-engineer | "Can I trust this code?" | code proven by trying to break it, shipped in small safe steps | reads, edits files, runs commands, web | 13 · 16 · 6,697 |
| Build | qa | "What breaks before a user finds it?" | a ship or don't-ship verdict, with the blocker list | reads, runs commands, web | 17 · 20 · 13,107 |
| Ship | security-engineer | "Can this get someone owned?" | findings at file:line, each graded, and a GO or NO-GO | reads, runs commands, web | 17 · 21 · 12,697 |
| Ship | infrastructure | "Will this hold up in production?" | commands that run first time, with how to undo them | reads, edits files, runs commands, web | 21 · 24 · 14,121 |
| Decide | product-manager | "Are we building the right thing?" | a validated spec, its success bar, and an acceptance verdict | reads, web | 17 · 21 · 8,570 |
| Decide | product-researcher | "What are users actually telling us?" | findings ranked by confidence, each with its receipts | reads, web | 16 · 21 · 8,035 |
| Design | ui-ux-designer | "Can people actually use this?" | user flows and a design it has rendered and checked at every size | reads, edits files, runs commands, web | 21 · 24 · 17,284 |
| Design | brand-designer | "Would anyone remember us?" | one brand idea, a mark tested at 16px, and the identity as tokens | reads, edits files, runs commands, web | 9 · 11 · 5,116 |
| Market | product-marketer | "Why would anyone care?" | the positioning, the copy, and a will-it-land verdict | reads, web | 18 · 23 · 16,902 |
| Market | sales | "Who would actually pay for this?" | a painkiller-or-vitamin verdict and a buyer profile, with the evidence | reads, web | 16 · 20 · 12,361 |
| Raise | vc-seed | "Would an investor write the check?" | an invest-or-pass call and the one risk it would underwrite | reads, web | 16 · 20 · 8,470 |

Tool key (footnote): **reads = Read, Grep (+ Glob) · writes files = Write · edits files = Edit + Write · runs
commands = Bash, which can also change files · web = WebSearch + WebFetch. The install plan lists each
one's tools exactly before you say yes.**

Required caveat (footnote, keep verbatim in spirit): **"Its agent file asks for" is what each one's
instructions tell it to hand back, not a result we've tested. Only security-engineer has been tested (the
test above).**

**Artifact:** each row's depth band (`site/brand/cores/<name>.svg`), all drawn to one scale.
Above the list, one line: **First time? Run the terminal step once (↓ Install).**

---

### S5 · Install
**Purpose:** get from zero to a working `@agent-…` with no surprises. Show the real outputs so nothing
on screen is unexpected.

**Headline:** **Two commands to set up. Then call it by name.**

**Steps:** exactly §4, Steps 1–4. Each step gets a heading, the copyable command, one or two lines of
guidance, and the real output where §4 has it. Step 2's artifact is **the plan, verbatim**, labelled
**"The plan the installer prints · verbatim, re-run 2026-10-17, home shown as ~"**.

Step copy:
1. **In your terminal.** `claude plugin install truecast --marketplace wastedcode/truecast` — **Needs Claude
   Code 2.1.292 or later (`claude --version`). That's the installer; you run it once per machine.**
2. **In Claude Code, in any project.** `/truecast:install security-engineer` — **Was Claude Code already
   open? Run `/reload-plugins` first. You'll see its plan before anything is written. Say yes and it's
   ready. Want a different one? Swap the name.**
3. **Call it by name.** `@agent-security-engineer review the changes on this branch before I merge` —
   **Or type @ and pick it. If it isn't in the list, restart Claude Code once.**
4. **Give it your brief** *(optional)*. The guarded one-liner from §4 — **One file in your repo: what the
   project is, what matters, where the bar is. It reads it first, and updates never touch it. No brief? It
   works from what you ask.**

**Disclosures** (collapsed): *Already in a Claude Code session?* · *Before 2.1.275?* · *On Windows?* ·
**Later: take the improvements, or take it back out**. Copy for each is in §4.

**CTA:** the step 1 copy button. It's the same command as the hero, which is deliberate.

---

### S6 · What you approve
**Purpose:** answer "why would I let some Markdown into my home directory?" with outputs, not adjectives.

**Headline:** **You approve every file the installer writes.**

Four short blocks, each with its proof:
1. **You see the plan.** **The version, the tools, every path it will write. Then it waits. If it would
   replace a file it wrote before, you see the diff first.** Artifact: the line `nothing has been written
   yet.`, quoted from the step 2 plan.
2. **Every tool is on the label.** **Five of the twelve can only read, search and fetch web pages. Seven can
   also run commands or write files. The table above and the install plan say which.** (Verified: PM, PMM,
   researcher, sales and vc-seed are read + web.)
3. **It won't overwrite an agent file you wrote.** **We pointed it at a home that already had a hand-written
   `security-engineer.md`. It refused, even with `--force`:** Artifact (re-run 2026-10-17, paths trimmed,
   machine line removed):
   ```
   ~/.claude/agents/security-engineer.md exists and truecast did not write it.
   error: refusing to overwrite a file truecast did not generate: ~/.claude/agents/security-engineer.md
   ```
   (Run with `--yes --force`. The file was unchanged afterwards.)
4. **Nothing runs on our servers. We don't have any.** **The installer copies from the clone Claude Code
   already made from GitHub. truecast collects nothing. Teammates with web tools can fetch pages, like any
   Claude Code agent with those tools.**

Sign-off line: **Open source, MIT. Built by Inder Singh (wastedcode). Found a hole? [SECURITY.md]: we aim to
acknowledge within 72 hours.** (Verified: `SECURITY.md:24`.) Don't write "our security-engineer found
every hole in the installer". All three agents found the temp-file hole, and VoltAgent's agent co-found
the fourth (CHANGELOG, installer 0.1.2). The true version is already in S3.

---

### S7 · Questions
HEAD's FAQ is accurate. Keep these six, tightened:

- **I already wrote an agent file. Why switch?** If it does the job, keep it: on our test a 76-word agent
  caught as much as ours. truecast won't install over it. What it adds is the rest: eleven more roles
  already written, a brief per role in your repo, updates that never touch it, and a plan before anything
  is written. To run ours beside yours, rename yours first, or install ours as a plugin
  (`/plugin install security-engineer --marketplace wastedcode/truecast`, 2.1.275+) and call it
  `@agent-security-engineer:security-engineer`.
- **What about the big free collections?** We tested one: VoltAgent's 1,007-word security-engineer, same
  prompt, six runs. It raised 6 of a possible 18, against 9 for ours and 9 for the 76-word agent, and it was
  the cheapest at $0.68 a run. One test, not a benchmark. Every report is unedited.
- **What does it cost?** Nothing to install. Each teammate runs on Opus, on your own Claude Code usage. In
  the test, a truecast review averaged $1.04 at API prices.
- **Does it learn my project?** Not on its own. It reads your brief every time, so it knows what you've
  written there. Edit the brief and the next run picks it up.
- **Can my whole team get it?** Yes. Merge these keys into the repo's `.claude/settings.json` (the HEAD JSON
  block, which is correct per README). Anyone who trusts the folder is offered the teammate. Installed this
  way it answers to `@agent-product-manager:product-manager`, and updates come with the marketplace, without
  the plan step. Commit it only for a marketplace you trust.
- **Can I write my own?** Yes. A teammate is a folder of Markdown and one `persona.toml`. Authoring guide →
  Open a PR to add it to the catalog.

Footer note: **The installer and the file formats are pre-1.0; they may change between minor versions.**

Don't add a "Does it work with the CLI / npm?" question. npm is 0.2.0 and lacks the lane-sharing in the
README. Link docs instead.

---

### S8 · Close
**Purpose:** one last push, at the painkiller moment.

**Headline:** **Put a specialist on the call you're about to make.** (Kept from HEAD.)
**CTA:** the step 1 command with Copy, then **Go to step 2 ↓**. Secondary: **Read the source on GitHub →**.
Tertiary: **Used one? Tell us what it caught, or missed →** (GitHub issues). It's the only feedback loop
the page has, so keep it.

**Footer:** truecast · MIT · © 2026 Inder Singh · GitHub · Docs · Changelog · Security · Issues.

---

## 6. Every current-site claim that's false or unbacked

### A. The staged working-tree page (would deploy on merge)

| # | Claim | Verdict | Fact |
|---|---|---|---|
| A1 | "Eleven teammates" / "Eleven open-source expert teammates" (meta, catalog, Open-format section) | **False** | Twelve; `brand-designer` is missing from the catalog |
| A2 | Terminal mock: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", "+5 tool uses" | **Invented UI** | No such run is published. The published runs are 2.1.301 / `claude-opus-5-5` |
| A3 | "Verdict: GO. Core trust surface is sound; both known escapes verified closed." | **False** | The real review of the installer was **NO-GO for `--project`** (`site/proof/security-engineer.md`). This quote exists nowhere |
| A4 | "Read-only by default" (hero trust line and "Least privilege") | **False** | 7 of 12 can run commands or write files (`persona.toml` tools) |
| A5 | "Anthropic's own team found focused multi-agent setups beat a single general agent by 90.2%" | **Borrowed, non-discriminating** | Anthropic's research system, not this product. It implies a gain truecast's own test didn't show. Cut |
| A6 | `instance/notes`, "the notes it kept", `persona.md` in the update diagram | **False** | Nothing writes notes (`work.md` is planned, README); the file is `agent.md` |
| A7 | `@security-engineer` as what you type, "you call it by its bare name" | **Wrong form** | Typed by hand it's `@agent-security-engineer`; a bare `@name` can resolve as a file (CHANGELOG, installer 0.1.2) |
| A8 | Install as `/plugin marketplace add` + `/plugin install truecast@truecast` as the main path, "Pastes straight into Claude Code" | **Outdated** | Works, but `/plugin install` opens a panel (choose Install for you), so it doesn't "paste straight in". The primary path is now the terminal one-liner |
| A9 | Updates: "/plugin marketplace update truecast, then /truecast:update" | **Incomplete** | Leaves users on an old installer. `claude plugin update truecast@truecast` + restart is needed (docs/install.md) |
| A10 | "truecast prompt <name> prints the exact prompt" (trust quadrant) | **Not on the advertised lane** | Needs the npm CLI. Plugin users never have it |
| A11 | "Other marketplaces … hundreds of plugins … truecast: eleven, deep" chart | **Unbacked comparative** | No receipt for "hundreds, shallow"; wrong count |
| A12 | "you read the exact prompt before you run it" | **False on the plugin lane** | The plan shows version, tools and paths, not the prompt |
| A13 | `site/404.html` deleted | **Regression** | Every bad URL would get the homepage with a 200 |
| A14 | "Native: Anthropic's own mechanism" | True but non-discriminating | Every subagent is. Fine as a fact, weak as a reason |

### B. The live page (HEAD) and README: mostly true; these need fixing or a receipt

| # | Claim | Verdict | Fix |
|---|---|---|---|
| B1 | "66,578 tokens · 10 tool calls" in its context vs "2,780 tokens: the report" (page and README:36) | **Unbacked publicly.** Not in any file in the repo or `site/proof/` | Publish the run's usage figures (and tool-call list) in `site/proof/README.md`, or drop the numbers |
| B2 | Fig. 1 "All 10 tool calls from its log" (read …, opened …, fetched …, ran the attack in a sandbox 3 runs) | **Unbacked publicly.** The log isn't published | Publish the tool-call list, or use truecast-2 as the hero (this deck does) |
| B3 | "ended every run on an explicit GO or NO-GO" | **Imprecise.** truecast-6 is "CONDITIONAL GO"; truecast-2 is split | Say "a ship call" and footnote the breakdown (S3) |
| B4 | Fig. 1 shown as "a real review, run the usual way" in the hero | True, but its prompt was rewritten by the session, and HEAD's own small print says F2 can't be credited | Lead with a fair-test run instead |
| B5 | README: "Twelve roles, already written and kept current" | "Kept current" is a promise, not a fact. Backed only by the version history | Fine in the README. On the page say "versioned, with updates that never touch your brief" |
| B6 | README: "From CLI 0.3.0 … npm still serves 0.2.0" | True; npm is 0.2.0 | Keep the CLI off the homepage |
| B7 | "Five of the twelve can only read…" | True (verified) | Keep |
| B8 | All playbook counts, the scoreboard, costs, "P1 in 4 of 5", 72-hour SLA, plan output, refusal output | True (re-verified 2026-10-17) | Keep |

---

## 7. Calls I made without the founder (reversible), with the alternative

1. **H1 kept** ("The expert teammates Claude Code doesn't ship with."). *Alternative:* "Twelve
   specialists for Claude Code. Each one ends on a decision." Switch if the brand idea moves away from
   "teammate".
2. **The hero's lead differentiator is "ends on a call you can act on"**, because it's the only one the
   test discriminates on. *Alternative:* lead on depth ("199 skills"). Rejected: our own test says depth
   didn't catch more, and leading on it invites that rebuttal.
3. **Hero artifact = fair-test run truecast-2**, not HEAD's Fig. 1. *Alternative:* keep Fig. 1 and publish
   its log (fixes B1/B2).
4. **Default teammate in every install example = security-engineer**, the only tested one.
   *Alternative:* product-manager (the README's default). It's broader-appeal but has no proof behind it.
5. **New S2 "Today vs. a teammate"** replaces HEAD's three-part explainer. *Alternative:* keep HEAD's
   explainer and add a comparison row to the FAQ.
6. **No CLI, no npm, no star count on the page.** *Alternative:* a "Prefer a CLI?" footer link to
   docs/install.md (harmless; the designer may add it).
7. **The "fourth hole / installer 0.1.2" note stays.** Existing users on 0.1.0/0.1.1 need it.
   *Alternative:* move it to the changelog only. Revisit once 0.1.2 is a week old.

## 8. Hand-off to brand-designer and ui-ux-designer

- **Don't merge the staged `site/` as it stands.** Build the new page from this deck. Restore `site/404.html`.
- Every artifact named above exists in the repo. Use those files, and re-derive the numbers with
  `scripts/brand/build.py --check` / `page.py --check` (`pnpm test` runs both).
- Hard rules: no invented terminal chrome, version strings, model names, logos, testimonials, or counts.
  Every number links to its receipt. Every typed mention is `@agent-<name>`. The depth figure always
  carries "Size isn't a score".
- Copy length is set for desktop. On mobile the scoreboard must stay a table (the claim lives in the
  comparison). Collapse the fine print, not the rows.
