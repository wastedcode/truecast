#!/usr/bin/env python3
"""Fill the generated blocks in site/index.html from the repo's real data.

    python3 scripts/brand/page.py
    python3 scripts/brand/page.py --check   # exit 1 if a block is out of date (writes nothing)

Every number on the page that comes from the repo is drawn here, never typed:
  - live playbooks (Fig. 3, the roster, the close, the team size) from site/brand/cores.json
    (run build.py first if a playbook changed): one band per file in personas/<name>/core, sized by wc -w;
  - the tested playbook (Figs. 1 and 2) from site/proof/rerun/security-engineer-1.2.2-core.json, a snapshot
    pinned to what the fair test ran, so a later playbook edit can't put a new size on an old test;
  - Fig. 2's squares and averages from the two tables in site/proof/rerun/README.md;
  - Fig. 8's values from site/proof/bakeoff/ (scores-blind.json, key.json, the ranks line of each
    ambition judgement).
Pinned on purpose, never generated: who made the page (Fig. 7's versions), verbatim captures (Fig. 1's
verdict, Fig. 5's install output and plan) and dated measurements (Fig. 4's tokens, Fig. 2's $ come from
the README table, which is itself the capture).
Blocks are delimited by <!--gen:NAME--> ... <!--/gen-->; a name may appear more than once.
"""
from __future__ import annotations

import glob
import json
import re
import sys
import tomllib
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PAGE = ROOT / "site" / "index.html"
GH = "https://github.com/wastedcode/truecast"
DATA = json.loads((ROOT / "site" / "brand" / "cores.json").read_text())
PS = {p["name"]: p for p in DATA["personas"]}
HW = DATA["handwritten"]
SE = PS["security-engineer"]
RERUN = ROOT / "site" / "proof" / "rerun"
BAKEOFF = ROOT / "site" / "proof" / "bakeoff"
# security-engineer as the fair test ran it (1.2.2). Figs. 1 and 2 draw this, not the live playbook.
TESTED = json.loads((RERUN / "security-engineer-1.2.2-core.json").read_text())
# The third agent in Fig. 2: VoltAgent awesome-claude-code-subagents, categories/03-infrastructure/
# security-engineer.md at 408d3c9 (wc -w = 1007; see site/proof/README.md). One file, so one band.
FREE = {"path": "security-engineer.md", "words": 1007}
FREE_URL = ("https://github.com/VoltAgent/awesome-claude-code-subagents/blob/408d3c9eee2d0c75c12a3abb5de29e53c2ca6b9e/"
            "categories/03-infrastructure/security-engineer.md")

