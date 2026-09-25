---
id: guides/harness/session-persistence/journal/records-and-append
title: Records and append
description: Write ordered journal records with stable identities.
audience: developer
section: guides
order: 11
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  record-sum: [release-github-com-looprig-harness]
  record-identity: [release-github-com-looprig-harness]
  envelope-and-offload: [release-github-com-looprig-harness]
  appender-adapters: [release-github-com-looprig-harness]
  code-first-writer: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Records and append

`JournalRecord` is a sealed sum. Only `pkg/journal` can add a variant, so a
backend's codec switch is exhaustive and a foreign value cannot masquerade as
a record.

## Record sum

The exact public wrappers are:

```go
type JournalRecord interface {
	IdempotencyID() string
}

type EventRecord struct { /* event is package-private */ }
func NewEventRecord(event.Event) EventRecord
func (EventRecord) Event() event.Event

type CommandRecord struct { /* sessionID, loopID, command are package-private */ }
func NewCommandRecord(sessionID, loopID uuid.UUID, cmd command.Command) CommandRecord
func (CommandRecord) Command() command.Command
func (CommandRecord) SessionID() uuid.UUID
func (CommandRecord) LoopID() uuid.UUID

type LeaseFence struct { Epoch uint64 `json:"epoch"` }
type FenceRecord struct { /* sessionID and fence are package-private */ }
func NewFenceRecord(sessionID uuid.UUID, fence LeaseFence) FenceRecord
func (FenceRecord) Fence() LeaseFence
func (FenceRecord) SessionID() uuid.UUID

type GatePreparedRecord struct { /* prepared and payload are package-private */ }
func NewGatePreparedRecord(event.GatePrepared, gate.OpenPayload) GatePreparedRecord
func (GatePreparedRecord) Prepared() event.GatePrepared
func (GatePreparedRecord) Payload() gate.OpenPayload

type CommandApplicationRecord struct { /* app is package-private */ }
func NewCommandApplicationRecord(runtimecommand.Application) CommandApplicationRecord
func (CommandApplicationRecord) Application() runtimecommand.Application

type CommandDispositionRecord struct { /* disposition is package-private */ }
func NewCommandDispositionRecord(runtimecommand.CommandDisposition) CommandDispositionRecord
func (CommandDispositionRecord) Disposition() runtimecommand.CommandDisposition
```

The unexported marker is intentionally omitted from the snippet above because
external packages cannot implement it. The source declaration includes that
marker and the one required `IdempotencyID` method.

| Variant | Durable kind | ID | Visibility |
| --- | --- | --- | --- |
| `EventRecord` | `event` | `Header.EventID` | Enduring event only |
| `CommandRecord` | `command` | physical command ID | private intent log |
| `FenceRecord` | `fence` | decimal lease epoch | private ownership boundary |
| `GatePreparedRecord` | `gate_prepared` | prepared event ID | private payload and projection |
| `CommandApplicationRecord` | `command_application` | `command-application:<public command ID>` | private, written before the command's effect |
| `CommandDispositionRecord` | `command_disposition` | `command-disposition:<attempt ID>` | private, bodiless, written after the effect |

The last two exist for runtime commands a Host admits through
`pkg/runtimecommand`. The application record maps a public command ID to the
one runtime command ID and lease epoch it runs under, so a redelivery after a
crash finds the original mapping instead of applying the command twice. The
disposition record states what became of one dispatch attempt. It is keyed on
the attempt, so a successor cannot record `not_applied` over an attempt whose
disposition is already durable: the append fails with
`*journal.IdempotencyCollisionError`.

An Ephemeral event cannot be encoded by `event.MarshalEvent`; the writer fails
closed instead of accidentally making it durable. `GatePreparedRecord` must be
used for a private gate payload. Appending a `GatePrepared` as a public
`EventRecord` is rejected.

## Record identity

`CommandRecord` has both a logical and physical identity. Ordinary commands and
delegate intent use the command UUID. A `fallback_queued` delegate delivery
uses `command-id/fallback_queued`, allowing intent and fallback to coexist
without weakening ordinary idempotency. The route (`sessionID`, `loopID`) is
needed for dispatch but is not part of the persisted command fingerprint.

