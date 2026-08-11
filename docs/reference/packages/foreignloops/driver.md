---
id: reference/packages/foreignloops/driver
title: driver package · driver
description: Reference for provider-neutral foreign agent turns, events, history, posture, and steering.
audience: developer
section: reference
order: 201
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions-and-methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants-and-variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver package · driver

Import path: `github.com/looprig/foreignloops/driver`. Driver defines the neutral contract concrete providers satisfy.

## Package role {#package-role}

`Agent` creates provider turns; `Turn` carries prompt, cwd, posture, and session selection; `Stream` yields normalized updates; `History` states whether a provider's history is authoritative. Steering is explicit and bounded.

## Exported surface {#exported-surface}

Public values include `Agent`, `Closer`, `Stream`, `OrderedStream`, `Steerer`, `Turn`, `Event`, `Observation`, `PromptObservation`, `UpdateObservation`, `SteerObservation`, `SteerRequest`, `SteerResult`, `SteerOutcome`, `Posture`, `PermissionPosture`, `Kind`, `ObservationKind`, `History`, and typed spawn, decode, exit, history, and steering errors. `NewSteerRequest` validates content blocks.

### Functions and methods {#functions-and-methods}

`NewSteerRequest` builds a bounded request; Agent and Turn methods start and close a stream, while Steerer methods admit or reject steering.

### Types {#types}

Event kinds and observations normalize provider lifecycle without exposing transcript paths. `SteerOutcome` distinguishes injected, queued, rejected, interrupted, and unknown delivery.

### Constants and variables {#constants-and-variables}

Posture and event enums are closed values. `ErrSteerAdmissionCapacity` reports bounded admission pressure.

## Ownership and errors {#ownership-and-errors}

Provider drivers own process and wire resources; Harness owns loop IDs, gates, workspace, and authority. A missing authoritative history is a supported state, not a decode failure.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned driver contract](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/). The ACP-backed progressive example verifies the composition boundary without a live provider.
