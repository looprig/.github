---
id: reference/packages/tools/task
title: task package · task
description: Reference for session-scoped task creation, listing, retrieval, and updates.
audience: developer
section: reference
order: 171
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# task package · task

Import path: `github.com/looprig/tools/task`. Task exposes model-facing task records backed by a caller-owned task store.

## Package role {#package-role}

The package keeps task identity, title, status, description, and timestamps explicit. Its tools are session-bound and do not execute arbitrary commands or change gate policy.

## Exported surface {#exported-surface}

Types include `Task`, `TaskCreate`, `TaskGet`, `TaskList`, `TaskUpdate`, and `Status`; `NewTools` returns the invokable task tool set. Status includes the terminal `deleted` value.

### Functions and methods {#functions-and-methods}

`NewTools` builds the create, get, list, and update tools over the runtime store binding.

### Types {#types}

Task values carry bounded fields and stable IDs. Store and validation errors remain typed at the tool boundary.

### Constants and variables {#constants-and-variables}

Status values are closed labels; there is no process or network permission implied by a task record.

## Ownership and errors {#ownership-and-errors}

Harness owns the store and task lifecycle. A task update is not a delegation or approval action, and callers must handle a missing or deleted task explicitly.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned task package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/task/). Component task examples cover CRUD and tool binding.
