#!/usr/bin/env python3
"""Build and validate the gold catalog.

    python3 gold/build.py           # validate, then write llms.txt, llms-full.txt, index.jsonl
    python3 gold/build.py --check   # validate and fail if any generated file is stale (for CI)

Stdlib only. Source of truth is the hand-written Markdown in entries/, jobs/ and playbooks/.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
KINDS = {"artifact", "tool", "source"}
MEDIA = {"visual", "document", "code", "media"}
GOLD = {"high", "medium", "low"}
RELATIONS = {
    "part_of", "same_system", "same_author", "led_to", "contrast", "supersedes", "explains", "explained_by",
    "smaller_sibling", "larger_sibling", "alternative",
}
ENTRY_REQUIRED = ["id", "kind", "medium", "title", "by", "url", "archive_url", "jobs", "context", "verified", "curator"]
JOB_REQUIRED = ["id", "type", "craft", "job", "aliases", "deliverable", "gold", "shelf", "check"]
LIST_KEYS = {"jobs", "context", "relations", "aliases", "context_axes", "shelf", "search_further", "siblings",
             "playbooks", "required_shape", "rejected", "steps", "whole_examples", "contrast"}


def split_list(raw: str) -> list[str]:
    """Split "[a, b (c, d), "e, f"]" on top-level commas."""
    inner = raw.strip()
    if not (inner.startswith("[") and inner.endswith("]")):
        raise ValueError(f"expected [list], got {raw!r}")
    inner = inner[1:-1].strip()
    out, cur, depth, quote = [], "", 0, False
    for ch in inner:
        if ch == '"':
            quote = not quote
        elif ch == "(" and not quote:
            depth += 1
        elif ch == ")" and not quote:
            depth -= 1
        if ch == "," and depth == 0 and not quote:
            out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def parse(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise ValueError(f"{path}: missing front matter")
    meta: dict = {}
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        key, _, val = line.partition(":")
        key, val = key.strip(), val.strip()
        meta[key] = split_list(val) if key in LIST_KEYS else val
    meta["body"] = m.group(2).strip()
    meta["path"] = str(path.relative_to(ROOT))
    return meta


def load() -> tuple[dict, dict, dict]:
    entries = {p.stem: parse(p) for p in sorted((ROOT / "entries").glob("*.md"))}
    jobs = {p.stem: parse(p) for p in sorted((ROOT / "jobs").glob("*.md"))}
    plays = {p.stem: parse(p) for p in sorted((ROOT / "playbooks").glob("*.md"))}
    return entries, jobs, plays


def validate(entries: dict, jobs: dict, plays: dict) -> list[str]:
    errs: list[str] = []
    ids = set(entries) | set(jobs) | set(plays)
    for stem, e in entries.items():
        where = e["path"]
        errs += [f"{where}: missing {k}" for k in ENTRY_REQUIRED if not e.get(k) and k != "date"]
        if e.get("id") != stem:
            errs.append(f"{where}: id {e.get('id')!r} must match filename")
        if e.get("kind") not in KINDS:
            errs.append(f"{where}: kind must be one of {sorted(KINDS)}")
        if e.get("medium") not in MEDIA:
            errs.append(f"{where}: medium must be one of {sorted(MEDIA)}")
        if not e.get("archive_url", "").startswith(("http://web.archive.org/", "https://web.archive.org/")):
            errs.append(f"{where}: archive_url must be an Internet Archive snapshot")
        errs += [f"{where}: job {j} has no card" for j in e.get("jobs", []) if j not in jobs]
        for rel in e.get("relations", []):
            kind, _, target = rel.partition(":")
            if kind not in RELATIONS:
                errs.append(f"{where}: unknown relation {kind!r}")
            if target not in ids:
                errs.append(f"{where}: relation target {target!r} does not exist")
        if e.get("kind") == "artifact" and "**Why it's gold**" not in e["body"]:
            errs.append(f"{where}: an artifact needs a 'Why it's gold' section")
        if e.get("kind") == "artifact" and "**Weakness**" not in e["body"]:
            errs.append(f"{where}: an artifact needs a 'Weakness' section (one honest flaw)")
    for stem, j in jobs.items():
        where = j["path"]
        errs += [f"{where}: missing {k}" for k in JOB_REQUIRED if k not in j]
        if j.get("id") != stem:
            errs.append(f"{where}: id must match filename")
        if j.get("gold") not in GOLD:
            errs.append(f"{where}: gold must be one of {sorted(GOLD)}")
        for ref in j.get("shelf", []) + j.get("search_further", []) + j.get("contrast", []):
            if ref not in entries:
                errs.append(f"{where}: shelf entry {ref!r} does not exist")
            elif stem not in entries[ref].get("jobs", []):
                errs.append(f"{where}: {ref} is on the shelf but not tagged to {stem}")
        tagged = {s for s, e in entries.items() if stem in e.get("jobs", [])}
        listed = set(j.get("shelf", [])) | set(j.get("search_further", [])) | set(j.get("contrast", []))
        errs += [f"{where}: {s} is tagged to this job but missing from its shelf" for s in sorted(tagged - listed)]
        for sib in j.get("siblings", []):
            if sib.partition(":")[2] not in jobs:
                errs.append(f"{where}: sibling {sib!r} has no card")
        errs += [f"{where}: playbook {p} does not exist" for p in j.get("playbooks", []) if p not in plays]
        if not j.get("shelf") and not j.get("required_shape"):
            errs.append(f"{where}: an empty shelf needs a required_shape")
    for stem, p in plays.items():
        errs += [f"{p['path']}: step {s} has no card" for s in p.get("steps", []) if s not in jobs]
        errs += [f"{p['path']}: example {s} does not exist" for s in p.get("whole_examples", []) if s not in entries]
    return errs


def first_line(e: dict) -> str:
    for line in e["body"].splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return e.get("title", "")


def use_when(e: dict) -> str:
    m = re.search(r"\*\*Use when\*\*\s*(.+)", e["body"])
    return m.group(1).strip() if m else ""


def render_llms(entries: dict, jobs: dict, plays: dict) -> str:
    out = [
        "# truecast gold",
        "",
        "> Best-in-class public work, organised by job, for agents to find, compare and hold their work against."
        " Plain text, CC0. Linked works belong to their owners; every entry links the owner's copy and an Internet"
        " Archive snapshot.",
        "",
        "How to use this catalog:",
        "1. Find the job: match the request against the job titles and aliases below (or grep jobs/ for a word)."
        " If the request is several jobs, look in Playbooks first.",
        "2. Check scope: each job lists size siblings (smaller / larger / alternative). Pick the right size before"
        " picking gold; a tweak held to PRD gold gets over-written.",
        "3. Read the job card, then the 2-3 shelf entries whose `context` best matches the brief. Shelf order is"
        " the curator's rank; context fit comes first.",
        "4. Follow `relations` (same_system, contrast, explained_by) before mixing sources from different systems."
        " A job's `contrast` entries are weak or wrong-size examples kept for comparison: never model on them.",
        "5. If the shelf is empty, use the card's required_shape and check, and say that no gold was available.",
        "6. Open the linked original (or the archive snapshot) before claiming what it contains.",
        "",
        "Status: prototype, 2026-11-05. All entries are agent-drafted and unratified.",
        "",
        "## Playbooks",
        "",
    ]
    for p in plays.values():
        out.append(f"- [{p['id']}: {p['title']}]({p['path']}) · aliases: {', '.join(p['aliases'])} · steps: {' → '.join(p['steps'])}")
    out += ["", "## Jobs", ""]
    for j in sorted(jobs.values(), key=lambda j: (j["craft"], j["id"])):
        shelf = ", ".join(j["shelf"]) or "none (use required_shape)"
        sib = f" · siblings: {', '.join(j['siblings'])}" if j.get("siblings") else ""
        con = f" · contrast, do NOT model on: {', '.join(j['contrast'])}" if j.get("contrast") else ""
        far = f" · search further: {', '.join(j['search_further'])}" if j.get("search_further") else ""
        out.append(f"- [{j['id']}: {j['job']}]({j['path']}) · {j['craft']} · gold: {j['gold']} · aliases:"
                   f" {', '.join(j['aliases'])} · shelf: {shelf}{con}{far}{sib}")
    out += ["", "## Entries", ""]
    for e in sorted(entries.values(), key=lambda e: (e["kind"], e["id"])):
        date = f", {e['date']}" if e.get("date") else ""
        uw = f" · use when: {use_when(e)}" if use_when(e) else ""
        out.append(f"- [{e['id']}]({e['path']}): {e['title']} — {e['by']}{date} · {e['kind']}/{e['medium']} ·"
                   f" jobs: {', '.join(e['jobs'])} · context: {', '.join(e['context'])}{uw}")
    out += ["", "## Optional", "", "- [llms-full.txt](llms-full.txt): every card and entry in one file",
            "- [index.jsonl](index.jsonl): the same records as JSON lines", ""]
    return "\n".join(out)


def render_full(entries: dict, jobs: dict, plays: dict) -> str:
    parts = ["# truecast gold — full text", ""]
    for group in (plays, jobs, entries):
        for r in group.values():
            parts += [f"<!-- {r['path']} -->", (ROOT / r["path"]).read_text(encoding="utf-8").strip(), ""]
    return "\n".join(parts)


def render_index(entries: dict, jobs: dict, plays: dict) -> str:
    rows = []
    for typ, group in (("playbook", plays), ("job", jobs), ("entry", entries)):
        for r in group.values():
            rows.append(json.dumps({"record": typ, **{k: v for k, v in r.items() if k != "body"},
                                    "text": r["body"]}, ensure_ascii=False, sort_keys=True))
    return "\n".join(rows) + "\n"


def main() -> int:
    check = "--check" in sys.argv
    entries, jobs, plays = load()
    errs = validate(entries, jobs, plays)
    if errs:
        print("\n".join(f"error: {e}" for e in errs))
        return 1
    outputs = {
        "llms.txt": render_llms(entries, jobs, plays),
        "llms-full.txt": render_full(entries, jobs, plays),
        "index.jsonl": render_index(entries, jobs, plays),
    }
    stale = [name for name, body in outputs.items()
             if not (ROOT / name).exists() or (ROOT / name).read_text(encoding="utf-8") != body]
    if check:
        if stale:
            print(f"stale: {', '.join(stale)} (run python3 gold/build.py)")
            return 1
        print(f"ok: {len(plays)} playbooks, {len(jobs)} jobs, {len(entries)} entries; generated files current")
        return 0
    for name, body in outputs.items():
        (ROOT / name).write_text(body, encoding="utf-8")
    print(f"built: {len(plays)} playbooks, {len(jobs)} jobs, {len(entries)} entries")
    return 0


if __name__ == "__main__":
    sys.exit(main())
