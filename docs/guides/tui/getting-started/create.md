---
id: guides/tui/getting-started/create
title: Create a TUI Screen
description: Construct the reusable tui.Screen with an Agent, an OpenAgent handoff function, and session metadata options.
audience: developer
section: guides
order: 3
publication: released
proofs:
  constructor: release-github-com-looprig-tui
  options: release-github-com-looprig-tui
  agent-and-handoff: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Create a TUI Screen

`tui.New` is the embedding seam. It accepts the application context, a current `tui.Agent`, an `tui.OpenAgent` factory, an `tui.AgentBanner`, and zero or more `tui.Option` values. The returned `tui.Screen` is a Bubble Tea model. The TUI captures the supplied session presentation at construction and uses the replacement agent's `SessionPresenter` when a cross-session resume provides fresh metadata.

## Constructor

```go
package main

import (
	"context"

	"github.com/looprig/tui"
)

func buildScreen(ctx context.Context, agent tui.Agent) tui.Screen {
	// The composition root owns the concrete agent and decides how /clear opens
	// the next session. This example reuses the same factory for that handoff.
	open := tui.OpenAgent(func(context.Context) (tui.Agent, error) {
		return agent, nil
	})

	return tui.New(
		ctx,
		agent,
		open,
		tui.AgentBanner{Name: "My Looprig Agent", Description: "Terminal workspace assistant"},
		tui.WithSessionPresentation(tui.SessionPresentation{
			WorkspaceRoot: "/work/project",
			ProfileName:   "strict",
		}),
	)
}
```

The factory above is intentionally small and deterministic for an embedding example. A production factory should construct a fresh session and return it as `tui.Agent`. The screen closes the old agent before invoking `OpenAgent` for `/clear`, so the factory must tolerate that ownership transfer.

## Options

`tui.WithSessionPresentation` supplies synchronous metadata that the screen can show before the first event arrives. `WorkspaceRoot` and `ProfileName` are display metadata, not controls. `PermissionDiagnostics` is a list of display-ready notices that should be visible before the first permission gate.

`tui.WithSessionBrowser` adds a process-scoped `SessionBrowser`. The browser lists secret-free `SessionSummary` values and resumes a selected `SessionID`. It is separate from `Agent` because browsing can outlive one session and because a resumed agent may carry a different workspace and fixed access profile.

## Agent and handoff

The `Agent` interface is the dependency inversion point. The screen calls `Submit` for the active loop and `SubmitToLoop` for the focused loop, `Subscribe` once for the whole session, and `ReplayBacklog` before live repaint when restoring. Gate replies include the loop or gate ID that produced the prompt. `OpenAgent` honors cancellation so runtime shutdown can finish a handoff without leaking a replacement.

For the process-level lifecycle, continue to [Run a TUI Entry Point](/docs/guides/tui/getting-started/run). For the full method surface, see [Events and Projections](/docs/guides/tui/runtime/events) and [Commands and Gates](/docs/guides/tui/runtime/commands).

## Source

- [Root constructor and options](https://github.com/looprig/tui/blob/main/api.go)
- [Screen constructor](https://github.com/looprig/tui/blob/main/internal/presentation/screen.go)
- [Root API compile-time proof](https://github.com/looprig/tui/blob/main/api_test.go)

## Proof

- [Root API compile-time proof](https://github.com/looprig/tui/blob/main/api_test.go)
- [Screen behavior tests](https://github.com/looprig/tui/blob/main/internal/presentation/screen_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.21.1)
