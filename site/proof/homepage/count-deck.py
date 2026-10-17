#!/usr/bin/env python3
"""Count visible words in the deck's 'On the page' blocks. [Copy] buttons and {gen:…} wrappers are not words themselves."""
import re, sys
s = open(sys.argv[1] if len(sys.argv) > 1 else "copy-deck.md").read()
total = 0
for m in re.finditer(r"On the page:\n```\n(.*?)```", s, re.S):
    b = m.group(1).replace("[Copy]", "")
    b = re.sub(r"\{gen:([^}]*)\}", r"\1", b)
    words = [w for w in re.split(r"\s+", b) if re.search(r"[A-Za-z0-9$~/@]", w)]
    head = b.strip().splitlines()[0][:50]
    print(f"{len(words):4d}  {head}")
    total += len(words)
print(f"{total:4d}  TOTAL")
