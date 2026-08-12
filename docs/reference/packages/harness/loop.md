---
id: reference/packages/harness/loop
title: loop package · loop
description: Reference for immutable loop definitions, runtime catalogs, tool bindings, provenance, and live control.
audience: developer
section: reference
order: 149
publication: released
examples:
  - stage-05-loop
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

# loop package · loop

Import path: `github.com/looprig/harness/pkg/loop`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Definition` is built with `Define` and options for name, model, modes, tools, delegates, compaction, context transport, and limits. `BoundDefinition` carries session bindings without changing the source definition. `Controller`, `Handle`, and `Backend` are runtime seams.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func SelectBoundMode(bound BoundDefinition, mode ModeName) (BoundDefinition, error)`
- `func OverrideBoundAccess(bound BoundDefinition, access AccessGate) (BoundDefinition, error)`
- `func OverrideBoundRuntime(bound BoundDefinition, profile RuntimeProfileName, target model.Model, effort model.Effort) (BoundDefinition, error)`
- `func OverrideBoundRuntimeSelection(bound BoundDefinition, profile RuntimeProfileName, alias ModelAlias, target model.Model, effort model.Effort) (BoundDefinition, error)`
- `func OverrideBoundRuntimeSelectionWithIdentity(bound BoundDefinition, profile RuntimeProfileName, alias ModelAlias, target model.Model, effort model.Effort, source RuntimeSourceName, selectionKind RuntimeSelectionKind) (BoundDefinition, error)`
- `func OverrideBoundRuntimeManaged(bound BoundDefinition, profile RuntimeProfileName) (BoundDefinition, error)`
- `func OverrideBoundRuntimeCatalog(bound BoundDefinition, catalog RuntimeCatalog) (BoundDefinition, error)`
- `func RequestFingerprint(input RequestFingerprintInput) ([32]byte, error)`
- `func ResolveContextLimits(model model.ModelKey, limits model.ContextLimits, reservedOutput, safetyMargin content.TokenCount) (ResolvedContextLimits, error)`
- `func OccupancyBasisPoints(used, limit content.TokenCount) (event.BasisPoints, error)`
- `func ChangeModel(model model.Model) Change`
- `func ChangeEffort(effort model.Effort) Change`
- `func Define(opts ...Option) (Definition, error)`
- `func EffectiveSystem(system, instructions string) string`
- `func WithName(name identity.AgentName) Option`
- `func WithInference(client inference.Client, model model.Model) Option`
- `func WithContextCounter(counter contextcount.ContextCounter) Option`
- `func WithInferenceCapability(capability contextcount.InferenceCapability) Option`
- `func WithContextTransports(transports ...ContextTransport) Option`
- `func WithContextObservation(policy ContextObservationPolicy) Option`
- `func WithCompaction(policy CompactionPolicy) Option`
- `func WithDisplayName(name string) Option`
- `func WithDescription(desc string) Option`
- `func WithSystem(system string) Option`
- `func WithOutputSchema(output inference.OutputSchema) Option`
- `func WithTools(defs ...tool.Definition) Option`
- `func WithAccessGate(access AccessGate) Option`
- `func WithToolMiddlewares(middlewares ...tool.ToolMiddleware) Option`
- `func WithToolLimits(limits ToolLimits) Option`
- `func WithEngine(engine Engine) Option`
- `func WithDrainTimeout(timeout time.Duration) Option`
- `func WithRuntimeContext(provider RuntimeContextProvider) Option`
- `func WithPolicyRevision(revision string) Option`
- `func WithDelegates(names ...identity.AgentName) Option`
- `func WithDelegation(policy Delegation) Option`
- `func WithModes(modes ...Mode) Option`
- `func WithInitialMode(name ModeName) Option`
- `func IsReservedToolName(name string) bool`
- `func WithProvenance(ctx context.Context, p Provenance) context.Context`
- `func ProvenanceFrom(ctx context.Context) (Provenance, bool)`
- `func NewRuntimeCatalog(entries []RuntimeCatalogEntry) (RuntimeCatalog, error)`
- `func WithUserInputRequester(ctx context.Context, requester RequestUserInputFunc) context.Context`
- `func RequestUserInput(ctx context.Context, question string, choices []string) (string, error)`
- `func WithToolUseID(ctx context.Context, id string) context.Context`
- `func ToolUseIDFrom(ctx context.Context) (string, bool)`
- `func WithPreparedCall(ctx context.Context, prepared tool.PreparedCall) context.Context`
- `func PreparedCallFromContext(ctx context.Context) (tool.PreparedCall, bool)`
- `func WithApprovalRequester(ctx context.Context, requester ApprovalRequestFunc) context.Context`
- `func GateApprover() gate.Approver`

