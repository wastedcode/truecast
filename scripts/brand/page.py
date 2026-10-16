#!/usr/bin/env python3
"""Fill the generated blocks in site/index.html from the repo's real data.

    python3 scripts/brand/page.py

Every drawn playbook on the page comes from site/brand/cores.json (run build.py first if a playbook
changed): one band per file in personas/<name>/core, sized by its word count (wc -w). Roster rows come
from each persona.toml (tools) and its skills/ folder. Blocks are delimited by <!--gen:NAME--> ... <!--/gen-->.
"""
from __future__ import annotations

import html
import json
import re
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PAGE = ROOT / "site" / "index.html"
GH = "https://github.com/wastedcode/truecast"
DATA = json.loads((ROOT / "site" / "brand" / "cores.json").read_text())
PS = {p["name"]: p for p in DATA["personas"]}
HW = DATA["handwritten"]
SE = PS["security-engineer"]
# The third agent in Fig. 2: VoltAgent awesome-claude-code-subagents, categories/03-infrastructure/
# security-engineer.md at 408d3c9 (wc -w = 1007; see site/proof/README.md). One file, so one band.
FREE = {"path": "security-engineer.md", "words": 1007}

# The reader's question and lane, from the copy deck (§5.5). Order is the deck's.
ROSTER = [
    ("Build", "software-architect", "How should this be built so it lasts?"),
    ("Build", "software-engineer", "Can I trust this code?"),
    ("Build", "qa", "What breaks before a user finds it?"),
    ("Ship", "security-engineer", "Can this get someone owned?"),
    ("Ship", "infrastructure", "Will this hold up in production?"),
    ("Decide", "product-manager", "Are we building the right thing?"),
    ("Decide", "product-researcher", "What are users actually telling us?"),
    ("Design", "ui-ux-designer", "Can people actually use this?"),
    ("Design", "brand-designer", "Would anyone remember us?"),
    ("Market", "product-marketer", "Why would anyone care?"),
    ("Market", "sales", "Who would actually pay for this?"),
    ("Raise", "vc-seed", "Would an investor write the check?"),
]
# Fig. 1: the files the truecast run actually read (session-truecast.jsonl): its agent file, then two skills.
FIG1_READ = {"agent.md", "skills/grade-and-remediate-risk/SKILL.md", "skills/write-the-security-verdict/SKILL.md"}


def touch(tools: list[str]) -> str:
    t = set(tools)
    out = ["reads"]
    if "Write" in t and "Edit" not in t:
        out.append("writes files")
    elif "Edit" in t:
        out.append("edits files")
    if "Bash" in t:
        out.append("runs commands")
    if {"WebSearch", "WebFetch"} & t:
        out.append("web")
    return ", ".join(out)


def band_label(path: str) -> str:
    return path.removeprefix("skills/").removesuffix("/SKILL.md").removeprefix("knowledge/")


# ---------------------------------------------------------------- horizontal playbook (HTML)
def hbar(rows, lit=frozenset(), extra_cls="") -> str:
    """One playbook lying on its side: a 3px surface line, then one band per file, left to right.
    Widths are set in CSS from --w (words) against the track's --max/--maxf, so every bar in a
    track shares one scale (see .pb in styles.css)."""
    words = sum(r["words"] for r in rows)
    bands = "".join(f'<i style="--w:{r["words"]};--i:{i}"{" class=lit" if r["path"] in lit else ""}></i>'
                    for i, r in enumerate(rows))
    return (f'<span class="pb{(" " + extra_cls) if extra_cls else ""}" style="--files:{len(rows)};--words:{words}" '
            f'aria-hidden="true">{bands}</span>')


