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
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
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
- `func NewWorkspaceAccess( kind WorkspaceAccessKind, writePaths []string, writeTrees []string,) WorkspaceAccess`
- `func SchemaDigest(schema json.RawMessage) (string, error)`
- `func NewSessionResourceServices( publisher ProcessLifecyclePublisher, notifier ProcessCompletionNotifier, workflowPublisher WorkflowActivityPublisher,) (SessionResourceServices, error)`
- `func TextResult(s string) *ToolResult`

### Methods {#methods}

- `func (i ToolInfo) Clone() ToolInfo`
- `func (d *factoryDefinition) Name() string`
- `func (d *factoryDefinition) ProducedToolNames() []string`
- `func (d *factoryDefinition) ToolInfos() []ToolInfo`
- `func (d *factoryDefinition) Requirements() Requirements`
- `func (d *factoryDefinition) Build(ctx context.Context, bindings Bindings) ([]InvokableTool, error)`
- `func (e *InvalidRequirementsError) Error() string`
- `func (e *InvalidDefinitionError) Error() string`
- `func (e *InvalidBindingsError) Error() string`
- `func (e *InvalidBindingsError) Unwrap() error`
- `func (e *MissingBindingError) Error() string`
- `func (e *NilBuiltToolError) Error() string`
- `func (e *ProducedToolNamesError) Error() string`
- `func (e *ProducedToolNamesError) Unwrap() error`
- `func (o *workspaceObservations) WithPath(path string, fn func(*FileObservation) error) error`
- `func (o *workspaceObservations) InvalidateAll()`
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

`Requirements`, `WorkspaceOperation`, `WorkspacePermit`, `WorkspaceCoordinator`, `WorkspaceLifetimeCoordinator`, `FileObservation`, `WorkspaceObservations`, `DelegateOperation`, `AgentState`, `DelegateDeliveryStatus`, `DelegateResponseStatus`, `DelegateStatusValue`, `DelegateRequest`, `DelegateAgent`, `DelegateResult`, `DelegateController`, `WorkspaceBinding`, `ReadWorkspaceBinding`, `Bindings`, `Definition`, `Factory`, `EvidenceFactoryBindings`, `EvidenceFactory`, `EvidenceKindDeclarer`, `InvalidRequirementsError`, `InvalidDefinitionError`, `InvalidBindingsError`, `MissingBindingError`, `NilBuiltToolError`, `ProducedToolNamesErrorKind`, `ProducedToolNamesError`, `DelegateRuntime`, `DelegateRuntimeExplicit`, `DelegateArtifact`, `ModelFacingError`, `RuleCandidate`, `Requirement`, `Request`, `RequestValidationErrorKind`, `RequestValidationError`, `AsyncProcessRunner`, `PreparedProcess`, `Process`, `ProcessStreamMode`, `ProcessActivitySource`, `ProcessRequest`, `WorkspaceAccessKind`, `WorkspaceAccess`, `ProcessSignal`, `ProcessTerminalReason`, `ProcessLifecycleKind`, `ProcessLifecycleState`, `ProcessLifecycleMetadata`, `ProcessCompletionNotification`, `ProcessLifecycleValidationError`, `ProcessResult`, `WorkspaceActivityKind`, `ProcessActivity`, `ProcessErrorCode`, `ProcessError`, `InvalidSchemaError`, `SessionResource`, `SessionResourceRegistry`, `ProcessLifecyclePublisher`, `ProcessCompletionNotifier`, `WorkflowActivityPublisher`, `WorkflowActivityMetadata`, `SessionResourceServices`, `SessionResourceServicesValidationError`, `ProcessBinding`, `SkillArtifact`, `ToolInfo`, `BaseTool`, `InvokableTool`, `ToolResult`, `Sequential`, `PreparedArtifact`, `TokenArtifact`, `CallPreparer`, `PreparedCall`, `Auditable`, `WriteTarget`, `EvidenceObservation`, `ToolExecuteFunc`, `ToolMiddleware`, `CommandRunner`, `ArgvRunner`, `GrantedRunner`