### Methods {#methods}

- `func (i RuntimeIdentity) Digest() string`
- `func (v CompactionWireVersion) Valid() bool`
- `func (e *CompactionInputError) Error() string`
- `func (e *CompactionInputError) Unwrap() error`
- `func (i CompactionInput) Validate() error`
- `func (o CompactionOutput) Validate() error`
- `func (r InvalidSummaryReason) Valid() bool`
- `func (e *InvalidSummaryError) Error() string`
- `func (e *InvalidSummaryError) Unwrap() error`
- `func (*SummaryTooLargeError) Error() string`
- `func (e *CompactionPolicyError) Error() string`
- `func (e *CompactionPolicyError) Unwrap() error`
- `func (p CompactionPolicy) Validate(capability contextcount.CounterCapability) error`
- `func (e *RequestFingerprintError) Error() string`
- `func (e *RequestFingerprintError) Unwrap() error`
- `func (e *ContextLimitUnknownError) Error() string`
- `func (e *ContextLimitUnknownError) Unwrap() error`
- `func (e *ContextLimitError) Error() string`
- `func (e *OccupancyError) Error() string`
- `func (e *ContextObservationPolicyError) Error() string`
- `func (p ContextObservationPolicy) Validate(capability contextcount.CounterCapability) error`
- `func (e *ContextTransportNotDeclaredError) Error() string`
- `func (e *ChangeError) Error() string`
- `func (e *ChangeError) Unwrap() error`
- `func (d Definition) Name() identity.AgentName`
- `func (d Definition) Description() string`
- `func (d Definition) Engine() Engine`
- `func (d Definition) Delegates() []identity.AgentName`
- `func (d Definition) Modes() []Mode`
- `func (d Definition) ToolRequirements() tool.Requirements`
- `func (d Definition) InitialMode() ModeName`
- `func (d Definition) FingerprintInitial() InitialFingerprint`
- `func (d Definition) Delegation() Delegation`
- `func (d Definition) PolicyRevision() string`
- `func (d Definition) Bind(ctx context.Context, bindings tool.Bindings) (BoundDefinition, error)`
- `func (d Definition) CompactionPolicy() (CompactionPolicy, bool)`
- `func (d Definition) ContextObservationPolicy() (ContextObservationPolicy, bool)`
- `func (d Definition) ValidateContextModel(model model.Model) error`
- `func (e *DefinitionError) Error() string`
- `func (e *DefinitionError) Unwrap() error`
- `func (e *BindError) Error() string`
- `func (e *BindError) Unwrap() error`
- `func (e *ConfigError) Error() string`
- `func (e *ConfigError) Unwrap() error`
- `func (e *IDGenerationError) Error() string`
- `func (e *IDGenerationError) Unwrap() error`
- `func (e *InputRejectedError) Error() string`
- `func (e *InputRejectedError) Unwrap() error`
- `func (e *PolicyRevisionMarshalError) Error() string`
- `func (e *PolicyRevisionMarshalError) Unwrap() error`
- `func (e *CommitError) Error() string`
- `func (e *CommitError) Unwrap() error`
- `func (e *RuntimeCatalogError) Error() string`
- `func (c RuntimeCatalog) EntriesFor(agent identity.AgentName) []RuntimeCatalogEntry`
- `func (c RuntimeCatalog) HasEntries() bool`
- `func (c RuntimeCatalog) Resolve(agent identity.AgentName, harness AgentHarnessName, alias ModelAlias, effort model.Effort) (Resolved, error)`
- `func (c RuntimeCatalog) ResolveWithExplicitEffort(agent identity.AgentName, harness AgentHarnessName, alias ModelAlias, effort model.Effort, explicitEffort bool) (Resolved, error)`
- `func (c RuntimeCatalog) ResolveWithExplicitSource(agent identity.AgentName, harness AgentHarnessName, source RuntimeSourceName, alias ModelAlias, effort model.Effort, explicitEffort bool) (Resolved, error)`
- `func (c RuntimeCatalog) ResolveTargetAlias(agent identity.AgentName, harness AgentHarnessName, targetAlias ModelAlias, effort model.Effort) (Resolved, error)`
- `func (c RuntimeCatalog) ResolveTargetAliasWithSource(agent identity.AgentName, harness AgentHarnessName, source RuntimeSourceName, targetAlias ModelAlias, effort model.Effort) (Resolved, error)`
- `func (c RuntimeCatalog) Digest() string`
- `func (*UserInputContextError) Error() string`
- `func (*ApprovalContextError) Error() string`

