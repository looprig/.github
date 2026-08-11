---
id: reference/packages/pluto/pkg/qual
title: Pluto qualification package
description: Manifests, packs, tables, scorecards, statistics, capabilities, and validation primitives for qualification.
audience: developer
section: reference
order: 262
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/qual`

Qualification domain package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual).

## Package role {#package-role}

`qual` is the stable domain vocabulary shared by pack definitions, targets, run results, comparisons, profiles, and reports. It records evaluation artifacts and target identity; it does not own model context or serving state.

## Exported surface {#exported-surface}

`Manifest`, `Pack`, `Table`, `Plan`, `TablePlan`, `TableResult`, and `Scorecard` model runs. `Capability`, `EndpointClass`, and `ModelRole` are validated enums. `DimensionScore`, `StatSummary`, `StatusRollup`, `FindingCount`, and `SeverityCount` carry results. `Summarize(values, q)` rejects empty/nonfinite data and copies its input. `ValidationError` is the common domain failure.

## Lifecycle and errors {#lifecycle-and-errors}

`Manifest.Validate` bounds strings at `MaxManifestStringBytes` (256 bytes), checks role/provider/model/API format/endpoint class, and validates capabilities. Pack and table validation happen before execution. Scorecards retain skipped and unverified outcomes; no zero-valued score is inferred from absent evidence.

## Source proof {#source-proof}

See the pinned [qualification declarations](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/qual).
