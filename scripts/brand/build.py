#!/usr/bin/env python3
"""Build truecast's identity assets into site/brand/ from the repo's real data.

    python3 scripts/brand/build.py            # everything
    python3 scripts/brand/build.py --no-png   # SVG / CSS / JSON only (no browser needed)

Needs: fontTools + brotli (fonts, outlines), Pillow (favicon.ico), Playwright + Chromium (PNG renders).
Source fonts are downloaded once from google/fonts (both OFL) into scripts/brand/.fonts/ (git-ignored).

Everything the "core" device draws comes from personas/*/core: one band per file, height = words.
Re-run this after any persona's playbook changes and commit the result.
"""
from __future__ import annotations

import json
import shutil
import sys
import urllib.request
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "site" / "brand"
SRC = Path(__file__).resolve().parent / ".fonts"
GF = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
SOURCES = {
    "schibsted": ("schibstedgrotesk/SchibstedGrotesk%5Bwght%5D.ttf", "schibstedgrotesk/OFL.txt"),
    "martian": ("martianmono/MartianMono%5Bwdth,wght%5D.ttf", "martianmono/OFL.txt"),
}

# ---- the palette (tokens.css is the source of truth for the site; these feed the renders) ----
BLUE = "#1F36FF"        # true blue: the brand
BLUE_LIGHT = "#8C9BFF"  # true blue on dark grounds
INK = "#0B0D1A"
PAPER = "#FFFFFF"
INK_TEXT_DARK = "#F3F4FA"

# ---- the mark: 14 units tall (2 + 1 + 8 + 1 + 2), placed on a 16-unit canvas --------------------------------------------------------------
# A T. The crossbar is the agent file Claude Code sees (the surface); the stem is the playbook under
# it, cut where skills end and knowledge begins: 8:2 on the grid (all twelve playbooks: 81:19).
MARK = [(1, 1, 14, 2), (5, 4, 6, 8), (5, 13, 6, 2)]          # free-standing; occupies 1..15
TILE_MARK = [(3, 3, 10, 2), (6, 6, 4, 5), (6, 12, 4, 1)]     # inside a 16-unit tile, 3-unit margin

# ---- the wordmark ------------------------------------------------------------------------------
WORDMARK_WGHT = 800
TRACK = -28  # /1000 em
# optical spacing on top of the font's own metrics (/1000 em), checked at 300px; see BRAND.md
KERN = {"tr": -6, "ru": -8, "ue": -18, "ec": 0, "ca": 3, "as": 3, "st": 12}

ORDER = ["software-architect", "software-engineer", "qa", "security-engineer", "infrastructure",
         "product-manager", "product-researcher", "ui-ux-designer", "brand-designer",
         "product-marketer", "sales", "vc-seed"]


# =================================================================================== fonts
def fetch_sources() -> None:
    SRC.mkdir(parents=True, exist_ok=True)
    for key, (font, lic) in SOURCES.items():
        for rel, name in ((font, f"{key}.ttf"), (lic, f"{key}-OFL.txt")):
            dest = SRC / name
            if not dest.exists():
                urllib.request.urlretrieve(GF + rel, dest)


def build_webfonts() -> None:
    (OUT / "fonts").mkdir(parents=True, exist_ok=True)
    unicodes = (list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + list(range(0x2010, 0x2028))
                + list(range(0x2030, 0x203B)) + list(range(0x2190, 0x21A0)) + [0x20AC, 0x2122, 0x2212])
    jobs = [("schibsted", "schibsted-grotesk.woff2", {}),
            ("martian", "martian-mono.woff2", {"wdth": 87.5})]  # pin width; keep the weight axis
    for key, out, pin in jobs:
        f = TTFont(SRC / f"{key}.ttf")
        opts = Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        sub = Subsetter(opts)
        sub.populate(unicodes=unicodes)
        sub.subset(f)                      # subset first: instancing first breaks Martian's GSUB
        if pin:
            f = instantiateVariableFont(f, pin)
        f.flavor = "woff2"
        f.save(OUT / "fonts" / out)
        shutil.copy(SRC / f"{key}-OFL.txt", OUT / "fonts" / f"{out.split('.')[0]}-OFL.txt")


_fonts: dict = {}


