# truecast.dev homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer (identity) then ui-ux-designer (the page).
Status: final copy, ready for the designer. Founder calls I made in their absence are in §10. Each one says what I picked and what the other option was.

This file is the source for every word on the page. If the page and this deck disagree, the deck is right. If the deck and the repo disagree, the repo is right, so tell me.

---

## 0. What the page ships against (checked 2026-10-17)

| Channel | What a visitor actually gets | Checked how |
|---|---|---|
| GitHub default branch `main` | `90b49d8` today. This branch merges into it, so every path in this tree resolves after merge | `git log origin/main` = `HEAD` |
| Marketplace (`wastedcode/truecast`) | Installer plugin `truecast@truecast` **0.1.2** and 12 persona plugins at the versions in §5 | Ran `claude plugin install truecast --marketplace wastedcode/truecast` on Claude Code 2.1.302 with a clean `HOME`. It cloned `main` at `90b49d8` and installed. Output in §6 |
| Installer plan and apply | Same output as on the page | Ran `truecast-plugin.sh install product-manager` and then `--yes` in a sandbox `HOME`. Output in §6 |
| npm `@wastedcode/truecast` | **0.2.0** (`latest`, 2026-07-22). The repo says 0.3.0. 0.2.0 doesn't share installs with the plugin lane | `npm view` |
| git tags | `v0.1.0`, `v0.1.1`, `v0.2.0` only | `git tag` |
| Claude Code docs | `claude plugin install … --marketplace` needs **2.1.292+**. `/plugin install … --marketplace` needs **2.1.275+**. Mention form is `@agent-<name>`, and `@agent-<plugin>:<name>` for plugin agents. Panel label is "Install for you (user scope)". Third-party marketplace auto-update is off by default | code.claude.com/docs/en/sub-agents, /discover-plugins, Claude Code CHANGELOG (research pass, 2026-10-17) |

**Rule for the page:** it sells the plugin lane only. The npm CLI is a footer/docs link and nothing more. No CLI 0.3.0 feature is offered as something you can install today.

**The working tree is not the live page.** The staged `site/index.html`, `app.js` and `styles.css` (and the deleted `site/404.html`) are the old pre-#50 page. It says "Eleven teammates", shows a made-up terminal, and ships the retired amber brand. If the working tree is committed as it stands, that page replaces the live one. The new build must overwrite all three files and restore `404.html` (`git show HEAD:site/404.html`). The live page is `HEAD:site/index.html`. Both are audited in §9.

---

## 1. Audience and the 5-second belief

**Who it's for (beachhead).** A developer who builds and ships with Claude Code, alone or on a team of a few. They make calls outside their own expertise every week: is this safe to merge, should we build this next, will anyone care, who would pay. Nobody on hand does those jobs. They already know what a subagent is. Many have tried a free collection or written an agent file. Some use gstack.

**Second ring.** Engineers on larger teams who want a security, QA or architecture pass before a human reviewer sees the PR. The page serves them through the same cast table. It doesn't need its own section.

**Awareness and sophistication.** Solution-aware, in a crowded market (Schwartz stage 4–5). "100+ agents" is the category's default claim: VoltAgent advertises 161, wshobson 202 agents, claude-code-templates "100+". More agents is a claim nobody believes any more. What still works on this reader: a specific mechanism, real output, and candour. That decides the page: show the output, name the difference, publish the losses.

