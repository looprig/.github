---
id: modules/flow
title: Compiled graphs and durable workflow runs
description: Build a graph once, compile it into an immutable runner, and resume from append-only checkpoints.
audience: developer
section: modules
order: 9
publication: released
examples:
  - stage-17-flow
proofs:
  graph-and-runner:
    - release-github-com-looprig-flow
  interruption:
    - release-github-com-looprig-flow
  control-and-ingress:
    - release-github-com-looprig-flow
  runnable-proof:
    - release-github-com-looprig-flow
---

# Compiled graphs and durable workflow runs

Flow `v0.3.0` provides graph construction, compilation, checkpointed execution, and optional control-plane and HTTP ingress packages. Install `github.com/looprig/flow@v0.3.0` with its released Core dependency.

## Graph and runner {#graph-and-runner}

`flow.NewGraph` creates a mutable build-time graph over a state type. Add vertices with a `Task`, static edges, or one conditional edge. `Compile` validates vertex identity, endpoint existence, routing ambiguity, entry and finish reachability, and task declarations. On success it returns an immutable `Runner` bound to one checkpoint store. Build and compile on one goroutine, then share the runner for concurrent runs.

Tasks receive context and typed input and return typed output. A `FuncTask` is reusable because it holds only its function, not a run identifier or state. Conditions choose one or more declared targets from read-only state. The graph may contain cycles, but each run's checkpoint and revision rules remain the correctness boundary.

## Interruption {#interruption}

`Runner.Run` appends checkpoints as work advances. A task can return an `Interrupt` or `StatefulInterrupt` to pause a run with a typed kind and optional payload. `Resume` loads the latest checkpoint, supplies the resume payload, and appends the continuation. `Retry`, `Cancel`, `Status`, and `History` keep operational outcomes distinct from a task error. A stale or conflicting revision is a storage coordination failure, not a reason to overwrite history.

The released Flow module contains the graph and package APIs. Its nested `github.com/looprig/flow/store` module is documented separately because it remains source-workspace-only and adapts an external Ledger to checkpoint storage.

## Control and ingress {#control-and-ingress}

`pkg/controlplane.Mem` is an ephemeral in-process dispatcher. It uses `Submit` and `Consume` with `Ack` or `Nack`; durable correctness remains in the checkpoint store, not the transient queue. `pkg/registry.Registry` resolves an exact `(GraphID, version)` to a runner handle and returns deterministic keys and manifests. `pkg/ingress.New` exposes async-first HTTP routes and uses caller-supplied authentication. It has no built-in tenant ownership check: an authorized caller can address any unguessable run ID, so deployments needing tenancy must enforce it in `WithAuth` or a fronting proxy.

## Runnable proof {#runnable-proof}

`stage-17-flow` builds a graph with a stateful approval interrupt, runs it to `Interrupted`, inspects checkpoint history, resumes with `alice`, and asserts a completed state with a growing history. Run it with `node scripts/docs/run-examples.mjs`. Native examples under `flow/examples/graph`, `branch`, `interrupt`, and `resume` cover the graph and lifecycle paths.
