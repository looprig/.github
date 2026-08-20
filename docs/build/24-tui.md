---
id: build/24-tui
title: Terminal session interfaces
description: Build a terminal UI around a session adapter that folds public history, subscribes to live events, and disposes one live session cleanly.
audience: developer
section: build
order: 24
publication: released
examples:
  - stage-21-tui
proofs:
  screen-and-projection: release-github-com-looprig-tui
  adapter-and-replay: release-github-com-looprig-tui
  restore-and-runtime: release-github-com-looprig-tui
  runnable-proof: release-github-com-looprig-tui
---

# Terminal session interfaces

This stage pins [tui module v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c) supplies presentation, a session adapter, restore decisions, runtime plumbing, completion widgets, and styles. It does not make a second durable store. The session owns event history and shutdown; the adapter owns its live subscription, replay dependencies, and gate index.

## Screen and projection {#screen-and-projection}

`tui.New` creates a `Screen` from an `OpenAgent`, banner, and options. `FoldDisplay` projects public events into `DisplayProjection`; `AllLoopsEventFilter` requests enduring and ephemeral events across loops. Status helpers expose idle, running, interrupting, and resetting states, while tool statuses distinguish running, OK, error, and cancelled.

The root package also exposes session and presentation seams such as `Agent`, `EventStream`, `SessionBrowser`, `SessionPresentation`, `SessionPresenter`, and `RuntimeCatalog`. Attachments remain typed: missing, denied, too large, binary, unreadable, and unsupported image errors should be handled as UI states, not converted to hidden text.

## Adapter and replay {#adapter-and-replay}

`sessionadapter.New` wraps a fresh `session.SessionController` without replay. `NewWithReplay` cold-replays public enduring events; `Restore` cold-replays a restored session and reconstructs the open gate index. `ReplayOpener` is the narrow bridge to a `journal.EventReplayer`.

The adapter does not own a root context or a garbage collector. `Close` performs one session shutdown. `Subscribe` returns a closeable subscription and callers must close it. A live subscription repairs replay gaps; it does not turn ephemeral progress into durable history. Gate responses are keyed by `(loop ID, tool execution ID)`, and a missing gate produces fail-secure `GateNotOpenError`.

## Restore and runtime {#restore-and-runtime}

`restore.Decider` auto-accepts information-only drift after notifying the UI, but asks for confirmation on warnings. A user acceptance is attributed to the user; cancel and timeout return a rejected decision with a cause. `runtime.Run` owns signal shutdown, structured logging, stdout/stderr capture, Bubble Tea setup, and bounded teardown. It returns an exit code and never calls `os.Exit`; final-agent cleanup includes an in-flight handoff.

The component package provides bounded completion widgets (`InputBox`, file/session/slash/value completers) whose views accept a width and maximum row count. The styles package is pure rendering configuration: `NewMarkdownRenderer` returns an error rather than doing terminal I/O, and unknown notice levels fall back to the info style.

## Runnable proof {#runnable-proof}

The reviewed TUI fixture prints the session-adapter state, image capability, one event, and one shutdown. The reviewed source links for [sessionadapter](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter), [restore](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/restore), and [runtime](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime) are pinned to v0.15.1's release commit.
