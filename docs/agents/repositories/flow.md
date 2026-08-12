---
id: agents/repositories/flow
title: Durable graph execution
description: Define typed graphs, compile them with checkpoints, and run or resume graph state.
audience: agent
section: agents/repositories
order: 7
publication: released
proofs:
  module:
    - release-github-com-looprig-flow
---
# flow

`github.com/looprig/flow@v0.3.0` depends on `core`. Define a graph with `flow.NewGraph` and a `GraphID`, add typed vertices and tasks, then compile with `flow.WithStore(checkpointStore)`. A compiled graph produces a runner; use run options for hooks, concurrency, maximum steps, checkpoint frequency, and a stable graph-run ID.

The runner persists checkpoints through `flow.CheckpointStore`, returns interruptions and halts as part of run state, and resumes from a `ResumePayload`. Use `flow/store` when the checkpoint ledger is provided by `storage`; use the in-memory store only for ephemeral tests. `pkg/ingress` and `pkg/serve` expose HTTP control surfaces over a registry and control plane.

Invalid graph IDs, duplicate vertices, missing routes, checkpoint conflicts, retry exhaustion, cancellation, and resume decoding are boundary failures. Proofs: [`pkg/flow/graph.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/graph.go), [`pkg/flow/compile.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/compile.go), [`pkg/flow/runner.go`](https://github.com/looprig/flow/blob/133cff01d483f368cdcef59f6d4d791e22120a1e/pkg/flow/runner.go), [`examples/resume/example_test.go`](https://github.com/looprig/flow/blob/d8231612bc2be601a0982ed7036fec0a8a5d895c/examples/resume/example_test.go).
