---
id: guides/harness/gates/index
title: Overview
description: Admit or reject effects at explicit Harness policy boundaries.
audience: developer
section: guides
order: 10
publication: released
proofs:
  envelope: [release-github-com-looprig-harness]
  payload-union: [release-github-com-looprig-harness]
  ownership: [release-github-com-looprig-harness]
  lifecycle: [release-github-com-looprig-harness]
  restore-and-failover: [release-github-com-looprig-harness]
  limits-and-errors: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Overview

A gate is a durable, typed pause at an effect boundary. The public `gate.Gate` envelope tells a renderer what is waiting and where its answer belongs. The private `gate.Payload` records the authoritative request used for validation. The session owns the gate directory and durable transitions; an opener owns only the capability explicitly given to it.

## Envelope

`gate.Gate` has these exact fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `ID` | `gate.ID` alias of `uuid.UUID` | Session-minted identity. |
| `Kind` | `gate.Kind` | `KindPermission`, `KindAskUser`, `KindForm`, or `KindOpenURL`. |
| `Resolver` | `gate.ResolverKind` | `ResolverLoop` or `ResolverSession`. |
| `Blocks` | `gate.Blocks` | `BlocksToolCall` or `BlocksSession`. |
| `Effect` | `gate.Effect` | `EffectResume`, `EffectInitiate`, or `EffectControl`. |
| `Criticality` | `gate.Criticality` | `GateCritical` or `GateNonCritical`. |
| `Subject` | `gate.Subject` | `ToolExecutionID`, `ToolUseID`, `TurnID`, `StepID`, and `InputID` identities. |
| `Prompt` | `gate.Prompt` | Title, body, trusted origin/schema projection, and controls. |
| `ResponsePolicy` | `gate.ResponsePolicy` | Timeout behavior and response template. |
| `Restorable` | `bool` | Whether the gate is eligible for restore. Open-URL gates must be false. |

`gate.Route` carries `GateID`, `LoopID`, and `ToolExecutionID` for response delivery. A route is session-private. `Subject` identifies what the gate is about; it is not permission authority and does not authorize a caller to invent a route.

## Payload union

`gate.Payload` is a sealed interface. `MarshalPayload` and `UnmarshalPayload` use a strict `{kind,data}` wrapper with these variants:

| Variant | Fields | Durable rule |
| --- | --- | --- |
| `OpenPayload` | `GateID`, nested `Payload` | Private prepare record wrapper. |
| `PermissionPayload` | `Request tool.Request` | Request is validated at both codec boundaries and contains no grant token. |
| `AskUserPayload` | `Question string`, `Choices []string` | Explicit question and optional fixed choices. |
| `ResumeInputPayload` | `InputID uuid.UUID`, `Preview string` | Resume input identity and bounded preview. |
| `FormPayload` | `Title`, `Body string`; `Schema PromptSchema` | Schema is validated by `ValidateFormSchema`; answer audit is bounded. |
| `OpenURLPayload` | `DisplayOrigin`, `URL`, `RequiresCompletion` | `URL` is `json:"-"` and omitted by a separate durable encoder; decoded URLs are always empty. |

Unknown kinds, nil payloads, malformed wrappers, duplicate JSON keys, trailing JSON, and payload invariant failures return typed errors such as `*UnknownPayloadKindError`, `*NilPayloadError`, `*PayloadEncodeError`, `*PayloadDecodeError`, and `*RequestDecodeError`. The payload, not a caller-supplied prompt projection, is the source for form schemas and open-URL origins.

## Ownership

| Gate family | Normal owner | How it resolves | Authority deliberately absent |
| --- | --- | --- | --- |
| Permission | Loop | `Session.RespondGate` translates the exact approval action to the parked loop. | A host cannot mint an approval against another loop. |
| Ask-user | Loop | `Session.RespondGate` translates the answer to loop input. | No host opening API. |
| Form | Session host | `session.GateHost.OpenHostGate`, then `AwaitGateAnswer` or `CloseGate`. | No tool grant or loop route. |
| Open URL | Session host | Host receives a live completion answer; action URL never becomes durable. | Cannot be restorable or exposed in `Prompt.Origin`. |

`session.GateHost` is separate from `session.SessionController`. Its opener must call `AwaitGateAnswer` or `CloseGate`; abandoning both leaks the live answer slot. A public `GateResponse` may identify its source as user, policy, model, or classifier, but `ResponseFromClassifier` is rejected by `Session.RespondGate`; only the private permission-review path can construct that provenance.

