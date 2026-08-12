---
id: modules/mcp
title: MCP
description: Consume, publish, and adopt MCP tools with explicit authentication, bounded failure handling, lifecycle, sampling, and reconfiguration.
audience: developer
section: modules
order: 19
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
| Version | `v0.6.2` |
| GitHub | [looprig/mcp](https://github.com/looprig/mcp) |

## Description

Consume, publish, and adopt MCP tools with explicit authentication, bounded failure handling, lifecycle, sampling, and reconfiguration.

## Where it fits

MCP is useful on its own when an application needs to consume or publish Model Context Protocol tools over supported transports. Within Looprig, it adopts remote tools into [Harness](/docs/modules/harness) and can expose prepared [Tools](/docs/modules/tools) to MCP clients. MCP owns protocol transport and discovery; the surrounding application owns authentication, authority, and lifecycle policy.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
