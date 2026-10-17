# truecast.dev homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) → ui-ux-designer (the page).
Status: final copy for the build. The founder was away for this run, so every reversible call below was
taken on my own recommendation and logged in §9 with the alternative I rejected.

## 0. The goal, and how this deck is checked

**Target:** zero claims on the page that a cold fact-checker can't trace to a file in this tree or to
command output captured for this deck. A fresh reader who sees only the hero should answer all three
5-second questions correctly: what is it, why it beats what I do today, what I do next. Visible copy
(not counting verbatim artifacts: command output, report excerpts, file lists) stays at **≤ 1,500 words**.
The live page has about 3,200 words, artifacts included.

**How it's checked:** `internal/deck-check.py` (git-ignored like this deck; see §8 for making it
durable) recomputes every playbook number in this deck from
`personas/*/core` and every fair-test number from `site/proof/rerun/README.md`, and fails on a mismatch.
A fresh-context reviewer gets only this deck and the repo and is told to break it. The results are in
the hand-off.

**The job this page does (as a verb):** get a Claude Code user to believe, in one screen, that they can
add a specialist that hands back what its role owes them, such as a GO or NO-GO. Then get them to trust it enough to run two commands.

---

## 1. Who it's for, and the 5-second belief

**The reader.** A developer who uses Claude Code every day and ships alone or on a small team with no
security, QA, product or design person to ask. They already know what a subagent is. Many have written
one ("act as a senior X") or browsed a free collection. They're skeptical of personas, and in their own
words they have reason to be:

- "Typically I find that just adding 'act as a Senior Python engineer with experience in asyncio' or
  some such to be nearly as good." (news.ycombinator.com/item?id=46042777)
- "all of these 'agents' with their 'personas' are the same baseline LLMs… just told to basically
  pretend they're different." (news.ycombinator.com/item?id=47255366)
- "Keeping these agents in sync manually is a maintenance nightmare." · "Update a Python convention and
  you're touching six agent files." (dev.to, andr_bremer, "Keeping your Claude Code subagents aligned")
- "A zoo of 100 agents triggers less reliably than a sharp set of 10." · "Collecting agents like trading
  cards." (dev.to, suraj_khaitan, "I built 100 Claude Code subagents…")
- "when I manually type it claude doesn't call it and instead make a generic TASK"
  (github.com/anthropics/claude-code/issues/8558)
- "eventually, something needs to be so good and with so much community best practices in it, that it
  will beat a DIY one." (news.ycombinator.com/item?id=49945677)

**The moment they need it:** right before a call they'd rather not make alone. Merging a branch that
touches auth or the user's home directory, launching, deciding what to build, pricing.

**The 5-second belief (what the hero must leave in their head):**
> "Twelve specialist subagents for Claude Code, already written and kept current. I call one by name,
> it hands back what that role owes me (for security, a GO or NO-GO), and the installer shows me every
> path before it writes. Two commands."

**Awareness stage:** solution-aware, and skeptical of the solution. So the page answers "isn't this just
a prompt?" in the second section, honestly, and doesn't make the reader wait for it.

## 2. The painkiller and the loop, said out loud

- **Acuity: medium, and I won't dress it up.** Our own fair test shows a 76-word agent catches as many
  security holes as ours (9 of 18 each). Nobody will switch for catch rate, and the page must not imply
  they should. What truecast gives instead is real but structural: twelve roles already written, a brief
  per repo that updates never touch, a deliverable each role is told to hand back, and an installer that
  shows its plan before it writes. For most readers that's a strong vitamin. It becomes a painkiller
  at the pre-merge or pre-launch moment, but only for a reader with no specialist to ask.
- **Biggest positioning risk:** every published proof is one teammate (security-engineer) on one kind of
  work, and Claude Code ships a built-in `/security-review`. The page has to say that before a visitor
  does (FAQ, §5.8).
- **The loop exists, and the page under-sells it.** Committing two keys to a repo's
  `.claude/settings.json` makes Claude Code offer the teammate to everyone who opens that repo. That is
  the only distribution loop truecast has. It stays on the page (FAQ "Can my whole team get it?"),
  phrased as a team benefit.
- **The one channel:** GitHub plus the copy-paste install line. There's no in-product discovery
  (truecast isn't in Anthropic's official marketplace). Every install starts with a visitor copying a
  command, so the command block is the most important element on the page.
- **What would change the verdict (for the founder, not the page):** a byte-identical fair test of a
  non-security teammate (qa or product-manager, n≥6) where the playbook beats a short prompt on a scored
  deliverable. Until that exists, the page argues from structure plus one candid test.

## 3. Positioning (Dunford 5+1). The page derives from this.

**Competitive alternatives (what they'd do if truecast didn't exist):**
1. Ask Claude Code directly in the main thread. This is the most common.
2. Write their own agent file in `~/.claude/agents/`. Our test shows this works for catching bugs.
3. Install from a free collection. VoltAgent/awesome-claude-code-subagents has "161+" agents in one
   file each and no versions. wshobson/agents has 202 agents across 94 plugins (both READMEs, read
   2026-10-17).
