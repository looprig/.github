---
id: reference/tools/tool-definitions
title: Tool definition builders
description: Map standard tool constructors to Harness binding requirements and fail-fast dependency checks.
audience: developer
section: reference
order: 267
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  builders: release-github-com-looprig-tools
  dependency-errors: release-github-com-looprig-tools
  lifecycle: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-tools
---

# Tool definition builders

The root tools package turns focused constructors into `harness/pkg/tool.Definition` values. A definition is a factory for a session-bound invokable tool, not a pre-authorized operation.

## Builders {#builders}

Workspace builders include `GlobDefinition`, `GrepDefinition`, `ReadFileDefinition`, `WriteFileDefinition`, `EditFileDefinition`, and `Bash`. Provider-backed builders include `FetchDefinition` and `WebSearchDefinition`; interaction and task builders include `AskUserDefinition` and `TaskDefinitions`. The builder captures immutable options and receives runtime bindings when the Harness session installs it.

## Dependency errors {#dependency-errors}

Builders check required narrow dependencies such as a read guard, HTTP client, search provider, or runner. They return a `DefinitionBuildError` before an invokable tool exists. Treat that error as a composition failure and repair wiring rather than falling back to a less constrained constructor.

## Lifecycle {#lifecycle}

Keep definitions with the session or bundle that owns their dependencies. Close the loop and workspace coordinator after in-flight tool calls drain. A definition does not own a caller-provided client, runner, provider, or skill loader unless its package explicitly documents that ownership.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned root definitions](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/definitions.go). `stage-04-prepared-tool` exercises a definition through the Harness call path.
