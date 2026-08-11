---
id: reference/packages/tools/tools
title: tools package · tools
description: Reference for standard Looprig tool definition builders.
audience: developer
section: reference
order: 160
publication: released
examples:
  - stage-03-pure-tool
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

# tools package · tools

Import path: `github.com/looprig/tools`. The root package composes focused tool packages into Harness definitions.

## Package role {#package-role}

Root builders are declarative. They return `tool.Definition` values that Harness binds to a session, so process runners, workspace coordinators, observations, and mutation permits are supplied only at build time.

## Exported surface {#exported-surface}

Builders include `AskUserDefinition`, `Bash`, `BashDefinition`, `EditFileDefinition`, `FetchDefinition`, `GlobDefinition`, `GrepDefinition`, `ProcessInputDefinition`, `ProcessOutputDefinition`, `ProcessStopDefinition`, `ReadFileDefinition`, `TaskDefinitions`, `WebSearchDefinition`, and `WriteFileDefinition`. `AsyncProcessRunnerResolver` lets supervised Bash resolve a validated loop runner.

### Functions and methods {#functions-and-methods}

Definition functions capture only static options and collaborators explicitly passed by the composition root. `BashDefinition` resolves its runner once during Build, not from invocation-time provenance.

### Types {#types}

`DefinitionBuildError` wraps a failed concrete definition build. Concrete types live in subpackages and retain their own lifecycle and error contracts.

### Constants and variables {#constants-and-variables}

The root package exposes no global tool registry. Definition names and produced tool names are owned by the returned Harness definitions.

## Ownership and errors {#ownership-and-errors}

The caller owns HTTP clients, read guards, and providers passed to builders. Harness owns the built tool and session resources. Do not pass a second mutation coordinator through an option that the root builder injects itself.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned root builders](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/definitions.go). The progressive pure and prepared tool examples are runnable with `node scripts/docs/run-examples.mjs`.
