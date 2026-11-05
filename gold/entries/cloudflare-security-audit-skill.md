---
id: cloudflare-security-audit-skill
kind: tool
medium: code
title: Cloudflare security-audit skill
by: Cloudflare
date: 2026-09 (last push)
url: https://github.com/cloudflare/security-audit-skill
archive_url: http://web.archive.org/web/20261105020600/https://github.com/cloudflare/security-audit-skill
jobs: [sec-005]
context: [agent-run audit, parallel subagents]
facets: phases=recon, coverage-led hunting, adversarial validation, structured output, record verification, reporting; ships report-schema.json + validators
relations: []
verified: 2026-11-05 repo README read via GitHub API
curator: draft (agent), unratified
---
# Cloudflare security-audit skill

The method behind Cloudflare's vulnerability harness, as a coding-agent skill. Its adversarial verifier
("the agent that checks a finding is never the agent that found it") and its `findings.json` schema plus
validator are the parts to borrow. Their own note: a single run found roughly half of what repeated runs did.
