---
id: reference/packages/secrets/contracttest
title: contracttest package · contracttest
description: Reference for the contracttest package at github.com/looprig/secrets/contracttest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 28
publication: released
proofs:
  package-role: release-github-com-looprig-secrets
  exported-surface: release-github-com-looprig-secrets
  functions-and-methods: release-github-com-looprig-secrets
  types: release-github-com-looprig-secrets
  constants-and-variables: release-github-com-looprig-secrets
  ownership-and-errors: release-github-com-looprig-secrets
  source-and-runnable-proof: release-github-com-looprig-secrets
---

# contracttest package · contracttest

Import path: `github.com/looprig/secrets/contracttest`. Package contracttest contains reusable contract checks for secrets.Store implementations. It intentionally inspects only the public secrets API.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`AssertListMetadata`, `ErrorText`, `RunList`, `RunStore`

### Types {#types}

`ContractOptions`, `StoreContractConfig`, `StoreContractOptions`, `StoreFactory`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The contracttest package exposes `AssertListMetadata`, `ErrorText`, `RunList`, `RunStore` as its main operations. The principal handle or value is `StoreContractConfig`; retain it according to its declaration before calling a terminal method. Use `RunList` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. Secret bytes remain sensitive, and the local store can report a visible but not durable commit.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/secrets/tree/v0.1.0/contracttest/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-secrets`.
