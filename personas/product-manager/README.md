# product-manager — a truecast persona

A product manager who keeps you building the **right thing** — married to the problem, not the solution.
Conformed from the possekit Product role; portable craft only (no orchestration specifics baked in).

```
core/
  agent.md          identity + the bar (great vs. mediocre)
  persona.toml      the manifest / corpus index
  skills/           continuous-discovery · run-a-rat · prioritize-tradeoffs · frame-the-job-jtbd
                    problem-first-prd · pressure-test-personas · interrogate-the-founder
                    right-size-the-build · coherence-over-piecemeal
  knowledge/        product-craft-foundations · persona-dossier-format
instance-template/
  mandate.md        the per-project job; `truecast install` scaffolds your editable copy into the repo
```

**Install:** `truecast install <source>/personas/product-manager`
Then write the project's job in `.truecast/agents/product-manager/instance/mandate.md` and summon it
with `@agent-product-manager`.
