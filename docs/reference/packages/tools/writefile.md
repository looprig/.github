---
id: reference/packages/tools/writefile
title: writefile package · writefile
description: Reference for atomic workspace file creation and replacement.
audience: developer
section: reference
order: 173
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

# writefile package · writefile

Import path: `github.com/looprig/tools/writefile`. Writefile creates or replaces a permitted file through the workspace mutation seam.

## Package role {#package-role}

`New` binds a root, observations, and file-mutation options. The tool prepares a canonical target, requests a mutation permit, and applies the write atomically after freshness and lease-health checks.

## Exported surface {#exported-surface}

`Tool` aliases `filemutation.WriteFile`; `Option`, `WithHostWrites`, and `WithMutationCoordinator` configure it. `FileCreateConflictError`, `IrregularFileError`, `LeaseUnhealthyError`, and `StaleFileError` are re-exported failures.

### Functions and methods {#functions-and-methods}

`New` constructs the tool. Invocation distinguishes create conflict from stale replacement and does not overwrite silently.

### Types {#types}

File mutation errors preserve the target and reason without embedding file contents in a diagnostic.

### Constants and variables {#constants-and-variables}

Host writes are opt-in. There is no unbounded file-size default exposed by this package.

## Ownership and errors {#ownership-and-errors}

The caller owns the workspace coordinator and observations. A conflict or stale-file failure requires a new read and prepared call; blind retry could overwrite a user's change.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned writefile package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/writefile/). `stage-04-prepared-tool` covers the prepared effect path.