# The reader's question for each teammate, in lane order (Build, Ship, Decide, Design, Market, Raise).
# The lane labels are off the page for the word budget; a new lane starts a new group (extra space).
ROSTER = [
    ("Build", "software-architect", "How should this be built so it lasts?"),
    ("Build", "software-engineer", "Can I trust this code?"),
    ("Build", "qa", "What breaks before a user finds it?"),
    ("Ship", "security-engineer", "Can this get someone owned?"),
    ("Ship", "infrastructure", "Will this hold up in production?"),
    ("Decide", "product-manager", "Are we building the right thing?"),
    ("Decide", "product-researcher", "What are users telling us?"),
    ("Design", "ui-ux-designer", "Can people use this?"),
    ("Design", "brand-designer", "Would anyone remember us?"),
    ("Market", "product-marketer", "Why would anyone care?"),
    ("Market", "sales", "Who would pay for this?"),
    ("Raise", "vc-seed", "Would an investor write the check?"),
]
# Fig. 1: what fair-test run truecast-2 opened, from its session log (site/proof/rerun/README.md, "What
# `truecast-2` opened"): call 11 of 17 printed these two skills. Its agent file is the session's own agent.
FAIRTEST2_SKILLS = {"skills/grade-and-remediate-risk/SKILL.md", "skills/write-the-security-verdict/SKILL.md"}
NUMBER_WORDS = {10: "Ten", 11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen"}


def band_label(path: str) -> str:
    return path.removeprefix("skills/").removesuffix("/SKILL.md").removeprefix("knowledge/").removesuffix(".md")


def wbr(name: str) -> str:
    return name.replace("-", "-<wbr>")


def check_tested() -> None:
    """The snapshot must match what the README says ran, and match the live playbook while it's still 1.2.2."""
    readme = (RERUN / "README.md").read_text()
    want = f"truecast, {TESTED['files']} files · {TESTED['words']:,} words"
    if want not in readme:
        raise SystemExit(f"✗ {RERUN.name}/README.md no longer says '{want}': the tested snapshot and the proof disagree")
    live = tomllib.loads((ROOT / "personas" / "security-engineer" / "core" / "persona.toml").read_text())["version"]
    if live == TESTED["version"] and TESTED["core"] != SE["core"]:
        raise SystemExit("✗ security-engineer is still 1.2.2 but its playbook differs from "
                         "site/proof/rerun/security-engineer-1.2.2-core.json: bump the version or re-snapshot")


# ---------------------------------------------------------------- horizontal playbook (HTML)
def hbar(rows, extra_cls="") -> str:
    """One playbook lying on its side: a 3px surface line, then one band per file, left to right.
    Widths are set in CSS from --w (words) against the track's --max/--maxf, so every bar in a
    track shares one scale (see .pb in styles.css)."""
    words = sum(r["words"] for r in rows)
    bands = "".join(f'<i style="--w:{r["words"]};--i:{i}"></i>' for i, r in enumerate(rows))
    return (f'<span class="pb{(" " + extra_cls) if extra_cls else ""}" style="--files:{len(rows)};--words:{words}" '
            f'aria-hidden="true">{bands}</span>')


# ---------------------------------------------------------------- the T: agent file as crossbar, playbook as stem
def tee(core, lit=None, wpp=40, stem=40, cross=120):
    """A playbook drawn as the mark: the agent file is the crossbar (the name Claude Code sees), the
    rest hang below it as the stem, one band per file. Bands are as tall as their words at `wpp` words
    per px; the crossbar is three stems wide, so it is drawn a third as tall: same words per px² as the
    stem. With `lit`, opened bands are solid and the rest hollow (BRAND.md · read vs not read).
    Returns (svg, {path: band centre y in px})."""
    agent, rest = core[0], core[1:]
    assert agent["path"] == "agent.md"
    ch = agent["words"] / wpp * stem / cross
    x0 = (cross - stem) / 2
    out = [f'<rect class="cross" style="--i:0" x="0" y="0" width="{cross}" height="{ch:.2f}" '
           f'data-path="agent.md" data-words="{agent["words"]}"/>']
    y, mids = ch + 4, {}
    for i, r in enumerate(rest, 1):
        h = r["words"] / wpp
        cls = "" if lit is None else (' class="lit"' if r["path"] in lit else ' class="unread"')
        k = "" if lit is None or r["path"] not in lit else f";--k:{sorted(lit).index(r['path']) + 1}"
        out.append(f'<rect{cls} style="--i:{i}{k}" x="{x0 + 0.5}" y="{y + 0.5:.2f}" width="{stem - 1}" '
                   f'height="{h - 1:.2f}" data-path="{r["path"]}" data-words="{r["words"]}"/>')
        mids[r["path"]] = y + h / 2
        y += h + 2
    hgt = y - 2
    svg = (f'<svg class="core tee" viewBox="0 0 {cross} {hgt:.2f}" width="{cross}" height="{hgt:.0f}" '
           f'aria-hidden="true" focusable="false">{"".join(out)}</svg>')
    return svg, mids


def fig1() -> str:
    """The hero: the playbook security-engineer ran with in fair-test run 2, the two skills it opened named
    at their bands. Label positions are px in the drawing's own coordinates (it is drawn 1:1)."""
    svg, mids = tee(TESTED["core"], FAIRTEST2_SKILLS)
    labs = "".join(f'<span class="f1__lab" style="--y:{mids[p]:.1f}px;--k:{k}"><code>{wbr(band_label(p))}</code></span>'
                   for k, p in enumerate(sorted(FAIRTEST2_SKILLS), 1))
    return (f'<p class="f1__pbk">its playbook · <span class="num">{TESTED["files"]}</span> files · it opened '
            f'<span class="num">{len(FAIRTEST2_SKILLS)}</span> skills</p>'
            f'<div class="f1__draw">{svg}{labs}</div>')


def fig3() -> str:
    """Fig. 3: security-engineer's live playbook as the mark, every band solid."""
    return tee(SE["core"])[0]


# ---------------------------------------------------------------- Fig. 2: the fair test
def fair_test() -> dict:
    """Parse both tables in site/proof/rerun/README.md. A run gets a hole if its cell starts with ●; it
    'ended on GO or NO-GO' if its 'how it ended' cell says GO (NO-GO, GO, CONDITIONAL GO), as the README
    counts it. The per-agent totals must agree with the README's summary table."""
    text = (RERUN / "README.md").read_text()
    runs = {"handwritten": [], "free": [], "truecast": []}
    for m in re.finditer(r"^\| \[(handwritten|free|truecast)-(\d)\]\([^)]*\) \| [^|]+\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|"
                         r" \$([\d.]+)", text, re.M):
        kind, holes, ended = m.group(1), [m.group(i).strip().startswith("●") for i in (3, 4, 5)], m.group(6)
        runs[kind].append({"holes": holes, "go": bool(re.search(r"\bGO\b", ended))})
    assert all(len(v) == 6 for v in runs.values()), {k: len(v) for k, v in runs.items()}
    summary = {}
    for m in re.finditer(r"^\| (Hand-written|Free collection|truecast)[^|]*\| (\d) of 6 \| (\d) of 6 \| (\d) of 6 \| "
                         r"\*\*(\d+) of 18\*\* \| \$([\d.]+)", text, re.M):
        kind = {"Hand-written": "handwritten", "Free collection": "free", "truecast": "truecast"}[m.group(1)]
        summary[kind] = {"per": [int(m.group(i)) for i in (2, 3, 4)], "total": int(m.group(5)), "avg": m.group(6)}
    for kind, rs in runs.items():
        per = [sum(r["holes"][i] for r in rs) for i in range(3)]
        if per != summary[kind]["per"] or sum(per) != summary[kind]["total"]:
            raise SystemExit(f"✗ rerun/README.md: the {kind} runs ({per}) don't add up to its summary row {summary[kind]}")
    return {"runs": runs, "summary": summary}


def squares(flags) -> str:
    sq = "".join(f'<i class="{"on" if f else "off"}" style="--r:{i}"></i>' for i, f in enumerate(flags))
    return f'<span class="sq" aria-hidden="true">{sq}</span>'


def fig2() -> str:
    ft = fair_test()
    order = ["handwritten", "free", "truecast"]
    track = f'style="--max:{TESTED["words"]};--maxf:{TESTED["files"]}"'
    heads = {
        "handwritten": (f'<a href="{GH}/blob/main/site/proof/README.md#the-hand-written-agent-76-words-verbatim">Hand-written</a> · '
                        f'<span class="num">{HW["words"]}</span> words', [{"path": HW["path"], "words": HW["words"]}]),
        "free": (f'<a href="{FREE_URL}">VoltAgent collection</a> · <span class="num">{FREE["words"]:,}</span> words', [FREE]),
        "truecast": (f'truecast · <span class="num">{TESTED["words"]:,}</span> words in '
                     f'<span class="num">{TESTED["files"]}</span> files', TESTED["core"]),
    }
    th = "".join(f'<th scope="col" role="columnheader"><span class="ft__who">{h}</span><span class="pbt pbt--ledger" {track}>{hbar(rows)}</span></th>'
                 for h, rows in (heads[k] for k in order))
    rows = []
    for i, label in enumerate(["Hostile repo writes into your home", "Hooks the install plan didn’t show",
                               "Unrestricted Bash, pre-approved"]):
        cells = "".join(f'<td role="cell">{squares([r["holes"][i] for r in ft["runs"][k]])}'
                        f'<span class="ft__n num">{sum(r["holes"][i] for r in ft["runs"][k])} of 6</span></td>' for k in order)
        rows.append(f'<tr role="row"><th scope="row" role="rowheader">{label}</th>{cells}</tr>')
    tot = "".join(f'<td role="cell"><span class="ft__n ft__n--tot num">{ft["summary"][k]["total"]} of 18</span></td>' for k in order)
    rows.append(f'<tr class="ft__tot" role="row"><th scope="row" role="rowheader">Total</th>{tot}</tr>')
    go = "".join(f'<td role="cell">{squares([r["go"] for r in ft["runs"][k]])}<span class="ft__n num">'
                 f'{sum(r["go"] for r in ft["runs"][k])} of 6</span></td>' for k in order)
    rows.append(f'<tr class="ft__go" role="row"><th scope="row" role="rowheader">Ended on GO or NO-GO</th>{go}</tr>')
    avg = "".join(f'<td role="cell"><span class="ft__n num">${ft["summary"][k]["avg"]}</span></td>' for k in order)
    rows.append(f'<tr class="ft__avg" role="row"><th scope="row" role="rowheader">Average run</th>{avg}</tr>')
    return (f'<table class="ft" role="table"><thead role="rowgroup"><tr role="row"><td role="cell"></td>{th}</tr></thead>'
            f'<tbody role="rowgroup">{"".join(rows)}</tbody></table>')


# ---------------------------------------------------------------- Fig. 8: the blind bake-off
def bakeoff() -> dict:
    key = json.loads((BAKEOFF / "key.json").read_text())
    scores = json.loads((BAKEOFF / "scores-blind.json").read_text())
    arm = {}
    for deck, judges in scores.items():
        for j in judges.values():
            a = arm.setdefault(key[deck][0], {"total": [], "serious": [], "rank": []})
            a["total"].append(j["total"])
            a["serious"].append(j["blocker"] + j["material"])
    files = sorted(glob.glob(str(BAKEOFF / "ambition-judgements" / "*.md")))
    assert len(files) == 3, files
    for f in files:
        line = [l for l in Path(f).read_text().splitlines() if l.startswith('{"ranks"')][-1]
        for deck, r in json.loads(line)["ranks"].items():
            arm[key[deck][0]]["rank"].append(r)
    mean = lambda xs: Decimal(sum(xs)) / len(xs)
    return {a: {m: mean(v[m]).quantize(Decimal("0.1"), ROUND_HALF_UP) for m in v} for a, v in arm.items()}


def fig8() -> str:
    b = bakeoff()
    arms = [("A", "as shipped"), ("B", "+ the rule"), ("C", "bare model"), ("D", "rewrite")]
    metrics = [("total", "mistakes per draft", 0, 12), ("serious", "serious ones", 0, 5),
               ("rank", "boldest-idea rank (1 is best)", 1, 8)]
    head = "".join(f'<th scope="col" role="columnheader"{" class=is-b" if a == "B" else ""}>{n}</th>' for a, n in arms)
    rows = []
    for m, label, lo, hi in metrics:
        cells = "".join(
            f'<td role="cell"{" class=is-b" if a == "B" else ""}><span class="dot" style="--p:{(float(b[a][m]) - lo) / (hi - lo):.4f}">'
            f'<i aria-hidden="true"></i><span class="num">{b[a][m]}</span></span></td>' for a, _ in arms)
        rows.append(f'<tr role="row"><th scope="row" role="rowheader">{label}</th>{cells}</tr>')
    return (f'<table class="bo" role="table"><thead role="rowgroup"><tr role="row"><td role="cell"></td>{head}</tr></thead>'
            f'<tbody role="rowgroup">{"".join(rows)}</tbody></table>')


# ---------------------------------------------------------------- the roster
def roster() -> str:
    mx = max(p["words"] for p in PS.values())
    mf = max(p["files"] for p in PS.values())
    rows, last = [], None
    for grp, name, q in ROSTER:
        p = PS[name]
        first = last is not None and grp != last
        last = grp
        rows.append(
            f'<li class="ro__row{" ro__row--lane" if first else ""}">'
            f'<a class="ro__name" href="{GH}/tree/main/personas/{name}/core"><code>{name}</code></a>'
            f'<span class="ro__q">{q}</span>'
            f'<span class="pbt pbt--roster" title="{p["files"]} files · {p["words"]:,} words">{hbar(p["core"])}</span>'
            f'<button class="copy copy--icon" type="button" data-copy-text="/truecast:install {name}" '
            f'aria-label="Copy /truecast:install {name}" hidden></button></li>')
    return f'<ul class="ro" role="list" style="--max:{mx};--maxf:{mf}">' + "".join(rows) + "</ul>"


# ---------------------------------------------------------------- the close: the social card's frame
def close_cores() -> str:
    """All twelve, hanging from one surface line and running off the field's bottom edge, as on og.png.
    Drawn at 20 words/px so the tallest runs well past the field. The surface line spans the twelve."""
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
    return (f'<svg class="core close__svg" viewBox="0 0 {w} {tallest:.0f}" width="{w}" height="{tallest:.0f}" '
            f'aria-hidden="true" focusable="false">{"".join(body)}</svg>')


BLOCKS = {
    "team-n": lambda: NUMBER_WORDS[len(ROSTER)],
    "fig1": fig1,
    "fig2": fig2,
    "fig3": fig3,
    "se-files": lambda: str(SE["files"]),
    "se-words": lambda: f'{SE["words"]:,}',
    "roster": roster,
    "fig8": fig8,
    "close-cores": close_cores,
}


def main() -> None:
    assert len(ROSTER) == len(PS) and {n for _, n, _ in ROSTER} == set(PS), "ROSTER and cores.json disagree"
    check_tested()
    src = PAGE.read_text(encoding="utf-8")
    seen = set()
    built = {}

    def fill(m: re.Match) -> str:
        name = m.group(1)
        if name not in BLOCKS:
            return m.group(0)
        seen.add(name)
        if name not in built:
            built[name] = BLOCKS[name]()
        return f"<!--gen:{name}-->{built[name]}<!--/gen-->"

    out = re.sub(r"<!--gen:([a-z0-9-]+)-->.*?<!--/gen-->", fill, src, flags=re.S)
    missing = set(BLOCKS) - seen
    if missing:
        raise SystemExit(f"index.html has no block for: {sorted(missing)}")
    if "--check" in sys.argv:
        if out != src:
            stale = sorted(n for n in seen if f"<!--gen:{n}-->{built[n]}<!--/gen-->" not in src
                           or len(re.findall(rf"<!--gen:{n}-->(.*?)<!--/gen-->", src, re.S)) !=
                           src.count(f"<!--gen:{n}-->{built[n]}<!--/gen-->"))
            print(f"✗ site/index.html is stale — generated blocks differ: {', '.join(stale)}", file=sys.stderr)
            print("  → run 'python3 scripts/brand/page.py' and commit the result", file=sys.stderr)
            raise SystemExit(1)
        print("✓ site/index.html's generated blocks are up to date")
        return
    PAGE.write_text(out, encoding="utf-8")
    print("filled", sorted(seen))


if __name__ == "__main__":
    main()
