---
id: reference/packages/harness/tool
title: tool package · tool
description: Reference for Harness tool definitions, preparation, requirements, bindings, process resources, and results.
audience: developer
section: reference
order: 155
publication: released
examples:
  - stage-03-pure-tool
  - stage-04-prepared-tool
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

# tool package · tool

Import path: `github.com/looprig/harness/pkg/tool`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Definition` describes immutable metadata and builds session-bound `InvokableTool` values. `CallPreparer` is the preparation boundary: it decodes untrusted arguments, normalizes them, and returns a typed `Request` and optional artifact before gate evaluation. `Requirements` and `Requirement` describe capability needs; `Bindings` supplies only session-scoped capabilities.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewDefinition(name string, requirements Requirements, factory Factory) Definition`
- `func NewBundleDefinition(name string, producedToolNames []string, requirements Requirements, factory Factory) Definition`
- `func NewEvidenceDefinition(name string, requirements Requirements, infos []ToolInfo, factory EvidenceFactory) Definition`
- `func BoundModelFacingErrorDetail(value string) string`
- `func ModelFacingErrorDetail(err error) (detail string, marked bool)`
- `func NewWorkspaceObservations() WorkspaceObservations`
- `func ValidateRequest(request Request) error`
- `func NewWorkspaceAccess(kind WorkspaceAccessKind, writePaths []string, writeTrees []string) WorkspaceAccess`
- `func SchemaDigest(schema json.RawMessage) (string, error)`
- `func NewSessionResourceServices(publisher ProcessLifecyclePublisher, notifier ProcessCompletionNotifier, workflowPublisher WorkflowActivityPublisher) (SessionResourceServices, error)`
- `func TextResult(s string) *ToolResult`

### Methods {#methods}

- `func (i ToolInfo) Clone() ToolInfo`
- `func (e *InvalidRequirementsError) Error() string`
- `func (e *InvalidDefinitionError) Error() string`
- `func (e *InvalidBindingsError) Error() string`
- `func (e *InvalidBindingsError) Unwrap() error`
- `func (e *MissingBindingError) Error() string`
- `func (e *NilBuiltToolError) Error() string`
- `func (e *ProducedToolNamesError) Error() string`
- `func (e *ProducedToolNamesError) Unwrap() error`
- `func (r Request) Clone() Request`
- `func (r Requirement) Clone() Requirement`
- `func (e *RequestValidationError) Error() string`
- `func (m ProcessStreamMode) Valid() bool`
- `func (r ProcessRequest) HasDeadline() bool`
- `func (r ProcessRequest) Clone() ProcessRequest`
- `func (k WorkspaceAccessKind) Valid() bool`
- `func (a WorkspaceAccess) WritePaths() []string`
- `func (a WorkspaceAccess) WriteTrees() []string`
- `func (a WorkspaceAccess) Clone() WorkspaceAccess`
- `func (s ProcessSignal) Valid() bool`
- `func (r ProcessTerminalReason) Valid() bool`
- `func (k ProcessLifecycleKind) Valid() bool`
- `func (s ProcessLifecycleState) Valid() bool`
- `func (e *ProcessLifecycleValidationError) Error() string`
- `func (m ProcessLifecycleMetadata) Validate() error`
- `func (n ProcessCompletionNotification) Validate() error`
- `func (k WorkspaceActivityKind) Valid() bool`
- `func (a ProcessActivity) EffectiveKind() WorkspaceActivityKind`
- `func (c ProcessErrorCode) Valid() bool`
- `func (e *ProcessError) Error() string`
- `func (e *ProcessError) Unwrap() error`
- `func (e *ProcessError) Is(target error) bool`
- `func (e *InvalidSchemaError) Error() string`
- `func (e *InvalidSchemaError) Unwrap() error`
- `func (e *SessionResourceServicesValidationError) Error() string`
- `func (s SessionResourceServices) Validate() error`
- `func (s SessionResourceServices) ProcessLifecyclePublisher() ProcessLifecyclePublisher`
- `func (s SessionResourceServices) ProcessCompletionNotifier() ProcessCompletionNotifier`
- `func (s SessionResourceServices) WorkflowActivityPublisher() WorkflowActivityPublisher`

### Types {#types}

```go
type Requirements uint8
```

```go
type WorkspaceOperation uint8
```

```go
type WorkspacePermit interface {
	Release()
}
```

```go
type WorkspaceCoordinator interface {
	Acquire(ctx context.Context, operation WorkspaceOperation, canonicalPath string) (WorkspacePermit, error)
	Healthy() error
}
```

