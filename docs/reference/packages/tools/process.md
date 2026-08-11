---
id: reference/packages/tools/process
title: process package · process
description: Reference for supervised process resources, output spools, lifecycle, and restore.
audience: developer
section: reference
order: 168
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# process package · process

Import path: `github.com/looprig/tools/process`. Process owns the shared supervisor and durable metadata for long-running command tools.

## Package role {#package-role}

`NewSupervisor` manages process admission, signals, output spools, manifests, lifecycle notifications, and restore. `NewProcessInput`, `NewProcessOutput`, and `NewProcessStop` expose model-facing operations over the same supervisor resource.

## Exported surface {#exported-surface}

Key types are `Supervisor`, `Config`, `Manifest`, `ManifestStore`, `Identity`, `Owner`, `CommandMetadata`, `Spool`, `Buffer`, `Handle`, `Artifact`, `ProcessInputTool`, `ProcessOutputTool`, `ProcessStopTool`, `State`, `WaitStatus`, `WaitTarget`, `YieldSettings`, and typed lifecycle, transition, identity, spool, restore, and collision errors. Constructors include `NewSupervisor`, `NewSupervisorResource`, `NewManifestStore`, `NewHandle`, `OpenSpool`, `NewBuffer`, and `NewArtifact`.

### Functions and methods {#functions-and-methods}

`RenderSafeText` and `RenderBase64` return bounded output views; `NewSupervisor` and `NewSupervisorResource` create the lifecycle owner. `OpenSpool` opens a caller-owned output stream with a ceiling.

### Types {#types}

Access mode, terminal state, wait kind, signal, artifact, and lifecycle enums are explicit. `RestoreReport` records whether a persisted process can be safely re-adopted.

### Constants and variables {#constants-and-variables}

Handle entropy, artifact encoding, supervisor resource key, and spool errors are stable contracts. Process output is bounded by caller-configured ceilings.

## Ownership and errors {#ownership-and-errors}

The session owns the supervisor resource and must close it after child teardown. A process handle is opaque and must not be guessed. Terminal, immutable-identity, spool-closed, restore, and non-monotonic update errors are not safe to ignore.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned process package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/process/). Process lifecycle tests cover output, stop, shutdown, and restoration contracts.
