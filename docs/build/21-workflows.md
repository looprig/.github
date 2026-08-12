---
id: build/21-workflows
title: Typed workflow orchestration
description: Add a durable workflow catalog, typed input and resume validation, session-owned supervision, and recovery tools above Flow.
audience: developer
section: build
order: 21
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  definition-and-catalog: [central-workflows-catalog-source, central-workflows-typed-definition-source]
  durable-records-and-inputs: central-workflows-artifacts-contract-test
  supervisor-lifecycle: [central-workflows-recovery-test, central-workflows-stage18-output-test]
  source-workspace-proof: [module-workflows, central-workflows-stage18-lifecycle-fixture]
---

# Typed workflow orchestration

`github.com/looprig/workflows` is a source-workspace module in this corpus. It is the orchestration layer above Flow: definitions describe a named, versioned workflow; a catalog resolves those definitions; a supervisor owns the session lease and lifecycle; and registries project bounded run metadata. It is not a released import yet. The [module file](https://github.com/looprig/workflows/blob/89059af7dded45b8f57678e17c66e528549ce78a/go.mod) and [implementation source](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f) are the current source-workspace boundary.

## Definition and catalog {#definition-and-catalog}

`Metadata` validates a workflow name, version, description, JSON input and resume schemas, and vertex labels. A `Definition` supplies that metadata plus typed validation and lifecycle operations. `NewTypedDefinition` binds a Flow runner, checkpoint store, state decoder, optional resume decoder, and bounded status summarizer. `Catalog.Register` rejects duplicate `(name, version)` pairs; `Resolve` returns `UnknownDefinitionError` when a definition is absent.

Use `StrictJSONDecoder` at the JSON boundary. Unknown fields and trailing values are rejected, and schema validation produces `InvalidInputError` or `InvalidSchemaError` rather than partially accepted payloads. Validation results are tied to the registered definition, so a payload validated for one version cannot be replayed against another.

## Durable records and input references {#durable-records-and-inputs}

A workflow `Run` is bounded metadata for one session: workflow identity, status, timestamps, summary, input reference, and artifact references. `RunRegistry` stores it with neutral KV compare-and-swap and pages through runs with a default size of 50 and a maximum of 100. A record is capped at 64 KiB, carries at most 128 artifact references, and limits a status summary to 1,024 bytes.

`InputStore` puts canonical JSON into session-private immutable blobs and returns an `InputReference`. That is different from Flow checkpoint state, the session event history, and a workspace snapshot. `ArtifactReference` points to an immutable output or intermediate artifact without copying artifact bytes into a run record. `ArtifactInputBootstrap` and `ArtifactInputParent` name the built-in input-reference roles.

## Supervisor lifecycle {#supervisor-lifecycle}

`Supervisor.Activate` claims the session-owned resource, `Start` schedules a pending run, and `WaitIdle` lets a caller observe quiescence. `Resume` continues an interrupted run, `Cancel` appends a terminal cancellation, `History` reads projected activity records, and `Shutdown` closes the supervisor with a bounded wait. Recovery uses `Adopt` for a durable running checkpoint after a process restart; it does not pretend the old in-memory worker survived.

The lifecycle is deliberately session-owned. `ErrSupervisorActive`, `ErrSupervisorClosed`, `ErrSessionOwned`, and `ErrAdoption` distinguish state-machine misuse from `ErrConflict`, `ErrNotFound`, `ErrCorruptRecord`, and `ErrReconciliation`. `ErrShutdownTimeout` reports a bounded teardown that did not settle. Callers should use `errors.Is` and `errors.As` rather than matching error strings.

## Source-workspace proof {#source-workspace-proof}

The reviewed workflow fixture validates typed input, interrupts a Flow run, recovers the checkpoint, resumes with typed input, cancels another run, and asserts append-only history. Its expected output is `started: Interrupted`, `recovered: Interrupted`, `resumed: Completed count=3`, `cancelled: Cancelled`, and `history: append-only`. The fixture remains source-workspace until a module release is recorded.
