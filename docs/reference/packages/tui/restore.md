---
id: reference/packages/tui/restore
title: TUI restore package
description: Interactive drift decision policy for restoring sessions with information and warning changes.
audience: developer
section: reference
order: 242
publication: released
examples:
  - stage-21-tui
proofs:
  package-role: release-github-com-looprig-tui
  exported-surface: release-github-com-looprig-tui
  functions: release-github-com-looprig-tui
  methods: release-github-com-looprig-tui
  types: release-github-com-looprig-tui
  constants: release-github-com-looprig-tui
  variables: release-github-com-looprig-tui
  ownership-and-errors: release-github-com-looprig-tui
  source-and-runnable-proof: release-github-com-looprig-tui
---

# `github.com/looprig/tui/restore`

Restore decision adapter in [tui v0.15.1](https://github.com/looprig/tui/tree/6b362dda04b086c8a94146320e9faad38dac9b6c/restore).

## Package role {#package-role}

Package restore provides a reusable, interactive session.RestoreDecider that an application embedding tui wires into its harness Rig via rig.WithRestoreDecider.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewTerminalUI() UI`
- `func NewDecider(ui UI) Decider`

### Methods {#methods}

- `func (d Decider) DecideRestore(ctx context.Context, a event.DriftAssessment) (session.RestoreDecision, error)`

### Types {#types}

```go
type UI interface {
	// ConfirmDrift renders the warn changes and blocks for a user answer, honoring
	// ctx (a cancelled/expired ctx must return promptly). note is an optional
	// user-authored message recorded on the resulting adoption.
	ConfirmDrift(ctx context.Context, warns []event.DriftChange) (accept bool, note string, err error)
	// Notify surfaces accepted informational drift without blocking.
	Notify(infos []event.DriftChange)
}
```

```go
type Decider struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

No exported named type with an explicit `Error() string` method was found in the pinned source package. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [restore/confirm.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/confirm.go)
- [restore/decider.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/decider.go)
- [restore/driftview.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/driftview.go)

Adjacent tests at the same commit:

- [restore/confirm_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/confirm_test.go)
- [restore/decider_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/decider_test.go)
- [restore/driftview_test.go](https://github.com/looprig/tui/blob/2d733c1d6880e851ee0c917066913206ad4a6d3d/restore/driftview_test.go)

Run `go test ./...` from a checkout of the `tui` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