# ---------------------------------------------------------------- Fig. 1: the vertical core
def fig1_core() -> str:
    W, WPP, GAP = 40, 40, 2
    y, out = 6.0, [f'<rect class="surface" width="{W}" height="3"/>']
    for i, r in enumerate(SE["core"]):
        h = r["words"] / WPP
        cls = "lit" if r["path"] in FIG1_READ else "unread"
        out.append(f'<rect class="{cls}" style="--i:{i}" x="0.5" y="{y + 0.5:.2f}" width="{W - 1}" height="{h - 1:.2f}" '
                   f'data-path="{r["path"]}" data-words="{r["words"]}"/>')
        y += h + GAP
    return (f'<svg class="core" viewBox="0 0 {W} {y - GAP:.2f}" width="{W}" height="{y - GAP:.2f}" aria-hidden="true" '
            f'focusable="false">{"".join(out)}</svg>')


def tree_h() -> str:
    """Fig. 3's summary on small screens: the same playbook on its side, every band solid."""
    return f'<span class="pbt pbt--tree" style="--max:{SE["words"]};--maxf:{SE["files"]}">{hbar(SE["core"])}</span>'


def fig1_core_h() -> str:
    return f'<span class="pbt pbt--fig1" style="--max:{SE["words"]};--maxf:{SE["files"]}">{hbar(SE["core"], FIG1_READ)}</span>'


# ---------------------------------------------------------------- Fig. 2: the two playbooks, one scale
def ledger_bar(which: str) -> str:
    rows = {"hw": [{"path": HW["path"], "words": HW["words"]}], "fc": [FREE], "se": SE["core"]}[which]
    return f'<span class="pbt pbt--ledger" style="--max:{SE["words"]};--maxf:{SE["files"]}">{hbar(rows)}</span>'


# ---------------------------------------------------------------- Fig. 4: the labelled core
def tree() -> str:
    """security-engineer's core drawn as a section: each row is one file, its band as tall as the file is
    long (CSS: --w words at 20 words/px), name and count beside it. The two folder labels are the cuts
    where agent.md ends and skills begin, and where skills end and knowledge begins (the mark's cut)."""
    groups = [(None, [r for r in SE["core"] if r["path"] == "agent.md"]),
              (("skills/", "17 skills, each a SKILL.md"), [r for r in SE["core"] if r["path"].startswith("skills/")]),
              (("knowledge/", "3 reference notes"), [r for r in SE["core"] if r["path"].startswith("knowledge/")])]
    lis = []
    for g, rows in groups:
        if g:
            n_skills = len(rows)
            label = g[1] if g[0] != "skills/" else f"{n_skills} skills, each a SKILL.md"
            lis.append(f'<li class="sect__dir">{g[0]} <span>{label}</span></li>')
        for r in rows:
            shown = html.escape(band_label(r["path"])).replace("-", "-<wbr>")
            lis.append(
                f'<li style="--w:{r["words"]}"><span class="sect__n">{shown}</span>'
                f'<span class="sect__w num">{r["words"]:,}</span></li>')
    return (f'<ol class="sect__list" role="list">{"".join(lis)}</ol>'
            f'<p class="sect__total"><span>{SE["files"]} files</span><span class="num">{SE["words"]:,} words</span></p>')


# ---------------------------------------------------------------- the roster
def roster() -> str:
    mx = max(p["words"] for p in PS.values())
    mf = max(p["files"] for p in PS.values())
    rows, last = [], None
    for grp, name, q in ROSTER:
        p = PS[name]
        toml = tomllib.loads((ROOT / "personas" / name / "core" / "persona.toml").read_text())
        skills = sum(1 for r in p["core"] if r["path"].startswith("skills/"))
        first = grp != last
        last = grp
        g = f'<span class="roster__grp">{grp}</span>' if first else '<span class="roster__grp" aria-hidden="true"></span>'
        rows.append(f"""<li class="roster__row{' roster__row--first' if first else ''}" id="t-{name}">
      {g}
      <div class="roster__id">
        <h3 class="roster__name">{name}</h3>
        <div class="roster__cmd"><code id="i-{name}"><span class="seg">/truecast:install</span> <span class="seg">{name}</span></code><button class="copy copy--icon" type="button" data-copy="i-{name}" aria-label="Copy /truecast:install {name}" hidden><span class="copy__label">Copy</span></button></div>
      </div>
      <p class="roster__q">“{q}”</p>
      <p class="roster__touch"><span class="roster__k">Can touch:</span> {touch(toml["tools"])}</p>
      <p class="roster__pb"><span class="pbt pbt--roster">{hbar(p["core"])}</span><span class="roster__pbn"><span class="nowrap"><span class="num">{skills}</span> skills</span> <span class="nowrap">· <span class="num">{p["files"]}</span> files</span> <span class="nowrap">· <span class="num">{p["words"]:,}</span> words</span></span></p>
      <a class="roster__in arrow-link" href="{GH}/tree/main/personas/{name}/core">See inside<span class="sr"> {name}</span>&nbsp;→</a>
    </li>""")
    head = ('<li class="roster__head" aria-hidden="true"><span></span><span>Teammate · its playbook, to scale</span>'
            '<span>The call it helps with</span><span>Can touch</span><span></span></li>')
    return (f'<ul class="roster" role="list" style="--max:{mx};--maxf:{mf}">{head}' + "\n".join(rows) + "</ul>")