```go
type WorkspaceLifetimeCoordinator interface {
	AcquireLifetime(ctx context.Context, access WorkspaceAccess) (WorkspacePermit, error)
}
```

```go
type FileObservation struct {
	Observed bool
	Present  bool
	Hash     [32]byte
}
```

```go
type WorkspaceObservations interface {
	WithPath(canonicalPath string, fn func(*FileObservation) error) error
	InvalidateAll()
}
```

```go
type DelegateOperation uint8
```

```go
type AgentState string
```

```go
type DelegateDeliveryStatus string
```

```go
type DelegateResponseStatus uint8
```

```go
type DelegateStatusValue uint8
```

```go
type DelegateRequest struct {
	Operation       DelegateOperation
	AgentID         uuid.UUID
	AgentType       string
	Name            string
	AgentMode       string
	Message         string
	WaitForResponse bool
	TimeoutSeconds  *int
	ParentToolUseID string

	Runtime *DelegateRuntime
}
```

```go
type DelegateAgent struct {
	AgentID        uuid.UUID
	Name           string
	AgentType      string
	State          AgentState
	QueuedMessages int
	Runtime        DelegateRuntime
	AgentMode      string
}
```

```go
type DelegateResult struct {
	AgentID        uuid.UUID
	Name           string
	State          AgentState
	DeliveryStatus DelegateDeliveryStatus
	Response       string
	ResponseStatus DelegateResponseStatus

	CorrelationID uuid.UUID
	PreviousState AgentState
	Agents        []DelegateAgent
	Truncated     bool
}
```

```go
type DelegateController interface {
	Execute(ctx context.Context, request DelegateRequest) (DelegateResult, error)
}
```

```go
type WorkspaceBinding struct {
	Root         string
	Coordinator  WorkspaceCoordinator
	Observations WorkspaceObservations
}
```

```go
type ReadWorkspaceBinding struct {
	Root string
}
```

```go
type Bindings struct {
	SessionID     uuid.UUID
	LoopID        uuid.UUID
	Workspace     *WorkspaceBinding
	ReadWorkspace *ReadWorkspaceBinding
	Delegate      DelegateController
	Process       *ProcessBinding

	ExtraTools []Definition
}
```

```go
type Definition interface {
	Name() string
	ProducedToolNames() []string
	ToolInfos() []ToolInfo
	Requirements() Requirements
	Build(context.Context, Bindings) ([]InvokableTool, error)
	definition()
}
```

```go
type Factory func(context.Context, Bindings) ([]InvokableTool, error)
```

```go
type EvidenceFactoryBindings struct {
	SessionID     uuid.UUID
	LoopID        uuid.UUID
	ReadWorkspace *ReadWorkspaceBinding
}
```

```go
type EvidenceFactory func(context.Context, EvidenceFactoryBindings) ([]InvokableTool, error)
```

```go
type EvidenceKindDeclarer interface {
	EvidenceRequirementKinds() []string
}
```

```go
type InvalidRequirementsError struct{ Unknown Requirements }
```

```go
type InvalidDefinitionError struct{ Field string }
```

```go
type InvalidBindingsError struct {
	Field string
	Cause error
}
```

```go
type MissingBindingError struct{ Requirement Requirements }
```

```go
type NilBuiltToolError struct{ Index int }
```

```go
type ProducedToolNamesErrorKind string
```

```go
type ProducedToolNamesError struct {
	Kind     ProducedToolNamesErrorKind
	Index    int
	Name     string
	Declared []string
	Actual   []string
	Cause    error
}
```

```go
type DelegateRuntime struct {
	Harness       string
	Profile       string
	Source        string
	SelectionKind string
	Model         string
	SmallModel    string
	Effort        string
	Explicit      DelegateRuntimeExplicit
}
```

```go
type DelegateRuntimeExplicit struct {
	Harness bool
	Source  bool
	Model   bool
	Effort  bool
}
```

```go
type DelegateArtifact struct {
	Request DelegateRequest
	Runtime *DelegateRuntime
}
```

```go
type ModelFacingError interface {
	ModelFacingError() string
}
```

```go
type RuleCandidate struct {
	Kind        string `json:"kind"`
	Match       string `json:"match"`
	Description string `json:"description"`
	GrantClass  string `json:"grant_class,omitempty"`
	GrantTarget string `json:"grant_target,omitempty"`
}
```

