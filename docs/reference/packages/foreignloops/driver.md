---
id: reference/packages/foreignloops/driver
title: driver package · driver
description: Reference for provider-neutral foreign agent turns, events, history, posture, and steering.
audience: developer
section: reference
order: 201
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions-and-methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants-and-variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# driver package · driver

Import path: `github.com/looprig/foreignloops/driver`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

`Agent` creates provider turns; `Turn` carries prompt, cwd, posture, and session selection; `Stream` yields normalized updates; `History` states whether a provider's history is authoritative. Steering is explicit and bounded.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewSteerRequest(prompt []content.Block) (SteerRequest, error)`

### Methods {#methods}

- `func (*SteerAdmissionError) Error() string`
- `func (*SteerAdmissionError) Unwrap() error`
- `func (e *SpawnError) Error() string`
- `func (e *SpawnError) Unwrap() error`
- `func (e *ExitError) Error() string`
- `func (e *DecodeError) Error() string`
- `func (e *DecodeError) Unwrap() error`
- `func (e *HistoryError) Error() string`
- `func (e *HistoryError) Unwrap() error`
- `func (p Posture) Valid() bool`
- `func (r SteerRequest) Validate() error`
- `func (r SteerRequest) Prompt() []content.Block`
- `func (e *steerRequestError) Error() string`
- `func (o SteerOutcome) Valid() bool`
- `func (o SteerOutcome) RetrySafe() bool`
- `func (r SteerResult) Validate() error`
- `func (k ObservationKind) Valid() bool`
- `func (PromptObservation) Kind() ObservationKind`
- `func (o PromptObservation) Sequence() uint64`
- `func (UpdateObservation) Kind() ObservationKind`
- `func (o UpdateObservation) Sequence() uint64`
- `func (SteerObservation) Kind() ObservationKind`
- `func (o SteerObservation) Sequence() uint64`

### Types {#types}

`Agent`, `Steerer`, `Closer`, `Turn`, `Stream`, `Kind`, `Event`, `PermissionPosture`, `SteerAdmissionError`, `SpawnError`, `ExitError`, `DecodeError`, `HistoryError`, `History`, `Posture`, `SteerRequest`, `SteerOutcome`, `SteerResult`, `ObservationKind`, `Observation`, `OrderedStream`, `PromptObservation`, `UpdateObservation`, `SteerObservation`

### Constants {#constants}

`KindInit`, `KindTextDelta`, `KindThinkingDelta`, `KindToolUse`, `KindToolResult`, `KindStepComplete`, `KindTerminalOK`, `KindTerminalError`, `KindModelFacingError`, `PostureDefault`, `PostureAcceptEdits`, `PostureReadOnly`, `PostureWorkspaceWrite`, `SteerOutcomeInjected`, `SteerOutcomeFallbackRequired`, `SteerOutcomeUnsupported`, `SteerOutcomeAdmissionUnknown`, `SteerOutcomeDeliveryUnknown`, `SteerOutcomeDeliveredUntrackable`, `ObservationPrompt`, `ObservationUpdate`, `ObservationSteer`

### Variables {#variables}

`ErrSteerAdmissionCapacity`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `SteerAdmissionError`, `SpawnError`, `ExitError`, `DecodeError`, `HistoryError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [driver/driver.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/driver.go)
- [driver/errors.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/errors.go)
- [driver/history.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/history.go)
- [driver/posture.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/posture.go)
- [driver/steering.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/steering.go)

Adjacent tests at the same commit:

- [driver/deps_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/deps_test.go)
- [driver/driver_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/driver_test.go)
- [driver/errors_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/errors_test.go)
- [driver/posture_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/posture_test.go)
- [driver/steering_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/driver/steering_test.go)

Run `GOWORK=off go test ./...` from the `foreignloops` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
