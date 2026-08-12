---
id: reference/packages/foreignloops/backend
title: backend package · backend
description: Reference for Harness foreign-loop backend construction and restoration.
audience: developer
section: reference
order: 200
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-foreignloops
  exported-surface: release-github-com-looprig-foreignloops
  functions: release-github-com-looprig-foreignloops
  methods: release-github-com-looprig-foreignloops
  types: release-github-com-looprig-foreignloops
  constants: release-github-com-looprig-foreignloops
  variables: release-github-com-looprig-foreignloops
  ownership-and-errors: release-github-com-looprig-foreignloops
  source-and-runnable-proof: release-github-com-looprig-foreignloops
---

# backend package · backend

Import path: `github.com/looprig/foreignloops/backend`. The source is pinned to github.com/looprig/foreignloops@v0.2.3.

## Package role {#package-role}

Package backend implements the concrete Harness foreign-loop backend.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func BuildWith(backendCfg Config) foreign.Builder`
- `func BuildWithServices(backendCfg Config) foreign.ServicesBuilder`
- `func New(loopCtx context.Context, sessionID, loopID uuid.UUID, parent loop.Provenance, pub foreign.EventPublisher, loopCfg loop.BoundDefinition, backendCfg Config, idGen func() (uuid.UUID, error), fac *event.Factory) (*Loop, string, error)`
- `func BuildRestoredWith(backendCfg Config) foreign.RestoredBuilder`
- `func BuildRestoredWithServices(backendCfg Config) foreign.ServicesRestoredBuilder`

### Methods {#methods}

- `func (e *ConfigError) Error() string`
- `func (e *ForeignSessionBusyError) Error() string`
- `func (e *LockError) Error() string`
- `func (e *LockError) Unwrap() error`
- `func (e *ForeignResultError) Error() string`
- `func (e *ForeignProtocolError) Error() string`
- `func (e *ForeignPublicationError) Error() string`
- `func (e *ForeignPublicationError) Unwrap() error`
- `func (e *SnapshotError) Error() string`
- `func (e *SnapshotError) Unwrap() error`
- `func (l *Loop) CommandSink() chan<- command.Command`
- `func (l *Loop) DoneChan() <-chan struct{}`
- `func (l *Loop) Snapshot(ctx context.Context) (content.AgenticMessages, event.TurnIndex, error)`

### Types {#types}

```go
type SIDMode uint8
```

```go
type Config struct {
	Agent   driver.Agent
	Cwd     string
	Posture driver.PermissionPosture
	SIDMode SIDMode
}
```

```go
type ConfigError struct{ Field, Reason string }
```

```go
type ForeignSessionBusyError struct {
	SID, Cwd string
	PID      int
}
```

```go
type LockError struct {
	Op    string
	Path  string
	Cause error
}
```

```go
type ForeignResultError struct{ Detail string }
```

```go
type ForeignProtocolError struct{ Reason string }
```

```go
type ForeignPublicationError struct {
	Event string
	Cause error
}
```

```go
type SnapshotErrorReason string
```

```go
type SnapshotError struct {
	Reason SnapshotErrorReason
	Cause  error
}
```

```go
type Loop struct {
	Commands chan command.Command
	Done     chan struct{}
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`SIDPrebound`, `SIDLateBound`, `SnapshotLoopExited`, `SnapshotContextDone`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConfigError`, `ForeignProtocolError`, `ForeignPublicationError`, `ForeignResultError`, `ForeignSessionBusyError`, `LockError`, `SnapshotError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [backend/builder.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/builder.go)
- [backend/config.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/config.go)
- [backend/errors.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/errors.go)
- [backend/header.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/header.go)
- [backend/lock.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/lock.go)
- [backend/lock_unix.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/lock_unix.go)
- [backend/lock_unsupported.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/lock_unsupported.go)
- [backend/loop.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/loop.go)
- [backend/mapper.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/mapper.go)
- [backend/restored.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/restored.go)
- [backend/snapshot.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/snapshot.go)
- [backend/steering.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/steering.go)
- [backend/turn.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/turn.go)

Adjacent tests at the same commit:

- [backend/builder_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/builder_test.go)
- [backend/close_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/close_test.go)
- [backend/config_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/config_test.go)
- [backend/deps_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/deps_test.go)
- [backend/errors_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/errors_test.go)
- [backend/example_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/example_test.go)
- [backend/fake_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/fake_test.go)
- [backend/lock_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/lock_test.go)
- [backend/loop_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/loop_test.go)
- [backend/mapper_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/mapper_test.go)
- [backend/parity_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/parity_test.go)
- [backend/quality_findings_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/quality_findings_test.go)
- [backend/restore_seed_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/restore_seed_test.go)
- [backend/restored_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/restored_test.go)
- [backend/steering_deadline_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/steering_deadline_test.go)
- [backend/steering_integration_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/steering_integration_test.go)
- [backend/steering_machine_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/steering_machine_test.go)
- [backend/steering_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/steering_test.go)
- [backend/turn_test.go](https://github.com/looprig/foreignloops/blob/b46a9c576f8cbc064957c188c76da4c4e83e57f4/backend/turn_test.go)

Run `go test ./...` from a checkout of the `foreignloops` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
