# truecast.dev: homepage copy deck

Owner: product-marketer · 2026-10-17 · for brand-designer → ui-ux-designer. Words only; the page is not built here.
Source of truth: this working tree (branch = `origin/main` 90b49d8 + staged `site/` changes) and the public
channels as checked on 2026-10-17. Every claim in §6 has a source path or a command whose output I captured.

## 0. The goal, and how this deck is judged

**Target.** A Claude Code user who has never heard of truecast reads the hero for five seconds and can say
(1) what it is, (2) the first install step, and (3) one honest reason to use it over their own agent file,
in **9 of 10 cold reads**. Separately: **zero** claims on the page that a script or reader can't trace to
the repo, the published proof, or a command's output.

**What happens next because of this deck (one line, one number):** brand-designer and ui-ux-designer build
from §5, and the page ships with all **10** live-site, README and CHANGELOG issues in §8a fixed and **none** of the 20 false or unbacked
claims in §8b.

**The durable thing.** `scripts/brand/page.py --check` already fails `pnpm test` when the playbook figures
drift from `personas/*/core`. §9 proposes extending it to the fair-test numbers and to a short list of banned
unbacked figures, so the next copy edit can't bring back a number nobody can source.

---

## 1. Audience and the 5-second belief

**Who it's for (beachhead).** A developer who already works in Claude Code every day, ships mostly alone or
on a small team, and has nobody down the hall to ask "is this safe to merge?", "are we building the right
thing?" or "will anyone care?". They know subagents exist. Most haven't written one, or wrote one paragraph
and stopped.

**Their words** (this is how the market already talks; the page joins that conversation):
- "review this before I merge" / "a second opinion before I commit". Anthropic's own subagent guidance
  recommends a fresh subagent to verify work before committing ([claude.com blog][anth]).
- "pass/fail", "ship or don't ship", "file:line". Common shapes in reviewer-agent examples.
- "act like a senior security engineer". The prompt they'd otherwise paste (the 76-word agent in our test
  starts "You are a senior security engineer with 15 years of experience").

**The 5-second belief (what they must walk away holding):**
> "It's a set of expert agents for Claude Code: security, QA, product and the rest. Two commands to set up,
> then I type @ and hand one the job. They published a test where a short prompt did as well at finding
> bugs, so I believe what they do claim."

That last clause is deliberate. For this audience, a vendor who publishes the test it tied is more believable
than one who claims a win.

**Awareness stage.** Most arrivals are *solution-aware* (they know subagents and agent collections exist)
and come from GitHub, the README or a link. So the page doesn't explain what a subagent is. It answers
"why this one" and "how do I get it", in that order.

---

## 2. Painkiller and loop: the honest read

- **Acuity.** It's a painkiller at a decision point: the merge, the launch, the spec you're about to build.
  On an ordinary day it's a vitamin. The page should frame every example as a decision you're about to make,
  not as "more agents."
- **The workaround it replaces.** For most people that's asking the main Claude thread, which already knows
  their reasoning and tends to agree with it. A few write a one-file agent. Some install a free collection
  (VoltAgent's has 100+ agents and ships as a marketplace too, so "easy to install" is **not** a
  differentiator).
- **What the evidence takes away.** Our own fair test (`site/proof/rerun/README.md`): on catching bugs, a
  76-word agent tied ours 9 of 18. **The page can't claim "catches more."** Anyone who builds the pitch on
  depth-equals-quality is building on a claim we've already disproved in public.
- **What it leaves standing.** (a) The shape of the answer: 6 of 6 truecast runs ended on an explicit GO or
  NO-GO, against 0 of 12 for the other two agents. (b) Twelve roles already written, most of them roles
  nobody writes for themselves (product, research, marketing, sales, brand, investor). (c) A brief you keep
  in your repo, which updates never touch. (d) An installer that shows its plan and won't overwrite your
  files. (e) Honesty you can check.
- **The loop.** It exists, and the page currently hides it in an FAQ: commit two keys to a repo's
  `.claude/settings.json` and Claude Code offers the teammate to **everyone who opens that repo**
  (README § "Ride a teammate along"). Each adopting repo puts truecast in front of every contributor. That
  gets its own short section (§5.7). The second channel is GitHub itself (the README is the other
  front door).
- **Said out loud.** If the visitor has a decision coming, this is useful. If they're happy with their own
  agent file, the page should tell them to keep it, and it does (FAQ 1). That's the right call: it costs a
  few installs and buys trust from everyone else.

---

## 3. Positioning (single source; every line on the page derives from it)

