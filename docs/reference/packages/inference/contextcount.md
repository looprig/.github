---
id: reference/packages/inference/contextcount
title: contextcount package · contextcount
description: Reference for the contextcount package at github.com/looprig/inference/contextcount, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 109
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
  - stage-22-model-gateway
proofs:
  package-role: release-github-com-looprig-inference
  exported-surface: release-github-com-looprig-inference
  functions-and-methods: release-github-com-looprig-inference
  types: release-github-com-looprig-inference
  constants-and-variables: release-github-com-looprig-inference
  ownership-and-errors: release-github-com-looprig-inference
  source-and-runnable-proof: release-github-com-looprig-inference
---

# contextcount package · contextcount

Import path: `github.com/looprig/inference/contextcount`. Package contextcount provides deterministic complete-request context counting.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Inference `v0.9.2` keeps model descriptors, request and response values, codec contracts, streams, retries, and gateway behavior independent of provider credentials.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`CompatibleCounter`, `CountContext`, `CounterCapability`, `Error`, `Unwrap`, `Validate`

### Types {#types}

`CapabilityField`, `CapabilityKind`, `CapabilityValidationError`, `CapabilityValidationReason`, `ContextCount`, `ContextCountError`, `ContextCountFunc`, `ContextCounter`, `ContextCounterFunc`, `CountQuality`, `CounterCapability`, `CounterCompatibilityError`, `CounterCompatibilityReason`, `CounterTransport`, `Estimator`, `EstimatorStateError`, `EstimatorStateReason`, `InferenceCapability`, `InferenceTransport`, `ModelIdentityError`, `ProviderID`, `RequestEncodingError`, `RetentionPosture`, `SecurityIdentity`, `TokenizerRevision`, `UnsupportedAPIFormatError`

### Constants and variables {#constants-and-variables}

`ErrContextCountCapabilityQualityMismatch`, `ErrContextCountFunctionMissing`, `ErrContextCountModelMismatch`, `ErrContextCountQualityInvalid`

## Ownership and errors {#ownership-and-errors}

The contextcount package exposes `CompatibleCounter`, `CountContext`, `CounterCapability`, `Validate` as its main operations. The principal handle or value is `ContextCounter`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `CapabilityValidationError`, `ContextCountError`, `CounterCompatibilityError`, `EstimatorStateError`; classify them with errors.Is or errors.As. Retries do not replay a stream after output has started.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/inference/tree/v0.9.2/contextcount/) and adjacent tests. The progressive entries `stage-01-inference`, `stage-02-streaming`, `stage-22-model-gateway` cover deterministic invoke, stream, and gateway paths; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-inference`.
