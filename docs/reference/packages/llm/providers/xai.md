---
id: reference/packages/llm/providers/xai
title: xai package · providers/xai
description: Reference for the xai package at github.com/looprig/llm/providers/xai, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 344
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

# xai package · providers/xai

Import path: `github.com/looprig/llm/providers/xai`. Package xai provides xAI Chat Completions and Responses API clients. The selected model's APIFormat chooses the codec; this package owns xAI's endpoint, bearer authentication, options, and one native Responses reasoning stream-event alias.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`New`, `NewCounter`

### Types {#types}

`Option`, `ReasoningOptions`, `ServiceTier`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The xai package exposes `New`, `NewCounter` as its main operations. Use `New` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/xai/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
