---
id: build/20-flow
title: Durable Flow execution
description: Build a checkpointed graph runner when a session needs resumable state, explicit interruption, and an append-only execution history.
audience: developer
section: build
order: 20
publication: released
examples:
  - stage-17-flow
proofs:
  graph-and-runner: release-github-com-looprig-flow
  checkpoints-and-recovery: release-github-com-looprig-flow
  state-boundaries-and-limits: release-github-com-looprig-flow
  runnable-proof: release-github-com-looprig-flow
---

# Durable Flow execution

Flow is the lower-level graph engine. A compiled `flow.Runner[S]` executes typed vertices over state `S`, writes durable checkpoints through `flow.CheckpointStore`, and exposes `Run`, `Resume`, `Get`, `Status`, and `Cancel`. The released module is [github.com/looprig/flow v0.3.0](https://github.com/looprig/flow/tree/133cff01d483f368cdcef59f6d4d791e22120a1e).

## Graph and runner {#graph-and-runner}

Build a mutable `flow.Graph[S]` with stable `GraphID` and `VertexID` values. `AddVertex` binds a typed `Task` through a selector and reducer; `AddEdge` expresses static fan-out and `AddConditionalEdge` chooses declared targets. `Compile(entry, finish, flow.WithStore(store))` validates reachability, endpoint identity, routing, and policies, then returns an immutable runner that is safe to reuse across concurrent runs. `NewRunnerHandle` is the JSON boundary for graph-agnostic registries and workers.

Tasks return their output or an error. A task outcome is part of the `Result`, while store, serialization, identity, and validation failures are returned as errors. `WithRetry`, `WithTimeout`, `WithErrorPause`, and `WithErrorRoute` make retry and failure policy explicit at vertex construction time.

## Checkpoints and recovery {#checkpoints-and-recovery}

`CheckpointStore` is the durable execution history, not the session event journal. It compare-and-appends a checkpoint by `(GraphRunID, Revision)`, returns the highest revision from `Latest`, and keeps ordered `History`. A checkpoint contains the run status, frozen step base, accumulated state, vertex records, frontier, routes, phase, and either interrupts or a halt. `PerVertex` is the current default granularity; `PerStep` is an exposed enum for coarser policies.

`Run` starts a new `GraphRunID`. When a vertex calls `flow.Interrupt` or `flow.StatefulInterrupt`, the runner records an awaiting state and returns a result without treating the pause as a Go error. `Resume` loads and validates the latest checkpoint before running work; `ResumePayload[T]` reads the live resume value, while `InterruptState[T]` reads a persisted continuation. `Get` decodes the latest state without running the graph, and `Status` reads only run metadata.

## State boundaries and limits {#state-boundaries-and-limits}

The graph definition is code plus stable IDs. The checkpoint is durable run state. `ResumePayload` is an in-process value at the resume call; it is not silently decoded by the engine. State and checkpoint JSON cross a serialization boundary, so a malformed stored value is a `CheckpointDecodeError`. `GraphVersion` is a compatibility fingerprint; a changed topology or user version yields `GraphVersionMismatchError` rather than unsafe continuation.

The store contract requires every operation to honor `context.Context`, compare-and-append revisions, and return typed errors such as `CheckpointNotFoundError`, `RevisionConflictError`, `StoreError`, and `CheckpointDecodeError`. The runner also exposes bounded run options such as maximum steps and per-vertex timeouts. Keep large inputs and artifacts in a blob store and pass references through state instead of expanding a checkpoint record.

## Runnable proof {#runnable-proof}

The progressive [stage 17 Flow example](../examples/index.md#stage-17-flow) starts a graph, interrupts it, resumes from the growing checkpoint history, and prints both outcomes. Review the [Flow source at the release commit](https://github.com/looprig/flow/tree/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow) and the [runner declarations](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/runner.go) when choosing between `Run`, `Resume`, and `Get`.
