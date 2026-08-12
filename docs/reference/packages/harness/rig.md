---
id: reference/packages/harness/rig
title: rig package · rig
description: Reference for the Harness Rig composition root, session options, limits, workspaces, and restore policy.
audience: developer
section: reference
order: 150
publication: released
examples:
  - stage-06-rig
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

# rig package · rig

Import path: `github.com/looprig/harness/pkg/rig`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`Define` validates loop and hustle topology, storage, gates, classifiers, foreign builders, workspace placement, permission review, snapshots, and runtime catalogs. A `Rig` creates or restores sessions through explicit options; it does not perform model inference itself.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Define(options ...Option) (*Rig, error)`
- `func FingerprintFrom(definition loop.BoundDefinition) event.ConfigFingerprint`
- `func WithOffloadGC(policy OffloadGCPolicy) Option`
- `func WithPermissionClassifiers(classifiers gate.PermissionClassifierSet) Option`
- `func WithPermissionReviewPolicy(policy gate.PermissionReviewPolicy) Option`
- `func WithPermissionReviewLimits(limits PermissionReviewLimits) Option`
- `func WithPermissionReviewEvidence(access gate.EvidenceAccessEvaluator, containment gate.EvidenceContainmentVerifier, allowedKinds []string) Option`
- `func WithPermissionReviewSecurityCeiling(ceiling string) Option`
- `func WithPermissionReviewObservations(verifier gate.EvidenceObservationVerifier) Option`
- `func WithLoops(definitions ...loop.Definition) Option`
- `func WithHustles(definitions ...hustle.Definition) Option`
- `func WithHustleLimits(limits HustleLimits) Option`
- `func WithPrimers(names ...string) Option`
- `func WithActivePrimer(name string) Option`
- `func WithSessionStore(store *sessionstore.Store) Option`
- `func WithDelegationLimits(limits DelegationLimits) Option`
- `func WithFingerprintFields(fields ConfigFingerprintFields) Option`
- `func WithHooks(set hook.Set) Option`
- `func WithForeignBuilders(builder foreign.Builder, restored foreign.RestoredBuilder) Option`
- `func WithForeignServicesBuilders(builder foreign.ServicesBuilder, restored foreign.ServicesRestoredBuilder) Option`
- `func WithRuntimeCatalog(catalog loop.RuntimeCatalog) Option`
- `func WithGateCaps(caps GateCaps) Option`
- `func WithAllowConfigMismatch() Option`
- `func WithRestoreDecider(decider session.RestoreDecider) Option`
- `func WithSeedSnapshot(ref workspacestore.Ref) SessionOption`
- `func WithSessionResourceStorage(provider SessionResourceStorageProvider) Option`
- `func WithSnapshots(policy SnapshotPolicy) Option`
- `func WithExclusiveWorkspace(store *workspacestore.Store, root string, leaser storage.Leaser) Option`
- `func WithSessionWorkspaces(store *workspacestore.Store, baseDir string) Option`
- `func WithSharedWorkspace(store *workspacestore.Store, root string) Option`

### Methods {#methods}

- `func (e *DefinitionError) Error() string`
- `func (e *DefinitionError) Unwrap() error`
- `func (e *LifecycleError) Error() string`
- `func (e *LifecycleError) Unwrap() error`
- `func (r *Rig) NewSession(ctx context.Context, opts ...SessionOption) (session.SessionController, error)`
- `func (r *Rig) RestoreSession(ctx context.Context, id uuid.UUID) (session.SessionController, error)`
- `func (e *InvalidOffloadGCIntervalError) Error() string`
- `func (e *InvalidOffloadGCTimeoutError) Error() string`
- `func (e *SnapshotPolicyError) Error() string`
- `func (e *WorkspacePlacementError) Error() string`
- `func (e *WorkspacePlacementError) Unwrap() error`
- `func (e *PersistenceOverlapError) Error() string`
- `func (e *SessionOptionError) Error() string`

### Types {#types}

```go
type Rig struct {
	// contains filtered or unexported fields
}
```

```go
type DefinitionErrorKind string
```

```go
type DefinitionError struct {
	Kind  DefinitionErrorKind
	Name  string
	Cause error
}
```

```go
type LifecycleErrorKind string
```

```go
type LifecycleError struct {
	Kind  LifecycleErrorKind
	Cause error
}
```

```go
type ConfigFingerprintFields struct {
	AgentKind     string
	RuntimeSkills bool
	WorkspaceRoot string

	AdapterID string

	Posture string

	NativePermissionPolicyRev string

	ExternalCapabilityRev string

	WorkspaceTrust string

	PermissionStrictness event.StrictnessLevel

	ConfinementRev string

	ConfinementStrictness event.StrictnessLevel

	AppFields          map[string]string
	RuntimeProfile     string
	RuntimeCatalogRev  string
	RuntimeIdentityRev string
}
```

```go
type OffloadGCPolicy struct {
	Interval time.Duration
	Timeout  time.Duration
}
```

```go
type InvalidOffloadGCIntervalError struct {
	Interval time.Duration
}
```

```go
type InvalidOffloadGCTimeoutError struct {
	Timeout time.Duration
}
```

```go
type Option func(*definitionState) error
```

```go
type PermissionReviewLimits struct {
	MaxConsecutiveNeedsHuman int
	MaxInvalidOrFailed       int
	MaxIdenticalSubjects     int
	MaxStaleResponses        int
	InterruptOnTrip          bool
	Session                  PermissionReviewSessionLimits
}
```

```go
type PermissionReviewSessionLimits struct {
	MaxConsecutiveNeedsHuman int
	MaxInvalidOrFailed       int
	MaxIdenticalSubjects     int
	MaxStaleResponses        int
}
```

```go
type DelegationLimits struct {
	Depth int
	Quota int
}
```

```go
type GateCaps struct {
	MaxOpen    int
	MaxTimeout time.Duration
}
```

```go
type HustleLimits struct {
	BlockingConcurrent   int
	BlockingQueued       int
	BackgroundConcurrent int
	BackgroundQueued     int
	AuditTimeout         time.Duration
	FinalizationTimeout  time.Duration
	WorkerDrainTimeout   time.Duration
}
```

```go
type SessionOption func(*sessionOptions) error
```

```go
type SessionResourceStorage struct {
	Path     string
	Identity string
}
```

```go
type SessionResourceStorageProvider interface {
	StorageForSession(context.Context, uuid.UUID) (SessionResourceStorage, error)
}
```

```go
type SnapshotTrigger uint8
```

```go
type SnapshotPriority uint8
```

```go
type SnapshotPolicy struct {
	Trigger  SnapshotTrigger
	Priority SnapshotPriority
	Timeout  time.Duration
}
```

```go
type SnapshotPolicyErrorKind string
```

```go
type SnapshotPolicyError struct {
	Kind  SnapshotPolicyErrorKind
	Value int
}
```

```go
type WorkspaceRootBusyError = session.WorkspaceRootBusyError
```

```go
type WorkspaceRootLeaseLostError = session.WorkspaceRootLeaseLostError
```

```go
type WorkspaceRecoveryError = session.WorkspaceRecoveryError
```

```go
type WorkspacePlacementErrorKind string
```

```go
type WorkspacePlacementError struct {
	Kind  WorkspacePlacementErrorKind
	Name  string
	Cause error
}
```

```go
type PersistenceOverlapError struct {
	PersistencePath string
	Root            string
}
```

```go
type SessionOptionErrorKind string
```

```go
type SessionOptionError struct {
	Kind SessionOptionErrorKind
}
```

### Constants {#constants}

`DefinitionNilOption`, `DefinitionMissingLoop`, `DefinitionInvalidLoop`, `DefinitionDuplicateLoop`, `DefinitionMissingPrimer`, `DefinitionInvalidPrimer`, `DefinitionInvalidActivePrimer`, `DefinitionMissingSessionStore`, `DefinitionInvalidSessionStore`, `DefinitionInvalidDelegationLimits`, `DefinitionInvalidForeignBuilders`, `DefinitionInvalidGateCaps`, `DefinitionInvalidRestoreDecider`, `DefinitionDuplicateOption`, `DefinitionInvalidHustle`, `DefinitionDuplicateHustle`, `DefinitionMissingHustleLimits`, `DefinitionUnusedHustleLimits`, `DefinitionInvalidHustleLimits`, `DefinitionInvalidHooks`, `DefinitionMissingResourceStorage`, `DefinitionInvalidResourceStorage`, `DefinitionMissingCompactionHustle`, `DefinitionIncompatibleCompactionHustle`, `DefinitionInvalidPermissionClassifiers`, `DefinitionInvalidPermissionReviewPolicy`, `DefinitionIncompletePermissionReview`, `DefinitionUnusedPermissionReviewLimits`, `DefinitionInvalidPermissionReviewEvidence`, `DefinitionMissingPermissionReviewEvidence`, `DefinitionUnusedPermissionReviewEvidence`, `DefinitionInvalidPermissionReviewSecurityCeiling`, `DefinitionMissingPermissionReviewSecurityCeiling`, `DefinitionUnusedPermissionReviewSecurityCeiling`, `DefinitionInvalidPermissionReviewObservations`, `DefinitionUnusedPermissionReviewObservations`, `LifecycleContextDone`, `LifecycleIDGenerationFailed`, `LifecycleLeaseFailed`, `LifecycleJournalFailed`, `LifecycleAppenderFailed`, `LifecycleSessionFailed`, `LifecycleProcessNotificationsUnsupported`, `DefaultPermissionReviewBreakerThreshold`, `MaxHustleQueued`, `SnapshotTriggerUnset`, `SnapshotManual`, `SnapshotOnIdle`, `SnapshotOnTurnDone`, `SnapshotOnStepDone`, `SnapshotBestEffort`, `SnapshotRequired`, `SnapshotPolicyRequired`, `SnapshotPolicyWithoutWorkspace`, `SnapshotPolicyInvalidTrigger`, `SnapshotPolicyInvalidPriority`, `SnapshotPolicyInvalidTimeout`, `SnapshotPolicySharedRequired`, `WorkspaceMultiplePlacements`, `WorkspaceNilStore`, `WorkspaceNilLeaser`, `WorkspaceEmptyRoot`, `WorkspaceCanonicalizeFailed`, `WorkspaceLeaseNameInvalid`, `WorkspaceToolWithoutPlacement`, `SessionOptionNil`, `SessionOptionDuplicateSeed`, `SessionOptionEmptySeed`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DefinitionError`, `InvalidOffloadGCIntervalError`, `InvalidOffloadGCTimeoutError`, `LifecycleError`, `PersistenceOverlapError`, `SessionOptionError`, `SnapshotPolicyError`, `WorkspacePlacementError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/rig/definition.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/definition.go)
- [pkg/rig/doc.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/doc.go)
- [pkg/rig/errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/errors.go)
- [pkg/rig/fingerprint.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/fingerprint.go)
- [pkg/rig/lifecycle.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/lifecycle.go)
- [pkg/rig/offload_gc.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/offload_gc.go)
- [pkg/rig/options.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/options.go)
- [pkg/rig/session_options.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/session_options.go)
- [pkg/rig/session_resource_storage.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/session_resource_storage.go)
- [pkg/rig/snapshot_policy.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/snapshot_policy.go)
- [pkg/rig/workspace.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/workspace.go)
- [pkg/rig/workspace_errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/workspace_errors.go)

Adjacent tests at the same commit:

- [pkg/rig/agent_injection_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/agent_injection_test.go)
- [pkg/rig/compaction_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/compaction_test.go)
- [pkg/rig/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/deps_test.go)
- [pkg/rig/fingerprint_ownership_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/fingerprint_ownership_test.go)
- [pkg/rig/fingerprint_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/fingerprint_test.go)
- [pkg/rig/gate_host_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/gate_host_test.go)
- [pkg/rig/hooks_integration_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/hooks_integration_test.go)
- [pkg/rig/hooks_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/hooks_test.go)
- [pkg/rig/hustle_fingerprint_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/hustle_fingerprint_test.go)
- [pkg/rig/hustle_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/hustle_test.go)
- [pkg/rig/lifecycle_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/lifecycle_test.go)
- [pkg/rig/optional_dependencies_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/optional_dependencies_test.go)
- [pkg/rig/options_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/options_test.go)
- [pkg/rig/permission_review_evidence_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/permission_review_evidence_test.go)
- [pkg/rig/permission_review_observations_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/permission_review_observations_test.go)
- [pkg/rig/permission_review_security_ceiling_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/permission_review_security_ceiling_test.go)
- [pkg/rig/readme_example_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/readme_example_test.go)
- [pkg/rig/rig_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/rig_test.go)
- [pkg/rig/runtime_catalog_option_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/runtime_catalog_option_test.go)
- [pkg/rig/session_resource_storage_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/session_resource_storage_test.go)
- [pkg/rig/snapshot_policy_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/snapshot_policy_test.go)
- [pkg/rig/workspace_integration_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/workspace_integration_test.go)
- [pkg/rig/workspace_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/workspace_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
