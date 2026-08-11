---
id: reference/packages/flow/pkg/flow
title: flow package · pkg/flow
description: Reference for the flow package at github.com/looprig/flow/pkg/flow, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 51
publication: released
examples:
  - stage-17-flow
proofs:
  package-role: release-github-com-looprig-flow
  exported-surface: release-github-com-looprig-flow
  functions-and-methods: release-github-com-looprig-flow
  types: release-github-com-looprig-flow
  constants-and-variables: release-github-com-looprig-flow
  ownership-and-errors: release-github-com-looprig-flow
  source-and-runnable-proof: release-github-com-looprig-flow
---

# flow package · pkg/flow

Import path: `github.com/looprig/flow/pkg/flow`. Package flow is the durable, pregel-style workflow engine. md §1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.3.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`AddConditionalEdge`, `AddEdge`, `AddVertex`, `Append`, `Cancel`, `Compile`, `Error`, `Execute`, `Get`, `GraphID`, `GraphVersion`, `History`, `IdempotencyKey`, `Interrupt`, `InterruptState`, `Latest`, `MarshalText`, `Resume`, `ResumePayload`, `Run`, `Serve`, `StatefulInterrupt`, `Status`, `String`, `UnmarshalText`, `Unwrap`

### Types {#types}

`AmbiguousRoutingError`, `BuildError`, `Checkpoint`, `CheckpointDecodeError`, `CheckpointGranularity`, `CheckpointNotFoundError`, `CheckpointStore`, `CompileOption`, `Condition`, `ConditionError`, `ControlPlane`, `DeadEndError`, `Delivery`, `DuplicateConditionalEdgeError`, `DuplicateVertexError`, `FuncTask`, `Graph`, `GraphID`, `GraphMismatchError`, `GraphOption`, `GraphRunExistsError`, `GraphRunID`, `GraphRunMismatchError`, `GraphRunState`, `GraphVersionKey`, `GraphVersionMismatchError`, `Halt`, `HaltKind`, `HaltRecord`, `Hooks`, `IdempotencyKey`, `InterruptKind`, `InterruptRecord`, `Interruption`, `MaxStepsExceededError`, `MemStore`, `MissingEntryError`, `Reducer`, `Resolver`, `Result`, `ResumeTerminalError`, `RetryPolicy`, `RevisionConflictError`, `RouteRecord`, `RunInfo`, `RunOption`, `RunResult`, `RunStatus`, `Runner`, `RunnerHandle`, `Selector`, `StepID`, `StepPhase`, `StoreError`, `Task`, `TaskFunc`, `UndeclaredTargetError`, `UnknownVertexError`, `UnknownWorkOpError`, `UnreachableVertexError`, `VertexError`, `VertexID`, `VertexOption`, `VertexRunID`, `VertexState`, `VertexStatus`, `Work`, `WorkOp`

### Constants and variables {#constants-and-variables}

None reported.

## Ownership and errors {#ownership-and-errors}

The flow package exposes `AddConditionalEdge`, `AddEdge`, `AddVertex`, and `Compile` for graph construction. A compiled graph and its `Runner` own one execution; keep the runner through `Run`, `Resume`, `Status`, and its terminal result. Its exported typed failures include `AmbiguousRoutingError`, `BuildError`, `CheckpointDecodeError`, and `CheckpointNotFoundError`; classify them with errors.Is or errors.As. Registry and ingress are not tenant isolation or authorization systems.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/flow/tree/v0.3.0/pkg/flow/) and adjacent tests. The progressive manifest entry `stage-17-flow` exercises this area; run it with `node scripts/docs/run-examples.mjs`. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-flow`.
