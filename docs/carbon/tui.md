---
id: carbon/tui
title: Use Carbon's terminal UI
description: Navigate Carbon's supplied TUI, change runtime model controls, browse sessions, and understand clear and shutdown behavior.
audience: [human, operator]
section: carbon
order: 14
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  runtime:
    - release-github-com-looprig-carbon
  runtime-controls:
    - release-github-com-looprig-carbon
  sessions-and-clear:
    - release-github-com-looprig-carbon
  quit-and-signal-handling:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Use Carbon's terminal UI

Carbon ships a terminal UI through its runtime composition. The TUI is the
product interface for a live session; it is not a browser wrapper around the
same process. Carbon constructs the session, attaches its access executor and
MCP manager, then lets the runtime drive the TUI until a quit, signal, or
fatal runtime error.

## Runtime controls

The TUI can present the selected access profile, workspace root, permission
diagnostics, current primer, effort, and mode. The primer selector uses the
validated `models.json` candidates. Effort and quick/deep mode changes are
accepted only when the selected model admits them. A model switch can adjust
the effort to the candidate's default when the current effort is unavailable.

The access profile is not a TUI control. Choose it before opening Carbon with
`--access-profile`; changing a model or mode cannot grant more filesystem,
network, command, or home authority.

## Sessions and `/clear`

The first open honors `--resume <uuid>` if supplied. `/clear` closes the current
session and asks the store for a fresh one, so it is useful for starting a clean
conversation without reusing the old session ID. The session browser lists
other sessions for the current workspace and can resume a selected one through
the store factory.

## Quit and signal handling

Carbon installs a signal-aware process context for SIGINT and SIGTERM. The
runtime drains the TUI and session before the process-level store factory
closes. Runtime close is idempotent and linearized: the session adapter stops
loops, MCP adoption closes, MCP connections close, access executors release,
and credential runtime ends in reverse construction order.

If the terminal closes unexpectedly, reopen with `carbon --list` before using
`--resume`. A session may have a completed journal even when the terminal did
not render its final output.

## Evidence

The Carbon entry point and runtime runner are in
[`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
Runtime controls and close ordering are in
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go)
and [`internal/app/assembly.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/assembly.go).