## Lifecycle

Loop-owned gates use two durable phases so the loop can install its blocker before the prompt becomes visible. The session first appends a private `GatePreparedRecord`, then `ActivateGate` appends public `GateOpened` and makes the gate listable. A host-owned open combines those phases because `OpenHostGate` installs the answer slot before activation.

```mermaid
%%{init: {"theme":"dark"}}%%
sequenceDiagram
    participant O as Opener
    participant S as Session
    participant J as Journal
    participant C as Client or Host
    O->>S: PrepareGateOpen(kind, payload)
    S->>J: GatePrepared(private payload)
    O->>S: ActivateGate(route)
    S->>J: GateOpened(public envelope)
    S-->>C: ListGates / event
    C->>S: RespondGate(response)
    S->>J: GateResolved
    S-->>O: command or host Answer
```

`RespondGate` is durable-first: it claims the open entry, appends `GateResolved`, removes the entry, then delivers a loop command or host answer. If the append fails, the claim is reverted and the gate remains answerable. `CloseGate` follows the same durable-first rule for public gates; a still-preparing entry is removed without a public close event.

## Restore and failover

When a session is restored, for example on another Host after a crash or drain, the session rebuilds its gate directory from the journal. An open gate is reinstalled as answerable only if it is a restorable permission gate, or an ask-user gate whose parked step the restore resumes. Every other open gate, including form and open-URL gates, is closed with a `GateResolved` whose reason is `gate.CloseRestoreUnavailable`. A restored permission gate never starts a new classifier review, so only a user or policy answer resolves it.

A loop-owned tool gate records a private resume snapshot, `event.GatePrepared.Resume` of type `*event.ToolStepResume` (`StepIndex`, the step's assistant `Message`, and the gated call's `ToolUseID`). It carries raw tool arguments, so it is kept only in the private prepare record and never appears in a public event. On restore, the native active loop resumes its open turn at the parked step when every gate it owns carries a valid snapshot of the same uncommitted step and no compaction ran inside the turn:

- **Permission gates.** Nothing in the batch executed before access resolution, so the whole batch runs again. The gated call adopts the restored gate only if its re-evaluated request is unchanged. Any restored gate that is not adopted is closed `abandoned` before anything runs; if that durable close fails, nothing runs and the turn fails. The approved tool runs once.
- **Ask-user gates.** Only a tool implementing `tool.UserInputReplaySafe` and returning true is re-run, and it adopts the gate only for the exact same question and choices. The answer becomes its tool result. Sibling calls that may already have taken effect are not re-run; each receives an explicit outcome-unknown error result.

When those conditions do not hold, the turn is interrupted and an unresumed ask-user gate is closed `restore_unavailable`. Declare `UserInputReplaySafe` only when every path before the question is free of external effects.

## Limits and errors

`rig.GateCaps` has `MaxOpen int` and `MaxTimeout time.Duration`; `rig.WithGateCaps(caps)` installs the option and rejects negative values with `rig.DefinitionInvalidGateCaps`. `MaxOpen` counts preparing, open, and claiming entries, and zero means unlimited. Zero `MaxTimeout` also means no timeout cap. A permission gate opened with no response policy defaults to a five-minute timeout that answers `Deny`. A timeout above `MaxTimeout` or a full directory returns `*session.GateError{Kind: session.GateCapacity}`.

`session.GateError` has `GateID gate.ID`, `Kind session.GateErrorKind`, and `Cause error`. Its kinds are `GateNotFound`, `GateNotReady`, `GateKindMismatch`, `GateActionInvalid`, `GateCapacity`, and `GateAppendFailed`. Gate validation adds `*gate.GateValidationError` for `GateRestorableNotAllowed` and `GateOriginInvalid`. Use `errors.As` rather than string matching.

The public envelope and payload codecs live in [`pkg/gate`](https://github.com/looprig/harness/tree/main/pkg/gate); session ownership is implemented in [`internal/sessionruntime/gates.go`](https://github.com/looprig/harness/blob/main/internal/sessionruntime/gates.go) and exposed through [`pkg/session/session.go`](https://github.com/looprig/harness/blob/main/pkg/session/session.go).

## Source and proof

- [`gate` envelope and payload package](https://github.com/looprig/harness/tree/main/pkg/gate)
- [`session gate ownership`](https://github.com/looprig/harness/blob/main/internal/sessionruntime/gates.go)
- [`policy` runnable fixture](https://github.com/looprig/harness/blob/main/examples/policy/example_test.go)
