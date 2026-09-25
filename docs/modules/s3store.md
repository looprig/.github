---
id: modules/s3store
title: S3Store
description: Implement immutable Storage blobs over S3-compatible object stores with verified uploads, atomic manifests, and a bounded reader lifecycle.
audience: developer
section: modules
order: 9
publication: released
proofs:
  repository: release-github-com-looprig-s3store
  description: release-github-com-looprig-s3store
  dependencies: release-github-com-looprig-s3store
  dependents: release-github-com-looprig-s3store
  where-it-fits: release-github-com-looprig-s3store
---

# S3Store

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/s3store` |
| Version | `v0.2.1` |
| GitHub | [looprig/s3store](https://github.com/looprig/s3store) |

## Description

Implement immutable Storage blobs over S3-compatible object stores with verified uploads, atomic manifests, and a bounded reader lifecycle.

## Where it fits

S3Store is useful on its own when a Go service needs immutable, content-verified blobs in AWS S3 or an S3-compatible service such as MinIO, for example session artifacts or large tool outputs in a cloud deployment. `Put` streams while hashing, checks the committed length and SHA-256, then publishes a small manifest with `If-None-Match: *`, so an identical retry is a no-op and different bytes under the same key are a `BlobConflictError`. Tenants can share one bucket, separated by a deployment prefix. Encryption must be chosen explicitly, and HTTPS is mandatory outside an explicit loopback test option. `Close` on a reader returned by `Get` never waits for an in-flight `Read`: it tears down a stalled network read within the declared `BlobReaderCloseBound` of five seconds, a ceiling measured on loopback rather than a latency guarantee. `Read` is not safe against a concurrent `Read`, and the stream lives only as long as the context passed to `Get`.

Within Looprig, S3Store implements the Blobs primitive of [Storage](/docs/modules/storage) together with its optional bounded reader lifecycle, and nothing else. A cloud composition pairs it with [PGStore](/docs/modules/pgstore) for the structured primitives. The reader lifecycle is what lets it sit under [SessionStore](/docs/modules/sessionstore), whose `Open` rejects a Blobs provider without it, so S3Store is the blob provider for SessionStore-backed [Harness](/docs/modules/harness) and [Host](/docs/modules/host) deployments. S3Store owns key encoding, verified publication, encryption headers, and reader teardown. Callers own retention and cleanup, because it performs no orphan or garbage collection.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

None.
