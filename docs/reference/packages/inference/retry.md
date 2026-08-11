---
id: reference/packages/inference/retry
title: retry package · retry
description: Reference for the retry package at github.com/looprig/inference/retry, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 113
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

# retry package · retry

Import path: `github.com/looprig/inference/retry`. Package retry decorates an inference.Client with bounded, classified retry and exponential backoff. It retries Invoke calls and Stream establishment only; once a StreamReader is handed out, a mid-stream failure is terminal for the wrapper exactly as for the in

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `Invoke`, `Retryable`, `Stream`, `Unwrap`, `Validate`

### Types {#types}

`Client`, `ConfigError`, `ExhaustedError`, `InvalidResponseError`, `Policy`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The retry package exposes `Invoke`, `Retryable`, `Stream`, `Validate` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `ConfigError`, `ExhaustedError`, `InvalidResponseError`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/retry/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
