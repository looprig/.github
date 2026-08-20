---
id: modules/flow
title: Flow
description: Build a graph once, compile it into an immutable runner, and resume from append-only checkpoints.
audience: developer
section: modules
order: 9
publication: released
proofs:
  repository: release-github-com-looprig-flow
  description: release-github-com-looprig-flow
  dependencies: release-github-com-looprig-flow
  dependents: release-github-com-looprig-flow
  where-it-fits: release-github-com-looprig-flow
---

# Flow

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/flow` |
| Version | `v0.4.0` |
| GitHub | [looprig/flow](https://github.com/looprig/flow) |

## Description

Build a graph once, compile it into an immutable runner, and resume from append-only checkpoints.

## Where it fits

Flow is useful on its own when a Go application needs compiled graphs, typed interruption, checkpointing, and resumable execution. Within Looprig, [Workflows](/docs/modules/workflows) builds durable workflow services on Flow, while [Flow Store](/docs/modules/flow-store) persists checkpoints. Flow owns graph execution, not agent sessions or the backing storage engine.

## Dependencies

- [Core](/docs/modules/core)

## Dependents

- [Flow Store](/docs/modules/flow-store)
- [Workflows](/docs/modules/workflows)
