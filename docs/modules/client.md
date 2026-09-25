---
id: modules/client
title: Client
description: Provide a Go web handler, framework-neutral browser transport and state folding, live session support, and an optional Svelte adapter.
audience: developer
section: modules
order: 28
publication: released
proofs:
  repository: release-github-com-looprig-client
  description: release-github-com-looprig-client
  dependencies: release-github-com-looprig-client
  dependents: release-github-com-looprig-client
  where-it-fits: release-github-com-looprig-client
---

# Client

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/client` |
| Version | `v0.4.0` |
| GitHub | [looprig/client](https://github.com/looprig/client) |

## Description

Provide a Go web handler, framework-neutral browser transport and state folding, live session support, and an optional Svelte adapter.

## Where it fits

Client is useful on its own when a browser or Go web application needs a typed session transport, event folding, and live updates. Within Looprig, it serves [Harness](/docs/modules/harness) sessions through Harness's older `pkg/serve` read contract to framework-neutral web clients and the reference Svelte app, storing data through [FSStore](/docs/modules/fsstore) or [NATSStore](/docs/modules/natsstore). A new [Factory](/docs/modules/factory) deployment should use [WUI](/docs/modules/wui) instead, because Client does not speak Factory's contract. Client presents runtime state; it does not own the agent loop or durable storage policy.

## Dependencies

- [Core](/docs/modules/core)
- [FSStore](/docs/modules/fsstore)
- [Harness](/docs/modules/harness)
- [NATSStore](/docs/modules/natsstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
