---
id: modules/core
title: Core content and small shared contracts
description: Use Core for content blocks, messages, streaming accumulation, logging, UUIDs, and normalized token usage.
audience: developer
section: modules
order: 1
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  boundary:
    - release-github-com-looprig-core
  composition:
    - release-github-com-looprig-core
  lifecycle:
    - release-github-com-looprig-core
  errors-and-limits:
    - release-github-com-looprig-core
  runnable-proof:
    - release-github-com-looprig-core
---

# Core content and small shared contracts

Core `v0.5.1` is the bottom vocabulary for model-facing and runtime-facing packages. Install the immutable release `github.com/looprig/core@v0.5.1`; keep source-workspace replacements out of a published module file.

## Boundary {#boundary}

The `content` package is a closed set of messages and blocks. `Block`, `Chunk`, and `Conversation` are sealed interfaces, so a provider or application cannot silently add a variant that another codec does not understand. Text, image, audio, document, thinking, tool-use, and tool-result blocks carry the payload; the concrete Go type is the discriminator. `Message` supplies a role and ordered blocks, while `UserMessage`, `SystemMessage`, `AIMessage`, and `ToolResultMessage` keep conversation turns explicit.

`content` also owns the tagged JSON codec for blocks and messages. `Usage` normalizes input, output, cache, and reasoning token counts and validates their relationships. `content/streamaccumulator` converts `TextChunk`, `ThinkingChunk`, and `ToolUseChunk` values into complete blocks. It does not send events, decide permissions, or decide whether a turn failed.

## Composition {#composition}

Use Core at module boundaries where several providers must share one representation. An inference client returns `AIMessage` and `Usage`; a stream reader yields `Chunk` values; a loop can accumulate those chunks and then persist the resulting blocks. `logging` supplies a small configuration and level parser, and `uuid` supplies parsing and generation for stable identifiers. These packages deliberately avoid owning a runtime, network client, credential, or storage backend.

Model reasoning state is opaque. `ThinkingBlock` can carry provider state and a provider-state format, and `NewThinkingBlock` defensively copies the bytes. A caller may replay that state only when the format matches the same codec. Core does not translate one provider's opaque state into another provider's field.

## Lifecycle {#lifecycle}

Most Core values are ordinary data and have no close operation. A stream accumulator is a per-stream value: add chunks in arrival order, then read its completed blocks. Copy message and block slices before handing them to another owner when the caller intends to mutate them. `NewThinkingBlock` is the explicit constructor to use when the provider-state byte slice must not alias caller memory.

## Errors and limits {#errors-and-limits}

The block codec rejects unknown tags, typed-nil blocks, malformed payloads, and input that exceeds its byte or element safety caps. `Usage.Validate`, `Usage.Add`, `ContextTokens`, and `TotalTokens` return typed validation or overflow failures instead of silently wrapping token counts. Treat `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, and usage errors with `errors.As`; diagnostic text is not a compatibility contract.

## Runnable proof {#runnable-proof}

The progressive manifest entries `stage-01-inference` and `stage-02-streaming` use the released Core version. Run them with `node scripts/docs/run-examples.mjs`; the first asserts a complete assistant block and the second asserts ordered chunks, the accumulated text, and the `stop` finish reason. Native examples under `core/examples/content`, `core/examples/streaming`, `core/examples/usage`, `core/examples/logging`, and `core/examples/uuid` cover the package-level contracts.