| | |
|---|---|
| **Competitive alternatives** | 1) Ask the main Claude thread. 2) Paste or write a one-file "act like a senior X" agent. 3) Install a free collection. 4) For a solo builder: nobody (no security person, no PM, no marketer to ask). |
| **Unique attributes** (all shipped) | Twelve role playbooks, each 9–21 skills and 5,116–17,284 words of Markdown that the teammate can open mid-task (in the fair test, 2 of 6 truecast runs opened one: `site/proof/rerun/README.md`) (`site/brand/cores.json`). A brief at `.truecast/agents/<name>/instance/mandate.md` that updates never write. Versioned updates (`/truecast:update`) that show the new plan and a diff first. An installer that prints the version, tools and every path before writing, and refuses to overwrite an agent file it didn't write. Each runs as a native Claude Code subagent under its own name, in every project. A published test, losses included. |
| **Value** | A specialist's take on the decision in front of you, without writing or maintaining the prompt, and with nothing written to your machine that you didn't see first. For six roles the agent file asks for a call (GO / NO-GO, ship / don't ship, acceptance, invest / pass) instead of a summary. Tested for security-engineer only. |
| **Who cares most** | Solo and small-team builders on Claude Code with decisions they'd otherwise make alone. The entry job is "review this before I merge," because `security-engineer` is the one teammate we've tested. |
| **Category** | *Expert teammates for Claude Code* (in code: subagents). "Teammate" puts it next to a person you'd hand work to, not next to a prompt library. "For Claude Code" says where it runs. |
| **Trend** | Subagents as the place a second opinion lives. True for us, and Anthropic says it too. No "AI-powered" anything. |

**One-liner:** truecast gives Claude Code the expert teammates it doesn't ship with. Install one, type @,
and hand it the call you'd rather not make alone.

**Messaging house**

- **Roof:** *Put a specialist on the call you're about to make.*
- **Pillar 1: Already written.** Twelve roles, each a playbook it can open on the job. *Proof:* Fig. 3/5 drawn
  from `cores.json`, folders linked on GitHub. *Boundary:* size isn't quality. Fig. 5's caption says so.
- **Pillar 2: It ends on a call.** *Proof:* Fig. 2, the GO/NO-GO row: 6 of 6 vs 0 of 6 and 0 of 6. Six of
  the twelve agent files ask for a call: security-engineer (GO/NO-GO), qa (ship / don't ship),
  product-manager (acceptance verdict), product-marketer (will-it-land), sales (painkiller or vitamin),
  vc-seed (invest or pass). The other six hand back artifacts: a design doc and ADRs, code, runnable
  commands, ranked findings, flows, an identity. Never say "each ends on a call".
  *Boundary:* only security-engineer has been tested. Say it on the page.
- **Pillar 3: Yours stays yours.** Your brief is never written by an update. You see the plan before
  anything is written. It won't overwrite your files. Nothing runs on our servers. *Proof:* the captured
  plan (§6), the captured refusal (HEAD page), the script (`plugin/truecast/bin/truecast-plugin.sh`).
- **Pillar 4: Checkable.** Every run is published, including the ones we didn't win. *Proof:*
  `site/proof/rerun/` (18 unedited reports).

Discriminating proof, ranked by how much a skeptic would move:
1. **The tie, published.** No competitor's page shows that. It costs us the "better" claim and buys belief in everything else.
2. **GO/NO-GO 6/6 vs 0/12.** It discriminates, it's structural (it comes from the agent file), and the page already admits "you could ask your own agent for the same."
3. **Our security-engineer found a P0 in our own installer, and we fixed it.** Dogfooding with a real fix.
4. **The plan printout and the refusal.** Real output, and the answer to "will this mess up my machine?"
- **Weak, demoted:** word counts on their own (the test shows they don't predict catches); the
  context-window token figures (true in a private log, unpublished, and any subagent does the same; §8a-3).
  **Cut:** borrowed authority (Anthropic's 90.2% research-system stat; it isn't about us).

**Naming check.** VoltAgent is named in the hero proof line (one factual clause, added after round 2 of the
cold reads, §10), the proof section and the FAQ, with a link and its better results reported fairly: it's the
cheapest, two of its runs (`free-3`, `free-6`) found the fourth hole. Never "shallow." It passes the good-look test as a fair, sourced comparison. It would fail as a jab.

---

## 4. Voice spec (for every line below)

- **Register:** an engineer telling another engineer what they measured. Plain declaratives, numbers with
  their denominators, the source next to the claim. Dry. Concedes before it claims.
- **Keep from the founder's current copy:** figure captions ("Fig. 2 One prompt to all three…"), "verbatim,
  captured <date>", leading with the concession, "We fixed it."
- **Never:** "not a costume", "not a paragraph of vibes", "hundreds, shallow" (punching down, and disproved
  by our own test); "seamless/powerful/supercharge"; the "it's not X, it's Y" frame; three-adjective runs;
  exclamation marks.
- **Mention form:** `@agent-<name>` when typed, or "type @ and pick it". Never a bare `@security-engineer`
  in a typed example (CHANGELOG 0.1.2: a bare `@name` can resolve as a file).
- **Name forms:** "teammate" on the page. "persona" only where it links to authoring docs.

---

## 5. The page, section by section

Order is the argument: what it is → why believe it → how to get it → which one → is it safe → bring the
team → questions → the ask. **One primary CTA throughout: step 1 (the terminal command).** Secondary links
go to proof and source only.

### 5.0 `<title>` / meta / nav
- **title:** `truecast: expert teammates for Claude Code` (keep).
- **meta description (≤155):** `Twelve expert subagents for Claude Code: security, QA, architecture, product, design, marketing and more. Two commands to set up; free, open source.`
- **social card text:** `The expert teammates Claude Code doesn't ship with.`
- **nav:** Proof · Install · Teammates · GitHub ↗ (keep; that's the order a skeptic asks in).

### 5.1 Hero: what it is, the first step, why believe it
*Purpose:* the 5-second belief in §1. *Artifact:* Fig. 1, the real run card (below).

- **Eyebrow:** `For Claude Code · free and open source (MIT)`
- **H1:** **The expert teammates Claude Code doesn't ship with.**
  *Kept on merit, not because it exists.* It names the category and the gap in eight words, a Claude Code
  user parses it instantly, and README, docs, the GitHub description and the social card already carry it (README.md:8, docs/README.md:6, site/brand/BRAND.md:52, `site/brand/og.png`) (one line across every
  surface). *Alternatives tried:* "Put a specialist on the call you're about to make" is the better
  emotional line but doesn't say what the product is, so it moves to the closing CTA. "Twelve specialists
  for Claude Code. Each ends on a call." is false: architect, engineer, infrastructure, researcher, UX and
  brand hand back artifacts, not verdicts.
- **Sub (40 words):** Twelve Claude Code subagents, from security-engineer and qa to product-manager and sales, each with a playbook of skills it can open. Type @, pick one, and hand it the review, the spec or the launch you'd rather not judge alone.
  *(Round 1 of the cold read: "the call" read as a phone call next to "sales", and seven listed categories
  next to "twelve" made readers ask what the other five were. "Subagents" now appears, so nobody wonders
  whether "teammates" means people.)*
- **Install, as numbered lines (primary CTA = line 1; every line has a Copy button):**
  **1 · In your terminal, once:** `claude plugin install truecast --marketplace wastedcode/truecast`
  **2 · In Claude Code, once per teammate:** `/truecast:install security-engineer`
  **3 · Type @ and pick it:** `@agent-security-engineer review this branch before I merge`
  Small print: Claude Code 2.1.292 or later. Already open? `/reload-plugins` before step 2.
  [Already in a session? →](#install-session) · [Read the installer's source →](https://github.com/wastedcode/truecast/blob/main/plugin/truecast/bin/truecast-plugin.sh)
  *(Cold reads: unnumbered steps contradicted "set up once"; a reader in a hurry skipped step 2; the
  card's `@agent-…` didn't match "type @"; the security and OSS readers wanted the script. There is no
  install-all command, so the sub says "set up once" about the installer only.)*
- **Proof line (47 words):** The difference is the call, not the catch. We gave one prompt to three
  security agents, six runs each: a 76-word one you could write, VoltAgent's free one, and ours. The 76-word
  one found as many holes. Only ours ended every run on a GO or NO-GO. [All 18 runs →](#proof)
  *(Round 1: leading with "as many holes, no more" read as "don't install". Round 2: "the other two agents,
  0 of 12" didn't reconcile with 18 runs, and the VoltAgent user couldn't name a difference. So the takeaway is
  stated first and both agents are named. Naming VoltAgent passes the good-look check because the sentence
  is factual and the proof section credits its wins. Source: Fig. 2.)*
- **For ui-ux-designer (not copy):** on mobile the command can't be run, so offer a copy of the command as
  the action and don't let the run card push the proof line below the fold. One hero row of the twelve
  names (linking to §5.5) gives the PM and designer readers something of theirs to see. Keep the hero
  caption free of "Fig. 1": next to the finding label "F1", readers saw a naming collision. The figure
  number can live in the markup and the later cross-references.

**Fig. 1 (hero visual): the real run card.** Source: `site/proof/security-engineer.md` (verdict and F1/F2
verbatim) and `site/proof/README.md` ("What we typed"). Show the run **as it happened**: it was not an
`@agent-` mention, and the subagent's prompt was written by the session.
- Header line: `security-engineer subagent` · `security-engineer 1.2.2` · `claude-opus-5-5`.
  **Write "security-engineer 1.2.2" with a space, never `name@1.2.2`**: Cloudflare rewrites that pattern
  as an obfuscated email on the live site today (§8a-1).
- Prompt line (what we typed, verbatim, trimmed): `› Use the security-engineer subagent for this. Task for it: review plugin/truecast/bin/truecast-plugin.sh … Can anything here get a user owned?`
- Steps: keep the 10 tool-call lines **only if** the log excerpt is published (§8a-3). Otherwise show only
  what the report itself states: "read the script and the four commands (cited at file:line) · ran the attack
  in a sandbox with a fake HOME". "Opened 2 of its skills" comes from the log, so it goes with the log.
- Verdict, verbatim: `Verdict: NO-GO for --project until F1 is fixed.` / `F1 — P0 for the --project lane. … Confirmed.`
- Caption: **Fig. 1** A real review of our own installer, 2026-10-16 (`--project` is the install that writes into a repo). Verdict and finding verbatim from
  [its report](https://github.com/wastedcode/truecast/blob/main/site/proof/security-engineer.md). We fixed F1
  the same day.

### 5.2 What a teammate is (three parts, one artifact each)
*Purpose:* answer "what am I installing?" before the proof, so the proof has something to attach to.

- **H2:** **A teammate is a playbook, your brief, and its own context.**
- **The playbook.** 17 skills, 3 reference notes and an agent file for security-engineer: 12,697 words of
  plain Markdown. It opens what the job needs. (Add "in Fig. 1 it opened two" only once the log excerpt is published, §8a-3.) They load only into that teammate,
  not into your main session.
  *Artifact:* **Fig. 3**, the 21 files to scale, from `cores.json` (generated; `page.py --check` keeps it in step). Link: [Open the folder on GitHub ↗](https://github.com/wastedcode/truecast/tree/main/personas/security-engineer/core)
- **Your brief.** One file in your repo, `.truecast/agents/security-engineer/instance/mandate.md`: what the
  project is, what matters, where the bar is. It reads it first. Updates never write to it. No brief? It
  asks what the project needs and works from your answer.
  *Artifact:* **Fig. 4**, where an update writes and where it stops (`~/.truecast/personas/security-engineer/`
  1.1.0 → 1.2.2 | your repo's `mandate.md`, never written). 1.1.0 → 1.2.2 is security-engineer's real history (`git show d70aa8d^:personas/security-engineer/core/persona.toml`).
- **Its own context.** Each teammate is a native Claude Code subagent. It does its reading and testing in
  its own context and hands your session the report.
  *Numbers:* use "66,578 tokens of digging, a 2,780-token report" **only after** the usage lines are published
  in `site/proof/` (§8a-3). Until then, no numbers. *Recorded call:* I defaulted to no numbers. The alternative is
  publishing the log line and keeping the bar chart, which is better if someone does it.

### 5.3 Proof: the test we didn't win
*Purpose:* the trust turn. *Artifact:* **Fig. 2**, the 3×6 run grid (data: `site/proof/rerun/README.md`).

- **H2:** **It found a real hole in our installer. So did a 76-word agent.** (Keep. It's the best line on
  the current page: concession first, specific, and it makes you read on.)
- **Body:**
  Fig. 1's review showed that a hostile repo could get its text written into your `~/.bashrc`. We fixed it,
  then gave the same prompt, byte for byte, on the code from before the fix, to three security agents, six runs each: a 76-word one you could
  write in a minute, a 1,007-word one from VoltAgent's free collection, and ours.

  The 76-word one found that hole in all six runs. Across all three holes, ours found no more than it did.
  The one thing only ours did was end every run on an explicit GO or NO-GO, with findings ranked by when to fix them.
- **Fig. 2 rows** (counts and costs from the published table in `site/proof/rerun/README.md`. The hole labels are rewritten in plain words, and the GO/NO-GO row is derived from its "how it ended" column, which the README states as "all six truecast runs closed on an explicit GO or NO-GO". Caption it that way; don't call it verbatim):

  | | Hand-written · 1 file · 76 words | Free collection · 1 file · 1,007 words | truecast · 21 files · 12,697 words |
  |---|---|---|---|
  | A hostile repo writes into your `~/.bashrc` (F1) | 6 of 6 | 5 of 6 | 5 of 6 |
  | Agent files carry hooks the plan never showed (F2) | 1 of 6 | 1 of 6 | 2 of 6 |
  | Claude could run the commands unasked (F3) | 2 of 6 | 0 of 6 | 2 of 6 |
  | **All three holes** | **9 of 18** | **6 of 18** | **9 of 18** |
  | **Ended on an explicit GO or NO-GO** | **0 of 6** | **0 of 6** | **6 of 6** |
  | Average run | $0.85 · 3.7 min | $0.68 · 2.7 min | $1.04 · 4.3 min |

- **Caption:** **Fig. 2** One prompt to all three, six runs each, 2026-10-16, Claude Code 2.1.301,
  `claude-opus-5-5` (in 8 of 18 runs Claude Code switched to `claude-opus-4-8` partway; [which runs](https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/README.md#method)).
  Scored on the three holes we fixed, decided before reading any report.
- **The read (keep, tightened):** So at catching these, a short prompt held its own, at $0.85 a run against
  our $1.04. The GO or NO-GO comes from its agent file, and you could ask your own agent for the same. What
  you get with truecast is a call or a finished artifact already written into each of twelve roles, a brief you keep for each one, and
  updates that never touch it. This is one review of one kind. Every run is published, so you can check it.
- **Fourth hole (keep, one line):** The test turned up a fourth hole we hadn't scored: an update could write
  somewhere other than where its plan said. Two VoltAgent runs and one of ours raised it (`free-3`, `free-6`, `truecast-4`). Installer 0.1.2
  fixes all four. `claude plugin list` shows your version.
- **Links:** [All 18 reports, and how we scored them →](https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/README.md) ·
  [Fig. 1's review and the prompt each agent got →](https://github.com/wastedcode/truecast/blob/main/site/proof/README.md#the-first-review)
- **Commit link:** the fix → **`d70aa8d`** (on main), **not `834b03d`** (§8a-2).

### 5.4 Install: the path exactly as it works today
*Purpose:* get them from "yes" to `@agent-security-engineer` without a wrong turn. *Artifact:* real output at
each step (captured below, §6).

- **H2:** **Two commands to set up. Then call it by name.**
- **1 · In your terminal.** `claude plugin install truecast --marketplace wastedcode/truecast` [Copy]
  Needs Claude Code 2.1.292 or later (`claude --version`). That's the installer. Once per machine.
  *You'll see, at the end (verbatim, captured 2026-10-17):*
  ```
  ✔ Successfully added marketplace: truecast (declared in user settings)
  Installing plugin "truecast@truecast"...✔ Successfully installed plugin: truecast@truecast (scope: user)
  ```
- **2 · In Claude Code, any project.** `/truecast:install security-engineer` [Copy]
  Claude Code already open? Run `/reload-plugins` first. You'll see the plan before anything is written. Say yes.
  *The plan (verbatim, home shown as `~`, last machine-readable line left off):*
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
  (This block is in `<pre>`, but Cloudflare still rewrites `security-engineer@1.2.2` into an email link.
  Turn off Email Obfuscation for the zone, or ship the block with `&#64;` split across spans; §8a-1.)
  The last line appears only if you've never had a `~/.claude/agents/` folder. Then restart Claude Code once.
  *Then (verbatim):* `✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.`
- **3 · Call it by name.** `@agent-security-engineer review this branch before I merge` [Copy] (same text as the hero's step 3)
  Typed by hand it's `@agent-` plus the name. Or type `@` and pick it.
- **4 · Give it your brief (optional).** Keep the existing one-liner that saves the template without
  overwriting (the URL returns 200 today:
  `raw.githubusercontent.com/wastedcode/truecast/main/personas/security-engineer/instance-template/mandate.md`).
  macOS, Linux or WSL.
- **Already in a session?** On 2.1.275+: `/plugin install truecast --marketplace wastedcode/truecast`, choose
  **Install for you**, then step 2. Older: `/plugin marketplace add wastedcode/truecast`, then
  `/plugin install truecast@truecast`, which opens the same panel: choose **Install for you** (`docs/install.md`).
- **Later: update.** Terminal: `claude plugin marketplace update truecast` and
  `claude plugin update truecast@truecast`, restart Claude Code, then `/truecast:update security-engineer`.
  (Both terminal commands are needed: auto-update is off by default for third-party marketplaces, and
  refreshing the catalog doesn't replace the installer.)
- **Later: remove.** `/truecast:remove security-engineer` · `claude plugin uninstall truecast@truecast` ·
  `claude plugin marketplace remove truecast`. Your brief is untouched by all three.
- **Windows:** run Claude Code inside WSL. Native Windows isn't tested.
- **Don't offer npm as an equal path on the page.** `npm install -g @wastedcode/truecast` installs **0.2.0**
  (npm `latest`, 2026-07-22). Plugin/CLI shared-copy adoption is 0.3.0, which is unpublished and untagged. If the CLI is
  mentioned at all, link to the README and say "npm serves 0.2.0".

### 5.5 The cast: pick the call
*Display note:* show `vc-seed` with its call ("Would an investor write the check?") in the same line. Cold readers didn't know the name, and renaming a persona is a product call, not a page call.
*Purpose:* show breadth, and let them pick the role for the decision in front of them. *Artifact:* **Fig. 5**,
every playbook to one scale, with the two test agents (76 and 1,007 words) drawn alongside so size is
never read as score.

- **H2:** **Twelve teammates. Pick the call you'd rather not make alone.**
- **Caption:** Size shows what's inside. It isn't a score: in Fig. 2 the 76-word agent caught as much.
- **Rows (verified 2026-10-17 against `persona.toml` tools, `cores.json` counts, and a grep of each `agent.md` for the deliverable):**

| Group | Teammate | The call | Its agent file asks for | Can touch | Skills · files · words |
|---|---|---|---|---|---|
| Build | software-architect | "How should this be built so it lasts?" | a design doc with a real diagram, and an ADR for each hard-to-change call | reads, writes files, web | 18 · 22 · 13,025 |
| Build | software-engineer | "Can I trust this code?" | code proven by trying to break it, shipped in small safe steps | reads, edits files, runs commands, web | 13 · 16 · 6,697 |
| Build | qa | "What breaks before a user finds it?" | a ship or don't-ship verdict, with the blocker list | reads, runs commands, web | 17 · 20 · 13,107 |
| Ship | security-engineer | "Can this get someone owned?" | findings at file:line, each graded, and a GO or NO-GO | reads, runs commands, web | 17 · 21 · 12,697 |
| Ship | infrastructure | "Will this hold up in production?" | commands that run first time, with how to undo them | reads, edits files, runs commands, web | 21 · 24 · 14,121 |
| Decide | product-manager | "Are we building the right thing?" | a validated spec, its success bar, and an acceptance verdict | reads, web | 17 · 21 · 8,570 |
| Decide | product-researcher | "What are users actually telling us?" | findings ranked by confidence, each with its receipts | reads, web | 16 · 21 · 8,035 |
| Design | ui-ux-designer | "Can people actually use this?" | user flows, and a design it has rendered and checked at every size | reads, edits files, runs commands, web | 21 · 24 · 17,284 |
| Design | brand-designer | "Would anyone remember us?" | one brand idea, a mark tested at 16px, and the identity as tokens | reads, edits files, runs commands, web | 9 · 11 · 5,116 |
| Market | product-marketer | "Why would anyone care?" | the positioning, the copy, and a will-it-land verdict | reads, web | 18 · 23 · 16,902 |
| Market | sales | "Who would actually pay for this?" | a painkiller-or-vitamin verdict and a buyer profile, with the evidence | reads, web | 16 · 20 · 12,361 |
| Raise | vc-seed | "Would an investor write the check?" | an invest-or-pass call and the one risk it would underwrite | reads, web | 16 · 20 · 8,470 |

- Each row: `/truecast:install <name>` [Copy] and "See inside <name> →" → `tree/main/personas/<name>/core`.
- **Footnote (keep):** "Its agent file asks for" is what its instructions tell it to hand back, not a result
  we've tested. Only security-engineer has been tested (Fig. 2). "Can touch" sums up the tools it declares;
  the install plan lists them exactly.

### 5.6 Trust: what it does to your machine
*Purpose:* answer "should I let some Markdown into my setup?" with output, not adjectives.

- **H2:** **You see every file before it's written.**
- **You see the plan.** The version, the tools, every path, and then it waits. If it would replace a file it
  wrote before, it shows you the diff. *(Artifact: the plan's last line, "nothing has been written yet.")*
- **Every tool is on the label.** Five of the twelve can only read, search and fetch web pages. Seven can also
  run commands or write files. The cast table and the plan say which.
- **It won't overwrite an agent file you wrote.** *(Artifact: the captured refusal, `error: refusing to
  overwrite a file truecast did not generate: …/.claude/agents/security-engineer.md`; `--force` doesn't
  override it. Source: exit 5 in `plugin/truecast/commands/install.md`, behaviour in the script.)*
- **Nothing runs on our servers. We don't have any.** It copies from the clone Claude Code already made from
  GitHub, and truecast collects nothing. Teammates with web tools can fetch pages, like any agent with those tools.
- **Found a hole?** [SECURITY.md](https://github.com/wastedcode/truecast/blob/main/SECURITY.md): we aim to
  acknowledge within 72 hours. (True: SECURITY.md line 24.)

### 5.7 Bring the team (the loop): promoted out of the FAQ
*Purpose:* turn one install into a repo's worth. *Artifact:* the real JSON from the README.

- **H2:** **Commit a teammate to the repo, and everyone who opens it gets offered one.**
- **Body:** Merge these two keys into the repo's `.claude/settings.json`. When someone opens the repo in
  Claude Code and trusts the folder, Claude Code offers them the teammate. Installed this way it's namespaced by
  its plugin: it answers to `product-manager:product-manager`, not a bare name, and updates come with the
  marketplace, without the plan step. Commit it only for a marketplace you trust, ours included, and review
  what it ships first. (Namespacing: README § "Ride a teammate along" and `docs/install.md` "Straight from
  the marketplace". Updates without the plan step: `docs/install.md` ("updates come with the plugin").
  README's "a marketplace you control" contradicts its own example, which commits ours; see §8a-9.)
- *(JSON block verbatim from README § "Ride a teammate along", `enabledPlugins` as an object; the CHANGELOG
  fixed the array form.)*
- *Recorded call:* promoted from FAQ to its own short section because it's the only distribution loop the
  product has. Alternative: leave it in the FAQ (less scroll). Promotion is reversible.

### 5.8 Questions
Keep five of the current six, tightened ("Can my whole team get it?" becomes §5.7). Each answer starts with the honest bit.
1. **I already wrote an agent file. Why switch?** If it does the job, keep it. In our test a 76-word agent
   caught as much as ours. truecast won't install over it. What it adds: twelve roles already written, a brief
   for each in your repo, versioned updates that never touch that brief, and a plan before anything is written.
2. **What about the big free agent collections?** We tested one: VoltAgent's 1,007-word security-engineer,
   same prompt, six runs. It raised 6 of a possible 18, against 9 for ours and 9 for the 76-word agent, and it was the
   cheapest at $0.68 a run. One test, not a benchmark. [All 18 reports](https://github.com/wastedcode/truecast/blob/main/site/proof/rerun/README.md).
3. **What does it cost?** Nothing to install. Every teammate runs on Opus (`modelHint = "opus"` in all
   twelve) on your own Claude Code usage. In the test a truecast review averaged $1.04 at API prices.
4. **Does it learn my project?** Not on its own. It reads your brief every time. Edit the brief and the next run picks it up.
5. **Can I write my own?** Yes: a folder of Markdown and one `persona.toml`. [Authoring guide →](https://github.com/wastedcode/truecast/blob/main/docs/authoring-personas.md). Open a PR to add it to the catalog.
- **Below the FAQ:** The installer and the file formats are pre-1.0 and may change between minor versions.

### 5.9 Closing CTA
- **H2:** **Put a specialist on the call you're about to make.**
- **Primary:** [Go to step 1](#step-1). **Secondary:** [Read the source on GitHub →](https://github.com/wastedcode/truecast)
- **Feedback loop:** Used one? [Tell us what it caught, or missed →](https://github.com/wastedcode/truecast/issues/new/choose)

### 5.10 Footer
`truecast · MIT · © 2026 Inder Singh` · GitHub · Docs · Changelog · Security · Issues (all exist on main).

### 5.11 404 page
Restore `site/404.html` (deleted in the working tree). Copy: **"Nothing here."** / "That page doesn't exist.
[Back to truecast.dev →](/)". Without the file, Cloudflare Pages serves `index.html` with a 200 for every
unknown URL (SPA fallback): soft 404s for crawlers, and dead links that look like they work.

---

## 6. Ground truth: what visitors actually get (checked 2026-10-17)

| Channel | What it serves | How I checked |
|---|---|---|
| GitHub default branch `main` | 90b49d8 = this branch's HEAD (the site changes are staged on top) | `git rev-parse HEAD origin/main` |
| Marketplace (`wastedcode/truecast`, cloned from main) | installer plugin **0.1.2**; 12 teammates (brand-designer 0.1.6, infrastructure 1.2.2, product-manager 2.4.2, product-marketer 1.5.6, product-researcher 0.2.2, qa 1.3.2, sales 2.2.2, security-engineer 1.2.2, software-architect 1.4.2, software-engineer 1.4.2, ui-ux-designer 1.3.6, vc-seed 0.2.2) | fresh `HOME`, `claude plugin install truecast --marketplace wastedcode/truecast` on Claude Code 2.1.302 → success; `claude plugin list` → `Version: 0.1.2`; installer `list` printed the 12 rows |
| Install lane end-to-end | plan (above, verbatim) → `--yes` → `✓ security-engineer@1.2.2 is ready — mention it as @agent-security-engineer, or type @ and pick it.`; agent file written with `model: opus`, tools `Read, Grep, Glob, Bash, WebSearch, WebFetch` | ran `truecast-plugin.sh install security-engineer` from the clone, under the sandbox `HOME` |
| npm `@wastedcode/truecast` | `latest` = **0.2.0** (2026-07-22); 0.3.0 unpublished | `npm view … dist-tags` |
| Git tags | v0.1.0, v0.1.1, v0.2.0. **No v0.3.0** | `git ls-remote --tags` |
| truecast.dev (live) | = main's `site/index.html`, except Cloudflare has rewritten two `security-engineer@1.2.2` strings into email-protection links | `curl` + diff against `git show HEAD:site/index.html` |
| Brief template URL | 200 | `curl` |

**Not verified by me:** the interactive `/truecast:install` slash command and the "Install for you" panel
(they wrap the same script; source: `docs/install.md`), and the exact 2.1.292 / 2.1.275 version floors
(docs; I ran 2.1.302). **The typed `@agent-security-engineer` mention is not verified at runtime by anyone:**
no published run uses it (the first review said "Use the security-engineer subagent", the rerun used
`--agent`). The form comes from the installer's ready message and CHANGELOG 0.1.2. **QA should run one
interactive `@agent-security-engineer …` before launch**, because hero step 3 teaches it.

---

## 7. Objections the founder would raise, and what this deck does about each

| Objection | Answer (done in the deck) |
|---|---|
| "You kept my H1. Did you even try?" | Two alternatives, tested against the 5-second belief, in §5.1 with reasons. The H1 wins on category clarity and on matching every other surface. The best runner-up became the closing H2. |
| "Leading with the tie undersells us." | The hero leads with what it is and the command. The proof line states the difference first ("the call, not the catch"), then the tie. Two rounds of cold reads drove that order (§10). For a skeptical dev the published tie is the strongest trust asset the page has. |
| "Cut the VoltAgent name, it's a jab." | One factual clause in the hero (cold readers who use VoltAgent asked for it by name), then the proof and the FAQ, with its wins stated (cheapest, found the fourth hole). That's a fair comparison. The working-tree page's "hundreds, shallow" is the jab, and §8b cuts it. |
| "Why drop the token numbers?" | They're real (`subagent_tokens: 66578` in a private benchmark log) but not published, so a visitor can't check them. Publish the line and they come back (§8a-3). |
| "Isn't the page already long?" | Yes. The hero is cut from 88 words of sub and proof line on the live page to a 40-word sub and a 47-word proof line, with the install split into numbered steps. The FAQ loses the team question (now §5.7). Everything else earns its place by answering a skeptic's question in order. |
| "Did you check what people actually get?" | §6: a fresh-HOME install from public GitHub, today, with real output. |

---

## 8. Every current-site claim that's false, unbacked or broken

### 8a. Live site = `main` (`git show HEAD:site/index.html`) and the README

1. **Cloudflare email obfuscation corrupts real output.** On truecast.dev, `security-engineer@1.2.2` in
   Fig. 1's header and in the verbatim plan is served as `<a href="/cdn-cgi/l/email-protection">[email protected]</a>`.
   With JS the decoder restores it. Without JS, in reader modes, feeds and LLM fetchers, the "verbatim" plan
   reads `[email protected]`. *Fix:* turn off Scrape Shield → Email Obfuscation for the zone, and/or write
   `security-engineer 1.2.2` in prose.
2. **`834b03d` isn't in main's history.** The fix was squash-merged as **`d70aa8d`**.
   `git merge-base --is-ancestor 834b03d HEAD` fails, and `834b03d` lives only on the `frontier-bar` branch.
   Linked from the page (1 link, 3 mentions), `README.md:16`, `site/proof/README.md:150`, `site/proof/rerun/README.md:50`.
   If that branch is deleted the links can break. *Fix:* link `d70aa8d`. Keep mentions of `834b03d^` as the
   test's *input tree* (that's historical method, and the tree SHA `3cc249dc…` is given).
3. **"66,578 tokens … 2,780-token report" and "All 10 tool calls from its log" aren't in any published
   source.** Grep across the repo finds them only in `README.md:36` and the page. The figure is real in a
   private benchmark log (`subagent_tokens: 66578`), which isn't shipped. *Fix:* publish the subagent log's
   usage and tool-use lines (redacted) as `site/proof/security-engineer-log.md`, or cut the numbers (the deck's default).
4. **Hero fails the 5-second test.** It's not false, but it's 88 words of sub and proof line before the
   command, and the tie is phrased as the takeaway. Replaced in §5.1.
5. **Bare `@security-engineer` on the live page.** The hero run card's name (`<span class="run__name">@security-engineer</span>`)
   and the Fig. 2 column header both show it. No published run used that mention, and CHANGELOG 0.1.2 says a
   typed bare `@name` can resolve as a file. Use "security-engineer subagent" on the card and the plain name
   in tables. (The installer's plan line "tools granted to @security-engineer" is verbatim output; leave it.)
6. **The live hero card shows a prompt that wasn't typed as shown** (`› review plugin/truecast/…`, under a
   `@security-engineer` name). The caption does disclose that the session wrote the subagent's prompt, but
   the card itself implies a direct mention. Show what was typed (§5.1).
7. **FAQ "install ours as a plugin with `/plugin install security-engineer --marketplace wastedcode/truecast`
   … call it as `@agent-security-engineer:security-engineer`".** Plausible from the docs' lane description,
   not verified by any captured output. Keep it only with a captured run, otherwise point to
   `docs/install.md#straight-from-the-marketplace-no-installer`.
8. **README "Get the CLI" puts `npm install -g` next to a CLI described with 0.3.0 features.** It's
   qualified ("npm still serves 0.2.0") in one parenthesis. The page must not repeat it unqualified.

9. **README.md:175 "Only commit this for a marketplace you control"** sits under an example that commits
   `wastedcode/truecast`, which the reader doesn't control. The live page says "trust". Align README to
   "a marketplace you trust; review what it ships first".

10. **"One free-collection run and one of ours raised it"** (live page, the fourth hole) and CHANGELOG 0.1.2
   (credits `free-6` and `truecast-4`): `free-3.md:17` raises the same `/truecast:update --project` gap.
   That makes two VoltAgent runs, not one. Fix both. Understating a rival's result is the wrong direction to be wrong in.

### 8b. Working tree `site/` (staged; **this is what deploys if the new page doesn't replace it**)

The staged `index.html` is an older draft. Every item below is false, unbacked or broken against this tree. (Two staged lines are true and survive in §5: "native Claude Code subagent, its own context" and "only the tools the role declares".)

1. **Invented terminal UI**: "Claude Code v2.1.177 · Opus 4.8 (1M context) · Claude Max", a `› @security-engineer
   find me glaring gaps` session ending "**Verdict: GO.** … both known escapes verified closed." No such run
   is published, and the real published review ended **NO-GO** with a P0.
2. **"Eleven teammates"** (4 uses in prose, plus the "eleven, deep" label). There are **twelve**, and brand-designer is missing from the cast.
3. **"Read-only by default"** (hero and trust): **7 of 12** can write files or run commands.
4. **"Copy the install (all 3 lines)" / "Pastes straight into Claude Code"** (unbacked): the docs give these
   as sequential commands, `/plugin install truecast@truecast` opens a panel where you choose
   "Install for you", and pasting three slash commands as one message isn't a documented path.
5. **"No terminal, no npm"** as *the* path: the recommended path (README, docs) starts in the terminal.
6. **"you read the exact prompt before you run it"** / **"`truecast prompt <name>` prints the exact prompt"**:
   the plugin lane shows a plan, not the prompt. `truecast prompt` is the npm CLI, which visitors would get as 0.2.0.
7. **Anthropic "90.2%" multi-agent stat**: real quote, wrong product (a research system). Borrowed proof that
   doesn't discriminate. Also misparaphrased as "focused multi-agent setups beat a single general agent".
8. **Second Anthropic quote** used as proof of truecast: same problem.
9. **"core/skills/ core/knowledge/ persona.md"**: there's no `persona.md`. It's `agent.md` + `persona.toml`.
10. **"instance/notes", "the notes it kept"**: nothing writes notes. `work.md` is planned (README: "nothing writes them yet").
11. **"You keep your edits; you take the upstream gains"**: `core/` is read-only by policy (README:25: "Read-only; one global copy"), and an update replaces it, so edits there aren't kept. Only the brief is yours.
12. **Bare `@security-engineer`** taught as the typed form (×4). The documented form is `@agent-security-engineer`.
13. **"from then on, in any project: @security-engineer"**: same.
14. **Update path "`/plugin marketplace update truecast`, then `/truecast:update`"** omits
    `claude plugin update truecast@truecast`, so users stay on an old installer (auto-update is off for
    third-party marketplaces), which matters because 0.1.1/0.1.2 are security fixes.
15. **"others: hundreds, shallow" / "Eleven deep teammates, not a skill dump"**: unbacked, and our own test
    shows a 76-word agent matched ours. Fails the good-look check.
16. **"not a paragraph of vibes" / "not a costume" / "Not 'act like a security expert'"**: implies the
    alternative is worse at the job, which our published test contradicts.
17. **"a real review, not a confident summary"** captioning the invented GO transcript.
18. **"Nothing phones home"**: truecast collects nothing (true), but teammates with web tools fetch pages.
    Needs the HEAD page's qualifier.
19. **`site/404.html` deleted**: soft-404s on Pages (§5.11).
20. **No proof section**: the staged page drops the fair test entirely, which removes the one discriminating, checkable asset.

---

## 9. Proposed durable check (not built: outside my tools and lane)

Extend `scripts/brand/page.py --check` (already run by `pnpm test`) to:
- read every `N of 6` / `N of 18` / `$x.xx · y.y min` on the page from `site/proof/rerun/README.md`'s table and fail on any mismatch;
- fail on any GitHub commit link whose SHA `git merge-base --is-ancestor` rejects against `main`;
- after each deploy, `curl -s https://truecast.dev/ | grep -c email-protection` must return 0. Cloudflare's
  rewrite happens at the edge, inside `<pre>` too, so only a check of the served page catches it;
- fail on a short denylist of figures with no published source (`66,578`, `2,780`, `90.2%`) unless a
  `site/proof/` file contains them.
Owner: software-engineer. That turns three of §8a's ten issues (1, 2 and 3) into test failures.

[anth]: https://claude.com/blog/how-and-when-to-use-subagents-in-claude-code

---

## 10. The judges: what each round returned and what changed

Simulated cold readers are proxies (fresh model contexts given only the hero), **not real prospects**. Before
launch, the 5-second test should go to five real Claude Code users (`test-the-message`).

| Round | Judge | Returned | Changed |
|---|---|---|---|
| 1 | 10 simulated cold readers, hero only | what it is 9/10 · first step 7/10 · honest reason 6/10 | Proof line: difference first. "Subagents" in the sub. "The call" replaced (it read as a phone call next to "sales"). Install split into numbered steps. |
| 2 | 10 fresh simulated readers, revised hero | 10/10 · 10/10 · 7/10, plus 1 intended "honest no" (writes their own agents and understood the offer) | Both rival agents named. "The call, not the catch" stated. Step 2 and step 3 get Copy, with "once per teammate". Installer source linked. `--project` glossed. vc-seed shown with its call. |
| 1 | QA fact-checker (fresh context, deck + repo + public channels) | 13 problems + 4 count errors | All fixed: the Fig. 1 card shows the run as it happened (no `@agent-` mention, our typed prompt). "Opens" → "can open" (2 of 6 runs opened a skill). Pillar 2 limited to the six roles whose files ask for a call. 2.7 min kept (the published figure; my 2.8 recomputed rounded data). Fig. 2 labelled derived, not verbatim. Repo-lane name corrected to `product-manager:product-manager`, with README's "marketplace you control". "One at a time" uncited, removed. "Two commands" everywhere. Word counts recounted. Live bare `@security-engineer` added to §8a. The unverified `@agent-` runtime claim retracted and handed to QA. |
| 2 | QA fact-checker, changed sections + full re-check of §1/§3/§5/§7/§8 | all round-1 fixes confirmed; 7 problems + 2 nits | All fixed: "twelve roles" overclaim in §5.3; H1 rationale (8 words, not 9; the plugin doesn't carry the line); VoltAgent naming made consistent; §5.7 sources split, plus the control-vs-trust contradiction (and the same contradiction in README, now §8a-9); §5.3 now says the test ran on the code from before the fix; Value line limited to six roles; §9's Cloudflare check moved to the served page; one step-3 example everywhere. |
| 3 | QA fact-checker, narrow re-check of round-2 fixes | 8 of 9 confirmed; one wrong path (`BRAND.md` → `site/brand/BRAND.md`) | Fixed. No internal contradictions found. |

Target vs actual: the 9/10-cold-reads target was hit on "what is it" and "first step" (10/10 each). "An honest
reason" reached 7/10, or 8/10 counting the intended honest no. **Not hit.** The two misses (a VoltAgent user,
a reader in a hurry) are answered by the round-2 fixes but haven't been re-read.