### Types {#types}

```go
type Backend interface {
	CommandSink() chan<- command.Command
	DoneChan() <-chan struct{}
	Snapshot(ctx context.Context) (content.AgenticMessages, event.TurnIndex, error)
}
```

```go
type RuntimeIdentity struct {
	Profile        RuntimeProfileName
	CatalogDigest  string
	Source         RuntimeSourceName
	SelectionKind  RuntimeSelectionKind
	ModelAlias     ModelAlias
	TargetProvider model.ProviderName
	TargetModel    string
	Effort         model.Effort
}
```

```go
type CompactionWireVersion uint8
```

```go
type CompactionInput struct {
	Basis              event.ContextBasis
	Model              model.ModelKey
	RequestFingerprint [32]byte
	Transcript         content.AgenticMessages
	MaxSummaryTokens   content.TokenCount
}
```

```go
type CompactionOutput struct {
	Basis              event.ContextBasis
	Model              model.ModelKey
	RequestFingerprint [32]byte
	Summary            *content.UserMessage
}
```

```go
type CompactionInputField string
```

```go
type CompactionInputError struct {
	Field CompactionInputField
	Cause error
}
```

```go
type InvalidSummaryReason string
```

```go
type InvalidSummaryError struct {
	Reason InvalidSummaryReason
	Cause  error
}
```

```go
type SummaryTooLargeError struct {
	Measurement event.ContextMeasurement
}
```

```go
type CounterPolicy uint8
```

```go
type CompactionPolicy struct {
	Automatic        bool
	CounterPolicy    CounterPolicy
	CompactAt        event.BasisPoints
	RearmBelow       event.BasisPoints
	ReservedOutput   content.TokenCount
	SafetyMargin     content.TokenCount
	MaxSummaryTokens content.TokenCount
	CountTimeout     time.Duration
	Hustle           hustle.Name
}
```

```go
type CompactionPolicyField string
```

```go
type CompactionPolicyError struct {
	Field CompactionPolicyField
	Cause error
}
```

```go
type RequestFingerprintInput struct {
	SystemRevision         string
	ToolPolicyRevision     string
	Model                  model.Model
	Basis                  event.ContextBasis
	RuntimeContextRevision string
	CounterCapability      contextcount.CounterCapability
	InferenceCapability    contextcount.InferenceCapability
}
```

```go
type RequestFingerprintError struct {
	Field string
	Cause error
}
```

```go
type ResolvedContextLimits struct {
	ReservedOutput content.TokenCount
	RawInputLimit  content.TokenCount
	InputLimit     content.TokenCount
}
```

```go
type ContextLimitUnknownError struct {
	Model model.ModelKey
	Cause error
}
```

