---
id: reference/packages/core/content
title: content package · content
description: Reference for the content package at github.com/looprig/core/content, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 1
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

# content package · content

Import path: `github.com/looprig/core/content`. Package content defines the unified content vocabulary shared across all internal packages. Block is a sealed interface; the concrete payload type is the discriminator. Only this package can add variants (unexported marker).

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Add`, `ContextTokens`, `Error`, `MarshalBlock`, `MarshalBlocks`, `MarshalJSON`, `ReplayableAs`, `TotalTokens`, `UnmarshalJSON`, `Unwrap`, `Validate`

### Types {#types}

`AIMessage`, `AgenticMessages`, `AudioBlock`, `Block`, `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, `BlockType`, `Chunk`, `Conversation`, `DocumentBlock`, `ImageBlock`, `ImageSource`, `MediaType`, `Message`, `NilBlockError`, `Role`, `SystemMessage`, `TextBlock`, `TextChunk`, `ThinkingBlock`, `ThinkingChunk`, `TokenCount`, `ToolResultBlock`, `ToolResultMessage`, `ToolUseBlock`, `ToolUseChunk`, `UnknownBlockTypeError`, `Usage`, `UsageField`, `UsageOverflowError`, `UsageValidationError`, `UsageValidationReason`, `UserMessage`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The content package exposes `Add`, `ContextTokens`, `ReplayableAs`, `TotalTokens` as its main operations. Its exported typed failures include `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, `NilBlockError`; classify them with errors.Is or errors.As. It does not own network, credential, or storage resources.

## Source and runnable proof {#source-and-runnable-proof}

Read the implementation and adjacent tests in the [core source tree](https://github.com/looprig/core/tree/v0.5.1/content/). The progressive entries `stage-01-inference` and `stage-02-streaming` exercise the content and streaming contracts; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-core`.
