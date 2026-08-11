---
id: reference/packages/pluto/pkg/codepacks/structuredoutput
title: Pluto structured-output codepack
description: Built-in v1 structured-output pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 254
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/structuredoutput`

Structured-output pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/structuredoutput).

## Package role {#package-role}

The pack describes qualification for structured-output capability. It is consumed by the run engine and does not itself call inference.

## Exported surface {#exported-surface}

`Revision` is `v1`; `V1()` returns a `qual.Pack`.

## Lifecycle and errors {#lifecycle-and-errors}

Construction is pure. Target capability and endpoint declarations determine whether a table can run; unsupported capability is a visible skip. Invalid table definitions are typed validation failures before a paid call.

## Source proof {#source-proof}

See the pinned [structured-output codepack source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/structuredoutput).
