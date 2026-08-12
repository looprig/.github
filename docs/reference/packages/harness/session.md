---
id: reference/packages/harness/session
title: session package · session
description: Reference for live session contracts, restore decisions, gates, workspace recovery, and typed session failures.
audience: developer
section: reference
order: 153
publication: released
examples:
  - stage-07-session-events
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

# session package · session

Import path: `github.com/looprig/harness/pkg/session`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Session` submits user input, exposes active loops, subscribes to events, answers gates, controls turns, and shuts down. `SessionController` and `GateHost` are narrower seams for serving and adapters. Restore deciders validate persisted identity, configuration fingerprints, runtime profiles, and workspace state before admitting a session.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

- `func (DefaultPolicyDecider) DecideRestore(_ context.Context, a event.DriftAssessment) (RestoreDecision, error)`
- `func (AcceptAllDecider) DecideRestore(_ context.Context, _ event.DriftAssessment) (RestoreDecision, error)`
- `func (e *SessionError) Error() string`
- `func (e *SessionError) Unwrap() error`
- `func (e *TurnRejectedError) Error() string`
- `func (e *ConfigMismatchError) Error() string`
- `func (e *RestoreRejectedError) Error() string`
- `func (e *RestoreRejectedError) Unwrap() error`
- `func (e *AgentNameMismatchError) Error() string`
- `func (e *RestoreRuntimeMismatchError) Error() string`
- `func (e *RestoreRuntimeMismatchError) Unwrap() error`
- `func (e *RestoreDiscoveryError) Error() string`
- `func (e *RestoreError) Error() string`
- `func (e *RestoreError) Unwrap() error`
- `func (e *GateError) Error() string`
- `func (e *GateError) Unwrap() error`
- `func (e *GateError) GateErrorKind() string`
- `func (*WorkspaceNotConfiguredError) Error() string`
- `func (e *WorkspaceRootBusyError) Error() string`
- `func (e *WorkspaceRootBusyError) Unwrap() error`
- `func (*WorkspaceRootLeaseLostError) Error() string`
- `func (e *WorkspaceRecoveryError) Error() string`
- `func (e *WorkspaceRecoveryError) Unwrap() error`

### Types {#types}

`RestoreDecision`, `RestoreDecider`, `DefaultPolicyDecider`, `AcceptAllDecider`, `SessionErrorKind`, `SessionError`, `TurnRejectedError`, `ConfigMismatchError`, `RestoreRejectedError`, `AgentNameMismatchError`, `RestoreRuntimeMismatchError`, `RestoreDiscoveryErrorKind`, `RestoreDiscoveryError`, `RestoreErrorKind`, `RestoreError`, `GateErrorKind`, `GateError`, `WorkspaceNotConfiguredError`, `WorkspaceRootBusyError`, `WorkspaceRootLeaseLostError`, `WorkspaceRecoveryError`, `Session`, `GateHost`, `SessionController`

### Constants {#constants}

`SessionIDGenerationFailed`, `SessionLoopIDGenerationFailed`, `SessionLoopExited`, `SessionLoopNotFound`, `SessionEventChannelClosed`, `SessionContextDone`, `SessionClosing`, `SessionFaulted`, `SessionLoopDepthExceeded`, `SessionLoopQuotaExceeded`, `SessionForeignBuilderMissing`, `SessionCompactionUnsupported`, `SessionDelegateIntentAppendFailed`, `SessionDelegateAdmissionCommitFailed`, `RestoreRuntimeMissing`, `RestoreRuntimeUnavailable`, `RestoreRuntimeTargetMismatch`, `RestoreRuntimeCredentialMismatch`, `RestoreRuntimeEffortMismatch`, `RestoreNoSessionStarted`, `RestoreNoPrimerLoop`, `RestoreLeaseFailed`, `RestoreJournalFailed`, `RestoreReplayFailed`, `RestoreAppendFailed`, `RestoreAdoptionInvalid`, `RestoreLoopFailed`, `RestoreContextDone`, `RestoreIDGenerationFailed`, `RestoreForeignSIDMissing`, `RestoreForeignBuilderMissing`, `RestoreMaterializeFailed`, `GateNotFound`, `GateNotReady`, `GateKindMismatch`, `GateActionInvalid`, `GateCapacity`, `GateAppendFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `SessionError`, `TurnRejectedError`, `ConfigMismatchError`, `RestoreRejectedError`, `AgentNameMismatchError`, `RestoreRuntimeMismatchError`, `RestoreDiscoveryError`, `RestoreError`, `GateError`, `WorkspaceNotConfiguredError`, `WorkspaceRootBusyError`, `WorkspaceRootLeaseLostError`, `WorkspaceRecoveryError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/session/decider.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/decider.go)
- [pkg/session/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/errors.go)
- [pkg/session/session.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/session.go)

Adjacent tests at the same commit:

- [pkg/session/contracts_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/contracts_test.go)
- [pkg/session/decider_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/decider_test.go)
- [pkg/session/errors_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/session/errors_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
