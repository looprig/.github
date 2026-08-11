---
id: reference/packages/pluto/pkg/profile
title: Pluto profile package
description: Requirements, restrictions, and qualified/restricted/rejected/unverified profile dispositions.
audience: developer
section: reference
order: 261
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/profile`

Profile qualification package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile).

## Package role {#package-role}

Profiles turn a scorecard into an explicit disposition. They are policy inputs for qualification, not session authorization or live tool gates.

## Exported surface {#exported-surface}

`Profile` contains name, revision, requirements, and restrictions. `Requirement` and `Restriction` set dimensions, score/coverage bounds, finding codes, severity limits, and counts. `Evaluate(card, profile)` returns `Result` with `RequirementResult`, `RestrictionResult`, `Disposition`, and `Outcome` values.

## Lifecycle and errors {#lifecycle-and-errors}

`Profile.Validate` rejects malformed bounds and duplicate rules before `Evaluate`. Dispositions are `Qualified`, `Restricted`, `Rejected`, and `Unverified`; outcomes are `Met`, `Violated`, and `Undecided`. A missing or skipped capability cannot silently become a qualified requirement.

## Source proof {#source-proof}

See the pinned [profile implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/profile).
