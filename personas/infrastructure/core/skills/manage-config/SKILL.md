---
name: manage-config
description: Use when designing or fixing how the system is configured (env vars, json/yaml/toml files, flags, per-project/per-box settings, layered defaults) — give config a versioned schema, define merge/precedence/layering explicitly, validate on load, and check prod↔local parity.
---
# Manage config — versioned schema, explicit precedence, prod↔local parity

Config is where systems silently diverge. The same code runs differently in two environments, a typo'd key is
ignored instead of rejected, "which value actually won?" is unanswerable, and a setting that works locally
breaks in prod. Config deserves the same rigor as code: **a declared schema, an explicit merge order, validation
on load, and verified parity between where you test and where you ship.**

## Give config a schema, and version it
- **Declare the shape.** A typed/validated schema (JSON Schema, or a parsed-and-validated config struct) that
  names every key, its type, whether it's required, its default, and its allowed range. **Validate on load and
  fail fast** with a clear message ("`timeout_ms` must be an integer; got 'fast'") — never silently ignore an
  unknown or malformed key, and never boot a service with config that didn't parse.
- **Version the schema.** Config formats evolve; a `version`/`schemaVersion` field + a migration path means an
  old config file is upgraded or rejected with guidance, not misread. Keep configs in source control
  (secrets excluded — those are injected at runtime per `infrastructure-as-code`); the file is reviewable and
  diffable like any other code.
- **Format:** structured (json/yaml/toml) over ad-hoc string parsing; one canonical format per project.

## Define merge / precedence / layering explicitly
Real systems layer config: built-in defaults → file (project/box level) → environment → CLI flags →
runtime override. The bugs come from leaving the order implicit.
- **Write the precedence order down**, document it, and make it the single resolution path — "the most specific
  / latest layer wins" is the usual rule; whatever you pick, it's explicit and consistent across surfaces.
- **Deep-merge vs replace must be a decision, not an accident** — does a partial override merge into the default
  object or replace it wholesale? Pick per key and be consistent; surprising merges are a classic config bug.
- **Make the effective config inspectable.** Provide a way to dump the *resolved* config with provenance ("this
  value came from the env var, that one from the file, this is the default") — so "which value won, and why?"
  is answerable without guessing. This is observability for config.

## Prod↔local parity (folds into own-prod-mindset)
The most expensive config bugs are environment divergence: it worked locally and broke in prod because the two
configs differ in an unverified way.
- **Same shape everywhere; values differ, structure doesn't.** Every environment is the *same* schema with a
  different layer on top — not a separately hand-maintained file that drifts. A key present locally but missing
  in prod is a parity break; detect it (diff the resolved key-sets across envs), don't discover it.
- **Verify, don't assume parity** (`own-prod-mindset`): before trusting "works on my machine," confirm the
  prod-relevant config keys resolve to sane values in prod, and that local isn't passing only because of a
  default that prod overrides differently. Treat undeclared prod-only behavior as the bug to find.
- **No secrets in config files**, in any environment — inject at runtime; a leaked-config parity check also
  catches a secret that crept into the wrong layer.

## The discipline
- An unvalidated config is an un-typed global input to your whole system — the one input most likely to differ
  between where you tested and where it runs. Schema + precedence + parity turns config from a source of
  silent divergence into a reviewable, inspectable, verifiable part of the system.
