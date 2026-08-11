---
id: modules/foreignloops
title: Foreign agent runtimes
description: Adapt ACP, Claude, and Codex processes to Harness through neutral driver contracts and restorable builders.
audience: developer
section: modules
order: 18
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  boundary:
    - release-github-com-looprig-foreignloops
  composition:
    - release-github-com-looprig-foreignloops
    - release-github-com-looprig-acp
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-foreignloops
  errors-and-limits:
    - release-github-com-looprig-foreignloops
  runnable-proof:
    - release-github-com-looprig-foreignloops
---

# Foreign agent runtimes

Foreignloops `v0.2.3` adapts external agent processes without making provider wire formats part of Harness. It offers neutral driver contracts, a Harness backend, an ACP driver, and explicit Claude and Codex CLI drivers.

## Boundary {#boundary}

The `driver` package owns normalized turns, streams, observations, steering, posture, and history availability. `backend` maps those contracts to a Harness foreign loop. `driver/acp` adapts an ACP child; `driver/claude` and `driver/codex` construct provider-specific agents from an explicit parent environment and validated configuration.

## Composition {#composition}

Register `backend.BuildWith` plus `BuildRestoredWith` under one runtime profile, or register the service variants when a child needs broker and delivery services. The live builder creates a provider process and returns a Harness backend; the restored builder validates persisted foreign identity and rehydrates the provider session. The parent Rig still owns gate, workspace, model, and delegation ceilings.

## Lifecycle {#lifecycle}

A foreign turn starts from a `driver.Turn`, yields normalized events, and ends with an exit, interruption, or failure. History is explicit: Claude can provide authoritative transcript history, while the Codex v1 driver reports it unavailable. Restore creates a new backend from persisted state; it never assumes the old process remains alive. Locks, snapshots, delivery reservations, and shutdown errors are surfaced to Harness.

## Errors and limits {#errors-and-limits}

Use typed spawn, decode, history, exit, snapshot, lock, profile, and provider configuration errors. Steering admission is bounded and can return `ErrSteerAdmissionCapacity`. A foreign driver cannot elevate the requested posture, bypass a gate, add host paths, or convert unavailable history into replayable local events.

## Runnable proof {#runnable-proof}

`stage-15-acp-foreign` registers live and restored service builders for an ACP Codex profile and asserts both are available. Run it with `node scripts/docs/run-examples.mjs`. See the [pinned backend](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/), [driver contracts](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/), and [ACP adapter](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/).
