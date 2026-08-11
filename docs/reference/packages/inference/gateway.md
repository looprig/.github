---
id: reference/packages/inference/gateway
title: gateway package · gateway
description: Reference for the gateway package at github.com/looprig/inference/gateway, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 111
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions-and-methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants-and-variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# gateway package · gateway

Import path: `github.com/looprig/inference/gateway`. Package gateway provides a local HTTP compatibility layer that lets coding-harness clients speaking different model-API dialects (Anthropic Messages, OpenAI Responses, OpenAI Chat Completions, Gemini) reach any injected inference.Client/model.Model target. Thi

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Binding`, `Close`, `Error`, `Is`, `Resolve`, `ResolveExact`, `ServeHTTP`, `Start`, `Unwrap`

### Types {#types}

`AmbiguousCodecMatchError`, `AuthenticationError`, `Authenticator`, `Binding`, `ConcurrencyLimitExceededError`, `Config`, `ConfigError`, `CountTokensUnavailableError`, `ExactResolver`, `FixedResolver`, `Handler`, `MethodNotAllowedError`, `Mux`, `NoMatchingCodecError`, `RequestTooLargeError`, `Resolver`, `ResponseEncodeError`, `RouteKey`, `RouteNotFoundError`, `Server`, `ServerConfig`, `ServerStateError`, `ShutdownTimeoutError`, `Target`, `UnknownRouteError`, `UnsupportedContentTypeError`, `UpstreamInvocationError`

### Constants and variables {#constants-and-variables}

`DefaultMaxConcurrent`, `DefaultMaxRequestBody`, `DefaultShutdownTimeout`

## Ownership and errors {#ownership-and-errors}

The gateway package exposes `Binding`, `Close`, `Resolve`, `ResolveExact` as its main operations. The principal handle or value is `AmbiguousCodecMatchError`; retain it according to its declaration before calling a terminal method. Use `Start` as the package construction entry point when creating that value. Its exported typed failures include `AmbiguousCodecMatchError`, `AuthenticationError`, `ConcurrencyLimitExceededError`, `ConfigError`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/gateway/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
