---
id: agents/repositories/core
title: Core content contracts
description: Represent messages, content blocks, chunks, usage, stream accumulation, IDs, and logging.
audience: agent
section: agents/repositories
order: 4
publication: released
proofs:
  module:
    - release-github-com-looprig-core
---
# core

`github.com/looprig/core@v0.5.1` is the foundation with no Looprig module dependency. Import `core/content` for messages, blocks, chunks, usage, JSON encoding, and stream accumulation; `core/uuid` for validated identifiers; `core/logging` for the structured logger.

Use the concrete content constructors and JSON methods instead of provider-specific message types. `content/streamaccumulator` folds chunks into a complete response while preserving the stream contract. UUID construction returns an error, so propagate it or use `uuid.MustParse` only for fixed test data. Keep content values immutable after handing them to another goroutine.

Invalid block or message JSON, unsupported media, UUID generation, and accumulator misuse are the boundary failures. The examples exercise content, usage, streaming, UUID, and logging paths. Proofs: [`content/message.go`](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/message.go), [`content/chunk.go`](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/chunk.go), [`content/streamaccumulator/streamaccumulator.go`](https://github.com/looprig/core/blob/a3dd61bfb5f89794eaf9a2eb7c5ff46c6e2eb894/content/streamaccumulator/streamaccumulator.go), [`examples/streaming/example_test.go`](https://github.com/looprig/core/blob/c195a376e3307cd66f35ea30095c7f28e8d72a40/examples/streaming/example_test.go).
