---
id: modules/foreignloops
title: Foreign Loops
description: Adapt ACP, Claude, and Codex processes to Harness through neutral driver contracts and restorable builders.
audience: developer
section: modules
order: 22
publication: released
proofs:
  repository: release-github-com-looprig-foreignloops
  description: release-github-com-looprig-foreignloops
  dependencies: release-github-com-looprig-foreignloops
  dependents: release-github-com-looprig-foreignloops
  where-it-fits: release-github-com-looprig-foreignloops
---

# Foreign Loops

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/foreignloops` |
| Version | `v0.3.3` |
| GitHub | [looprig/foreignloops](https://github.com/looprig/foreignloops) |

## Description

Adapt ACP, Claude, and Codex processes to Harness through neutral driver contracts and restorable builders.

## Where it fits

Foreign Loops is useful on its own when an application needs to supervise and restore an external agent process behind a neutral backend. Within Looprig, it adapts ACP, Claude, and Codex processes to [Harness](/docs/modules/harness)'s foreign-backend contracts, using [ACP](/docs/modules/acp) for the protocol. Foreign Loops owns the adapter lifecycle; the external process keeps its native behavior.

## Dependencies

- [ACP](/docs/modules/acp)
- [Core](/docs/modules/core)
- [Harness](/docs/modules/harness)
- [Inference](/docs/modules/inference)

## Dependents

None.
