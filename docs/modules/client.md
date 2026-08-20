---
id: modules/client
title: Client
description: Provide a Go web handler, framework-neutral browser transport and state folding, live session support, and an optional Svelte adapter.
audience: developer
section: modules
order: 23
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
| Version | `v0.3.0` |
| GitHub | [looprig/client](https://github.com/looprig/client) |

## Description

Provide a Go web handler, framework-neutral browser transport and state folding, live session support, and an optional Svelte adapter.

## Where it fits

Client is useful on its own when a browser or Go web application needs a typed session transport, event folding, and live updates. Within Looprig, it adapts [Harness](/docs/modules/harness) sessions for framework-neutral web clients and the optional Svelte layer. Client presents runtime state; it does not own the agent loop or durable storage policy.

## Dependencies

- [Core](/docs/modules/core)
- [FSStore](/docs/modules/fsstore)
- [Harness](/docs/modules/harness)
- [NATSStore](/docs/modules/natsstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
