# truecast.dev homepage: copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) → ui-ux-designer (the page)
Status: final copy. Every number on the page traces to a file in this tree or to command output captured
on 2026-10-17; the source is named next to each one. The founder wasn't available; calls I made on their
behalf are in §9, each with the alternative I didn't take.

Note: `internal/` is git-ignored, so this deck won't be merged. The page will be, and so will
`site/proof/`, which it quotes.

---

## 0. Read this first: three release blockers in the working tree

1. **The staged `site/index.html` is an older page and must not ship.** It's staged over HEAD
   (`git diff --cached --stat`: index.html, app.js, styles.css). It says "Eleven teammates", shows a
   "Claude Code v2.1.177 · Opus 4.8" session with a `Verdict: GO` that doesn't match any published run,
   and teaches `@security-engineer` (§8a has the full list). The orchestrator commits the working tree as
   it is, so if the new page doesn't replace all three files, that page goes live.
2. **`site/404.html` is staged for deletion.** HEAD has one ("Not here · truecast"). Rebuild it (copy in
   §5.10) or restore it. Otherwise Cloudflare Pages serves its default 404.
3. **Don't link `834b03d`.** It isn't in this branch's history: `git merge-base --is-ancestor 834b03d HEAD`
   fails. It only exists on the `frontier-bar` branch, and main got the fix through squash commit
   `d70aa8d`. The GitHub URL loads today only because that branch still exists. Link
   [`d70aa8d`](https://github.com/wastedcode/truecast/commit/d70aa8d), which is on main and contains the
   fix (`grep -c mktemp plugin/truecast/bin/truecast-plugin.sh` → 3), or link the installer 0.1.1
   CHANGELOG entry. The same link appears in README.md:15 and in `site/proof/README.md` /
   `site/proof/rerun/README.md`. In the proof files, keep the hash where it identifies the *repo snapshot
   that was tested* (`git archive 834b03d^`, tree `3cc249dc…`), because that's a method fact, and drop
   the link.

---

## 1. What a visitor actually gets today (checked 2026-10-17)

| Channel | What it serves | How I checked | What the page may claim |
|---|---|---|---|
| GitHub default branch | `main` @ `90b49d8` (= this branch's base) | `api.github.com/repos/wastedcode/truecast` → `default_branch: main`; `git ls-remote` | The marketplace is read from `main`, so whatever merges is what installs |
| Installer plugin | `truecast@truecast` **0.1.2** | Fresh `HOME`: `claude plugin install truecast --marketplace wastedcode/truecast` → installed; `claude plugin list` → `Version: 0.1.2` | "Installer 0.1.2", with all four holes fixed |
| Teammates | 12, at the versions in each `persona.toml` (security-engineer 1.2.2, qa 1.3.2, …) | The plan printed `install security-engineer@1.2.2` | "Twelve". Versions only where shown in real output |
| npm CLI | `@wastedcode/truecast` **0.2.0** (`latest`). `package.json` says 0.3.0, which is unreleased | `npm view … versions dist-tags` | **Don't promote the CLI on the homepage.** 0.2.0 predates the plugin lane, so it can't adopt or update `/truecast:install` installs. Link docs only |
| Git tags | `v0.1.0`, `v0.1.1`, `v0.2.0`. No tag for the installer | `git ls-remote --tags` | No "v0.3" or release-badge claims |
| truecast.dev | HEAD's page ("truecast: expert teammates for Claude Code") | `curl` → 200, `<title>` | n/a |
| Claude Code | 2.1.302 locally. The 2.1.292 / 2.1.275 floors are from `docs/install.md` and the README, not re-tested (no older build on hand) | `claude --version`; `claude plugin install --help` lists `--marketplace` | Keep the floors as the docs state them |

---

## 2. Audience and the 5-second belief

**Who it's for:** a developer who already lives in Claude Code and has hit one of these:
- "I asked Claude to review this for security and got a confident, unranked list, with no call on
  whether to ship."
- "I wrote a `security-engineer.md` once. It's 80 words and I've never touched it again."
- "I grabbed an agent from a free collection and don't know what's in it, or what it can run."

They know what a subagent is, or close enough. They're **solution-aware** (they know agents exist), not
product-aware. They distrust AI marketing on sight, so candor is the conversion lever here, not hype.

**Their job:** "When I'm about to make a call outside my expertise (ship this, build it this way, is this
worth doing), get the judgment of the best person in that role without hiring them, and without my main
session turning into a mess."

**The 5-second belief** (after reading the H1, the subhead, and the command):
> "These are ready-made expert subagents for Claude Code. One command installs them. Each one hands back
> a decision or a finished artifact, and these people publish where they lost."

**The 30-second belief** (after the proof section):
> "It doesn't claim to catch more bugs than my own prompt. A tie, published. What I'd get is twelve roles
> already written and kept current, each built to end on a call, with an install that shows me every file
> before it writes. That's worth one command."

---

## 3. Positioning (Dunford)

**Competitive alternatives**, which are what the visitor does today, not other vendors:
1. Ask Claude in the main session ("act like a security expert").
2. Write their own agent file (the 76-word agent in our test stands in for this).
3. Copy one from a free collection (VoltAgent's awesome-claude-code-subagents, wshobson/agents).

**What only truecast has, and the proof for each:**

| Attribute | Proof | Discriminates against | Strength |
|---|---|---|---|
| **Ends on a call.** The security teammate closed every run on GO or NO-GO, with findings ranked by when to fix them | Fair test: 6/6 vs 0/12 (`site/proof/rerun/README.md`) | 1, 2, 3 | **Measured.** The only measured edge. Tested on one teammate |
| **Twelve roles, already written and versioned.** Each agent file names what it owes you: a GO/NO-GO, a ship/don't-ship verdict, an ADR, an invest-or-pass | `personas/*/core/agent.md`, `persona.toml` versions | 2 (you'd write 12), 3 (one-file agents) | **Verifiable.** Untested beyond security, and we say so |
| **Install you approve.** The plan lists the version, tools, and every path it writes, then waits. It refuses to overwrite a file it didn't write, even with `--force` | Real output captured 2026-10-17 (§6) | 3 (copy a file in), 2 | **Reproducible** |
| **Costs ~60–250 tokens per session until called** | `claude plugin details <name>@truecast`, 2026-10-17 (§5.4) | 1 (a pasted mega-prompt, CLAUDE.md bloat) | **Reproducible.** Not unique against other subagents; don't frame it as one |
| **Your brief survives every update** | `instance/mandate.md` is never written by update (`src/api/verbs.test.ts` AC-U1; installer only scaffolds if absent) | 2, 3 (editing a downloaded file means losing upstream changes) | **Tested** |

**What we do not claim** (the fair test rules these out; see the fair test):
- More bugs caught. A 76-word agent tied at 9/18.
- That a bigger playbook means better. Playbook size describes what's inside. It isn't a score.
- Anything about the other eleven teammates' quality. Only security-engineer has been tested.
- Token savings in the main thread. The 66,578 / 2,780 figures have no published log (§8b).

**Value:** you get the judgment of the best person in that role, delivered as a decision, at the moment
you'd otherwise guess, without writing or maintaining twelve prompts.

**Category:** *expert teammates for Claude Code*, meaning native subagents. Not "AI agents", not
"prompts", not "skills". Use "teammate" on the page. "Persona" is the authoring word: it appears only in
docs links and the `persona.toml` mention.

**Narrative spine (Raskin, small):** Claude Code made you a team of one with a fast generalist. The
calls that hurt (ship it? build it this way? is anyone going to pay?) are specialist calls. Specialists
end on a decision. Here are twelve, already written, installed with a plan you approve. We tested the
first one against a prompt you could write. Here's exactly what happened.

**Distribution loop** (this belongs on the page, not just in strategy): one person commits two keys to a
repo's `.claude/settings.json`, and Claude Code offers the teammate to everyone who opens that repo
(§5.7 FAQ "Can my whole team get it?"). Every repo that does this becomes a new install surface. It
gets a FAQ entry plus one line in the install section. It's not a hero claim.

---

## 4. Voice rules for the page

- Plain words, numbers you can check, and losses said out loud. The tone is "exact, not cold; candid,
  not modest" (`site/brand/BRAND.md`).
- Every number gets a source a visitor can open: a file in `site/proof/`, or a command they can run.
- No "seamless / unlock / supercharge / 10x / powerful", no stacked "not X, but Y", no rhetorical
  triplets as headlines. Sentences end on the fact.
- Write mentions in the documented form, `@agent-security-engineer`, or "type @ and pick it". **Never
  write a bare `@security-engineer` as something to type** (installer 0.1.2 changelog: a bare `@name` can
  resolve to a file). Writing "@security-engineer" as the teammate's *name* in a caption is fine.
- The hero example teammate is `security-engineer` everywhere, because that's the one with proof.
- Use the trademark-safe name "Claude Code". Don't suggest Anthropic endorsement.

---

## 5. The page, section by section

Order is deliberate: **what it is → proof it's honest → how to get it → what it is, inside → pick one →
safety → questions → close.** Install sits third: a solution-aware visitor wants to see the proof before
they paste a command, and step 1 is also in the hero for anyone who's already sold.

### 5.0 Meta

- `<title>`: **truecast: expert teammates for Claude Code**
- `meta description` (160 chars max): **Twelve expert subagents for Claude Code: security, QA, architecture,
  product, design, sales. Each hands back a call or an artifact. You approve each install.**
- `og:title`: **The expert teammates Claude Code doesn't ship with**
- `og:description`: **Twelve specialists, already written. We tested ours against a 76-word agent and
  published all 18 runs.**
- `og:image`: `/brand/og.png`, unless brand-designer redraws it. The alt text must match whatever it
  actually shows. The current alt describes "Twelve playbooks drawn side by side".
- Nav: **Proof · Install · Teammates · GitHub ↗**

### 5.1 Hero

**Purpose:** pass the 5-second belief and give anyone who's already sold the command.

**H1:** **The expert teammates Claude Code doesn't ship with.**

**Subhead:**
> Twelve specialists, already written: security, QA, architecture, infrastructure, product, design,
> marketing, sales and fundraising. Type @ and pick one. It works in its own context and hands back what
> that role owes you: a GO or NO-GO, a ship verdict, an ADR, an invest-or-pass.

**Proof line** (small, directly under the subhead, linking to §5.2):
> We tested ours against a 76-word agent you could write yourself. It caught as many holes, no more.
> It was the only one that ended every run on GO or NO-GO. **All 18 runs, published ↓**

**Primary CTA:** the command block, with a copy button:
```
claude plugin install truecast --marketplace wastedcode/truecast
```
Under it: **In your terminal, Claude Code 2.1.292 or later. Then in Claude Code:
`/truecast:install security-engineer`.**

**Secondary CTA:** **Already in a session? →** (jumps to the in-session alternative in §5.3)

**Trust strip** (one line, no icons): **Free and open source (MIT) · Nothing is written until you say
yes · No servers: we don't have any**

**The artifact that carries it:** a real verdict, verbatim, from fair-test run `truecast-2`
(`site/proof/rerun/truecast-2.md`). Show the verdict paragraph and the F1 heading, nothing invented
around them. **No fake terminal chrome, no fake version or plan banner.** If the designer wants a
session frame, its only content is the prompt that was actually used (from `rerun/README.md`) and this
final message.

> **Verdict: yes, someone can get owned, but only through `--project`. That path is NO-GO until F1 is
> fixed. The user-scope lane is GO, as long as F2 is fixed before the next release.**
>
> ### F1 — P1: a hostile repo can write any file in your home, which leads to code execution (reproduced)

Caption: **One of the 18 runs, 2026-10-16: security-engineer 1.2.2 reviewing our own installer. Final
message, unedited, cut after its first finding. $1.14 · 4.3 min. Read the whole report →**
(link `site/proof/rerun/truecast-2.md`)

Why this run: it's from the fair test (the same prompt went to all three agents, so it's comparable), its
cost and time are in a published table, and it found a real hole in our own code. That's the strongest
trust move available, because it shows we let our own product grade us.

