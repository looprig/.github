---
id: reference/packages/pluto/pkg/gen
title: Pluto scenario generation package
description: Structured-output scenario generation with preflight validation and partial acceptance.
audience: developer
section: reference
order: 257
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/gen`

Scenario generation package in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen).

## Package role {#package-role}

`gen` turns a table and generation request into scenario documents. The generated scenarios are artifacts for a later evaluation run.

## Exported surface {#exported-surface}

`Request` carries document, table, count `N`, focus, intent, and model. `Result` carries accepted scenarios, `Rejected` values, and `InputText`. `Generate(ctx, inference.Client, Request)` makes one structured-output call. `Append(path, tableFile, specs, generatedBy)` appends YAML while preserving comments.

## Lifecycle and errors {#lifecycle-and-errors}

`N` must be between 1 and 50 and the table must validate before any paid call. Partial acceptance is explicit; malformed items become `Rejection` values rather than disappearing. Context cancellation bounds the inference call and append errors preserve the source cause.

## Source proof {#source-proof}

See the pinned [generation source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/gen).
