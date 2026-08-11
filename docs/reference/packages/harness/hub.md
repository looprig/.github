---
id: reference/packages/harness/hub
title: hub package · hub
description: Reference for Harness session event publication, subscriptions, persistence faults, and turn reservations.
audience: developer
section: reference
order: 145
publication: released
examples:
  - stage-07-session-events
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# hub package · hub

Import path: `github.com/looprig/harness/pkg/hub`. Hub is the in-process event fan-out and session publication boundary.

## Package role {#package-role}

`Hub` publishes events to subscriptions, coordinates append and commit observation, and reports faults that affect the session. It also reserves turn starts and tracks hustle activity so callers cannot begin work after a session has stopped.

## Exported surface {#exported-surface}

The package contains `Hub`, `EventSubscription`, `FaultReporter`, `HustleActivityLease`, `TurnStartReservation`, options for appenders, event factories, commit observers, and fault reporters, plus typed publication, subscription-loss, session-abort, persistence, and turn-reservation errors.

### Functions and methods {#functions-and-methods}

`New` constructs a hub with a session ID and options. Hub methods publish events, subscribe, reserve turn starts, and close the publication boundary.

### Types {#types}

`SessionPhase`, `HustleActivityReason`, `PublishBoundaryReason`, and `TurnStartReservationReason` classify lifecycle state; corresponding errors preserve the reason without exposing unbounded event data.

### Constants and variables {#constants-and-variables}

`ErrSessionStopped` is the sentinel for admission after shutdown. Option functions configure collaborators without global state.

## Ownership and errors {#ownership-and-errors}

The session owns the hub and closes subscriptions during shutdown. Subscribers own their read loop and must handle a closed channel plus `Err` separately. A persistence fault is not equivalent to a transient subscriber cancellation.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned hub package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hub/). `stage-07-session-events` exercises the event stream and terminal lifecycle.
