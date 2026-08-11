---
id: reference/packages/pluto/pkg/compare
title: Pluto comparison package
description: Candidate and incumbent scorecard comparison with explicit unmatched and skipped cases.
audience: developer
section: reference
order: 256
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/compare`

Comparison package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/compare).

## Package role {#package-role}

The package compares two qualification scorecards without erasing differences in coverage. A baseline/candidate comparison is an analysis artifact, not an evaluation history.

## Exported surface {#exported-surface}

`Compare(candidate, incumbent)` returns `Comparison`. `TableComparison`, `UnmatchedTable`, `CaseKey`, `CaseComparison`, `Distribution`, `MeasurementDelta`, `TrialResult`, `Side`, `ComparisonSide`, and `CaseClass` describe aligned, unmatched, skipped, and changed cases. `RoleMismatchError` rejects an invalid role pairing.

## Lifecycle and errors {#lifecycle-and-errors}

Inputs are validated before alignment. Tables align by pack and table; unmatched and skipped entries remain visible. A single report carrying evaluator revision drift is rejected, while a legitimate cross-report revision change remains comparable with its provenance. Non-finite measurements are typed errors.

## Source proof {#source-proof}

See the pinned [comparison implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/compare).
