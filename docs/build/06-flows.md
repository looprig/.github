---
id: build/06-flows
title: Build 06: flows and checkpoints
description: Compile explicit Flow graphs, run them with interruptible tasks, and add checkpoint storage when recovery is required.
audience: developer
section: build
order: 6
publication: released
examples:
  - stage-17-flow
proofs:
  boundary:
    - release-github-com-looprig-flow
    - release-github-com-looprig-flow-store
  composition:
    - release-github-com-looprig-flow
    - release-github-com-looprig-flow-store
  graph-boundary:
    - release-github-com-looprig-flow
  runner-lifecycle:
    - release-github-com-looprig-flow
  checkpoint-storage:
    - release-github-com-looprig-flow-store
  control-plane-and-ingress:
    - release-github-com-looprig-flow
  lifecycle:
    - release-github-com-looprig-flow
    - release-github-com-looprig-flow-store
  errors-and-limits:
    - release-github-com-looprig-flow
  runnable-proof:
    - release-github-com-looprig-flow
---

# Build 06: flows and checkpoints

Use released Flow for graph execution and the released nested `flow/store` module as the checkpoint adapter. A Flow graph describes the allowed transitions; a Runner owns one execution; a checkpoint store owns the durable state that makes interruption and resume possible.

## Graph boundary {#graph-boundary}

`flow.Graph` accepts vertices, edges, conditional edges, and task definitions before `Compile` validates the graph. Compilation is the point at which missing vertices, invalid transitions, and graph shape errors should surface. Keep policy decisions in task functions or explicit guards, not in an implicit edge that is difficult to inspect.

## Runner lifecycle {#runner-lifecycle}

Create a Runner from a compiled graph and run one execution with its input and context. The Runner reports status and history and supports interruption, cancellation, retry, and resume according to the task and run state. An interrupt is a durable state transition only when the configured checkpoint path successfully records it; a process exit without a checkpoint is not a resumable run.

## Checkpoint storage {#checkpoint-storage}

The nested `flow/store` module provides `store.New(ledger storage.Ledger)`, which adapts a Storage ledger to the Flow checkpoint contract. It is a separate Go module under `flow/store`, with its own module file and current local replacement in the coordinated workspace. It has no published tag in this snapshot. Do not add it as a released version or leave a local filesystem `replace` in a published module.

## Control plane and ingress {#control-plane-and-ingress}

The control-plane package provides an in-memory implementation for tests and small processes. The registry uses exact name matching, and ingress can require authentication. These are composition boundaries, not tenancy or authorization systems: the application must supply its own tenant isolation, authorization policy, and durable control-plane implementation where those properties matter.

## Errors and limits {#errors-and-limits}

Handle compile errors before starting a run. During execution, distinguish task failure, cancellation, interruption, retry exhaustion, and checkpoint failure. A resumed run depends on the checkpoint schema and the task's ability to continue from its recorded state; arbitrary side effects outside the checkpoint remain the caller's responsibility.

## Runnable proof {#runnable-proof}

`stage-17-flow` runs the released Flow graph, pauses at an interrupt, and resumes with the recorded approval state. Run it with `node scripts/docs/run-examples.mjs`. The Flow implementation is pinned in the [Flow release tree](https://github.com/looprig/flow/tree/v0.3.0/) that this stage records; the checkpoint adapter is the nested `flow/store` module at commit `c89d0eb101158996bd278578c0b93d55d67a8d8a`, tracked by the `module-flow-store` proof. That module is now published from the Flow repository at [`store/v0.1.0`](https://github.com/looprig/flow/tree/d192f2b0271bd6010122be827bf88f44078e806d/store), and this stage is re-pinned when its example manifest is refreshed. The referenced package pages list the pinned source files and adjacent tests used for this boundary.
