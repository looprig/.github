---
id: modules/mcp
title: MCP
description: Consume, publish, and adopt MCP tools with explicit authentication, bounded failure handling, lifecycle, sampling, and reconfiguration.
audience: developer
section: modules
order: 23
publication: released
proofs:
  repository: release-github-com-looprig-mcp
  description: release-github-com-looprig-mcp
  dependencies: release-github-com-looprig-mcp
  dependents: release-github-com-looprig-mcp
  where-it-fits: release-github-com-looprig-mcp
---

# MCP

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/mcp` |
| Version | `v0.7.2` |
| GitHub | [looprig/mcp](https://github.com/looprig/mcp) |

## Description

Consume, publish, and adopt MCP tools with explicit authentication, bounded failure handling, lifecycle, sampling, and reconfiguration.

## Where it fits

MCP is useful on its own when an application needs to consume Model Context Protocol servers over stdio, streamable HTTP, or the opt-in legacy SSE transport. Within Looprig, its optional adapter adopts remote tools into [Harness](/docs/modules/harness) Loops and turns server elicitation into Harness gates. A small server package lets a product publish its own tool handlers, such as a collaboration server injected into child agents. MCP owns protocol transport and discovery; the surrounding application owns authentication, authority, and lifecycle policy.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