**Their words (mined, not invented).** The complaint this reader shares is Claude agreeing with them: *"Claude says 'You're absolutely right!' about everything"* (Claude Code issue #3382, ~179 comments; The Register, 2025-08-13). The workaround they type is "act like a senior security engineer". The page uses "the call", "ship it or don't", "second opinion" and "act like a…". It never uses "AI-powered", "supercharge" or "10x".

**The 5-second belief** (what a visitor should be able to say after one glance):
> "truecast gives Claude Code twelve specialist teammates: security, QA, architecture, product, design, marketing, sales, even a seed investor. I `@` one, it works in its own context, and the reviewers come back with a decision. It's free, and two commands get me the first one."

**The 30-second belief** (after the first scroll):
> "They published a test where a 76-word agent found as many bugs as theirs. What theirs did differently was end every run on GO or NO-GO. So the point isn't magic bug-finding. Twelve roles are already written, each makes the call, my brief stays mine, and nothing gets installed without a plan I approve."

---

## 2. Positioning (Dunford 5+1, every line backed)

| Component | The position | Proof (source) |
|---|---|---|
| **Competitive alternatives** (what they do today) | 1. Ask Claude in the main session, or run built-in `/security-review` or `/code-review`. 2. Write a short agent file ("act like a senior…"). 3. Download one from a collection (VoltAgent, wshobson, claude-code-templates). 4. Install a role pack of slash commands or skills (gstack; Anthropic's knowledge-work-plugins). 5. For the non-code calls, mostly nobody: they decide alone | Research pass, 2026-10-17 (counts and quotes in §8) |
| **Unique attributes** | A. Each role is a **subagent with a playbook**: 9–21 skills plus reference notes, 5,116–17,284 words, opened on demand inside its own context. B. Each agent file tells it to **end on a decision** (GO/NO-GO, invest/pass, painkiller/vitamin, ship/don't). C. **Your brief** (`mandate.md`) lives in your repo, gets read first, and no update ever writes to it. Playbooks are versioned, and an update shows a plan and a diff. D. **An installer that asks first**: you call each teammate by its own name (`@agent-<name>`, no plugin prefix) in every project, see the plan before any write, see each tool on the label, it never overwrites a file it didn't write, and no server is involved. E. **Twelve roles across the whole product.** The research pass found none of the others shipping a seed-investor role | `personas/*/core` (counted §5); `personas/*/core/agent.md`; `plugin/truecast/bin/truecast-plugin.sh`; `docs/install.md` |
| **Value** | You get a specialist's decision on the call in front of you. You don't write or maintain the specialist. Your session doesn't fill with its digging. The brief you give it stays yours | — |
| **Discriminating proof** | 1. **6 of 6 vs 0 of 12:** same prompt, six runs each. Only truecast's runs all ended on an explicit GO or NO-GO (fair test). 2. **66,578 → 2,780 tokens:** the review's digging stayed in its own context, and your session got the report. This separates it from asking in the main thread, not from other subagents, and the page says so. 3. **"Don't build `--pin` next."** A product call that disagreed with the question asked, backed by registry data we checked. $0.64, 70 s. One run, shown as an example of the output, not as a score. 4. **It found a real hole in our installer** (hostile repo → `~/.bashrc`), fixed in `834b03d`. The other two agents found it too, and we say so | `site/proof/rerun/README.md`; `README.md`; `site/proof/product-manager/README.md` (new, §6); `site/proof/README.md` |
| **Who cares most** | The builder who wears every hat (§1). For them the non-code roles aren't extras. Those are the calls they make alone | — |
| **Category** | **Specialist subagents for Claude Code.** The product noun is **teammate**. Subagents are a category this reader already knows, so they place it instantly. "Teammate" carries the role-plus-brief idea. We don't invent a category | — |
| **Trend (+1)** | Subagents and plugins are now a native, documented part of Claude Code. We say "native Claude Code subagent" as a fact and ride no trend beyond that. No "agentic" | code.claude.com/docs/en/sub-agents |

**Positioning statement (internal, never on the page as written).** For developers who ship with Claude Code and make calls outside their expertise, truecast is a set of twelve specialist subagents. Each works from a playbook already written, reads the brief you keep in your repo, and comes back with a decision. A hand-written or downloaded agent is one file you maintain yourself. Each truecast teammate is versioned, updated only when you approve the plan, and installed without touching anything it didn't write.

**The skeptic's sentence**, written before the hero, as the frontier bar requires:
> "On the one test they ran, a 76-word prompt found as many bugs, for $0.19 less a run."

The lead has to survive that sentence sitting next to it. It does, because the page never sells catching more. It sells four things: the roles are ready, each one makes the call, the brief is yours, and the install asks first. The tie is on the page, at its real size, next to the one thing that differed.

**Painkiller and loop (said plainly, for the founder).**
- **Acuity: medium.** The moments are real and expensive: merging something exploitable, building the wrong thing, launching to silence. But today's workaround is cheap. For a developer who already writes agent files, truecast is a convenience, and the fair test shows it. The painkiller segment is the builder with no specialist on hand for the non-code calls. The page is aimed at them, and the cast table leads with the call, not the job title.
- **Loop.** One loop is built in. Commit `enabledPlugins` to a repo's `.claude/settings.json`, and Claude Code offers the teammate to everyone who opens that repo, so it spreads with the code. The output itself also travels: a NO-GO pasted into a PR shows teammates where it came from. The page gives the team snippet in the FAQ.
- **The one channel:** developer communities that reward candour (Show HN, r/ClaudeAI), with the story "we published the test our product tied." That is a growth recommendation, not page copy. Spend and posting belong to the founder.
- **Out loud:** no catch-rate claim is available, and none should be made until a fair n≥6 test supports one (`fair-test-result`). If installs stay flat after this page ships, the copy isn't the reason. The cause is a value gap for readers who already roll their own, and that is a product question (→ product-manager).

---

## 3. Messaging house

**Core message:** *Twelve specialists for Claude Code, already written. Each one does the digging in its own context and comes back with a decision.*

| Pillar | Says | Proof on the page |
|---|---|---|
| **1. It makes the call** | Each teammate ends on a decision you can act on, and the decision can be no | Hero artifacts (NO-GO; "Don't build `--pin` next"); the fair test, 6/6 vs 0/12 |
| **2. Twelve roles, ready** | The roles you don't have, written in depth, from security to a seed investor | The cast table: real skill and word counts and the tools each one declares |
| **3. Your brief stays yours** | One file in your repo. It's read first, and no update writes to it. Playbook updates are versioned, and you adopt them when you choose | Brief path; update plan output |
| **4. Nothing is installed behind your back** | Plan first. Tools on the label. It won't overwrite your files. No server | Verbatim plan output; verbatim refusal output |

**Candour runs through every pillar.** Every number carries its source, and the loss sits next to the win.

---

## 4. The page, in order

Length: **1,281 words of prose** (every `>` line in §4.1–4.11, counted), about 1,900 with the cast table, hero tabs, headings and labels, and commands and captured output on top of that. The live page shows 3,208 visible words plus 338 in attributes. Each idea has one home: plan-first lives in §4.7, the brief in §4.5, the tie in §4.3 (the strip only points there). Elsewhere, link to the home rather than restating it. Every section has one job. Nothing is said twice.

Voice, which matches `site/brand/BRAND.md`: exact, not cold. Candid, not modest. Plain words. Short sentences, though not choppy ones. No exclamation marks. No "seamless", "powerful", "supercharge", "unlock", "AI-powered". No em-dash chains. Numbers always name what they measure.

Terms, one meaning each:
- **teammate**: the thing you install and call. On the page, "persona" appears only in the footer link "Write your own".
- **playbook**: its files. Never "skills" on its own, because that collides with Claude Code Skills. If the word appears, it's "17 skills in its playbook".
- **brief**: `mandate.md`. Never "mandate" in body copy, except in the path.
- **installer**: the `truecast@truecast` plugin.
- **the call / a decision**: GO/NO-GO and its siblings.

---

### 4.0 `<head>` and share card (derived copies; move them with the story)

- `<title>`: `truecast: expert teammates for Claude Code`
- meta description / og:description / twitter:description (155 chars max):
  `Twelve specialist subagents for Claude Code, from security engineer to seed investor. Free, open source, two commands to your first.` (132 characters)
- og:title: `The expert teammates Claude Code doesn't ship with.`
- og:image alt: brand-designer to update if the card changes. Otherwise keep the current alt.
- Keep `/brand/og.png` unless brand-designer redraws it. Its headline is the H1, which stays.

### 4.1 Nav

`truecast` (wordmark) · **Teammates** · **Proof** · **Install** · **GitHub ↗**
Primary nav button (right): **Install**, which jumps to §4.6.

### 4.2 Hero (the first screen; it must carry the 5-second belief alone)

**Purpose:** what it is, for whom, the one difference, and the first command, all without scrolling.

**H1** (kept, see §7 for the 36 I tested against it):
> The expert teammates Claude Code doesn't ship with.

**Sub** (one sentence, then one more):
> Twelve specialist subagents, from security engineer to seed investor, each with a playbook already written. Type `@`, pick one, and it works in its own context. Six of them end on a call: ship it or don't, build it or don't, invest or pass.

(Scoped on purpose. The six are security-engineer, qa, product-manager, product-marketer, sales and vc-seed, whose agent files all ask for a verdict. The other six hand back work: architect, engineer, infrastructure, product-researcher and the two designers. The cast table says what each one returns.)

**Primary CTA**, a copy block. Each command gets its own copy button everywhere on the page:
```
claude plugin install truecast --marketplace wastedcode/truecast
```
Button: **Copy**
Line under it:
> In your terminal (Claude Code 2.1.292 or later). Then in Claude Code: `/truecast:install security-engineer`, or any of the twelve. Already open? Run `/reload-plugins` first. If the teammate isn't in the `@` list after that, restart Claude Code once.

**Beside the copy button** (Bun's "View install script ↗" move): `Read the installer ↗` → `https://github.com/wastedcode/truecast/blob/main/plugin/truecast/bin/truecast-plugin.sh`. Every write is done by that one script, so this link answers "what am I letting in?" in one click.

**Secondary link:** `Already in a session? Set it up from there →` jumps to §4.6's "Already in Claude Code" block.

**Trust line** (small, one line): `Free and open source (MIT) · No truecast account · Read the installer before you run it`

**The real artifact (right side on desktop, below the CTA on mobile).** "Two calls, from two teammates." It's a tabbed card, or two stacked cards on mobile, and both tabs are real output:

Both runs were made the same way: `claude -p "<prompt>" --agent <name>`, so the teammate got the prompt exactly as written. Neither prompt named a form of answer. The fair-test prompt says "Give your full verdict and findings", and that identical text went to all three agents, so the GO/NO-GO form is the teammate's. The PM prompt says "Give me your call." Labels use the names, not a mention form, because neither run was an @-mention.

Tab 1, **security-engineer**. Source: fair-test run `truecast-2`, which means the same prompt the other two agents got. It's one of the two runs that opened its playbook (the verdict and grading skills), and one of three truecast runs that raised two of the three holes, so it's one of our better runs, and the label says so:
- Header line: `security-engineer 1.2.2 · reviewed our installer · 2026-10-16 · run 2 of 6, one of our better ones`
- Prompt (trimmed, mark kept): `Review plugin/truecast/bin/truecast-plugin.sh and the slash commands in plugin/truecast/commands/. … Can anything here get a user owned? Give your full verdict and findings.`
- Verdict (verbatim, `rerun/truecast-2.md:7`, all three sentences, so the split call by lane shows): **`Verdict: yes, someone can get owned, but only through --project. That path is NO-GO until F1 is fixed. The user-scope lane is GO, as long as F2 is fixed before the next release.`** (Both are fixed in #50, which the footer says.)
- One finding (verbatim, `:9`): `F1 — P1: a hostile repo can write any file in your home, which leads to code execution (reproduced)`
- Footer: `opened 2 skills from its playbook · $1.14 · 4.3 min · claude-opus-5-5 · fixed in #50` with links to `https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/truecast-2.md` and `https://github.com/wastedcode/truecast/pull/50` (on main the fix is in `d70aa8d`. Don't link `834b03d` from the page: GitHub shows it with a "does not belong to any branch" banner).

Tab 2, **product-manager**. Source: `site/proof/product-manager/README.md`:
- Header line: `product-manager 2.4.2 · asked about our roadmap · 2026-10-17 · one run`
- Prompt (trimmed, mark kept): `Our roadmap in docs/README.md lists --pin … as planned. Should we build it next, or is something else more important? Give me your call.`
- Verdict and its reason, whole sentences from the report, with the gap marked: **`Don't build --pin next.`** `…` `Most of the pain is already handled. Updates only happen when someone runs them.`
- Footer: `opened 2 skills from its playbook · $0.64 · 70 s · we checked its facts` with a link to `https://github.com/wastedcode/truecast/blob/main/site/proof/product-manager/README.md`.

Caption under the card (one line):
> Real output from single runs, trimmed where you see `…`. Full reports linked.

*Why this artifact:* it shows the payoff, a call, before any mechanism. It shows range (code and product). And the form of the call came from the teammate: the other two agents got the same words and didn't use GO/NO-GO. Tab 1 used to be the first review (Fig. 1), but that prompt was written by the main session and asked for GO/NO-GO, so it can't carry the claim. The fair-test run can. The first review stays in `/proof/`.

*Note on tab 2:* cut at sentence boundaries only, never inside a sentence. The report's other advice (publish 0.3.0, talk to users, the npm count) is one click away, unedited. It stays off the hero for two reasons: it's about our adoption rather than the visitor's work, and the page doesn't sell the CLI. Founder call #2 in §10.

**First-screen contrast** (directly under the hero, full width, one line plus a link. This is the discriminating fact the frontier bar requires above the fold):
> **One security review, same prompt, six runs each:** a 76-word agent found as many holes as ours. Only ours ended every run on an explicit GO or NO-GO (all 6 of its runs; the other two agents, 0 of 12), because its agent file says to. Of our other eleven teammates, five end on a call of their own, and all are already written. **How we tested ↓**

(Why this order: the skeptic's first thought is "one prompt line would get me GO/NO-GO." That's true, and the strip says so through "because its agent file says to". The value is then the twelve files nobody has to write. The tie comes first so the win can't be read as hiding it.)

### 4.3 The test (id `proof`)

**Purpose:** the candour that earns trust, at its real size, and short. The live page's Fig. 2 stays as the visual, trimmed.

**H2:**
> We tested it against an agent you could write in a minute.

**Body** (two short paragraphs):
> We asked three security agents to review our own installer. All three agents found that, in `--project` mode, a hostile repo could get its text written into your `~/.bashrc`. We fixed that and two more holes (#50): temp files, hooks in agent files, and pre-approved shell. Then we gave one prompt, byte for byte, to each agent, six runs each: a 76-word one we wrote, the 1,007-word security agent from VoltAgent's free collection, and ours. We scored every run on those three holes.
>
> The 76-word agent found as many holes as ours, for less money. No run of any agent found all three holes. Ours was the only agent that closed every run on an explicit GO or NO-GO, with findings ranked by when to fix them. That comes from its agent file. Yours could do it too, if you write it to. One hand-written run came close: "Don't ship this until #1 and #2 are fixed." 

**Artifact: the results table** (from `site/proof/rerun/README.md`, unchanged numbers):

| | Hand-written · 76 words | Free collection · 1,007 words | truecast · agent file + 20-file playbook (opened in 2 of 6 runs) |
|---|---|---|---|
| Holes found (3 holes × 6 runs) | 9 of 18 | 6 of 18 | 9 of 18 |
| Closed on an explicit GO or NO-GO | 0 of 6 | 0 of 6 | **6 of 6** |
| Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

The live page's per-run squares (Fig. 2) are fine as the visual, and brand-designer owns that call. If kept, the three hole rows sit inside a "show by hole" toggle so the table above is what a skimmer reads.

**Method line** (small type, one line, required by "run facts come from the run logs"):
> Claude Code 2.1.301, `claude-opus-5-5`; in 8 of the 18 runs Claude Code switched to `claude-opus-4-8` partway. Scored on the three holes we fixed, decided before we read any report. A safety classifier interrupted 10 runs. All 18 returned a report; one says it couldn't finish.

**Links:** `All 18 reports and how we scored them →` (`https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/README.md`) · `The first review, and why we reran it →` (`https://github.com/wastedcode/truecast/blob/main/site/proof/README.md`)

**All proof links on the page are GitHub blob URLs on `main`**, as on the live page. Cloudflare Pages serves `site/proof/*.md` raw and has no index for the folders, so `/proof/...` paths would 404 or show raw text.

**Disclosure line** (required: the proof reveals a hole, and existing users must know how to get the fix):
> Already have truecast? If `claude plugin list` shows the installer below 0.1.2, update it. That's two commands, under **Install → Later**.

**What this section drops from the live page:** the paragraphs about the main session writing different prompts, F2's crediting, the 5.5-only re-count, and the fourth hole. All of it stays in `/proof/`, one click away. The page keeps every number a skeptic would check first.

### 4.4 The cast (id `teammates`)

**Purpose:** let the reader find *their* call and install that teammate from the row.

**H2** (kept from the live page, a tuned line):
> Twelve teammates. Pick the call you'd rather not make alone.

**Intro** (one line):
> Each is a folder of plain Markdown you can read on GitHub before you install it.

**Table.** Grouped by the kind of call. One row per teammate. Columns: **Teammate · The call · What it hands back · Can use · Playbook**, plus per row an install copy button and `See inside →`.

"What it hands back" is from each `agent.md`'s required output. The live page's column was checked across three review passes, and I re-checked four against the files today. "Can use" is from `persona.toml` `tools`. Counts are from `personas/*/core`, recounted today (§5).

| Group | Teammate | The call | What it hands back | Can use | Playbook |
|---|---|---|---|---|---|
| Build | software-architect | How should this be built so it lasts? | A design doc with a real diagram, and a decision record for each hard-to-change call | read · write files · web | 18 skills · 13,025 words |
| Build | software-engineer | Can I trust this code? | Code proven by trying to break it, shipped in small safe steps | read · edit files · run commands · web | 13 skills · 6,697 words |
| Build | qa | What breaks before a user finds it? | Ship or don't-ship, with the blocker list | read · run commands · web | 17 skills · 13,107 words |
| Ship | security-engineer | Can this get someone owned? | Findings at file:line, each graded, and a GO or NO-GO | read · run commands · web | 17 skills · 12,697 words |
| Ship | infrastructure | Will this hold up in production? | Commands that work first time, with how to undo them | read · edit files · run commands · web | 21 skills · 14,121 words |
| Decide | product-manager | Are we building the right thing? | A validated spec, its success bar, and an acceptance verdict | read · web | 17 skills · 8,570 words |
| Decide | product-researcher | What are users actually telling us? | Findings ranked by confidence, each with its receipts | read · web | 16 skills · 8,035 words |
| Design | ui-ux-designer | Can people actually use this? | User flows, and a design it has rendered and checked at every screen size | read · edit files · run commands · web | 21 skills · 17,284 words |
| Design | brand-designer | Would anyone remember us? | One brand idea, a mark tested at 16px, the identity as tokens | read · edit files · run commands · web | 9 skills · 5,116 words |
| Market | product-marketer | Why would anyone care? | The positioning, the copy, and a will-it-land verdict | read · web | 18 skills · 16,902 words |
| Market | sales | Who would actually pay for this? | A painkiller-or-vitamin verdict and a buyer profile, with the evidence | read · web | 16 skills · 12,361 words |
| Raise | vc-seed | Would an investor write the check? | Invest or pass, and the one risk it would underwrite | read · web | 16 skills · 8,470 words |

Per row: `/truecast:install <name>` with a Copy button, and `See inside →` linking to `https://github.com/wastedcode/truecast/tree/main/personas/<name>/core`.

**Footnote** (small, required so "hands back" isn't read as a tested result):
> "What it hands back" is what each agent file tells it to produce. We've tested one, security-engineer, six runs, above. The product-manager output in the hero is one example run. "Can use" lists the tools it declares, and the install plan shows them again before you say yes. "Run commands" means Bash, which can also change files.

**The size visual.** brand-designer owns whether it stays. Its label, exactly: *"Size shows what's inside. It isn't a score."* The tie is already stated in §4.3, so it isn't repeated here.

### 4.5 What a teammate is (id `how`)

**Purpose:** the mechanism, in three short parts, each with its artifact. It comes after the payoff, never before.

**H2:**
> A playbook, your brief, and its own context.

**Three columns** (one idea each, 40 words max of body):

1. **H3: A playbook it opens on the job.**
   > Plain Markdown: for security-engineer, 17 skills and 3 reference notes. It opens one when the job calls for it. In our test, 2 of its 6 runs did. They load into the teammate, not your session.
   Artifact: the file list of `personas/security-engineer/core/` (the live Fig. 3, collapsed by default), with a link to the folder.

2. **H3: Your brief, in your repo.**
   > One file in your repo: `.truecast/agents/<name>/instance/mandate.md`. Start Claude Code from the repo root and the teammate reads it first. No update ever writes to it. No brief? It works from what you ask.
   Artifact: the live Fig. 4 ("where an update writes, and where it stops"). Its label must stay generic (`1.1.0 → 1.2.2` is security-engineer's real history, so keep that exact pair or drop the numbers).

3. **H3: Its own context window.**
   > Each teammate is a native Claude Code subagent, so, like any subagent, its digging stays out of your session. In our first review its own context grew to 66,578 tokens. Your session got the 2,780-token report.
   Source link: `https://github.com/wastedcode/truecast/blob/main/site/proof/README.md#method` (the derivation is published there as of this change).
   Artifact: the live two-bar figure (66,578 vs 2,780), unchanged.

### 4.6 Install (id `install`)

**Purpose:** one path that works first time, with what you'll see at each step, the undo, and the update.

**H2:**
> Two commands to your first teammate. Then call it by name.

**Step 1. In your terminal, once per machine**
```
claude plugin install truecast --marketplace wastedcode/truecast
```
> Needs Claude Code 2.1.292 or later (`claude --version`). This installs the installer.

`You'll see, at the end` (verbatim, captured 2026-10-17, Claude Code 2.1.302):
```
✔ Successfully added marketplace: truecast (declared in user settings)
Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
```

**Step 2. In Claude Code, in any project**
```
/truecast:install security-engineer
```
> Claude Code already open? Run `/reload-plugins` first. Claude shows you the plan; say yes and it installs.

`What the installer prints` (verbatim, home shown as `~`, its last machine-readable line left off). Claude shows you this before it asks:
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
> The last line appears only if you've never had a `~/.claude/agents/` folder. If you see it, restart Claude Code once.

(Re-verified today with product-manager in a sandbox `HOME`: same shape, same lines, `tools granted to @product-manager: Read, Grep, WebSearch, WebFetch`. The security-engineer block above is the live page's capture, and its version still matches `persona.toml`. **Designer: if any persona version changes before merge, re-capture this block from the script, don't hand-edit it.**)

The ready line (verbatim from the script):
```
✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
```

**Step 3. Call it by name**
```
@agent-security-engineer review the changes on this branch before I merge
```
> Type `@` and pick it from the list, or type `@agent-` and its name. Any teammate, any request.

**Step 4 (optional). Give it your brief**
```
f=.truecast/agents/security-engineer/instance/mandate.md; [ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
```
> In your repo (macOS, Linux or WSL). It saves the template and leaves an existing brief alone. Fill it in and commit it. For another teammate, swap the name in both places.

(All 12 `instance-template/mandate.md` files exist in the tree. The URL resolves after merge.)

**Already in Claude Code?** (collapsed block; id `in-session`)
> On 2.1.275 or later, this replaces step 1:
> `/plugin install truecast --marketplace wastedcode/truecast`
> It asks before adding the marketplace, then opens the plugin's page. Choose **Install for you (user scope)**, then run step 2. If `/truecast:install` isn't there yet, run `/reload-plugins`.
> Older than 2.1.275: run `/plugin marketplace add wastedcode/truecast`, then `/plugin install truecast@truecast`, one at a time. The second opens the same panel; choose **Install for you (user scope)**.

**On Windows?** (one line) `Run Claude Code inside WSL and follow these steps. The installer needs a POSIX shell, so native Windows isn't supported.`

**Later** (collapsed block; id `later`; the H3s are the scan)
- **H3: Take the improvements.** In your terminal: `claude plugin marketplace update truecast` (fetches new teammate versions), then `claude plugin update truecast@truecast` (updates the installer itself), then restart Claude Code. Then in Claude Code: `/truecast:update security-engineer`, or `--all`. You see the new version's plan first.
- **H3: Take it back out.** `/truecast:remove security-engineer` lists what it will delete and waits for a yes. To remove the installer: `claude plugin uninstall truecast@truecast`. To forget the catalog: `claude plugin marketplace remove truecast`. 
- **H3: See what you have.** `/truecast:list`.

Each command is its own copy button.

### 4.7 Before anything is written (id `trust`)

**Purpose:** answer "why let some Markdown into my setup?" with output, not adjectives.

**H2:**
> You see the plan before anything is written.

Four short blocks (H3 + 1–2 sentences each):

1. **H3: You see the plan first.**
   > The version, every tool it gets, every path it will write. The script writes nothing without `--yes`. The command tells Claude to add it only after you approve the plan it shows you, and Claude can't start the command on its own. If it would replace a file it wrote before, you see the diff first.
2. **H3: Every tool is on the label.**
   > Five of the twelve can only read, search and fetch web pages. Seven can also run commands or write files. The cast table and the plan say which.
3. **H3: It won't overwrite an agent file you wrote.**
   > We put a hand-written `security-engineer.md` in `~/.claude/agents` and ran the install, then ran it again with `--force`. Both times it refused:
   ```
   ~/.claude/agents/security-engineer.md exists and truecast did not write it.
   error: refusing to overwrite a file truecast did not generate: ~/.claude/agents/security-engineer.md
   ```
   (Captured 2026-10-17, user scope, sandbox home shown as `~`, its machine-readable line left out. Exit 5 both times. This replaces the live page's `--project` capture, which showed a mode the page doesn't teach.)
4. **H3: No truecast server.**
   > The installer copies from the clone Claude Code already made from GitHub, using one shell script you can read. It sends us nothing. Teammates with web tools can fetch pages, like any Claude Code agent with those tools.

(Changed from the live page: "Nothing runs on our servers. We don't have any." becomes "No truecast server". And "truecast collects nothing" becomes "It sends us nothing". The site itself is hosted, and we can't vouch for the host's request logs. The new wording is exactly what the code backs.)

### 4.8 Questions (id `faq`)

**H2:** `Questions.` Seven of them. Each answer is ≤ 70 words, and each instruction can be run today.

1. **I already wrote an agent file. Why switch?**
   > If it does the job, keep it. truecast won't install over a file in `~/.claude/agents` that it didn't write. What you'd get is the other eleven roles, already written, each reading a brief you keep in your repo. To run ours beside yours, rename yours first: the file and its `name:` line.

2. **How is this different from gstack or a skills pack?**
   > gstack describes itself as "all slash commands". Skills load into your session. A truecast teammate is a subagent you call by name: it runs in its own context with only the tools its role declares, and hands back one report. They don't conflict, and plenty of people will use both.
   (Good-look check passed: it quotes gstack's own words, makes no quality claim, and ends generously. It names gstack because it's the alternative this reader is most likely to have, at 136k★.)

3. **Doesn't Claude Code already have `/security-review`?**
   > It does, and it's a good first pass on a diff. A teammate is for the call around it: a review that reads your brief, follows the trust boundary past the diff, and ends on GO or NO-GO. Most of the other eleven, from product manager to seed investor, have no built-in equivalent.
   (Claim check: `/security-review` "analyze[s] the changes on your current branch", per the Claude Code docs. Everything said about the teammate is from its agent file.)

4. **What does it cost?**
   > Nothing to install. Each teammate asks for Opus and runs on your own Claude Code usage, whether that's a subscription or an API key. On our test a truecast security review averaged $1.04 for the whole session at API prices. The product-manager run in the hero cost $0.64.

5. **Does it learn my project?**
   > Not on its own. It reads your brief at the start of every job, so it knows what you've written there. Edit the brief and the next run picks it up.

6. **Can my whole team get it?**
   > Yes. Merge this into the repo's `.claude/settings.json`, and Claude Code offers the teammate to anyone who trusts the folder:
   ```json
   {
     "extraKnownMarketplaces": {
       "truecast": { "source": { "source": "github", "repo": "wastedcode/truecast" } }
     },
     "enabledPlugins": { "product-manager@truecast": true }
   }
   ```
   > Installed this way it's called `@agent-product-manager:product-manager`. It updates when you run `claude plugin marketplace update truecast` and then `claude plugin update product-manager@truecast`, without the plan step. It still reads your brief, but it isn't told to read it first. Commit it only for a marketplace you trust.

7. **Can I write my own?**
   > Yes. A teammate is a folder of Markdown and one `persona.toml`. **Authoring guide →** (`docs/authoring-personas.md`). Open a PR to add it to the catalog.

Small print under the FAQ: `The installer and the file formats are pre-1.0 and may change between minor versions.`

### 4.9 Made by three of them (id `made`). CONDITIONAL

**Ship this section only if all three are true at merge:** (a) the shipped page's words come from this deck, its identity from brand-designer, and its build from ui-ux-designer; (b) a public receipt is published under `site/proof/homepage/`, holding the final copy, the identity spec and the build notes, plus who did what. It does **not** hold this deck's strategy sections (§1–3, §9–10), which are internal; (c) any edits after hand-off are listed there. If any of the three is false, cut the section entirely. Don't soften it.

**H2:**
> This page was written, branded and built by three of them.

**Body:**
> product-marketer wrote the copy, brand-designer the identity, ui-ux-designer the page. What each handed over, and every change made after, is published.

**Link:** `See what each one handed over →` (`https://github.com/wastedcode/truecast/tree/main/site/proof/homepage`)

*Why:* it's the one piece of range proof nobody can fake on their own homepage, and the reader is looking at the output. It's the most shareable fact on the page.

### 4.10 Closing CTA

**H2:**
> Put a specialist on the call you're about to make.

**Button:** `Install` → `#install` · **Link:** `Read the source on GitHub →`
**Feedback line:** `Used one? Tell us what it caught, or missed →` (GitHub issues: `https://github.com/wastedcode/truecast/issues`)

### 4.11 Footer

> Open source, MIT. Built by Inder Singh (wastedcode). Found a hole? `SECURITY.md`: we aim to acknowledge within 72 hours.

Links: GitHub · Docs · Write your own (`docs/authoring-personas.md`) · Changelog · Security · Issues · `npm CLI (0.2.0)` → `docs/install.md#cli`

---

## 5. Per-teammate facts (recounted 2026-10-17 from `personas/*/core`)

Words = `agent.md` + `skills/*/SKILL.md` + `knowledge/*`. These match the live page and `cores.json`, and `scripts/brand/build.py --check` and `page.py --check` are the drift gates. Re-run them after any persona change.

| name | version | tools | skills | knowledge | words |
|---|---|---|---|---|---|
| brand-designer | 0.1.6 | Read Grep Glob Bash WebSearch WebFetch Write Edit | 9 | 1 | 5,116 |
| infrastructure | 1.2.2 | Read Grep Glob Bash Edit Write WebSearch WebFetch | 21 | 2 | 14,121 |
| product-manager | 2.4.2 | Read Grep WebSearch WebFetch | 17 | 3 | 8,570 |
| product-marketer | 1.5.6 | Read Grep WebSearch WebFetch | 18 | 4 | 16,902 |
| product-researcher | 0.2.2 | Read Grep WebSearch WebFetch | 16 | 4 | 8,035 |
| qa | 1.3.2 | Read Grep Glob Bash WebSearch WebFetch | 17 | 2 | 13,107 |
| sales | 2.2.2 | Read Grep WebSearch WebFetch | 16 | 3 | 12,361 |
| security-engineer | 1.2.2 | Read Grep Glob Bash WebSearch WebFetch | 17 | 3 | 12,697 |
| software-architect | 1.4.2 | Read Grep Glob WebSearch WebFetch Write | 18 | 3 | 13,025 |
| software-engineer | 1.4.2 | Read Grep Glob Edit Write Bash WebSearch WebFetch | 13 | 2 | 6,697 |
| ui-ux-designer | 1.3.6 | Read Grep Glob Bash WebSearch WebFetch Write Edit | 21 | 2 | 17,284 |
| vc-seed | 0.2.2 | Read Grep WebSearch WebFetch | 16 | 3 | 8,470 |

Read-only (read + web): product-manager, product-marketer, product-researcher, sales, vc-seed (5). Write or run: the other 7. All 12 agent files set `model: opus`.

---

## 6. Real artifacts the page uses, and where each comes from

| Artifact | Source | Status |
|---|---|---|
| First review (Fig. 1), NO-GO + F1 | `site/proof/security-engineer.md` lines 13, 29. Off the hero now (its prompt asked for GO/NO-GO); linked from §4.3 | Published (live) |
| 66,578 / 2,780 tokens | The main session's log, `toolUseResult` (`totalTokens` 66,578; output 2,940 − thinking 160). I checked it in the log today and published the derivation in `site/proof/README.md` (Method). It was in `README.md:36` before with no source | **Added in this change** |
| Fair-test table | `site/proof/rerun/README.md` | Published (live) |
| security-engineer fair-test run (hero tab 1) | `site/proof/rerun/truecast-2.md` lines 7, 9 | Published (live) |
| product-manager "Don't build `--pin` next" | **New:** `site/proof/product-manager/README.md`, which I ran and wrote today. Method, prompt, cost ($0.64), time (70 s), model (`claude-opus-5-5`, plus $0.0016 of `claude-haiku-5-5`), the 14 tool calls, a fact-check of its claims, and the full report verbatim | **In this working tree; ships with the merge** |
| `claude plugin install` output | My run today, clean `HOME`, Claude Code 2.1.302 (identical to the live page's capture) | Verified |
| Installer plan / ready line | `truecast-plugin.sh install product-manager` (plan, then `--yes`) in a sandbox `HOME`, today; security-engineer block from the live page | Verified |
| Refusal output | Live page capture 2026-10-16 | Kept; script path unchanged |
| Hand-offs for §4.9 | `internal/` is git-ignored, so the orchestrator must copy the three hand-offs to `site/proof/homepage/` | **Pending, and that's the gate for §4.9** |

Nothing on the page is a mock-up. If the designer wants a terminal frame around an output, the frame can't add a version string, model name, plan name or UI line the log doesn't have. (The staged page did exactly that: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", plus a GO verdict the real review never gave.)

---

## 7. Headline search: 36 candidates, scored

Scored 1–3 on each criterion: **C**larity in 5 seconds (what + for whom), **D**iscriminates against the reader's alternative, **T**rue for every reader and survives the skeptic's sentence, **O**wnable/memorable, **S**hort. Max 15.

| # | Headline | C | D | T | O | S | Σ |
|---|---|---|---|---|---|---|---|
| 1 | **The expert teammates Claude Code doesn't ship with.** (incumbent) | 2 | 3 | 3 | 3 | 3 | **14** |
| 2 | Twelve specialists for Claude Code. Each one makes the call. | 3 | 2 | 3 | 2 | 3 | 13 |
| 3 | A security engineer, a PM and ten more, inside Claude Code. | 3 | 2 | 3 | 1 | 2 | 11 |
| 4 | Ask a specialist. Get a decision, not a summary. | 2 | 3 | 2 | 2 | 3 | 12 |
| 5 | Specialist subagents for Claude Code that end on a decision. | 3 | 2 | 2 | 1 | 2 | 10 |
| 6 | Put a specialist on the call you're about to make. | 1 | 2 | 3 | 3 | 3 | 12 |
| 7 | A second opinion that isn't Claude agreeing with you. | 2 | 3 | 2 | 3 | 2 | 12 |
| 8 | Stop asking Claude to "act like a security expert." | 2 | 2 | 1 | 2 | 3 | 10 |
| 9 | The team you don't have, for Claude Code. | 2 | 2 | 1 | 2 | 3 | 10 |
| 10 | Every call you'd make alone, with a specialist on it. | 1 | 2 | 2 | 2 | 2 | 9 |
| 11 | `@security-engineer`: NO-GO. | 1 | 3 | 2 | 3 | 3 | 12 |
| 12 | Twelve specialist subagents for Claude Code, already written. | 3 | 1 | 3 | 1 | 2 | 10 |
| 13 | Before you merge, build or launch: ask the specialist. | 2 | 2 | 3 | 1 | 2 | 10 |
| 14 | The rest of your team, inside Claude Code. | 2 | 1 | 1 | 2 | 3 | 9 |
| 15 | Ship it or don't. Ask the teammate who'd know. | 1 | 2 | 3 | 2 | 2 | 10 |
| 16 | Expert subagents that say no. | 2 | 3 | 2 | 2 | 3 | 12 |
| 17 | Claude Code, plus the specialists it doesn't come with. | 2 | 2 | 3 | 2 | 2 | 11 |
| 18 | Your security engineer, PM and seed investor, on @. | 2 | 2 | 3 | 2 | 2 | 11 |
| 19 | Specialists for Claude Code. Written deep, kept current, briefed on your repo. | 3 | 2 | 3 | 1 | 1 | 10 |
| 20 | Get the call, not the "You're absolutely right." | 1 | 3 | 2 | 3 | 2 | 11 |
| 21 | Decisions from specialists, inside Claude Code. | 2 | 2 | 3 | 1 | 3 | 11 |
| 22 | Twelve experts. One `@` away. | 2 | 1 | 3 | 2 | 3 | 11 |
| 23 | The specialists solo builders don't have. | 1 | 2 | 1 | 2 | 3 | 9 |
| 24 | Real playbooks, not "act like an expert." | 1 | 2 | 1 | 2 | 3 | 9 |
| 25 | GO or NO-GO from a teammate who read the code. | 2 | 3 | 2 | 2 | 2 | 11 |
| 26 | Hire the specialist. It's a subagent. | 2 | 1 | 2 | 2 | 3 | 10 |
| 27 | Install a security engineer. Or a PM. Or a VC. | 2 | 2 | 3 | 2 | 2 | 11 |
| 28 | Twelve specialists, briefed on your repo, in Claude Code. | 3 | 2 | 3 | 1 | 2 | 11 |
| 29 | Make the call with someone who knows. | 1 | 1 | 3 | 1 | 3 | 9 |
| 30 | The expert Claude Code teammates, with receipts. | 2 | 2 | 3 | 2 | 3 | 12 |
| 31 | Subagents with a job, a playbook, and your brief. | 2 | 2 | 3 | 1 | 2 | 10 |
| 32 | A specialist's call on your work, in your session. | 2 | 2 | 3 | 1 | 2 | 10 |
| 33 | Experts for Claude Code that commit to an answer. | 2 | 3 | 2 | 2 | 2 | 11 |
| 34 | One `@` for a verdict. Twelve roles to pick from. | 2 | 2 | 3 | 1 | 2 | 10 |
| 35 | Twelve teammates for Claude Code. The call is yours; the homework is theirs. | 2 | 2 | 3 | 2 | 1 | 10 |
| 36 | Claude Code's missing specialists. | 2 | 2 | 2 | 2 | 3 | 11 |

**Winner: #1, kept.** It names the category and the alternative in one line (teammates for Claude Code; Claude Code's own set). It's true for every reader. It's ownable and founder-tuned, and it's already the README line, the GitHub description and the share-card headline, so changing it moves four surfaces for no gain. Its weak point is clarity: "expert teammates" doesn't say what you get. The sub covers that by naming the range ("security engineer to seed investor") and the payoff ("comes back with a decision"). With the sub, the hero scores 3 on clarity.

**Runner-up: #2** ("Twelve specialists for Claude Code. Each one makes the call."). It's clearer alone, but less ownable, and "makes the call" is only measured for one of the twelve, so it overreaches as an H1. It lives on in the sub.

Rejected on truth: #7, #16, #20 and #33 imply the teammate disagrees more than the alternatives do. The fair test doesn't show that (the 76-word agent also said "don't ship"). #9, #14 and #23 make a premise that isn't true for readers on teams.

H2s were searched the same way (8–12 each). The winners are the ones in §4.

---

## 8. Competitive facts behind the copy (research pass, 2026-10-17)

| Alternative | What it is (their words) | What the page says about it |
|---|---|---|
| Claude Code built-ins | Explore, Plan, general-purpose subagents; `/security-review` "analyze the changes on your current branch…"; `/review` → `/code-review` | FAQ 3. A good first pass; the teammate makes the call around it |
| `claude-plugins-official` | Anthropic's marketplace, auto-added; code-review, pr-review-toolkit (6 agents), claude-security (9 agents), security-guidance (hooks) | Not named on the page. Covered by FAQ 3's framing |
| VoltAgent awesome-claude-code-subagents | "161+ Claude Code subagents", 25.8k★ | Named only as the tested alternative, with its result quoted in full |
| wshobson/agents | "202 agents, 185 skills", 40.9k★ | Not named. One-file agents are covered by FAQ 1 |
| gstack | "all slash commands", 23 specialists incl. CEO; 136.7k★ | FAQ 2, in its own words |
| Anthropic knowledge-work-plugins | PM, marketing, sales and design plugins, skills not subagents | Not named. Covered by FAQ 2's "skills pack" |
| BMAD | role agents; per-project overrides that survive updates | Not named. **So the page never says "only truecast keeps your edits across updates".** It says what truecast does, nothing more |

**Claims the page must not make** because the research falsified them: "the only non-engineering roles for Claude Code", "the only one whose customizations survive updates", "hundreds, shallow" (punching down, and untrue as a quality claim). "No one else has a seed-investor role" was true as far as the search went, but the page doesn't claim it, because it's not worth the risk.

---

## 9. Every current-site claim that's false or unbacked

### 9a. Live page (`HEAD:site/index.html`, what truecast.dev serves). Mostly true; the problems are mostly strategy and length

| # | Claim on the page | Problem | Fix in this deck |
|---|---|---|---|
| L1 | Hero's second paragraph leads with "It caught as many holes, no more" | True, but first-screen copy that argues against switching. The win (6/6 GO/NO-GO) is buried in the same sentence | §4.2 leads with the payoff artifact; the contrast line puts the win first and the tie second, same size |
| L2 | "Nothing runs on our servers. We don't have any." | The site is hosted, and "servers" is loose. The code backs "no truecast server in the install or the run" | §4.7 block 4 |
| L3 | "truecast collects nothing." | Can't vouch for the host's request logs. Backed version: the installer and teammates send us nothing | §4.7 block 4 |
| L4 | "Each teammate runs on Opus" | The agent file *asks for* `model: opus`. What runs depends on the user's plan and Claude Code's fallback (8 of 18 test runs switched to 4.8) | FAQ 4: "asks for Opus" |
| L5 | "Installer 0.1.2 fixes all four" | Version claims must be open-ended | "0.1.2 or later" wherever a version is named; §4.3 points to the update |
| L6 | No outcome proof beyond one security review; "it says nothing yet about the other eleven" | True, but the page shows no range | §4.2 tab 2 (product-manager run, published) |
| L7 | Length: 3,208 visible words, five "Fig." captions, three method notes before the install | Not false, but it fails "short" and "each point made once" | ≤1,700 words; method detail moves to `/proof/` |
| L8 | No answer to gstack / built-in `/security-review` | The savviest reader's alternatives go unaddressed | FAQ 2, FAQ 3 |
| L9 | "Install from inside a session →" and step 1 both offered as primary | Two primaries | One primary (terminal); the in-session path is secondary and collapsed |

### 9b. Staged page in this working tree (the old page; would ship if committed as is). **Every row is a ship-blocker**

| # | Claim | Why it's false or unbacked |
|---|---|---|
| S1 | "Eleven teammates" (H2, meta description, comparison graphic) | There are 12 (`personas/`, marketplace, README) |
| S2 | Terminal: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max" with "Verdict: GO. Core trust surface is sound; both known escapes verified closed." | Invented UI and an invented verdict. The real review said **NO-GO** and found a P0 (`site/proof/security-engineer.md:13`) |
| S3 | "Pastes straight into Claude Code" over a three-line block | Claude Code takes one command per submit; three lines pasted at once don't run as three commands |
| S4 | "Read-only by default" | 7 of 12 can write files or run commands (§5) |
| S5 | "you read the exact prompt before you run it" / "`truecast prompt <name>` prints the exact prompt" | `prompt` is the npm CLI, not the plugin lane the page installs; the plan shows tools and paths, not the prompt |
| S6 | "Nothing phones home" | Teammates have WebFetch/WebSearch. Understates network access |
| S7 | "call it by its bare name: `@security-engineer`" | The documented typed form is `@agent-security-engineer`; a bare `@name` can resolve as a file (installer 0.1.2 changelog) |
| S8 | "Your instance/ — the job you set, the notes it kept" / `instance/notes`, `persona.md` | Nothing writes `work.md` yet (README); the files are `agent.md` and `work.md` |
| S9 | Anthropic's 90.2% multi-agent result framed as "same lesson" | A different system and eval; borrowed proof that implies a truecast result nobody measured |
| S10 | "others: hundreds, shallow · truecast: eleven, deep" | Punching down, and contradicted by our own test (the 76-word agent tied) |
| S11 | Updates: "`/plugin marketplace update truecast`, then `/truecast:update`" only | Omits updating the installer itself, which is how users on 0.1.0/0.1.1 get the security fixes |
| S12 | `site/404.html` deleted | The site loses its 404 page |
| S13 | Meta/OG: "Eleven open-source expert teammates…", no og:image | Wrong count on every share |

### 9c. Linked surfaces that drift (fix in the same change, or the page links to a contradiction)

| Where | Drift | Owner |
|---|---|---|
| `README.md` "The first time you run a teammate with no job set, it asks what the project needs" | Unverified, and a subagent can't stop mid-task to ask. The product-manager run with no brief just worked from the prompt. Say "it works from what you ask", as the page does | engineer / me (copy) |
| `docs/install.md:171` "pins <name> → source@version+commit" and `docs/managing-personas.md:148` "or a pinned version" | Nothing writes a pinned spec (`src/attach/index.ts:40`). Found by the product-manager run, confirmed | engineer |
| `README.md:54`, `docs/install.md:24`, live page: "choose **Install for you**" | Claude Code's panel label is "Install for you (user scope)" (code.claude.com/docs/en/discover-plugins). Match the platform | me (copy) |
| `README.md`, `site/proof/*`: links to commit `834b03d` | The commit isn't on main (main squash-merged it as `d70aa8d`, PR #50). GitHub still serves it through the PR ref, so the links work, but `git show 834b03d` fails in a clone of main. Add "(PR #50)" beside it | me (copy) / engineer |
| `README.md:36` "worked through 66,578 tokens in its own context" | The number is real (log checked), but it's the context size at the final turn, not cumulative work. Say "its own context grew to 66,578 tokens", and link the derivation now in `site/proof/README.md` | me (copy) |
| `docs/install.md` Programmatic: `import { install, autoApprove } from "truecast"` | The package is `@wastedcode/truecast` | engineer |
| npm 0.2.0 vs `package.json` 0.3.0 | Not a page claim (the page doesn't sell the CLI), but the README's CLI section installs 0.2.0. Publishing 0.3.0 is the founder's call (product-manager recommends yes) | founder |

---

## 10. Calls I made with the founder away (all reversible)

1. **Kept the H1 "The expert teammates Claude Code doesn't ship with."** Alternative: #2 "Twelve specialists for Claude Code. Each one makes the call." I kept #1 because it's tuned, true and ownable, and it already sits on four surfaces; §7 has the scores.
2. **Ran and published a new product-manager run** (`site/proof/product-manager/README.md`, $0.64). The hero shows only its verdict and one reason, cut at sentence boundaries. The receipt, unedited, includes our npm downloads (18 in 30 days) and its advice to publish 0.3.0. Two reviewers disagreed here: one said trimming hides the awkward part, the other said quoting it is a self-own in the hero. I went with sentence-boundary trims and the full report linked. Alternatives: (a) re-run product-manager on a visitor-style prompt, which is stronger long-term at about $0.65 a run; (b) show only the security tab, which loses the range. To withdraw it, delete the file and tab 2.
3. **Named gstack in the FAQ**, in its own words, with no quality claim. Alternative: say "skill packs" without a name. I named it because it's the alternative this reader most likely has, and dodging it reads as evasive.
4. **Made §4.9 "Made by three of them" conditional** on the hand-offs being published. Alternative: leave it out. It's the most shareable true fact if it holds.
5. **Moved the method detail off the page into `/proof/`.** The page keeps the table, one method line and the links. Alternative: keep the live page's full captions. Moved because the receipts are one click away and the page has to be short.
6. **Sold only the plugin lane.** The CLI gets a footer link labelled 0.2.0. Alternative: present both lanes. Plugin-only because npm doesn't serve what the README describes.

---

## 11. Hand-off notes for brand-designer and ui-ux-designer

- The H1, the cast H2 and the closing H2 are tuned lines. Don't re-word them in layout.
- Every command is its own copy button, one per submit. Every capture is labelled "verbatim" with its date, and nothing is added inside a frame.
- First screen at 1280×800 **and** 390×844: H1, sub, step-1 copy block, and the contrast line. The artifact card may fall below the fold on mobile; the contrast line may not.
- Tabs in the hero card must work without JS (both cards visible, stacked).
- Numbers to pull from data, never retype: §5 table (`cores.json`), the fair-test table (`rerun/README.md`). The drift gates are `scripts/brand/build.py --check` and `page.py --check`.
- Don't restore anything from the staged old page (§9b).

---

**Optional, for engineering (not copy):** serve a plain-markdown version of the page for agents (`/index.md` or `llms.txt`). Supabase, Resend and Claude Code's own page now do this. It's not a launch blocker.

---

**Frontier check**
- **Benchmark:** Dunford (alternatives first, category), Pierri/Fletch (H1 = category + differentiator), Kramer/MKT1 (who-what-why hero), Dry (visualise / falsify / nobody else can say it), Wiebe (VOC, unique value in the H1), Stratton (value → benefit → feature), Raskin (stakes). Pages: Bun (install CTA + script link + methodology under every chart), Biome (states its own gap), Claude Code (real task in the hero), Railway (names what it replaces), Resend and Supabase (live output). 19 homepages fetched 2026-10-17.
- **Where this beats each:** Bun's charts never show a loss; this page shows its tie at full size next to its one win. Claude Code's hero shows one task; this hero shows two real verdicts from two roles, both published with receipts. Railway names what it replaces; this page answers the three real alternatives (your own file, gstack, `/security-review`) in their own words. Pierri's H1 test passes with the sub. Dry's falsify test passes on every number (each links to a log).
- **Searched:** 36 H1s scored on 5 criteria (§7), 8–12 per H2, 6 hero-artifact options (one review / two-role tabs / table-first / size-graphic-first / install-first / video). The two-role tabs won on payoff + range + truth.
- **Covered:** founder bar and absence (§10); public channels checked live (§0); one command per copy; the hour-1 path including restart/reload; undo; update for users on the vulnerable installer; true cost; Windows; mention syntax from the docs; one term per concept; no internal stack leaked beyond what the user installs.
- **Critique caught:** four fresh-context adversarial reviews (30 → 12 → 8 → 3 → 3 → 3 → 1 findings, all fixed). The biggest: tab 1 used a prompt that asked for GO/NO-GO, so it was swapped for a fair-test run (now run 2, one that opened its playbook, labelled as one of our better runs). `/proof/` links would 404 on Pages, so they became GitHub URLs. The 66,578-token figure had no source, so I found it in the log and published the derivation. The refusal capture showed a mode the page doesn't teach, so I recaptured it in user scope. And "makes the call" was widened to all twelve, so it's now scoped to six.
- **Verified:** every number against `personas/*/core`, `site/proof/*`, npm, the marketplace install (run), the installer (run), the docs (fetched); a new product-manager run produced and fact-checked.
