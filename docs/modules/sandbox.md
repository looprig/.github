---
id: modules/sandbox
title: Sandbox
description: Turn an explicit access profile into the strongest confinement a supported host can prove.
audience: developer
section: modules
order: 12
publication: released
proofs:
  repository: release-github-com-looprig-sandbox
  description: release-github-com-looprig-sandbox
  dependencies: release-github-com-looprig-sandbox
  dependents: release-github-com-looprig-sandbox
  where-it-fits: release-github-com-looprig-sandbox
---

# Sandbox

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/sandbox` |
| Version | `v0.9.1` |
| GitHub | [looprig/sandbox](https://github.com/looprig/sandbox) |

## Description

Turn an explicit access profile into the strongest confinement a supported host can prove.

## Where it fits

Sandbox is useful on its own. Use it whenever a Go application needs to run a process with explicit filesystem, network, environment, and operating-system restrictions. The process does not need to be an agent or use any other Looprig module.

Within Looprig, Sandbox integrates with [Harness](/docs/modules/harness) and [Tools](/docs/modules/tools). Harness can apply a sandbox profile to session-owned processes, while process-based tools use the resulting executor to enforce the permitted access at the operating-system boundary. Sandbox defines the confinement boundary; Harness decides when work may run, gates decide whether it should run, and tools describe the requested operation.

## Dependencies

None.

## Dependents

None.