```go
type Requirement struct {
	Kind        string          `json:"kind"`
	Scope       string          `json:"scope"`
	Match       string          `json:"match"`
	Description string          `json:"description"`
	GrantClass  string          `json:"grant_class,omitempty"`
	GrantTarget string          `json:"grant_target,omitempty"`
	Candidates  []RuleCandidate `json:"candidates,omitempty"`
}
```

```go
type Request struct {
	ToolName           string        `json:"tool_name,omitempty"`
	Summary            string        `json:"summary,omitempty"`
	ExecutionID        string        `json:"execution_id,omitempty"`
	Command            string        `json:"command,omitempty"`
	WorkingDirectory   string        `json:"working_directory,omitempty"`
	ExpiresAtUnixMilli int64         `json:"expires_at_unix_milli,omitempty"`
	Requirements       []Requirement `json:"requirements,omitempty"`
}
```

```go
type RequestValidationErrorKind string
```

```go
type RequestValidationError struct {
	Kind  RequestValidationErrorKind
	Field string
}
```

```go
type AsyncProcessRunner interface {
	PrepareProcess(context.Context, ProcessRequest) (PreparedProcess, error)
}
```

```go
type PreparedProcess interface {
	EffectiveWorkspaceAccess() WorkspaceAccess
	Start(context.Context) (Process, error)
	Close() error
}
```

```go
type Process interface {
	Stdout() io.ReadCloser
	Stderr() io.ReadCloser
	Stdin() io.WriteCloser
	StreamMode() ProcessStreamMode
	Wait(context.Context) (ProcessResult, error)
	Resize(context.Context, uint16, uint16) error
	Signal(context.Context, ProcessSignal) error
	Close(context.Context) error
}
```

```go
type ProcessStreamMode uint8
```

```go
type ProcessActivitySource interface {
	Activities() <-chan ProcessActivity
}
```

```go
type ProcessRequest struct {
	Command           string
	Directory         string
	Grants            []string
	OriginExecutionID uuid.UUID
	Deadline          time.Time
	PTY               bool
}
```

```go
type WorkspaceAccessKind uint8
```

```go
type WorkspaceAccess struct {
	Kind WorkspaceAccessKind
	// contains filtered or unexported fields
}
```

```go
type ProcessSignal uint8
```

```go
type ProcessTerminalReason uint8
```

```go
type ProcessLifecycleKind uint8
```

```go
type ProcessLifecycleState uint8
```

```go
type ProcessLifecycleMetadata struct {
	EventID           uuid.UUID             `json:"event_id,omitzero"`
	Kind              ProcessLifecycleKind  `json:"kind"`
	SessionID         uuid.UUID             `json:"session_id,omitzero"`
	LoopID            uuid.UUID             `json:"loop_id,omitzero"`
	ProcessHandle     string                `json:"process_handle"`
	OriginExecutionID uuid.UUID             `json:"origin_execution_id,omitzero"`
	State             ProcessLifecycleState `json:"state"`
	ProcessCreatedAt  time.Time             `json:"process_created_at"`
	ProcessStartedAt  time.Time             `json:"process_started_at,omitzero"`
	ProcessFinishedAt time.Time             `json:"process_finished_at,omitzero"`
	HasExitCode       bool                  `json:"has_exit_code,omitzero"`
	ExitCode          int32                 `json:"exit_code,omitzero"`
	Reason            ProcessTerminalReason `json:"reason,omitzero"`
	Diagnostic        string                `json:"diagnostic,omitzero"`
}
```

```go
type ProcessCompletionNotification struct {
	CommandID     uuid.UUID             `json:"command_id,omitzero"`
	SessionID     uuid.UUID             `json:"session_id,omitzero"`
	LoopID        uuid.UUID             `json:"loop_id,omitzero"`
	ProcessHandle string                `json:"process_handle"`
	State         ProcessLifecycleState `json:"state"`
	Reason        ProcessTerminalReason `json:"reason"`
}
```

```go
type ProcessLifecycleValidationError struct {
	Field string
}
```

```go
type ProcessResult struct {
	ExitCode   int
	Reason     ProcessTerminalReason
	StartedAt  time.Time
	FinishedAt time.Time
}
```

```go
type WorkspaceActivityKind uint8
```

```go
type ProcessActivity struct {
	Kind WorkspaceActivityKind
}
```

```go
type ProcessErrorCode string
```

```go
type ProcessError struct {
	Code  ProcessErrorCode
	Cause error
}
```

```go
type InvalidSchemaError struct{ Cause error }
```

