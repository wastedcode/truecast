---
id: tob-homebrew-2023
kind: artifact
medium: document
title: Homebrew Security Assessment
by: Trail of Bits (William Woodruff, Sam Alws, William Tan) for OTF
date: 2023-08 (review); 2024-07-26 (comprehensive report)
url: https://github.com/trailofbits/publications/blob/master/reviews/2023-08-28-homebrew-securityreview.pdf
archive_url: http://web.archive.org/web/20261014081453/https://github.com/trailofbits/publications/blob/master/reviews/2023-08-28-homebrew-securityreview.pdf
jobs: [sec-005]
context: [package manager, installer, CLI that runs third-party code, CI/CD]
facets: effort=6 engineer-weeks (3 consultants, 2 weeks); sections=project goals, targets, coverage, automated testing, codebase maturity evaluation, summary of findings, detailed findings; findings=TOB-BREW-n with severity and category
relations: [same_author:tob-curl-threatmodel-2022]
verified: 2026-11-05 PDF fetched and read (contents, executive summary)
curator: draft (agent), unratified
license_note: "may not be reproduced or distributed in part or in whole without the express written permission of Trail of Bits"; link only
---
# Homebrew Security Assessment — Trail of Bits

**Why it's gold**
- States scope and effort up front (six engineer-weeks; core package manager, CI/CD, the JSON API) and has
  explicit **Project Coverage** and **Automated Testing** sections, so the reader knows what was *not* looked at.
- A **Codebase Maturity Evaluation** separate from the findings: the system's habits, not just its bugs.
- Findings grouped by impact in the summary ("escape the build sandbox", "compromise the CI/CD workflow"),
  each with a stable ID (TOB-BREW-2, ...).
- Recommends the class fix as well as the instances: **"Document Homebrew's security model"** — what is trusted
  (core formulae) and what isn't (third-party formulae, casks).

**Weakness**
- Time-boxed; the report itself says it is not a comprehensive list.

**Use when** auditing an installer, package manager or any tool that runs or writes third-party content.
