---
id: modules/harness
title: Harness
description: Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.
audience: developer
section: modules
order: 18
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
| Version | `v0.41.0` |
| GitHub | [looprig/harness](https://github.com/looprig/harness) |

## Description

Define a loop, assemble a Rig, run a session, observe its events, and shut it down cleanly with the Harness runtime.

## Where it fits

Harness is useful on its own when an application needs to turn model calls and tools into a session-oriented agent runtime. Within Looprig, it composes [Inference](/docs/modules/inference), [Storage](/docs/modules/storage), gates, workspaces, delegation, and tools behind Loops and Rigs. Its session journal and catalog are written in [SessionStore](/docs/modules/sessionstore)'s envelope and layout, so the backend needs every storage primitive plus bounded blob readers, as in [NATSStore](/docs/modules/natsstore) or [PGStore](/docs/modules/pgstore) with [S3Store](/docs/modules/s3store).

A Rig wired with `rig.WithToolResultObjects` keeps every tool result larger than the preview budget as a session object beside the journal, and the model pages it back with `read_tool_result` from [Tools](/docs/modules/tools). [Host](/docs/modules/host) runs Harness sessions for [Factory](/docs/modules/factory), and the older `pkg/serve` HTTP surface is deprecated in favor of Factory. Harness owns runtime coordination; applications still choose models, authority, persistence, and interfaces.

The `pkg/present` contract and `rig.WithMessagePresenter` let a product place bounded text around a human's message while journaling the chosen frame for restore. `loop.Unlimited` removes the per-turn iteration or call cap, and `hustle.WithTimeout(0)` removes a Hustle's execution deadline; caller and session cancellation still apply. See [Message presenter](/docs/guides/harness/commands/message-presenter) and [tool limits](/docs/guides/harness/loop/tools-and-tool-limits).

## Dependencies

- [Core](/docs/modules/core)
- [FSStore](/docs/modules/fsstore)
- [Inference](/docs/modules/inference)
- [SessionStore](/docs/modules/sessionstore)
- [Storage](/docs/modules/storage)

## Dependents

- [ACP](/docs/modules/acp)
- [Classifiers](/docs/modules/classifiers)
- [Client](/docs/modules/client)
- [Foreign Loops](/docs/modules/foreignloops)
- [Host](/docs/modules/host)
- [MCP](/docs/modules/mcp)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
