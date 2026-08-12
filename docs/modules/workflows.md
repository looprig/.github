---
id: modules/workflows
title: Workflows module
description: Source-workspace reference for typed workflow definitions, durable run records, session-owned supervisors, and workflow tools.
audience: developer
section: modules
order: 21
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  repository: module-workflows
  module-and-definition: [module-workflows, central-workflows-typed-definition-source]
  persistence-and-tools: [central-workflows-artifacts-contract-test, central-workflows-catalog-source]
  lifecycle-and-recovery: [central-workflows-recovery-test, central-workflows-stage18-output-test]
  source-status: central-workflows-stage18-lifecycle-fixture
---

# Workflows module

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/workflows` repository](https://github.com/looprig/workflows).

Workflows is a source-workspace Go module. Its module file is pinned at [go.mod](https://github.com/looprig/workflows/blob/89059af7dded45b8f57678e17c66e528549ce78a/go.mod), and the reviewed implementation is at [commit f241ecb](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f). It is not a released version, so a consumer should use the source workspace and stage 18 fixture rather than a versioned `go get` instruction.

## Module and definition {#module-and-definition}

The root package `github.com/looprig/workflows` exports `Catalog`, `Definition`, `Metadata`, `TypedDefinition[S]`, `VertexMetadata`, `ValidatedInput`, `ValidatedResume`, and `StrictJSONDecoder`. `NewMetadata` validates the workflow identity and schemas. `NewTypedDefinition` binds a Flow runner, checkpoint store, state decoder, resume decoder, and bounded status summarizer. `Catalog.Register`, `List`, and `Resolve` keep `(name, version)` identity explicit.

The root package also exports `Run`, `RunPage`, `RunRegistry`, `ListRunsRequest`, `Result`, `RunStatus`, `ArtifactReference`, `InputReference`, `InputStore`, `ActivityHistoryPage`, and `ActivityHistoryRecord`. The durable record is a bounded projection. It is not the session event history and it is not the Flow checkpoint itself.

## Persistence and tools {#persistence-and-tools}

`RunRegistry` uses storage KV compare-and-swap. `InputStore` uses session-private immutable blobs for canonical JSON. The exported bounds are `MaxRunRecordBytes` (64 KiB), `MaxArtifactReferences` (128), `MaxStatusSummaryBytes` (1,024), and page sizes of 50 by default and 100 maximum. `ArtifactInputBootstrap` and `ArtifactInputParent` identify the two built-in input roles.

The `github.com/looprig/workflows/tools` package exports `Config` and `NewBundle`. It builds `workflow_run_start`, `workflow_run_get`, `workflow_run_list`, `workflow_run_history`, `workflow_run_resume`, and `workflow_run_cancel` tools. `PrepareRunIntegrityError` reports a prepare-hook mismatch. The tools receive a session-scoped catalog, registry, input store, supervisor, clock, and ID source rather than reaching into global process state.

## Lifecycle and recovery {#lifecycle-and-recovery}

`Supervisor` exports `Activate`, `Start`, `Resume`, `Adopt`, `Cancel`, `History`, `WaitIdle`, `LastError`, `SessionID`, and `Shutdown`. It leases one Harness session resource, starts work asynchronously, and makes recovery explicit. `Adopt` accepts only a durable running checkpoint that can be safely continued. `Shutdown` is bounded by the caller's context.

Typed errors include `ErrActivityValidation`, `ErrReconciliation`, `ErrUnknownDefinition`, `ErrDuplicateDefinition`, `ErrInvalidSchema`, `ErrInvalidInput`, `ErrNotFound`, `ErrConflict`, `ErrCorruptRecord`, `ErrSupervisorActive`, `ErrSupervisorClosed`, `ErrSessionOwned`, `ErrAdoption`, and `ErrShutdownTimeout`. The associated error types unwrap their causes; use `errors.Is` and `errors.As`.

## Source status {#source-status}

The [stage 18 fixture](../examples/index.md#stage-18-workflows) is the reviewed executable proof. It prints interrupted, recovered, resumed, cancelled, and append-only-history results. Until a release record exists, keep imports and publication labels source-workspace.
