---
id: reference/packages/tools/editfile
title: editfile package · editfile
description: Reference for freshness-checked file edits.
audience: developer
section: reference
order: 163
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# editfile package · editfile

Import path: `github.com/looprig/tools/editfile`. Editfile applies an expected-content replacement under the workspace mutation boundary.

## Package role {#package-role}

`New` constructs an edit tool for a root, workspace observations, and options. The tool prepares a canonical target and expected content, then asks the injected mutation coordinator for a permit before writing.

## Exported surface {#exported-surface}

`Tool` aliases `filemutation.EditFile`; `Option`, `WithHostWrites`, and `WithMutationCoordinator` configure it. `StaleFileError`, `IrregularFileError`, and `LeaseUnhealthyError` are re-exported failures.

### Functions and methods {#functions-and-methods}

`New` creates the tool. Invocation checks freshness and applies a bounded replacement atomically.

### Types {#types}

Errors distinguish a changed file, non-regular target, and unhealthy workspace lease. They are not safe to collapse into a blind retry.

### Constants and variables {#constants-and-variables}

No host-write mode is enabled by default. `WithHostWrites` is an explicit authority request.

## Ownership and errors {#ownership-and-errors}

The caller owns the observations and coordinator; the tool owns only one prepared edit. A stale-file error means the caller must re-read and prepare a new request.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned editfile package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/editfile/). `stage-04-prepared-tool` demonstrates a prepared effect.
