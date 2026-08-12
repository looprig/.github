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
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# event package · event

Import path: `github.com/looprig/harness/pkg/event`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

Every event has a producer `Header`, lifecycle class, visibility, and scope. Durable events are replay inputs; ephemeral streaming values are intentionally not persisted. Reply events carry correlation data for a command or gate.

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
- `func (ephemeral) Class() Class`
- `func (ephemeral) EndsTurn() bool`
- `func (enduring) Class() Class`
- `func (enduring) EndsTurn() bool`
- `func (terminal) Class() Class`
- `func (terminal) EndsTurn() bool`
- `func (sessionScoped) Scope() Scope`
- `func (loopScoped) Scope() Scope`
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

`CompactAttemptID`, `CompactionReason`, `CompactRejectReason`, `CompactionStarted`, `CompactionCommitted`, `CompactionRejected`, `CompactWaiterResolved`, `CompactWaiterRejected`, `ConfigFingerprint`, `ConfigEpoch`, `StrictnessLevel`, `ToolManifestEntry`, `ConfigManifest`, `ContextRevision`, `ContextBasis`, `ContextMeasurement`, `ContextField`, `ContextValidationError`, `BasisPoints`, `PressureLevel`, `ContextMeasured`, `ContextPressure`, `DelegateDeliveryState`, `DelegateDeliveryStateChanged`, `DriftSeverity`, `DriftCategory`, `DriftChange`, `DriftAssessment`, `EmptyResponseError`, `ToolLimitError`, `TurnPanicError`, `Event`, `Reply`, `Class`, `Scope`, `EventVisibility`, `CancelReason`, `Header`, `Subscription`, `Delivery`, `HustleRunDescriptor`, `HustleStarted`, `HustleCompleted`, `HustleFailed`, `TurnIndex`, `SessionStarted`, `SessionActive`, `SessionIdle`, `SessionStopped`, `RestoreStarted`, `RestoreDone`, `RestoreErrored`, `DecisionSource`, `ConfigurationAdopted`, `WorkspaceCheckpointed`, `SnapshotConsistency`, `SnapshotTriggerKind`, `WorkspaceRestored`, `ActiveLoopChanged`, `LoopRestoreTombstoned`, `LoopIdle`, `LoopStarted`, `AgentRuntime`, `DelegateRequestAccepted`, `ForeignSessionBound`, `LoopAgentSessionBound`, `Clock`, `IDGen`, `Factory`, `EventFilter`, `LoopScope`, `GatePrepared`, `GateOpened`, `GateResolved`, `IntegrationState`, `IntegrationStatus`, `EphemeralNotPersistableError`, `UnknownEventTypeError`, `UnsupportedSchemaError`, `EventEncodeError`, `EventDecodeError`, `LegacyRuntimeMigrationError`, `EventLimitError`, `UnknownMessageRoleError`, `PermissionReviewStarted`, `PermissionReviewCompleted`, `ProcessStarted`, `ProcessBackgrounded`, `ProcessCompleted`, `ProcessStopRequested`, `ProcessLost`, `RestoredError`, `RestoredModelFacingError`, `PermissionDecisionEffect`, `PermissionRequested`, `PermissionDecided`, `UserInputRequested`, `ToolCallStarted`, `ToolCallCompleted`, `ModelRuntime`, `LoopInferenceChanged`, `LoopModeChanged`, `ExternalToolIdentity`, `LoopExternalToolsetChanged`, `TurnStarted`, `StepDone`, `TurnFoldedInto`, `InputCancelled`, `RejectReason`, `InputQueued`, `TurnRejected`, `TokenDelta`, `TurnDone`, `TurnFailed`, `TurnInterrupted`, `EventName`, `FieldName`, `Rule`, `InvalidEventError`, `WorkflowActivityKind`, `WorkflowRunStatus`, `WorkflowActivity`

### Constants {#constants}