def font(key: str, wght: float) -> TTFont:
    if (key, wght) not in _fonts:
        _fonts[(key, wght)] = instantiateVariableFont(TTFont(SRC / f"{key}.ttf"),
                                                      {"wght": wght} | ({"wdth": 87.5} if key == "martian" else {}))
    return _fonts[(key, wght)]


def outline(text: str, size: float, x: float = 0, y: float = 0, key: str = "schibsted",
            wght: float = WORDMARK_WGHT, track: float = 0, kern: dict | None = None):
    """Text -> (svg path data, advance, ink bounds (x0, y0, x1, y1)). y is the baseline."""
    f = font(key, wght)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    s = size / upm
    d, cx = [], x
    bx0 = by0 = float("inf")
    bx1 = by1 = float("-inf")
    for i, ch in enumerate(text):
        g = gs[cmap[ord(ch)]]
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
        g.draw(TransformPen(pen, (s, 0, 0, -s, cx, y)))
        d.append(pen.getCommands())
        bp = BoundsPen(gs)
        g.draw(bp)
        if bp.bounds:
            a, b, c, e = bp.bounds
            bx0, bx1 = min(bx0, cx + a * s), max(bx1, cx + c * s)
            by0, by1 = min(by0, y - e * s), max(by1, y - b * s)
        adv = g.width * s + track * size / 1000
        if kern and i + 1 < len(text):
            adv += kern.get(text[i:i + 2], 0) * size / 1000
        cx += adv
    return " ".join(p for p in d if p), cx - x, (bx0, by0, bx1, by1)


# =================================================================================== data
def words(p: Path) -> int:
    return len(p.read_text(encoding="utf-8").split())  # same count as `wc -w`


def playbooks() -> dict:
    personas = []
    names = sorted(p.name for p in (ROOT / "personas").iterdir() if (p / "core").is_dir())
    names = [n for n in ORDER if n in names] + [n for n in names if n not in ORDER]
    for n in names:
        core = ROOT / "personas" / n / "core"
        files = [core / "agent.md"] + sorted(core.glob("skills/*/SKILL.md")) + sorted(
            p for p in core.glob("knowledge/*") if p.is_file())
        rows = [{"path": str(f.relative_to(core)), "words": words(f)} for f in files if f.exists()]
        personas.append({"name": n, "files": len(rows), "words": sum(r["words"] for r in rows), "core": rows})
    hand = ROOT / "internal" / "proof" / "handwritten-agent.md"
    return {
        "about": "One entry per teammate: every file in personas/<name>/core, in reading order "
                 "(agent.md, skills, knowledge), with its word count (wc -w). Generated by scripts/brand/build.py.",
        "personas": personas,
        "handwritten": {"path": "internal/proof/handwritten-agent.md", "words": words(hand)} if hand.exists() else None,
    }


# =================================================================================== drawing
def rects(spec, unit: float, x: float, y: float, fill: str, grid_origin: float = 0) -> str:
    return "".join(
        f'<rect x="{x + (a - grid_origin) * unit:g}" y="{y + (b - grid_origin) * unit:g}" '
        f'width="{w * unit:g}" height="{h * unit:g}" fill="{fill}"/>' for a, b, w, h in spec)


def svg(w: float, h: float, body: str, title: str, extra: str = "") -> str:
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
            f'role="img" aria-label="{title}"{extra}><title>{title}</title>{body}</svg>\n')


def wordmark(size: float, x: float, baseline: float, fill: str):
    d, adv, bounds = outline("truecast", size, x, baseline, track=TRACK, kern=KERN)
    return f'<path d="{d}" fill="{fill}"/>', adv, bounds


def lockup(size: float, x: float, baseline: float, mark_fill: str, word_fill: str):
    """Mark + wordmark. The mark stands as tall as the wordmark's t (ascender to baseline);
    the gap is 4 mark units. Returns (svg body, total width, top y)."""
    _, _, (bx0, by0, bx1, by1) = outline("truecast", size, 0, 0, track=TRACK, kern=KERN)
    t_top = -by0                               # height of the t above the baseline
    unit = t_top / 14                          # the mark's 14 drawn units span that height
    mark = rects(MARK, unit, x, baseline - t_top, mark_fill, grid_origin=1)
    gap = 4 * unit
    wx = x + 14 * unit + gap - bx0
    body, adv, (wx0, _, wx1, _) = wordmark(size, wx, baseline, word_fill)
    return mark + body, (wx1 - x), baseline - t_top


