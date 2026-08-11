---
id: reference/packages/rclonestore/rclonestore
title: rclonestore package
description: Reference for the rclonestore package at github.com/looprig/rclonestore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 54
publication: released
proofs:
  package-role: release-github-com-looprig-rclonestore
  exported-surface: release-github-com-looprig-rclonestore
  functions-and-methods: release-github-com-looprig-rclonestore
  types: release-github-com-looprig-rclonestore
  constants-and-variables: release-github-com-looprig-rclonestore
  ownership-and-errors: release-github-com-looprig-rclonestore
  source-and-runnable-proof: release-github-com-looprig-rclonestore
---

# rclonestore package

Import path: `github.com/looprig/rclonestore`. Package rclonestore implements storage.Blobs by driving the external rclone binary as a context-bounded subprocess (argv exec - never a shell string, never librclone/cgo).

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.2; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Close`, `Delete`, `Error`, `Get`, `List`, `Put`, `StoragePaths`, `Unwrap`

### Types {#types}

`BinaryError`, `Options`, `OptionsError`, `PersistencePathError`, `ProbeError`, `PutSourceError`, `RcloneError`, `Store`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The rclonestore package exposes `Close`, `Delete`, `Get`, `List` as its main operations. The principal handle or value is `Store`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `BinaryError`, `OptionsError`, `PersistencePathError`, `ProbeError`; classify them with errors.Is or errors.As. External rclone execution is not a multi-object transaction, and command errors are redacted.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/rclonestore/tree/v0.3.2/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run `GOWORK=off go test ./...` in the module and inspect the package tests. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-rclonestore`.