`CompactionReasonUnspecified`, `CompactionReasonManual`, `CompactionReasonAutomatic`, `CompactRejectUnspecified`, `CompactRejectControlLaneFull`, `CompactRejectShuttingDown`, `CompactRejectInterrupted`, `CompactRejectCanceled`, `CompactRejectStaleBasis`, `CompactRejectProgressPublication`, `CompactRejectUnavailable`, `CompactRejectExecutionFailed`, `CompactRejectInvalidSummary`, `CompactRejectContextCountFailed`, `CompactRejectSummaryTooLarge`, `CompactRejectInternal`, `CompactRejectContextLimitUnknown`, `ManifestSchemaVersion`, `ContextFieldRevision`, `ContextFieldThroughEventID`, `ContextFieldModel`, `ContextFieldRequestFingerprint`, `ContextFieldInputLimit`, `ContextFieldQuality`, `FullScaleBasisPoints`, `PressureUnknown`, `PressureNormal`, `PressureCompact`, `PressureHardLimit`, `DelegateDeliverySteerAttemptReserved`, `DelegateDeliveryResolvedUnknown`, `DelegateDeliveryResolvedUntrackable`, `DriftInfo`, `DriftWarn`, `DriftTool`, `DriftModel`, `DriftPrompt`, `DriftTopology`, `DriftExternal`, `DriftConfinement`, `DriftPermission`, `DriftWorkspace`, `DriftTrust`, `DriftAgentKind`, `DriftAgentName`, `DriftAdapter`, `DriftRuntimeSkills`, `DriftHookPolicy`, `DriftRuntime`, `DriftApp`, `Ephemeral`, `Enduring`, `ScopeSession`, `ScopeLoop`, `Public`, `Internal`, `CancelClientRetracted`, `CancelTurnInterrupted`, `CancelTurnFailed`, `DecisionSourceUser`, `DecisionSourcePolicy`, `DecisionSourceOperator`, `DecisionSourceMigration`, `SnapshotConsistencyUnknown`, `SnapshotQuiescent`, `SnapshotFuzzy`, `SnapshotTriggerKindUnknown`, `SnapshotTriggerManual`, `SnapshotTriggerIdle`, `SnapshotTriggerInterrupt`, `SnapshotTriggerTurnDone`, `SnapshotTriggerStepDone`, `SnapshotTriggerSeed`, `LoopRestoreTombstoneRuntimeMismatch`, `LoopRestoreTombstoneRuntimeUnavailable`, `IntegrationStarting`, `IntegrationReady`, `IntegrationDegraded`, `IntegrationFailed`, `IntegrationClosed`, `MaxIntegrationSourceBytes`, `MaxIntegrationNameBytes`, `MaxIntegrationDetailBytes`, `KindEmptyResponse`, `KindToolLimit`, `KindTurnPanic`, `KindUnknown`, `PermissionEffectApprove`, `PermissionEffectDeny`, `RejectUnspecified`, `RejectQueueFull`, `RejectShuttingDown`, `RejectInternal`, `RuleRequired`, `RuleMustBeZero`, `RuleUnknownType`, `RuleInvalid`, `FieldEventID`, `FieldSessionID`, `FieldLoopID`, `FieldTurnID`, `FieldStepID`, `FieldToolExecutionID`, `FieldConsistency`, `FieldTrigger`, `FieldCause`, `FieldCommandID`, `FieldRequestID`, `FieldActiveLoopID`, `FieldTargetLoopID`, `FieldCategory`, `FieldModel`, `FieldModelKey`, `FieldContextLimits`, `FieldEffort`, `FieldUsage`, `FieldMessages`, `FieldVisibility`, `FieldDefinition`, `FieldRunID`, `FieldRuntime`, `FieldAgentRuntime`, `FieldACPSessionID`, `FieldDuration`, `FieldStage`, `FieldReasonCode`, `FieldAttemptID`, `FieldReason`, `FieldRejectReason`, `FieldWaiterCommandIDs`, `FieldSummary`, `FieldPostContext`, `FieldCommittedEventID`, `FieldSource`, `FieldActor`, `FieldGeneration`, `FieldTools`, `FieldProcess`, `FieldGateID`, `FieldClassifier`, `FieldClassifierRevision`, `FieldStatus`, `FieldRisk`, `FieldAuthorization`, `FieldCategories`, `FieldAutoApproved`, `FieldIntegrationName`, `FieldState`, `FieldDetail`, `FieldEpoch`, `FieldAdoptedFingerprint`, `FieldManifest`, `FieldDrift`, `FieldMessage`, `FieldWorkflowName`, `FieldWorkflowVersion`, `FieldActivityKind`, `FieldOccurredAt`, `FieldVertexID`, `FieldVertexLabel`, `FieldProgress`, `FieldType`, `MaxConfigMessageLen`, `MaxConfigActorLen`, `WorkflowActivityRunStarted`, `WorkflowActivityVertexCompleted`, `WorkflowActivityRunInterrupted`, `WorkflowActivityRunResumed`, `WorkflowActivityRunCompleted`, `WorkflowActivityRunCancelled`, `WorkflowActivityRunFailed`, `WorkflowActivityKindRunStarted`, `WorkflowActivityKindVertexCompleted`, `WorkflowActivityKindRunInterrupted`, `WorkflowActivityKindRunResumed`, `WorkflowActivityKindRunCompleted`, `WorkflowActivityKindRunCancelled`, `WorkflowActivityKindRunFailed`, `WorkflowRunStatusRunning`, `WorkflowRunStatusInterrupted`, `WorkflowRunStatusCompleted`, `WorkflowRunStatusCancelled`, `WorkflowRunStatusFailed`, `MaxWorkflowNameBytes`, `MaxWorkflowVersionBytes`, `MaxWorkflowVertexLabelBytes`, `MaxWorkflowActivityMessageBytes`, `MaxWorkflowActivityProgress`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ContextValidationError`, `EmptyResponseError`, `ToolLimitError`, `TurnPanicError`, `EphemeralNotPersistableError`, `UnknownEventTypeError`, `UnsupportedSchemaError`, `EventEncodeError`, `EventDecodeError`, `LegacyRuntimeMigrationError`, `EventLimitError`, `UnknownMessageRoleError`, `RestoredError`, `RestoredModelFacingError`, `InvalidEventError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/event/compaction.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/compaction.go)
- [pkg/event/config_fingerprint.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/config_fingerprint.go)
- [pkg/event/config_manifest.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/config_manifest.go)
- [pkg/event/context.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/context.go)
- [pkg/event/delegate_delivery.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/delegate_delivery.go)
- [pkg/event/doc.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/doc.go)
- [pkg/event/drift.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/drift.go)
- [pkg/event/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/errors.go)
- [pkg/event/event.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/event.go)
- [pkg/event/factory.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/factory.go)
- [pkg/event/filter.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/filter.go)
- [pkg/event/gate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/gate.go)
- [pkg/event/integration.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/integration.go)
- [pkg/event/marshal.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/marshal.go)
- [pkg/event/permission_review.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/permission_review.go)
- [pkg/event/process.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/process.go)
- [pkg/event/restored_error.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/restored_error.go)
- [pkg/event/tool.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/tool.go)
- [pkg/event/turn.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/turn.go)
- [pkg/event/validate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/validate.go)
- [pkg/event/workflow.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/workflow.go)

