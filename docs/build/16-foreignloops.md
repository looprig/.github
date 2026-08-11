---
id: build/16-foreignloops
title: Build 16: foreign runtimes
description: Adapt external agent processes to a neutral driver and restore them through Harness-owned builders without treating provider history as local truth.
audience: developer
section: build
order: 16
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  driver-contract:
    - release-github-com-looprig-foreignloops
  builders-and-restore:
    - release-github-com-looprig-foreignloops
    - release-github-com-looprig-harness
  lifecycle:
    - release-github-com-looprig-foreignloops
  errors-and-limits:
    - release-github-com-looprig-foreignloops
  runnable-proof:
    - release-github-com-looprig-foreignloops
---

# Build 16: foreign runtimes

Foreignloops turns an ACP, Claude, or Codex process into a Harness backend through a provider-neutral driver contract. It keeps per-turn prompt, workspace, permission posture, session selection, normalized observations, and authoritative-history claims explicit.

## Driver contract {#driver-contract}

`driver.Agent` creates a turn from a `driver.Turn`; `Stream` yields normalized `Event` values and `Observation` values, while `History` reports whether authoritative provider history is available. `Posture` and `PermissionPosture` describe requested safety posture without pretending that a provider accepted more authority than it did. Steering uses `NewSteerRequest` and returns an explicit `SteerOutcome`.

The provider driver owns wire translation and process details. The Harness backend owns loop identity, event publication, gate routing, workspace bindings, and parent provenance. Provider transcript paths and raw protocol messages do not cross the neutral boundary.

## Builders and restore {#builders-and-restore}

`backend.BuildWith` and `BuildWithServices` produce live builders; their restored counterparts reconstruct a backend from the persisted foreign identity. Register both with `foreign.BuilderRegistry` under the same `loop.RuntimeProfileName`. A restored builder must validate the saved profile, session identity, and provider capabilities before delivering a loop. If history is unavailable, the backend reports that fact instead of fabricating a local replay.

## Lifecycle {#lifecycle}

A foreign loop starts under a session-owned lock, publishes normalized events, and closes its stream and provider process before the Harness loop becomes terminal. Restore uses the same builder registry but does not reuse a live process. Delivery reservations and resolutions are explicit, so an interruption or restart cannot silently turn an unknown delivery into a confirmed response.

## Errors and limits {#errors-and-limits}

Handle `SpawnError`, `DecodeError`, `HistoryError`, `ExitError`, `SnapshotError`, profile lookup errors, and typed provider configuration errors. Claude can expose authoritative transcript history; the Codex v1 driver reports it as unavailable. A foreign backend cannot exceed the Harness runtime profile, gate, workspace, or delegation ceiling.

## Runnable proof {#runnable-proof}

`stage-15-acp-foreign` registers `BuildWithServices` and `BuildRestoredWithServices` for a Codex ACP profile and verifies that both constructors and scoped services are present without spawning a real provider. Run it with `node scripts/docs/run-examples.mjs`. Read the [neutral driver](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/), [ACP adapter](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/acp/), and [backend builders](https://github.com/looprig/foreignloops/tree/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/).
