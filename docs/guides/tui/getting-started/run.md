---
id: guides/tui/getting-started/run
title: Run a TUI Entry Point
description: Use runtime.Run for signal-aware process setup, Bubble Tea execution, logging, and bounded agent teardown.
audience: developer
section: guides
order: 4
publication: released
proofs:
  runner: release-github-com-looprig-tui
  entry-point: release-github-com-looprig-tui
  entry-point-responsibilities: release-github-com-looprig-tui
  exit-and-teardown: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Run a TUI Entry Point

`runtime.Run` is the process-level entry point for a terminal application. It returns an integer status and leaves `os.Exit` to the caller. The runner creates a signal-aware context, opens the structured log, calls your agent factory, starts the TUI, captures third-party stdout and stderr while the managed frame is active, and closes the live agent during teardown.

## Runner

```go
package main

import (
	"context"
	"errors"
	"os"

	"github.com/looprig/tui"
	"github.com/looprig/tui/runtime"
)

func main() {
	code := runtime.Run(
		context.Background(),
		func(ctx context.Context) (tui.Agent, error) {
			// Replace this stub with the application's Harness-backed factory.
			return nil, errors.New("agent factory is not configured")
		},
		runtime.Banner{Name: "My Looprig Agent", Description: "Terminal workspace assistant"},
	)
	os.Exit(code)
}
```

The factory receives the signal-aware context. On a successful startup, `runtime.Run` passes the same factory to `tui.New` as the `/clear` reopen function, so one composition path defines both initial construction and replacement construction.

## Entry-point responsibilities

The runner owns process plumbing that would otherwise be repeated by every CLI. It writes structured logs and redirected library output to `~/.looprig/looprig.log`, clears the terminal before the managed frame, asks Bubble Tea to run the `tui.Screen`, and restores standard streams before reporting an error. Signal cancellation asks Bubble Tea to quit cleanly.

The runner does not create a Harness `Rig`, choose credentials, select a model, or decide workspace policy. Those remain in the factory. See [Harness Sessions and Gates](/docs/guides/tui/integration/harness) for the adapter boundary.

## Exit and teardown

`Run` returns `0` after a clean run and teardown. Agent construction failure, a Bubble Tea run error, or a retained terminal handoff error returns the agent-error status. The final model is inspected through `AgentHolder`, `TerminalErrorHolder`, and `HandoffFinalizer` so `/clear` cannot leave a replacement session open or hide a fatal handoff failure.

For the event contract that drives the screen, read [Events and Projections](/docs/guides/tui/runtime/events). For the state transitions behind shutdown and `/clear`, read [Lifecycle and Handoffs](/docs/guides/tui/runtime/lifecycle).

## Source

- [Process runner](https://github.com/looprig/tui/blob/main/runtime/run.go)
- [Runtime API compile-time proof](https://github.com/looprig/tui/blob/main/runtime/api_test.go)
- [Runtime behavior tests](https://github.com/looprig/tui/blob/main/runtime/run_test.go)
- [Runtime host example](https://github.com/looprig/tui/blob/main/examples/runtimehost/example_test.go)

## Proof

- [Runtime behavior tests](https://github.com/looprig/tui/blob/main/runtime/run_test.go)
- [Runtime host example](https://github.com/looprig/tui/blob/main/examples/runtimehost/example_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