Phased delegate commands also validate that the embedded target loop agrees
with the `CommandRecord` route. A mismatch returns
`*journal.CommandRouteMismatchError`; fallback cannot precede its matching
intent or change its phase-normalized payload.

## Envelope and offload

The storage backend frames each record in the
[SessionStore](/docs/modules/sessionstore) envelope, a versioned binary frame
encoded by `sessionstore.EncodeEnvelope`. The Harness record kind maps onto a
SessionStore envelope kind:

| Harness record | Envelope kind | Body |
| --- | --- | --- |
| `FenceRecord` | opening fence | none; the lease epoch is an envelope field |
| public `EventRecord` | public event | native runtime body plus the canonical public projection |
| internal `EventRecord`, `CommandRecord`, `GatePreparedRecord` | runtime control | native runtime body |
| `CommandApplicationRecord` | application prefix | none; the mapping is envelope fields |
| `CommandDispositionRecord` | command disposition | none; the disposition is envelope fields |

A public event carries two bodies. The runtime body is what replay decodes into
an `event.Event`; the public body is the redacted wire projection produced by
`pkg/sessionwire` once, at append time, and reported back through
`journal.CommittedPublicJournal`. Readers that serve viewers should use those
stored public bytes rather than projecting the event again.

Each body above the store's threshold (512 KiB by default, and never above
SessionStore's 512 KiB inline ceiling) is written as a SessionStore object of
kind `journal-runtime` or `journal-public` before the frame referencing it is
appended. When two individually valid inline bodies would exceed the frame
ceiling, the larger one is offloaded. A runtime body above 16 MiB is refused
with `*journal.RecordTooLargeError` before anything is written, because replay
could never admit it. An append failure leaves the tracked tip unchanged.

Ledgers written by older releases used a JSON envelope with a `blobptr` kind
pointing at `sessions/<uuid>/blobs/<sha256>`. Replay and GC still read those
frames; new frames are always written in the SessionStore envelope.

## Appender adapters

The checked constructors fail loudly on nil wiring:

```go
func NewJournalEventAppenderChecked(
	journal SessionJournal, opts ...AppenderOption,
) (*JournalEventAppender, error)
func NewJournalCommandAppenderChecked(SessionJournal) (*JournalCommandAppender, error)
func NewJournalGateAppenderChecked(SessionJournal) (*JournalGateAppender, error)
func NewJournalRuntimeCommandAppenderChecked(SessionJournal) (*JournalRuntimeCommandAppender, error)
```

`JournalEventAppender.AppendEvent` appends an Enduring event and then updates
the derived catalog best-effort. `AppendEventResult` preserves whether this
call created a new frame. `JournalCommandAppender` is audit-only: the session
decides whether a command append failure should block dispatch. Gate appenders
are strict for prepare/open/resolve transitions. The runtime-command appender
writes application and disposition records and refuses a journal that cannot
deduplicate with `*journal.NonIdempotentJournalError`, because a redelivered
command must be detectable at the append.

## Code-first writer

```go
func appendEvent(ctx context.Context, j journal.SessionJournal, ev event.Event) error {
	if ev.Class() != event.Enduring {
		return fmt.Errorf("only Enduring events belong in a journal")
	}
	seq, err := j.Append(ctx, journal.NewEventRecord(ev))
	if err != nil {
		var collision *journal.IdempotencyCollisionError
		if errors.As(err, &collision) {
			return fmt.Errorf("event identity collision at seq %d: %w", collision.Seq, err)
		}
		return err
	}
	log.Printf("durable event sequence=%d", seq)
	return nil
}
```

The session runtime normally uses the hub's durable tap instead of calling
`Append` directly, preserving append-before-apply ordering and the live
`JournalSeq` on the delivery.

## Source and proof

- [`JournalRecord` and variants](https://github.com/looprig/harness/blob/main/pkg/journal/record.go)
- [`record codecs`](https://github.com/looprig/harness/blob/main/pkg/journal/record_json.go)
- [`storage framing`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/journal.go)
- [SessionStore envelope codec](https://github.com/looprig/sessionstore/blob/main/envelope.go)
- [`journal appenders`](https://github.com/looprig/harness/blob/main/pkg/journal/appender.go)
- [`record and route tests`](https://github.com/looprig/harness/blob/main/pkg/journal/record_test.go)
- [`offload and append tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/journal_test.go)
