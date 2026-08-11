---
id: reference/packages/storage/storetest
title: storetest package · storetest
description: Reference for the storetest package at github.com/looprig/storage/storetest, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 32
publication: released
examples:
  - stage-10-workspace
proofs:
  package-role: release-github-com-looprig-storage
  exported-surface: release-github-com-looprig-storage
  functions-and-methods: release-github-com-looprig-storage
  types: release-github-com-looprig-storage
  constants-and-variables: release-github-com-looprig-storage
  ownership-and-errors: release-github-com-looprig-storage
  source-and-runnable-proof: release-github-com-looprig-storage
---

# storetest package · storetest

Import path: `github.com/looprig/storage/storetest`. Package storetest provides backend-conformance suites for the four storage primitives - Ledger, Leaser, KV, and Blobs. A backend's own _test.go calls TestLedger/TestLeaser/TestKV/TestBlobs with a factory that returns a fresh, empty primitive; the suite drives

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`TestBlobs`, `TestKV`, `TestLeaser`, `TestLedger`

### Types {#types}

None reported.

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The storetest package exposes `TestBlobs`, `TestKV`, `TestLeaser`, `TestLedger` as its main operations. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. The contract leaves backend durability and retry semantics to the selected implementation.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/storage/tree/v0.3.1/storetest/) and adjacent tests. The progressive manifest entries `stage-10-workspace` exercise this area; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-storage`.
