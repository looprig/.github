---
id: build/01-model-access
title: Build 01: model access
description: Assemble a provider-neutral model client with explicit credentials, policy, streaming, and retry boundaries.
audience: developer
section: build
order: 1
publication: released
examples:
  - stage-01-inference
  - stage-22-model-gateway
proofs:
  boundary:
    - release-github-com-looprig-inference
    - release-github-com-looprig-llm
    - release-github-com-looprig-credentials
  composition:
    - release-github-com-looprig-inference
    - release-github-com-looprig-llm
  lifecycle:
    - release-github-com-looprig-inference
  errors-and-limits:
    - release-github-com-looprig-inference
    - release-github-com-looprig-credentials
  runnable-proof:
    - release-github-com-looprig-inference
---

# Build 01: model access

Begin at the `inference` boundary when the application needs one request and one response shape across providers. Add `llm` when the application also needs provider selection, credential lookup, or policy. Keep `credentials` and `secrets` behind those boundaries so model calls do not become a reason to pass secret bytes through application code.

## Boundary {#boundary}

`model.Model`, `inference.Request`, and `inference.Response` describe the provider-neutral call. A `model.Model` supplies an ID, capabilities, and limits; a `Request` carries messages, optional tools, and call options; a `Response` carries the assistant message, usage, finish information, and provider metadata. `Client.Invoke` is the one-shot operation and `Client.Stream` returns a reader for incremental chunks.

`llm` is a policy and construction layer. Its `AuthPolicy` controls whether a provider may use an explicit credential, a named credential source, or no credential. `auto.New` chooses a provider from the configured model and `auto.NewWithAuth` makes that credential decision explicit. The resulting client still exposes the `inference.Client` contract, so the rest of the loop does not need provider-specific request types.

## Composition {#composition}

Compose the layers in this order: construct or validate a model, choose credentials through `llm` or `credentials`, create an inference client, then hand the client to the application loop or gateway. `secrets` stores opaque secret values; `credentials` resolves a provider-facing source; `llm` applies policy; `inference` performs the protocol exchange. This arrangement lets tests use a deterministic transport without changing the application-facing request shape.

Do not make a provider package responsible for application authorization or storage. Provider constructors own request translation and transport configuration. The caller owns the request, the client, and the decision to persist a response.

## Lifecycle {#lifecycle}

Create a client once for a configured transport and reuse it for the calls that share that transport. Close the client when its declaration exposes `Close`, and close a stream reader after consuming or abandoning it. A stream has a terminal result separate from its chunks; read through that terminal result before treating the turn as complete. Credential sources and secret stores have their own close or cleanup operation and should outlive the clients that resolve through them.

## Errors and limits {#errors-and-limits}

Validate a model before sending a request so unsupported capabilities and invalid limits fail locally. Use `errors.Is` and `errors.As` for inference, credential, and provider errors. Retry behavior is intentionally narrow: inference retries establishment failures according to its configured policy, but it does not replay an already-started stream or hide a partial response. Provider-specific errors may contain status or request metadata; do not log credential material.

## Runnable proof {#runnable-proof}

`stage-01-inference` is the deterministic one-call path and asserts the assistant content produced by the released Core and Inference modules. `stage-22-model-gateway` adds the gateway boundary and asserts alias routing, upstream identity, and strict handling of an unknown alias. Run both through `node scripts/docs/run-examples.mjs`; the source implementation is pinned in the [Inference release tree](https://github.com/looprig/inference/tree/v0.9.2/) and [LLM release tree](https://github.com/looprig/llm/tree/v0.13.3/). Precise source and test proof IDs for this build page remain a Task15 evidence-promotion gap.