def roster_ref() -> str:
    mx = max(p["words"] for p in PS.values())
    mf = max(p["files"] for p in PS.values())
    ref = lambda rows, lab: (f'<span class="pbt pbt--roster" style="--max:{mx};--maxf:{mf}">{hbar(rows, extra_cls="pb--hw")}'
                             f'<span class="pbt__lab">← {lab}</span></span>')
    return ref([{"path": HW["path"], "words": HW["words"]}], f"hand-written, {HW['words']} words") + ref([FREE], f"free collection, {FREE['words']:,} words")


# ---------------------------------------------------------------- the close: the social card's frame
def close_cores() -> str:
    """All twelve, white, hanging from one surface line and running off the field's bottom edge,
    as on og.png. Drawn at 20 words/px so the tallest runs well past any viewport's band. The surface
    line spans the twelve and stops at the last one, as on the README header."""
    WPP, COL, STEP, GAP = 20, 18, 30, 2
    order = [n for _, n, _ in ROSTER]
    w = STEP * (len(order) - 1) + COL
    body = [f'<rect class="surface" x="0" y="0" width="{w}" height="4"/>']
    tallest = 0.0
    for i, n in enumerate(order):
        y = 8.0
        for j, r in enumerate(PS[n]["core"]):
            h = r["words"] / WPP
            body.append(f'<rect style="--i:{j}" x="{i * STEP}" y="{y:.1f}" width="{COL}" height="{h:.1f}"/>')
            y += h + GAP
        tallest = max(tallest, y)
    return (f'<svg class="core close__cores-svg" viewBox="0 0 {w} {tallest:.0f}" width="{w}" height="{tallest:.0f}" '
            f'aria-hidden="true" focusable="false" preserveAspectRatio="xMinYMin slice">{"".join(body)}</svg>')


BLOCKS = {
    "fig1-core": fig1_core,
    "fig1-core-h": fig1_core_h,
    "ledger-hw": lambda: ledger_bar("hw"),
    "ledger-fc": lambda: ledger_bar("fc"),
    "ledger-se": lambda: ledger_bar("se"),
    "tree": tree,
    "tree-h": tree_h,
    "roster": roster,
    "roster-ref": roster_ref,
    "close-cores": close_cores,
}


def main() -> None:
    src = PAGE.read_text(encoding="utf-8")
    seen = set()

    def fill(m: re.Match) -> str:
        name = m.group(1)
        if name not in BLOCKS:
            return m.group(0)
        seen.add(name)
        return f"<!--gen:{name}-->{BLOCKS[name]()}<!--/gen-->"

    out = re.sub(r"<!--gen:([a-z0-9-]+)-->.*?<!--/gen-->", fill, src, flags=re.S)
    missing = set(BLOCKS) - seen
    if missing:
        raise SystemExit(f"index.html has no block for: {sorted(missing)}")
    PAGE.write_text(out, encoding="utf-8")
    print("filled", sorted(seen))


if __name__ == "__main__":
    main()
