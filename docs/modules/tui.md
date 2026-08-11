---
id: modules/tui
title: TUI module
description: Released package reference for terminal screens, session replay, restore decisions, runtime teardown, widgets, and rendering styles.
audience: developer
section: modules
order: 24
publication: released
examples:
  - stage-21-tui
proofs:
  module-and-screen: release-github-com-looprig-tui
  session-adapter: release-github-com-looprig-tui
  runtime-and-restore: release-github-com-looprig-tui
  components-and-styles: release-github-com-looprig-tui
---

# TUI module

The released module is [github.com/looprig/tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c). The package family separates presentation from session ownership: TUI folds public events and renders them, while the session remains the owner of event history, live subscriptions, and shutdown.

## Module and screen {#module-and-screen}

The root `github.com/looprig/tui` package exports `New`, `WithSessionBrowser`, `WithSessionPresentation`, `FoldDisplay`, `AllLoopsEventFilter`, and `RenderStatusLine`. Its public types include `Agent`, `Screen`, `EventStream`, `SessionBrowser`, `SessionPresentation`, `SessionPresenter`, `SessionSummary`, `Status`, `ToolCallView`, `RuntimeCatalog`, and typed attachment/image errors. Status constants cover idle, running, interrupting, and resetting; tool constants cover running, OK, error, and cancelled.

The root package does not persist session state. `DisplayProjection` is a view projection of events and state supplied by the session adapter. Keep event history, session state, workflow artifacts, workspace snapshots, and model context distinct when deciding what to restore.

## Session adapter {#session-adapter}

`github.com/looprig/tui/sessionadapter` exports `New`, `NewWithReplay`, `Restore`, `ReplayOpener`, `Adapter`, and `GateNotOpenError`. `New` starts with no backlog. `NewWithReplay` and `Restore` cold-replay public enduring events through the opener, fold gates, and then subscribe live. A returned subscription is closeable and must be closed by its caller.

The adapter owns only the live session handle, replay dependencies, and gate index. `Close` performs one session shutdown and does not own a root context or an independent garbage collector. Restore failures use a bounded detached shutdown and return the primary error joined with any teardown failure. Gate keys include loop ID and tool execution ID; a missing match is a fail-secure `GateNotOpenError`.

## Runtime and restore {#runtime-and-restore}

`github.com/looprig/tui/restore` exports `Decider`, `UI`, `NewDecider`, `NewTerminalUI`, and `Decider.DecideRestore`. Information-only drift is notified and accepted; warning drift is confirmed; cancellation or timeout rejects with its cause. User acceptance is attributed to the user.

`github.com/looprig/tui/runtime` exports `Run` and `Banner`. `Run` installs signal-driven shutdown, opens `~/.looprig/looprig.log`, captures output, starts the Bubble Tea program, closes the final agent, and returns a process exit code without calling `os.Exit`. Teardown includes a final in-flight handoff.

## Components and styles {#components-and-styles}

`github.com/looprig/tui/components` exports `InputBox`, file/session/slash/value completion records and completers, `SlashCommands`, and bounded view/select methods. Constructors copy command catalogs where documented; views take width and row limits. `InputBox.Update` forwards tea messages, grows to the visible content cap, and `Reset` clears text.

`github.com/looprig/tui/styles` exports named palette styles and `DeriveBackgroundSGR`, `FillLineBackground`, `FillLineBackgroundWith`, `NewMarkdownRenderer`, `NoticeStyle`, `RenderMarkdown`, and `ToolNode`. Rendering helpers are pure; `NewMarkdownRenderer` returns construction errors, and an unknown notice level falls back to the neutral info style. All package links above point at the [pinned release source tree](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c).
