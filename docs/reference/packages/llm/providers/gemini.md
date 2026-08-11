---
id: reference/packages/llm/providers/gemini
title: gemini package · providers/gemini
description: Reference for the gemini package at github.com/looprig/llm/providers/gemini, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 277
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

# gemini package · providers/gemini

Import path: `github.com/looprig/llm/providers/gemini`. Package gemini is a bespoke client for Google's Gemini generateContent API. It satisfies inference.Client for both the non-streaming (generateContent) and streaming (streamGenerateContent, SSE) paths. Gemini is not plain OpenAI-over-HTTP: the model id lives in

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CountContext`, `CounterCapability`, `Error`, `Invoke`, `New`, `NewCounter`, `Stream`, `Unwrap`

### Types {#types}

`Client`, `Counter`, `CounterEndpointError`, `CounterEndpointReason`, `CounterRequestError`, `CounterRequestReason`, `CounterResponseError`, `CounterResponseField`, `CounterResponseFieldError`, `CounterResponseFieldReason`, `CounterResponseReason`, `CounterStateError`, `CounterStateReason`, `RequestBuildError`, `UnsupportedAPIFormatError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The gemini package exposes `CountContext`, `CounterCapability`, `Invoke`, `New` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CounterEndpointError`, `CounterRequestError`, `CounterResponseError`, `CounterResponseFieldError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/gemini/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
