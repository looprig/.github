---
id: reference/packages/pluto/pkg/codepacks/capability
title: Pluto capability codepack
description: Built-in v1 capability pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 251
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/capability`

Capability pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/capability).

## Package role {#package-role}

The pack describes capability qualification tables. It supplies declarative eval inputs; it does not invoke a model or persist a report.

## Exported surface {#exported-surface}

`Revision` is `v1`; `V1()` returns a `qual.Pack`.

## Lifecycle and errors {#lifecycle-and-errors}

`V1` is a pure constructor. Validate the returned pack before execution; pack and table validation errors come from Pluto's qualification layer. Capability tables may be skipped when the target manifest lacks a declared capability, and `run.Execute` preserves those skips.

## Source proof {#source-proof}

See the pinned [capability codepack source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/capability).
