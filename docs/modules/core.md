---
id: modules/core
title: Core
description: Construct user, system, assistant, and tool-result messages; carry text, media, reasoning, and tool calls; consume streaming chunks; and serialize the closed content model.
audience: developer
section: modules
order: 1
publication: released
proofs:
  repository: release-github-com-looprig-core
  description: release-github-com-looprig-core
  dependencies: release-github-com-looprig-core
  dependents: release-github-com-looprig-core
  where-it-fits: release-github-com-looprig-core
---

# Core

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/core` |
| Version | `v0.5.1` |
| GitHub | [looprig/core](https://github.com/looprig/core) |

## Description

Construct user, system, assistant, and tool-result messages; carry text, media, reasoning, and tool calls; consume streaming chunks; and serialize the closed content model.

## Where it fits

Core is the foundation for applications that need provider-neutral messages, content blocks, streaming chunks, usage values, logging, or UUIDs. Within Looprig, those types are shared by [Inference](/docs/modules/inference), [Harness](/docs/modules/harness), tools, stores, and user interfaces. Core defines common values without owning model transport or runtime lifecycle.

## Dependencies

None.

## Dependents

- [ACP](/docs/modules/acp)
- [Classifiers](/docs/modules/classifiers)
- [Client](/docs/modules/client)
- [Eval](/docs/modules/eval)
- [Flow](/docs/modules/flow)
- [Flow Store](/docs/modules/flow-store)
- [Foreign Loops](/docs/modules/foreignloops)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)
- [LLM](/docs/modules/llm)
- [MCP](/docs/modules/mcp)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
