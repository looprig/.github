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
  functions: release-github-com-looprig-harness
  methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants: release-github-com-looprig-harness
  variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# journal package · journal

Import path: `github.com/looprig/harness/pkg/journal`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`JournalRecord` is the sealed record boundary. Event, command, gate, and fence appenders add the correct route and codec envelope. `Lease` and `LeaseFence` prevent two session owners from appending concurrently; cursors and replay requests make recovery explicit.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithCatalog(c catalogUpdater) AppenderOption`
- `func NewJournalEventAppender(journal SessionJournal, opts ...AppenderOption) *JournalEventAppender`
- `func NewJournalEventAppenderChecked(journal SessionJournal, opts ...AppenderOption) (*JournalEventAppender, error)`
- `func NewJournalCommandAppender(journal SessionJournal) *JournalCommandAppender`
- `func NewJournalCommandAppenderChecked(journal SessionJournal) (*JournalCommandAppender, error)`
- `func NewJournalGateAppender(journal SessionJournal) *JournalGateAppender`
- `func NewJournalGateAppenderChecked(journal SessionJournal) (*JournalGateAppender, error)`
- `func WithHooks(j SessionJournal, runner *hook.Runner, sessionID uuid.UUID) SessionJournal`
- `func HookMiddleware(runner *hook.Runner, sessionID uuid.UUID) AppendMiddleware`
- `func NewFingerprint(kind string, body []byte) Fingerprint`
- `func NewIdempotencyIndex() *IdempotencyIndex`
- `func NewEventRecord(ev event.Event) EventRecord`
- `func NewCommandRecord(sessionID, loopID uuid.UUID, cmd command.Command) CommandRecord`
- `func ValidateCommandRecordRoute(record CommandRecord) error`
- `func NewFenceRecord(sessionID uuid.UUID, fence LeaseFence) FenceRecord`
- `func NewGatePreparedRecord(prepared event.GatePrepared, payload gate.OpenPayload) GatePreparedRecord`
- `func MarshalLeaseFence(f LeaseFence) ([]byte, error)`
- `func UnmarshalLeaseFence(data []byte) (LeaseFence, error)`
- `func MarshalGatePreparedRecord(rec GatePreparedRecord) ([]byte, error)`
- `func UnmarshalGatePreparedRecord(data []byte) (GatePreparedRecord, error)`
- `func Beginning() StartPos`
- `func FromSeq(seq uint64) StartPos`

### Methods {#methods}

- `func (*NilJournalError) Error() string`
- `func (nopCatalogUpdater) UpdateOnEvent(context.Context, event.Event, uint64) error`
- `func (a *JournalEventAppender) AppendEvent(ctx context.Context, ev event.Event) (uint64, error)`
- `func (a *JournalEventAppender) AppendEventResult(ctx context.Context, ev event.Event) (uint64, bool, error)`
- `func (a *JournalCommandAppender) AppendCommand(ctx context.Context, rec CommandRecord) error`
- `func (a *JournalGateAppender) AppendGatePrepared(ctx context.Context, rec GatePreparedRecord) error`
- `func (a *JournalGateAppender) AppendGateOpened(ctx context.Context, ev event.GateOpened) error`
- `func (a *JournalGateAppender) AppendGateResolved(ctx context.Context, ev event.GateResolved) error`
- `func (e *MarshalRecordError) Error() string`
- `func (e *MarshalRecordError) Unwrap() error`
- `func (e *RecordKindError) Error() string`
- `func (e *AppendError) Error() string`
- `func (e *AppendError) Unwrap() error`
- `func (e *AmbiguousAckError) Error() string`
- `func (e *AmbiguousAckError) Unwrap() error`
- `func (e *RecordTooLargeError) Error() string`
- `func (e *RecordTooLargeError) Unwrap() error`
- `func (e *JournalNotReadyError) Error() string`
- `func (e *JournalLeaseLostError) Error() string`
- `func (e *JournalLeaseLostError) Unwrap() error`
- `func (*appendPanicError) Error() string`
- `func (j *appendFuncJournal) Append(ctx context.Context, record JournalRecord) (uint64, error)`
- `func (e *IdempotencyCollisionError) Error() string`
- `func (idx *IdempotencyIndex) Observe(id string, seq uint64, fp Fingerprint)`
- `func (idx *IdempotencyIndex) Check(id string, fp Fingerprint) (seq uint64, duplicate bool, err error)`
- `func (e *LeaseHeldError) Error() string`
- `func (e *LeaseLostError) Error() string`
- `func (e *CommandRouteMismatchError) Error() string`
- `func (e *DeliveryTransitionError) Error() string`
- `func (r EventRecord) Event() event.Event`
- `func (r EventRecord) IdempotencyID() string`
- `func (id CommandRecordID) String() string`
- `func (r CommandRecord) LogicalCommandID() uuid.UUID`
- `func (r CommandRecord) DeliveryPhase() command.DelegateDeliveryPhase`
- `func (r CommandRecord) PhysicalID() CommandRecordID`
- `func (r CommandRecord) NormalizedDeliveryFingerprint() (Fingerprint, error)`
- `func (r CommandRecord) Command() command.Command`
- `func (r CommandRecord) SessionID() uuid.UUID`
- `func (r CommandRecord) LoopID() uuid.UUID`
- `func (r CommandRecord) IdempotencyID() string`
- `func (r FenceRecord) Fence() LeaseFence`
- `func (r FenceRecord) SessionID() uuid.UUID`
- `func (r FenceRecord) IdempotencyID() string`
- `func (r GatePreparedRecord) Prepared() event.GatePrepared`
- `func (r GatePreparedRecord) Payload() gate.OpenPayload`
- `func (r GatePreparedRecord) IdempotencyID() string`
- `func (e *FenceEncodeError) Error() string`
- `func (e *FenceEncodeError) Unwrap() error`
- `func (e *FenceDecodeError) Error() string`
- `func (e *FenceDecodeError) Unwrap() error`
- `func (e *GatePreparedEncodeError) Error() string`
- `func (e *GatePreparedEncodeError) Unwrap() error`
- `func (e *GatePreparedDecodeError) Error() string`
- `func (e *GatePreparedDecodeError) Unwrap() error`
- `func (p StartPos) Seq() uint64`
- `func (e *FollowUnsupportedError) Error() string`

### Types {#types}

`NilJournalError`, `JournalEventAppender`, `AppenderOption`, `JournalCommandAppender`, `JournalGateAppender`, `MarshalRecordError`, `RecordKindError`, `AppendError`, `AmbiguousAckError`, `RecordTooLargeError`, `JournalNotReadyError`, `JournalLeaseLostError`, `AppendFunc`, `AppendMiddleware`, `AppendResult`, `IdempotentJournal`, `IdempotencyCollisionError`, `Fingerprint`, `IdempotencyIndex`, `SessionJournal`, `Lease`, `LeaseHeldError`, `LeaseLostError`, `CommandRouteMismatchError`, `DeliveryTransitionError`, `JournalRecord`, `EventRecord`, `CommandRecord`, `CommandRecordID`, `LeaseFence`, `FenceRecord`, `GatePreparedRecord`, `FenceEncodeError`, `FenceDecodeError`, `GatePreparedEncodeError`, `GatePreparedDecodeError`, `RecordReplayer`, `RecordCursor`, `StartPos`, `ReplayRequest`, `EventReplayer`, `EventCursor`, `FollowUnsupportedError`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `NilJournalError`, `MarshalRecordError`, `RecordKindError`, `AppendError`, `AmbiguousAckError`, `RecordTooLargeError`, `JournalNotReadyError`, `JournalLeaseLostError`, `IdempotencyCollisionError`, `LeaseHeldError`, `LeaseLostError`, `CommandRouteMismatchError`, `DeliveryTransitionError`, `FenceEncodeError`, `FenceDecodeError`, `GatePreparedEncodeError`, `GatePreparedDecodeError`, `FollowUnsupportedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/journal/appender.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/appender.go)
- [pkg/journal/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/errors.go)
- [pkg/journal/hooked.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/hooked.go)
- [pkg/journal/idempotency.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/idempotency.go)
- [pkg/journal/journal.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/journal.go)
- [pkg/journal/lease.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/lease.go)
- [pkg/journal/record.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/record.go)
- [pkg/journal/record_json.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/record_json.go)
- [pkg/journal/record_replay.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/record_replay.go)
- [pkg/journal/replay.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/replay.go)

Adjacent tests at the same commit:

- [pkg/journal/appender_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/appender_test.go)
- [pkg/journal/delivery_transition_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/delivery_transition_test.go)
- [pkg/journal/hooked_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/hooked_test.go)
- [pkg/journal/idempotency_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/idempotency_test.go)
- [pkg/journal/record_json_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/record_json_test.go)
- [pkg/journal/record_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/journal/record_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
