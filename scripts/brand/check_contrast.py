#!/usr/bin/env python3
"""Checks every allowed colour pairing in site/brand/tokens.css against WCAG 2.2 (AA). Exit 1 on a failure."""
import re, sys, pathlib
css = (pathlib.Path(__file__).resolve().parents[2] / "site/brand/tokens.css").read_text()
raw = dict(re.findall(r"--(tc-[\w-]+):\s*(#[0-9A-Fa-f]{6})", css))
def block(sel):
    i = css.index(sel); return css[i:css.index("}", i)]
def roles(text):
    out = {}
    for k, v in re.findall(r"--(color-[\w-]+):\s*([^;]+);", text):
        v = v.strip(); m = re.match(r"var\(--([\w-]+)\)", v); out[k] = raw[m.group(1)] if m else v
    return out
light = roles(css[css.index("roles: LIGHT"):css.index("@media (prefers-color-scheme: dark)")])
dark = {**light, **roles(block(':root[data-theme="dark"]'))}
assert roles(block(':root:not([data-theme="light"])')) == roles(block(':root[data-theme="dark"]')), "dark blocks drifted"
def lum(h):
    c = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
def ratio(a, b):
    x, y = sorted((lum(a), lum(b)), reverse=True); return (x + 0.05) / (y + 0.05)
TEXT = ["color-text", "color-text-2", "color-accent", "color-go", "color-conditional", "color-no-go"]
GROUNDS = ["color-bg", "color-surface", "color-surface-2", "color-code-bg"]
pairs = [(t, g, 4.5) for t in TEXT for g in GROUNDS]
pairs += [("color-text-3", g, 4.5) for g in ("color-bg", "color-surface", "color-code-bg")]
pairs += [("color-accent", "color-accent-wash", 4.5), ("color-text", "color-accent-wash", 4.5),
          ("color-on-fill", "color-fill", 4.5), ("color-on-fill", "color-fill-press", 4.5),
          ("color-go", "color-go-wash", 4.5), ("color-conditional", "color-conditional-wash", 4.5),
          ("color-no-go", "color-no-go-wash", 4.5),
          ("color-focus", "color-bg", 3), ("color-focus", "color-surface", 3), ("color-accent", "color-bg", 3)]
bad = 0
for name, th in (("light", light), ("dark", dark)):
    for fg, bg, need in pairs:
        r = ratio(th[fg], th[bg]); ok = r >= need; bad += not ok
        print(f"{'ok ' if ok else 'FAIL'} {name:5} {fg:22} on {bg:22} {r:5.2f}:1 (need {need})")
# the brand on its own grounds (marks, device): 3:1 non-text minimum
for fg, bg in (("tc-blue", "tc-paper"), ("tc-blue-light", "tc-ink"), ("tc-paper", "tc-blue")):
    r = ratio(raw[fg], raw[bg]); print(f"{'ok ' if r >= 3 else 'FAIL'} mark  {fg} on {bg} {r:.2f}:1"); bad += r < 3
print("forbidden (fails 3:1, never pair):", f"tc-blue on tc-ink {ratio(raw['tc-blue'], raw['tc-ink']):.2f}:1")
sys.exit(1 if bad else 0)
