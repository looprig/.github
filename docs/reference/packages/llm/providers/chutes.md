---
id: reference/packages/llm/providers/chutes
title: chutes package · providers/chutes
description: Reference for the chutes package at github.com/looprig/llm/providers/chutes, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 268
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

# chutes package · providers/chutes

Import path: `github.com/looprig/llm/providers/chutes`. Package chutes is a Chutes end-to-end-encrypted, TEE-attested LLM client. It satisfies inference.Client and tunnels OpenAI chat completions through the Chutes /e2e/invoke API sealed with post-quantum ML-KEM-768 + ChaCha20-Poly1305.

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Invoke`, `Stream`

### Types {#types}

`AttestReason`, `Client`, `Option`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The chutes package exposes `Invoke`, `Stream` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/chutes/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