```go
type ContextLimitError struct {
	Measurement event.ContextMeasurement
}
```

```go
type OccupancyError struct{ Limit content.TokenCount }
```

```go
type ContextObservationPolicy struct {
	ReservedOutput content.TokenCount
	SafetyMargin   content.TokenCount
	CountTimeout   time.Duration
}
```

```go
type ContextObservationPolicyField string
```

```go
type ContextObservationPolicyError struct {
	Field ContextObservationPolicyField
}
```

```go
type ContextTransport struct {
	Provider   model.ProviderName
	APIFormat  model.APIFormat
	BaseURL    string
	Capability contextcount.InferenceCapability
}
```

```go
type ContextTransportNotDeclaredError struct {
	Provider  model.ProviderName
	APIFormat model.APIFormat
	BaseURL   string
}
```

```go
type Handle interface {
	ID() uuid.UUID
	Mode() ModeName
	Model() model.Model
}
```

```go
type ModeCatalog interface {
	Modes() []ModeName
}
```

```go
type Controller interface {
	Handle
	SetMode(context.Context, ModeName) error
	Change(context.Context, ...Change) error

	Interrupt(context.Context) error
}
```

```go
type ExternalToolset struct {
	Source      string
	Generation  string
	Definitions []tool.Definition
}
```

```go
type ExternalToolInstaller interface {
	ReplaceExternalTools(context.Context, ExternalToolset) error
}
```

```go
type Change interface {
	InferenceModel() (model.Model, bool)
	InferenceEffort() (model.Effort, bool)
	change()
}
```

```go
type ChangeErrorKind string
```

```go
type ChangeError struct {
	Kind  ChangeErrorKind
	Mode  ModeName
	Tool  string
	Cause error
}
```

```go
type CredentialMode string
```

```go
type Option func(*definitionOptions) error
```

```go
type Definition struct{
	// contains filtered or unexported fields
}
```

```go
type InitialFingerprint struct {
	Model           model.Model
	EffectiveSystem string
	ToolNames       []string
}
```

```go
type BoundDefinition interface {
	Name() identity.AgentName
	DisplayName() string
	Description() string
	Engine() Engine
	RuntimeProfile() RuntimeProfileName
	RuntimeSource() RuntimeSourceName
	RuntimeSelectionKind() RuntimeSelectionKind
	RuntimeCatalogDigest() string
	RuntimeIdentity() RuntimeIdentity
	Client() inference.Client
	Model() model.Model
	Effort() model.Effort
	System() string
	EffectiveSystem() string
	Instructions() string
	Tools() []tool.InvokableTool
	ToolLimits() ToolLimits
	Modes() []BoundMode
	Mode(ModeName) (BoundMode, bool)
	InitialMode() ModeName
	Access() AccessGate
	Middlewares() []tool.ToolMiddleware
	DrainTimeout() time.Duration
	RuntimeContext() RuntimeContextProvider
	ContextCounter() contextcount.ContextCounter
	CounterCapability() (contextcount.CounterCapability, bool)
	InferenceCapability() (contextcount.InferenceCapability, bool)

	ContextTransportCapability(model.Model) (contextcount.InferenceCapability, bool)
	ContextObservationPolicy() (ContextObservationPolicy, bool)
	CompactionPolicy() (CompactionPolicy, bool)
	OutputSchema() (*inference.OutputSchema, bool)
	ValidateContextModel(model.Model) error
	Delegation() Delegation
	Delegates() []identity.AgentName
	boundDefinition()
}
```

```go
type DefinitionErrorKind string
```

```go
type DefinitionError struct {
	Kind  DefinitionErrorKind
	Field string
	Value string
	Cause error
}
```

```go
type BindErrorKind string
```

```go
type BindError struct {
	Kind  BindErrorKind
	Name  string
	Index int
	Cause error
}
```

```go
type AccessGate interface {
	Authorize(ctx context.Context, request tool.Request) (gate.Resolution, error)
}
```

