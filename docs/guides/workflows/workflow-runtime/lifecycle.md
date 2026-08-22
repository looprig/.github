---
id: guides/workflows/workflow-runtime/lifecycle
title: Statuses, Cancellation, and Failure
description: Read durable Workflows statuses, legal transitions, cancellation intent, and failure handling.
audience: developer
section: guides
order: 6
publication: released
proofs:
  status-vocabulary: [central-workflows-catalog-source]
  legal-registry-transitions: [central-workflows-recovery-test]
  cancellation-is-durable-intent-plus-flow-control: [central-workflows-recovery-test]
  what-becomes-failed: [central-workflows-recovery-test]
  source: [central-workflows-catalog-source]
  proof: [central-workflows-recovery-test]
---

# Statuses, cancellation, and failure

`RunStatus` is the Workflows lifecycle projection. It is separate from Flow's `flow.RunStatus`, because Workflows also needs to represent failures that happen before a Flow checkpoint exists, such as invalid input or missing durable input bytes.

## Status vocabulary

| Workflows status | Meaning |
| --- | --- |
| `pending` | The registry record exists, but the supervisor has not acknowledged the Flow seed |
| `running` | The supervisor has handed the validated input to Flow or is continuing a checkpoint |
| `interrupted` | Flow durably paused at least one vertex and is waiting for an explicit resume |
| `completed` | Flow appended a completed checkpoint and the registry adopted it |
| `cancelled` | A cancellation request produced a terminal Flow checkpoint or cancelled a pending run |
| `failed` | Workflows could not establish or reconcile a usable execution, including definite input or checkpoint failures |

The status summary is bounded to `MaxStatusSummaryBytes` and is intended for an operator or UI. A typed definition's `StatusSummarizer` produces the summary from state, and the supervisor falls back to `workflow <status>` when the result has no summary.

## Legal registry transitions

The registry enforces this transition matrix in `CompareAndSwap`:

| From | Allowed next statuses |
| --- | --- |
| `pending` | `running`, `cancelled`, `failed` |
| `running` | `interrupted`, `completed`, `cancelled`, `failed` |
| `interrupted` | `running`, `cancelled`, `failed` |
| `completed` | `completed` only |
| `cancelled` | `cancelled` only |
| `failed` | `failed` only |

Terminal rows are idempotent in the registry's transition validator, but the operation semantics still matter. A completed or failed run cannot be cancelled through the workflow tools. A cancelled run is reported idempotently by `workflow_run_cancel` without calling the supervisor again.

Every CAS update carries the revision it read. The registry rejects stale revisions, immutable identity changes, backwards checkpoint revisions, backwards activity cursors, and timestamps that move backwards. A caller should re-read the run after a conflict rather than guessing a new status.

## Cancellation is durable intent plus Flow control

Cancellation is designed to survive an owner restart. `Supervisor.Cancel` signals an in-flight execution before waiting for the controller lock. The controller then:

1. Loads the current run.
2. Persists `CancelRequested=true` and a bounded cancellation summary.
3. Cancels a pending run directly, or resolves the definition for an active run.
4. Calls `Definition.Cancel` with a bounded reason.
5. Reads the resulting Flow checkpoint and applies its status.

If a cancellation races a Flow append, the controller re-reads the checkpoint. A cancelled checkpoint is adopted as success. A completed checkpoint is adopted, then the caller receives a conflict explaining that completion won the race. Revision conflicts are retried up to the bounded cancellation attempt count. The durable intent lets activation retry the cancellation when the original owner exits between steps 2 and 4.

```go
if err := supervisor.Cancel(ctx, runID, "operator stopped the run"); err != nil {
	var conflict *workflows.ConflictError
	if errors.As(err, &conflict) {
		// Re-read before deciding whether a terminal race is already resolved.
		latest, getErr := registry.Get(ctx, sessionID, runID)
		_ = latest
		_ = getErr
	}
	return err
}
```

The direct Flow method has a different contract: `Runner.Cancel` appends one terminal `flow.RunCancelled` checkpoint and does not execute graph work. The Workflows controller wraps that primitive with session ownership, cancellation intent, registry CAS, retry handling, and activity reconciliation.

## What becomes failed

Workflows calls a run failed when it has a definite, durable reason that normal execution cannot continue. Examples in the controller include:

- the private input reference cannot be loaded or fails definition validation;
- a Flow checkpoint is definitely missing, corrupt, graph-mismatched, version-mismatched, or run-mismatched during adoption;
- a checkpoint status or result identity cannot be reconciled safely;
- a registry record violates its durable invariants.

Transient context cancellation or a lost session lease is not converted into a new failure write. The owner stops writing and the next owner can reconcile from durable state. This distinction is why `LastError` is an operational observation, not a new lifecycle status by itself.

For the lower-level checkpoint failure taxonomy, see [Interruption, resume, and recovery](/docs/guides/workflows/workflow-runtime/interruption-and-resume) and the [Flow module reference](/docs/modules/flow).

## Source

- [run.go](https://github.com/looprig/workflows/blob/main/run.go)

## Proof

- [reconcile_test.go](https://github.com/looprig/workflows/blob/main/reconcile_test.go)
