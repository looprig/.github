---
id: reference/packages/harness/event
title: event package · event
description: Reference for the sealed Harness event union, codecs, filters, and lifecycle values.
audience: developer
section: reference
order: 141
publication: released
examples:
  - stage-07-session-events
  - stage-19-http-serve
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

# event package · event

Import path: `github.com/looprig/harness/pkg/event`. The source is pinned to github.com/looprig/harness@v0.25.0.

## Package role {#package-role}

Package event defines the sealed union of rig, session, loop, turn, step, and tool events.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func CompactWaiterReplyID(attempt CompactAttemptID, commandID uuid.UUID, resolved bool) uuid.UUID`
- `func ManifestFromLegacy(f ConfigFingerprint) ConfigManifest`
- `func AssessDrift(baseline, candidate ConfigManifest) DriftAssessment`
- `func ValidLoopRestoreTombstoneCategory(category string) bool`
- `func NewFactory(newID IDGen, now Clock) *Factory`
- `func ShouldDeliver(filter EventFilter, ev Event) bool`
- `func MarshalEvent(ev Event) ([]byte, error)`
- `func UnmarshalEvent(data []byte) (Event, error)`
- `func ErrKind(err error) string`
- `func ValidateEvent(ev Event) error`

### Methods {#methods}

- `func (id CompactAttemptID) IsZero() bool`
- `func (id CompactAttemptID) MarshalText() ([]byte, error)`
- `func (id *CompactAttemptID) UnmarshalText(text []byte) error`
- `func (r CompactionReason) Valid() bool`
- `func (r CompactRejectReason) Valid() bool`
- `func (value CompactionCommitted) MarshalJSON() ([]byte, error)`
- `func (value *CompactionCommitted) UnmarshalJSON(data []byte) error`
- `func (f ConfigFingerprint) Equal(other ConfigFingerprint) bool`
- `func (m ConfigManifest) Fingerprint() string`
- `func (m ConfigManifest) ToolNamesRev() string`
- `func (e *ContextValidationError) Error() string`
- `func (e *ContextValidationError) Unwrap() error`
- `func (m ContextMeasurement) Validate() error`
- `func (s DelegateDeliveryState) Valid() bool`
- `func (a DriftAssessment) AnyWarn() bool`
- `func (EmptyResponseError) Error() string`
- `func (e *ToolLimitError) Error() string`
- `func (e *TurnPanicError) Error() string`
- `func (h Header) ReplyTo() uuid.UUID`
- `func (v EventVisibility) Valid() bool`
- `func (h Header) EventHeader() Header`
- `func (h Header) Visibility() EventVisibility`
- `func (s DecisionSource) Valid() bool`
- `func (f *Factory) Stamp(h Header) (Header, error)`
- `func (f *Factory) StampWorkflowActivity(ev WorkflowActivity, deterministicID uuid.UUID) (WorkflowActivity, error)`
- `func (f *Factory) StampCompactWaiterResolved(ev CompactWaiterResolved) (Header, error)`
- `func (f *Factory) StampCompactWaiterRejected(ev CompactWaiterRejected) (Header, error)`
- `func (f *Factory) NewHeader() (Header, error)`
- `func (s LoopScope) Matches(loopID uuid.UUID) bool`
- `func (s IntegrationState) String() string`
- `func (s IntegrationState) Valid() bool`
- `func (e *EphemeralNotPersistableError) Error() string`
- `func (e *UnknownEventTypeError) Error() string`
- `func (e *UnsupportedSchemaError) Error() string`
- `func (e *EventEncodeError) Error() string`
- `func (e *EventEncodeError) Unwrap() error`
- `func (e *EventDecodeError) Error() string`
- `func (e *EventDecodeError) Unwrap() error`
- `func (e *LegacyRuntimeMigrationError) Error() string`
- `func (e *EventLimitError) Error() string`
- `func (e *UnknownMessageRoleError) Error() string`
- `func (e *RestoredError) Error() string`
- `func (e *RestoredModelFacingError) Error() string`
- `func (e *RestoredModelFacingError) ModelFacingError() string`
- `func (e *InvalidEventError) Error() string`
- `func (k WorkflowActivityKind) Valid() bool`
- `func (s WorkflowRunStatus) Valid() bool`

### Types {#types}

```go
type CompactAttemptID uuid.UUID
```

```go
type CompactionReason uint8
```

```go
type CompactRejectReason uint8
```

```go
type CompactionStarted struct {
	Header
	AttemptID CompactAttemptID `json:"attempt_id"`
	Reason    CompactionReason `json:"reason"`
	Basis     ContextBasis     `json:"basis"`
	// contains filtered or unexported fields
}
```

```go
type CompactionCommitted struct {
	Header
	AttemptID        CompactAttemptID        `json:"attempt_id"`
	WaiterCommandIDs []uuid.UUID             `json:"waiter_command_ids"`
	Reason           CompactionReason        `json:"reason"`
	Basis            ContextBasis            `json:"basis"`
	Summary          *content.UserMessage    `json:"summary"`
	Retained         content.AgenticMessages `json:"retained,omitempty"`
	PostContext      ContextMeasurement      `json:"post_context"`
	Duration         time.Duration           `json:"duration,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type CompactionRejected struct {
	Header
	AttemptID        CompactAttemptID    `json:"attempt_id"`
	WaiterCommandIDs []uuid.UUID         `json:"waiter_command_ids"`
	Reason           CompactionReason    `json:"reason"`
	Basis            ContextBasis        `json:"basis"`
	RejectReason     CompactRejectReason `json:"reject_reason"`
	Duration         time.Duration       `json:"duration,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type CompactWaiterResolved struct {
	Header
	AttemptID        CompactAttemptID `json:"attempt_id"`
	CommittedEventID uuid.UUID        `json:"committed_event_id"`
	// contains filtered or unexported fields
}
```

```go
type CompactWaiterRejected struct {
	Header
	AttemptID CompactAttemptID    `json:"attempt_id"`
	Reason    CompactRejectReason `json:"reason"`
	// contains filtered or unexported fields
}
```

```go
type ConfigFingerprint struct {
	TopologyRev string `json:"topology_rev,omitzero"`

	AgentKind string `json:"agent_kind,omitzero"`

	ModelID string `json:"model_id,omitzero"`

	SystemPromptRev string `json:"system_prompt_rev,omitzero"`

	ToolPolicyRev string `json:"tool_policy_rev,omitzero"`

	RuntimeSkills bool `json:"runtime_skills,omitzero"`

	WorkspaceRoot string `json:"workspace_root,omitzero"`

	AgentAdapter string `json:"agent_adapter,omitzero"`

	PermissionPosture string `json:"permission_posture,omitzero"`

	NativePermissionPolicyRev string `json:"native_permission_policy_rev,omitzero"`

	ExternalCapabilityRev string `json:"external_capability_rev,omitzero"`

	RuntimeProfile string `json:"runtime_profile,omitzero"`

	RuntimeCatalogRev string `json:"runtime_catalog_rev,omitzero"`

	RuntimeIdentityRev string `json:"runtime_identity_rev,omitzero"`
}
```

```go
type ConfigEpoch uint64
```

```go
type StrictnessLevel uint8
```

```go
type ToolManifestEntry struct {
	Name            string `json:"name"`
	InputSchemaRev  string `json:"input_schema_rev,omitzero"`
	OutputSchemaRev string `json:"output_schema_rev,omitzero"`
}
```

```go
type ConfigManifest struct {
	SchemaVersion   uint32              `json:"schema_version"`
	AgentKind       string              `json:"agent_kind,omitzero"`
	TopologyRev     string              `json:"topology_rev,omitzero"`
	ModelID         string              `json:"model_id,omitzero"`
	SystemPromptRev string              `json:"system_prompt_rev,omitzero"`
	Tools           []ToolManifestEntry `json:"tools,omitzero"`
	RuntimeSkills   bool                `json:"runtime_skills,omitzero"`
	WorkspaceRoot   string              `json:"workspace_root,omitzero"`
	WorkspaceTrust  string              `json:"workspace_trust,omitzero"`
	AgentAdapter    string              `json:"agent_adapter,omitzero"`

	PermissionPosture         string          `json:"permission_posture,omitzero"`
	NativePermissionPolicyRev string          `json:"native_permission_policy_rev,omitzero"`
	PermissionStrictness      StrictnessLevel `json:"permission_strictness,omitzero"`

	PermissionReviewConfigured bool `json:"permission_review_configured,omitzero"`

	PermissionReviewPolicyRev string          `json:"permission_review_policy_rev,omitzero"`
	ConfinementRev            string          `json:"confinement_rev,omitzero"`
	ConfinementStrictness     StrictnessLevel `json:"confinement_strictness,omitzero"`
	ExternalCapabilityRev     string          `json:"external_capability_rev,omitzero"`
	HookPolicyRev             string          `json:"hook_policy_rev,omitzero"`
	RuntimeProfile            string          `json:"runtime_profile,omitzero"`
	RuntimeCatalogRev         string          `json:"runtime_catalog_rev,omitzero"`

	RuntimeIdentityRev string `json:"runtime_identity_rev,omitzero"`

	AppFields map[string]string `json:"app_fields,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type ContextRevision uint64
```

```go
type ContextBasis struct {
	Revision       ContextRevision `json:"revision"`
	ThroughEventID uuid.UUID       `json:"through_event_id"`
}
```

```go
type ContextMeasurement struct {
	Basis              ContextBasis              `json:"basis"`
	Model              model.ModelKey            `json:"model"`
	RequestFingerprint [32]byte                  `json:"request_fingerprint"`
	InputTokens        content.TokenCount        `json:"input_tokens"`
	InputLimit         content.TokenCount        `json:"input_limit"`
	Quality            contextcount.CountQuality `json:"quality"`
}
```

```go
type ContextField string
```

```go
type ContextValidationError struct {
	Field ContextField
	Cause error
}
```

```go
type BasisPoints uint16
```

```go
type PressureLevel uint8
```

```go
type ContextMeasured struct {
	Header
	Measurement ContextMeasurement `json:"measurement"`
	// contains filtered or unexported fields
}
```

```go
type ContextPressure struct {
	Header
	Measurement ContextMeasurement `json:"measurement"`
	Occupancy   BasisPoints        `json:"occupancy"`
	Previous    PressureLevel      `json:"previous"`
	Current     PressureLevel      `json:"current"`
	// contains filtered or unexported fields
}
```

```go
type DelegateDeliveryState string
```

```go
type DelegateDeliveryStateChanged struct {
	Header
	RequestID    uuid.UUID             `json:"request_id"`
	TargetLoopID uuid.UUID             `json:"target_loop_id"`
	State        DelegateDeliveryState `json:"state"`
	// contains filtered or unexported fields
}
```

```go
type DriftSeverity string
```

```go
type DriftCategory string
```

```go
type DriftChange struct {
	Category DriftCategory `json:"category"`
	Field    string        `json:"field,omitzero"`
	Old      string        `json:"old,omitzero"`
	New      string        `json:"new,omitzero"`
	Severity DriftSeverity `json:"severity"`
}
```

```go
type DriftAssessment struct {
	Changes         []DriftChange `json:"changes,omitzero"`
	BaselineUpgrade bool          `json:"baseline_upgrade,omitzero"`
}
```

```go
type EmptyResponseError struct{}
```

```go
type ToolLimitError struct {
	Iterations    int
	MaxIterations int
	Calls         int
	MaxCalls      int
}
```

```go
type TurnPanicError struct{ Detail string }
```

```go
type Event interface {
	Class() Class
	Scope() Scope
	EndsTurn() bool // turn-terminal: the last event this turn's per-turn stream carries
	EventHeader() Header
	Visibility() EventVisibility
	// contains filtered or unexported methods
}
```

```go
type Reply interface {
	Event

	ReplyTo() uuid.UUID // == Header.Cause.CommandID: the command this answers
	// contains filtered or unexported methods
}
```

```go
type Class uint8
```

```go
type Scope uint8
```

```go
type EventVisibility uint8
```

```go
type CancelReason uint8
```

```go
type Header struct {
	identity.Coordinates

	AgentName identity.AgentName `json:"agent_name,omitzero"`

	EventID uuid.UUID `json:"event_id,omitzero"`

	CreatedAt time.Time `json:"created_at,omitzero"`

	Cause identity.Cause `json:"cause,omitzero"`

	EventVisibility EventVisibility `json:"visibility,omitzero"`
}
```

```go
type Subscription interface {
	Events() <-chan Delivery
	Close() error
	Err() error
}
```

```go
type Delivery struct {
	Event      Event
	JournalSeq uint64
}
```

```go
type HustleRunDescriptor struct {
	Definition hustle.DefinitionDescriptor `json:"definition"`
	RunID      hustle.RunID                `json:"run_id"`
	Runtime    ModelRuntime                `json:"runtime,omitzero"`
}
```

```go
type HustleStarted struct {
	Header
	Run HustleRunDescriptor `json:"run"`
	// contains filtered or unexported fields
}
```

```go
type HustleCompleted struct {
	Header
	Run      HustleRunDescriptor `json:"run"`
	Duration time.Duration       `json:"duration,omitzero"`
	Usage    *content.Usage      `json:"usage,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type HustleFailed struct {
	Header
	Run        HustleRunDescriptor `json:"run"`
	Duration   time.Duration       `json:"duration,omitzero"`
	Stage      hustle.Stage        `json:"stage"`
	ReasonCode hustle.ReasonCode   `json:"reason_code"`
	Usage      *content.Usage      `json:"usage,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type TurnIndex int
```

```go
type SessionStarted struct {
	Header
	Config   ConfigFingerprint `json:"config,omitzero"`
	Manifest ConfigManifest    `json:"manifest,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type SessionActive struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type SessionIdle struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type SessionStopped struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type RestoreStarted struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type RestoreDone struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type RestoreErrored struct {
	Header

	Err error `json:"-"`
	// contains filtered or unexported fields
}
```

```go
type DecisionSource string
```

```go
type ConfigurationAdopted struct {
	Header
	Epoch               ConfigEpoch    `json:"epoch"`
	PreviousFingerprint string         `json:"previous_fingerprint,omitzero"`
	AdoptedFingerprint  string         `json:"adopted_fingerprint"`
	Manifest            ConfigManifest `json:"manifest"`
	Drift               []DriftChange  `json:"drift,omitzero"`
	Source              DecisionSource `json:"source"`
	Actor               string         `json:"actor,omitzero"`
	AppVersion          string         `json:"app_version,omitzero"`

	Message string `json:"message,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type WorkspaceCheckpointed struct {
	Header
	Ref         string              `json:"ref"`
	Consistency SnapshotConsistency `json:"consistency"`
	Trigger     SnapshotTriggerKind `json:"trigger"`
	// contains filtered or unexported fields
}
```

```go
type SnapshotConsistency uint8
```

```go
type SnapshotTriggerKind uint8
```

```go
type WorkspaceRestored struct {
	Header
	Ref string `json:"ref"`
	// contains filtered or unexported fields
}
```

```go
type ActiveLoopChanged struct {
	Header
	PreviousLoopID uuid.UUID `json:"previous_loop_id,omitzero"`
	ActiveLoopID   uuid.UUID `json:"active_loop_id"`
	// contains filtered or unexported fields
}
```

```go
type LoopRestoreTombstoned struct {
	Header
	Category string `json:"category"`
	// contains filtered or unexported fields
}
```

```go
type LoopIdle struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type LoopStarted struct {
	Header

	Runtime      ModelRuntime  `json:"runtime,omitzero"`
	AgentRuntime *AgentRuntime `json:"agent_runtime,omitempty"`

	ParentToolUseID string `json:"parent_tool_use_id,omitzero"`

	ForeignSID string `json:"foreign_sid,omitzero"`

	InitialMode string `json:"initial_mode,omitzero"`

	InitialRequestID uuid.UUID `json:"initial_request_id,omitzero"`

	DisplayName string `json:"display_name,omitzero"`

	Description string `json:"description,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type AgentRuntime struct {
	Harness         string `json:"harness"`
	Profile         string `json:"profile"`
	CredentialMode  string `json:"credential_mode"`
	Source          string `json:"source,omitempty"`
	SelectionKind   string `json:"selection_kind,omitempty"`
	ModelAlias      string `json:"model_alias"`
	SmallModelAlias string `json:"small_model_alias,omitempty"`
	ACPSessionID    string `json:"acp_session_id,omitempty"`
}
```

```go
type DelegateRequestAccepted struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type ForeignSessionBound struct {
	Header
	ForeignSID string `json:"foreign_sid"`
	// contains filtered or unexported fields
}
```

```go
type LoopAgentSessionBound struct {
	Header
	ACPSessionID string `json:"acp_session_id"`
	// contains filtered or unexported fields
}
```

```go
type Clock func() time.Time
```

```go
type IDGen func() (uuid.UUID, error)
```

```go
type Factory struct {
	// contains filtered or unexported fields
}
```

```go
type EventFilter struct {
	Ephemeral LoopScope
	Enduring  LoopScope
}
```

```go
type LoopScope struct {
	All   bool
	Loops map[uuid.UUID]struct{}
}
```

```go
type GatePrepared struct {
	Header
	Gate gate.Gate `json:"gate,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type GateOpened struct {
	Header
	Gate gate.Gate `json:"gate,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type GateResolved struct {
	Header
	GateID gate.ID `json:"gate_id,omitzero"`

	Resolver gate.ResolverKind   `json:"resolver,omitempty"`
	Reason   gate.CloseReason    `json:"reason,omitempty"`
	Action   string              `json:"action,omitempty"`
	Source   gate.ResponseSource `json:"source,omitzero"`

	Audit gate.ResponseAudit `json:"-"`
	// contains filtered or unexported fields
}
```

```go
type IntegrationState uint8
```

```go
type IntegrationStatus struct {
	Header

	Source string `json:"source"`

	Name string `json:"name"`

	State IntegrationState `json:"state"`

	Detail string `json:"detail,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type EphemeralNotPersistableError struct{ Type string }
```

```go
type UnknownEventTypeError struct{ Type string }
```

```go
type UnsupportedSchemaError struct {
	Kind    string
	Version uint32
}
```

```go
type EventEncodeError struct {
	Type  string
	Cause error
}
```

```go
type EventDecodeError struct {
	Type  string
	Cause error
}
```

```go
type LegacyRuntimeMigrationError struct {
	Type   string
	Field  string
	Reason string
}
```

```go
type EventLimitError struct {
	Got int
	Max int
}
```

```go
type UnknownMessageRoleError struct{ Role string }
```

```go
type PermissionReviewStarted struct {
	Header
	GateID             gate.ID     `json:"gate_id,omitzero"`
	ToolExecutionID    uuid.UUID   `json:"tool_execution_id,omitzero"`
	Classifier         hustle.Name `json:"classifier,omitzero"`
	ClassifierRevision string      `json:"classifier_revision,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type PermissionReviewCompleted struct {
	Header
	GateID             gate.ID                   `json:"gate_id,omitzero"`
	ToolExecutionID    uuid.UUID                 `json:"tool_execution_id,omitzero"`
	Classifier         hustle.Name               `json:"classifier,omitzero"`
	ClassifierRevision string                    `json:"classifier_revision,omitzero"`
	Status             gate.ReviewStatus         `json:"status,omitzero"`
	Risk               gate.ReviewRisk           `json:"risk,omitzero"`
	Authorization      gate.ReviewAuthorization  `json:"authorization,omitzero"`
	Categories         []gate.ReviewRiskCategory `json:"categories,omitzero"`
	AutoApproved       bool                      `json:"auto_approved,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type ProcessStarted struct {
	Header
	Process tool.ProcessLifecycleMetadata `json:"process"`
	// contains filtered or unexported fields
}
```

```go
type ProcessBackgrounded struct {
	Header
	Process tool.ProcessLifecycleMetadata `json:"process"`
	// contains filtered or unexported fields
}
```

```go
type ProcessCompleted struct {
	Header
	Process tool.ProcessLifecycleMetadata `json:"process"`
	// contains filtered or unexported fields
}
```

```go
type ProcessStopRequested struct {
	Header
	Process tool.ProcessLifecycleMetadata `json:"process"`
	// contains filtered or unexported fields
}
```

```go
type ProcessLost struct {
	Header
	Process tool.ProcessLifecycleMetadata `json:"process"`
	// contains filtered or unexported fields
}
```

```go
type RestoredError struct {
	Kind    string `json:"kind"`
	Message string `json:"message"`
}
```

```go
type RestoredModelFacingError struct {
	Kind    string `json:"kind"`
	Message string `json:"message"`
	Detail  string `json:"-"`
}
```

```go
type PermissionDecisionEffect string
```

```go
type PermissionRequested struct {
	Header
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`

	Request tool.Request `json:"-"`
	// contains filtered or unexported fields
}
```

```go
type PermissionDecided struct {
	Header
	ToolExecutionID uuid.UUID                `json:"tool_execution_id,omitzero"`
	Effect          PermissionDecisionEffect `json:"effect,omitempty"`
	Reason          string                   `json:"reason,omitempty"`
	Subject         string                   `json:"subject,omitempty"`
	Audit           string                   `json:"audit,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type UserInputRequested struct {
	Header
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`
	Question        string    `json:"question,omitempty"`
	Choices         []string  `json:"choices,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type ToolCallStarted struct {
	Header
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`
	ToolName        string    `json:"tool_name,omitempty"`
	Summary         string    `json:"summary,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type ToolCallCompleted struct {
	Header
	ToolExecutionID uuid.UUID `json:"tool_execution_id,omitzero"`
	IsError         bool      `json:"is_error,omitzero"`
	ResultPreview   string    `json:"result_preview,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type ModelRuntime struct {
	Key       model.ModelKey      `json:"key"`
	Limits    model.ContextLimits `json:"limits"`
	Effort    model.Effort        `json:"effort,omitzero"`
	APIFormat model.APIFormat     `json:"api_format,omitzero"`
	BaseURL   string              `json:"base_url,omitzero"`
}
```

```go
type LoopInferenceChanged struct {
	Header
	Runtime ModelRuntime `json:"runtime,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type LoopModeChanged struct {
	Header
	PreviousMode string       `json:"previous_mode,omitzero"`
	Mode         string       `json:"mode,omitzero"`
	Runtime      ModelRuntime `json:"runtime,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type ExternalToolIdentity struct {
	Name         string `json:"name"`
	SchemaDigest string `json:"schema_digest"`
}
```

```go
type LoopExternalToolsetChanged struct {
	Header
	Source     string                 `json:"source"`
	Generation string                 `json:"generation"`
	Tools      []ExternalToolIdentity `json:"tools,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type TurnStarted struct {
	Header
	TurnIndex TurnIndex            `json:"turn_index,omitzero"`
	Message   *content.UserMessage `json:"message,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type StepDone struct {
	Header
	Messages content.AgenticMessages `json:"messages,omitempty"`
	// contains filtered or unexported fields
}
```

```go
type TurnFoldedInto struct {
	Header
	TurnIndex TurnIndex            `json:"turn_index,omitzero"`
	Message   *content.UserMessage `json:"message,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type InputCancelled struct {
	Header
	TurnIndex TurnIndex            `json:"turn_index,omitzero"`
	Reason    CancelReason         `json:"reason,omitzero"`
	Message   *content.UserMessage `json:"message,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type RejectReason uint8
```

```go
type InputQueued struct {
	Header
	// contains filtered or unexported fields
}
```

```go
type TurnRejected struct {
	Header
	Reason RejectReason `json:"reason,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type TokenDelta struct {
	Header
	TurnIndex TurnIndex `json:"turn_index,omitzero"`

	Chunk content.Chunk `json:"-"`
	// contains filtered or unexported fields
}
```

```go
type TurnDone struct {
	Header
	TurnIndex TurnIndex `json:"turn_index,omitzero"`

	Message *content.AIMessage `json:"message,omitzero"`

	Usage content.Usage `json:"usage,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type TurnFailed struct {
	Header
	TurnIndex TurnIndex `json:"turn_index,omitzero"`

	Err error `json:"-"`
	// contains filtered or unexported fields
}
```

```go
type TurnInterrupted struct {
	Header
	TurnIndex TurnIndex `json:"turn_index,omitzero"`
	// contains filtered or unexported fields
}
```

```go
type EventName string
```

```go
type FieldName string
```

```go
type Rule string
```

```go
type InvalidEventError struct {
	Event EventName
	Field FieldName
	Rule  Rule
}
```

```go
type WorkflowActivityKind string
```

```go
type WorkflowRunStatus string
```

```go
type WorkflowActivity struct {
	Header

	RunID             uuid.UUID            `json:"run_id"`
	WorkflowName      string               `json:"workflow_name"`
	WorkflowVersion   string               `json:"workflow_version"`
	Kind              WorkflowActivityKind `json:"kind"`
	Status            WorkflowRunStatus    `json:"status"`
	VertexID          uuid.UUID            `json:"vertex_id,omitzero"`
	VertexLabel       string               `json:"vertex_label,omitempty"`
	CompletedVertices uint32               `json:"completed_vertices,omitzero"`
	TotalVertices     uint32               `json:"total_vertices,omitzero"`
	Message           string               `json:"message,omitempty"`
	OccurredAt        time.Time            `json:"occurred_at"`
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`CompactionReasonUnspecified`, `CompactionReasonManual`, `CompactionReasonAutomatic`, `CompactRejectUnspecified`, `CompactRejectControlLaneFull`, `CompactRejectShuttingDown`, `CompactRejectInterrupted`, `CompactRejectCanceled`, `CompactRejectStaleBasis`, `CompactRejectProgressPublication`, `CompactRejectUnavailable`, `CompactRejectExecutionFailed`, `CompactRejectInvalidSummary`, `CompactRejectContextCountFailed`, `CompactRejectSummaryTooLarge`, `CompactRejectInternal`, `CompactRejectContextLimitUnknown`, `CompactRejectRetainedTailTooLarge`, `ManifestSchemaVersion`, `ContextFieldRevision`, `ContextFieldThroughEventID`, `ContextFieldModel`, `ContextFieldRequestFingerprint`, `ContextFieldInputLimit`, `ContextFieldQuality`, `FullScaleBasisPoints`, `PressureUnknown`, `PressureNormal`, `PressureCompact`, `PressureHardLimit`, `DelegateDeliverySteerAttemptReserved`, `DelegateDeliveryResolvedUnknown`, `DelegateDeliveryResolvedUntrackable`, `DriftInfo`, `DriftWarn`, `DriftTool`, `DriftModel`, `DriftPrompt`, `DriftTopology`, `DriftExternal`, `DriftConfinement`, `DriftPermission`, `DriftWorkspace`, `DriftTrust`, `DriftAgentKind`, `DriftAgentName`, `DriftAdapter`, `DriftRuntimeSkills`, `DriftHookPolicy`, `DriftRuntime`, `DriftApp`, `Ephemeral`, `Enduring`, `ScopeSession`, `ScopeLoop`, `Public`, `Internal`, `CancelClientRetracted`, `CancelTurnInterrupted`, `CancelTurnFailed`, `DecisionSourceUser`, `DecisionSourcePolicy`, `DecisionSourceOperator`, `DecisionSourceMigration`, `SnapshotConsistencyUnknown`, `SnapshotQuiescent`, `SnapshotFuzzy`, `SnapshotTriggerKindUnknown`, `SnapshotTriggerManual`, `SnapshotTriggerIdle`, `SnapshotTriggerInterrupt`, `SnapshotTriggerTurnDone`, `SnapshotTriggerStepDone`, `SnapshotTriggerSeed`, `LoopRestoreTombstoneRuntimeMismatch`, `LoopRestoreTombstoneRuntimeUnavailable`, `IntegrationStarting`, `IntegrationReady`, `IntegrationDegraded`, `IntegrationFailed`, `IntegrationClosed`, `MaxIntegrationSourceBytes`, `MaxIntegrationNameBytes`, `MaxIntegrationDetailBytes`, `KindEmptyResponse`, `KindToolLimit`, `KindTurnPanic`, `KindUnknown`, `PermissionEffectApprove`, `PermissionEffectDeny`, `RejectUnspecified`, `RejectQueueFull`, `RejectShuttingDown`, `RejectInternal`, `RuleRequired`, `RuleMustBeZero`, `RuleUnknownType`, `RuleInvalid`, `FieldEventID`, `FieldSessionID`, `FieldLoopID`, `FieldTurnID`, `FieldStepID`, `FieldToolExecutionID`, `FieldConsistency`, `FieldTrigger`, `FieldCause`, `FieldCommandID`, `FieldRequestID`, `FieldActiveLoopID`, `FieldTargetLoopID`, `FieldCategory`, `FieldModel`, `FieldModelKey`, `FieldContextLimits`, `FieldEffort`, `FieldUsage`, `FieldMessages`, `FieldVisibility`, `FieldDefinition`, `FieldRunID`, `FieldRuntime`, `FieldAgentRuntime`, `FieldACPSessionID`, `FieldDuration`, `FieldStage`, `FieldReasonCode`, `FieldAttemptID`, `FieldReason`, `FieldRejectReason`, `FieldWaiterCommandIDs`, `FieldSummary`, `FieldRetained`, `FieldPostContext`, `FieldCommittedEventID`, `FieldSource`, `FieldActor`, `FieldGeneration`, `FieldTools`, `FieldProcess`, `FieldGateID`, `FieldClassifier`, `FieldClassifierRevision`, `FieldStatus`, `FieldRisk`, `FieldAuthorization`, `FieldCategories`, `FieldAutoApproved`, `FieldIntegrationName`, `FieldState`, `FieldDetail`, `FieldEpoch`, `FieldAdoptedFingerprint`, `FieldManifest`, `FieldDrift`, `FieldMessage`, `FieldWorkflowName`, `FieldWorkflowVersion`, `FieldActivityKind`, `FieldOccurredAt`, `FieldVertexID`, `FieldVertexLabel`, `FieldProgress`, `FieldType`, `MaxConfigMessageLen`, `MaxConfigActorLen`, `WorkflowActivityRunStarted`, `WorkflowActivityVertexCompleted`, `WorkflowActivityRunInterrupted`, `WorkflowActivityRunResumed`, `WorkflowActivityRunCompleted`, `WorkflowActivityRunCancelled`, `WorkflowActivityRunFailed`, `WorkflowActivityKindRunStarted`, `WorkflowActivityKindVertexCompleted`, `WorkflowActivityKindRunInterrupted`, `WorkflowActivityKindRunResumed`, `WorkflowActivityKindRunCompleted`, `WorkflowActivityKindRunCancelled`, `WorkflowActivityKindRunFailed`, `WorkflowRunStatusRunning`, `WorkflowRunStatusInterrupted`, `WorkflowRunStatusCompleted`, `WorkflowRunStatusCancelled`, `WorkflowRunStatusFailed`, `MaxWorkflowNameBytes`, `MaxWorkflowVersionBytes`, `MaxWorkflowVertexLabelBytes`, `MaxWorkflowActivityMessageBytes`, `MaxWorkflowActivityProgress`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ContextValidationError`, `EmptyResponseError`, `EphemeralNotPersistableError`, `EventDecodeError`, `EventEncodeError`, `EventLimitError`, `InvalidEventError`, `LegacyRuntimeMigrationError`, `RestoredError`, `RestoredModelFacingError`, `ToolLimitError`, `TurnPanicError`, `UnknownEventTypeError`, `UnknownMessageRoleError`, `UnsupportedSchemaError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/event/compaction.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/compaction.go)
- [pkg/event/config_fingerprint.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/config_fingerprint.go)
- [pkg/event/config_manifest.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/config_manifest.go)
- [pkg/event/context.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/context.go)
- [pkg/event/delegate_delivery.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/delegate_delivery.go)
- [pkg/event/doc.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/doc.go)
- [pkg/event/drift.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/drift.go)
- [pkg/event/errors.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/errors.go)
- [pkg/event/event.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/event.go)
- [pkg/event/factory.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/factory.go)
- [pkg/event/filter.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/filter.go)
- [pkg/event/gate.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/gate.go)
- [pkg/event/integration.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/integration.go)
- [pkg/event/marshal.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/marshal.go)
- [pkg/event/permission_review.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/permission_review.go)
- [pkg/event/process.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/process.go)
- [pkg/event/restored_error.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/restored_error.go)
- [pkg/event/tool.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/tool.go)
- [pkg/event/turn.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/turn.go)
- [pkg/event/validate.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/validate.go)
- [pkg/event/workflow.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/workflow.go)

Adjacent tests at the same commit:

- [pkg/event/agent_runtime_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/agent_runtime_test.go)
- [pkg/event/compaction_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/compaction_test.go)
- [pkg/event/config_fingerprint_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/config_fingerprint_test.go)
- [pkg/event/config_manifest_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/config_manifest_fuzz_test.go)
- [pkg/event/config_manifest_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/config_manifest_test.go)
- [pkg/event/context_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/context_test.go)
- [pkg/event/delegate_delivery_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/delegate_delivery_test.go)
- [pkg/event/drift_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/drift_test.go)
- [pkg/event/errors_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/errors_test.go)
- [pkg/event/event_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/event_test.go)
- [pkg/event/external_toolset_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/external_toolset_test.go)
- [pkg/event/factory_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/factory_test.go)
- [pkg/event/filter_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/filter_test.go)
- [pkg/event/foreign_session_bound_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/foreign_session_bound_test.go)
- [pkg/event/gate_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/gate_test.go)
- [pkg/event/gate_wire_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/gate_wire_test.go)
- [pkg/event/header_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/header_test.go)
- [pkg/event/hustle_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/hustle_fuzz_test.go)
- [pkg/event/hustle_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/hustle_test.go)
- [pkg/event/integration_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/integration_test.go)
- [pkg/event/loop_restore_tombstone_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/loop_restore_tombstone_test.go)
- [pkg/event/loopstarted_display_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/loopstarted_display_test.go)
- [pkg/event/loopstarted_foreignsid_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/loopstarted_foreignsid_test.go)
- [pkg/event/marshal_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/marshal_test.go)
- [pkg/event/permission_review_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/permission_review_fuzz_test.go)
- [pkg/event/permission_review_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/permission_review_test.go)
- [pkg/event/process_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/process_test.go)
- [pkg/event/quality_validation_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/quality_validation_test.go)
- [pkg/event/restored_error_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/restored_error_test.go)
- [pkg/event/rig_fuzz_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/rig_fuzz_test.go)
- [pkg/event/rig_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/rig_test.go)
- [pkg/event/tool_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/tool_test.go)
- [pkg/event/usage_runtime_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/usage_runtime_test.go)
- [pkg/event/validate_internal_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/validate_internal_test.go)
- [pkg/event/validate_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/validate_test.go)
- [pkg/event/workflow_test.go](https://github.com/looprig/harness/blob/3d1dafd7a9a3f8979b712e8e9b3184727e477d76/pkg/event/workflow_test.go)

Run `go test ./...` from a checkout of the `harness` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
