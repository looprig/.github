---
id: reference/packages/harness/hustle
title: hustle package · hustle
description: Reference for Harness bounded inference-and-tool hustle definitions, outcomes, retries, and evidence bindings.
audience: developer
section: reference
order: 146
publication: released
examples:
  - stage-13-classifier
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

# hustle package · hustle

Import path: `github.com/looprig/harness/pkg/hustle`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

`hustle.Definition` is immutable configuration for inference, system prompt, output schema, evidence tools, limits, policy revision, timeout, and retry policy. `Define` validates the declaration; a bound definition resolves the per-call model and tool context.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func WithName(name Name) Option`
- `func WithParticipation(participation Participation) Option`
- `func WithTimeout(timeout time.Duration) Option`
- `func WithLimits(limits Limits) Option`
- `func WithCurrentLoopModel() Option`
- `func WithNamedInference(client inference.Client, model model.Model) Option`
- `func WithSystemPrompt(prompt, revision string) Option`
- `func WithPolicyRevision(revision string) Option`
- `func WithOutputSchema(output inference.OutputSchema) Option`
- `func WithEvidenceTools(policy EvidenceToolPolicy) Option`
- `func WithRetryPolicy(policy RetryPolicy) Option`
- `func Define(opts ...Option) (Definition, error)`
- `func NewRecoverableTerminalValidationError() error`
- `func IsRecoverableTerminalValidationError(err error) bool`
- `func ReasonAllowed(stage Stage, reason ReasonCode) bool`

### Methods {#methods}

- `func (n Name) Validate() error`
- `func (p EvidenceToolPolicy) Clone() EvidenceToolPolicy`
- `func (d DefinitionDescriptor) Validate() error`
- `func (d Definition) Name() Name`
- `func (d Definition) Participation() Participation`
- `func (d Definition) Timeout() time.Duration`
- `func (d Definition) Limits() Limits`
- `func (d Definition) Descriptor() DefinitionDescriptor`
- `func (d Definition) PolicyRevision() string`
- `func (d Definition) RetryPolicy() RetryPolicy`
- `func (d Definition) EvidenceToolPolicy() (EvidenceToolPolicy, bool)`
- `func (d Definition) Bind(ctx context.Context, bindings Bindings) (BoundDefinition, error)`
- `func (b *boundDefinitionState) Name() Name`
- `func (b *boundDefinitionState) Participation() Participation`
- `func (b *boundDefinitionState) Timeout() time.Duration`
- `func (b *boundDefinitionState) Limits() Limits`
- `func (b *boundDefinitionState) Descriptor() DefinitionDescriptor`
- `func (b *boundDefinitionState) SystemPrompt() string`
- `func (b *boundDefinitionState) EvidenceToolPolicy() (EvidenceToolPolicy, bool)`
- `func (b *boundDefinitionState) RetryPolicy() RetryPolicy`
- `func (b *boundDefinitionState) BindEvidenceTools( ctx context.Context, bindings EvidenceBindings,) ([]BoundEvidenceTool, error)`
- `func (b *boundDefinitionState) OutputSchema() (*inference.OutputSchema, bool)`
- `func (b *boundDefinitionState) ResolveInference(ctx context.Context, loopID uuid.UUID) (InferenceBinding, error)`
- `func (e *DefinitionError) Error() string`
- `func (e *DefinitionError) Unwrap() error`
- `func (e *BindError) Error() string`
- `func (e *BindError) Unwrap() error`
- `func (e *ResolveError) Error() string`
- `func (e *ResolveError) Unwrap() error`
- `func (e *RevisionError) Error() string`
- `func (e *RevisionError) Unwrap() error`
- `func (b BoundEvidenceTool) Name() string`
- `func (b BoundEvidenceTool) DescriptionSHA256() [sha256.Size]byte`
- `func (b BoundEvidenceTool) SchemaSHA256() [sha256.Size]byte`
- `func (b BoundEvidenceTool) IdentitySHA256() [sha256.Size]byte`
- `func (b BoundEvidenceTool) Tool() tool.InvokableTool`
- `func (b BoundEvidenceTool) Info() *tool.ToolInfo`
- `func (s Stage) Valid() bool`
- `func (r ReasonCode) Valid() bool`
- `func (s TerminalStatus) Valid() bool`
- `func (p RetryPolicy) Valid() bool`
- `func (*recoverableTerminalValidationError) Error() string`

### Types {#types}

`Name`, `Participation`, `ModelSource`, `Limits`, `ToolLoopLimits`, `EvidenceToolPolicy`, `InferenceBinding`, `ModelResolver`, `Bindings`, `EvidenceBindings`, `DefinitionDescriptor`, `Option`, `Definition`, `BoundDefinition`, `DefinitionErrorKind`, `DefinitionError`, `BindErrorKind`, `BindError`, `ResolveErrorKind`, `ResolveError`, `RevisionError`, `BoundEvidenceTool`, `RunID`, `Stage`, `ReasonCode`, `TerminalStatus`, `RetryPolicy`, `Request`, `Result`, `Outcome`

### Constants {#constants}

`MaxEvidenceToolDefinitions`, `MaxEvidenceProducedToolNames`, `MaxEvidenceToolNameBytes`, `MaxEvidenceToolPolicyRevisionBytes`, `ParticipationUnknown`, `ParticipationBlocking`, `ParticipationBackground`, `ModelSourceUnknown`, `ModelSourceCurrentLoop`, `ModelSourceNamed`, `DefinitionMissingName`, `DefinitionReservedName`, `DefinitionNilOption`, `DefinitionDuplicateOption`, `DefinitionInvalidParticipation`, `DefinitionInvalidModelSource`, `DefinitionMissingModelSource`, `DefinitionInvalidClient`, `DefinitionInvalidModel`, `DefinitionInvalidTimeout`, `DefinitionInvalidLimits`, `DefinitionInvalidSystemPrompt`, `DefinitionInvalidPromptRevision`, `DefinitionMissingPolicyRevision`, `DefinitionInvalidPolicyRevision`, `DefinitionInvalidOutputSchema`, `DefinitionInvalidEvidenceTools`, `DefinitionInvalidRetryPolicy`, `BindInvalidDefinition`, `BindInvalidContext`, `BindMissingModelResolver`, `BindInvalidEvidenceTools`, `ResolveInvalidContext`, `ResolveInvalidLoopID`, `ResolveModelFailed`, `ResolveInvalidBinding`, `MaxEvidenceToolDescriptionBytes`, `MaxEvidenceToolSchemaBytes`, `MaxEvidenceToolMetadataBytes`, `StageUnknown`, `StageQueue`, `StageModelResolution`, `StageInference`, `StageOutput`, `StageTerminal`, `StageFinalization`, `ReasonUnknown`, `ReasonRejected`, `ReasonCanceled`, `ReasonTimeout`, `ReasonModelResolution`, `ReasonInference`, `ReasonInvalidOutput`, `ReasonTerminal`, `ReasonFinalization`, `ReasonInternal`, `TerminalStatusUnknown`, `TerminalStatusCompleted`, `TerminalStatusFailed`, `RetryPolicyNone`, `RetryPolicyClassifiedOnce`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DefinitionError`, `BindError`, `ResolveError`, `RevisionError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/hustle/definition.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/definition.go)
- [pkg/hustle/definition_errors.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/definition_errors.go)
- [pkg/hustle/evidence.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/evidence.go)
- [pkg/hustle/run.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/run.go)

Adjacent tests at the same commit:

- [pkg/hustle/definition_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/definition_test.go)
- [pkg/hustle/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/deps_test.go)
- [pkg/hustle/descriptor_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/descriptor_test.go)
- [pkg/hustle/evidence_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/evidence_test.go)
- [pkg/hustle/run_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/hustle/run_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
