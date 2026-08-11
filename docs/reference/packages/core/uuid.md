---
id: reference/packages/core/uuid
title: uuid package · uuid
description: Reference for the uuid package at github.com/looprig/core/uuid, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 4
publication: released
examples:
  - stage-01-inference
  - stage-02-streaming
proofs:
  package-role: release-github-com-looprig-core
  exported-surface: release-github-com-looprig-core
  functions-and-methods: release-github-com-looprig-core
  types: release-github-com-looprig-core
  constants-and-variables: release-github-com-looprig-core
  ownership-and-errors: release-github-com-looprig-core
  source-and-runnable-proof: release-github-com-looprig-core
---

# uuid package · uuid

Import path: `github.com/looprig/core/uuid`. Package uuid is a stdlib-only v4 UUID: type UUID [16]byte, New (v4 via crypto/rand), strict Parse/MustParse (8-4-4-4-12, errors.Is-able sentinel), String, IsZero, and MarshalText/UnmarshalText.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.5.1; pin that version in consumers and do not publish local workspace replacements.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `IsZero`, `MarshalText`, `String`, `UnmarshalText`, `Unwrap`

### Types {#types}

`GenerateError`, `ParseError`, `UUID`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The uuid package exposes `IsZero` as its main operations. Its exported typed failures include `GenerateError`, `ParseError`; classify them with errors.Is or errors.As. It does not own network, credential, or storage resources.

## Source and runnable proof {#source-and-runnable-proof}

Read the implementation and adjacent tests in the [core source tree](https://github.com/looprig/core/tree/v0.5.1/uuid/). The progressive entries `stage-01-inference` and `stage-02-streaming` exercise the content and streaming contracts; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-core`.
