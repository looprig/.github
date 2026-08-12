---
id: reference/packages/harness/identity
title: identity package · identity
description: Reference for Harness agent names, coordinates, provenance, and identity boundaries.
audience: developer
section: reference
order: 147
publication: released
examples:
  - stage-14-delegation
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

# identity package · identity

Import path: `github.com/looprig/harness/pkg/identity`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package identity holds the shared correlation types used across the loop, command, and event packages: the Coordinates quartet, the Cause causal edge, and the Agency audit enum.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

No exported functions are declared in this package.

### Methods {#methods}

- `func (a Agency) String() string`

### Types {#types}

```go
type Coordinates struct {
	SessionID uuid.UUID `json:"session_id,omitzero"`
	LoopID    uuid.UUID `json:"loop_id,omitzero"`
	TurnID    uuid.UUID `json:"turn_id,omitzero"`
	StepID    uuid.UUID `json:"step_id,omitzero"`
}
```

```go
type AgentName string
```

```go
type Agency uint8
```

```go
type Cause struct {
	Coordinates
	CommandID       uuid.UUID `json:"command_id,omitzero"`
	EventID         uuid.UUID `json:"event_id,omitzero"`
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`
	Agency          Agency    `json:"agency,omitzero"`
}
```

### Constants {#constants}

`AgencyMachine`, `AgencyUser`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/identity/identifier_types.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/identity/identifier_types.go)

Adjacent tests at the same commit:

- [pkg/identity/identifier_types_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/identity/identifier_types_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
