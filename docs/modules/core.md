---
id: modules/core
title: Core
description: Construct messages and content blocks, consume streaming chunks, and share the sessionwire/v1 command, gate, publication, and HostLink wire records.
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
| Version | `v0.12.0` |
| GitHub | [looprig/core](https://github.com/looprig/core) |

## Description

Construct messages and content blocks, consume streaming chunks, and share the sessionwire/v1 command, gate, publication, and HostLink wire records.

## Where it fits

Core is the foundation for applications that need provider-neutral messages, content blocks, streaming chunks, usage values, logging, or UUIDs. Within Looprig, those types are shared by [Inference](/docs/modules/inference), [Harness](/docs/modules/harness), [Tools](/docs/modules/tools), stores, and user interfaces.

Core also owns `sessionwire/v1`, the transport-neutral session contract. It defines durable command requests, gate and publication records, and the HostLink records and framing that [Factory](/docs/modules/factory) and [Host](/docs/modules/host) exchange to attach, bind, drain, and deliver commands to resident sessions. [SessionStore](/docs/modules/sessionstore) persists those records, and [WUI](/docs/modules/wui) ships their JSON schemas to the browser. Core defines common values and wire shapes without owning model transport, runtime lifecycle, or network transport.

`sessionwire/v1.Principal` carries the Factory-verified tenant, subject, and actor or service kind; `MessageMetadata` carries client-defined string fields and is not identity. `HostLinkCapabilityAttributionPrincipal` names the `hostlink.attribution.principal` capability token, not an RPC method. Factory checks a Host's advertised token before sending attributed commands. See the [Message presenter](/docs/guides/harness/commands/message-presenter) guide for the runtime boundary.

## Dependencies

None.

## Dependents

- [ACP](/docs/modules/acp)
- [Classifiers](/docs/modules/classifiers)
- [Client](/docs/modules/client)
- [Controller](/docs/modules/controller)
- [Eval](/docs/modules/eval)
- [Factory](/docs/modules/factory)
- [Flow](/docs/modules/flow)
- [Flow Store](/docs/modules/flow-store)
- [Foreign Loops](/docs/modules/foreignloops)
- [Harness](/docs/modules/harness)
- [Host](/docs/modules/host)
- [Inference](/docs/modules/inference)
- [LLM](/docs/modules/llm)
- [MCP](/docs/modules/mcp)
- [SessionStore](/docs/modules/sessionstore)
- [Tools](/docs/modules/tools)
- [TUI](/docs/modules/tui)
- [Workflows](/docs/modules/workflows)
- [WUI](/docs/modules/wui)
