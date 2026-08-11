---
id: reference/packages/tui/runtime
title: TUI runtime package
description: Process-level terminal runtime that installs signals, logging, output capture, and bounded agent teardown.
audience: [developer, operator]
section: reference
order: 243
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/runtime`

Process runtime in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime).

## Package role {#package-role}

`runtime` composes the terminal process around a caller-supplied agent factory. It owns process plumbing and teardown, not session persistence or model-provider configuration.

## Exported surface {#exported-surface}

`Banner` carries startup `Name` and `Description`. `Run(context.Context, newAgent, Banner, ...tui.Option) int` constructs the agent, starts the screen, and returns an exit code. The caller supplies the `newAgent` callback used for initial creation and `/clear` reopen.

## Lifecycle and errors {#lifecycle-and-errors}

`Run` opens `~/.looprig/looprig.log`, installs signal-driven cancellation, captures stdout and stderr, starts Bubble Tea, and closes the final agent with bounded teardown. It never invokes `os.Exit`. A final in-flight handoff is closed before the process returns; the integer result is the only process-exit contract.

## Source proof {#source-proof}

Runtime lifecycle tests and declarations are pinned at the [release source tree](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/runtime).
