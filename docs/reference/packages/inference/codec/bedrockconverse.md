---
id: reference/packages/inference/codec/bedrockconverse
title: bedrockconverse package · codec/bedrockconverse
description: Reference for the bedrockconverse package at github.com/looprig/inference/codec/bedrockconverse, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 104
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

# bedrockconverse package · codec/bedrockconverse

Import path: `github.com/looprig/inference/codec/bedrockconverse`. This public package defines one part of the provider-neutral inference API.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`DecodeResponse`, `DecodeStream`, `EncodeCountTokensInput`, `EncodeRequest`, `Error`, `Unwrap`

### Types {#types}

`Codec`, `DecodeError`, `EncodeError`, `StreamAPIError`, `StreamDecodeError`, `ToolInputError`, `ToolSchemaError`, `UnsupportedBlockError`, `UnsupportedConversationError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The bedrockconverse package exposes `DecodeResponse`, `DecodeStream`, `EncodeCountTokensInput`, `EncodeRequest` as its main operations. The principal handle or value is `Codec`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `DecodeError`, `EncodeError`, `StreamAPIError`, `StreamDecodeError`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/codec/bedrockconverse/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