### 5.2 Proof: the fair test

**Purpose:** turn "here's a vendor claim" into "these people publish where they tied." This section is
the conversion engine.

**H2:** **It found a real hole in our installer. So did a 76-word agent.**

**Body:**
> A hostile repo could get its text written into your `~/.bashrc` through our installer's `--project`
> mode. We fixed it, then gave the same prompt, byte for byte, to three security agents, six runs each:
> a 76-word one anyone could write, a 1,007-word one from a popular free collection, and ours.
>
> At catching holes, ours tied the 76-word agent and beat the free one. It cost more. What only ours did
> was end every run on an explicit GO or NO-GO, with findings ranked by when to fix them. That comes from
> its agent file, so you could ask your own agent for the same. truecast is that, already written, for
> twelve roles.

**The artifact:** the results table, built from `site/proof/rerun/README.md`. No other numbers.

| | Hand-written · 76 words | Free collection · 1,007 words | truecast · 21 files, 12,697 words |
|---|---|---|---|
| Temp-file hole (the `~/.bashrc` one) | 6 of 6 | 5 of 6 | 5 of 6 |
| Hooks hole | 1 of 6 | 1 of 6 | 2 of 6 |
| Shell hole | 2 of 6 | 0 of 6 | 2 of 6 |
| **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
| **Ended on GO or NO-GO** | 0 of 6 | 0 of 6 | **6 of 6** |
| Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

