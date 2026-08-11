---
id: reference/packages/llm/aci
title: aci package · aci
description: Reference for the aci package at github.com/looprig/llm/aci, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 201
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

# aci package · aci

Import path: `github.com/looprig/llm/aci`. Package aci implements a client for the Dstack private-ai-gateway "aci/1" confidential-inference protocol. This file defines the attestation failure reasons and the typed errors the package returns. Every attestation-chain failure is reported as the provider-n

## Package role {#package-role}

This package defines attested-client interfaces, canonical values, receipts, and reports. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; API keys, OAuth tokens, and signing credentials are injected through the credential boundary rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Canonicalize`, `CompactJSON`, `Error`, `Invoke`, `IsPinned`, `KeyAt`, `Len`, `New`, `ParseBodyValue`, `ParseReceipt`, `ParseReport`, `ParseValue`, `Set`, `Sha256Hex`, `Sha256HexBytes`, `Sha256Raw`, `Stream`, `ValueAt`, `VerifyReceipt`, `VerifyReport`

### Types {#types}

`Array`, `Attestation`, `Bool`, `Client`, `EventLogEntry`, `Evidence`, `Float`, `FloatNotAllowedError`, `FloatOutOfDomainError`, `Freshness`, `Int`, `InvalidUTF8Error`, `KeyCustody`, `KeyCustodyEntry`, `KeyEntry`, `Keyset`, `KeysetEndorsement`, `KeysetEpoch`, `NonFiniteFloatError`, `Null`, `Number`, `Object`, `Option`, `Policy`, `ProvenanceKey`, `PublicKey`, `Receipt`, `ReceiptEvent`, `ReceiptExpect`, `ReceiptSignature`, `Report`, `ServiceCapabilities`, `SourceProvenance`, `String`, `TLSBinding`, `Uint`, `UnpinnedPolicyError`, `Value`, `VerifiedReport`, `WorkloadIdentity`

### Constants and variables {#constants-and-variables}

`SupportedAPIVersion`

## Ownership and errors {#ownership-and-errors}

The aci package exposes `Canonicalize`, `CompactJSON`, `Invoke`, `IsPinned` as its main operations. The principal handle or value is `Client`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `FloatNotAllowedError`, `FloatOutOfDomainError`, `InvalidUTF8Error`, `NonFiniteFloatError`; classify them with errors.Is or errors.As. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/aci/) and adjacent tests. The module's deterministic examples live under `llm/examples` and are run by the module's native test command; provider live probes remain opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
