---
id: reference/packages/harness/event
title: event package · event
description: Reference for the sealed Harness event union, codecs, filters, and lifecycle values.
audience: developer
section: reference
order: 141
publication: released
examples:
  - stage-07-session-events
  - stage-19-http-serve
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# event package · event

Import path: `github.com/looprig/harness/pkg/event`. Event is the sealed vocabulary for rig, session, loop, turn, step, tool, gate, process, workspace, restore, and integration transitions.

## Package role {#package-role}

Every event has a producer `Header`, lifecycle class, visibility, and scope. Durable events are replay inputs; ephemeral streaming values are intentionally not persisted. Reply events carry correlation data for a command or gate.

## Exported surface {#exported-surface}

The package exports `Event`, `Header`, `Factory`, `EventFilter`, `Delivery`, `Subscription`, and lifecycle values including `SessionStarted`, `LoopStarted`, `TurnStarted`, `ToolCallStarted`, `ToolCallCompleted`, `GateOpened`, `GateResolved`, `ProcessStarted`, `ProcessCompleted`, `WorkspaceCheckpointed`, `WorkspaceRestored`, restore events, compaction events, and foreign/MCP integration events. `MarshalEvent`, `UnmarshalEvent`, `ValidateEvent`, `ShouldDeliver`, and `ErrKind` are the functional boundary.

### Functions and methods {#functions-and-methods}

`NewFactory` creates IDs and timestamps through injected functions. `MarshalEvent` and `UnmarshalEvent` encode the union; `ValidateEvent` checks limits and lifecycle invariants; `ShouldDeliver` filters by scope and visibility; `CompactWaiterReplyID` derives a reply correlation ID; `AssessDrift` compares configuration manifests.

### Types {#types}

Typed events include session, loop, turn, tool, gate, permission review, process, workspace, compaction, restore, configuration, foreign delivery, and workflow activity values. Error types include decode, encode, validation, limit, unsupported-schema, panic, empty-response, and non-persistable failures.

### Constants and variables {#constants-and-variables}

The package defines schema version, event classes, scopes, visibility values, strictness, workflow status, restore tombstone categories, and bounded field names. `ManifestSchemaVersion` identifies the durable manifest format.

## Ownership and errors {#ownership-and-errors}

Event values are caller-owned until appended. Do not persist ephemeral events or expose private events through a public reader. Validate before encoding and use `errors.As` for typed failures; event text and model-facing details are bounded.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned event package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/). `stage-07-session-events` and the read-only serving example `stage-19-http-serve` exercise event publication and filtering.