```go
type DelegationStyle uint8
```

```go
type Delegation struct{ Style DelegationStyle }
```

```go
type ReadGuard interface {
	DeniedRead(absPath string) bool

	MaxReadBytes() int64
}
```

```go
type Engine uint8
```

```go
type ConfigErrorKind string
```

```go
type ConfigError struct {
	Kind  ConfigErrorKind
	Cause error
}
```

```go
type IDGenerationError struct{ Cause error }
```

```go
type InputRejectedError struct {
	Reason event.RejectReason
	Cause  error
}
```

```go
type PolicyRevisionMarshalError struct{ Cause error }
```

```go
type CommitCancelReason string
```

```go
type CommitError struct {
	Reason CommitCancelReason
	Cause  error
}
```

```go
type ModeName string
```

```go
type ToolLimits struct {
	Iterations int
	Calls      int
	Parallel   int
}
```

```go
type Mode struct {
	Name         ModeName
	Model        model.Model
	Effort       model.Effort
	Tools        []tool.Definition
	ToolLimits   ToolLimits
	Instructions string
}
```

```go
type BoundMode struct {
	Name         ModeName
	Model        model.Model
	Effort       model.Effort
	Tools        []tool.InvokableTool
	ToolLimits   ToolLimits
	Instructions string
}
```

```go
type Provenance struct {
	LoopID uuid.UUID
	TurnID uuid.UUID
	StepID uuid.UUID
}
```

```go
type AgentHarnessName string
```

```go
type ModelAlias string
```

```go
type RuntimeProfileName string
```

```go
type RuntimeModelOption struct {
	Alias ModelAlias

	Description string

	Source RuntimeSourceName

	Credential CredentialMode

	NativeSmallModel string
	Target           model.Model
	DefaultEffort    model.Effort
	Efforts          []model.Effort
}
```

```go
type RuntimeCatalogEntry struct {
	AgentType    identity.AgentName
	AgentHarness AgentHarnessName
	Profile      RuntimeProfileName

	Description string

	Source     RuntimeSourceName
	Credential CredentialMode

	SelectionKind   RuntimeSelectionKind
	Default         bool
	DefaultModel    ModelAlias
	SmallModel      ModelAlias
	NeedsSmallModel bool
	Models          []RuntimeModelOption
}
```

```go
type Resolved struct {
	AgentType     identity.AgentName
	AgentHarness  AgentHarnessName
	Profile       RuntimeProfileName
	Source        RuntimeSourceName
	Credential    CredentialMode
	SelectionKind RuntimeSelectionKind

	ModelAlias ModelAlias

	TargetAlias      ModelAlias
	NativeSmallModel string
	SmallModel       ModelAlias
	Target           model.Model
	Effort           model.Effort
}
```

```go
type RuntimeCatalogErrorKind string
```

```go
type RuntimeCatalogError struct {
	Kind  RuntimeCatalogErrorKind
	Field string
}
```

```go
type RuntimeCatalog struct {
	// contains filtered or unexported fields
}
```

```go
type RuntimeContextProvider interface {
	Blocks(ctx context.Context) []content.Block
}
```

```go
type RuntimeSourceName string
```

```go
type RuntimeSelectionKind string
```

```go
type RequestUserInputFunc func(context.Context, string, []string) (string, error)
```

```go
type UserInputContextError struct{}
```

```go
type ApprovalRequestFunc func(ctx context.Context, prompt gate.ApprovalPrompt) (gate.ApprovalAction, error)
```

```go
type ApprovalContextError struct{}
```

### Constants {#constants}

