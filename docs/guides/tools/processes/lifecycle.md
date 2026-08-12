---
id: guides/tools/processes/lifecycle
title: Process Lifecycle, Storage, and Restore
description: Follow a supervised process from admission through terminal state and restore.
audience: developer
section: guides
order: 8
publication: released
proofs:
  state-machine: [release-github-com-looprig-tools]
  start-drain-and-terminalize: [release-github-com-looprig-tools]
  bounded-output-and-cursors: [release-github-com-looprig-tools]
  shutdown: [release-github-com-looprig-tools]
  restore-is-reconciliation-not-reattachment: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Process Lifecycle, Storage, and Restore

Long-running commands need stronger guarantees than a synchronous shell call. The process subsystem persists identity and lifecycle metadata, drains both output streams before waiting, bounds retained bytes, releases the workspace lease exactly once, and reconciles persisted state after a restart.

## State Machine

The closed state set is `starting`, `running`, `exited`, `failed`, `timed_out`, `interrupted`, `terminated`, `killed`, and `lost_on_restore`.

Allowed transitions are:

- `starting` to `running`, `failed`, `terminated`, `killed`, or `lost_on_restore`;
- `running` to `exited`, `failed`, `timed_out`, `interrupted`, `terminated`, `killed`, or `lost_on_restore`; and
- no transition out of a terminal state.

`ManifestStore.Save` enforces the same transition matrix on disk. Terminal results, cursors, completion markers, identity, and allocated lifecycle IDs cannot move backward or change after publication.

## Start, Drain, and Terminalize

`Supervisor.Start` consumes the caller's single-use `tool.PreparedProcess` only after quota reservation. It creates an opaque handle and `LifecycleEventIDs`, writes a starting manifest, calls the prepared process's `Start`, and writes the running manifest. The process entry then drains stdout, stderr, and optional activity notifications before calling `Wait`. This order prevents pipe closure from losing output.

Every terminal path passes through a one-shot terminalization gate. Terminalization:

1. records the final cursor bounds and terminal result;
2. closes the exited signal so stop and wait callers know the process has been persisted;
3. releases quota and the workspace lifetime lease;
4. publishes lifecycle data with the already-persisted event ID; and
5. sends the completion notification with the already-persisted command ID.

The release occurs before notification so a slow notifier cannot hold a workspace lease or create a circular wait. A racing natural exit, stop, timeout, or shutdown still produces one terminal manifest, one lease release, and one completion path.

## Bounded Output and Cursors

The in-memory `Buffer` is a rolling window for recent polls. The disk `Spool` is the durable bounded retention window and the source of truth for completed output and cursor recovery. Both use raw byte cursors in one combined append order for stdout and stderr. When a window drops old bytes, a read whose cursor is before `RetainedFrom` returns the retained beginning and marks `gap: true`. A cursor beyond `TotalBytes` returns `cursor_ahead`.

Safe-text rendering normalizes invalid UTF-8 and terminal control sequences, records whether normalization occurred, detects binary-looking data, and attaches an opaque artifact descriptor. Base64 rendering returns the same raw bytes without normalization. Neither result contains a spool path or manifest path.

## Shutdown

`Supervisor.Shutdown` is idempotent and shared across concurrent callers. It closes admission first, sends `terminate` to every running process tree concurrently, waits the configured grace period, escalates remaining trees to `kill`, and confirms every tree exited. A signal failure is reported as `teardown_failed`, but the supervisor retains authority and still waits for terminalization. Completed output remains queryable after shutdown.

## Restore Is Reconciliation, Not Reattachment

`Supervisor.Restore` scans the explicit manifest resource root. A terminal manifest is reopened with its spool for read-only queries. A `starting` or `running` manifest is durably changed to `lost_on_restore`, receives its persisted `Lost` event ID and completion command ID, and is reopened as a terminal entry. Restore never reads a persisted PID and never signals an old process. One corrupt manifest or spool is recorded in `RestoreReport.Errors` while other handles continue to reconcile.

`SupervisorResource.Activate` installs live Harness lifecycle and notification services before calling `Restore`, so a lost-on-restore event is published through the current session services. Stable IDs make publication retries idempotent at the durable journal boundary.

```go
// A persisted running record is reconciled, not reconnected to an old PID.
report, err := restored.Restore(context.Background())
if err != nil {
	panic(err)
}
manifest, err := store.Load(handle)
if err != nil {
	panic(err)
}
fmt.Println(len(report.Reconciled), manifest.State) // 1 lost_on_restore
```

See [Process Supervision](/docs/guides/tools/processes/) for composition and [Process Output, Input, and Stop Tools](/docs/guides/tools/processes/tools/) for cursor and stop calls.

## Source

- [Lifecycle state and errors](https://github.com/looprig/tools/blob/main/process/state.go)
- [Terminalization and stream drain](https://github.com/looprig/tools/blob/main/process/entry.go)
- [Manifest persistence](https://github.com/looprig/tools/blob/main/process/manifest.go)
- [Restore reconciliation](https://github.com/looprig/tools/blob/main/process/restore.go)

## Proof

- [State transition tests](https://github.com/looprig/tools/blob/main/process/state_test.go)
- [Manifest monotonicity tests](https://github.com/looprig/tools/blob/main/process/manifest_test.go)
- [Restore tests](https://github.com/looprig/tools/blob/main/process/restore_test.go)
- [Shutdown and restore integration](https://github.com/looprig/tools/blob/main/process/shutdown_restore_test.go)
