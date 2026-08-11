---
id: reference/packages/tui/styles
title: TUI styles package
description: Pure terminal palette, background, markdown, notice, and tool-node rendering helpers.
audience: developer
section: reference
order: 245
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/styles`

Rendering palette in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/styles).

## Package role {#package-role}

Styles centralize terminal colors and markup behavior for the screen and components. They do not access a terminal, session, journal, or model context.

## Exported surface {#exported-surface}

Named constants and variables cover accent bars, dots, rails, thinking, workflow markers, tool-card panels, prompts, cards, user/background styles, and status colors. Functions are `DeriveBackgroundSGR`, `FillLineBackground`, `FillLineBackgroundWith`, `NewMarkdownRenderer`, `NoticeStyle`, `RenderMarkdown`, and `ToolNode`; `NodeStatus` selects tool-node tint.

## Lifecycle and errors {#lifecycle-and-errors}

`NewMarkdownRenderer(width)` returns a construction error when Glamour cannot build a renderer. `RenderMarkdown` returns rendering errors. `NoticeStyle` maps info, warning, and error levels and falls back to info for unknown values. Background helpers return a degenerate pair when a terminal color cannot supply an SGR fill; callers should skip filling in that case.

## Source proof {#source-proof}

See the pinned [styles declarations](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/styles) and the stage 21 release consumer.