### Constants {#constants}

`RequiresWorkspace`, `RequiresDelegateController`, `RequiresWorkspaceRead`, `RequiresProcessServices`, `WorkspaceOperationPathMutation`, `WorkspaceOperationWholeMutation`, `WorkspaceOperationCheckpoint`, `DelegateStart`, `DelegateSend`, `DelegateInterrupt`, `DelegateStatus`, `AgentStateStarting`, `AgentStateWorking`, `AgentStateIdle`, `AgentStateUnavailable`, `DelegateDeliveryAcceptedPending`, `DelegateDeliveryInjected`, `DelegateDeliveryQueued`, `DelegateDeliveryRejected`, `DelegateDeliveryUnknown`, `DelegateDeliveryUntrackable`, `DelegateResponseUnknown`, `DelegateResponseCompleted`, `DelegateResponseInterrupted`, `DelegateResponseFailed`, `DelegateResponseTimedOut`, `DelegateStatusUnknown`, `DelegateStatusRunning`, `DelegateStatusCompleted`, `DelegateStatusInterrupted`, `DelegateStatusFailed`, `DelegateStatusTimedOut`, `DelegateStatusQueued`, `DelegateStatusIdle`, `ProducedToolNameEmpty`, `ProducedToolNameDuplicate`, `BuiltToolInfoInvalid`, `BuiltToolNameEmpty`, `BuiltToolNameDuplicate`, `ProducedToolNamesMismatch`, `MaxModelFacingErrorBytes`, `CapabilityCommandExecute`, `GrantClassCommandStart`, `RequestFieldInvalid`, `RequestRequirementsDuplicate`, `RequestCandidatesDuplicate`, `RequestGrantPairInvalid`, `RequestCommandGrantInvalid`, `RequestGrantBindingMissing`, `ProcessStreamModePipes`, `ProcessStreamModePTY`, `WorkspaceAccessReadOnly`, `WorkspaceAccessScopedWrite`, `WorkspaceAccessBroadWrite`, `ProcessSignalInterrupt`, `ProcessSignalTerminate`, `ProcessSignalKill`, `ProcessTerminalExited`, `ProcessTerminalTimedOut`, `ProcessTerminalInterrupted`, `ProcessTerminalTerminated`, `ProcessTerminalKilled`, `ProcessTerminalRunnerShutdown`, `ProcessTerminalFailed`, `ProcessTerminalOutputLimit`, `ProcessTerminalLostOnRestore`, `MaxProcessHandleBytes`, `MaxProcessDiagnosticBytes`, `ProcessLifecycleStarted`, `ProcessLifecycleBackgrounded`, `ProcessLifecycleCompleted`, `ProcessLifecycleStopRequested`, `ProcessLifecycleLost`, `ProcessLifecycleStarting`, `ProcessLifecycleRunning`, `ProcessLifecycleExited`, `ProcessLifecycleFailed`, `ProcessLifecycleTimedOut`, `ProcessLifecycleInterrupted`, `ProcessLifecycleTerminated`, `ProcessLifecycleKilled`, `ProcessLifecycleLostOnRestore`, `WorkspaceActivityWrite`, `WorkspaceActivityBroadWrite`, `ProcessErrorLifetimeEnforcementUnavailable`, `ProcessErrorSpawnFailed`, `ProcessErrorSetupFailed`, `ProcessErrorPTYUnavailable`, `ProcessErrorSignalFailed`, `ProcessErrorWaitFailed`, `ProcessErrorTeardownFailed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `InvalidRequirementsError`, `InvalidDefinitionError`, `InvalidBindingsError`, `MissingBindingError`, `NilBuiltToolError`, `ProducedToolNamesError`, `RequestValidationError`, `ProcessLifecycleValidationError`, `ProcessError`, `InvalidSchemaError`, `SessionResourceServicesValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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