def core_column(rows, x, top, width, wpp, gap, fill, min_h=1.0, clip_bottom=None, data=True):
    """One teammate's playbook hanging from a surface at `top`: one band per file, words/wpp tall."""
    out, y = [], top
    for r in rows:
        h = max(r["words"] / wpp, min_h)
        if clip_bottom is not None and y >= clip_bottom:
            break
        if clip_bottom is not None:
            h = min(h, clip_bottom - y)
        attrs = f' data-path="{r["path"]}" data-words="{r["words"]}"' if data else ""
        out.append(f'<rect x="{x:g}" y="{y:.2f}" width="{width:g}" height="{h:.2f}" fill="{fill}"{attrs}/>')
        y += h + gap
    return "".join(out), y


# =================================================================================== assets
def write(name: str, text: str) -> None:
    p = OUT / name
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def build_marks() -> None:
    write("mark.svg", svg(14, 14, rects(MARK, 1, 0, 0, "currentColor", grid_origin=1), "truecast", ' color="#1F36FF"'))
    tile = f'<rect width="16" height="16" rx="3.5" fill="{BLUE}"/>' + rects(TILE_MARK, 1, 0, 0, PAPER)
    write("favicon.svg", svg(16, 16, tile, "truecast"))
    # wordmark on its own, tight box
    size = 100
    _, adv, (x0, y0, x1, y1) = outline("truecast", size, 0, 0, track=TRACK, kern=KERN)
    body, _, _ = wordmark(size, -x0, -y0, "currentColor")
    write("wordmark.svg", svg(round(x1 - x0, 2), round(y1 - y0, 2), body, "truecast", ' color="#0B0D1A"'))
    # lockups: tight to the ink, height = t ascender + round overshoot
    for name, mf, wf, extra in (("logo.svg", BLUE, INK, ""), ("logo-dark.svg", BLUE_LIGHT, INK_TEXT_DARK, ""),
                                ("logo-on-blue.svg", PAPER, PAPER, ""),
                                ("logo-mono.svg", "currentColor", "currentColor", ' color="#0B0D1A"')):
        _, _, (_, ty0, _, ty1) = outline("truecast", size, 0, 0, track=TRACK, kern=KERN)
        body, w, top = lockup(size, 0, -ty0, mf, wf)
        write(name, svg(round(w, 2), round(ty1 - ty0, 2), body, "truecast", extra))


def page(html_body: str, w: int, h: int, bg: str = "transparent", extra_css: str = "") -> str:
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:"Schibsted Grotesk";src:url("{(OUT/'fonts/schibsted-grotesk.woff2').as_uri()}") format("woff2");font-weight:400 900}}
@font-face{{font-family:"Martian Mono";src:url("{(OUT/'fonts/martian-mono.woff2').as_uri()}") format("woff2");font-weight:100 800}}
html,body{{margin:0;width:{w}px;height:{h}px;background:{bg};overflow:hidden}}{extra_css}</style>{html_body}"""


def social_card(data, w: int, h: int) -> str:
    """The social card: true blue, the H1, and every teammate's playbook drawn to one scale,
    hanging from the surface and running off the bottom edge."""
    pad = 72 * w / 1200
    logo, lw, _ = lockup(56, 0, 56, PAPER, PAPER)
    _, _, (_, y0, _, y1) = outline("truecast", 56, 0, 0, track=TRACK, kern=KERN)
    logo_svg = f'<svg width="{lw:.1f}" height="{y1 - y0 + 2:.1f}" viewBox="0 {56 + y0:.2f} {lw:.2f} {y1 - y0 + 2:.2f}">{logo}</svg>'
    ps = data["personas"]
    col_w, step = 18, 30
    cores_w = step * (len(ps) - 1) + col_w
    surface_y = pad + 14
    wpp = max(p["words"] + 2 * p["files"] for p in ps) / (h - surface_y + 40)  # tallest runs off the edge
    cores = "".join(core_column(p["core"], i * step, 6, col_w, wpp, 2, PAPER, clip_bottom=h, data=False)[0]
                    for i, p in enumerate(ps))
    cx = w - pad - cores_w - 24   # the surface line's right end sits on the margin
    return page(f"""
