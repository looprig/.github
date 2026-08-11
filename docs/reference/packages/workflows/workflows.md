---
id: reference/packages/workflows/workflows
title: Workflows root package
description: Exported definitions, registries, input references, and session-owned supervision in the source-workspace workflows package.
audience: developer
section: reference
order: 210
publication: source-workspace
examples:
  - stage-18-workflows
proofs:
  package-role: module-workflows
  exported-surface: [central-workflows-catalog-source, central-workflows-typed-definition-source]
  lifecycle-and-errors: [central-workflows-recovery-test, central-workflows-artifacts-contract-test]
  source-proof: central-workflows-stage18-output-test
---

# `github.com/looprig/workflows`

This package is the typed orchestration layer above Flow. It is source-workspace at the reviewed [commit](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f), not a released import.

## Package role {#package-role}

The package owns workflow identity, typed validation, session-scoped run projections, immutable input references, and a supervisor lifecycle. A workflow run record is a bounded projection; Flow checkpoint history and Harness event history remain separate sources of truth.

## Exported surface {#exported-surface}

`Catalog`, `Definition`, `Metadata`, `TypedDefinition[S]`, `VertexMetadata`, `ValidatedInput`, `ValidatedResume`, and `StrictJSONDecoder` define and validate workflows. `Run`, `RunPage`, `RunRegistry`, `ListRunsRequest`, `Result`, `RunStatus`, `ArtifactReference`, `InputReference`, `InputStore`, `ActivityHistoryPage`, and `ActivityHistoryRecord` project and page durable state. `Supervisor` and `SupervisorConfig` coordinate work. Constructors include `NewCatalog`, `NewMetadata`, `NewTypedDefinition`, `NewRunRegistry`, `NewInputStore`, `NewSupervisor`, `NewVertexMetadata`, and `NewVertexMetadataForID`.

## Lifecycle and errors {#lifecycle-and-errors}

Validate input before `Start`; validate resume before `Resume`. `Supervisor.Activate` claims one session resource, `Start` schedules work, `Adopt` recovers an eligible running checkpoint, `WaitIdle` observes quiescence, and `Shutdown` is bounded. Run records cap metadata at 64 KiB, status summaries at 1,024 bytes, artifacts at 128 references, and pages at 100 entries.

The package exposes typed errors and sentinels for invalid schemas and input, duplicate or unknown definitions, not-found/conflict/corrupt records, reconciliation, supervisor state, session ownership, adoption, and shutdown timeout. Error values unwrap causes; callers should inspect them with `errors.Is` and `errors.As`.

## Source proof {#source-proof}

The [stage 18 fixture](../../../examples/index.md#stage-18-workflows) exercises typed validation, interruption, checkpoint recovery, typed resume, cancellation, and append-only history. See the [root source tree](https://github.com/looprig/workflows/tree/f241ecbd6299a00d52fc6755b5be946a41b3a73f) for the declarations used here.
