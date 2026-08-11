---
id: reference/packages/core/content/streamaccumulator
title: streamaccumulator package · content/streamaccumulator
description: Reference for the streamaccumulator package at github.com/looprig/core/content/streamaccumulator, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 2
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  package-role: release-github-com-looprig-core
  exported-surface: release-github-com-looprig-core
  functions-and-methods: release-github-com-looprig-core
  types: release-github-com-looprig-core
  constants-and-variables: release-github-com-looprig-core
  ownership-and-errors: release-github-com-looprig-core
  source-and-runnable-proof: release-github-com-looprig-core
---

# streamaccumulator package · content/streamaccumulator

Import path: `github.com/looprig/core/content/streamaccumulator`. Package streamaccumulator folds streaming content chunks into complete content blocks. It is a pure converter shared by the loop and the TUI/CLI live display path: ThinkingChunk -> ThinkingBlock TextChunk -> TextBlock ToolUseChunk -> ToolUseBlock It does NOT s

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Add`, `Block`, `Blocks`, `Empty`

### Types {#types}

`Text`, `Thinking`, `ToolUses`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The streamaccumulator package exposes `Add`, `Block`, `Blocks`, `Empty` as its main operations. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. It does not own network, credential, or storage resources.

## Source and runnable proof {#source-and-runnable-proof}

Read the implementation and adjacent tests in the [core source tree](https://github.com/looprig/core/tree/v0.5.1/content/streamaccumulator/). The progressive entries `stage-01-inference` and `stage-02-streaming` exercise the content and streaming contracts; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-core`.
