---
id: modules/fsstore
title: FSStore
description: Put the five neutral storage primitives under one owner-only local directory with crash-aware recovery and a v0.6.0 layout that refuses older roots.
audience: developer
section: modules
order: 6
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
| Version | `v0.6.0` |
| GitHub | [looprig/fsstore](https://github.com/looprig/fsstore) |

## Description

Put the five neutral storage primitives under one owner-only local directory with crash-aware recovery and a v0.6.0 layout that refuses older roots.

## Where it fits

FSStore is useful on its own when a Go application needs a durable ledger, leases, key-value records, blobs, and ordered indexes in one owner-controlled local directory. Within Looprig, it implements [Storage](/docs/modules/storage) for local [Client](/docs/modules/client) deployments and the Carbon coding agent. It is also the filesystem conformance backend in [Harness](/docs/modules/harness) and [Flow Store](/docs/modules/flow-store) tests.

v0.6.0 changed the on-disk layout so a name and its "/" extension can coexist, and it ships no migration. `Open` refuses a root written by an earlier release with an error matching `ErrLegacyLayout`. Move or delete that directory rather than retrying, and never roll a v0.6.0 root back to an older release, which misreads it as empty. Its Blobs deliberately omit the bounded reader lifecycle, so [SessionStore](/docs/modules/sessionstore) refuses a plain FSStore composite. FSStore chooses the filesystem backend; callers retain ownership of record meaning and retention policy.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

- [Client](/docs/modules/client)
- [Flow Store](/docs/modules/flow-store)
- [Harness](/docs/modules/harness)
