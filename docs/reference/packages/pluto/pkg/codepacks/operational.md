---
id: reference/packages/pluto/pkg/codepacks/operational
title: Pluto operational codepack
description: Built-in v1 operational pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 252
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/operational`

Operational pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/operational).

## Package role {#package-role}

The pack contains operational reliability checks used by qualification. It is declarative and stays separate from runtime serving and session state.

## Exported surface {#exported-surface}

`Revision` is `v1`; `V1()` returns a `qual.Pack`.

## Lifecycle and errors {#lifecycle-and-errors}

Construction is pure. Validate the pack before `run.Execute`; malformed tables are validation errors, while missing target capability is represented as a skipped result. Do not treat a skipped operational table as a passing measurement.

## Source proof {#source-proof}

See the pinned [operational codepack source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/operational).
