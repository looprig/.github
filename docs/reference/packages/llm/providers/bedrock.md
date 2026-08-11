---
id: reference/packages/llm/providers/bedrock
title: bedrock package · providers/bedrock
description: Reference for the bedrock package at github.com/looprig/llm/providers/bedrock, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 266
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions-and-methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants-and-variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# bedrock package · providers/bedrock

Import path: `github.com/looprig/llm/providers/bedrock`. Package bedrock is an AWS Bedrock Runtime client for Bedrock InvokeModel and native Converse/ConverseStream. It routes the selected native dialect to the corresponding model path and signs every request with AWS Signature Version 4. Credentials are AWS SigV4,

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CountContext`, `CounterCapability`, `Error`, `Invoke`, `New`, `NewCounter`, `Stream`, `Unwrap`

### Types {#types}

`BodyTransformError`, `CachePointOptions`, `Client`, `ConfigError`, `Counter`, `CounterEndpointError`, `CounterEndpointReason`, `CounterRequestError`, `CounterRequestReason`, `CounterResponseError`, `CounterResponseReason`, `CounterStateError`, `CounterStateReason`, `GuardrailOptions`, `Option`, `OptionError`, `PerformanceLatency`, `ReasoningOptions`, `RequestBuildError`, `ServiceTier`, `StreamingNotSupportedError`, `UnsupportedAPIFormatError`

### Constants and variables {#constants-and-variables}

`CachePointTTL1h`, `CachePointTTL5m`

## Ownership and errors {#ownership-and-errors}

The bedrock package exposes `CountContext`, `CounterCapability`, `Invoke`, `New` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `BodyTransformError`, `ConfigError`, `CounterEndpointError`, `CounterRequestError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/bedrock/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
