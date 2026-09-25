---
id: modules/pgstore
title: PGStore
description: Implement the Storage ledger, lease, key-value, and ordered-index primitives over PostgreSQL, built to run through transaction-mode connection poolers.
audience: developer
section: modules
order: 8
publication: released
proofs:
  repository: release-github-com-looprig-pgstore
  description: release-github-com-looprig-pgstore
  dependencies: release-github-com-looprig-pgstore
  dependents: release-github-com-looprig-pgstore
  where-it-fits: release-github-com-looprig-pgstore
---

# PGStore

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/pgstore` |
| Version | `v0.2.1` |
| GitHub | [looprig/pgstore](https://github.com/looprig/pgstore) |

## Description

Implement the Storage ledger, lease, key-value, and ordered-index primitives over PostgreSQL, built to run through transaction-mode connection poolers.

## Where it fits

PGStore is useful on its own when a Go service already runs PostgreSQL and needs durable append-only ledgers, renewable epoch leases, revisioned key-value records, or an ordered index with bounded cursors, without operating a separate coordination service. It suits multi-replica deployments where replicas share one database. Leases use row transactions with epoch and holder fences, and `Lost()` closes when ownership can no longer be proved. `Open` requires a DSN with verified TLS, and plaintext is allowed only for an explicitly enabled loopback test database. `Options.Migrations` chooses whether `Open` validates the embedded schema, applies it under a transaction-scoped lock, or leaves an externally managed schema alone. PGStore keeps no session-scoped server state: timeouts are applied per transaction, advisory locks are transaction-scoped, and prepared-statement caching is disabled, so it works behind a transaction-mode pooler such as PgBouncer. The measured pooler settings are documented in the repository's `docs/OPERATIONS.md`.

Within Looprig, PGStore implements the structured primitives of [Storage](/docs/modules/storage) and deliberately does not implement Blobs. A cloud composition pairs it with [S3Store](/docs/modules/s3store), and together they supply every primitive [SessionStore](/docs/modules/sessionstore) requires, which makes the pair a server-side alternative to [FSStore](/docs/modules/fsstore) and [NATSStore](/docs/modules/natsstore) for [Harness](/docs/modules/harness) and [Host](/docs/modules/host) deployments. PGStore owns the schema, pooling behaviour, fencing, and lost-acknowledgement resolution, where an append it cannot prove surfaces as `storage.AmbiguousError`. Callers own record meaning, retention, and schema ownership across deployments.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

None.
