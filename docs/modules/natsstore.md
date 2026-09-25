---
id: modules/natsstore
title: NATSStore
description: Use NATS JetStream for all five durable storage primitives, including bounded blob readers, with an optional confined embedded engine.
audience: developer
section: modules
order: 7
publication: released
proofs:
  repository: release-github-com-looprig-natsstore
  description: release-github-com-looprig-natsstore
  dependencies: release-github-com-looprig-natsstore
  dependents: release-github-com-looprig-natsstore
  where-it-fits: release-github-com-looprig-natsstore
---

# NATSStore

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/natsstore` |
| Version | `v0.5.3` |
| GitHub | [looprig/natsstore](https://github.com/looprig/natsstore) |

## Description

Use NATS JetStream for all five durable storage primitives, including bounded blob readers, with an optional confined embedded engine.

## Where it fits

NATSStore is useful on its own when a distributed Go application needs Looprig's storage contracts on NATS JetStream. Within Looprig, it is a single backend that satisfies every [Storage](/docs/modules/storage) primitive and the bounded blob reader lifecycle, so it can back a [SessionStore](/docs/modules/sessionstore) and the [Harness](/docs/modules/harness) session store alone. It is also the shared backend for multi-process [Client](/docs/modules/client) deployments. NATSStore owns JetStream mapping and optional embedded startup; callers own data semantics and server operations.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

- [Client](/docs/modules/client)
