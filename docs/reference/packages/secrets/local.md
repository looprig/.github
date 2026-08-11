---
id: reference/packages/secrets/local
title: local package · local
description: Reference for the local package at github.com/looprig/secrets/local, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 29
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

# local package · local

Import path: `github.com/looprig/secrets/local`. Package local implements an owner-only, descriptor-relative local secret store. The root is always supplied explicitly by the caller.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Close`, `Delete`, `Error`, `Filename`, `Is`, `List`, `Put`, `Reference`, `Resolve`, `Root`, `SupportsCompareAndSwap`, `SupportsCreateOnly`, `Unwrap`, `Visible`

### Types {#types}

`CommitVisibleDurabilityUnknownError`, `DurabilityUnknownError`, `Hooks`, `Options`, `PageTokenExpiredError`, `Store`, `UnsupportedPlatformError`

### Constants and variables {#constants-and-variables}

`ErrCommitVisibleDurabilityUnknown`, `ErrDurabilityUnknown`, `ErrListTooLarge`, `ErrPageTokenExpired`, `ErrUnsupportedPlatform`

## Ownership and errors {#ownership-and-errors}

The local package exposes `Close`, `Delete`, `Filename`, `List` as its main operations. The principal handle or value is `Store`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `CommitVisibleDurabilityUnknownError`, `DurabilityUnknownError`, `PageTokenExpiredError`, `UnsupportedPlatformError`; classify them with errors.Is or errors.As. Secret bytes remain sensitive, and the local store can report a visible but not durable commit.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/secrets/tree/v0.1.0/local/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-secrets`.
