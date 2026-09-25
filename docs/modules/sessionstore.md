---
id: modules/sessionstore
title: SessionStore
description: Keep durable session state for Looprig services, covering catalog, journal, commands, gates, residency, and Host placement records over the Storage contract.
audience: developer
section: modules
order: 11
publication: released
proofs:
  repository: release-github-com-looprig-sessionstore
  description: release-github-com-looprig-sessionstore
  dependencies: release-github-com-looprig-sessionstore
  dependents: release-github-com-looprig-sessionstore
  where-it-fits: release-github-com-looprig-sessionstore
---

# SessionStore

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/sessionstore` |
| Version | `v0.14.0` |
| GitHub | [looprig/sessionstore](https://github.com/looprig/sessionstore) |

## Description

Keep durable session state for Looprig services, covering catalog, journal, commands, gates, residency, and Host placement records over the Storage contract.

## Where it fits

SessionStore is useful on its own when several processes must share one durable record of each agent session without calling each other. Typical cases are a multi-tenant hosted agent service whose front-end replicas and runtime hosts are deployed separately, and a system that places each session on a dedicated worker. It keeps a tenant-scoped catalog of sessions and their desired placement, fenced journals, and an immutable, ordered command inbox that runtimes claim and settle from recorded evidence, with a durable cursor for consumers. It also stores open approval gates, residency grants, a Host registry, and the recorded outcome when a placement's workload ends.

Within Looprig, SessionStore is the shared contract between [Factory](/docs/modules/factory) and [Host](/docs/modules/host). Factory writes catalog entries, admits commands, and reads gates and journals. A Host acquires residency, claims and settles commands, and publishes the gates its runtime opens. [Controller](/docs/modules/controller) reads desired placement and records how a workload ended, and [Harness](/docs/modules/harness) writes its runtime journal in SessionStore's envelope format. SessionStore is built only from [Core](/docs/modules/core) wire records and [Storage](/docs/modules/storage) primitives. The backend's Blobs provider must implement Storage's bounded reader lifecycle, so `Open` refuses [FSStore](/docs/modules/fsstore) Blobs, while [S3Store](/docs/modules/s3store), [NATSStore](/docs/modules/natsstore), and Storage's memory backend qualify.

SessionStore owns fencing, ordering, and durable encoding. Callers own transport, authentication, the backend they open, and the decision about which records to write.

Since v0.14.0, disposition descriptors and public creates can retain an optional `Principal` and create/input `Metadata`. The store validates their shape and preserves their bytes; it does not verify a sender. Once an attributed version-3 disposition row is written, every Factory and Host reading that store needs SessionStore v0.14.0 or later: older readers refuse the row, so rolling back wedges command consumption.

## Dependencies

- [Core](/docs/modules/core)
- [Storage](/docs/modules/storage)

## Dependents

- [Controller](/docs/modules/controller)
- [Factory](/docs/modules/factory)
- [Harness](/docs/modules/harness)
- [Host](/docs/modules/host)
- [Workflows](/docs/modules/workflows)
