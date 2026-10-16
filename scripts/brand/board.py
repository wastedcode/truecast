# Renders the touchpoint board (internal/brand/board-*.png, working evidence; internal/ is not published) from the built assets. Run after build.py.
import base64, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[2]; B = ROOT/"site/brand"
FAV = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None   # optional dir of real favicons for the tab lineup
u = lambda p: (B/p).as_uri()
fonts = f"""@font-face{{font-family:S;src:url({u('fonts/schibsted-grotesk.woff2')});font-weight:400 900}}
@font-face{{font-family:M;src:url({u('fonts/martian-mono.woff2')});font-weight:100 800}}"""
others = sorted(FAV.glob("*.png")) if FAV else []
def tabs(dark):
    bg, tab, fg, act = ("#1f1f22", "#2b2b30", "#c9c9cf", "#3a3a40") if dark else ("#dee1e6", "#eceef1", "#3c4043", "#ffffff")
    items = [(o.as_uri(), o.stem.split('.')[0]) for o in others[:5]] + [(u("favicon.svg"), "truecast")] + [(o.as_uri(), o.stem.split('.')[0]) for o in others[5:]]
    return f'<div style="display:flex;gap:2px;background:{bg};padding:8px 8px 0">' + "".join(
        f'<div style="display:flex;align-items:center;gap:8px;width:118px;height:34px;padding:0 10px;border-radius:8px 8px 0 0;background:{act if n=="truecast" else tab};color:{fg};font:12px system-ui;white-space:nowrap;overflow:hidden">'
        f'<img src="{s}" width="16" height="16" style="image-rendering:auto">{n}</div>' for s, n in items) + "</div>"
plan = """<b>plan:</b> install <span class=n>security-engineer</span>@1.2.2   (from your local marketplace copy)
  tools granted to <span class=n>@security-engineer</span>: Read, Grep, Glob, Bash, WebSearch, WebFetch
  writes:
    <i>craft  </i>  ~/.truecast/personas/security-engineer/1.2.2/core/
    <i>record </i>  ~/.truecast/personas/security-engineer/meta.json
    <i>pointer</i>  ~/.truecast/personas/security-engineer/current → 1.2.2
    <i>agent  </i>  ~/.claude/agents/security-engineer.md
  nothing has been written yet."""
def term(dark):
    bg, fg, blue, dim = ("#11131a", "#d6d8e0", "#5c8dff", "#868a99") if dark else ("#fbfbfd", "#1d1f27", "#1f43d6", "#6c7080")
    return f'<pre style="margin:0;padding:18px 20px;background:{bg};color:{fg};font:13px/1.55 ui-monospace,Menlo,monospace;border-radius:8px"><style>.n{{color:{blue};font-weight:700}} i{{font-style:normal;color:{dim}}}</style>{plan}</pre>'
gh = lambda dark: f'''<div style="background:{'#0d1117' if dark else '#ffffff'};border:1px solid {'#30363d' if dark else '#d0d7de'};border-radius:6px;padding:32px;width:840px">
<img src="{u('readme-header-' + ('dark' if dark else 'light') + '.png')}" width="840">
<blockquote style="margin:16px 0 0;padding:0 1em;border-left:.25em solid {'#3d444d' if dark else '#d1d9e0'};color:{'#9198a1' if dark else '#59636e'};font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">The expert teammates Claude Code doesn't ship with.</blockquote>
<p style="color:{'#f0f6fc' if dark else '#1f2328'};font:16px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Install portable, versioned <b>expert personas</b> — a product manager, an architect, a security reviewer — into any project…</p></div>'''
feed = lambda dark: f'''<div style="background:{'#000' if dark else '#fff'};padding:16px;width:520px;font:15px system-ui;color:{'#e7e9ea' if dark else '#0f1419'}">
<div style="margin-bottom:8px"><b>Inder Singh</b> <span style="opacity:.6">@wastedcode</span><br>Same bug, two agents.</div>
<img src="{u('og.png')}" width="520" style="border-radius:16px;border:1px solid {'#2f3336' if dark else '#cfd9de'};display:block">
<div style="opacity:.6;font-size:13px;margin-top:4px">From truecast.dev</div></div>'''
row = lambda *c: '<div style="display:flex;gap:28px;align-items:flex-start;margin-bottom:28px">' + "".join(c) + "</div>"
lab = lambda t: f'<div style="font:600 13px M;color:#555;margin:0 0 8px">{t}</div>'
logo_on = lambda bgcss, f: f'<div style="width:300px;height:120px;display:flex;align-items:center;justify-content:center;{bgcss}"><img src="{u(f)}" height="40"></div>'
busy = pathlib.Path(__file__).resolve().parent/".busy.png"
pages = {
 "board-readme-social.png": (1880, f'<body style="margin:24px;background:#f0f0f0;{''}">' + row(lab("README · GitHub light") + gh(False), lab("README · GitHub dark") + gh(True)) + row(lab("Social card · light feed") + feed(False), lab("Social card · dark feed") + feed(True))),
 "board-small.png": (1400, '<body style="margin:24px;background:#f0f0f0">' + lab("Favicon at 1× among real tabs · light") + tabs(False) + "<br>" + lab("· dark") + tabs(True) + "<br>"
    + row(*(f'<div>{lab(f"{s}px")}<img src="{u("favicon.svg")}" width="{s}" height="{s}"></div>' for s in (16, 32, 48, 64)),
          f'<div>{lab("apple-touch 180")}<img src="{u("apple-touch-icon.png")}" width="180" style="border-radius:40px"></div>',
          f'<div>{lab("maskable, circle crop")}<img src="{u("icon-maskable-512.png")}" width="180" style="border-radius:50%"></div>',
          f'<div>{lab("silhouette")}<img src="{u("mark.svg")}" width="120" style="filter:brightness(0)"></div>')
    + row(lab("CLI · plan output, dark terminal (proposed ANSI)") + term(True), lab("· light terminal") + term(False))
    + row(logo_on("background:#fff", "logo.svg"), logo_on("background:#0b0d1a", "logo-dark.svg"), logo_on("background:#1f36ff", "logo-on-blue.svg"),
          logo_on(f"background:url({busy.as_uri()}) center/cover", "logo-on-blue.svg") if busy.exists() else "")),
}
(ROOT/"internal/brand").mkdir(parents=True, exist_ok=True)
with sync_playwright() as pw:
    br = pw.chromium.launch()
    for name, (w, body) in pages.items():
        tmp = pathlib.Path(__file__).resolve().parent/".render.html"; tmp.write_text(f"<!doctype html><meta charset=utf-8><style>{fonts}</style>{body}")
        pg = br.new_page(viewport={"width": w, "height": 600}); pg.goto(tmp.as_uri()); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(300)
        pg.screenshot(path=str(ROOT/"internal/brand"/name), full_page=True); pg.close(); tmp.unlink()
    br.close()
