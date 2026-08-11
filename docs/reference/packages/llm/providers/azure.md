---
id: reference/packages/llm/providers/azure
title: azure package · providers/azure
description: Reference for the azure package at github.com/looprig/llm/providers/azure, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 263
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

# azure package · providers/azure

Import path: `github.com/looprig/llm/providers/azure`. Package azure provides an Azure OpenAI Responses API client. It keeps Azure's resource endpoint and api-key authentication separate while delegating the common request, response, tool, usage, and SSE semantics to inference's shared OpenAI Responses codec and n

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `New`, `NewCounter`

### Types {#types}

`Option`, `ReasoningOptions`, `ResourceConfigurationError`, `ResourceConfigurationReason`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The azure package exposes `New`, `NewCounter` as its main operations. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `ResourceConfigurationError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/azure/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
