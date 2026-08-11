---
id: reference/packages/llm/e2e
title: e2e package · e2e
description: Reference for the e2e package at github.com/looprig/llm/e2e, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 204
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

# e2e package · e2e

Import path: `github.com/looprig/llm/e2e`. Package e2e - shared end-to-end envelope primitives. ML-KEM-768 encapsulation, HKDF-SHA256 key derivation, ChaCha20-Poly1305 AEAD, and gzip, in the wire layout used by chutes. Each provider package owns its own discovery, attestation, transport, and stream han

## Package role {#package-role}

This package seals and opens bounded encrypted frames for an end-to-end transport. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`DeriveKey`, `Error`, `Open`, `OpenFrame`, `Seal`, `SealFrame`, `Unwrap`

### Types {#types}

`Error`

### Constants and variables {#constants-and-variables}

`KeySize`, `MLKEMCTSize`, `NonceSize`, `SaltSize`, `TagSize`, `ErrShortBlob`

## Ownership and errors {#ownership-and-errors}

The e2e package exposes `DeriveKey`, `Open`, `OpenFrame`, `Seal` as its main operations. Use `Open` as the package construction entry point when creating that value. Its exported typed failures include `Error`, `ErrShortBlob`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/e2e/) and adjacent tests. The module's deterministic examples live under `llm/examples` and are run by the module's native test command; provider live probes remain opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
