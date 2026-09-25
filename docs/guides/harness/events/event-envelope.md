---
id: guides/harness/events/event-envelope
title: Event envelope
description: Understand event headers, identity, causality, durability, and validation.
audience: developer
section: guides
order: 4
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  header-and-lifecycle-mixins: [release-github-com-looprig-harness]
  identity-coordinates: [release-github-com-looprig-harness]
  durable-json-boundary: [release-github-com-looprig-harness]
  validation-errors: [release-github-com-looprig-harness]
  correlation-and-visibility: [release-github-com-looprig-harness]
  consumer-view: [release-github-com-looprig-harness]
  source-and-proofs: [release-github-com-looprig-harness]
---

# Event envelope

An event has one identity header and one concrete payload. `event.MarshalEvent`
adds the concrete type name and schema version around that value for durable
storage. The live subscription does not expose that JSON envelope. It delivers
the typed value plus a journal sequence in `event.Delivery`.

## Header and lifecycle mixins

The public header is exact. `identity.Coordinates` expands to
`SessionID`, `LoopID`, `TurnID`, and `StepID`; `identity.Cause` expands to
causal coordinates plus `CommandID`, `EventID`, `ToolExecutionID`, and
`Agency`.

```go
type Header struct {
	identity.Coordinates
	AgentName identity.AgentName `json:"agent_name,omitzero"`
	EventID uuid.UUID `json:"event_id,omitzero"`
	CreatedAt time.Time `json:"created_at,omitzero"`
	Cause identity.Cause `json:"cause,omitzero"`
	EventVisibility EventVisibility `json:"visibility,omitzero"`
}

func (h Header) EventHeader() Header { return h }
func (h Header) Visibility() EventVisibility { return h.EventVisibility }
func (h Header) ReplyTo() uuid.UUID { return h.Cause.CommandID }

type Class uint8
const (
	Ephemeral Class = iota
	Enduring
)

type Scope uint8
const (
	ScopeSession Scope = iota
	ScopeLoop
)

type EventVisibility uint8
const (
	Public EventVisibility = iota
	Internal
)

type ephemeral struct{}
func (ephemeral) Class() Class { return Ephemeral }
func (ephemeral) EndsTurn() bool { return false }

type enduring struct{}
func (enduring) Class() Class { return Enduring }
func (enduring) EndsTurn() bool { return false }

type terminal struct{}
func (terminal) Class() Class { return Enduring }
func (terminal) EndsTurn() bool { return true }
```

The mixins are deliberately unexported. Concrete event declarations in
`pkg/event` embed exactly one lifecycle mixin and one scope mixin. A terminal
event is Enduring by construction. The header's zero `EventVisibility` is
Public, which preserves the byte shape of journals written before visibility
was added. Internal records persist a non-zero visibility tag.

## Identity coordinates

Validation is an identity matrix, not a best-effort convention.

| Event shape | Required coordinates | Coordinates that must be zero |
| --- | --- | --- |
| Session-scoped | `SessionID` | `LoopID`, `TurnID`, `StepID` |
| Loop-scoped | `SessionID`, `LoopID` | `TurnID`, `StepID` |
| Turn-scoped | `SessionID`, `LoopID`, `TurnID` | `StepID` |
| Step/tool-scoped | `SessionID`, `LoopID`, `TurnID`, `StepID` | none |
| `InputCancelled` | `SessionID`, `LoopID`; `TurnID` is optional; `StepID` is zero | `StepID` |
| Host-owned gate | `SessionID`; inner coordinates are optional | none, except `StepID` implies `TurnID` |
| Loop-owned gate | full step shape | none |

Every event requires a non-zero `EventID`. Tool interaction and permission
review events also require a non-zero `ToolExecutionID` in their body. A
`StepID` without a `TurnID` is always invalid. `Header.Cause` is not copied into
the event's location: it identifies what caused the event, while the embedded
coordinates identify what produced it.

## Durable JSON boundary

`MarshalEvent` emits a JSON object with a `type` discriminator, `v: 1`, the
header fields, and the concrete event fields. `UnmarshalEvent` reads the
discriminator, decodes the known type, projects interface-valued fields, and
then validates identity and body. The codec rejects an unsupported schema
version and caps the encoded or accepted event at 16 MiB.

| Value | Durable behavior | Reason |
| --- | --- | --- |
| Enduring Public | Encoded, appended, and exposed by ordinary event replay | Authoritative product-visible history |
| Enduring Internal | Encoded and appended through the privileged audit path; filtered from ordinary subscriptions and public replay | Audit metadata is not product stream content |
| Ephemeral Public | Live fan-out only; `MarshalEvent` returns `*EphemeralNotPersistableError` | A later authoritative event reconstructs the state, and some payloads have no codec |
| Unknown event type or visibility | Rejected with a typed error | Restore must fail closed rather than guess |

`TokenDelta.Chunk` is `json:"-"`; it is a live `content.Chunk` interface and
there is intentionally no durable chunk codec. `StepDone.Messages` uses the
dedicated content message-slice codec, and `StepDone.Captures` uses a closed
allowlist codec that rejects unknown members. `PermissionRequested.Preview` is
`json:"-"` and is never projected, so it exists only on the live event.
`PermissionRequested.Request` and
`GateResolved.Audit` are validated and projected through their strict typed
codecs. `TurnFailed.Err` and `RestoreErrored.Err` are projected as a stable
`{kind,message}` pair; restore returns `*RestoredError` (or the explicit
model-facing restore form), never an arbitrary live error implementation.

