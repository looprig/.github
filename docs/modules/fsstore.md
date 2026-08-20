---
id: modules/fsstore
title: FSStore
description: Put the neutral storage primitives under one owner-only local directory with crash-aware recovery.
audience: developer
section: modules
order: 5
publication: released
proofs:
  repository: release-github-com-looprig-fsstore
  description: release-github-com-looprig-fsstore
  dependencies: release-github-com-looprig-fsstore
  dependents: release-github-com-looprig-fsstore
  where-it-fits: release-github-com-looprig-fsstore
---

# FSStore

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/fsstore` |
| Version | `v0.4.0` |
| GitHub | [looprig/fsstore](https://github.com/looprig/fsstore) |

## Description

Put the neutral storage primitives under one owner-only local directory with crash-aware recovery.

## Where it fits

FSStore is useful on its own when a Go application needs durable ledgers, key-value records, and blobs in an owner-controlled local directory. Within Looprig, it implements [Storage](/docs/modules/storage) for [Harness](/docs/modules/harness), [Flow Store](/docs/modules/flow-store), and local client deployments. FSStore chooses the filesystem backend; callers retain ownership of record meaning and retention policy.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

- [Client](/docs/modules/client)
- [Flow Store](/docs/modules/flow-store)
- [Harness](/docs/modules/harness)
