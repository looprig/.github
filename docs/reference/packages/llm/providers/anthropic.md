---
id: reference/packages/llm/providers/anthropic
title: anthropic package · providers/anthropic
description: Reference for the anthropic package at github.com/looprig/llm/providers/anthropic, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 260
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

# anthropic package · providers/anthropic

Import path: `github.com/looprig/llm/providers/anthropic`. Package anthropic provides a native Anthropic Messages API client. It keeps Anthropic's top-level system prompt, typed content blocks, tool_result/tool_use turns, thinking controls, and SSE lifecycle intact by delegating wire semantics to inference/codec/anthr

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CountContext`, `CounterCapability`, `Error`, `New`, `NewCounter`, `Unwrap`

### Types {#types}

`CacheControlOptions`, `Counter`, `CounterEndpointError`, `CounterEndpointReason`, `CounterRequestError`, `CounterRequestReason`, `CounterResponseError`, `CounterResponseField`, `CounterResponseFieldError`, `CounterResponseFieldReason`, `CounterResponseReason`, `CounterStateError`, `CounterStateReason`, `Option`, `ThinkingOptions`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The anthropic package exposes `CountContext`, `CounterCapability`, `New`, `NewCounter` as its main operations. The principal handle or value is `Counter`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CounterEndpointError`, `CounterRequestError`, `CounterResponseError`, `CounterResponseFieldError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/anthropic/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
