---
id: guides/workflows/workflow-runtime/state-and-history
title: Workflow State, Checkpoints, and History
description: Understand the separate durable records for graph state, run metadata, input bytes, and projected activity.
audience: developer
section: guides
order: 4
publication: released
proofs:
  four-records-four-jobs: [central-workflows-typed-definition-source]
  flow-checkpoint-history: [central-workflows-recovery-test]
  workflows-run-metadata: [central-workflows-catalog-source]
  input-bytes-are-private-and-immutable: [central-workflows-artifacts-contract-test]
  projected-activity-history: [central-workflows-stage18-output-test]
  source: [central-workflows-typed-definition-source]
  proof: [central-workflows-recovery-test]
---

# Workflow state, checkpoints, and history

Workflows has more than one durable record because each record serves a different reader. The Flow checkpoint is the execution truth. The Workflows `Run` is the session-owned index and lifecycle projection. The input blob is immutable, digest-addressed JSON. The activity history is a bounded, public projection of safe milestones.

## Four records, four jobs

| Record | Owner | Contains | Public use |
| --- | --- | --- | --- |
| Flow checkpoint | `flow.CheckpointStore` | `GraphRunState`, serialized graph state, vertex records, frontier, routes, phase, interrupts or halt | Resume, adoption, and graph debugging |
| Workflows run record | `RunRegistry` over `storage.KV` | Definition identity, Workflows run ID, Flow `GraphRunID`, status, cursors, timestamps, input reference, artifact descriptors | Session-scoped lookup, status, CAS lifecycle updates |
| Input blob | `InputStore` over `storage.Blobs` | One JSON object addressed by a lowercase SHA-256 digest | Re-load input after asynchronous start |
| Activity projection | `Supervisor.History` and `workflow_run_history` | Event ID, kind, status, vertex label, progress, message, timestamp | UI, events, model-visible progress |

The public activity path intentionally excludes graph state, checkpoint payloads, policy text, model output, and the input bytes. A tool result can report that a vertex completed without disclosing the state the vertex processed.

## Flow checkpoint history

Flow's `CheckpointStore` is append-only. `Append` accepts a checkpoint only when its `Run.Revision` is the next contiguous revision for that `GraphRunID`. `Latest` returns the highest revision. `History` returns every checkpoint in revision order. The store must preserve structural immutability, so mutating a checkpoint returned by a read cannot rewrite durable history.

The Workflows definition exposes the narrow view:

```go
history, err := definition.History(ctx, graphRunID)
if err != nil {
	return err
}
for _, state := range history {
	// Revision is contiguous from zero for a healthy Flow history.
	fmt.Printf("revision=%d status=%s step=%d\n", state.Revision, state.Status, state.Step)
}
```

`Definition.History` returns `[]flow.GraphRunState`, not the full checkpoint payload. The typed implementation retains an internal capability that the supervisor uses when it needs vertex transitions for activity projection. A definition adapter that can expose only run states remains usable for basic execution, but it cannot prove vertex-level activity history for a nonfailed run.

## Workflows run metadata

`RunRegistry.Create` creates a revision-zero record. `Get` reads one session-owned run. `CompareAndSwap` requires a nonzero expected registry revision and rejects:

- changed immutable identity, including definition name, version, run IDs, input reference, and ledger locator;
- an illegal `RunStatus` transition;
- a checkpoint revision or activity cursor that moves backward;
- an `UpdatedAt` timestamp that moves backward.

`List` pages by the sorted run ID key under `sessions/<session>/workflows/runs/`. Its default page size is 50 and its maximum is 100. The cursor is the last run ID, not a Flow checkpoint revision.

## Input bytes are private and immutable

`InputStore.Put` accepts one bounded JSON object, hashes the exact bytes with SHA-256, and stores them under the session-private digest namespace. The tool layer canonicalizes an input object before calling `Put`, so equivalent key orderings produce the same stored bytes. `InputStore.Get` verifies the namespace, size, digest, and blob bytes before returning a clone.

The `Run.Input` field stores only an `InputReference`:

```go
type InputReference struct {
	Digest string `json:"digest"`
	Key    string `json:"key"`
	Size   int64  `json:"size"`
}
```

The reference is enough for the supervisor to reload input, but it is not enough to expose the input through a safe run result. The workflow tools return bounded metadata and artifact descriptors instead.

## Projected activity history

The supervisor projects Flow checkpoints into `tool.WorkflowActivityMetadata` only after the checkpoint is durable. Stable IDs are derived from session ID, run ID, activity kind, checkpoint revision, vertex ID, and completion ordinal. If publication succeeds but the registry cursor update loses a race, retrying publishes the same event ID and the downstream publisher can treat it as a duplicate.

The projection vocabulary is closed:

| Kind | Meaning |
| --- | --- |
| `run_started` | The revision-zero checkpoint established the run |
| `vertex_completed` | A new Flow vertex completion was observed |
| `run_interrupted` | Flow paused the run at a durable checkpoint |
| `run_resumed` | A resume transition continued after an interrupted checkpoint |
| `run_completed` | Flow reached its terminal completed state |
| `run_cancelled` | Cancellation appended a terminal checkpoint |
| `run_failed` | Workflows failed before a normal Flow terminal checkpoint could be projected |

Activity history is paged by checkpoint revision. `afterEventID` handles the case where one revision contains more activities than the page limit. The page limit is 1 through 100, with a default of 50.

```go
page, err := supervisor.History(ctx, runID, 0, uuid.UUID{}, 50)
if err != nil {
	return err
}
for _, record := range page.Records {
	metadata := record.Metadata
	fmt.Printf("%s %s %d/%d\n", metadata.Kind, metadata.Status,
		metadata.CompletedVertices, metadata.TotalVertices)
}
if page.NextRevision != nil {
	// Persist both cursors when NextEventID is present. The next request can
	// continue inside a single large checkpoint revision without skipping data.
	nextRevision := *page.NextRevision
	_ = nextRevision
}
```

The matching model-facing operation is `workflow_run_history`, documented in [Workflow tools](/docs/guides/workflows/workflow-tools). For the event consumer, see [Harness workflow events](/docs/guides/harness/events/process-and-workflow).

## Source

- [history.go](https://github.com/looprig/workflows/blob/v0.1.2/history.go)

## Proof

- [history_test.go](https://github.com/looprig/workflows/blob/v0.1.2/history_test.go)
