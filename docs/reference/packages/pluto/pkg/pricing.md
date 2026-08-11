---
id: reference/packages/pluto/pkg/pricing
title: Pluto pricing package
description: Pricing snapshot parsing and bounded preflight cost estimates for evaluation runs.
audience: [developer, operator]
section: reference
order: 260
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/pricing`

Pricing preflight package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing).

## Package role {#package-role}

The package estimates inference cost before a qualification run and records the provenance of a pricing snapshot. It does not charge a provider or alter a model request.

## Exported surface {#exported-surface}

`Amount`, `Usage`, `Rates`, `Plan`, `Counter`, and `Snapshot` model cost and uncertainty. `Cost`, `Preflight`, `FetchSnapshot`, and `ParseSnapshot` calculate estimates or load a snapshot. `MaxSnapshotBytes` is 8 MiB.

## Lifecycle and errors {#lifecycle-and-errors}

`FetchSnapshot` uses caller context and HTTP; `ParseSnapshot` validates bounded bytes, source URL, timestamp, digest, and rows. Unknown rates produce an incomplete plan with explicit unknowns instead of a fabricated zero cost. A counter is optional and its quality is carried in the plan.

## Source proof {#source-proof}

See the pinned [pricing implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/pricing).
