---
id: reference/packages/fsstore/fsstore
title: fsstore package
description: Reference for the fsstore package at github.com/looprig/fsstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 25
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-fsstore
  exported-surface: release-github-com-looprig-fsstore
  functions-and-methods: release-github-com-looprig-fsstore
  types: release-github-com-looprig-fsstore
  constants-and-variables: release-github-com-looprig-fsstore
  ownership-and-errors: release-github-com-looprig-fsstore
  source-and-runnable-proof: release-github-com-looprig-fsstore
---

# fsstore package

Import path: `github.com/looprig/fsstore`. This public package defines one part of the module API.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.2; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Backend`, `Close`, `Error`, `IsCorrupt`, `IsTorn`, `StoragePaths`, `Unwrap`

### Types {#types}

`BlobIOError`, `BlobPathError`, `BlobRootError`, `FlockError`, `FrameError`, `FrameFault`, `KVCorruptError`, `KVIOError`, `KVPathError`, `KVRootError`, `LeaseCorruptError`, `LeaseIOError`, `LeasePathError`, `LeaseRootError`, `LedgerCorruptError`, `LedgerIOError`, `LedgerPathError`, `LedgerRootError`, `Options`, `OptionsError`, `Store`

### Constants and variables {#constants-and-variables}

`MaxFramePayload`

## Ownership and errors {#ownership-and-errors}

The fsstore package exposes `Backend`, `Close`, `IsCorrupt`, `IsTorn` as its main operations. The principal handle or value is `Store`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `BlobIOError`, `BlobPathError`, `BlobRootError`, `FlockError`; classify them with errors.Is or errors.As. The root is explicit, and frame faults distinguish torn input from corrupt input.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/fsstore/tree/v0.3.2/) and adjacent tests. The progressive manifest entries `stage-08-session-store`, `stage-09-restore` exercise this area; run them with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-fsstore`.