The journal stores two bodies for a public event: the native body shown here,
which restore reads, and a public body that
[`pkg/sessionwire`](https://github.com/looprig/harness/blob/v0.41.0/pkg/sessionwire/privacy.go)
projects for session viewers. The public projection removes Host configuration
a viewer must not see:

| Event | Public body change |
| --- | --- |
| `LoopStarted`, `LoopInferenceChanged`, `LoopModeChanged` | `runtime.base_url` is omitted |
| `SessionStarted` | `workspace_root` in `config` and `manifest` becomes `/sessions/<session-id>/workspace` |
| `ConfigurationAdopted` | `workspace_root` in `manifest` becomes the same logical root; workspace-category `drift` entries drop `old` and `new` |
| `GateResolved` | `audit` is omitted |

Because the public manifest is rewritten, it no longer hashes to the adopted
fingerprint beside it. Fingerprints are checked only against the native body.

## Validation errors

Call `event.ValidateEvent` when a consumer constructs or accepts an event at a
boundary. It returns `*event.InvalidEventError` with the concrete event name,
field, and rule. The useful rules are `RuleRequired`, `RuleMustBeZero`,
`RuleInvalid`, and `RuleUnknownType`. `MarshalEvent` runs both identity and body
validation before it emits bytes.

```go
func accept(ev event.Event) error {
	if err := event.ValidateEvent(ev); err != nil {
		var invalid *event.InvalidEventError
		if errors.As(err, &invalid) {
			return fmt.Errorf("reject %s field %s: %s", invalid.Event,
				invalid.Field, invalid.Rule)
		}
		return err
	}
	return nil
}
```

Other typed codec errors carry the boundary that failed:
`*EphemeralNotPersistableError`, `*UnknownEventTypeError`,
`*UnsupportedSchemaError`, `*EventEncodeError`, `*EventDecodeError`, and
`*EventLimitError`. Do not parse their strings to decide whether restore is
safe; use `errors.As`.

## Correlation and visibility

`Header.Cause.CommandID` is the correlation ID for command outcomes. A `Reply`
event exposes it through `ReplyTo()`, but it remains in the normal event stream.
`Cause.EventID` and `Cause.ToolExecutionID` identify event or tool causes when
the producer sets them. `Cause.Agency` records machine or user agency and is
not a replacement for a gate's decision.

`Public` is the zero value. `Internal` is used by the session-scoped
`HustleStarted`, `HustleCompleted`, and `HustleFailed` audit events and the
loop-scoped permission-review events. The hub's ordinary publication path
rejects Internal events with `*hub.PublishBoundaryError{Reason:
PublishBoundaryVisibility}`. The privileged `PublishInternalEventChecked`
path accepts only the recognized internal audit types, only Enduring class,
the session's own `SessionID`, and a valid event body.

## Consumer view

Consumers should use `event.EventHeader()` instead of asserting a concrete
header layout. This keeps correlation code useful across session, loop, turn,
and step families.

```go
func correlation(delivery event.Delivery) (uuid.UUID, event.Scope) {
	h := delivery.Event.EventHeader()
	return h.Cause.CommandID, delivery.Event.Scope()
}

func durableID(delivery event.Delivery) string {
	if delivery.JournalSeq == 0 {
		return "live-only"
	}
	return strconv.FormatUint(delivery.JournalSeq, 10)
}
```

`JournalSeq` belongs only to live delivery. It is not serialized inside the
event JSON, so replay obtains the sequence from the journal cursor and the
event bytes remain stable. The sessionstore journal opens with a lease fence,
appends Enduring records under a CAS tip, deduplicates identical idempotency
IDs, and replays public events in ledger order.

## Source and proofs

- [`Header`, classes, visibility, and `Delivery`](https://github.com/looprig/harness/blob/main/pkg/event/event.go)
- [`ValidateEvent` and identity profiles](https://github.com/looprig/harness/blob/main/pkg/event/validate.go)
- [`MarshalEvent` and typed codec errors](https://github.com/looprig/harness/blob/main/pkg/event/marshal.go)
- [`Event` header and lifecycle tests](https://github.com/looprig/harness/blob/main/pkg/event/header_test.go), [`codec tests`](https://github.com/looprig/harness/blob/main/pkg/event/marshal_test.go), and [`validation tests`](https://github.com/looprig/harness/blob/main/pkg/event/validate_test.go)
- [`sessionstore` append and replay implementation](https://github.com/looprig/harness/blob/main/pkg/sessionstore/journal.go), [`replay implementation`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/replay.go), and [`visibility tests`](https://github.com/looprig/harness/blob/main/pkg/sessionstore/hustle_visibility_test.go)

Continue with [filtering and subscriptions](/docs/guides/harness/events/filtering-and-subscriptions) to choose a stream or [session lifecycle events](/docs/guides/harness/events/session-lifecycle) to interpret restore boundaries.
