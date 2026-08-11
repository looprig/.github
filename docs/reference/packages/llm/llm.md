---
id: reference/packages/llm/llm
title: llm package · llm
description: Reference for the llm package at github.com/looprig/llm, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 200
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

# llm package · llm

Import path: `github.com/looprig/llm`. Package llm is the batteries-included provider SDK layered on the neutral github.com/looprig/inference model-call contract. It owns the provider POLICY that inference deliberately does not carry: the known-provider registry, the provider/API-format truth table

## Package role {#package-role}

This root package defines provider labels, model authentication policy, and shared provider construction contracts. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Accepts`, `AuthPolicy`, `Descriptor`, `Error`, `Match`, `RequiredAuth`, `RequiresKey`, `Unwrap`, `Valid`, `Validate`, `ValidateModel`

### Types {#types}

`AttestationError`, `AuthBinding`, `AuthPolicy`, `AuthPolicyMismatchError`, `AuthRequiredError`, `CounterConstructor`, `CounterDirectConstructionError`, `CounterDirectConstructionReason`, `CounterSupportError`, `CounterSupportReason`, `InvalidAuthPolicyError`, `Provider`

### Constants and variables {#constants-and-variables}

`APIFormatBedrockConverse`, `AuthGCP`, `AuthOAuth`, `AuthServiceKey`, `AuthSigV4`, `AuthToken`

## Ownership and errors {#ownership-and-errors}

The llm package exposes `Accepts`, `AuthPolicy`, `Descriptor`, `Match` as its main operations. The principal handle or value is `CounterConstructor`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `AttestationError`, `AuthPolicyMismatchError`, `AuthRequiredError`, `CounterDirectConstructionError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/) and adjacent tests. The module's deterministic examples live under `llm/examples` and are run by the module's native test command; provider live probes remain opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
