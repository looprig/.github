---
id: reference/packages/workflows/tools
title: Workflows tools package
description: Tool bundle that exposes workflow start, lookup, history, resume, and cancellation operations through injected session resources.
audience: developer
section: reference
order: 211
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  package-role: module-workflows
  exported-surface: central-workflows-catalog-source
  lifecycle-and-errors: central-workflows-artifacts-contract-test
  source-proof: central-workflows-stage18-output-test
---

# `github.com/looprig/workflows/tools`

The tools package is a source-workspace companion to the workflows root package. It builds invokable tools from caller-supplied session resources; it does not locate a global catalog or supervisor.

## Package role {#package-role}

The bundle is the model-facing control surface for workflow orchestration. It translates tool calls into the typed catalog, run registry, input store, and session-owned supervisor. Workflow event history and run records remain durable projections outside the tool implementation.

## Exported surface {#exported-surface}

`Config` carries `SessionID`, `Catalog`, a run `Registry`, `Inputs`, `Supervisor`, `Now`, and `NewID`. An optional `PrepareRun` hook can normalize or attach run metadata before start. `NewBundle(config)` returns `[]tool.InvokableTool` and currently creates `workflow_run_start`, `workflow_run_get`, `workflow_run_list`, `workflow_run_history`, `workflow_run_resume`, and `workflow_run_cancel`.

## Lifecycle and errors {#lifecycle-and-errors}

The caller owns the returned tools and the resources in `Config`; the bundle does not start or shut down a supervisor. Start and resume retain the workflow's typed validation boundaries. A failed or inconsistent prepare hook returns `PrepareRunIntegrityError`; underlying catalog, registry, input, and supervisor errors remain typed and are not flattened into tool text.

## Source proof {#source-proof}

The [stage 18 workflow fixture](../../../examples/index.md#stage-18-workflows) is the reviewed source-workspace proof. Package declarations are pinned at the [workflows commit](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f/tools).
