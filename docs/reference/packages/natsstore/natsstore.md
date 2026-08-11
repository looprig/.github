---
id: reference/packages/natsstore/natsstore
title: natsstore package
description: Reference for the natsstore package at github.com/looprig/natsstore, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 26
publication: released
proofs:
  package-role: release-github-com-looprig-natsstore
  exported-surface: release-github-com-looprig-natsstore
  functions-and-methods: release-github-com-looprig-natsstore
  types: release-github-com-looprig-natsstore
  constants-and-variables: release-github-com-looprig-natsstore
  ownership-and-errors: release-github-com-looprig-natsstore
  source-and-runnable-proof: release-github-com-looprig-natsstore
---

# natsstore package

Import path: `github.com/looprig/natsstore`. Package natsstore implements storage's storage primitives over NATS JetStream and owns an embedded, in-process JetStream server (no TCP socket) over a persistent on-disk StoreDir, so a single process gets a durable JetStream backend with no external broker. Th

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.1; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Backend`, `Close`, `Conn`, `Error`, `JetStream`, `StoragePaths`, `Unwrap`

### Types {#types}

`BlobOpError`, `ConnectError`, `Engine`, `EngineOptions`, `KVOpError`, `LeaseEncodeError`, `LeaseOpError`, `LockedEngine`, `NameEncodingError`, `Options`, `OptionsError`, `RecordReadError`, `ServerStartError`, `Store`, `StoreDirError`, `StoreLockError`, `StoreLockedError`, `StreamOpError`, `WiringError`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The natsstore package exposes `Backend`, `Close`, `Conn`, `JetStream` as its main operations. The principal handle or value is `Engine`; retain it according to its declaration before calling a terminal method. Its exported typed failures include `BlobOpError`, `ConnectError`, `KVOpError`, `LeaseEncodeError`; classify them with errors.Is or errors.As. Server availability, stream setup, and connection ownership remain deployment responsibilities.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/natsstore/tree/v0.3.1/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-natsstore`.
