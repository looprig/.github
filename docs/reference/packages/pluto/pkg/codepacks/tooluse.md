---
id: reference/packages/pluto/pkg/codepacks/tooluse
title: Pluto tool-use codepack
description: Built-in v1 tool-use pack constructor for Pluto qualification runs.
audience: developer
section: reference
order: 255
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-pluto
  exported-surface: release-github-com-looprig-pluto
  lifecycle-and-errors: release-github-com-looprig-pluto
  source-proof: release-github-com-looprig-pluto
---

# `github.com/looprig/pluto/pkg/codepacks/tooluse`

Tool-use pack in [Pluto v0.1.2](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/tooluse).

## Package role {#package-role}

The pack defines tool-use qualification tables. Its scenarios and expectations are artifacts of a Pluto run; they are not session tools or model context.

## Exported surface {#exported-surface}

`Revision` is `v1`; `V1()` returns a `qual.Pack`.

## Lifecycle and errors {#lifecycle-and-errors}

`V1` performs no I/O. Validate the pack before execution. Tool capability absence is retained as a skip, while an executed table yields normal scorecard results and profile evaluation decides disposition.

## Source proof {#source-proof}

See the pinned [tool-use codepack source](https://github.com/looprig/pluto/tree/a558d9006ba74559668d9929fb6d872cea0599b4/pkg/codepacks/tooluse).
