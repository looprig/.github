---
id: reference/packages/inference/transport
title: transport package · transport
description: Reference for the transport package at github.com/looprig/inference/transport, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 116
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

# transport package · transport

Import path: `github.com/looprig/inference/transport`. Package transport is a generic, connection-bound HTTP client for the inference seam. It composes an transport.Endpoint (connection identity), an route.Router (request routing), an codec.Codec (request encoding + response decoding), an OPTIONAL codec.StreamDeco

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `Invoke`, `InvokeWithAuth`, `InvokeWithAuthorizer`, `Stream`, `StreamWithAuth`, `StreamWithAuthorizer`, `Unwrap`

### Types {#types}

`Client`, `Endpoint`, `Option`, `RequestBuildError`, `UnsupportedStreamingError`

### Constants and variables {#constants-and-variables}

`MaxErrorResponseBodyBytes`, `MaxResponseBodyBytes`

## Ownership and errors {#ownership-and-errors}

The transport package exposes `Invoke`, `InvokeWithAuth`, `InvokeWithAuthorizer`, `Stream` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `RequestBuildError`, `UnsupportedStreamingError`, `MaxErrorResponseBodyBytes`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/transport/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
