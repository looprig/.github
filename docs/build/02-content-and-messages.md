---
id: build/02-content-and-messages
title: Build 02: content and messages
description: Use Core's sealed blocks, messages, tagged codec, and stream accumulator as the common model vocabulary.
audience: developer
section: build
order: 2
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  boundary:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
  composition:
    - release-github-com-looprig-core
  message-construction:
    - release-github-com-looprig-core
  streaming:
    - release-github-com-looprig-core
  lifecycle:
    - release-github-com-looprig-core
  limits-and-errors:
    - release-github-com-looprig-core
  errors-and-limits:
    - release-github-com-looprig-core
  runnable-proof:
    - release-github-com-looprig-core
---

# Build 02: content and messages

Use Core content at every boundary where a model call, a stream, a loop, or persisted history must agree about what a turn contains. The representation is deliberately closed: provider packages can translate into it, but they cannot introduce a block variant that another codec has never seen.

## Boundary {#boundary}

`content.Message` carries a role and ordered blocks. Text, image, audio, document, thinking, tool-use, and tool-result blocks are concrete variants of the sealed `Block` vocabulary. `Conversation` and the role-specific message types make turn ownership visible. `Usage` carries normalized token counts rather than provider-specific field names.

Inference requests and responses use these values. The tagged JSON codec belongs to Core, which keeps persistence and transport adapters from growing separate, incompatible encodings. A provider's opaque thinking state remains a `ThinkingBlock` payload and is not interpreted by Core.

## Message construction {#message-construction}

Build a message from the blocks that the next boundary understands. Keep tool calls and tool results as distinct blocks so a loop can match them without parsing text. Preserve block order for streamed output, and preserve the provider-state format beside opaque thinking bytes when the same provider may replay them. `NewThinkingBlock` defensively copies provider-state bytes; callers should still treat returned message slices as values they own and should copy them before sharing mutable storage.

## Streaming {#streaming}

`content/streamaccumulator` combines text, thinking, and tool-use chunks into completed blocks. Feed chunks in arrival order and do not use the accumulator as a transport or authorization layer. Inference stream readers provide the chunks and a terminal result; the application decides when that result is durable and when a partial turn should be discarded.

## Limits and errors {#limits-and-errors}

The codec rejects unknown tags, malformed payloads, typed-nil blocks, and inputs that exceed its byte or element safety limits. `Usage.Validate`, `Usage.Add`, `ContextTokens`, and `TotalTokens` report validation and overflow failures instead of silently wrapping counts. Handle `BlockDecodeError`, `BlockEncodeError`, `BlockLimitError`, and usage errors with `errors.As`; their diagnostic text is not a stable protocol.

## Runnable proof {#runnable-proof}

`stage-01-inference` proves that an invocation can produce a complete assistant message. `stage-02-streaming` proves ordered chunks, accumulation, and the terminal `stop` result. Run them with `node scripts/docs/run-examples.mjs`; the source and adjacent tests are pinned in the [Core content tree](https://github.com/looprig/core/tree/v0.5.1/content/). The referenced package pages list the pinned source files and adjacent tests used for this boundary.
