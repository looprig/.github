---
id: reference/packages/storage/memstore
title: memstore package · memstore
description: Reference for the memstore package at github.com/looprig/storage/memstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 31
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

# memstore package · memstore

Import path: `github.com/looprig/storage/memstore`. Package memstore is the in-memory reference backend for storage's four primitives. It is the conformance oracle other backends are checked against: correct, allocation-simple, and dependency-free. Because the four primitives have colliding method names (Ledger

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`New`

### Types {#types}

None reported.

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The memstore package exposes `New` as its main operations. Use `New` as the package construction entry point when creating that value. No package-specific error type is exported here; use the owning contract or helper return error rather than parsing diagnostic text. The contract leaves backend durability and retry semantics to the selected implementation.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/storage/tree/v0.3.1/memstore/) and adjacent tests. The progressive manifest entries `stage-10-workspace` exercise this area; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-storage`.
