---
id: reference/packages/tools/bash
title: bash package · bash
description: Reference for prepared shell and supervised Bash execution.
audience: developer
section: reference
order: 162
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

# bash package · bash

Import path: `github.com/looprig/tools/bash`. Bash prepares shell commands and routes synchronous or supervised execution through a Harness command runner.

## Package role {#package-role}

`NewBash` binds a root and optional command runner, workspace coordinator, observations, and family catalog. `NewFactory` and `NewSupervisedFactory` build definitions for normal and background calls.

## Exported surface {#exported-surface}

The package exports `BashTool`, `Factory`, `SupervisedFactory`, `BashOption`, `NewBash`, `NewFactory`, `NewSupervisedFactory`, `WithRunner`, `WithWorkspaceCoordinator`, `WithObservations`, and `WithFamilyCatalog`.

### Functions and methods {#functions-and-methods}

Factories validate bindings before returning a tool. Supervised calls use the shared process supervisor and the runner resolved from the validated loop ID.

### Types {#types}

`BashTool` returns command output, exit status, and typed preparation or process errors. Options do not change gate policy.

### Constants and variables {#constants-and-variables}

No shell allowlist is implicit. Family eligibility is an explicit option and a gate still evaluates the normalized command requirement.

## Ownership and errors {#ownership-and-errors}

The caller owns the command runner or resolver; Harness owns the tool lifetime. Unprepared, invalid, denied, stale, output-limited, and lifetime-containment failures must stop the call before a weaker execution path is attempted.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Bash package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/bash/). The prepared tool example and component preparation tests cover normalization and gate handoff.