```go
type SessionResource interface {
	Activate(context.Context, SessionResourceServices) error
	Shutdown(context.Context) error
}
```

```go
type SessionResourceRegistry interface {
	GetOrCreate(context.Context, string, func(string) (SessionResource, error)) (SessionResource, error)
}
```

```go
type ProcessLifecyclePublisher interface {
	PublishProcessLifecycle(context.Context, ProcessLifecycleMetadata) error
}
```

```go
type ProcessCompletionNotifier interface {
	NotifyProcessCompletion(context.Context, ProcessCompletionNotification) error
}
```

```go
type WorkflowActivityPublisher interface {
	PublishWorkflowActivity(context.Context, WorkflowActivityMetadata) error
}
```

```go
type WorkflowActivityMetadata struct {
	EventID           uuid.UUID `json:"event_id,omitzero"`
	SessionID         uuid.UUID `json:"session_id,omitzero"`
	RunID             uuid.UUID `json:"run_id"`
	WorkflowName      string    `json:"workflow_name"`
	WorkflowVersion   string    `json:"workflow_version"`
	Kind              string    `json:"kind"`
	Status            string    `json:"status"`
	VertexID          uuid.UUID `json:"vertex_id,omitzero"`
	VertexLabel       string    `json:"vertex_label,omitempty"`
	CompletedVertices uint32    `json:"completed_vertices,omitzero"`
	TotalVertices     uint32    `json:"total_vertices,omitzero"`
	Message           string    `json:"message,omitempty"`
	OccurredAt        time.Time `json:"occurred_at"`
}
```

```go
type SessionResourceServices struct {
	// contains filtered or unexported fields
}
```

```go
type SessionResourceServicesValidationError struct {
	Field string
}
```

```go
type ProcessBinding struct {
	Registry SessionResourceRegistry
}
```

```go
type SkillArtifact struct {
	Workspace bool
	RelPath   string
	Size      int64
	SHA256    string
	Body      string
}
```

```go
type ToolInfo struct {
	Name   string
	Desc   string
	Schema json.RawMessage
}
```

```go
type BaseTool interface {
	Info(ctx context.Context) (*ToolInfo, error)
}
```

```go
type InvokableTool interface {
	BaseTool
	InvokableRun(ctx context.Context, argsJSON string) (*ToolResult, error)
}
```

```go
type ToolResult struct {
	Content []content.Block
}
```

```go
type Sequential interface {
	Sequential() bool
}
```

```go
type PreparedArtifact interface{ preparedArtifact() }
```

```go
type TokenArtifact struct{ Token string }
```

```go
type CallPreparer interface {
	PrepareCall(ctx context.Context, executionID uuid.UUID, argsJSON string) (Request, PreparedArtifact, error)
}
```

```go
type PreparedCall struct {
	ExecutionID uuid.UUID
	Request     Request
	Artifact    PreparedArtifact
	Grants      []string
}
```

```go
type Auditable interface {
	AuditSummary(argsJSON string) string
}
```

```go
type WriteTarget interface {
	WriteTarget(argsJSON string) (key string, ok bool, err error)
}
```

```go
type EvidenceObservation interface {
	ObservedRequirement(request Request, result *ToolResult) (target string, token string, ok bool)
}
```

```go
type ToolExecuteFunc func(ctx context.Context, argsJSON string) (*ToolResult, error)
```

```go
type ToolMiddleware func(ctx context.Context, t InvokableTool, argsJSON string, next ToolExecuteFunc) (*ToolResult, error)
```

```go
type CommandRunner interface {
	RunCommand(ctx context.Context, dir, command string) (output []byte, exitCode int, err error)
}
```

```go
type ArgvRunner interface {
	RunArgv(ctx context.Context, dir string, argv []string) (output []byte, exitCode int, err error)
}
```

```go
type GrantedRunner interface {
	RunCommandWithGrants(ctx context.Context, dir, command string, grants []string) (output []byte, exitCode int, err error)
}
```

### Constants {#constants}