Adjacent tests at the same commit:

- [pkg/event/agent_runtime_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/agent_runtime_test.go)
- [pkg/event/compaction_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/compaction_test.go)
- [pkg/event/config_fingerprint_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/config_fingerprint_test.go)
- [pkg/event/config_manifest_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/config_manifest_fuzz_test.go)
- [pkg/event/config_manifest_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/config_manifest_test.go)
- [pkg/event/context_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/context_test.go)
- [pkg/event/delegate_delivery_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/delegate_delivery_test.go)
- [pkg/event/drift_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/drift_test.go)
- [pkg/event/errors_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/errors_test.go)
- [pkg/event/event_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/event_test.go)
- [pkg/event/external_toolset_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/external_toolset_test.go)
- [pkg/event/factory_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/factory_test.go)
- [pkg/event/filter_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/filter_test.go)
- [pkg/event/foreign_session_bound_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/foreign_session_bound_test.go)
- [pkg/event/gate_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/gate_test.go)
- [pkg/event/gate_wire_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/gate_wire_test.go)
- [pkg/event/header_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/header_test.go)
- [pkg/event/hustle_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/hustle_fuzz_test.go)
- [pkg/event/hustle_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/hustle_test.go)
- [pkg/event/integration_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/integration_test.go)
- [pkg/event/loop_restore_tombstone_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/loop_restore_tombstone_test.go)
- [pkg/event/loopstarted_display_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/loopstarted_display_test.go)
- [pkg/event/loopstarted_foreignsid_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/loopstarted_foreignsid_test.go)
- [pkg/event/marshal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/marshal_test.go)
- [pkg/event/permission_review_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/permission_review_fuzz_test.go)
- [pkg/event/permission_review_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/permission_review_test.go)
- [pkg/event/process_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/process_test.go)
- [pkg/event/quality_validation_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/quality_validation_test.go)
- [pkg/event/restored_error_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/restored_error_test.go)
- [pkg/event/rig_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/rig_fuzz_test.go)
- [pkg/event/rig_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/rig_test.go)
- [pkg/event/tool_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/tool_test.go)
- [pkg/event/usage_runtime_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/usage_runtime_test.go)
- [pkg/event/validate_internal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/validate_internal_test.go)
- [pkg/event/validate_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/validate_test.go)
- [pkg/event/workflow_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/event/workflow_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
