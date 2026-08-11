---
id: reference/packages/pluto/pkg/run
title: Pluto run package
description: Qualification execution orchestration with explicit target selection, progress, partial results, and table concurrency.
audience: developer
section: reference
order: 266
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/run`

Qualification execution package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run).

## Package role {#package-role}

`run` coordinates manifests, packs, targets, table evaluation, callbacks, and scorecard assembly. It creates evaluation artifacts and does not own session lifecycle or serving.

## Exported surface {#exported-surface}

`Spec` carries `Manifest`, `Packs`, `Target`, optional `TargetForTable`, `Config`, `Progress`, `OnResult`, and `TableConcurrency`. `Execute(ctx, spec)` returns `Result` with `Scorecard`, reports, and skipped tables. `BuildTarget`, `DecodeManifest`, `DecodeProfile`, and `ManifestModel` support composition.

## Lifecycle and errors {#lifecycle-and-errors}

Exactly one target or target-for-table must be available. A worker pool runs tables when concurrency exceeds one. Later errors can return a partial result, and capability-ineligible tables remain explicitly skipped. Context cancellation stops new work and returns the cause.

## Source proof {#source-proof}

See the pinned [run implementation](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/run) and stage 23's exact report proof.
