---
id: modules/workflows
title: Workflows
description: Define typed workflows, persist durable run records, supervise runs inside sessions, and expose workflow tools.
audience: developer
section: modules
order: 24
publication: released
proofs:
  repository: release-github-com-looprig-workflows
  description: release-github-com-looprig-workflows
  dependencies: release-github-com-looprig-workflows
  dependents: release-github-com-looprig-workflows
  where-it-fits: release-github-com-looprig-workflows
---

# Workflows

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/workflows` |
| Version | `v0.1.2` |
| GitHub | [looprig/workflows](https://github.com/looprig/workflows) |

## Description

Define typed workflows, persist durable run records, supervise runs inside sessions, and expose workflow tools.

## Where it fits

Workflows are useful on their own when an application needs typed, durable workflow definitions with interruption, recovery, supervision, and tool-facing controls. Within Looprig, the module combines [Flow](/docs/modules/flow), [Harness](/docs/modules/harness), and [Storage](/docs/modules/storage), with [Flow Store](/docs/modules/flow-store) as the usual checkpoint adapter. A supervisor registered as a Harness session resource stops its runs when the session shuts down. Workflows coordinate long-running business processes; Harness continues to own agent sessions and Flow continues to execute graphs.

## Dependencies

- [Core](/docs/modules/core)
- [Flow](/docs/modules/flow)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

None.
