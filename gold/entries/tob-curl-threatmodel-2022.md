---
id: tob-curl-threatmodel-2022
kind: artifact
medium: document
title: cURL Threat Model
by: Trail of Bits for the Linux Foundation
date: 2022-12
url: https://github.com/trailofbits/publications/blob/master/reviews/2022-12-curl-threatmodel.pdf
archive_url: http://web.archive.org/web/20261014085517/https://github.com/trailofbits/publications/blob/master/reviews/2022-12-curl-threatmodel.pdf
jobs: [sec-002]
context: [widely embedded library and CLI, open source]
facets: sections=executive summary, project coverage, system diagrams (high-level data flow, binary data flow), components
relations: [same_author:tob-homebrew-2023]
verified: 2026-11-05 PDF fetched and read (contents)
curator: draft (agent), unratified
license_note: Trail of Bits publication; link only
---
# cURL Threat Model — Trail of Bits

**Why it's gold**
- A threat model published as its own deliverable, separate from the code review.
- Leads with **system diagrams** (high-level data flow, binary data flow) and a component breakdown before
  threats, so the trust boundaries are drawn, not described.

**Weakness**
- Only the contents pages were read for this entry; threats and mitigations sections not yet reviewed.

**Use when** threat-modelling a whole system or library (sec-002).
