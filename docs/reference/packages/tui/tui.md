---
id: reference/packages/tui/tui
title: TUI root package
description: Terminal screen construction, event projection, agent seams, status values, and typed attachment errors.
audience: developer
section: reference
order: 240
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui`

Root presentation package in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c).

## Package role {#package-role}

The package turns a session-facing `Agent` and event stream into a terminal `Screen`. `FoldDisplay` is a presentation projection; it does not become a second event journal or session store.

## Exported surface {#exported-surface}

Functions are `New`, `WithSessionBrowser`, `WithSessionPresentation`, `FoldDisplay`, `AllLoopsEventFilter`, and `RenderStatusLine`. Public seams and views include `Agent`, `AgentHolder`, `AgentBanner`, `OpenAgent`, `EventStream`, `Screen`, `RuntimeController`, `RuntimeCatalog`, `SessionBrowser`, `SessionPresentation`, `SessionPresenter`, `SessionID`, `SessionSummary`, `DisplayProjection`, `Status`, `ToolCallView`, `ToolStatus`, `LoopRuntimeOptions`, and option/model/mode/effort identifiers. Status and tool constants cover idle/running/interrupting/resetting and running/OK/error/cancelled.

## Lifecycle and errors {#lifecycle-and-errors}

The caller owns the session and calls the returned screen/runtime teardown path. Attachment reads fail with typed missing, denied, too-large, unreadable, binary, or unsupported-image errors. Preserve those distinctions in the UI; do not silently place binary or inaccessible data in model context.

## Source proof {#source-proof}

The [stage 21 TUI example](../../../examples/index.md#stage-21-tui) proves adapter state, image capability, one event, and shutdown. Declarations are pinned to the [release tree](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c).