<div style="position:absolute;inset:0;background:{BLUE}"></div>
<div style="position:absolute;left:{pad}px;top:{pad}px">{logo_svg}</div>
<h1 style="position:absolute;left:{pad}px;bottom:{pad + 64}px;width:{cx - pad - 56}px;margin:0;color:#fff;
  font:800 {64 * w / 1200:.0f}px/1.02 'Schibsted Grotesk';letter-spacing:-0.03em;text-wrap:balance">The expert teammates Claude&nbsp;Code doesn’t ship&nbsp;with.</h1>
<p style="position:absolute;left:{pad}px;bottom:{pad - 6}px;margin:0;color:rgba(255,255,255,.82);font:500 26px/1.4 'Martian Mono'">
  truecast.dev</p>
<svg style="position:absolute;left:{cx - 24}px;top:{surface_y}px" width="{cores_w + 48}" height="{h}" viewBox="-24 0 {cores_w + 48} {h}">
  <rect x="-24" y="0" width="{cores_w + 48}" height="4" fill="#fff"/>{cores}</svg>
<p style="position:absolute;right:{pad}px;top:{surface_y - 40}px;margin:0;color:rgba(255,255,255,.82);font:500 20px 'Martian Mono'">
  {len(ps)} playbooks · one band per file</p>
""", w, h)


def readme_header(data, dark: bool) -> str:
    """Lockup + every core, transparent, for GitHub light/dark. No tagline: the README's first line says it."""
    w, h = 1680, 300            # shown at 840×150
    mf, wf, cf = (BLUE_LIGHT, INK_TEXT_DARK, BLUE_LIGHT) if dark else (BLUE, INK, BLUE)
    logo, lw, _ = lockup(132, 0, 132, mf, wf)
    _, _, (_, y0, _, y1) = outline("truecast", 132, 0, 0, track=TRACK, kern=KERN)
    lh = y1 - y0
    ps = data["personas"]
    col_w, step, top, bottom = 28, 46, 40, 24
    cores_w = step * (len(ps) - 1) + col_w
    # fit every core inside the header: in an open layout the device is never cropped
    wpp = max(p["words"] / (h - top - bottom - 9 - 3 * p["files"]) for p in ps)
    cores = "".join(core_column(p["core"], i * step, 9, col_w, wpp, 3, cf, data=False)[0]
                    for i, p in enumerate(ps))
    cx = w - cores_w - 40
    return page(f"""
<svg style="position:absolute;left:24px;top:{top + 6}px" width="{lw:.1f}" height="{lh + 4:.1f}" viewBox="0 {132 + y0:.2f} {lw:.2f} {lh + 4:.2f}">{logo}</svg>
<svg style="position:absolute;left:{cx - 20}px;top:{top}px" width="{cores_w + 40}" height="{h - top}" viewBox="-20 0 {cores_w + 40} {h - top}">
  <rect x="-20" y="0" width="{cores_w + 40}" height="6" fill="{cf}"/>{cores}</svg>
""", w, h, extra_css="body{position:relative}")


def build_device(data) -> None:
    """The core device as drop-in SVGs: every teammate at one shared scale, plus the hand-written
    comparison. Each band carries data-path / data-words for tooltips; the page labels in HTML."""
    WPP = 40  # words per px at 1x; keep one scale per view: comparisons are only true at the same scale
    ps = data["personas"]
    col_w, step, gap = 24, 40, 2
    tallest = max(p["words"] / WPP + gap * p["files"] for p in ps)
    body = f'<rect x="0" y="0" width="{step * (len(ps) - 1) + col_w}" height="3" fill="currentColor"/>'
    for i, p in enumerate(ps):
        col, _ = core_column(p["core"], i * step, 6, col_w, WPP, gap, "currentColor")
        body += f'<g data-persona="{p["name"]}" data-words="{p["words"]}"><title>{p["name"]}: {p["files"]} files, {p["words"]:,} words</title>{col}</g>'
    write("cores.svg", svg(step * (len(ps) - 1) + col_w, round(tallest + 8), body,
                           f"{len(ps)} truecast playbooks drawn to one scale: one band per file, height by word count",
                           ' color="#1F36FF"'))
    for p in ps:
        col, end = core_column(p["core"], 0, 6, col_w, WPP, gap, "currentColor")
        write(f"cores/{p['name']}.svg",
              svg(col_w, round(end + 2), f'<rect width="{col_w}" height="3" fill="currentColor"/>{col}',
                  f"{p['name']}: {p['files']} files, {p['words']:,} words, one band per file", ' color="#1F36FF"'))
    hw = data["handwritten"]
    se = next((p for p in ps if p["name"] == "security-engineer"), None)
    if hw:
        col, end = core_column([{"path": hw["path"], "words": hw["words"]}], 0, 6, col_w, WPP, gap, "currentColor")
        write("cores/handwritten.svg", svg(col_w, round(end + 2), f'<rect width="{col_w}" height="3" fill="currentColor"/>{col}',
                                           f"A hand-written agent: 1 file, {hw['words']} words", ' color="#1F36FF"'))
    if hw and se:
        a, _ = core_column([{"path": hw["path"], "words": hw["words"]}], 0, 6, col_w, WPP, gap, "currentColor")
        b, end = core_column(se["core"], 2 * step, 6, col_w, WPP, gap, "currentColor")
        body = (f'<rect width="{col_w}" height="3" fill="currentColor"/><g data-persona="handwritten" data-words="{hw["words"]}">{a}</g>'
                f'<rect x="{2 * step}" width="{col_w}" height="3" fill="currentColor"/><g data-persona="security-engineer" data-words="{se["words"]}">{b}</g>')
        write("depth-compare.svg",
              svg(2 * step + col_w, round(end + 2), body,
                  f"Same scale: a {hw['words']}-word hand-written agent next to security-engineer's playbook, "
                  f"{se['files']} files and {se['words']:,} words", ' color="#1F36FF"'))


