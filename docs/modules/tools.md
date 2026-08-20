---
id: modules/tools
title: Tools
description: Provide prepared read, write, process, network, task, and skill capabilities with validation before effect.
audience: developer
section: modules
order: 15
publication: released
proofs:
  repository: release-github-com-looprig-tools
  description: release-github-com-looprig-tools
  dependencies: release-github-com-looprig-tools
  dependents: release-github-com-looprig-tools
  where-it-fits: release-github-com-looprig-tools
---

# Tools

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/tools` |
| Version | `v0.11.0` |
| GitHub | [looprig/tools](https://github.com/looprig/tools) |

## Description

Provide prepared read, write, process, network, task, and skill capabilities with validation before effect.

## Where it fits

Tools are useful on their own when an application needs prepared file, process, network, interaction, task, or skill operations with validation before effect. Within Looprig, [Harness](/docs/modules/harness) exposes them to loops, while [Sandbox](/docs/modules/sandbox) and gates can constrain process execution and sensitive effects. Tools describe and perform operations; the runtime owns admission, authority, and cleanup.

## Dependencies

- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