`CompactionWireVersionUnknown`, `CompactionWireV1`, `CompactionInputFieldBasis`, `CompactionInputFieldModel`, `CompactionInputFieldRequestFingerprint`, `CompactionInputFieldTranscript`, `CompactionInputFieldMaxSummaryTokens`, `InvalidSummaryWire`, `InvalidSummaryIdentity`, `InvalidSummaryOutputShape`, `InvalidSummaryByteLimit`, `InvalidSummaryTokenUsage`, `InvalidSummaryTokenLimit`, `InvalidSummaryXMLSyntax`, `InvalidSummaryXMLRoot`, `InvalidSummaryXMLStructure`, `InvalidSummaryXMLContent`, `CounterPolicyUnknown`, `CounterPolicyRequireExact`, `CounterPolicyAllowConservative`, `CompactionFieldCounterPolicy`, `CompactionFieldCompactAt`, `CompactionFieldRearmBelow`, `CompactionFieldReservedOutput`, `CompactionFieldSafetyMargin`, `CompactionFieldMaxSummaryTokens`, `CompactionFieldCountTimeout`, `CompactionFieldHustle`, `ContextObservationFieldReservedOutput`, `ContextObservationFieldSafetyMargin`, `ContextObservationFieldCountTimeout`, `ChangeInvalidMode`, `ChangeInvalidModel`, `ChangeInvalidEffort`, `ChangeNoChanges`, `ChangeLoopShuttingDown`, `ChangeLoopExited`, `ChangeContextDone`, `ChangeDurableAppendFailed`, `ChangeInvalidExternalSource`, `ChangeInvalidExternalGeneration`, `ChangeExternalBuildFailed`, `ChangeExternalToolCollision`, `ChangeExternalToolsUnsupported`, `CredentialGatewayBacked`, `CredentialNativeAuth`, `DefinitionMissingName`, `DefinitionInvalidClient`, `DefinitionInvalidModel`, `DefinitionNilOption`, `DefinitionDuplicateOption`, `DefinitionInvalidTool`, `DefinitionInvalidToolLimits`, `DefinitionInvalidDrainTimeout`, `DefinitionInvalidMiddleware`, `DefinitionInvalidAccessGate`, `DefinitionInvalidEngine`, `DefinitionInvalidRuntimeContext`, `DefinitionInvalidDelegate`, `DefinitionInvalidDelegation`, `DefinitionInvalidMode`, `DefinitionDuplicateMode`, `DefinitionMissingInitialMode`, `DefinitionInvalidInitialMode`, `DefinitionMissingPolicyRevision`, `DefinitionInvalidPolicyRevision`, `DefinitionMissingContextCounter`, `DefinitionInvalidContextCounter`, `DefinitionMissingInferenceCapability`, `DefinitionInvalidInferenceCapability`, `DefinitionIncompatibleContextCounter`, `DefinitionMissingContextPolicy`, `DefinitionConflictingContextPolicy`, `DefinitionInvalidContextObservation`, `DefinitionInvalidCompaction`, `DefinitionInvalidModeBinding`, `DefinitionInvalidOutputSchema`, `DefinitionReservedToolName`, `DefinitionDuplicateContextTransport`, `DefinitionInvalidContextTransport`, `BindInvalidDefinition`, `BindInvalidContext`, `BindDuplicateDefinitionName`, `BindDuplicateToolName`, `BindInvalidToolInfo`, `BindInvalidAccessGate`, `BindInvalidRuntime`, `BindInvalidSessionID`, `BindInvalidLoopID`, `DelegationSyncOnly`, `DelegationManaged`, `EngineNative`, `EngineForeignClaude`, `EngineForeignCodex`, `EngineAdapter`, `ConfigMissingClient`, `ConfigInvalidModel`, `ConfigMissingPublisher`, `CommitTurnCancelled`, `ManagedInputQueueCapacity`, `RuntimeCatalogInvalidCredential`, `RuntimeCatalogInvalidSource`, `RuntimeCatalogInvalidSelectionKind`, `RuntimeCatalogInvalidIdentifier`, `RuntimeCatalogInvalidDescription`, `RuntimeCatalogInvalidModel`, `RuntimeCatalogMissingDefaultModel`, `RuntimeCatalogInvalidDefaultModel`, `RuntimeCatalogDuplicateAlias`, `RuntimeCatalogDuplicateHarness`, `RuntimeCatalogDefaultHarnessCount`, `RuntimeCatalogInvalidEffort`, `RuntimeCatalogDuplicateEffort`, `RuntimeCatalogInvalidDefaultEffort`, `RuntimeCatalogInvalidSmallModel`, `RuntimeCatalogNativeAliasConflict`, `RuntimeCatalogDerivedAliasConflict`, `RuntimeCatalogUnknownAgent`, `RuntimeCatalogUnknownHarness`, `RuntimeCatalogUnknownSource`, `RuntimeCatalogUnknownModel`, `RuntimeCatalogIncompatibleEffort`, `RuntimeSourceGateway`, `RuntimeSourceNative`, `RuntimeSelectionExplicit`, `RuntimeSelectionHarnessManaged`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ApprovalContextError`, `BindError`, `ChangeError`, `CommitError`, `CompactionInputError`, `CompactionPolicyError`, `ConfigError`, `ContextLimitError`, `ContextLimitUnknownError`, `ContextObservationPolicyError`, `ContextTransportNotDeclaredError`, `DefinitionError`, `IDGenerationError`, `InputRejectedError`, `InvalidSummaryError`, `OccupancyError`, `PolicyRevisionMarshalError`, `RequestFingerprintError`, `RuntimeCatalogError`, `SummaryTooLargeError`, `UserInputContextError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/loop/backend.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/backend.go)
- [pkg/loop/bound_overrides.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/bound_overrides.go)
- [pkg/loop/compaction.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/compaction.go)
- [pkg/loop/compaction_policy.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/compaction_policy.go)
- [pkg/loop/context.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context.go)
- [pkg/loop/context_observation.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context_observation.go)
- [pkg/loop/context_transport.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context_transport.go)
- [pkg/loop/controller.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/controller.go)
- [pkg/loop/credential_mode.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/credential_mode.go)
- [pkg/loop/definition.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/definition.go)
- [pkg/loop/definition_errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/definition_errors.go)
- [pkg/loop/deps.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/deps.go)
- [pkg/loop/doc.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/doc.go)
- [pkg/loop/engine.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/engine.go)
- [pkg/loop/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/errors.go)
- [pkg/loop/managed_queue.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/managed_queue.go)
- [pkg/loop/mode.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/mode.go)
- [pkg/loop/provenance.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/provenance.go)
- [pkg/loop/provenance_ctx.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/provenance_ctx.go)
- [pkg/loop/runtime_catalog.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/runtime_catalog.go)
- [pkg/loop/runtime_context.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/runtime_context.go)
- [pkg/loop/runtime_selection.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/runtime_selection.go)
- [pkg/loop/tool_context.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/tool_context.go)

