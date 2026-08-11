---
id: reference/packages/pluto/pkg/codepacks/safety
title: Pluto safety codepack
description: Built-in v1 safety pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 253
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/safety`

Safety pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/safety).

## Package role {#package-role}

The pack supplies safety qualification tables for a target. It is a test definition, not a policy enforcement service and not model context.

## Exported surface {#exported-surface}

`Revision` is `v1`; `V1()` returns a `qual.Pack`.

## Lifecycle and errors {#lifecycle-and-errors}

`V1` has no network or filesystem lifecycle. Validate the pack and preserve per-table assessment and skip status. Profile qualification decides how safety results map to a disposition.

## Source proof {#source-proof}

See the pinned [safety codepack source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/safety).