4. For security only: the built-in `/security-review` ("Complete a security review of the pending
   changes on the current branch") or Anthropic's `security-guidance` plugin.

**Unique attributes (all shipped, on main today):**
| Attribute | Where it's true |
|---|---|
| 12 roles, each a versioned playbook of 9–21 skills (5,116–17,284 words) that it Reads on demand | `personas/*/core`, `persona.toml` versions |
| Each agent file names what that role must hand back. Six of the twelve end on an explicit call (GO/NO-GO, ship/don't-ship, invest/pass, painkiller-or-vitamin, an acceptance verdict, a will-it-land verdict) | `personas/*/core/agent.md` (grep) |
| A brief per repo (`.truecast/agents/<name>/instance/mandate.md`) that no update writes to | template header; the installer only creates it if missing (`scaffold_mandate`, `truecast-plugin.sh:571–583`, `--project` only) and never overwrites it |
| The installer prints a plan (version, tools, every path) and writes nothing until you say yes | captured output, §6 |
| Refuses to overwrite an agent file it didn't write; `--force` doesn't override that | captured output, §6 |
| Installed under the bare name in every project (`@agent-security-engineer`), not the plugin form `security-engineer:security-engineer` | installer ready line; CHANGELOG 0.1.2 |
| Copies from Claude Code's own clone on disk, with no truecast server | `plugin/truecast/bin/truecast-plugin.sh`, docs/install.md |
| Open source (MIT), and its one comparison is published run by run, including where it lost | `LICENSE`, `site/proof/rerun/` |

**Value (each traced to an attribute):** a specialist for the call you'd rather not make alone that you
don't have to write or maintain, that hands back the thing its role is accountable for, and that you can
inspect before it touches your machine.

**Who cares most:** daily Claude Code users who ship without a specialist on hand. The beachhead is the
pre-merge security review, because it's the one with a published test.

**Category:** "expert teammates for Claude Code": the subagent category the reader already knows,
framed as a small cast rather than a catalog. I'm deliberately not inventing a new category.

**Trend (true for us):** subagents and plugins became normal in Claude Code in 2025–26. We ride that and
claim nothing about AI capability beyond it.

**One-liner:** truecast gives Claude Code twelve expert teammates, already written and kept current, that
you call by name, each told what to hand back. You see every path before the installer writes.

### Proof that discriminates, and proof I cut

| Proof | Source | Beats which alternative | Strength / ruling |
|---|---|---|---|
| Every truecast run (6 of 6) closed on an explicit GO or NO-GO: NO-GO in five (runs 1–5), CONDITIONAL GO in one (run 6), and three of the six split the call by lane; 0 of the other 12 did. One hand-written run said "Don't ship this until #1 and #2 are fixed." | `site/proof/rerun/README.md` "how it ended" column | #2, #3 | **Discriminates, modestly.** Lead proof, always paired with the tie. Say "an explicit GO or NO-GO, some conditional", never "a clean GO or NO-GO": a skeptic who opens truecast-2, -5 or -6 will see the splits. |
| It caught as many holes as a 76-word agent: 9 of 18 each, against 6 of 18 for VoltAgent's 1,007-word agent. It cost $1.04 a run against $0.85 | same | none, it's candor | **Trust proof.** Keep, stated plainly. It's why a skeptic believes the rest. |
| It found a real hole in our own installer (a hostile repo could write into `~/.bashrc`), and we fixed it in `834b03d` | `site/proof/security-engineer.md`, commit 834b03d | #1 | True. All three agents found it, so it only proves "real work on real code". |
| Fair-test runs found a fourth hole we hadn't scored (update could write outside its plan), fixed in installer 0.1.2 | CHANGELOG "Installer plugin 0.1.2"; raised in `truecast-4.md:18`, `free-6.md:44`, `free-3.md:17` (and noted in passing in `free-5.md:41`) | — | True. At least three runs raised it, two of them free-collection. The CHANGELOG credits only two, and so did the live page. The page says "a few runs" and gives no count. |
| The plan output, the refusal output, the "ready" line | captured 2026-10-17, §6 | #3 (free collections copy files with no plan) | **Discriminates** on install safety. |
| 21 files · 12,697 words vs 76 and 1,007 | `personas/security-engineer/core` | — | True but **not quality proof**: the test showed size didn't raise the catch rate. Use it only as "what you'd otherwise write and maintain", never as "deeper, so better". |
| "66,578 tokens in its own context, 2,780-token report" | README.md:36, live page | #1 | **Cut.** No published artifact backs it: the session log isn't in the repo (page.py cites `session-truecast.jsonl`, which isn't committed). It goes back only if a trimmed log is committed to `site/proof/`. |
| "All 10 tool calls from its log" (live Fig. 1) | same | — | **Cut**, same reason. |
| Anthropic's "90.2%" multi-agent quote (staged page) | Anthropic blog | — | **Cut.** It's borrowed proof about a different system, and it implies a result we didn't get. |
| Star counts | GitHub API | — | **Cut.** We have 8; the alternatives have 25k–41k. Showing ours hurts, and showing theirs is punching sideways. |

**Good-look check before naming names:** VoltAgent is named because we ran their file, pinned the commit,
changed only two lines, and published every run, including the fact that theirs was cheapest. That reads
as fair, so keep it. wshobson and Anthropic's plugins aren't named on the page, except `/security-review`
in one FAQ answer, framed as "we haven't tested against it".

## 4. Messaging house and voice

**Roof (core message):** expert teammates for Claude Code, already written, kept current, and installed
only after you've seen the plan.

| Pillar | Claim | Proof on the page |
|---|---|---|
| A deliverable, not a chat | Each teammate is told what to hand back. Security-engineer ended 6 of 6 runs on an explicit GO or NO-GO, some conditional | Fig. 2 verdict row, the roster's "asks for" column |
| Written once, kept current | Twelve roles you don't write; updates improve the playbook and never touch your brief | Playbook file list, Fig. 4 (where an update stops), `/truecast:update` |
| You see it before it lands | Plan first; won't overwrite your files; tools on the label; no server | Captured plan and refusal output |
| Checkable | MIT, plain Markdown, every test run published, including the tie | Links to `site/proof/` and the GitHub folders |

**Voice spec (short; the full one belongs in `.truecast/agents/product-marketer/instance/`):**
- Register: plain, short sentences, numbers you can check. The live page's voice ("It caught as many
  holes, no more") is the reference sample. Hold it.
- Words we use: teammate, playbook, brief, call, plan, run, hole, fix. Use "teammate" on the page and
  never "persona" (persona is the code and docs word).
- Words we never use: seamless, powerful, unlock, supercharge, AI-powered, deep (as praise), best-in-class,
  "not a costume", "not a skill dump", "real" (as an intensifier).
- Stance: we're for showing the receipt, including where we lost. We're against agents that claim to
  be experts without showing what they read.
- Mention form: `@agent-<name>`, or "type @ and pick it". **Never a bare `@security-engineer`** typed by
  hand. CHANGELOG 0.1.2 says a typed bare `@name` can resolve as a file.
- Structure tells to avoid: "it's not X, it's Y", reflexive lists of three, uniform paragraph lengths,
  em-dash asides. Colons and full stops do that work.

---

## 5. The page, section by section

Order and reasoning: hook → the skeptic's first objection (is it just a prompt?) → what you get that a
prompt doesn't → pick one → install → why it's safe → later → questions → close. Each section answers
the question the previous one raises.

### 5.0 Nav
`truecast` (wordmark, links to /) · **Teammates** · **Proof** · **Install** · **GitHub ↗**
(GitHub → https://github.com/wastedcode/truecast)

### 5.1 Hero

**Purpose:** pass the 5-second test and give the one action.

**Headline (H1), kept from the live page:**
> The expert teammates Claude Code doesn't ship with.

**Sub (rewritten from the live page; reason in §9 D2):**
> Twelve specialists, already written: security, QA, architecture, infrastructure, engineering, product,
> research, UX, brand, marketing, sales and a seed investor. One terminal command sets truecast up, one
> line in Claude Code adds a teammate, then you type @ and pick it in any project. Each has a playbook of
> Markdown skills it can open on the job, and follows the one-file brief you keep in your repo, if you
> write one. Updates never touch your brief.

**Primary CTA, a copy block (the most important element on the page):**
```
claude plugin install truecast --marketplace wastedcode/truecast
```
Button label: **Copy**. Caption under it:
> In your terminal (Claude Code 2.1.295+). Then in Claude Code: `/truecast:install security-engineer`
> (open already? `/reload-plugins` first).

Secondary link: **Already in a session? Install from there →** (to §5.5 "Already in a Claude Code session?")
Small print on the same line: **Free and open source (MIT)**

**Proof line (under the CTA):**
> We tested our security-engineer against a 76-word agent you could write yourself: the same prompt, six
> runs each. It caught as many holes, no more. It was the only one that ended every run on an explicit
> GO or NO-GO, some with conditions. **All 18 runs, published ↓**

**The artifact that carries the hero: Fig. 1, one real run, verbatim.** Use fair-test run `truecast-2`.
Its prompt was typed straight to the agent, so it needs no "the session rewrote it" caveat. It's one of
the two runs that opened playbook skills (the verdict and grading skills), so "a playbook it can open" is
shown, not asserted. Its three finding headings are short enough to show whole. It's at the top of
the spread: three of our six runs found two holes, as this one did, and three found one. The caption
gives that spread. Show:

```
$ claude -p "Review plugin/truecast/bin/truecast-plugin.sh and the slash commands in
  plugin/truecast/commands/. … Can anything here get a user owned? Give your full verdict
  and findings." --agent security-engineer

Verdict: yes, someone can get owned, but only through `--project`. That path is NO-GO until
F1 is fixed. The user-scope lane is GO, as long as F2 is fixed before the next release.

F1 — P1: a hostile repo can write any file in your home, which leads to code execution (reproduced)
F2 — P2: the install plan shows only `tools:`, so `hooks:` and `permissionMode: bypassPermissions`
         go in without the user seeing them (reproduced)
F3 — P3: the commands don't say how to handle a `--project <path>`
```
Caption:
> **Fig. 1** Run 2 of 6, 2026-10-16: security-engineer 1.2.2 reviewing our own installer before the
> fix. Verdict and headings verbatim; prompt shortened. It raised two of the three
> holes we scored (Fig. 2), as half our runs did. (`--project` installs a teammate into one
> repo.) We fixed F1 and F2 in installer 0.1.1, which now refuses any agent file that carries hooks. This run's
> F3 (quoting the `--project` path) is still open. **Full report, unedited →**
> (`site/proof/rerun/truecast-2.md`)

Fix status, checked in code: F1 (temp files) and F2 (hooks) were fixed by `834b03d`, installer 0.1.1.
`truecast-plugin.sh:272–279` now uses `mktemp`, and frontmatter keys are allowlisted. F3 is **not
fixed**: `commands/install.md` Step 0 still says nothing about quoting or checking the `--project <path>`
value, and `parse_args` (:601–611) takes it as is. **Engineer item:** if it's fixed before merge, change
the caption to "We fixed all three in installers 0.1.1 and 0.1.x."

Designer note: the verdict is `truecast-2.md:7` and the headings are lines 9, 27 and 38, all verbatim.
Don't rephrase them; wrap them. Backticks may render as code. The playbook beside the run can show which
two skills it opened (`write-the-security-verdict`, `grade-and-remediate-risk`; source: rerun README).

### 5.2 Proof: "isn't it just a prompt?" (id `proof`)

**Purpose:** meet the skeptic's first objection head-on, in their words, before they leave with it.

**Headline:**
> Isn't it just a prompt? At catching holes, a short one tied it.

**Body:**
> One prompt, byte for byte, went to three security agents: a 76-word
> one you could write in a minute, VoltAgent's free 1,007-word one, and ours.
> Six runs each, scored on three holes we'd fixed, with the scoring set before we read a report.
>
> Ours tied the 76-word agent, at $1.04 a run against $0.85, and no run found all three. Only ours ended
> every run on an explicit GO or NO-GO, with findings graded by when to fix them. It comes from its agent file; your own
> agent could ask for it too.

**Artifact, Fig. 2 (the fair-test grid; cells verbatim from the summary table in `site/proof/rerun/README.md`; the last row is that README's "closed on an explicit GO / NO-GO" count. handwritten-3's "Don't ship this until #1 and #2 are fixed" is a ship call without GO/NO-GO, and the close of §5.2 doesn't hide it):**

| | Hand-written · 1 file · 76 words | Free collection · 1 file · 1,007 words | truecast · 21 files · 12,697 words |
|---|---|---|---|
| A hostile repo writes into your `~/.bashrc` (temp files) | 6 of 6 | 5 of 6 | 5 of 6 |
| Agent files carry hooks the plan never showed | 1 of 6 | 1 of 6 | 2 of 6 |
| Claude could run the commands unasked, with all of Bash allowed | 2 of 6 | 0 of 6 | 2 of 6 |
| **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
| **Closed on an explicit GO or NO-GO** | **0 of 6** | **0 of 6** | **6 of 6** |
| Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

Keep the per-run squares (each square is one run, in order) if the designer draws it; the data is the
run table in the same README.

**Caption (method, kept short; the rest is one click away):**
> **Fig. 2** Six runs each, 2026-10-16, Claude Code 2.1.301, claude-opus-5-5. In 8
> runs it switched to claude-opus-4-8 partway. A safety
> classifier interrupted 10 runs; all returned a report, though free-3's says it couldn't finish. The free
> agent is VoltAgent's `security-engineer.md` at `408d3c9`, tools and model lines matched.

**Close of section (one short paragraph):**
> It's one review of one kind of work; it says nothing yet about the other eleven. We fixed the grid's
> three holes in installer 0.1.1, and a fourth that a few runs raised (an update writing outside its
> plan) in 0.1.2.

**Links:** **All 18 reports, and how we scored them →** (`site/proof/rerun/README.md`) ·
**The first review, run inside a normal session →** (`site/proof/README.md#the-first-review`)

**Under the links, small:** "Already have truecast? Update the installer: see *Later* ↓"

### 5.3 What you get (id `what`)

**Purpose:** say what a prompt doesn't give you, now that the reader trusts us.

**Headline:**
> You could write all twelve. You'd also have to keep them current.

**Lede:**
> A teammate has a playbook its author maintains and a brief you keep. An update can change the first
> and never writes to the second.

**Three blocks (one idea each):**

**The playbook.**
> For security-engineer: 17 skills, 3 reference notes and its agent file, 21 Markdown files and 12,697
> words, plus a `persona.toml` manifest. It can open any of them mid-task: in Fig. 1 it opened two, and in four of six test runs
> none. They load only into that teammate, never your main session. **Open the folder on GitHub ↗**
> (`/tree/main/personas/security-engineer/core`)

Artifact, Fig. 3: the 21 files, one band per file, sized by word count (data:
`site/brand/cores.json`; it's what `scripts/brand/page.py` already draws). The full list is behind a
"List all 21 files" disclosure.

**Your brief.**
> One file in your repo, `.truecast/agents/security-engineer/instance/mandate.md`: what the project is,
> what matters, where the bar is. The teammate reads it first. No brief? It works from what you ask. **Start one: step 4 ↓**

Artifact, Fig. 4: where an update writes and where it stops.
`~/.truecast/personas/security-engineer/` (the playbook, its author's: 1.1.0 → 1.2.2) | **updates stop
here** | `your-repo/.truecast/agents/security-engineer/instance/mandate.md` (yours: never written by an
update). Both versions are real: 1.1.0 and 1.2.2 are in `persona.toml`'s git history.

**Its own context window.**
> It's a native Claude Code subagent: it digs in its own context and hands your session the report.

(No numbers here. See §3: the token figures have no published source. If the founder commits the trimmed
log to `site/proof/`, the line can come back: "In Fig. 1's first review it read 66,578 tokens and handed
back 2,780.")

### 5.4 The twelve (id `teammates`)

**Purpose:** let the reader pick the one for their problem and copy its install line.

**Headline (kept from the live page):**
> Twelve teammates. Pick the call you'd rather not make alone.

**Sub:** "First time? Run step 1 below, once."

**Table: one row per teammate.** Columns: Teammate (name + its playbook drawn to scale) · The call it
helps with · Its agent file asks for · Can touch · Size · Install line (copy) · "See inside →" (GitHub
`/tree/main/personas/<name>/core`).

| Group | Teammate | The call | Its agent file asks for | Can touch | Skills · files · words |
|---|---|---|---|---|---|
| Build | software-architect | "How should this be built so it lasts?" | a design doc with a diagram, and an ADR for each hard-to-change call | reads, writes files, web | 18 · 22 · 13,025 |
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

Install line per row: `/truecast:install <name>` with Copy. Versions aren't shown in the row (they change
every release); the install plan shows them.

**Footnote under the table (kept, tightened):**
> "Can touch" sums up the tools it declares; the install plan lists them exactly. reads = Read, Grep,
> Glob · writes/edits files = Write, Edit · runs commands = Bash, which can also change files · web =
> WebSearch + WebFetch. "Asks for" is what its agent file tells it to
> hand back, not a tested result; only security-engineer is tested (Fig. 2). Size isn't a score.

### 5.5 Install (id `install`)

**Purpose:** get it installed and called on the first try, with every surprise said before it happens.

**Headline:**
> One command to set up, one per teammate. Then call it by name.

**Step 1. In your terminal** (copy block)
```
claude plugin install truecast --marketplace wastedcode/truecast
```
> Claude Code 2.1.295 or later (`claude --version`); on older, use the in-session lines below. Once
> per machine.

Disclosure "You'll see, at the end" (verbatim, captured 2026-10-17 on Claude Code 2.1.302, non-interactive: output piped, which is why the last two messages share a line; in a terminal they may print on separate lines, as in the live page's 2026-10-16 capture):
```
✔ Successfully added marketplace: truecast (declared in user settings)
Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
```

**Step 2. In Claude Code, in any project** (copy block)
```
/truecast:install security-engineer
```
> Claude Code already open? Run `/reload-plugins` first. Claude relays the installer's plan before
> anything is written. Say yes. For another teammate, swap the name.

Artifact: what the installer prints, verbatim (Claude relays it in its own words; the exact text is in the Bash output). Captured 2026-10-17 from the real script in a fresh home; home shown as
`~`; the machine-readable last line left off):
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
> See that last line? Restart Claude Code once before step 3.

And after the yes, what the installer prints (verbatim):
```
✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
  if @agent-security-engineer isn't recognised, restart Claude Code once (the agents directory is read at session start).
```

**Step 3. Call it by name** (copy block)
```
@agent-security-engineer review the changes on this branch before I merge
```
> An example. Type @ and pick it, or type `@agent-` plus its name. Either way that
> teammate takes the job.

**Step 4. Give it your brief** (optional; copy block)
```
f=.truecast/agents/security-engineer/instance/mandate.md
[ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" \
  https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
```
> In your repo, in a terminal (macOS, Linux or WSL). It saves the template and leaves an existing brief
> alone. Fill it in. For another teammate, swap the name in both places.

**Already in a Claude Code session?** (id `install-session`)
> Run these one at a time: `/plugin marketplace add wastedcode/truecast`, then
> `/plugin install truecast@truecast`. The second opens the plugin's details: choose **Install for you
> (user scope)**,
> then run step 2. If `/truecast:install` isn't there yet, run `/reload-plugins`.
>
> On Windows, run Claude Code inside WSL. The installer doesn't run on native Windows.

### 5.6 Why it's safe to let it in (id `trust`)

**Purpose:** answer "what will this do to my machine?" with outputs, not adjectives.

**Headline:**
> You approve every path the installer writes.

Four short blocks:

**You see the plan first.**
> Version, tools, every path; then it waits. Replacing a file it wrote before? You get the diff first.
> (callout, verbatim from step 2: `nothing has been written yet.`)

**Every tool is on the label.**
> Five of the twelve only read, search and fetch pages. Seven can also run commands or write files; the
> plan says which.

**It won't overwrite an agent file you wrote.**
> Given a hand-written `qa.md` already in `~/.claude/agents/`, it refused:
```
~/.claude/agents/qa.md exists and truecast did not write it.
error: refusing to overwrite a file truecast did not generate: ~/.claude/agents/qa.md
```
> `--force` doesn't override that. (Captured 2026-10-17; machine-readable line left out.)

**No truecast server is involved.**
> The installer copies from the clone Claude Code already made from GitHub. truecast collects nothing;
> teammates with web tools fetch pages like any agent with those tools.

**A brief is instructions, so read one you didn't write.**
> A teammate follows the repo's brief, and a repo you clone can ship one. Read it before you run a
> teammate there, as you would a CLAUDE.md.

(Source: `truecast-4.md:32`, logged as an accepted risk, and `truecast-5.md:48`, "worth a line in the
docs". Leaving it off would let the linked report contradict the trust section.)

### 5.7 Later (id `later`)

**Headline:** "Take the improvements, or take it back out"

**Take the improvements.** In your terminal, then restart Claude Code:
```
claude plugin marketplace update truecast
claude plugin update truecast@truecast
```
> The first fetches new teammates and the installer's script. The second updates its slash commands.
Then in Claude Code: `/truecast:update security-engineer` (or `--all`).
> It shows the new version's plan first. Your brief is never touched.

**Take it back out.** In Claude Code: `/truecast:remove security-engineer`. It lists what it will delete
and waits for your yes. `/truecast:list` shows what you have.
To remove the installer too: `claude plugin uninstall truecast@truecast`. To forget the catalog, which
deletes Claude Code's copy of it: `claude plugin marketplace remove truecast`.

### 5.8 Questions (FAQ)

**I already wrote an agent file. Why switch?**
> If it does the job, keep it: in our test a 76-word agent caught as much. What truecast adds is twelve
> roles already written, a brief per repo that updates never touch, and a plan before anything is
> written. To run both, rename yours and change its `name:` line.

**Claude Code already has `/security-review`. Why add this?**
> We haven't tested against it, so no claim to beat it. It reviews the pending changes on your
> branch. Ours takes whatever you point it at, ends on GO or NO-GO (some conditional), and is one of
> twelve.

**What does it cost?**
> Free to install. Teammates run on Opus on your own Claude Code usage. A fair-test run averaged $1.04
> at API prices.

**Does it learn my project?**
> Not on its own. It knows what your brief says; edit it and the next run
> picks it up.

**Can my whole team get it?** (the distribution loop: keep it visible, not buried last)
> Yes. Merge these two keys into the repo's `.claude/settings.json`, and Claude Code offers the teammate
> to anyone who opens the repo and trusts the folder:
```json
{
  "extraKnownMarketplaces": {
    "truecast": { "source": { "source": "github", "repo": "wastedcode/truecast" } }
  },
  "enabledPlugins": { "product-manager@truecast": true }
}
```
> Installed this way it's `@agent-product-manager:product-manager`, and updates skip the plan step. Commit it only for a marketplace you trust.

**Can I write my own?**
> Yes. A teammate is a folder of Markdown and one `persona.toml`. **Authoring guide →**
> (`docs/authoring-personas.md`). PRs to the catalog are welcome.

(No CLI question: npm serves 0.2.0, which can't manage `/truecast:install`'s files, so the page
links Docs and promotes nothing it can't deliver. See D8.)

Footnote: "The installer and the file formats are pre-1.0; they may change between minor versions."

### 5.9 Close

**Headline (kept):**
> Put a specialist on the call you're about to make.

Primary: **Go to step 1** (→ `#install`). Secondary: **Read the source on GitHub →**.
Under it: "Used one? **Tell us what it caught, or missed →**" (→ `/issues/new/choose`)

### 5.10 Footer
`truecast · MIT · © 2026 Inder Singh` · GitHub · Docs · Changelog · Security · Issues.
Plus: "Found a hole? SECURITY.md: we aim to acknowledge within 72 hours." (SECURITY.md:24)

### Meta
- `<title>`: truecast: expert teammates for Claude Code
- description: "Twelve expert teammates for Claude Code, already written and kept current: security, QA,
  architecture, product, design, sales. Call one by name; see every path before the installer writes."
- og/twitter: keep `site/brand/og.png` (it carries the H1).

---

## 6. The install path, exactly as it works today

Verified for this deck on 2026-10-17, in a throwaway `HOME`, unless marked.

| Step | Command | Status |
|---|---|---|
| Setup (terminal) | `claude plugin install truecast --marketplace wastedcode/truecast` | **Ran it.** Claude Code 2.1.302 cloned github.com/wastedcode/truecast at `90b49d8` (= this branch's HEAD) and installed `truecast@truecast` 0.1.2; `claude plugin list` shows "Version: 0.1.2 · Scope: user · ✔ enabled". The `--marketplace` flag is **absent in 2.1.289 and present in 2.1.295** (`plugin install --help` on both), which brackets the change between 2.1.290 and 2.1.295. docs/install.md and the README say 2.1.292, which nobody has verified, so the page says **2.1.295**, the earliest version we've seen with the flag. **Engineer item:** confirm 2.1.292 against Claude Code's changelog, then align the README, docs and page on one number. |
| Setup (in session) | `/plugin marketplace add wastedcode/truecast` → `/plugin install truecast@truecast` | **Not verified for the installer.** The founder's live check (2026-06-14) covered this flow for a persona plugin (`vc-seed@truecast`); the `truecast` installer entry only joined the marketplace on 2026-08-11 (`22f8b7b`). The panel offers "Install for you (user scope)" and "Install for you, in this repo only (local scope)" (2.1.289 and 2.1.302), so the page names the first. It still avoids the one-line `/plugin install … --marketplace`, whose 2.1.275 floor is also unverified. **QA item:** run it once interactively before merge. |
| Team (`enabledPlugins` in `.claude/settings.json`) | the FAQ snippet | **Not verified.** That Claude Code offers the plugin on folder trust, and the `@agent-product-manager:product-manager` form, come from Claude Code's docs and the README. That the plugin-lane agent finds its playbook relies on `${CLAUDE_PLUGIN_ROOT}` in an agent body; a persona plugin reading its skills from the plugin cache was verified live on 2026-06-14 (vc-seed). **QA item:** clone a repo with the snippet and trust it. |
| Add a teammate | `/truecast:install security-engineer` | **Ran the script it calls** (`truecast-plugin.sh install security-engineer`) from the real marketplace clone. The plan, the `--yes` ready line, the "already installed" line, the refusal (exit 5), and the remove plan were all captured. Persona versions available: brand-designer 0.1.6, infrastructure 1.2.2, product-manager 2.4.2, product-marketer 1.5.6, product-researcher 0.2.2, qa 1.3.2, sales 2.2.2, security-engineer 1.2.2, software-architect 1.4.2, software-engineer 1.4.2, ui-ux-designer 1.3.6, vc-seed 0.2.2. |
| First run | `/reload-plugins` if the command isn't recognised; restart once if `~/.claude/agents/` didn't exist | From the script's own note line (captured). |
| Call it | `@agent-security-engineer …` or type @ and pick | The ready line says so (captured). The `@` picker itself wasn't exercised in this run. |
| Brief | the curl in step 4 | The template exists at `personas/security-engineer/instance-template/mandate.md` on this branch, so the raw `main` URL resolves after merge. |

**What visitors get versus what's in the repo:**
- Marketplace (what `/truecast:install` copies): GitHub `main`, so after this merge it's exactly this
  tree. Installer 0.1.2, the versions above, twelve teammates. ✔
- npm: `@wastedcode/truecast` **0.2.0** (published 2026-07-22); `package.json` says 0.3.0, which is
  unreleased. Git tags stop at `v0.2.0`. So the page must not imply the CLI shares state with the
  plugin lane. The FAQ line in §5.8 says it plainly. ✔
- Live site today (truecast.dev, fetched 2026-10-17) serves the HEAD page, "truecast: expert teammates
  for Claude Code".

## 7. Claims on the current site that are false or unbacked

There are two "current" pages. **The staged `site/index.html` in this working tree** is an older,
11-teammate design. It's what will deploy if nothing replaces it, so its failures are blocking.
**The live page** (HEAD/main, truecast.dev) is mostly sound, with a few unbacked figures.

### 7a. Staged working-tree page (`site/index.html`, uncommitted): would ship on merge

| # | Claim on the page | Verdict | Evidence |
|---|---|---|---|
| S1 | "Eleven teammates" / "eleven, deep" / roster of 11 (no brand-designer) | **False** | 12 in `personas/`, marketplace.json, README |
| S2 | Terminal mock: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", `@security-engineer find me glaring gaps in this repo`, "Verdict: GO. Core trust surface is sound; both known escapes verified closed." | **Fabricated UI and output.** No published run contains it; the published review was **NO-GO** | `site/proof/security-engineer.md:13` |
| S3 | "This is us pointing our own security-engineer at this repo. Same persona you'd install." (captioning S2) | **False** as captioned | same |
| S4 | "Read-only by default" / "Declared tools, read-only by default" | **False** | 7 of 12 declare Bash, Write or Edit (`persona.toml`) |
| S5 | "you read the exact prompt before you run it" | **False on the plugin lane.** The plan shows version, tools and paths, not the prompt. `truecast prompt` is CLI-only | captured plan, §6 |
| S6 | Anthropic "90.2%" quote as support | **Unbacked for truecast.** Accurate quote, but borrowed proof about a different system | — |
| S7 | "Your instance/ — the job you set, the notes it kept" / "instance/notes" | **False.** Nothing writes notes or `work.md` | README "What a teammate is" |
| S8 | "core/skills/ core/knowledge/ persona.md" | **False name.** The file is `agent.md` | `personas/*/core/` |
| S9 | "you call it by its bare name: @security-engineer" | **Wrong form.** Use `@agent-security-engineer` or the picker; a typed bare `@name` can resolve as a file | CHANGELOG, installer 0.1.2 |
| S10 | Updates: "/plugin marketplace update truecast, then /truecast:update" | **Incomplete.** Omits `claude plugin update truecast@truecast`, which installed users need to get 0.1.2's fix | CHANGELOG 0.1.2 |
| S11 | "Other marketplaces… hundreds of plugins, thousands of skills" | **Unbacked**, unnamed competitor claim | — |
| S12 | "eleven built deep enough to trust" | **Unbacked quality claim.** Fig. 2 shows depth didn't raise the catch rate | `site/proof/rerun/README.md` |
| S13 | "Pastes straight into Claude Code. No terminal, no npm." (3 slash lines) | **Incomplete.** It skips `/reload-plugins` and the one restart, and `/plugin install` opens a panel that needs a choice | docs/install.md |
| S14 | `site/404.html` deleted in the working tree | Not a copy claim, but the deploy loses its 404 page. The designer should restore it or replace it on purpose | `git status` |
| S15 | "Real skills it reads on the job" / "It pulls real skills and reference knowledge on demand" | **Overstated.** Only 2 of 6 fair-test runs opened any skill | `site/proof/rerun/README.md:96–98` |
| S16 | "It never touches a file it didn't write" | **False.** `--project` appends to the repo's `.gitignore` and creates `mandate.md` if missing | `truecast-plugin.sh` `scaffold_mandate` :571–583; docs/install.md "This project only" |
| S17 | "truecast tracks every file it wrote. Those it shows you as a diff before replacing" | **False on the plugin lane.** It keeps no tracking record (no `owned.json`) and recognises its own files by a text stamp a repo can forge | `truecast-plugin.sh` header; `free-3.md:19` |

### 7b. Live page (HEAD = main = truecast.dev)

| # | Claim | Verdict | Evidence / fix |
|---|---|---|---|
| L1 | Fig. 1 "All 10 tool calls from its log", the tool-call list (checked …, fetched code.claude.com/…, "ran the attack in a sandbox 3 runs") | **Unbacked publicly.** The log isn't in the repo (`page.py` cites an uncommitted `session-truecast.jsonl`). Parts are corroborated by the report: "two pages of Claude Code's docs", "reproduced F1 in the sandbox" | Replace with the truecast-2 excerpt (§5.1), or commit the trimmed log |
| L2 | "66,578 tokens · 10 tool calls" / "2,780 tokens: the report" (also README.md:36) | **Unbacked publicly** | Same; drop from the page and the README until it's published |
| L3 | Hero lead: "Set it up once, then type @ and pick one" | **Misleading.** After setup you still add each teammate with `/truecast:install` before it appears under @ | Edited in §5.1 |
| L4 | "On 2.1.275 or later, this replaces step 1" (install section) and the FAQ's `/plugin install security-engineer --marketplace … (Claude Code 2.1.275 or later)` | **Unverified version floor.** The terminal `--marketplace` flag is absent in 2.1.289 | The deck drops both and uses the two-line in-session flow |
| L4b | "Claude Code 2.1.292 or later" (hero, step 1) | **Unverified.** Only 2.1.289 (no flag) and 2.1.295 (flag) were checked | The page says 2.1.295 until 2.1.292 is confirmed |
| L7 | "One free-collection run and one of ours raised it" (the fourth hole) | **Wrong count.** free-3 and truecast-4 raise it, and free-6 too; at least three runs | The page says "a few runs". CHANGELOG 0.1.2's credit line has the same gap |
| L8 | "in Fig. 1 it opened two" next to Fig. 1's first review | Backed only by the unpublished log (L1); the rerun README corroborates two skills for truecast-1/-2 | The deck's Fig. 1 is truecast-2, whose two opened skills the rerun README states |
| L5 | Hero proof paragraph (except "explicit": see §3; two of the six were split, one conditional), Fig. 2, cost FAQ, "Five of the twelve…", refusal output, plan output, roster counts | **Backed.** Recounted for this deck; all match | `deck-check.py` |
| L6 | "Fair test… Ours graded it P1 in 4 of 5" | **Backed** (truecast-2, -3, -4, -5 P1; -6 P2) | rerun table |

### 7c. README drift (not the page, but the same visitors read it)
- README.md:34–36: the 66,578 / 2,780 figures have the same problem as L2.
- README correctly says `work.md` is planned and nothing writes it; only the staged page (S7) drifts.
- README "Twelve roles, already written and kept current" agrees with the page. ✔

## 8. Hand-off notes for brand-designer and ui-ux-designer

- **Every artifact on the page is real output.** Sources: §5.1 Fig. 1 = `site/proof/rerun/truecast-2.md`;
  Fig. 2 = `site/proof/rerun/README.md`; Fig. 3 = `site/brand/cores.json`; plan, ready, refusal and
  install outputs = §6, captured 2026-10-17. Don't draw a Claude Code UI frame that implies a version,
  model or plan tier we didn't capture. S2 is exactly that failure.
- The one copy block that matters most is step 1's command. Keep it copying cleanly (the live
  `app.js` already strips the line-continuation mark).
- **Cloudflare email obfuscation garbles the verbatim blocks.** truecast.dev rewrites
  `security-engineer@1.2.2` into `[email protected]` for anyone without JavaScript: crawlers, reader
  modes, LLM fetchers. Wrap every `name@version` span in `<!--email_off-->…<!--/email_off-->`, or turn
  Email Address Obfuscation off for the zone. It's live today on the plan line and the Fig. 1 header.
- **`834b03d` isn't in main's history.** The fix reached main through the squash merge `d70aa8d` (#50).
  The commit URL resolves today (HTTP 200, through the PR ref), but `git log main` won't show it. The
  page cites "installer 0.1.1" and links the CHANGELOG entry. **Engineer item:** README.md and
  `site/proof/README.md` / `rerun/README.md` link `834b03d` too. Add "(merged in `d70aa8d`)" beside it.
- The roster's "files" column counts Markdown files. Label the column header "Markdown files", since
  each core folder also holds `persona.toml` and a visitor who counts on GitHub gets one more.
- **Engineer item:** the plan line still says `tools granted to @security-engineer:`, which is the bare
  mention form CHANGELOG 0.1.2 retired from the ready line. Change it to `@agent-security-engineer`
  (`truecast-plugin.sh`), then recapture the plan for the page.
- `scripts/brand/page.py` generates the roster and figures from the repo, and `pnpm test` runs its
  `--check`. Keep the table data-drawn so it can't drift from the playbooks.
- **Make the check durable.** `internal/` is git-ignored, so `deck-check.py` won't run anywhere but
  here. The durable version is to extend `scripts/brand/page.py --check`, which `pnpm test` already runs,
  so it asserts the page's prose numbers too: 12 teammates, "Five of the twelve", 17 skills / 3 notes /
  21 files / 12,697 words, and the Fig. 2 cells read from `site/proof/rerun/README.md`. Then a playbook
  change that moves a number fails CI instead of shipping a stale page. That's an engineer task.
- The roster's "asks for" text lives in `scripts/brand/page.py` `ASKS`. Change software-architect's
  entry to "a design doc with a diagram, and an ADR for each hard-to-change call", which drops "real" as
  an intensifier per the voice spec.
- **Word count, two ways.** `deck-check.py` counts quoted copy, the roster's call and asks cells, the
  Fig. 2 row labels and the block titles: 1,500. A stricter count that also includes every roster cell
  and the unquoted §5.7 lines gets about 1,600 (QA's round-2 count). Either way the copy is about half
  the live page.
- Mobile: the plan block scrolls sideways; label it ("scrolls sideways") as the live page does.

## 9. Calls I made without the founder (all reversible)

| # | Call | Alternative I rejected | Why |
|---|---|---|---|
| D1 | Keep the H1 "The expert teammates Claude Code doesn't ship with." | "Twelve specialists for Claude Code. Each one hands back a call." | It passes the what-is-it test. It's founder-tuned and already on the README header, GitHub description and og.png, which this release doesn't regenerate, so changing it would split the brand across surfaces. The alternative's "each one" is only true for 6 of 12. |
| D2 | Rewrite the hero sub: say the two commands, put the coding roles first, call the brief optional, say "a playbook it can open" | Keep the live sub verbatim | The old sub implied all twelve appear after setup (L3). The five-second judge couldn't tell how many commands there were, didn't know whether a brief had to be written first, and read "sales" as padding. "It can open" is what the rerun shows (2 of 6 runs opened skills). |
| D3 | Hero Fig. 1 = fair-test run truecast-2, verbatim, labelled as one of three two-hole runs | (a) The first review with its tool-call log. (b) truecast-4, a one-hole run | (a): the log isn't published (L1). (b) opened no playbook file, so it can't stand next to "a playbook it can open". truecast-2's prompt was typed directly, it opened two skills, and its headings fit whole. The caption names the spread (three runs found two holes, three found one), so it isn't passed off as typical. |
| D4 | Section 2 headline "Isn't it just a prompt? At catching holes, a short one tied it." | Live "It found a real hole in our installer. So did a 76-word agent." | It answers the reader's first objection in their own words ("nearly as good"). The live line is good but makes the reader decode it. |
| D5 | Section 3 headline "You could write all twelve. You'd also have to keep them current." | Live "A teammate is a playbook, your brief, and its own context window." | It names the alternative and the real cost, in the customer's words ("maintenance nightmare"). The live line describes the product, where this one argues for it. |
| D6 | Drop the 66,578 / 2,780 numbers | Keep them | No published source. They return the moment a trimmed log is committed. |
| D7 | Add the `/security-review` FAQ | Leave it out | It's the alternative a Claude Code user already has. Not answering it reads as hiding. |
| D8 | No CLI on the page beyond the Docs link | A CLI FAQ line or section | npm serves 0.2.0, which can't update or remove what `/truecast:install` wrote (adoption arrives in the unpublished 0.3.0). Promoting it would sell what visitors won't get. |
| D9 | Order: hero → proof → what you get → twelve → install → trust → later → FAQ → close | Live order (install before the roster) | The reader picks a teammate and then installs it, so step 2's name is their choice. The hero CTA still gives the install up front. |
| D10 | Trust section names the brief-as-instructions risk | Leave it to the linked report | Two published reports raise it (truecast-4 as an accepted risk, truecast-5 as worth documenting); a trust section that omits what its own links say loses the skeptic |
| D11 | In-session install uses the two-line `/plugin marketplace add` flow | The one-line `/plugin install … --marketplace` from 2.1.275 | The two-line flow is the documented path that has worked for persona plugins; the one-liner's 2.1.275 floor is unverified. Neither is verified for the installer plugin (QA item, §6) |
