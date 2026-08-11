---
id: reference/packages/tui/restore
title: TUI restore package
description: Interactive drift decision policy for restoring sessions with information and warning changes.
audience: developer
section: reference
order: 242
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  lifecycle-and-errors: release-github-com-looprig-tui
  source-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/restore`

Restore decision adapter in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/restore).

## Package role {#package-role}

The package translates an `event.DriftAssessment` into a session restore decision. It owns presentation policy, not the durable session state or replay store.

## Exported surface {#exported-surface}

`UI` is the narrow seam with `ConfirmDrift(context.Context, warnings)` and `Notify(infos)`. `Decider` implements the restore decision, with `NewDecider(ui)` and `DecideRestore`. `NewTerminalUI` supplies the production terminal implementation.

## Lifecycle and errors {#lifecycle-and-errors}

Information-only changes are notified and accepted automatically. Warning changes call `ConfirmDrift`; acceptance is marked as a user decision. Context cancellation, timeout, or UI failure returns a rejected decision and preserves the cause. The caller owns the UI and may reuse a decider for multiple restore attempts.

## Source proof {#source-proof}

See the pinned [restore implementation and tests](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/restore) and the stage 21 consumer proof.