# =================================================================================== rendering
def render(jobs) -> None:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        for html, out, w, h, scale, transparent in jobs:
            tmp = Path(__file__).resolve().parent / ".render.html"
            tmp.write_text(html, encoding="utf-8")
            pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            pg.goto(tmp.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.wait_for_timeout(150)
            pg.screenshot(path=str(out), omit_background=transparent)
            pg.close()
            tmp.unlink()
        b.close()


def icon_html(px: int, full_bleed: bool = False, maskable: bool = False) -> str:
    if maskable:   # mark inside the 80% safe circle
        inner = f'<rect width="16" height="16" fill="{BLUE}"/>' + rects(TILE_MARK, 0.75, 2, 2, PAPER)
    elif full_bleed:
        inner = f'<rect width="16" height="16" fill="{BLUE}"/>' + rects(TILE_MARK, 1, 0, 0, PAPER)
    else:
        inner = (OUT / "favicon.svg").read_text().split("</title>", 1)[1].rsplit("</svg>", 1)[0]
    return page(f'<svg width="{px}" height="{px}" viewBox="0 0 16 16" shape-rendering="{"crispEdges" if px <= 48 else "geometricPrecision"}">{inner}</svg>', px, px)


def build_pngs(data) -> None:
    jobs = []
    for px in (16, 32, 48):
        jobs.append((icon_html(px), OUT / f".fav{px}.png", px, px, 1, True))
    jobs += [
        (icon_html(180, full_bleed=True), OUT / "apple-touch-icon.png", 180, 180, 1, False),
        (icon_html(192), OUT / "icon-192.png", 192, 192, 1, True),
        (icon_html(512), OUT / "icon-512.png", 512, 512, 1, True),
        (icon_html(512, maskable=True), OUT / "icon-maskable-512.png", 512, 512, 1, False),
        (social_card(data, 1200, 630), OUT / "og.png", 1200, 630, 1, False),
        (social_card(data, 1280, 640), OUT / "github-social.png", 1280, 640, 1, False),
        (readme_header(data, False), OUT / "readme-header-light.png", 1680, 300, 1, True),
        (readme_header(data, True), OUT / "readme-header-dark.png", 1680, 300, 1, True),
    ]
    for name in ("logo", "logo-dark", "logo-on-blue"):
        s = (OUT / f"{name}.svg").read_text()
        vw, vh = (float(v) for v in s.split('viewBox="0 0 ')[1].split('"')[0].split())
        w, h = 480, round(480 * vh / vw)
        jobs.append((page(s.replace(f'width="{vw:g}" height="{vh:g}"', f'width="{w}" height="{h}"', 1), w, h),
                     OUT / f"{name}@2x.png", w, h, 2, True))
    render(jobs)
    from PIL import Image
    imgs = [Image.open(OUT / f".fav{px}.png").convert("RGBA") for px in (16, 32, 48)]
    imgs[2].save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[:2])
    for px in (16, 32, 48):
        (OUT / f".fav{px}.png").unlink()
    shutil.copy(OUT / "favicon.ico", OUT.parent / "favicon.ico")  # crawlers and old browsers ask for /favicon.ico


