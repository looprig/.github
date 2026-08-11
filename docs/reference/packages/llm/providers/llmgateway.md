---
id: reference/packages/llm/providers/llmgateway
title: llmgateway package · providers/llmgateway
description: Reference for the llmgateway package at github.com/looprig/llm/providers/llmgateway, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 321
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

# llmgateway package · providers/llmgateway

Import path: `github.com/looprig/llm/providers/llmgateway`. Package llmgateway provides LLM Gateway's documented OpenAI Chat and Anthropic Messages proxy endpoints.

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

The llmgateway package exposes `New`, `NewCounter` as its main operations. The principal handle or value is `CounterSupportError`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CounterSupportError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/llmgateway/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
