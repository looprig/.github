---
id: reference/packages/llm/providers/google-vertex
title: vertex package · providers/google-vertex
description: Reference for the google-vertex package at github.com/looprig/llm/providers/google-vertex, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 281
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

# vertex package · providers/google-vertex

Import path: `github.com/looprig/llm/providers/google-vertex`. Package vertex provides Google Vertex AI's documented Gemini generateContent route and Anthropic Claude rawPredict route. It reuses the shared Gemini and Anthropic codecs; only Vertex routing, bearer authentication, and the Vertex-required anthropic_version fi

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `New`, `NewCounter`

### Types {#types}

`ConfigurationError`, `ConfigurationReason`, `CounterSupportError`, `Option`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The google-vertex package exposes `New`, `NewCounter` as its main operations. The principal handle or value is `CounterSupportError`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `ConfigurationError`, `CounterSupportError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/google-vertex/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