def build_manifest() -> None:
    write("site.webmanifest", json.dumps({
        "name": "truecast", "short_name": "truecast",
        "icons": [{"src": "/brand/icon-192.png", "sizes": "192x192", "type": "image/png"},
                  {"src": "/brand/icon-512.png", "sizes": "512x512", "type": "image/png"},
                  {"src": "/brand/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}],
        "theme_color": BLUE, "background_color": PAPER, "display": "browser"}, indent=2) + "\n")



def build_specimen(data) -> None:
    """site/brand/index.html: the system on one page, built on tokens.css. ?theme=dark|light forces a theme."""
    inline = lambda f: (OUT / f).read_text().replace(' width="', ' data-w="', 1).replace(' height="', ' data-h="', 1)
    ps = data["personas"]
    se = next(p for p in ps if p["name"] == "security-engineer")
    hw = data["handwritten"]
    sw = ["tc-blue", "tc-blue-light", "tc-ink", "tc-paper", "tc-grey-600", "tc-grey-300"]
    names = "".join(f'<li><span class="n">{p["name"]}</span><span class="w">{p["files"]} · {p["words"]:,}</span></li>' for p in ps)
    write("index.html", f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>truecast brand</title>
<meta name="description" content="The truecast identity: the idea, the mark, the core device, colour, type and voice.">
<meta name="robots" content="noindex">
<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml"><link rel="icon" href="/brand/favicon.ico" sizes="32x32">
<link rel="preload" href="fonts/schibsted-grotesk.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="tokens.css">
<script>const t=new URLSearchParams(location.search).get("theme");if(t)document.documentElement.dataset.theme=t;</script>
<style>
*{{box-sizing:border-box}}
body{{margin:0;background:var(--color-bg);color:var(--color-text);font:var(--weight-text) var(--text-base)/var(--leading-body) var(--font-sans)}}
main{{max-width:var(--page-max);margin:0 auto;padding:var(--space-8) var(--gutter) var(--space-10)}}
h1{{font-size:var(--text-display);font-weight:var(--weight-display);line-height:var(--leading-display);letter-spacing:var(--tracking-display);margin:var(--space-6) 0 var(--space-5);max-width:14ch;text-wrap:balance}}
h2{{font-size:var(--text-2xl);font-weight:var(--weight-display);line-height:var(--leading-heading);letter-spacing:var(--tracking-heading);margin:0 0 var(--space-4)}}
p{{max-width:var(--measure);margin:0 0 var(--space-4)}} .lead{{font-size:var(--text-lg);color:var(--color-text-2)}}
code,.mono{{font-family:var(--font-mono);font-size:var(--mono-scale)}}
.label{{font:500 var(--text-xs)/1.4 var(--font-mono);color:var(--color-text-3);margin:0 0 var(--space-3)}}
section{{border-top:var(--rule-surface) solid var(--color-text);padding:var(--space-6) 0 var(--space-8);display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--space-7)}}
@media (max-width:52rem){{section{{grid-template-columns:minmax(0,1fr);gap:var(--space-5)}}}}
a{{color:var(--color-accent);text-underline-offset:.18em}}
.logo{{display:block;height:48px;width:auto;color:var(--color-text)}}
.mark-row{{display:flex;flex-wrap:wrap;gap:var(--space-5);align-items:flex-end}}
.plate{{display:flex;align-items:center;justify-content:center;padding:var(--space-6);border-radius:var(--radius-2)}}
.swatches{{display:grid;grid-template-columns:repeat(auto-fill,minmax(9rem,1fr));gap:var(--space-3)}}
.sw{{border:var(--rule-hair) solid var(--color-line);border-radius:var(--radius-2);overflow:hidden;font:500 var(--text-xs)/1.4 var(--font-mono)}}
.sw i{{display:block;height:4.5rem}} .sw span{{display:block;padding:var(--space-2) var(--space-3)}}
.cores,.compare{{color:var(--color-accent)}} .cores svg,.compare svg{{color:inherit;display:block;height:auto;max-width:100%}}
pre{{overflow-x:auto}} .plate img{{max-width:100%;height:auto}}
.cast{{list-style:none;padding:0;margin:var(--space-5) 0 0;columns:2 18rem;gap:var(--space-6);font-size:var(--text-sm)}}
.cast li{{display:flex;justify-content:space-between;gap:var(--space-3);border-bottom:var(--rule-hair) solid var(--color-line);padding:var(--space-1) 0;break-inside:avoid}}
.cast .n{{font-family:var(--font-mono);font-size:var(--mono-scale);white-space:nowrap}} .cast .w{{color:var(--color-text-3);white-space:nowrap;font-variant-numeric:tabular-nums}}
.compare{{display:flex;gap:var(--space-7);align-items:flex-start;color:var(--color-accent)}}
.compare figure{{margin:0;width:12rem}} .compare svg{{width:var(--core-width)}} .compare figcaption{{font:500 var(--text-xs)/1.4 var(--font-mono);color:var(--color-text-2);margin-bottom:var(--space-2)}}
.type-row{{border-bottom:var(--rule-hair) solid var(--color-line);padding:var(--space-4) 0}}
.verdicts{{display:flex;flex-wrap:wrap;gap:var(--space-3);font:600 var(--text-sm)/1 var(--font-mono)}}
.verdicts span{{padding:var(--space-2) var(--space-3);border-radius:var(--radius-1)}}
.btn{{display:inline-flex;align-items:center;gap:var(--space-2);background:var(--color-fill);color:var(--color-on-fill);border:0;border-radius:var(--radius-2);padding:var(--space-3) var(--space-4);font:var(--weight-strong) var(--text-sm)/1 var(--font-sans);text-decoration:none}}
.pill{{display:inline-flex;align-items:center;gap:var(--space-3);background:var(--color-code-bg);border:var(--rule-hair) solid var(--color-line);border-radius:var(--radius-2);padding:var(--space-3) var(--space-4);font-family:var(--font-mono);font-size:var(--text-sm)}}
img.touch{{max-width:100%;height:auto;border:var(--rule-hair) solid var(--color-line);border-radius:var(--radius-2)}}
</style>
</head>
<body>
<main>
  <img class="logo" src="logo.svg" alt="truecast" id="logo">
  <h1>Depth you can see behind every name.</h1>
  <p class="lead">The truecast identity. A teammate is the name you call and the playbook under it, and the brand shows both: the agent file at the surface, the core below, every band a real file.</p>

  <section><div><p class="label">01 · the mark</p><h2>A T, cut where the playbook is.</h2>
    <p>The crossbar is the agent file Claude Code sees, <code>~/.claude/agents/&lt;name&gt;.md</code>. The stem is the playbook under it in <code>~/.truecast</code>, cut where skills end and knowledge begins: 8:2 on a 14-unit grid (the favicon re-draws it 5:1 for 16px). Across all {len(ps)} playbooks the real split is 81:19.</p>
    <p>The wordmark is Schibsted Grotesk ExtraBold, outlined and re-spaced by eye. The mark stands exactly as tall as its t.</p></div>
    <div class="mark-row">
      <div class="plate" style="background:var(--tc-paper);border:1px solid var(--color-line)"><img src="logo.svg" alt="truecast logo on white" height="44"></div>
      <div class="plate" style="background:var(--tc-ink)"><img src="logo-dark.svg" alt="truecast logo on ink" height="44"></div>
      <div class="plate" style="background:var(--tc-blue)"><img src="logo-on-blue.svg" alt="truecast logo on true blue" height="44"></div>
      <div><p class="label">favicon 16 · 32 · 64</p><img src="favicon.svg" width="16" alt=""> <img src="favicon.svg" width="32" alt=""> <img src="favicon.svg" width="64" alt=""></div>
    </div></section>

  <section><div><p class="label">02 · the core</p><h2>Every playbook, drawn to one scale.</h2>
    <p>The signature device. Each teammate hangs from a surface line; each band is one real file in its <code>core/</code>, as tall as its word count. It's generated from the repo, so it can't lie, and it changes when a playbook does.</p>
    <p>Comparisons only at one scale. Never decorative, never invented, never cropped inside a layout (it may run off a frame's edge).</p></div>
    <div><div class="cores">{inline("cores.svg")}</div><p class="label" style="margin:var(--space-5) 0 0">teammate · files · words</p><ul class="cast" style="margin-top:var(--space-2)">{names}</ul></div></section>

  <section><div><p class="label">03 · the core, as proof</p><h2>{hw['words']} words against {se['words']:,}.</h2>
    <p>The same device puts the reader's alternative next to ours: the {hw['words']}-word hand-written agent from the proof run beside <code>security-engineer</code>'s {se['files']} files, same scale.</p></div>
    <div class="compare"><figure><figcaption>hand-written agent<br>1 file · {hw['words']} words</figcaption>{inline("cores/handwritten.svg")}</figure>
    <figure><figcaption>security-engineer<br>{se['files']} files · {se['words']:,} words</figcaption>{inline("cores/security-engineer.svg")}</figure></div></section>

  <section><div><p class="label">04 · colour</p><h2>True blue, and nothing warm.</h2>
    <p>True blue means genuine, and in this category it's unclaimed. The platform's own identity is warm cream and terracotta; we stay cool so nobody mistakes a third-party tool for a first-party one. The only other colours are verdicts, and only on real verdicts.</p></div>
    <div><div class="swatches">{"".join(f'<div class="sw"><i style="background:var(--{c})"></i><span>--{c}</span></div>' for c in sw)}</div>
    <p class="label" style="margin-top:var(--space-5)">verdicts</p>
    <div class="verdicts"><span style="color:var(--color-go);background:var(--color-go-wash)">GO</span><span style="color:var(--color-conditional);background:var(--color-conditional-wash)">CONDITIONAL</span><span style="color:var(--color-no-go);background:var(--color-no-go-wash)">NO-GO</span></div>
    <p class="label" style="margin-top:var(--space-5)">actions</p>
    <a class="btn" href="#">Copy the install command</a> <span class="pill">claude plugin install truecast --marketplace wastedcode/truecast</span></div></section>

  <section><div><p class="label">05 · type</p><h2>A newsroom grotesk and a sturdy mono.</h2>
    <p>Schibsted Grotesk comes from a media group's print heritage: it reports, it doesn't pitch. Martian Mono carries everything you'd type or read in a terminal. Both are OFL and self-hosted.</p></div>
    <div><div class="type-row"><p class="label">display · 800 · −0.035em</p><div style="font-size:var(--text-display);font-weight:800;line-height:1;letter-spacing:var(--tracking-display)">Same bug. Two agents.</div></div>
    <div class="type-row"><p class="label">h2 · 800 · −0.025em</p><div style="font-size:var(--text-2xl);font-weight:800;line-height:1.08;letter-spacing:var(--tracking-heading)">Take the improvements. Keep your brief.</div></div>
    <div class="type-row"><p class="label">body · 400 · 17/1.55</p><p style="margin:0">One file in your repo, <code>.truecast/agents/security-engineer/instance/mandate.md</code>: what the project is, what matters, where the bar is. It reads it first. Updates never touch it.</p></div>
    <div class="type-row"><p class="label">mono · Martian 87.5 width</p><pre style="margin:0;font:400 var(--text-sm)/1.6 var(--font-mono)">plan: install security-engineer@1.2.2
  agent    ~/.claude/agents/security-engineer.md
  nothing has been written yet.</pre></div></div></section>

  <section><div><p class="label">06 · touchpoints</p><h2>One idea everywhere it's met.</h2>
    <p>Social card (1200×630) and the README header for GitHub light and dark. All of them are generated by <code>scripts/brand/build.py</code>.</p></div>
    <div><img class="touch" src="og.png" alt="truecast social card: the H1 beside twelve playbooks drawn to scale" width="1200" height="630">
    <p class="label" style="margin-top:var(--space-5)">README header</p>
    <picture><source media="(prefers-color-scheme: dark)" srcset="readme-header-dark.png"><img class="touch" id="rh" src="readme-header-light.png" alt="truecast" width="840"></picture></div></section>
</main>
<script>
if(document.documentElement.dataset.theme==="dark"||(!document.documentElement.dataset.theme&&matchMedia("(prefers-color-scheme: dark)").matches)){{document.getElementById("logo").src="logo-dark.svg";document.getElementById("rh").src="readme-header-dark.png";}}
</script>
</body>
</html>
""")

def main() -> None:
    fetch_sources()
    build_webfonts()
    data = playbooks()
    write("cores.json", json.dumps(data, indent=1) + "\n")
    build_marks()
    build_device(data)
    build_manifest()
    build_specimen(data)
    if "--no-png" not in sys.argv:
        build_pngs(data)
    print("built", sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file()))


if __name__ == "__main__":
    main()
