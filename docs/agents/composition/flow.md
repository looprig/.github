---
id: agents/composition/flow
title: Build durable Flow graphs
description: Compile typed graph definitions into checkpoint-backed runners with interruption and resume.
audience: agent
section: agents/composition
order: 9
publication: released
proofs:
  flow:
    - release-github-com-looprig-flow
  nested-store:
    - module-flow-store
  workflows:
    - module-workflows
---
# Flow

Create a graph with `flow.NewGraph` using a `flow.GraphID` and optional `flow.WithVersion`. Add typed vertices with `flow.AddVertex`, add static or conditional edges, then call `graph.Compile(entry, finish, flow.WithStore(checkpointStore))`. The result is an immutable runner safe to reuse across runs. The graph is mutable only during construction.

Run with `runner.Run(ctx, initial, options...)`; use `Resume`, `Status`, `Get`, and `Cancel` for control. A task requests a pause with `flow.Interrupt(ctx, info)` or `StatefulInterrupt(ctx, info, continuation)`. Resume supplies a live payload; stateful continuation is JSON persisted in the checkpoint. `WithCheckpointEvery(flow.PerVertex)` trades more writes for smaller crash loss.

Checkpoint storage is a `flow.CheckpointStore`. The nested `github.com/looprig/flow/store` module adapts an external Ledger and is source-workspace-only. `workflows` wraps Flow definitions with durable run records and Harness-owned supervisors; use it when runs need session tools, artifacts, and recovery.

Invariants: compile validates endpoints, reachability, route ambiguity, and version fingerprint; reducers commit against a cloned state; stale checkpoint revisions never overwrite history; returned results are terminal or paused, never running. Failures include build, graph-version mismatch, checkpoint conflict, serialization, interrupt, halt, and cancellation errors.

Proofs: [`flow/pkg/flow/graph.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/graph.go), [`flow/pkg/flow/compile.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/compile.go), [`flow/pkg/flow/interrupt.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/interrupt.go).
