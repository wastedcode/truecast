# truecast.dev homepage copy deck

Product-marketer → brand-designer → ui-ux-designer. Written 2026-10-17 against this worktree (`HEAD` = `main` = `90b49d8`,
plus the staged `site/` changes). Every claim below has a source line in the **claim ledger** (§7). If the designer needs a
line that isn't in this deck, it comes back to the marketer; nothing gets written on the page that isn't here.

---

## 0. Read this first: what ships, and what's wrong with it today

- **The staged `site/` page is an older draft, and it would replace the live page.** The working tree stages a page that
  says "Eleven teammates" and "Verdict: GO", and shows a Claude Code window ("v2.1.177 · Opus 4.8 · Claude Max") that
  doesn't come from any run. truecast.dev serves `main`'s page today (fetched 2026-10-17; it matches
  `git show HEAD:site/index.html` apart from Cloudflare's email rewrite). If this branch merges as staged, the public
  page gets *worse*. §8 lists every false or unbacked claim on it. The designer builds the new page from this deck and
  replaces it.
- **`site/404.html` is staged for deletion.** Restore it, or make sure the new build ships one.
- **What visitors actually get, checked today:**
  - The GitHub default branch is `main` (`90b49d8`). The marketplace serves the installer plugin **0.1.2** and the
    **twelve** personas. I installed both into a clean home on Claude Code 2.1.302 and quote the output below.
  - npm serves **`@wastedcode/truecast` 0.2.0**, with 11 personas and no brand-designer. The repo's `package.json`
    says 0.3.0, which isn't published. Tags go up to `v0.2.0`.
  - **So the page sells the plugin path only.** The CLI gets one line in the FAQ, with the npm version stated.

---

## 1. Audience and the 5-second belief

**Who it's for.** A developer who uses Claude Code every day, alone or on a small team. They know subagents exist.
They have probably asked Claude to "act like a security expert", and may have copied an agent file from a big
collection. Nobody on their team is a full-time security engineer, QA lead or PM, so a lot of calls get made alone:
merge this, ship that, build which feature next.

**Awareness: solution-aware, in a crowded market** (Schwartz stage 4–5). They've seen collections with hundreds of agents
(wshobson/agents: 202 agents, 40.9k★; VoltAgent: "100+", 25.8k★, both fetched 2026-10-17). A bigger number won't move
them. What can: a mechanism they haven't seen, plus proof they can open.

**The 5-second belief we want:**
> "Specialist subagents for Claude Code. One command installs one, I call it by name, and it gives me a straight call on
> the thing I'm about to do. They even published the test where a 76-word prompt did just as well."

**Painkiller or vitamin? Said plainly: for most visitors, it's a vitamin.** The fair test shows a short prompt catches as
much on one security review. The pain is sharp only at a few moments: a solo dev about to merge something risky, a
founder about to pick what to build, a launch with nobody to review the copy. The page has to aim at those moments ("the call you'd
rather not make alone"), not at "better AI". **Growth flag for the founder:** the one built-in loop is the team
ride-along (`.claude/settings.json` installs a teammate for everyone who opens the repo), and it costs bare names. There
is no other loop. The one channel is the Claude Code community (HN "Show", r/ClaudeAI, the awesome-lists). The page
can't fix that. It can make a visitor's first install succeed, and give them something worth sharing: the honest test.

---

## 2. Positioning (Dunford 5+1), single source for every line

| | |
|---|---|
| **Competitive alternative** | (1) Ask the main session, or the built-in `/security-review` and `/code-review`. (2) Have Claude write you an agent file (`/agents` now just tells you to). (3) Install one from a big collection. |
| **Unique attributes (all shipped)** | Twelve roles, each with a written playbook of 9–21 skills it opens mid-task (5,116–17,284 words). A brief per repo that it reads first and no update touches. An installer that shows the version, the tools and every path, then waits. It refuses to overwrite an agent file it didn't write, even with `--force`. Bare `@agent-<name>` instead of `plugin:name`. Versioned updates you adopt deliberately. |
| **Value** | A specialist's judgment on the decision in front of you, in one line, without writing or maintaining twelve prompts. What comes back is the deliverable that role owes you: GO or NO-GO, which feature next with a kill rule, an ADR. |
| **Who cares most** | Solo devs and small teams who make specialist calls with no specialist in the room. |
| **Category** | "Expert teammates for Claude Code": native subagents, not a new tool. |
| **Relevant trend (why now)** | Claude Code made subagents and plugin marketplaces native. The bottleneck has moved from "can I run a subagent" to "is the one I run any good, and can I trust what it installs". |

**Proof, ranked by how well it discriminates:**
1. **The fair test** (`site/proof/rerun/`): byte-identical prompt, 3 agents, 6 runs each. Closed on an explicit GO or
   NO-GO: truecast **6 of 6**, the others **0 of 12**. Holes caught: **9 / 6 / 9 of 18**. This is the only measured
   difference, and it comes from the agent file. It's strong because we publish the half that doesn't flatter us.
2. **A second role, real output** (`site/proof/product-manager-call/`, **produced for this deck**, 2026-10-17):
   `product-manager` 2.4.2 on a real roadmap question in this repo. It makes a call, sets a kill rule and lists three
   decisions for the founder. $0.45, 60 s, 2 skills opened, `claude-opus-5-5` throughout. It's one run, so it shows what
   you get back. It is not a quality claim.
3. **The installer's own output**, captured on 2.1.302 in a clean home: the plan, the ready line, and the refusal to
   overwrite a hand-written file even with `--force --yes`.
4. **The origin story**: our own security-engineer found a way for a hostile repo to write into `~/.bashrc` through our
   installer. We fixed it in installer 0.1.1. *(Not discriminating: the 76-word agent found it 6 of 6.)* Use it as the
   story, not as proof of superiority.
5. **Playbook sizes.** These are a picture of what's inside, **not proof**. The page says so.

**The skeptic's sentence, which the hero has to survive:** *"So a 76-word prompt caught just as much."* It does,
and the page says it first. The case rests on what's left once you grant that: twelve roles already written, a call
every time on the one role we tested, a brief that survives updates, and an install you can read before it writes.
**Never** sell catch rate, depth-as-quality or "smarter".

---

## 3. Voice

The founder's register on `main` is first-person plural, short, dry, and ahead of the reader's objection ("It found a real
hole in our installer. So did a 76-word agent."). Rules for every line: plain words, one idea per sentence, numbers
with their subject, no superlatives, no "not just X, it's Y", no triads, no hedging stacks. Say "teammate" on the page.
"Persona" appears only where the file format is named. Never call the playbook's skills "Skills" without saying they
aren't Claude Code Skills.

---

## 4. Headline search (31 candidates, scored)

Scored against these tests: names the category or job (Fletch H1 test) · says how it differs · a competitor couldn't paste it · true for every
role · survives the skeptic's sentence · reads in 5 s.

| # | Candidate | Verdict |
|---|---|---|
| 1 | The expert teammates Claude Code doesn't ship with. | **Winner (kept).** Category plus contrast to the built-ins (Explore, Plan, general-purpose). Already the brand line in the README, docs, OG and the GitHub header. True for all twelve. |
| 2 | Twelve specialists for Claude Code. Each one makes the call. | False for 6 of 12 (architect, engineer, UX, brand, researcher and infra hand back artifacts, not verdicts). |
| 3 | Specialist subagents that end on a decision, not a summary. | Same falsity, plus the "not X, Y" tell. |
| 4 | Put a specialist on the call you'd rather not make alone. | Strong job framing, but no category. **Used as the closing CTA.** |
| 5 | Claude Code subagents you don't have to write. | True but weak. The collections can say it too. |
| 6 | Don't write the agent file. Install the teammate. | Undercut by our own test, which says the written one did fine. |
| 7 | When you need a specialist's answer, not Claude's best guess. | Implies quality we didn't measure. Cut. |
| 8 | GO or NO-GO, from a security engineer in your terminal. | Proven, but it's one role of twelve. **Used as the hero artifact's label.** |
| 9 | A security engineer, a PM and ten more, inside Claude Code. | Clear, but reads as a list. It became the subhead's job. |
| 10–31 | "Subagents with a job description", "The second opinion, already written", "A bench of specialists for Claude Code", "Ask a specialist. Get a call back." and 18 more | Each failed at least two tests: cute over clear, competitor-pastable, a triad, or an implied quality claim. |

**Equal-or-better rule:** #1 is tuned, consistent across five surfaces and true. Nothing beat it on all six tests, so
it stays. The missing differentiation goes in the subhead and the first-screen contrast, not the H1. *Alternative
recorded for the founder:* #4 as H1 with #1 as the eyebrow. It's more emotional, but the category drops out of the
5-second read.

---

## 5. The page, section by section

Notation: **H** headline · **B** body · **CTA** · **Artifact** = the real thing that carries the section (with its
source). Code is shown exactly as it's typed. Every command is its own copy button, one per submit.

### Meta (derived copies; change these with the story)
- `<title>`: **truecast: expert teammates for Claude Code**
- description / og:description / twitter:description: **Twelve specialist subagents for Claude Code: security, QA,
  architecture, product, design, sales. Install one with a single command, call it by name, and keep your own brief for it
  in your repo. Open source, MIT.**
- og:title: **The expert teammates Claude Code doesn't ship with**
- Brand-designer: the OG card carries the H1 and the hero contrast line. No invented UI.

### 5.1 Hero
**Purpose:** say what it is, why it's different from what they do today, and get the first command copied.

- **Eyebrow:** Open source · for Claude Code
- **H1:** The expert teammates Claude Code doesn't ship with.
- **Subhead (B):** Twelve specialists, from security and QA to product, design and sales. Install one with a single
  command, call it by name in any project, and get a straight answer on the decision in front of you, with the file and
  line it's based on.
- **CTA (primary, copy button):**
  ```
  claude plugin install truecast --marketplace wastedcode/truecast
  ```
  Microcopy under it: **In your terminal, once (Claude Code 2.1.292 or later). Then in Claude Code:**
  `/truecast:install security-engineer`
- **CTA (secondary link):** Already in a session? Set it up there → (jumps to §5.6, "Already in Claude Code")
- **Proof line (first screen, beside or under the CTA):** **We tested our security-engineer against a 76-word agent you
  could write yourself, with the same prompt, six runs each. It caught as many holes, no more. It was the only one to end
  every run on a GO or NO-GO.** Link: **All 18 runs, published ↓**
- **Artifact: the real verdict**, rendered as a report card, **not as a fake Claude Code window**:
  - label: `@agent-security-engineer` · security-engineer 1.2.2 · claude-opus-5-5 · 2026-10-16
  - asked: *Can anything here get a user owned?* (from the prompt in `site/proof/README.md`)
  - lines, verbatim from `site/proof/security-engineer.md`:
    - **Verdict: NO-GO for `--project` until F1 is fixed.**
    - Short answer: yes, someone can get owned. A repo the user opens can get its own text written into the user's
      shell startup files, which then runs every time they open a shell.
    - **F1 — P0 for the `--project` lane.** … Confirmed.
  - caption: **A real review of our own installer. We fixed it in installer 0.1.1. Full report →**
    (`site/proof/security-engineer.md`)
  - **Don't** draw a tool-call trace: the "10 tool calls" list on `main` has no published log.
- **The discriminating contrast on the first screen:** the proof line above *is* the contrast (theirs vs ours, side by
  side, the unflattering half included). On mobile it sits directly under the CTA, above the artifact.

### 5.2 What you get back
**Purpose:** show the payoff across roles, so it isn't just one security review. This answers "what does it actually hand me?"

- **H:** Ask about the call you're about to make. Get the call back.
- **B:** Each teammate is written to hand back what its role owes you. Two real runs, unedited:
- **Artifact A: security-engineer** (as in the hero, collapsed to its verdict line plus a link to Fig. 2).
- **Artifact B: product-manager**, from `site/proof/product-manager-call/report.md`, verbatim lines:
  - asked: *docs/README.md lists three planned features: version pinning (--pin), sync, and the self-improving "gate".
    We can build one next. Which one, and why? Give your call.*
  - **My call: build the gate next.** Make it a thin first version that only writes to the project's own notes
    (`instance/work.md`), and check that it actually helps before building the rest. Pinning should wait until someone
    asks for it. Sync should become a small `doctor` fix, not a new command.
  - **Kill rule:** if `work.md` doesn't visibly change results on most tasks, stop and rethink before building anything.
  - meta: product-manager 2.4.2 · claude-opus-5-5 · 60 s · $0.45 · read-only, cited files by line
  - caption: **One run on our own roadmap. It also told us our prompt was wrong: there are four planned items, not three.
    One claim in it overreaches; we marked it. Full report and what we checked →**
- **B (closing line):** It reads your repo, cites the line, and tells you what it would do, including what not to build.

### 5.3 The fair test
**Purpose:** pre-empt "why not write my own / grab one from a collection?" using our own receipts. Keep `main`'s section;
it's the most-tuned asset on the site and every number in it reconciles with `site/proof/rerun/README.md`.

- **H (kept from main):** It found a real hole in our installer. So did a 76-word agent.
- **B:** That review showed a hostile repo could get its text written into your `~/.bashrc`. We fixed it, then gave the
  same prompt, byte for byte, to three security-engineer agents, six runs each. The 76-word one found that hole in all
  six. Ours found no more holes overall. The one thing only ours did was end every run on an explicit GO or NO-GO, with
  findings ranked by when to fix them.
- **Artifact: Fig. 2, the table** (from `site/proof/rerun/README.md`; one row per hole, one square per run):

  | | Hand-written, 76 words | Free collection, 1,007 words | truecast, 21 files · 12,697 words |
  |---|---|---|---|
  | Hostile repo writes into `~/.bashrc` (temp files) | 6 of 6 | 5 of 6 | 5 of 6 |
  | Agent files carry hooks the plan never showed | 1 of 6 | 1 of 6 | 2 of 6 |
  | Commands Claude could run unasked, with all of Bash | 2 of 6 | 0 of 6 | 2 of 6 |
  | **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
  | **Closed on an explicit GO or NO-GO** | 0 of 6 | 0 of 6 | **6 of 6** |
  | Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

- **B (after the table):** So at catching these, a short prompt held its own, at $0.85 a run against our $1.04. The GO or
  NO-GO comes from the agent file, and you could ask your own agent for one. What you'd still be writing yourself is the
  rest: eleven more roles, a brief for each, and updates that never touch it.
- **Method footnote (must ship, it's what makes the test fair):** Claude Code 2.1.301, `claude -p --agent`, so each
  agent got the prompt itself. Model `claude-opus-5-5`, though in 8 of the 18 runs Claude Code switched to
  `claude-opus-4-8` partway (hand-written 4, free collection 2, ours 2). A safety classifier interrupted 10 runs; every
  one still returned a report. The free-collection agent is VoltAgent's `security-engineer.md`, with only its tools and
  model lines changed.
- **CTA links:** All 18 reports and how we scored them → (`site/proof/rerun/README.md`) · The first review, and why it
  wasn't fair → (`site/proof/README.md`)

### 5.4 What a teammate is
**Purpose:** the mechanism, in three parts. Each part is the answer to one objection.

- **H:** A teammate is a playbook, your brief, and its own context window.
- **The playbook.** *B:* security-engineer carries 17 skills, 3 reference notes and its agent file: 12,697 words of plain
  Markdown it can open mid-task. These load only into that teammate. They aren't Claude Code Skills, and they don't
  crowd your session. *Artifact:* the file list of `personas/security-engineer/core/` with word counts (generated by
  `scripts/brand/page.py`, never typed by hand). Link: **Open the folder on GitHub ↗**
- **Your brief.** *B:* One file in your repo, `.truecast/agents/<name>/instance/mandate.md`: what the project is, what
  matters, where the bar is. The teammate reads it first, and updates never touch it. No brief? It works from what you
  ask. *Artifact:* Fig. 4 from `main` (where an update writes, and where it stops), with the version labels open-ended
  (e.g. "1.2.2 → next").
- **Its own context window.** *B:* Each teammate is a native Claude Code subagent. It reads and digs in its own context
  and hands your session the report, so your main thread stays on your work. *Artifact:* none with a number. The
  66,578 / 2,780-token bars on `main` have no published log, so **cut them**. If the founder wants the figure back,
  capture a subagent run's log into `site/proof/` first.

### 5.5 The twelve
**Purpose:** let the reader find the role for the call they're stuck on, and install it from the row.

- **H:** Twelve teammates. Pick the call you'd rather not make alone.
- **B:** First time? Run the terminal line above, once.
- **Artifact: the roster**, grouped Build · Ship · Decide · Design · Market · Raise. Each row has: the name, the
  question, "Its agent file asks for", "Can touch", the playbook size, and a per-row copy button for
  `/truecast:install <name>`. Use `main`'s lines (I checked each "asks for" against its `agent.md`). Counts come from
  `page.py`:

  | Role | Question | Its agent file asks for | Can touch |
  |---|---|---|---|
  | software-architect | How should this be built so it lasts? | a design doc with a real diagram, and an ADR for each hard-to-change call | reads, writes files, web |
  | software-engineer | Can I trust this code? | code proven by trying to break it, shipped in small safe steps | reads, edits files, runs commands, web |
  | qa | What breaks before a user finds it? | a ship or don't-ship verdict, with the blocker list | reads, runs commands, web |
  | security-engineer | Can this get someone owned? | findings at file:line, each graded, and a GO or NO-GO | reads, runs commands, web |
  | infrastructure | Will this hold up in production? | commands that run first time, with how to undo them | reads, edits files, runs commands, web |
  | product-manager | Are we building the right thing? | a validated spec, its success bar, and an acceptance verdict | reads, web |
  | product-researcher | What are users actually telling us? | findings ranked by confidence, each with its receipts | reads, web |
  | ui-ux-designer | Can people actually use this? | user flows, and a design it has rendered and checked at every size | reads, edits files, runs commands, web |
  | brand-designer | Would anyone remember us? | one brand idea, a mark tested at 16px, and the identity as tokens | reads, edits files, runs commands, web |
  | product-marketer | Why would anyone care? | the positioning, the copy, and a will-it-land verdict | reads, web |
  | sales | Who would actually pay for this? | a painkiller-or-vitamin verdict and a buyer profile, with the evidence | reads, web |
  | vc-seed | Would an investor write the check? | an invest-or-pass call and the one risk it would underwrite | reads, web |

- **Footnote (must ship):** "Can touch" sums up the tools each one declares. The install plan lists them exactly
  before you say yes. "Its agent file asks for" is what its instructions tell it to hand back. We've tested security-engineer
  (the fair test) and run product-manager once; we haven't tested the others. Playbook size shows what's inside. It
  isn't a score.

### 5.6 Install
**Purpose:** the CTA works exactly as written, with what the user sees at each step. Everything below was run on Claude
Code 2.1.302 in a clean home on 2026-10-17 (home shown as `~`, the machine-readable last line left off).

- **H (kept from main):** Two commands to set up. Then call it by name.
- **Step 1 · In your terminal**
  ```
  claude plugin install truecast --marketplace wastedcode/truecast
  ```
  *B:* Needs Claude Code 2.1.292 or later (check with `claude --version`). That's the installer, once per machine.
  *You'll see, at the end (verbatim):*
  ```
  ✔ Successfully added marketplace: truecast (declared in user settings)
  Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
  ```
- **Step 2 · In Claude Code, in any project**
  ```
  /truecast:install security-engineer
  ```
  *B:* Was Claude Code already open during step 1? Run `/reload-plugins` first. Claude shows you the plan, then asks.
  *The plan (verbatim):*
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
  *Then, when you say yes (verbatim):*
  ```
  ✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.
  ```
  *B:* The `note:` line appears only if you've never had a `~/.claude/agents/` folder. If you see it, restart Claude Code
  once. Want a different teammate? Swap the name, or copy it from the twelve above.
  *Caption:* Captured 2026-10-17. Versions change; the plan always shows the current one.
- **Step 3 · Call it by name**
  ```
  @agent-security-engineer review the changes on this branch before I merge
  ```
  *B:* An example: any teammate, any request. Typed by hand it's `@agent-` plus its name, or type `@` and pick it from
  the list.
- **Step 4 · Give it your brief** (optional)
  ```
  f=.truecast/agents/security-engineer/instance/mandate.md
  [ -e "$f" ] && echo "$f exists; left as is" || curl -fsSL --create-dirs -o "$f" \
    https://raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md
  ```
  *B:* In your repo, in a terminal (macOS, Linux or WSL). It saves the template and leaves an existing brief alone. Fill
  it in; the teammate reads it first. For another teammate, swap the name in both places. *(Checked: all 12 templates
  exist on `main`, and the URL returns 200.)*
- **Sub-block · Already in Claude Code?** On 2.1.275 or later, this replaces step 1:
  `/plugin install truecast --marketplace wastedcode/truecast`. It asks before adding the marketplace, then opens the
  plugin's details: choose **Install for you**, then run step 2 (run `/reload-plugins` if `/truecast:install` isn't there
  yet). Before 2.1.275, run these one at a time: `/plugin marketplace add wastedcode/truecast`, then
  `/plugin install truecast@truecast`. *(Version floors checked against Claude Code's CHANGELOG: `--marketplace` came to
  `claude plugin install` in 2.1.292 and to `/plugin install` in 2.1.275. The panel label "Install for you" comes from
  the docs; I didn't capture it, because this run had no interactive session.)*
- **Sub-block · On Windows?** Run Claude Code inside WSL. Native Windows isn't tested yet.
- **Sub-block · Later** (kept from main):
  - *Take the improvements.* In your terminal: `claude plugin marketplace update truecast`, then
    `claude plugin update truecast@truecast`, then restart Claude Code. Then in Claude Code: `/truecast:update <name>`. It
    shows the new version's plan first, and your brief is never touched.
  - *Take it back out.* `/truecast:remove <name>` lists what it will delete and waits for a yes. `/truecast:list` shows
    what you have. To remove the installer: `claude plugin uninstall truecast@truecast`. To forget the catalog:
    `claude plugin marketplace remove truecast`.

### 5.7 Trust
**Purpose:** answer "why let some Markdown into my home directory?" with captured behaviour, not adjectives.

- **H (kept from main):** You approve every file the installer writes.
- **You see the plan.** The version, the tools, every path it will write, and then it waits. If it would replace a file
  it wrote before, it shows you the diff. *Artifact:* "nothing has been written yet." from step 2's plan.
- **Every tool is on the label.** Five of the twelve can only read, search and fetch web pages. Seven can also run
  commands or write files. The roster and the install plan say which.
- **It won't overwrite an agent file you wrote.** We put a hand-written `qa.md` in `~/.claude/agents/` and asked it to
  install over it, with `--force --yes`. It refused, and the file was left byte for byte:
  ```
  ~/.claude/agents/qa.md exists and truecast did not write it.
  error: refusing to overwrite a file truecast did not generate: ~/.claude/agents/qa.md
  ```
  *(Captured 2026-10-17, exit 5, file unchanged.)*
- **Nothing runs on our servers. We don't have any.** The installer copies from the clone Claude Code already made from
  GitHub. truecast collects nothing. Teammates with web tools can fetch pages, like any Claude Code agent with those
  tools.
- **Using an installer from before 0.1.1?** Our own review found the `~/.bashrc` hole in it. Update with the two terminal
  commands under *Later*, and check that `claude plugin list` shows truecast 0.1.2 or later.
- **Who's behind it:** Open source, MIT. Built by Inder Singh (wastedcode). Found a hole? `SECURITY.md`: we aim to
  acknowledge within 72 hours.

### 5.8 Questions
- **I already wrote an agent file. Why switch?** If it does the job, keep it: in our fair test a 76-word agent caught
  as much as ours. truecast won't install over it. What it adds is the rest: twelve roles already written, a brief per
  repo that updates never touch, and a plan before anything is written. To run ours beside yours, rename yours first.
- **What about the big free collections?** We tested one: VoltAgent's 1,007-word `security-engineer`. It raised 6 of a
  possible 18, against 9 for ours and 9 for a 76-word agent, and it was the cheapest at $0.68 a run. One test, not a
  benchmark. We haven't tested the others. Installed as plugins, their agents answer to a scoped name
  (`@agent-plugin:name`); ours answer to `@agent-<name>`.
- **Claude Code has `/security-review` built in. Why this?** Use it. It reviews your branch's pending changes. We
  haven't compared the two. The other eleven roles here (product, design, sales, investing, research, infra) have no
  built-in counterpart.
- **What does it cost?** Nothing to install. Each teammate asks for Opus (`model: opus`) and runs on your own Claude
  Code usage, subscription or API key. In the fair test a review averaged $1.04 at API prices; the product-manager run
  above cost $0.45.
- **Does it learn my project?** Not on its own, yet. It reads your brief every time, so what it knows about your project
  is what you've written there. Edit the brief and the next run picks it up.
- **Can my whole team get it?** Yes. Merge these two keys into the repo's `.claude/settings.json`, and Claude Code offers
  the teammate to anyone who trusts the folder: *(the JSON block from `main`, unchanged)*. Installed this way, you call
  it `@agent-product-manager:product-manager`, and updates come with the marketplace, without the plan step. Commit it
  only for a marketplace you trust.
- **Is there a CLI?** Yes, for installs from any git URL, `doctor` and `prompt`. npm serves `@wastedcode/truecast` 0.2.0
  (eleven teammates). The current version builds from source. See the docs →
- **Can I write my own?** Yes. A teammate is a folder of Markdown plus one `persona.toml`. Authoring guide → Open a PR to
  add it to the catalog.
- **Footnote:** The installer and the file formats are pre-1.0 and may change between minor versions.

### 5.9 Closing CTA
- **H:** Put a specialist on the call you're about to make.
- **CTA:** Go to step 1 (anchor) · Read the source on GitHub →
- **Small line:** Used one? Tell us what it caught, or missed → (GitHub issues)

### 5.10 Footer
truecast · MIT · © 2026 Inder Singh · GitHub · Docs · Changelog · Security · Issues

---

## 6. Hand-off notes for brand-designer and ui-ux-designer

- **No invented UI.** Render the reports as quoted documents (report cards), not as Claude Code windows. The staged
  page's terminal mock (version, model and plan text that no run produced) is the single worst defect to avoid.
- **Cloudflare email obfuscation** rewrites `name@1.2.2` into "[email protected]" on the live site (seen in today's
  fetch of truecast.dev). Wrap every `name@version` string in `<!--email_off-->…<!--/email_off-->`, or turn the
  setting off in the Cloudflare dashboard (the founder's call; the wrap works today without it).
- **One command per copy button.** Claude Code runs one command per submit. Never offer "copy all 3 lines" for slash
  commands.
- **Generated numbers** (word, file and skill counts, figure bands) come from `scripts/brand/page.py`, and `--check` runs
  in `pnpm test`. Don't hand-type them.
- **The new receipt** lives at `site/proof/product-manager-call/` (README + `report.md`, written in this pass). Link to it
  from §5.2.
- **Mobile:** the hero's proof line sits directly under the CTA, above the artifact. Code blocks scroll sideways and
  are labelled so.

---

## 7. Claim ledger (every claim on the page → its source)

| Claim | Source |
|---|---|
| Twelve teammates; the names | `.claude-plugin/marketplace.json`; `personas/` (12 dirs) |
| `claude plugin install truecast --marketplace wastedcode/truecast`, plus its output | run on 2.1.302, clean HOME, 2026-10-17 |
| 2.1.292 floor (terminal), 2.1.275 floor (in-session) | anthropics/claude-code CHANGELOG.md, the `## 2.1.292` and `## 2.1.275` entries |
| The plan text, the ready line, "nothing has been written yet", the `note:` line | `truecast-plugin.sh install security-engineer` (± `--yes`), from the marketplace clone at `90b49d8`, 2026-10-17 |
| `@agent-<name>` mention form; "type @ and pick" | code.claude.com/docs/en/sub-agents; the installer's ready line |
| Refuses to overwrite, even with `--force --yes` | captured 2026-10-17, exit 5, file unchanged |
| Plugin-namespaced `name:name` for ride-along and collection installs | sub-agents docs ("scoped identifier") |
| Fair-test numbers, costs, times, model switches, interruptions | `site/proof/rerun/README.md` tables and method |
| Hero verdict lines | `site/proof/security-engineer.md` lines 13–15, 29 |
| Fixed in installer 0.1.1; current 0.1.2 | CHANGELOG "Installer plugin 0.1.1" / "0.1.2"; `plugin/truecast/.claude-plugin/plugin.json` |
| PM run lines, $0.45, 60 s, 2.4.2, model, 2 skills | `site/proof/product-manager-call/` (from `pm-run.json` and the session log) |
| Playbook sizes, 5 read-only / 7 not | `personas/*/core/persona.toml` `tools`; word counts recomputed 2026-10-17 (match `main`) |
| "Its agent file asks for" | each `personas/<name>/core/agent.md` (checked) |
| Brief path; updates never touch it | `docs/install.md`; README "never touched by an update" |
| Mandate template URL | 200 on 2026-10-17; 12 of 12 templates present |
| No server; copies from the local clone | `docs/install.md`; `truecast-plugin.sh` (no network calls) |
| `model: opus` | generated agent frontmatter |
| npm 0.2.0, eleven teammates | `npm view` 2026-10-17; `git ls-tree v0.2.0 personas/` |
| 72 hours | `SECURITY.md:24` |
| Collection sizes (§1 only, not on the page) | github.com/wshobson/agents, github.com/VoltAgent/awesome-claude-code-subagents, fetched 2026-10-17 |

**Cut for lack of a source:** 66,578 / 2,780 tokens · "10 tool calls" · "Opus 4.8 (1M context) · Claude Max" · any
adoption count · any "only" about bare names (not re-surveyed).

---

## 8. Every false or unbacked claim on the current site

### A. The staged page (`site/index.html` in this working tree, the one that would deploy)
1. **"Eleven teammates" / "Eleven deep teammates"** (roster H, comparison H, meta description) is **false**. There are twelve;
   brand-designer is missing from the roster.
2. **The Claude Code window** ("Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", "+5 tool uses", "Verdict:
   GO. Core trust surface is sound; both known escapes verified closed.") is **invented UI and output**. No published run
   produced it, and the only published review of this code says **NO-GO**.
3. **"@security-engineer … you call it by its bare name"** (hero code, install section, "from then on, in any project:
   @security-engineer") is **wrong syntax**. Claude Code documents `@agent-<name>`, a bare `@name` can resolve as a file,
   and installer 0.1.2 changed its own message for that reason.
4. **"Copy the install (all 3 lines)" / "Pastes straight into Claude Code"** is **false**. Claude Code takes one command
   per submit, and `/plugin install truecast@truecast` opens a panel you have to act on.
5. **"No terminal, no npm."** is misleading next to the recommended path, which is a terminal command. It's true only for
   the in-session path on 2.1.275+.
6. **"Read-only by default"** (hero trust line, "Least privilege") is **false**. 7 of 12 can run commands or write files.
7. **"you read the exact prompt before you run it" / "`truecast prompt <name>` prints the exact prompt"** is **unbacked for the
   page's path**. `prompt` is a CLI command (npm 0.2.0), and the plugin's plan shows tools and paths, not the prompt.
8. **"the notes it kept" / "instance/notes" / "Your instance/ — the job you set, the notes it kept"** is **false**.
   Nothing writes `work.md` yet (README:27), and there is no `notes` file.
9. **"core/skills/ core/knowledge/ persona.md"** (diagram) is **wrong file name**. It's `agent.md` plus `persona.toml`.
10. **"Updates come through the marketplace: /plugin marketplace update truecast, then /truecast:update"** is
    **incomplete in a way that bites**. The installer's own fixes (0.1.1 security, 0.1.2 `--project`) need
    `claude plugin update truecast@truecast` and a restart, and the page never says so. That's a disclosure-safety gap
    for users on 0.1.0.
11. **Anthropic's "90.2%" and "tens of thousands of tokens" quotes** are **borrowed proof**. They measure Anthropic's
    orchestrator-and-parallel-workers research system, not truecast or single specialist subagents. "Different product,
    same lesson" asks the reader to transfer a result that doesn't apply. Cut.
12. **"others: hundreds, shallow" vs "truecast: eleven, deep" / "built deep enough to trust"** is **unbacked and punching
    down**. Our own test had a 1,007-word collection agent at 6/18 and a 76-word one tying ours. Depth isn't shown to
    matter, and the count is wrong.
13. **"Each is a real subagent with … structured craft, not a costume" / "not a paragraph of vibes"** implies a quality edge
    over prompts that our test doesn't support. Cut the contrast; describe what's inside.
14. **"It pulls real skills … on demand"**, stated as a general behaviour, is overstated. In the fair test only 2 of 6 runs
    opened a skill. Say "it can open".
15. **"And it gets better without costing you anything."** is misleading pre-v1. Improvements come only when its author
    ships a version and you adopt it, and the self-improving loop isn't built.
16. **"Nothing phones home"** is true of truecast, but it understates that teammates with web tools fetch pages. Use
    `main`'s sentence.
17. **Meta description / OG** repeat #1 and #13. Twitter card is `summary` with no image. No favicon or og:image links.
18. **Missing entirely:** the fair test's unflattering result, the version floor, the restart note, how to remove it, who
    made it, the license line in context, and the security-fix update path for existing users.

### B. The live page / `main` (carried over, so the new page mustn't repeat them)
19. **"Fig. 1 … All 10 tool calls from its log"**, plus the drawn trace, is **unsourced**. The session log was never
    published.
20. **"66,578 tokens · 10 tool calls" / "2,780 tokens: the report"** is **unsourced** (same log). It's also in the README.
21. **Links to `834b03d`.** The commit isn't in `main`'s history: it reached `main` squashed into `d70aa8d` (#50). GitHub
    serves it today only through the PR ref. Link the fix to the CHANGELOG entry "Installer plugin 0.1.1" or to
    `d70aa8d`. This applies to the page, the README and both proof READMEs.
22. **Cloudflare email obfuscation** turns `security-engineer@1.2.2` into "[email protected]" in the live HTML (the plan block
    and the run label).
23. **"1.1.0 → then 1.2.2"** (Fig. 4) is a version-pinned label. Make it open-ended.

### C. Linked surfaces that drift (fix in the same change or flag)
24. **README "it worked through 66,578 tokens … 2,780-token report"** is unsourced (see #20).
25. **README "The first time you run a teammate with no job set, it asks what the project needs"** is overstated. The agent
    text says to take direction from the conversation and ask *only if it isn't clear*. In the PM run, with no brief, it
    just answered.
26. **README / docs link `834b03d`** (see #21).
27. **docs/README "instance/ — your per-project job (mandate.md) + notes (work.md)"** reads as shipped. The README itself
    says nothing writes `work.md`.
28. **Installer nit seen in today's capture:** the `remove` plan warns about ".truecast/agents/<name>/core symlink[s]"
    even for plugin-only users, who never have one. It's harmless but confusing. Engineer's call.

---

## 9. Calls I made because the founder wasn't available (all reversible)

1. **Kept the H1** "The expert teammates Claude Code doesn't ship with." *Alternative:* "Put a specialist on the call
   you'd rather not make alone." as H1. I kept the current one because it has five surfaces of equity and is the only
   candidate that names the category in five seconds.
2. **Produced and published a second real run** (`site/proof/product-manager-call/`, $0.45 of the founder's Claude usage)
   so the page shows range beyond security. *Alternative:* security-only, as on `main`. I chose to add it because "it says
   nothing about the other eleven" was the page's biggest gap, and the run is labelled as n=1.
3. **Cut the context-window token figures** rather than re-capture them. *Alternative:* run a subagent session and
   publish its log. That's worth doing later; a qualitative line is true today.
4. **CLI in the FAQ only**, with npm 0.2.0 stated. *Alternative:* publish 0.3.0 to npm first, then feature it.
5. **Added a `/security-review` FAQ** that concedes the comparison is untested. *Alternative:* leave it out. I added it
   because savvy readers will ask.

---

**Frontier check**
- **Benchmark:** Fletch PMM's H1 rules (category or job plus how you differ, "could a competitor paste it?"); Bun and uv
  (the product's own output and named head-to-head numbers on the first screen); Dunford 5+1; Raskin (name the shift);
  Wiebe (copy that speaks to the reader's objection); and `main`'s 7-panel-reviewed page, the strongest prior version.
- **Where this goes past them:** Bun's charts only show wins; ours puts the loss on the first screen and survives it.
  It shows a second, non-security role with a receipt. The install path was re-run today, end to end. Every number is
  sourced or cut, three of them from `main`.
- **Space searched:** 31 headlines across 6 tests, 3 hero-artifact options (security verdict, PM call, install plan),
  and 2 section orders. The verdict won the hero (the most visceral, and corroborated 6/6); the PM call took the range
  section.
- **Pre-empted:** what visitors get today (npm, plugin, branch), one command per copy, version floors from the changelog,
  the mention syntax from the docs, the update path for existing users, the exit, cost, team setup, built-in alternatives,
  and who's behind it.
- **Critique caught:** the "makes the call" H1 was false for 6 of 12 roles; borrowed Anthropic proof; unsourced token and
  tool-call figures; the `834b03d` history gap; an overreach in our own new receipt (disclosed).
- **Verified:** installer runs captured on 2.1.302 in a clean home; the floors match the CHANGELOG; the template URL
  returns 200; persona counts and tools recomputed; the fair-test numbers reconcile to the proof README.
