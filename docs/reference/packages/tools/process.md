---
id: reference/packages/tools/process
title: process package · process
description: Reference for supervised process resources, output spools, lifecycle, and restore.
audience: developer
section: reference
order: 168
publication: released
examples:
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions: release-github-com-looprig-tools
  methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants: release-github-com-looprig-tools
  variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# process package · process

Import path: `github.com/looprig/tools/process`. The source is pinned to github.com/looprig/tools@v0.10.0.

## Package role {#package-role}

`NewSupervisor` manages process admission, signals, output spools, manifests, lifecycle notifications, and restore. `NewProcessInput`, `NewProcessOutput`, and `NewProcessStop` expose model-facing operations over the same supervisor resource.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewBuffer(capacity int64) *Buffer`
- `func New(code Code) *Error`
- `func Wrap(code Code, cause error) *Error`
- `func NewHandle(exists HandleExists) (Handle, error)`
- `func NewProcessInput(supervisor *Supervisor, owner Owner) *ProcessInputTool`
- `func NewManifest(id Identity, cmd CommandMetadata, access AccessMode, tty bool, createdAt time.Time, deadline *time.Time) Manifest`
- `func NewManifestStore(root string) *ManifestStore`
- `func NewProcessOutput(supervisor *Supervisor, owner Owner) *ProcessOutputTool`
- `func NewArtifact(handle Handle, startCursor, endCursor int64) Artifact`
- `func RenderSafeText(r Reader, handle Handle, cursor int64, maxBytes int, capBytes int64) (SafeTextResult, error)`
- `func RenderBase64(r Reader, cursor int64, maxBytes int) (Base64Result, error)`
- `func NewSupervisorResource(dir string) (tool.SessionResource, error)`
- `func OpenSpool(root string, h Handle, ceiling int64) (*Spool, error)`
- `func NewProcessStop(supervisor *Supervisor, owner Owner) *ProcessStopTool`
- `func NewSupervisor(cfg Config, manifests *ManifestStore, spoolRoot string, lifecycle lifecycleSink, notifications completionNotifier) (*Supervisor, error)`

### Methods {#methods}

- `func (b *Buffer) Append(chunk []byte) (int64, error)`
- `func (b *Buffer) Read(cursor int64, maxBytes int) (data []byte, nextCursor int64, gap bool, err error)`
- `func (b *Buffer) TotalBytes() int64`
- `func (b *Buffer) RetainedFrom() int64`
- `func (b *Buffer) Capacity() int64`
- `func (c Config) Validate() error`
- `func (c Config) Normalize() (Config, error)`
- `func (c Code) Valid() bool`
- `func (e *Error) Error() string`
- `func (e *Error) Unwrap() error`
- `func (e *Error) Is(target error) bool`
- `func (o Owner) Equal(other Owner) bool`
- `func (o Owner) IsZero() bool`
- `func (h Handle) Valid() bool`
- `func (e *GenerateError) Error() string`
- `func (e *GenerateError) Unwrap() error`
- `func (e *CollisionError) Error() string`
- `func (t *ProcessInputTool) Info(context.Context) (*tool.ToolInfo, error)`
- `func (t *ProcessInputTool) PrepareCall(_ context.Context, _ uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *ProcessInputTool) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (a AccessMode) Valid() bool`
- `func (r Result) Equal(other Result) bool`
- `func (m Manifest) Validate() error`
- `func (e *TerminalResultChangedError) Error() string`
- `func (e *LifecycleEventIDChangedError) Error() string`
- `func (e *NonMonotonicUpdateError) Error() string`
- `func (e *ImmutableIdentityChangedError) Error() string`
- `func (s *ManifestStore) Load(h Handle) (Manifest, error)`
- `func (s *ManifestStore) Save(m Manifest) error`
- `func (s *ManifestStore) Delete(h Handle) error`
- `func (t *ProcessOutputTool) Info(context.Context) (*tool.ToolInfo, error)`
- `func (t *ProcessOutputTool) PrepareCall(_ context.Context, _ uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *ProcessOutputTool) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (e *RestoreError) Error() string`
- `func (e *RestoreError) Unwrap() error`
- `func (s *Supervisor) Restore(ctx context.Context) (RestoreReport, error)`
- `func (r *SupervisorResource) Activate(ctx context.Context, services tool.SessionResourceServices) error`
- `func (r *SupervisorResource) Shutdown(ctx context.Context) error`
- `func (s *Spool) Append(data []byte) (int64, error)`
- `func (s *Spool) Read(cursor int64, maxBytes int) (data []byte, nextCursor int64, gap bool, err error)`
- `func (s *Spool) TotalBytes() int64`
- `func (s *Spool) RetainedFrom() int64`
- `func (s *Spool) Close() error`
- `func (s *Spool) Remove() error`
- `func (s State) Valid() bool`
- `func (s State) Terminal() bool`
- `func (e *TransitionError) Error() string`
- `func (t *ProcessStopTool) Info(context.Context) (*tool.ToolInfo, error)`
- `func (t *ProcessStopTool) PrepareCall(_ context.Context, _ uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error)`
- `func (t *ProcessStopTool) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error)`
- `func (s *Supervisor) Shutdown(ctx context.Context) error`
- `func (s *Supervisor) Start(ctx context.Context, owner Owner, origin Origin, prepared tool.PreparedProcess, lease Lease, sink lifecycleSink, observations observationInvalidator, ceiling StorageCeiling, yield YieldSettings) (Handle, error)`
- `func (k WaitKind) Valid() bool`
- `func (s *Supervisor) Wait(ctx context.Context, owner Owner, kind WaitKind, targets []WaitTarget) ([]WaitStatus, error)`

### Types {#types}

```go
type Buffer struct {
	// contains filtered or unexported fields
}
```

```go
type Config struct {
	MaxRunningProcessesPerLoop int

	MaxRunningProcessesPerSession int

	MaxRetainedCompletedProcessesPerSession int

	MaxProcessInMemoryBytes int64

	MaxAggregateInMemoryBytes int64

	MaxProcessSpoolBytes int64

	MaxAggregateSpoolBytes int64

	MaxInlineResultBytes int64

	MaxPendingWaiters int

	MaxPendingInputBytes int64

	GracefulShutdownPeriod time.Duration
}
```

```go
type Code string
```

```go
type Error struct {
	Code  Code
	Cause error
}
```

```go
type Owner struct {
	SessionID uuid.UUID
	LoopID    uuid.UUID
}
```

```go
type Origin struct {
	ToolExecutionID uuid.UUID
}
```

```go
type Handle string
```

```go
type HandleExists func(Handle) bool
```

```go
type GenerateError struct{ Err error }
```

```go
type CollisionError struct{ Attempts int }
```

```go
type ProcessInputTool struct {
	// contains filtered or unexported fields
}
```

```go
type AccessMode string
```

```go
type CommandMetadata struct {
	Command string

	WorkDir string
}
```

```go
type SpoolCursors struct {
	TotalBytes int64

	RetainedFrom int64
}
```

```go
type Result struct {
	ExitCode *int

	Reason string
}
```

```go
type LifecycleEventIDs struct {
	Started      uuid.UUID
	Backgrounded uuid.UUID
	Completed    uuid.UUID
	Lost         uuid.UUID
	CommandID    uuid.UUID
}
```

```go
type Manifest struct {
	Identity

	Command CommandMetadata
	Access  AccessMode
	TTY     bool

	State State

	CreatedAt  time.Time
	StartedAt  *time.Time
	FinishedAt *time.Time
	Deadline   *time.Time

	Cursors SpoolCursors
	Result  Result

	Events LifecycleEventIDs

	CompletionPublished int64
	// contains filtered or unexported fields
}
```

```go
type TerminalResultChangedError struct {
	Handle Handle
	State  State
	Had    Result
	Got    Result
}
```

```go
type LifecycleEventIDChangedError struct {
	Handle Handle
	Field  string
	Had    uuid.UUID
	Got    uuid.UUID
}
```

```go
type NonMonotonicUpdateError struct {
	Handle Handle
	Field  string
	Had    int64
	Got    int64
}
```

```go
type ImmutableIdentityChangedError struct {
	Handle Handle
}
```

```go
type ManifestStore struct {
	// contains filtered or unexported fields
}
```

```go
type ProcessOutputTool struct {
	// contains filtered or unexported fields
}
```

```go
type Reader interface {
	Read(cursor int64, maxBytes int) (data []byte, nextCursor int64, gap bool, err error)
}
```

```go
type Artifact struct {
	ProcessID   Handle
	StartCursor int64
	EndCursor   int64
	Encoding    string
}
```

```go
type SafeTextResult struct {
	Output string

	StartCursor int64

	NextCursor int64

	Gap bool

	Normalized bool

	Binary bool

	Artifact Artifact
}
```

```go
type Base64Result struct {
	Data string

	StartCursor int64

	NextCursor int64

	Gap bool
}
```

```go
type RestoreError struct {
	Handle Handle
	Err    error
}
```

```go
type RestoreReport struct {
	Reconciled []Handle
	Errors     []RestoreError
}
```

```go
type SupervisorResource struct {
	Supervisor *Supervisor
	Manifests  *ManifestStore
}
```

```go
type Spool struct {
	// contains filtered or unexported fields
}
```

```go
type State string
```

```go
type TransitionError struct {
	From State
	To   State
}
```

```go
type ProcessStopTool struct {
	// contains filtered or unexported fields
}
```

```go
type Lease interface {
	Release() error
}
```

```go
type StorageCeiling struct {
	InMemoryBytes int64
	SpoolBytes    int64
}
```

```go
type YieldSettings struct {
	Yield bool
}
```

```go
type Supervisor struct {
	// contains filtered or unexported fields
}
```

```go
type Identity struct {
	Handle Handle
	Owner  Owner
	Origin Origin
}
```

```go
type WaitKind string
```

```go
type WaitTarget struct {
	Handle     Handle
	Generation uint64
}
```

```go
type WaitStatus struct {
	Handle Handle

	Generation uint64

	Terminal bool

	Found bool
}
```

### Constants {#constants}

`DefaultMaxRunningProcessesPerLoop`, `DefaultMaxRunningProcessesPerSession`, `DefaultMaxRetainedCompletedProcessesPerSession`, `DefaultMaxProcessInMemoryBytes`, `DefaultMaxAggregateInMemoryBytes`, `DefaultMaxProcessSpoolBytes`, `DefaultMaxAggregateSpoolBytes`, `DefaultMaxInlineResultBytes`, `DefaultMaxPendingWaiters`, `DefaultMaxPendingInputBytes`, `DefaultGracefulShutdownPeriod`, `CodeInvalidArguments`, `CodeInvalidSettings`, `CodeProcessQuotaExceeded`, `CodeOutputQuotaExceeded`, `CodeLifetimeEnforcementUnavailable`, `CodeProcessNotificationsUnsupported`, `CodeSpawnFailed`, `CodeProcessSetupFailed`, `CodePTYUnavailable`, `CodeNotFound`, `CodeStdinClosed`, `CodeInputBackpressure`, `CodeCursorGap`, `CodeCursorAhead`, `CodeTimedOut`, `CodeInterrupted`, `CodeTerminated`, `CodeKilled`, `CodeSupervisorShuttingDown`, `CodeManifestCorrupt`, `CodeSpoolCorrupt`, `CodeLostOnRestore`, `CodeTeardownFailed`, `HandleEntropyBytes`, `AccessReadOnly`, `AccessScopedWrite`, `AccessBroadWrite`, `ArtifactEncodingBase64`, `SupervisorResourceKey`, `StateStarting`, `StateRunning`, `StateExited`, `StateFailed`, `StateTimedOut`, `StateInterrupted`, `StateTerminated`, `StateKilled`, `StateLostOnRestore`, `WaitPoll`, `WaitAny`, `WaitAll`

### Variables {#variables}

`ErrSpoolClosed`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `CollisionError`, `Error`, `GenerateError`, `ImmutableIdentityChangedError`, `LifecycleEventIDChangedError`, `NonMonotonicUpdateError`, `RestoreError`, `TerminalResultChangedError`, `TransitionError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [process/buffer.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/buffer.go)
- [process/config.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/config.go)
- [process/entry.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/entry.go)
- [process/errors.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/errors.go)
- [process/identity.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/identity.go)
- [process/input_tool.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/input_tool.go)
- [process/lifecycle_bridge.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/lifecycle_bridge.go)
- [process/manifest.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/manifest.go)
- [process/output_tool.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/output_tool.go)
- [process/render.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/render.go)
- [process/restore.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/restore.go)
- [process/session_resource.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/session_resource.go)
- [process/spool.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/spool.go)
- [process/state.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/state.go)
- [process/stop_tool.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/stop_tool.go)
- [process/supervisor.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/supervisor.go)
- [process/types.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/types.go)
- [process/wait.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/wait.go)

