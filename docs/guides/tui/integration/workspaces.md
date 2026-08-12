---
id: guides/tui/integration/workspaces
title: Workspaces and Session Presentation
description: Display workspace and fixed access-profile context without turning security metadata into a mutable TUI control.
audience: developer
section: guides
order: 20
publication: released
proofs:
  session-presentation: release-github-com-looprig-tui
  fixed-profile: release-github-com-looprig-tui
  resumed-context: release-github-com-looprig-tui
  adapter-ownership: release-github-com-looprig-tui
  source: release-github-com-looprig-tui
  proof: release-github-com-looprig-tui
---

# Workspaces and Session Presentation

`SessionPresentation` is synchronous, consumer-supplied metadata. It tells the TUI which workspace root and fixed access profile to display, plus any permission diagnostics that must be visible before the first gate. It is not a workspace capability and it is not a setter for authorization.

## Session presentation

```go
presentation := tui.SessionPresentation{
	WorkspaceRoot: "/work/project",
	ProfileName: "strict",
	PermissionDiagnostics: []string{
		"manual network policy is active",
	},
}

screen := tui.New(ctx, agent, open, banner, tui.WithSessionPresentation(presentation))
_ = screen
```

`WorkspaceRoot` appears in footer metadata. `ProfileName` appears as a fixed uppercase badge. Empty or whitespace-only values are omitted. Diagnostics are trimmed, empty lines are dropped, and the remaining notices are committed in startup metadata before an event or permission prompt can arrive.

## Fixed profile

The profile has no runtime setter. `RuntimeCatalog` and `RuntimeController` can expose mode, model, and effort choices per loop, but access posture remains fixed for the session. This separation keeps an operator from mistaking a display tray for an authorization change.

The TUI never infers security context from an event or from a stale prior session. The composition root should fill the presentation from the same policy that built the session.

## Resumed context

An agent can implement the optional `SessionPresenter` interface:

```go
type SessionPresenter interface {
	SessionPresentation() tui.SessionPresentation
}
```

On a cross-session browser resume, the screen refreshes the footer and pre-gate diagnostics from the replacement agent. An agent without this capability clears the presentation for a cross-session resume rather than displaying another session's workspace or profile. A `/clear` reopen in the same session family retains the construction-time value when no replacement presenter is available.

## Adapter ownership

The Harness session, not the TUI, owns the workspace root lease, snapshots, and garbage collection. `sessionadapter.Adapter` delegates session close and workspace checkpoint methods to the controller. The screen displays the root and routes events; it does not mount, mutate, or recover a workspace itself.

For the actual workspace capabilities and tool permits, read [Tools](/docs/guides/tools/) and [Harness](/docs/guides/harness/). For durable workspace recovery during a session restore, use the Harness session APIs before constructing the adapter.

## Source

- [Session presentation types and option](https://github.com/looprig/tui/blob/main/internal/presentation/sessionpresentation.go)
- [Screen presentation refresh](https://github.com/looprig/tui/blob/main/internal/presentation/screen.go)
- [Adapter session ownership](https://github.com/looprig/tui/blob/main/sessionadapter/adapter.go)

## Proof

- [Screen lifecycle and presentation tests](https://github.com/looprig/tui/blob/main/internal/presentation/screen_test.go)
- [Adapter behavior tests](https://github.com/looprig/tui/blob/main/sessionadapter/adapter_test.go)
- [TUI module release record](https://github.com/looprig/tui/releases/tag/v0.15.1)
