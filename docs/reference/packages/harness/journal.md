---
id: reference/packages/harness/journal
title: journal package · journal
description: Reference for Harness journal records, leases, idempotency, replay, and appenders.
audience: developer
section: reference
order: 148
publication: released
examples:
  - stage-08-session-store
  - stage-09-restore
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# journal package · journal

Import path: `github.com/looprig/harness/pkg/journal`. Journal supplies the append, lease, route, idempotency, replay, and record interfaces used to persist a session history.

## Package role {#package-role}

`JournalRecord` is the sealed record boundary. Event, command, gate, and fence appenders add the correct route and codec envelope. `Lease` and `LeaseFence` prevent two session owners from appending concurrently; cursors and replay requests make recovery explicit.

## Exported surface {#exported-surface}

The package exports `SessionJournal`, `JournalRecord`, `EventRecord`, `CommandRecord`, `FenceRecord`, `GatePreparedRecord`, `RecordCursor`, `EventCursor`, `EventReplayer`, `RecordReplayer`, `IdempotentJournal`, `IdempotencyIndex`, `Lease`, `LeaseFence`, appenders, `ReplayRequest`, `StartPos`, and fingerprint helpers. Constructors include `NewEventRecord`, `NewCommandRecord`, `NewFenceRecord`, `NewGatePreparedRecord`, `NewFingerprint`, `NewIdempotencyIndex`, and checked appender constructors.

### Functions and methods {#functions-and-methods}

Marshal and unmarshal functions cover gate-prepared records and lease fences. `Beginning` and `FromSeq` create replay positions; `WithHooks` decorates a journal with a hook runner.

### Types {#types}

Typed failures cover append, route mismatch, delivery transition, lease held/lost, not-ready, idempotency collision, oversized records, unsupported follow, and record codec errors.

### Constants and variables {#constants-and-variables}

Record kinds and start positions are value-level contracts. There is no default persistent backend in this package.

## Ownership and errors {#ownership-and-errors}

The session store owns the concrete journal and its lease. Appenders must be closed or allowed to finish before lease release. A lost lease or idempotency collision is not safe to ignore or retry blindly.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned journal package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/). The storage and restore progressive examples use the durable journal path.
