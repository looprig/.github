---
id: reference/packages/inference/wire/jsonbody
title: jsonbody package · wire/jsonbody
description: Reference for the jsonbody package at github.com/looprig/inference/wire/jsonbody, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 119
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

# jsonbody package · wire/jsonbody

Import path: `github.com/looprig/inference/wire/jsonbody`. Package jsonbody holds small stdlib helpers for JSON HTTP bodies: marshal a value into a request-body reader (with its content type) and unmarshal response bytes back into a value. It is byte-level wire framing only - it knows nothing about LLM messages, tools

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Decode`, `Encode`, `Error`, `Unwrap`

### Types {#types}

`DecodeError`, `EncodeError`

### Constants and variables {#constants-and-variables}

`ContentType`

## Ownership and errors {#ownership-and-errors}

The jsonbody package exposes `Decode`, `Encode` as its main operations. Its exported typed failures include `DecodeError`, `EncodeError`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/wire/jsonbody/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
