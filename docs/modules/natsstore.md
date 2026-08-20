---
id: modules/natsstore
title: NATSStore
description: Use NATS JetStream for durable storage primitives, with an optional confined embedded engine.
audience: developer
section: modules
order: 6
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
| Version | `v0.4.0` |
| GitHub | [looprig/natsstore](https://github.com/looprig/natsstore) |

## Description

Use NATS JetStream for durable storage primitives, with an optional confined embedded engine.

## Where it fits

NATSStore is useful on its own when a distributed Go application needs Looprig's storage contracts on NATS JetStream. Within Looprig, it provides a shared [Storage](/docs/modules/storage) backend for the [Client](/docs/modules/client) and other multi-process deployments. NATSStore owns JetStream mapping and optional embedded startup; callers own data semantics and server operations.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

- [Client](/docs/modules/client)