**Under the table (must ship, because this is what keeps it honest):**
> No run of any agent found all three. Six runs can't separate 2 of 6 from 1 of 6, so we don't claim the
> hooks gap. In 8 runs Claude Code switched from claude-opus-5-5 to claude-opus-4-8 partway; a safety
> classifier interrupted 10. The free-collection agent is VoltAgent's `security-engineer.md`, with only
> its tools and model lines changed to match. One review, one kind of work: it says nothing yet about the
> other eleven.

**CTAs:** **All 18 reports, and how we scored them →** (`site/proof/rerun/README.md`) ·
**The first review, and why we reran it →** (`site/proof/README.md`)

**Fix line (small, last):**
> We fixed all three holes in [`d70aa8d`](https://github.com/wastedcode/truecast/commit/d70aa8d), plus a
> fourth the test turned up: an update could write somewhere other than its plan showed. Installer 0.1.2
> has all four fixes. `claude plugin list` shows your version.

(Source: CHANGELOG "Installer plugin 0.1.2". The free-6 and truecast-4 runs raised the fourth.)

**Already have it? Update →** (link to §5.3 "Later")

### 5.3 Install

**Purpose:** get from zero to a working `@agent-security-engineer` in two commands, and show the real
output at each step so nothing surprises them.

**H2:** **Two commands to set up. Then call it by name.**

**Step 1: In your terminal, once per machine**
```
claude plugin install truecast --marketplace wastedcode/truecast
```
> Needs Claude Code 2.1.292 or later (`claude --version`). This installs the installer.

**You'll see, at the end** (verbatim, captured 2026-10-17 on Claude Code 2.1.302):
```
✔ Successfully added marketplace: truecast (declared in user settings)
Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
```

**Step 2: In Claude Code, in any project**
```
/truecast:install security-engineer
```
> Was Claude Code already open when you ran step 1? Run `/reload-plugins` first. You'll see the plan
> before anything is written. Say yes and it's ready.

**The plan it prints** (verbatim from the script `/truecast:install` runs, captured 2026-10-17, home shown
as `~`, its machine-readable last line left off):
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
> The last line appears only if you've never had a `~/.claude/agents/` folder. If you see it, restart
> Claude Code once before step 3.

**After you say yes** (verbatim):
```
✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
```

**Step 3: Call it by name**
```
@agent-security-engineer review the changes on this branch before I merge
```
> Any teammate, any request. Type `@` and pick it from the list, or type `@agent-` plus its name.

**Step 4: Give it your brief (optional)**
> One file in your repo tells it what the project is and where the bar sits:
> `.truecast/agents/security-engineer/instance/mandate.md`. It reads that first. Updates never touch it.
> No brief? It works from what you ask.
```
f=.truecast/agents/security-engineer/instance/mandate.md
[ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" \
  https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
```
> In your repo, in a terminal (macOS, Linux or WSL). It saves the template and leaves an existing brief
> alone. For another teammate, swap the name in both places.

(Checked: the raw URL returns 200 today. Why there's a curl step: the user-scope install doesn't
scaffold a brief; only `--project` does (`truecast-plugin.sh:707-710`).)

**Later (collapsed by default): Take the improvements, or take it back out**
- **Update.** In your terminal: `claude plugin marketplace update truecast` (fetches new versions of
  every teammate) and `claude plugin update truecast@truecast` (the installer itself), then restart Claude
  Code. In Claude Code: `/truecast:update security-engineer`. It shows the new version's plan first. Your
  brief is never touched.
- **Remove.** `/truecast:remove security-engineer` lists exactly what it will delete and waits. For
  example, real output: `DELETE ~/.claude/agents/security-engineer.md` · `DELETE
  ~/.truecast/personas/security-engineer/ (every cached version of the craft)` · `nothing has been
  written yet.` Use `/truecast:list` to see what you have.
- **Remove the installer:** `claude plugin uninstall truecast@truecast`. **Forget the catalog:**
  `claude plugin marketplace remove truecast`.

**Already in a session? (collapsed)**
- On 2.1.275 or later, this replaces step 1: `/plugin install truecast --marketplace wastedcode/truecast`.
  It asks before adding the marketplace, then opens the plugin's details. Choose **Install for you**, then
  run step 2. If `/truecast:install` isn't there yet, run `/reload-plugins`.
- Before 2.1.275: `/plugin marketplace add wastedcode/truecast`, then `/plugin install truecast@truecast`.
- **Windows:** run Claude Code inside WSL. Native Windows isn't tested yet.

**One line for teams** (links to the FAQ): **Want the whole repo to get it? Two keys in
`.claude/settings.json` ↓**

### 5.4 What a teammate is

**Purpose:** answer "why is this better than a prompt?" with structure the visitor can open and costs
they can measure. No adjectives.

**H2:** **A teammate is a playbook, your brief, and its own context.**

**The playbook.**
> For security-engineer: its agent file, 17 skills and 3 reference notes. That's 21 Markdown files and
> 12,697 words it can open mid-task, a file at a time. They load only into that teammate. They aren't
> Claude Code Skills, so they don't crowd your session. **Open the folder on GitHub ↗**

Artifact: the file list with word counts (`personas/security-engineer/core/`, generated by
`scripts/brand/build.py`; keep its `--check` gate). Label it **"Size shows what's inside. It isn't a
score: in the fair test a 76-word agent caught as much."**

**Your brief.**
> One file in your repo: what the project is, what matters, where the bar is. It reads it first. An
> update replaces the playbook and stops there; the brief is never written by an update.

Artifact: a two-path diagram showing what an update writes: `~/.truecast/personas/security-engineer/`
(the author's playbook) and `your-repo/.truecast/agents/security-engineer/instance/mandate.md` (yours).
**Use real versions or none.** HEAD's "1.1.0 → then 1.2.2" is real history (`git log -L` on
`persona.toml`: 1.1.0 at c503506, 1.2.2 at d70aa8d), so it may stay.

**Its own context.**
> Each teammate is a native Claude Code subagent, so its reading and testing happen in its own context
> window and your session gets the result. Until you call one, it costs your session about 60 to 250
> tokens: its one-line description. All twelve together come to about 1,530.

Artifact: a small measured table, captured 2026-10-17 with `claude plugin details <name>@truecast` on
Claude Code 2.1.302. Label it **estimates from Claude Code's own report; run it yourself.** Columns:
*always on, in every session* / *when it takes the job*.

| teammate | always on | when it takes the job |
|---|---|---|
| brand-designer | ~140 | ~3.4k |
| infrastructure | ~170 | ~5.9k |
| product-manager | ~60 | ~4.1k |
| product-marketer | ~250 | ~5.6k |
| product-researcher | ~70 | ~4.5k |
| qa | ~160 | ~5.4k |
| sales | ~150 | ~4.8k |
| security-engineer | ~120 | ~5.1k |
| software-architect | ~180 | ~5.6k |
| software-engineer | ~60 | ~3.8k |
| ui-ux-designer | ~100 | ~5.8k |
| vc-seed | ~70 | ~4.2k |
| *the installer itself* | *~92* | *0.6k–1.5k per command* |

Caveat for the designer: this was measured on the per-teammate plugin form (`<name>@truecast`). The
installer writes the same agent body (pinned byte-for-byte by a test, per the CHANGELOG). The
"when it takes the job" cost is paid in the teammate's context, not yours.

### 5.5 The twelve

**Purpose:** let them pick by the call they're stuck on, not by job title, and show what each owes them.

**H2:** **Twelve teammates. Pick the call you'd rather not make alone.**

**Intro line:** **First time? Run step 1 once. Then any of these is one line.**

One row per teammate: the group, its name, a copyable `/truecast:install <name>`, the question it answers,
**"Its agent file asks for"**, **"Can touch"**, playbook size, and **See inside →** (link to
`personas/<name>/`). The copy below has been checked against each `agent.md` and `persona.toml`;
sizes come from `find personas/<n>/core -name '*.md' | xargs cat | wc -w`, 2026-10-17.

| Group | Teammate | The call | Its agent file asks for | Can touch | Playbook |
|---|---|---|---|---|---|
| Build | software-architect | "How should this be built so it lasts?" | a design doc with a real diagram, and an ADR for each hard-to-change call | reads, writes files, web | 18 skills · 22 files · 13,025 words |
| Build | software-engineer | "Can I trust this code?" | code proven by trying to break it, shipped in small safe steps | reads, edits files, runs commands, web | 13 skills · 16 files · 6,697 words |
| Build | qa | "What breaks before a user finds it?" | a ship or don't-ship verdict, with the blocker list | reads, runs commands, web | 17 skills · 20 files · 13,107 words |
| Ship | security-engineer | "Can this get someone owned?" | findings at file:line, each graded, and a GO or NO-GO | reads, runs commands, web | 17 skills · 21 files · 12,697 words |
| Ship | infrastructure | "Will this hold up in production?" | commands that run first time, with how to undo them | reads, edits files, runs commands, web | 21 skills · 24 files · 14,121 words |
| Decide | product-manager | "Are we building the right thing?" | a validated spec, its success bar, and an acceptance verdict | reads, web | 17 skills · 21 files · 8,570 words |
| Decide | product-researcher | "What are users actually telling us?" | findings ranked by confidence, each with its receipts | reads, web | 16 skills · 21 files · 8,035 words |
| Design | ui-ux-designer | "Can people actually use this?" | user flows and a design it has rendered and checked at every size | reads, edits files, runs commands, web | 21 skills · 24 files · 17,284 words |
| Design | brand-designer | "Would anyone remember us?" | one brand idea, a mark tested at 16px, and the identity as tokens | reads, edits files, runs commands, web | 9 skills · 11 files · 5,116 words |
| Market | product-marketer | "Why would anyone care?" | the positioning, the copy, and a will-it-land verdict | reads, web | 18 skills · 23 files · 16,902 words |
| Market | sales | "Who would actually pay for this?" | a painkiller-or-vitamin verdict and a buyer profile, with the evidence | reads, web | 16 skills · 20 files · 12,361 words |
| Raise | vc-seed | "Would an investor write the check?" | an invest-or-pass call and the one risk it would underwrite | reads, web | 16 skills · 20 files · 8,470 words |

**Footnote (must ship):**
> "Can touch" sums up the tools each one declares; the install plan lists them exactly before you say
> yes. reads = Read, Grep (+ Glob) · writes files = Write · edits files = Edit + Write · runs commands =
> Bash, which can also change files · web = WebSearch + WebFetch. "Its agent file asks for" is what each
> one's instructions tell it to hand back, not a result we've tested. Only security-engineer has been
> tested.

**Row CTA:** the copy button on `/truecast:install <name>`. **Section CTA:** **Write your own →**
(`docs/authoring-personas.md`)

### 5.6 Safety: you approve every write

**Purpose:** answer "why would I let some Markdown and a shell script into my home directory?" with
output, not promises.

**H2:** **You approve every file the installer writes.**

Four cells, each carrying one real artifact:

1. **You see the plan.** "The version, the tools, every path it will write, and then it waits. If it
   would replace a file it wrote before, it shows you the diff first." Artifact: the `nothing has been
   written yet.` line from §5.3.
2. **Every tool is on the label.** "Five of the twelve can only read, search and fetch web pages. Seven
   can also run commands or write files. The table above and the install plan say which." (Checked: five
   are PM, PMM, researcher, sales, vc-seed.)
3. **It won't overwrite an agent file you wrote.** "We put a hand-written `qa.md` in `~/.claude/agents/`
   and asked it to install over it, with `--force`. It refused." Artifact (verbatim, captured 2026-10-17,
   path trimmed, one machine-readable line left out; exit code 5):
   ```
   …/.claude/agents/qa.md exists and truecast did not write it.
   error: refusing to overwrite a file truecast did not generate: …/.claude/agents/qa.md
   ```
4. **Nothing runs on our servers. We don't have any.** "The installer copies from the clone Claude Code
   already made from GitHub. truecast collects nothing. Teammates with web tools can fetch pages, like any
   Claude Code agent with those tools."

**Footer line:** **Open source, MIT. Built by Inder Singh (wastedcode). Found a hole? SECURITY.md: we aim
to acknowledge within 72 hours.** (Checked: SECURITY.md:24.)

### 5.7 Questions (FAQ)

**H2:** **Questions.**

- **I already wrote an agent file. Why switch?**
  If it does the job, keep it. In our fair test a 76-word agent caught as much as ours. truecast won't
  install over it. What you'd add is the rest: twelve roles already written, each built to end on a call;
  a brief per role that updates never touch; and a plan before anything is written. To run ours alongside
  yours, rename your file first, or install ours as a plugin with
  `/plugin install security-engineer --marketplace wastedcode/truecast` (2.1.275 or later) and call it as
  `@agent-security-engineer:security-engineer`.
- **What about the big free agent collections?**
  We tested one: the 1,007-word security-engineer from VoltAgent's collection, given the same prompt six
  times. It raised 6 of a possible 18 against 9 for ours and 9 for a 76-word agent, and it was the
  cheapest at $0.68 a run. The 18 reports are unedited. It's one test, not a benchmark.
- **What does it cost?**
  Nothing to install. Each teammate runs on Opus, on your own Claude Code usage (subscription or API key).
  In the fair test a review averaged $1.04 for the whole session at API prices, against $0.85 for the
  76-word agent. Until you call it, a teammate adds about 60–250 tokens to a session.
- **Does it learn my project?**
  Not on its own. It reads your brief every time, so what it knows about your project is what you've
  written there. Edit the brief and the next run picks it up.
- **Can my whole team get it?**
  Yes. Merge these two keys into the repo's `.claude/settings.json`, and Claude Code offers the teammate
  to anyone who trusts the folder:
  ```json
  {
    "extraKnownMarketplaces": {
      "truecast": { "source": { "source": "github", "repo": "wastedcode/truecast" } }
    },
    "enabledPlugins": { "product-manager@truecast": true }
  }
  ```
  Installed this way you call it `@agent-product-manager:product-manager`, and updates arrive with the
  marketplace, without the plan step. Commit it only for a marketplace you trust.
- **Is there a CLI?**
  Yes, for installs from any git URL, `doctor`, `prompt` and an ownership ledger. npm serves 0.2.0, which
  predates the in-session installer. For now, build it from source to use both together.
  **CLI docs →** (`docs/install.md`). *(This is the only CLI mention on the page. See §9, call 4.)*
- **Can I write my own?**
  Yes. A teammate is a folder of Markdown and one `persona.toml`. **Authoring guide →** Open a PR to add it
  to the catalog.

**Last line:** **The installer and the file formats are pre-1.0; they may change between minor
versions.**

### 5.8 Close

**H2:** **Put a specialist on the call you're about to make.**
**Primary CTA:** **Go to step 1** (anchor to §5.3) · **Secondary:** **Read the source on GitHub →**
**Feedback line:** **Used one? Tell us what it caught, or missed →** (GitHub issues)

### 5.9 Footer

**truecast · MIT · © 2026 Inder Singh** · GitHub · Docs · Changelog · Security · Issues

### 5.10 404 page (`site/404.html`, rebuild it, because it's staged for deletion)

- `<title>`: **Not here · truecast** · `noindex`
- H1: **Nothing at this address.**
- Body: **The page moved or never existed. The teammates are one command away.**
- CTA: **Back to truecast.dev →**

---

## 6. The install path, exactly as it works today

Re-run on 2026-10-17 in a throwaway `HOME` with Claude Code 2.1.302. The fresh install, plan, apply,
refusal, list and remove all behaved as below.

1. Terminal: `claude plugin install truecast --marketplace wastedcode/truecast` → clones
   `wastedcode/truecast.git` (main), adds the `truecast` marketplace to user settings, and installs
   `truecast@truecast` 0.1.2 at user scope.
2. Claude Code: `/truecast:install <name>`. The command validates the name, then runs
   `bash ~/.claude/plugins/marketplaces/truecast/plugin/truecast/bin/truecast-plugin.sh install <name>`
   (plan only, exit 0, `status=plan`). Claude shows the plan and asks. On yes it re-runs with `--yes` →
   `status=installed`, and the "ready" line names `@agent-<name>`.
3. If `~/.claude/agents/` didn't exist before, restart Claude Code once. If Claude Code was already
   open during step 1, run `/reload-plugins` before step 2.
4. If a foreign `~/.claude/agents/<name>.md` exists, the install exits 5 and refuses, even with `--force`.
5. `--project`: scopes the teammate to one repo, gitignores `.claude/agents/<name>.md`, and scaffolds
   `.truecast/agents/<name>/instance/mandate.md`. A user-scope install doesn't scaffold a brief.
6. Update: `claude plugin marketplace update truecast` + `claude plugin update truecast@truecast`,
   restart, then `/truecast:update <name>` or `--all` (`--all --project` is refused).
7. Remove: `/truecast:remove <name>` shows the plan, then deletes on yes.
8. Commands are `disable-model-invocation: true`, so Claude can't run them unasked. The user types them.

---

## 7. Proof inventory: what the page may show, and where it lives

| Artifact | Source in tree | Status |
|---|---|---|
| Fair-test table, 18 runs, costs | `site/proof/rerun/README.md` + 18 run files | ✅ backed |
| Hero verdict excerpt | `site/proof/rerun/truecast-2.md` | ✅ verbatim |
| First review (Fig. 1 report) | `site/proof/security-engineer.md` | ✅ backed (report only) |
| Fig. 1 "All 10 tool calls from its log", the tool trail | none: no log in `site/proof/` | ❌ don't show it unless the log is published |
| 66,578 / 2,780 tokens | README.md:36 and HEAD page. No log anywhere in the tree | ❌ drop it (§8b) |
| Playbook sizes | `personas/*/core`, `site/brand/cores.json` (`build.py --check`) | ✅ |
| Token costs per teammate | `claude plugin details`, 2026-10-17 (§5.4) | ✅ reproducible. Label as estimates |
| Plan / ready / refusal / remove output | captured 2026-10-17 (§5.3, §5.6) | ✅ verbatim |
| Step 1 output | captured 2026-10-17 | ✅ verbatim |
| Persona version history 1.1.0 → 1.2.2 | `git log -L` on `security-engineer/core/persona.toml` | ✅ |
| Anthropic "90.2%" quote | external; about Anthropic's research system, not this product | ❌ cut (§8a) |

---

## 8. Claim audit

### 8a. The staged working-tree `site/index.html` (would ship if not replaced)

| Claim | Verdict | Why |
|---|---|---|
| "Eleven teammates" / "eleven, deep" / meta "Eleven open-source expert teammates" | **False** | Twelve (`ls personas/`, marketplace.json). brand-designer is missing |
| Hero install: `/plugin marketplace add` + `/plugin install truecast@truecast` as the main path; "No terminal, no npm" | **Outdated** | Works, but README/docs make `claude plugin install truecast --marketplace …` the main path. The 3-line path is the pre-2.1.275 fallback |
| Typed `@security-engineer` | **Wrong form** | Installer 0.1.2 teaches `@agent-security-engineer` (a bare `@name` can resolve to a file) |
| "Read-only by default" | **False** | 7 of 12 can run commands or write files; security-engineer itself has Bash |
| "you read the exact prompt before you run it" / "`truecast prompt <name>` prints the exact prompt" | **Misleading** | The plugin plan shows tools and paths, not the prompt. `truecast prompt` is CLI-only, and the visitor isn't sent to the CLI |
| "Nothing phones home" (unqualified) | **Needs qualifying** | No servers is true, but teammates with WebFetch fetch pages. HEAD's wording is the honest one |
| Transcript "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", "+5 tool uses", "**Verdict: GO.** both known escapes verified closed" | **Invented UI / unbacked** | No published run matches. The published review of this repo is a NO-GO. Must not ship |
| "the notes it kept" / `instance/notes` | **False** | `work.md` notes are planned; nothing writes them (README) |
| "persona.md" in the diagram | **False** | Files are `agent.md` + `persona.toml` |
| Updates: `/plugin marketplace update truecast` | **Incomplete** | Also needs `claude plugin update truecast@truecast` for the installer |
| "Other marketplaces … hundreds, shallow" | **Unbacked comparison** | No measurement. Also a cheap shot that fails the good-look check |
| Anthropic 90.2% multi-agent quote | **Misattributed relevance** | It's about Anthropic's research system. It borrows authority truecast hasn't earned. Cut |
| "Structured craft … not a costume" / "not a paragraph of vibes" | **Unbacked contrast** | The fair test says a short prompt tied on catches. Don't sneer at the alternative that tied us |

### 8b. HEAD's page (live on truecast.dev now)

Mostly accurate. It's the base this deck keeps the facts from. Defects:

| Claim | Verdict | Fix |
|---|---|---|
| Link to `834b03d` (×2 on the page, plus proof READMEs and README) | **Fragile link, not in main's history** | Link `d70aa8d` (§0.3) |
| "66,578 tokens · 10 tool calls" → "2,780 tokens: the report" (Fig. "Its own context window") | **Unbacked**: no log published | Drop the numbers. Use the measured always-on/on-invoke table (§5.4). Alternative: publish the subagent's redacted JSONL usage in `site/proof/` and keep them |
| Fig. 1 "All 10 tool calls from its log", including the tool trail (opened skills, fetched docs, "ran the attack in a sandbox 3 runs") | **Partly unbacked**: the report is published, the log isn't | Same choice. The deck uses the truecast-2 verdict instead |
| Fig. 1 "security-engineer@1.2.2 · claude-opus-5-5" banner styled as UI | OK as a caption, **not** as fake UI chrome | The designer renders it as a caption |
| Plan shown "captured 2026-10-16" | ✅ Still matches byte for byte on 2026-10-17 | Restamp to 2026-10-17 if re-captured |
| "Five of the twelve can only read…" | ✅ | n/a |
| "SECURITY.md: 72 hours" | ✅ | n/a |
| "--force doesn't override that" | ✅ Re-verified 2026-10-17 (exit 5) | n/a |
| "Claude Code 2.1.292 or later" / "2.1.275" | From the docs, not re-verified | Keep |

### 8c. README.md (not the page, but a public surface)

- README.md:15: `834b03d` link, same fix as §0.3.
- README.md:36: the 66,578 / 2,780 figures are unbacked. Replace with the measured costs ("until called
  it adds ~120 tokens to a session; its ~5.1k-token agent body loads in its own context when it takes the
  job", from `claude plugin details security-engineer@truecast`) or publish the log.
- README "From CLI 0.3.0 … npm still serves 0.2.0": ✅ true today.

---

## 9. Calls made without the founder (all reversible)

1. **Kept the H1 "The expert teammates Claude Code doesn't ship with."** It names the category and the
   gap in nine words, and it matches the README header PNGs, the og alt text and the repo tagline.
   *Alternative:* "Ask a specialist. Get the call." It's sharper, but only 6 of 12 agent files ask for an
   explicit decision; the other six deliver artifacts. That makes it an overclaim, so I rejected it.
2. **Hero artifact = run `truecast-2` (fair test), not Fig. 1.** Fig. 1's tool trail has no published log;
   truecast-2 is verbatim, comparable, and has a published cost. *Alternative:* publish Fig. 1's log and
   keep the trail. It's richer visually, but it's work the founder would need to approve (log contents).
3. **Dropped 66,578 / 2,780; added measured per-teammate token costs.** *Alternative:* publish the log.
   If someone does, the numbers can come back in §5.4.
4. **The CLI appears only in one FAQ entry.** npm 0.2.0 can't see plugin-lane installs, so sending
   visitors there gives them the older, worse path. *Alternative:* a "Power users" block. Revisit when 0.3.0
   is published.
5. **Proof comes before install.** The visitor is solution-aware and skeptical, and the hero still carries
   step 1 for anyone who's already sold. *Alternative:* install second, which is the HEAD order. That's
   equivalent if the designer's layout puts the fair-test table in the first viewport scroll.
6. **No logos, stars, testimonials, or user counts.** We have none (8 GitHub stars), and the candor
   carries the trust.
7. **Kept naming VoltAgent.** It passes the good-look check: the result is reported fairly, the file is
   pinned, only two frontmatter lines were changed and that's disclosed, and it was the cheapest. No
   adjectives about them.

---

## 10. Hand-off notes

**To brand-designer:** the verbal identity is in §4. The page's single visual idea should be **real
output**: the plan, the verdict, the fair-test squares, the playbook bands. Everything shown is something
a visitor can reproduce. Redraw `og.png` if you change the system, and keep its alt text literally true.
Don't add "Opus 4.8 / Claude Max"-style chrome to anything.

**To ui-ux-designer:**
- Replace all three staged files (index.html, app.js, styles.css) and rebuild `404.html`.
- Every copy button copies exactly the code shown. The step-4 brief command is multi-line, so test the
  paste in bash and zsh.
- Keep `scripts/brand/page.py --check` / `build.py --check` green if you keep the drawn playbooks.
- Must-ship captions: the §5.2 under-table paragraph, the §5.5 footnote, and the "size isn't a score"
  label. Those three are what keep the page honest. Don't cut them for space.
- Anchor IDs used by copy: `#proof`, `#install`, `#later`, `#in-session`, `#teammates`, `#faq-team`.

---

## Frontier check

- **Who's the bar?** The best contemporary dev-tool homepages: Linear (one plain category sentence),
  Bun (benchmarks you can rerun), Tailscale (trust through specifics), Resend (code as the hero), and
  Oxide (candor as brand). The composite bar: a plain category H1, the code in the first viewport, proof
  a skeptic can rerun, and losses stated. This deck does all four. None of those pages publishes a tie
  against a 76-word competitor. That's the one place truecast can beat them on trust.
- **Asks pre-empted:** "is that number real?" (every figure has a source), "what's in it / what can it
  run?" (the playbook list, the Can-touch column, the plan), "will it clobber my file?" (the refusal
  output), "does it cost me context?" (the measured table), "why not my own prompt?" (we tested it and
  said it tied), "what does npm give me?" (0.2.0, said plainly), "will my team get it?" (settings.json).
- **Checked by looking:** the install path was re-run end to end today; persona counts, tools and words
  were recomputed; the npm, tags and default branch were queried; the `834b03d` ancestry was tested.
- **Not verified:** the Claude Code version floors (2.1.292 / 2.1.275), because no older build was
  available. They're stated as the docs state them.
