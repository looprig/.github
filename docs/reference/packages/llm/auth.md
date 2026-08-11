---
id: reference/packages/llm/auth
title: auth package · auth
description: Reference for the auth package at github.com/looprig/llm/auth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 202
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

# auth package · auth

Import path: `github.com/looprig/llm/auth`. Package auth provides access to user-provided authentication credentials.

## Package role {#package-role}

This support package is part of LLM model access and is intended to be composed by the root or provider packages. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`AddCredentials`

### Types {#types}

None reported.

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The auth package exposes `AddCredentials` as its main operations. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/auth/) and adjacent tests. The module's deterministic examples live under `llm/examples` and are run by the module's native test command; provider live probes remain opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
