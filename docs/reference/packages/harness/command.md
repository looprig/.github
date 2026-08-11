---
id: reference/packages/harness/command
title: command package · command
description: Reference for Harness command envelopes, acknowledgements, and validation.
audience: developer
section: reference
order: 140
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# command package · command

Import path: `github.com/looprig/harness/pkg/command`. Command is the bounded internal-to-session envelope for interrupts, input, gates, compaction, process notifications, delegation, loop changes, and shutdown. It is not a public network protocol.

## Package role {#package-role}

Commands carry a header, command name, route, and typed payload into a session's serialized control path. The package keeps command validation separate from event validation so an acknowledgement cannot be mistaken for a durable event.

## Exported surface {#exported-surface}

The public surface includes `Command`, `Header`, `CommandName`, `CommandField`, `GateRoute`, `Rule`, and command values such as `Interrupt`, `Shutdown`, `UserInput`, `ApproveToolCall`, `DenyToolCall`, `Compact`, `SetLoopMode`, `ChangeLoopInference`, `ReplaceLoopExternalTools`, `ProcessNotification`, `CancelQueuedInput`, and delegation commands. `MarshalCommand`, `UnmarshalCommand`, and `ValidateCommand` are the codec boundary.

### Functions and methods {#functions-and-methods}

`MarshalCommand`, `UnmarshalCommand`, and `ValidateCommand` encode, decode, and validate the sealed command union.

### Types {#types}

Command structs model one control operation. Result enums distinguish process notification, delegate cancellation, and delivery phases. Typed errors include `CommandDecodeError`, `CommandEncodeError`, `CommandValidationError`, `CommandLimitError`, `InvalidCommandError`, `UnknownCommandTypeError`, `UnbufferedAckError`, and `LoopTerminatedError`.

### Constants and variables {#constants-and-variables}

Command-name and field constants identify the wire discriminator and replace-tool field. The package has no mutable global registry.

## Ownership and errors {#ownership-and-errors}

The caller owns command values until the session accepts them. Validate before enqueueing; malformed, oversized, unknown, or route-incompatible commands must not reach a loop runtime. Error text is diagnostic only, so branch with `errors.Is` and `errors.As`.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned command source](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/command/). Delegation and quota behavior is exercised by `stage-14-delegation`; run it with `node scripts/docs/run-examples.mjs`.
