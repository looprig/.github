---
id: reference/packages/llm/auto
title: auto package · auto
description: Reference for the auto package at github.com/looprig/llm/auto, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 203
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

# auto package · auto

Import path: `github.com/looprig/llm/auto`. Package auto is the composition root that selects and wires a concrete inference.Client for a validated Model. It imports every provider it can fully construct from (model, key) alone, so business logic depends only on the inference.Client interface - never on

## Package role {#package-role}

This package selects a provider client and credential path from a validated model descriptor. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `New`, `NewCounter`, `NewWithAuth`

### Types {#types}

`CredentialNotConstructibleError`, `Option`, `PolicyNotConstructibleError`, `SigV4NotConstructibleError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The auto package exposes `New`, `NewCounter`, `NewWithAuth` as its main operations. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CredentialNotConstructibleError`, `PolicyNotConstructibleError`, `SigV4NotConstructibleError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/auto/) and adjacent tests. The module's deterministic examples live under `llm/examples` and are run by the module's native test command; provider live probes remain opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
