---
id: modules/harness
title: Harness
description: Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.
audience: developer
section: modules
order: 14
publication: released
proofs:
  repository: release-github-com-looprig-harness
  description: release-github-com-looprig-harness
  dependencies: release-github-com-looprig-harness
  dependents: release-github-com-looprig-harness
  where-it-fits: release-github-com-looprig-harness
---

# Harness

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/harness` |
| Version | `v0.28.0` |
| GitHub | [looprig/harness](https://github.com/looprig/harness) |

## Description

Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.

## Where it fits

Harness is useful on its own when an application needs to turn model calls and tools into a session-oriented agent runtime. Within Looprig, it composes [Inference](/docs/modules/inference), [Storage](/docs/modules/storage), gates, workspaces, delegation, and tools behind Loops and Rigs. Harness owns runtime coordination; applications still choose models, authority, persistence, and interfaces.

## Dependencies

- [Core](/docs/modules/core)
- [FSStore](/docs/modules/fsstore)
- [Inference](/docs/modules/inference)
- [Storage](/docs/modules/storage)

## Dependents

- [ACP](/docs/modules/acp)
- [Classifiers](/docs/modules/classifiers)
- [Client](/docs/modules/client)
- [Foreign Loops](/docs/modules/foreignloops)
- [MCP](/docs/modules/mcp)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
