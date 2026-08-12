---
id: modules/workflows
title: Workflows
description: Define typed workflows, persist durable run records, supervise runs inside sessions, and expose workflow tools.
audience: developer
section: modules
order: 21
publication: source-workspace
proofs:
  repository: module-workflows
  description: module-workflows
  dependencies: module-workflows
  dependents: module-workflows
  where-it-fits: module-workflows
---

# Workflows

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/workflows` |
| Version | `v0.1.0` |
| GitHub | [looprig/workflows](https://github.com/looprig/workflows) |

## Description

Define typed workflows, persist durable run records, supervise runs inside sessions, and expose workflow tools.

## Where it fits

Workflows are useful on their own when an application needs typed, durable workflow definitions with interruption, recovery, supervision, and tool-facing controls. Within Looprig, the module combines [Flow](/docs/modules/flow), [Harness](/docs/modules/harness), [Inference](/docs/modules/inference), and [Storage](/docs/modules/storage). Workflows coordinate long-running business processes; Harness continues to own agent sessions and Flow continues to execute graphs.

## Dependencies

- [Core](/docs/modules/core)
- [Flow](/docs/modules/flow)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)
- [Storage](/docs/modules/storage)

## Dependents

None.
