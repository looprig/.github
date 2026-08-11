---
id: reference/packages/tui/components
title: TUI components package
description: Bounded terminal input and completion widgets for files, sessions, slash commands, and runtime values.
audience: developer
section: reference
order: 241
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/components`

Reusable widgets in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/components).

## Package role {#package-role}

Components own local cursor and rendering state. They do not own a session, journal, workspace snapshot, or model context. The caller feeds terminal messages and decides when a selected value becomes an action.

## Exported surface {#exported-surface}

`InputBox` is constructed with `NewInputBox` and exposes `Focus`, `Height`, `Reset`, `Resize`, `SetBackground`, `SetMinLines`, `SetValue`, `SetVerticalPadding`, `Update`, `Value`, and `View`. `FileComplete`, `SessionComplete`, `SlashComplete`, and `ValueComplete` expose constructors, cursor movement, row selection, selected values, and bounded views. Records are `FileItem`, `SessionItem`, `SlashCmd`, `ValueItem`; `SlashCommands` is the canonical command list.

## Lifecycle and errors {#lifecycle-and-errors}

Constructors can return `nil` for an empty completion source where documented. `SelectWindowRow` accepts the current row bound and reports whether selection changed. Views require width and maximum rows for bounded rendering; input height tracks the visible textarea and remains capped. The caller owns the widget and may discard it without a close operation.

## Source proof {#source-proof}

The package declarations and rendering tests are pinned in the [components source tree](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/components). The stage 21 example is the module's reviewed consumer proof.
