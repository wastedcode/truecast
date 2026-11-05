---
id: codeql
kind: tool
medium: code
title: CodeQL
by: GitHub
date:
url: https://codeql.github.com/
archive_url: http://web.archive.org/web/20261023193104/https://codeql.github.com/
jobs: [sec-005]
context: [supported compiled and interpreted languages, data-flow bugs]
facets: use=query code as data; taint tracking source to sink
relations: [alternative:semgrep]
verified: 2026-11-05 page fetched, title "CodeQL"
curator: draft (agent), unratified
---
# CodeQL

Interprocedural taint tracking from input to sink. Slower to set up than Semgrep; better for "can this input
reach that call".
