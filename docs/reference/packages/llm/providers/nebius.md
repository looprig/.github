---
id: reference/packages/llm/providers/nebius
title: nebius package · providers/nebius
description: Reference for the nebius package at github.com/looprig/llm/providers/nebius, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 324
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

# nebius package · providers/nebius

Import path: `github.com/looprig/llm/providers/nebius`. Package nebius provides the documented nebius OpenAI-compatible API.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`New`, `NewCounter`

### Types {#types}

`CounterSupportError`, `Option`

### Constants and variables {#constants-and-variables}

`DefaultBaseURL`

## Ownership and errors {#ownership-and-errors}

The nebius package exposes `New`, `NewCounter` as its main operations. The principal handle or value is `CounterSupportError`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CounterSupportError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/nebius/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