`RequiresWorkspace`, `RequiresDelegateController`, `RequiresWorkspaceRead`, `RequiresProcessServices`, `WorkspaceOperationPathMutation`, `WorkspaceOperationWholeMutation`, `WorkspaceOperationCheckpoint`, `DelegateStart`, `DelegateSend`, `DelegateInterrupt`, `DelegateStatus`, `AgentStateStarting`, `AgentStateWorking`, `AgentStateIdle`, `AgentStateUnavailable`, `DelegateDeliveryAcceptedPending`, `DelegateDeliveryInjected`, `DelegateDeliveryQueued`, `DelegateDeliveryRejected`, `DelegateDeliveryUnknown`, `DelegateDeliveryUntrackable`, `DelegateResponseUnknown`, `DelegateResponseCompleted`, `DelegateResponseInterrupted`, `DelegateResponseFailed`, `DelegateResponseTimedOut`, `DelegateStatusUnknown`, `DelegateStatusRunning`, `DelegateStatusCompleted`, `DelegateStatusInterrupted`, `DelegateStatusFailed`, `DelegateStatusTimedOut`, `DelegateStatusQueued`, `DelegateStatusIdle`, `ProducedToolNameEmpty`, `ProducedToolNameDuplicate`, `BuiltToolInfoInvalid`, `BuiltToolNameEmpty`, `BuiltToolNameDuplicate`, `ProducedToolNamesMismatch`, `MaxModelFacingErrorBytes`, `CapabilityCommandExecute`, `GrantClassCommandStart`, `RequestFieldInvalid`, `RequestRequirementsDuplicate`, `RequestCandidatesDuplicate`, `RequestGrantPairInvalid`, `RequestCommandGrantInvalid`, `RequestGrantBindingMissing`, `ProcessStreamModePipes`, `ProcessStreamModePTY`, `WorkspaceAccessReadOnly`, `WorkspaceAccessScopedWrite`, `WorkspaceAccessBroadWrite`, `ProcessSignalInterrupt`, `ProcessSignalTerminate`, `ProcessSignalKill`, `ProcessTerminalExited`, `ProcessTerminalTimedOut`, `ProcessTerminalInterrupted`, `ProcessTerminalTerminated`, `ProcessTerminalKilled`, `ProcessTerminalRunnerShutdown`, `ProcessTerminalFailed`, `ProcessTerminalOutputLimit`, `ProcessTerminalLostOnRestore`, `MaxProcessHandleBytes`, `MaxProcessDiagnosticBytes`, `ProcessLifecycleStarted`, `ProcessLifecycleBackgrounded`, `ProcessLifecycleCompleted`, `ProcessLifecycleStopRequested`, `ProcessLifecycleLost`, `ProcessLifecycleStarting`, `ProcessLifecycleRunning`, `ProcessLifecycleExited`, `ProcessLifecycleFailed`, `ProcessLifecycleTimedOut`, `ProcessLifecycleInterrupted`, `ProcessLifecycleTerminated`, `ProcessLifecycleKilled`, `ProcessLifecycleLostOnRestore`, `WorkspaceActivityWrite`, `WorkspaceActivityBroadWrite`, `ProcessErrorLifetimeEnforcementUnavailable`, `ProcessErrorSpawnFailed`, `ProcessErrorSetupFailed`, `ProcessErrorPTYUnavailable`, `ProcessErrorSignalFailed`, `ProcessErrorWaitFailed`, `ProcessErrorTeardownFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `InvalidBindingsError`, `InvalidDefinitionError`, `InvalidRequirementsError`, `InvalidSchemaError`, `MissingBindingError`, `NilBuiltToolError`, `ProcessError`, `ProcessLifecycleValidationError`, `ProducedToolNamesError`, `RequestValidationError`, `SessionResourceServicesValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/tool/definition.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/definition.go)
- [pkg/tool/delegate_artifact.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/delegate_artifact.go)
- [pkg/tool/model_facing_error.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/model_facing_error.go)
- [pkg/tool/observations.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/observations.go)
- [pkg/tool/preparation.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/preparation.go)
- [pkg/tool/process.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/process.go)
- [pkg/tool/schema_digest.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/schema_digest.go)
- [pkg/tool/session_resource.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/session_resource.go)
- [pkg/tool/skill_artifact.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/skill_artifact.go)
- [pkg/tool/tool.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/tool.go)

Adjacent tests at the same commit:

- [pkg/tool/capability_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/capability_test.go)
- [pkg/tool/definition_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/definition_test.go)
- [pkg/tool/delegate_artifact_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/delegate_artifact_test.go)
- [pkg/tool/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/deps_test.go)
- [pkg/tool/model_facing_error_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/model_facing_error_test.go)
- [pkg/tool/preparation_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/preparation_test.go)
- [pkg/tool/process_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/process_test.go)
- [pkg/tool/schema_digest_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/schema_digest_test.go)
- [pkg/tool/session_resource_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/session_resource_test.go)
- [pkg/tool/tool_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/tool/tool_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
