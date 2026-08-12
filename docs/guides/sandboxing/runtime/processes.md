---
id: guides/sandboxing/runtime/processes
title: Prepared Processes and Lifetime
description: Prepare a single-use process, stream live pipes, supervise lifetime, and close resources safely.
audience: developer
section: guides
order: 11
publication: released
proofs:
  prepare-start-wait: [release-github-com-looprig-sandbox]
  process-access-is-frozen: [release-github-com-looprig-sandbox]
  tty-and-signals: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  process-api: [release-github-com-looprig-sandbox]
  lifecycle: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Prepared Processes and Lifetime

`Executor.PrepareProcess` is the asynchronous counterpart to `RunArgv`. Preparation validates the command and directory, checks command admission, redeems and consumes supplied grants, reserves path handles and proxy credentials, and compiles the transient backend spec without spawning. The returned `PreparedProcess` is single-use. `Start` transfers the reservation capsule to a background supervisor; `Close` releases an unstarted preparation.

## Prepare, start, wait

```go
package example

import (
	"context"
	"fmt"
	"io"

	"github.com/looprig/sandbox"
)

func stream(executor *sandbox.Executor, workspace string) error {
	prepared, err := executor.PrepareProcess(context.Background(), sandbox.ProcessOptions{
		Directory: workspace,
		Command:   "printf 'hello\\n'",
	})
	if err != nil {
		return err
	}
	defer prepared.Close() // no-op after Start consumes it

	process, err := prepared.Start(context.Background())
	if err != nil {
		return err
	}
	defer process.Close(context.Background())

	output, err := io.ReadAll(process.Stdout())
	if err != nil {
		return err
	}
	result, err := process.Wait(context.Background())
	if err != nil {
		return err
	}
	fmt.Printf("exit=%d output=%q lifetime=%v\\n",
		result.ExitCode, output, process.LifetimeContainment())
	return nil
}
```

`Stdout()` and `Stderr()` are distinct pipes for pipe mode. `Stdin()` is a concurrent-safe writer whose `Close` delivers EOF and makes later writes return `ErrProcessStdinClosed`. `Wait` starts the one real wait lazily, caches its result, and lets a canceled wait context stop only that caller. It does not kill the process. The background supervisor also calls `Wait`, so a caller that forgets to wait does not strand the process cleanup.

## Process access is frozen

`PreparedProcess.EffectiveAccess()` returns a defensive immutable description: `ProcessAccessReadOnly`, `ProcessAccessScopedWrite` with canonical write paths/trees, or `ProcessAccessBroadWrite`. A later grant or workspace lease cannot widen that preparation. This is useful to Harness or a Tool runtime that needs to classify workspace invalidation after the process completes.

## TTY and signals

Set `ProcessOptions.TTY` only when a real terminal is required. Unix can provide a PTY and Windows can provide ConPTY on supported hosts, but a selected backend without terminal wiring returns `ErrProcessTTYUnsupported` rather than silently returning pipes. `StreamMode()` reports `ProcessStreamModePipes` or `ProcessStreamModePTY`.

`Signal` accepts `ProcessSignalInterrupt`, `ProcessSignalTerminate`, or `ProcessSignalKill`. Terminate has one grace period and at most one escalation. A pipe process can fail closed with `ErrProcessSignalUnsupported` when a platform/backend has no signal adapter. `LifetimeContainment()` is the actual process-tree teardown contract: `Enforced`, `BestEffort`, or `Unspecified`. Darwin Seatbelt can be best effort; Linux namespace/cgroup and Windows Job paths can be enforced. Do not collapse those values into a generic “process killed” claim.

## Source

- [PreparedProcess and Process API](https://github.com/looprig/sandbox/blob/main/internal/exec/process.go)
- [Executor lifecycle barriers](https://github.com/looprig/sandbox/blob/main/internal/exec/executor_lifecycle.go)

## Proof

- [Prepared process lifecycle tests](https://github.com/looprig/sandbox/blob/main/internal/exec/process_lifecycle_test.go)