Adjacent tests at the same commit:

- [process/buffer_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/buffer_test.go)
- [process/config_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/config_test.go)
- [process/definitions_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/definitions_test.go)
- [process/entry_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/entry_test.go)
- [process/errors_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/errors_test.go)
- [process/fake_process_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/fake_process_test.go)
- [process/identity_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/identity_test.go)
- [process/input_tool_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/input_tool_test.go)
- [process/integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/integration_test.go)
- [process/manifest_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/manifest_test.go)
- [process/output_tool_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/output_tool_test.go)
- [process/pty_integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/pty_integration_test.go)
- [process/render_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/render_test.go)
- [process/restore_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/restore_test.go)
- [process/session_resource_activate_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/session_resource_activate_test.go)
- [process/shutdown_restore_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/shutdown_restore_test.go)
- [process/shutdown_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/shutdown_test.go)
- [process/spool_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/spool_test.go)
- [process/state_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/state_test.go)
- [process/stop_tool_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/stop_tool_test.go)
- [process/supervisor_integration_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/supervisor_integration_test.go)
- [process/supervisor_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/supervisor_test.go)
- [process/wait_test.go](https://github.com/looprig/tools/blob/151f5530f95a9bba95be10551a8f08282d8959ab/process/wait_test.go)

Run `GOWORK=off go test ./...` from the `tools` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