Adjacent tests at the same commit:

- [pkg/loop/access_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/access_test.go)
- [pkg/loop/bound_runtime_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/bound_runtime_test.go)
- [pkg/loop/compaction_policy_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/compaction_policy_test.go)
- [pkg/loop/compaction_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/compaction_test.go)
- [pkg/loop/config_engine_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/config_engine_test.go)
- [pkg/loop/context_observation_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context_observation_test.go)
- [pkg/loop/context_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context_test.go)
- [pkg/loop/context_transport_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/context_transport_test.go)
- [pkg/loop/controller_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/controller_test.go)
- [pkg/loop/credential_mode_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/credential_mode_test.go)
- [pkg/loop/definition_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/definition_test.go)
- [pkg/loop/display_metadata_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/display_metadata_test.go)
- [pkg/loop/errors_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/errors_test.go)
- [pkg/loop/fake_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/fake_test.go)
- [pkg/loop/managed_queue_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/managed_queue_test.go)
- [pkg/loop/mode_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/mode_test.go)
- [pkg/loop/provenance_ctx_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/provenance_ctx_test.go)
- [pkg/loop/public_boundary_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/public_boundary_test.go)
- [pkg/loop/runtime_catalog_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/runtime_catalog_test.go)
- [pkg/loop/runtime_context_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/loop/runtime_context_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
