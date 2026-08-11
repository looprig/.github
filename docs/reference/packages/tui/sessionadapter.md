---
id: reference/packages/tui/sessionadapter
title: TUI session adapter package
description: Session adapter lifecycle, cold replay, live gap repair, and gate-safe actions for terminal clients.
audience: developer
section: reference
order: 244
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/sessionadapter`

Session bridge in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter).

## Package role {#package-role}

The adapter turns a `session.SessionController` into the agent shape consumed by the TUI. It folds public enduring history, subscribes to live enduring and ephemeral events, and tracks open gates. It is not a session store and does not make ephemeral events durable.

## Exported surface {#exported-surface}

`Adapter` is the public alias. Constructors are `New`, `NewWithReplay`, and `Restore`; `ReplayOpener` opens a `journal.EventReplayer` for a `sessionstore.ReplayRequest`. `GateNotOpenError` reports a missing `(loop ID, tool execution ID)` gate.

## Lifecycle and errors {#lifecycle-and-errors}

`New` starts with no replay backlog. The replay constructors cold-replay and then repair gaps through a replaying live subscription. `Subscribe` returns a closeable subscription and the caller must close it. `Close` performs one session `Shutdown`; it does not own a root context or separate GC. Restore initialization failures call bounded shutdown on a detached context and return joined errors. A gate action without a matching open gate fails secure.

## Source proof {#source-proof}

The package's lifecycle declarations and replay tests are pinned at the [sessionadapter source tree](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/sessionadapter). Stage 21 proves one adapter shutdown.
