---
id: build/07-inference-gateway
title: Build 07: inference gateway
description: Put a strict, authenticated model gateway in front of one or more inference clients without changing the request vocabulary.
audience: developer
section: build
order: 7
publication: released
examples:
  - stage-22-model-gateway
proofs:
  boundary:
    - release-github-com-looprig-inference
  composition:
    - release-github-com-looprig-inference
  routing-boundary:
    - release-github-com-looprig-inference
  request-and-stream-lifecycle:
    - release-github-com-looprig-inference
  lifecycle:
    - release-github-com-looprig-inference
  errors-and-limits:
    - release-github-com-looprig-inference
  runnable-proof:
    - release-github-com-looprig-inference
---

# Build 07: inference gateway

Use the gateway package when several callers need one HTTP-facing boundary for provider-neutral inference clients. Keep model construction and credentials on the server side, and make routing and authentication explicit at the gateway edge.

## Routing boundary {#routing-boundary}

`gateway.NewMux` and the gateway constructors register aliases for inference clients. A request selects an alias, the gateway resolves that alias, and the selected client performs the provider call. `Strict` routing rejects unknown aliases rather than silently choosing a default. `StaticToken` supplies a simple authentication policy for controlled deployments; it is not a user identity or tenant system.

## Request and stream lifecycle {#request-and-stream-lifecycle}

The gateway translates the HTTP request into the same `inference.Request` used by an in-process caller. A one-shot response can be encoded after `Invoke`; a stream must remain attached to its reader until the terminal result is observed or the request is canceled. The gateway owns request-scoped transport state, while the registered clients remain long-lived resources owned by the server.

## Composition {#composition}

Register clients that already enforce model capabilities, credential policy, and provider translation. Use the gateway for alias routing, authentication, request limits, and transport presentation. Keep authorization beyond a static token in the surrounding service, where identity, tenancy, and audit policy are available.

## Errors and limits {#errors-and-limits}

Reject malformed requests, missing or invalid tokens, unknown aliases, unsupported operations, and upstream inference failures with their distinct response classes. Do not turn an upstream partial stream into a successful complete response. Bound request and response sizes at the server configuration and preserve provider error redaction when forwarding diagnostics.

## Runnable proof {#runnable-proof}

`stage-22-model-gateway` asserts alias routing, upstream model identity, and strict rejection of an unknown alias. Run it with `node scripts/docs/run-examples.mjs`; source is pinned in the [Inference gateway tree](https://github.com/looprig/inference/tree/v0.9.2/gateway/). The referenced package pages list the pinned source files and adjacent tests used for this boundary.
