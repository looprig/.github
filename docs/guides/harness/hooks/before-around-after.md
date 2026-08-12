---
id: guides/harness/hooks/before-around-after
title: Before, around, and after hooks
description: Compose hook phases and propagate context safely.
audience: developer
section: guides
order: 13
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  begin-phase: [release-github-com-looprig-harness]
  guard-phase: [release-github-com-looprig-harness]
  finish-phase: [release-github-com-looprig-harness]
  context-bridge: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Before, around, and after hooks

## Begin phase

Harness has no separate public `Before` type. The before phase is `hook.BeginFunc`, installed through `hook.Around`. For every matching around registration, `Runner.Start` calls `Begin(ctx, clone(call))` in registration order. The callback returns the context for the next callback and an optional `FinishFunc`. A callback can add values or tighter cancellation; it must not assume the returned context is the same object.

The runner copies the `Call` again for each callback. A callback may retain its copy for local accounting, but it must not mutate or share mutable nested values with another callback. The runtime remains the owner of operation identity and completion.

## Guard phase

After all matching begin callbacks have run, guards execute in registration order. `GuardFunc` receives the current context and another independent `Call` snapshot. A nil error allows the operation to continue. `hook.Deny(code, reason)` returns a validated `*hook.Denial` and blocks the operation intentionally. Any other non-nil error is wrapped in `*hook.GuardError`.

```go
package main

import (
	"context"
	"errors"
	"time"

	"github.com/looprig/harness/pkg/hook"
)

func runOne(ctx context.Context, runner *hook.Runner, call hook.Call) error {
	next, finish, err := runner.Start(ctx, call)
	_ = next // the runtime passes this to the operation implementation
	if err != nil {
		finish(hook.Result{
			Call: call, EndedAt: time.Now(),
			Outcome: hook.OutcomeDenied, Err: err,
		})
		var denial *hook.Denial
		if errors.As(err, &denial) {
			return denial
		}
		return err
	}
	// Execute the operation with next, then always finish with the same Call.
	finish(hook.Result{Call: call, EndedAt: time.Now(), Outcome: hook.OutcomeCompleted})
	return nil
}
```

The caller must call the returned finish function even when a guard blocks. `Start` returns a finish function for a handled operation and a no-op finish for an unhandled one; a nil runner is also a no-op. An invalid `Call` returns a `*hook.CallError` and no finish function, so validate that error before calling finish.

## Finish phase

The runner records only observers whose `Begin` returned a non-nil finish callback. When the caller invokes the aggregate finish, those callbacks run exactly once in reverse registration order. Each receives a cloned `Result` with the terminal `Outcome` and `Err`. A finish panic is logged and swallowed, then remaining finish callbacks and context releases still run.

```mermaid
%%{init: {"theme":"dark"}}%%
flowchart LR
    A[Start with valid Call] --> B[Begin around 0]
    B --> C[Begin around 1]
    C --> D[Run guards]
    D --> E[Operation or denial]
    E --> F[Finish around 1]
    F --> G[Finish around 0]
    G --> H[Release context bridges]
```

If `Begin` panics, that observer is logged and skipped, and dispatch continues. If it returns a nil context, it is logged and the prior context remains. A finish callback cannot change the operation result because the operation has already returned; it is an observation and cleanup phase.

## Context bridge

Observers are allowed to return a detached context, but the runner preserves the parent context's values, cancellation, and deadline. A value from the derived observer context wins; missing values fall back to the parent. When the parent is canceled, the runner propagates its cancellation cause into the derived context. Calling finish releases the bridge, including when no observer supplied a finish callback.

This preserves the authority boundary: an observer can add tracing values or shorten a deadline, but cannot make a canceled operation live again or remove the runtime's deadline. The bridge is internal to `hook.Runner`; callbacks should use the returned context for child work and stop that work when it is canceled.

See [`pkg/hook/runner.go`](https://github.com/looprig/harness/blob/main/pkg/hook/runner.go) for `Start`, `preserveParentCancellation`, and aggregate finish behavior, and [`pkg/rig/hooks_test.go`](https://github.com/looprig/harness/blob/main/pkg/rig/hooks_test.go) for ownership and singleton option tests.

## Source and proof

- [`hook.Runner` phases and context bridge](https://github.com/looprig/harness/blob/main/pkg/hook/runner.go)
- [`hook runner tests`](https://github.com/looprig/harness/blob/main/pkg/hook/runner_test.go)
- [`policy` runnable fixture (hook ordering)](https://github.com/looprig/harness/blob/main/examples/policy/example_test.go)
