---
id: modules/inference
title: Provider-neutral inference
description: Invoke and stream model requests through explicit descriptors, codecs, retries, and a local gateway.
audience: developer
section: modules
order: 11
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  request-and-response:
    - release-github-com-looprig-inference
  streaming:
    - release-github-com-looprig-inference
  gateway-and-routing:
    - release-github-com-looprig-inference
  runnable-proof:
    - release-github-com-looprig-inference
---

# Provider-neutral inference

Inference `v0.9.2` is the transport-neutral layer between Core content and provider clients. Install `github.com/looprig/inference@v0.9.2` with the released Core module. It does not store API keys and it does not decide which provider a model identity is allowed to use.

## Request and response {#request-and-response}

`model.Model` describes provider label, API format, endpoint, model name, capabilities, context limits, and default sampling. It is secret-free. `inference.Request` adds the system prompt, messages, tools, optional output schema, tool choice, and per-call sampling override. Validate model and request features at the trust boundary. Unknown provider and format labels are intentionally allowed by the neutral model package; the LLM module or an application composition root applies provider policy.

`Client` has two operations: `Invoke` returns a complete `Response`, and `Stream` returns a typed `stream.StreamReader` of Core chunks plus a terminal result. Structured-output helpers extract one bounded JSON object and reject nil, ambiguous, malformed, non-object, or oversized representations. They never turn a missing assistant message into an empty success.

## Streaming {#streaming}

Codecs translate between provider wire formats and the shared request, response, and chunk contracts. The current released tree includes Anthropic, Bedrock Converse, Gemini, OpenAI Chat Completions, and OpenAI Responses codecs, plus wire framers for SSE, NDJSON, event streams, and JSON bodies. A stream reader owns the response until it is closed. Once a stream is handed to the caller, a mid-stream failure is terminal; the retry decorator only retries invocation or stream establishment.

## Gateway and routing {#gateway-and-routing}

`gateway.NewMux` maps an ingress API format and requested model alias to a fully bound `Target`, with exact route, format default, and global default precedence. `Strict` resolves only explicit registrations. `gateway.New` chooses one configured server codec, authenticates the gateway's inbound token, bounds request body and concurrency, and forwards to the target client. Inbound gateway authentication is separate from outbound provider authentication. A missing route, ambiguous codec, invalid model, unsupported feature, or concurrency limit returns a typed failure rather than falling through to an arbitrary provider.

## Runnable proof {#runnable-proof}

`stage-01-inference` invokes a fake client and asserts one request and one assistant block. `stage-02-streaming` accumulates deterministic text and its stop reason. `stage-22-model-gateway` exercises an Anthropic-shaped HTTP request, static token authentication, route aliasing, and strict unknown-route classification. Run them with `node scripts/docs/run-examples.mjs`. Native examples under `inference/examples` cover invoke, stream, retry, and gateway use.
