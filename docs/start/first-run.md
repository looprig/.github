---
id: start/first-run
title: First deterministic inference run
description: See one request and one streamed answer before adding providers, sessions, or tools.
audience: human
section: start
order: 3
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  invoke:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
  stream:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
---

# First deterministic inference run

Run the existing progressive entries before connecting a real provider. `stage-01-inference` uses the fake inference transport, builds a Core message, invokes the Inference client, and asserts `assistant: Hello from Looprig.`. It proves the request and response boundary without a key, network, or mutable model catalog.

## Invoke {#invoke}

The example constructs `inference.Request` with a system prompt and `content.AgenticMessages`, calls `Client.Invoke`, checks the returned assistant block, and confirms that exactly one request reached the fixture. Read `examples/go/progressive/stage01_inference/main.go` and its test for the complete runnable source. Execute the manifest command from the `.github` repository with `node scripts/docs/run-examples.mjs`.

## Stream {#stream}

`stage-02-streaming` calls `Client.Stream`, reads `TextChunk` values until `io.EOF`, closes the reader, and checks the terminal `stream.Result`. The fixture emits three chunks that become `Hello, Looprig!` with finish reason `stop`. The example demonstrates the ownership rule: close the reader even on a failed or canceled loop, and use the terminal result only after the stream has ended.
