---
id: modules/acp
title: ACP
description: Drive foreign ACP children or expose a Harness host through typed protocol, client, agent, launch, and stdio packages.
audience: developer
section: modules
order: 17
publication: released
proofs:
  repository: release-github-com-looprig-acp
  description: release-github-com-looprig-acp
  dependencies: release-github-com-looprig-acp
  dependents: release-github-com-looprig-acp
  where-it-fits: release-github-com-looprig-acp
---

# ACP

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/acp` |
| Version | `v0.3.0` |
| GitHub | [looprig/acp](https://github.com/looprig/acp) |

## Description

Drive foreign ACP children or expose a Harness host through typed protocol, client, agent, launch, and stdio packages.

## Where it fits

ACP is useful on its own when a Go application needs to drive an Agent Client Protocol process or expose its own host through ACP. Within Looprig, it connects [Foreign Loops](/docs/modules/foreignloops) and [Harness](/docs/modules/harness) to editors, coding agents, and other ACP-compatible clients. ACP owns the protocol and process boundary; the host still owns sessions, permissions, and model access.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)

## Dependents

- [Foreign Loops](/docs/modules/foreignloops)
