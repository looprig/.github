---
id: agents/repositories/tui
title: Reusable terminal UI
description: Adapt a Harness session to the terminal screen and run it through the managed Bubble Tea runtime.
audience: agent
section: agents/repositories
order: 24
publication: released
proofs:
  module:
    - release-github-com-looprig-tui
---
# tui

`github.com/looprig/tui@v0.15.1` exposes a reusable terminal screen, session adapter, components, styles, restore prompts, and runtime. Use `sessionadapter.New(sessionController)` for a fresh ephemeral session; use `NewWithReplay` or `Restore` with a `ReplayOpener` when durable events and gate state must be reconstructed.

Create the screen with `tui.New(ctx, agent, openAgent, banner, options...)`. `tui/runtime.Run` owns log setup, signal handling, stdout and stderr capture, Bubble Tea startup, and bounded close. The package is a presentation layer over the public Harness session contracts, not a requirement for web or headless clients.

The adapter filters visibility, folds events, indexes gates, and closes the session exactly once. Missing replay, gap repair, gate resolution, context, terminal, and agent errors are returned or surfaced through the terminal error holder. Proofs: [`sessionadapter/adapter.go`](https://github.com/looprig/tui/blob/b37258f96032bf478d25111409990a5e38577727/sessionadapter/adapter.go), [`runtime/run.go`](https://github.com/looprig/tui/blob/c7a4c6d26f8ca5952b782d6cf2d574325e649ef4/runtime/run.go), [`api.go`](https://github.com/looprig/tui/blob/b2d88ad42aad1c37481b7bd745b9af18bd36e88b/api.go), [`examples/restore/example_test.go`](https://github.com/looprig/tui/blob/b2d88ad42aad1c37481b7bd745b9af18bd36e88b/examples/restore/example_test.go).
