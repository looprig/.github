---
id: reference/packages/harness/gate
title: gate package · gate
description: Reference for Harness access evaluation, permission review, approval, and gate payload contracts.
audience: developer
section: reference
order: 143
publication: released
examples:
  - stage-12-gate-rules
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

# gate package · gate

Import path: `github.com/looprig/harness/pkg/gate`. The source is pinned to github.com/looprig/harness@v0.24.2.

## Package role {#package-role}

The package evaluates normalized requirements against structural access sources, rules, and optional approvers. It combines unmet gated requirements into one approval and carries review context, classifier assessments, and audit data without importing Sandbox or a concrete tool module.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewAccessBindings(bindings []AccessBinding) (AccessBindings, error)`
- `func NewInteractiveEvaluator(bindings []AccessBinding, matcher RuleMatcher, approver Approver, writer RuleWriter, issuer GrantIssuer) (*Evaluator, error)`
- `func NewHeadlessEvaluator(bindings []AccessBinding, matcher RuleMatcher, issuer GrantIssuer) (*Evaluator, error)`
- `func ValidateFormSchema(schema PromptSchema) error`
- `func ParseFormAnswers(schema PromptSchema, values map[string]json.RawMessage) (map[string]string, error)`
- `func ValidateFormAuditBounds(audit FormAudit) error`
- `func NewFormAudit(schema PromptSchema, answers map[string]string) FormAudit`
- `func DecodeRequest(data []byte) (tool.Request, error)`
- `func MarshalPayload(payload Payload) ([]byte, error)`
- `func UnmarshalPayload(data []byte) (Payload, error)`
- `func ApprovalControls() []Control`
- `func DecodeApprovalAction(data []byte) (ApprovalAction, error)`
- `func ParseApprovalAction(s string) (ApprovalAction, bool)`
- `func MarshalResponseAudit(audit ResponseAudit) ([]byte, error)`
- `func UnmarshalResponseAudit(data []byte) (ResponseAudit, error)`
- `func ParseReviewRisk(value string) (ReviewRisk, bool)`
- `func ParseReviewAuthorization(value string) (ReviewAuthorization, bool)`
- `func ParseReviewRecommendation(value string) (ReviewRecommendation, bool)`
- `func ParseReviewStatus(value string) (ReviewStatus, bool)`
- `func ParseReviewRiskCategory(value string) (ReviewRiskCategory, bool)`
- `func ValidateReviewCategories(categories []ReviewRiskCategory) error`
- `func ParseReviewContextOrigin(value string) (ReviewContextOrigin, bool)`
- `func ParseReviewContextKind(value string) (ReviewContextKind, bool)`
- `func BuildReviewContext(input ReviewContext, policy ReviewContextPolicy) (ReviewContext, error)`
- `func ParseReviewDecisionReason(value string) (ReviewDecisionReason, bool)`
- `func NewPermissionReviewPolicy(revision string, maximum ReviewRisk, minimum map[ReviewRisk]ReviewAuthorization, absoluteHuman []ReviewRiskCategory, material ReviewTruncationMask) (PermissionReviewPolicy, error)`
- `func DefaultPermissionReviewPolicy(revision string) (PermissionReviewPolicy, error)`
- `func EvaluatePermissionAssessment(policy PermissionReviewPolicy, subject PermissionReviewSubject, assessment PermissionAssessment) ReviewDecision`
- `func NewPermissionReviewSubject(basis ReviewBasis, request tool.Request, context ReviewContext) (PermissionReviewSubject, error)`
- `func SubjectDigest(subject PermissionReviewSubject) ([32]byte, error)`
- `func CombinePermissionAssessments(policy PermissionReviewPolicy, classifiers PermissionClassifierSet, outcomes []PermissionAssessmentOutcome) ReviewDecision`
- `func ValidatePermissionClassifierName(name hustle.Name) error`
- `func NewPermissionClassifierSet(classifiers ...PermissionClassifier) (PermissionClassifierSet, error)`
- `func ValidateGate(g Gate) error`
- `func ValidateOpenURLPayload(p OpenURLPayload) error`

### Methods {#methods}

- `func (e *AccessError) Error() string`
- `func (e *AccessError) Unwrap() error`
- `func (b AccessBindings) AccessFor(requirement tool.Requirement) (uint8, error)`
- `func (e *EvaluationError) Error() string`
- `func (e *EvaluationError) Unwrap() error`
- `func (e *Evaluator) Interactive() bool`
- `func (e *Evaluator) Authorize(ctx context.Context, request tool.Request) (Resolution, error)`
- `func (e *Evaluator) Evaluate(ctx context.Context, request tool.Request) (Evaluation, error)`
- `func (e *Evaluator) Resolve(ctx context.Context, evaluation Evaluation, action ApprovalAction) (Resolution, error)`
- `func (e *FormSchemaError) Error() string`
- `func (e *FormAnswerError) Error() string`
- `func (e *FormAuditError) Error() string`
- `func (o ObservationRequirement) Valid() bool`
- `func (e *UnknownPayloadKindError) Error() string`
- `func (e *NilPayloadError) Error() string`
- `func (e *PayloadEncodeError) Error() string`
- `func (e *PayloadEncodeError) Unwrap() error`
- `func (e *PayloadDecodeError) Error() string`
- `func (e *PayloadDecodeError) Unwrap() error`
- `func (e *RequestDecodeError) Error() string`
- `func (e *RequestDecodeError) Unwrap() error`
- `func (p ResponsePolicy) EffectiveAction() PolicyAction`
- `func (e *ApprovalActionDecodeError) Error() string`
- `func (e *ApprovalActionDecodeError) Unwrap() error`
- `func (e *UnknownResponseAuditKindError) Error() string`
- `func (e *NilResponseAuditError) Error() string`
- `func (e *ResponseAuditEncodeError) Error() string`
- `func (e *ResponseAuditEncodeError) Unwrap() error`
- `func (e *ResponseAuditDecodeError) Error() string`
- `func (e *ResponseAuditDecodeError) Unwrap() error`
- `func (e *ReviewValidationError) Error() string`
- `func (c ReviewContext) Clone() ReviewContext`
- `func (r ReviewDecisionReason) Valid() bool`
- `func (p PermissionReviewPolicy) Sealed() bool`
- `func (s PermissionReviewSubject) Clone() PermissionReviewSubject`
- `func (*PermissionClassifierValidationError) Error() string`
- `func (*PermissionClassifierNameValidationError) Error() string`
- `func (e *PermissionClassifierPanicError) Error() string`
- `func (s PermissionClassifierSet) Classifiers() []PermissionClassifier`
- `func (e *GateValidationError) Error() string`
- `func (e *GateValidationError) Unwrap() error`
- `func (e *OpenURLPayloadError) Error() string`
- `func (e *DisplayOriginError) Error() string`

### Types {#types}

```go
type AccessSource interface {
	AccessVersion() uint16
	AccessFor(kind, scope string) (uint8, error)
}
```

```go
type AccessBinding struct {
	Kind   string
	Source AccessSource
}
```

```go
type AccessErrorKind string
```

```go
type AccessError struct {
	Kind        AccessErrorKind
	Requirement string
	Cause       error
}
```

```go
type AccessBindings struct {
	// contains filtered or unexported fields
}
```

```go
type RuleMatcher interface {
	MatchesDeny(context.Context, tool.Requirement) (bool, error)
	MatchesAllow(context.Context, tool.Requirement) (bool, error)
}
```

```go
type RuleWriter interface {
	WriteRules(context.Context, []tool.RuleCandidate) error
}
```

```go
type GrantIssuer interface {
	GrantVersion() uint16
	IssueGrant(ctx context.Context, executionID, command, cwd, kind, scope, class, target string, expiryUnixMilli int64) (string, error)
}
```

```go
type Evaluation struct {
	Denied     []tool.Requirement
	Unmet      []tool.Requirement
	Candidates []tool.RuleCandidate
	// contains filtered or unexported fields
}
```

```go
type DenialReason string
```

```go
type Resolution struct {
	Approved          bool         `json:"approved"`
	Grants            []string     `json:"-"`
	Denial            DenialReason `json:"-"`
	DenialDescription string       `json:"-"`
}
```

```go
type ApprovalPrompt struct {
	Request    tool.Request
	Unmet      []tool.Requirement
	Candidates []tool.RuleCandidate
}
```

```go
type Approver interface {
	RequestApproval(ctx context.Context, prompt ApprovalPrompt) (ApprovalAction, error)
}
```

```go
type Evaluator struct {
	// contains filtered or unexported fields
}
```

```go
type EvaluationErrorKind string
```

```go
type EvaluationError struct {
	Kind        EvaluationErrorKind
	Requirement string
	Cause       error
}
```

```go
type EvidenceAccessEvaluator interface {
	AccessFor(tool.Requirement) (uint8, error)
}
```

```go
type EvidenceContainmentPolicy struct {
	ReadRoot        string
	SecurityCeiling string
}
```

```go
type EvidenceContainmentVerifier interface {
	VerifyEvidenceContainment(ctx context.Context, policy EvidenceContainmentPolicy, request tool.Request) error
}
```

```go
type FormSchemaErrorKind string
```

```go
type FormSchemaError struct {
	Kind  FormSchemaErrorKind
	Field string
}
```

```go
type FormAnswerErrorKind string
```

```go
type FormAnswerError struct {
	Kind  FormAnswerErrorKind
	Field string
}
```

```go
type FormAuditErrorKind string
```

```go
type FormAuditError struct {
	Kind  FormAuditErrorKind
	Field string
}
```

```go
type ID = uuid.UUID
```

```go
type Kind string
```

```go
type ResolverKind string
```

```go
type Blocks string
```

```go
type Effect string
```

```go
type CloseReason string
```

```go
type Criticality string
```

```go
type Subject struct {
	ToolExecutionID ID     `json:"tool_execution_id,omitzero"`
	ToolUseID       string `json:"tool_use_id,omitempty"`
	TurnID          ID     `json:"turn_id,omitzero"`
	StepID          ID     `json:"step_id,omitzero"`
	InputID         ID     `json:"input_id,omitzero"`
}
```

```go
type Route struct {
	GateID          ID `json:"gate_id,omitzero"`
	LoopID          ID `json:"loop_id,omitzero"`
	ToolExecutionID ID `json:"tool_execution_id,omitzero"`
}
```

```go
type Gate struct {
	ID             ID             `json:"id,omitzero"`
	Kind           Kind           `json:"kind,omitempty"`
	Resolver       ResolverKind   `json:"resolver,omitempty"`
	Blocks         Blocks         `json:"blocks,omitempty"`
	Effect         Effect         `json:"effect,omitempty"`
	Criticality    Criticality    `json:"criticality,omitempty"`
	Subject        Subject        `json:"subject,omitzero"`
	Prompt         Prompt         `json:"prompt,omitzero"`
	ResponsePolicy ResponsePolicy `json:"response_policy,omitzero"`
	Restorable     bool           `json:"restorable,omitzero"`
}
```

```go
type ObservationRequirement struct {
	Target string
	Token  string
}
```

```go
type EvidenceObservationVerifier interface {
	VerifyEvidenceObservations(ctx context.Context, policy EvidenceContainmentPolicy, requirements []ObservationRequirement) error
}
```

```go
type Payload interface {
	payload()
}
```

```go
type OpenPayload struct {
	GateID  ID      `json:"gate_id,omitzero"`
	Payload Payload `json:"payload,omitempty"`
}
```

```go
type PermissionPayload struct {
	Request tool.Request `json:"request,omitzero"`
}
```

```go
type AskUserPayload struct {
	Question string   `json:"question,omitempty"`
	Choices  []string `json:"choices,omitempty"`
}
```

```go
type ResumeInputPayload struct {
	InputID uuid.UUID `json:"input_id,omitzero"`
	Preview string    `json:"preview,omitempty"`
}
```

```go
type FormPayload struct {
	Title  string       `json:"title,omitempty"`
	Body   string       `json:"body,omitempty"`
	Schema PromptSchema `json:"schema,omitzero"`
}
```

```go
type OpenURLPayload struct {
	DisplayOrigin string `json:"display_origin,omitempty"`

	URL                string `json:"-"`
	RequiresCompletion bool   `json:"requires_completion,omitzero"`
}
```

```go
type UnknownPayloadKindError struct {
	Kind string
}
```

```go
type NilPayloadError struct{}
```

```go
type PayloadEncodeError struct {
	Kind  string
	Cause error
}
```

```go
type PayloadDecodeError struct {
	Kind  string
	Cause error
}
```

```go
type RequestDecodeError struct{ Cause error }
```

```go
type PolicyAction string
```

```go
type ResponsePolicy struct {
	Timeout time.Duration `json:"timeout,omitzero"`

	OnTimeout PolicyAction `json:"on_timeout,omitempty"`

	Response ResponseTemplate `json:"response,omitzero"`

	ModelDecision ModelDecisionPolicy `json:"model_decision,omitzero"`
}
```

```go
type ResponseTemplate struct {
	Action string                     `json:"action,omitempty"`
	Values map[string]json.RawMessage `json:"values,omitempty"`
}
```

```go
type ModelDecisionPolicy struct {
	Prompt         string           `json:"prompt,omitempty"`
	AllowedActions []string         `json:"allowed_actions,omitempty"`
	Default        ResponseTemplate `json:"default,omitzero"`
	Metadata       json.RawMessage  `json:"metadata,omitempty"`
}
```

```go
type FieldKind string
```

```go
type Prompt struct {
	Title string `json:"title,omitempty"`
	Body  string `json:"body,omitempty"`

	Origin   string       `json:"origin,omitempty"`
	Schema   PromptSchema `json:"schema,omitzero"`
	Controls []Control    `json:"controls,omitempty"`
}
```

```go
type Control struct {
	Action string `json:"action,omitempty"`
	Label  string `json:"label,omitempty"`
}
```

```go
type Field struct {
	Name     string          `json:"name,omitempty"`
	Label    string          `json:"label,omitempty"`
	Kind     FieldKind       `json:"kind,omitempty"`
	Required bool            `json:"required,omitzero"`
	Options  []Option        `json:"options,omitempty"`
	Default  json.RawMessage `json:"default,omitempty"`
}
```

```go
type Option struct {
	Value string `json:"value,omitempty"`
	Label string `json:"label,omitempty"`
}
```

```go
type PromptSchema struct {
	Fields []Field `json:"fields,omitempty"`
}
```

```go
type ApprovalAction string
```

```go
type ApprovalActionDecodeError struct{ Cause error }
```

```go
type ResponseSourceKind string
```

```go
type ResponseRequest struct {
	Action string                     `json:"action,omitempty"`
	Values map[string]json.RawMessage `json:"values,omitempty"`
}
```

```go
type GateResponse struct {
	GateID ID                         `json:"gate_id,omitzero"`
	Action string                     `json:"action,omitempty"`
	Values map[string]json.RawMessage `json:"values,omitempty"`
	Source ResponseSource             `json:"source,omitzero"`
}
```

```go
type Answer struct {
	GateID ID
	Action string

	Values map[string]string
	Source ResponseSource
}
```

```go
type ResponseSource struct {
	Kind   ResponseSourceKind `json:"kind,omitempty"`
	Reason string             `json:"reason,omitempty"`
}
```

```go
type ResponseAudit interface {
	responseAudit()
}
```

```go
type PermissionAudit struct {
	RequirementDescriptions []string `json:"requirement_descriptions,omitempty"`
	CandidateDescriptions   []string `json:"candidate_descriptions,omitempty"`
}
```

```go
type AskUserAudit struct {
	AnswerPreview string `json:"answer_preview,omitempty"`
}
```

```go
type FormAudit struct {
	Values map[string]string `json:"values,omitempty"`
}
```

```go
type UnknownResponseAuditKindError struct {
	Kind string
}
```

```go
type NilResponseAuditError struct{}
```

```go
type ResponseAuditEncodeError struct {
	Kind  string
	Cause error
}
```

```go
type ResponseAuditDecodeError struct {
	Kind  string
	Cause error
}
```

```go
type ReviewRisk string
```

```go
type ReviewAuthorization string
```

```go
type ReviewRecommendation string
```

```go
type ReviewStatus string
```

```go
type ReviewRiskCategory string
```

```go
type ReviewValidationField string
```

```go
type ReviewValidationReason string
```

```go
type ReviewValidationError struct {
	Field  ReviewValidationField
	Reason ReviewValidationReason
}
```

```go
type ReviewContextOrigin string
```

```go
type ReviewContextKind string
```

```go
type ReviewContextEntry struct {
	Origin    ReviewContextOrigin
	Kind      ReviewContextKind
	Content   string
	Truncated bool
}
```

```go
type ReviewContext struct {
	Coordinates        identity.Coordinates
	ContextRevision    string
	WorkspaceRoot      string
	WorkingDirectory   string
	RetryReason        string
	SecurityCeiling    string
	GatePolicyRevision string
	Entries            []ReviewContextEntry
	Truncation         ReviewTruncation
}
```

```go
type ReviewContextPolicy struct {
	Revision             string
	MaxBytes             int
	MaxEstimatedTokens   int
	MaxEntries           int
	MaxUserEntryBytes    int
	MaxAgentEntryBytes   int
	MaxToolEntryBytes    int
	MaxBlockBytes        int
	MaxActiveActionBytes int
}
```

```go
type ReviewTruncationMask uint16
```

```go
type ReviewTruncation struct {
	Applied        ReviewTruncationMask
	Material       ReviewTruncationMask
	OmittedEntries int
	OmittedBytes   int
}
```

```go
type PermissionAssessment struct {
	Basis          ReviewBasis
	Risk           ReviewRisk
	Authorization  ReviewAuthorization
	Categories     []ReviewRiskCategory
	Recommendation ReviewRecommendation
	Rationale      string
}
```

```go
type PermissionReviewPolicy struct {
	Revision             string
	MaximumAutoRisk      ReviewRisk
	MinimumAuthorization map[ReviewRisk]ReviewAuthorization
	AbsoluteHuman        []ReviewRiskCategory
	MaterialTruncation   ReviewTruncationMask
	// contains filtered or unexported fields
}
```

```go
type ReviewDecisionReason string
```

```go
type ReviewDecision struct {
	Eligible bool
	Reason   ReviewDecisionReason
}
```

```go
type ReviewBasis struct {
	GateID             ID       `json:"gate_id"`
	ToolExecutionID    ID       `json:"tool_execution_id"`
	SubjectDigest      [32]byte `json:"subject_digest"`
	ContextRevision    string   `json:"context_revision"`
	GatePolicyRevision string   `json:"gate_policy_revision"`
	ClassifierRevision string   `json:"classifier_revision"`
	SecurityCeiling    string   `json:"security_ceiling"`
}
```

```go
type PermissionReviewSubject struct {
	Basis   ReviewBasis   `json:"basis"`
	Request tool.Request  `json:"request"`
	Context ReviewContext `json:"context"`
}
```

```go
type PermissionAssessmentOutcome struct {
	Subject      PermissionReviewSubject
	Applicable   bool
	Status       ReviewStatus
	Assessment   PermissionAssessment
	Observations []ObservationRequirement
}
```

```go
type PermissionClassifier interface {
	Name() hustle.Name
	Revision() string
	Definition() hustle.Definition
	Applies(PermissionReviewSubject) bool
	MarshalInput(PermissionReviewSubject) (json.RawMessage, error)
	ValidateResult(PermissionReviewSubject, hustle.Result) (PermissionAssessment, error)
}
```

```go
type PermissionClassifierSet struct {
	// contains filtered or unexported fields
}
```

```go
type PermissionClassifierValidationReason string
```

```go
type PermissionClassifierValidationError struct {
	Index  int
	Reason PermissionClassifierValidationReason
}
```

```go
type PermissionClassifierNameValidationError struct{}
```

```go
type PermissionClassifierPanicMethod string
```

```go
type PermissionClassifierPanicError struct {
	Method PermissionClassifierPanicMethod
}
```

```go
type GateValidationErrorKind string
```

```go
type GateValidationError struct {
	Kind     GateValidationErrorKind
	GateKind Kind
	Cause    error
}
```

```go
type OpenURLPayloadErrorKind string
```

```go
type OpenURLPayloadError struct {
	Kind OpenURLPayloadErrorKind
}
```

```go
type DisplayOriginError struct {
	// contains filtered or unexported fields
}
```

### Constants {#constants}

`CurrentAccessVersion`, `AccessDeny`, `AccessGated`, `AccessAllow`, `AccessKindInvalid`, `AccessSourceMissing`, `AccessSourceDuplicate`, `AccessSourceNil`, `AccessVersionUnsupported`, `AccessValueInvalid`, `AccessSourceFailed`, `CurrentGrantVersion`, `DenialUnspecified`, `DenialStructural`, `DenialRefused`, `EvaluationRuleMatchFailed`, `EvaluationDenied`, `EvaluationActionInvalid`, `EvaluationApproverMissing`, `EvaluationApprovalRequired`, `EvaluationApprovalFailed`, `EvaluationWriterMissing`, `EvaluationWriteFailed`, `EvaluationIssuerMissing`, `EvaluationGrantVersionUnsupported`, `EvaluationGrantFailed`, `FormActionAccept`, `FormActionDecline`, `FormActionCancel`, `FormSchemaEmpty`, `FormSchemaTooManyFields`, `FormSchemaFieldNameEmpty`, `FormSchemaFieldNameTooLong`, `FormSchemaFieldNameDuplicate`, `FormSchemaFieldKindUnsupported`, `FormSchemaFieldOptionsInvalid`, `FormAnswerUnknownField`, `FormAnswerMissingRequired`, `FormAnswerTypeInvalid`, `FormAnswerTooLong`, `FormAnswerOptionNotAllowed`, `FormAuditTooManyValues`, `FormAuditFieldNameTooLong`, `FormAuditValueTooLong`, `KindPermission`, `KindAskUser`, `KindForm`, `KindOpenURL`, `ResolverLoop`, `ResolverSession`, `BlocksToolCall`, `BlocksSession`, `EffectResume`, `EffectInitiate`, `EffectControl`, `CloseAnswered`, `ClosePolicyResponse`, `CloseAbandoned`, `CloseOwnerClosed`, `CloseRestoreUnavailable`, `GateCritical`, `GateNonCritical`, `MaxObservationRequirementTargetBytes`, `MaxObservationRequirementTokenBytes`, `MaxObservationRequirementsPerAssessment`, `PolicyWait`, `PolicyRespond`, `PolicySuspendSession`, `PolicyModelDecide`, `FieldText`, `FieldSelect`, `FieldMultiSelect`, `FieldConfirm`, `ApprovalApprove`, `ApprovalApproveAlwaysWorkspace`, `ApprovalDeny`, `ResponseFromUser`, `ResponseFromPolicy`, `ResponseFromModel`, `ResponseFromClassifier`, `ReviewRiskLow`, `ReviewRiskMedium`, `ReviewRiskHigh`, `ReviewRiskCritical`, `ReviewAuthorizationUnknown`, `ReviewAuthorizationLow`, `ReviewAuthorizationMedium`, `ReviewAuthorizationHigh`, `ReviewAllow`, `ReviewNeedsHuman`, `ReviewStatusAllowed`, `ReviewStatusNeedsHuman`, `ReviewStatusNotApplicable`, `ReviewStatusTimedOut`, `ReviewStatusFailed`, `ReviewStatusCancelled`, `ReviewStatusStale`, `ReviewCategoryDataExfiltration`, `ReviewCategoryCredentialAccess`, `ReviewCategoryCredentialProbing`, `ReviewCategoryDestructiveLocal`, `ReviewCategoryDestructiveShared`, `ReviewCategoryPersistentSecurityWeakening`, `ReviewCategoryProductionMutation`, `ReviewCategoryProtectedSourceControl`, `ReviewCategoryUntrustedCodeExecution`, `ReviewCategoryMutableNetwork`, `ReviewCategoryPromptInjection`, `ReviewCategoryAuthorizationConflict`, `ReviewCategoryTargetAmbiguity`, `ReviewCategoryInsufficientEvidence`, `MaxReviewCategories`, `ReviewValidationFieldCategories`, `ReviewValidationUnsupported`, `ReviewValidationDuplicate`, `ReviewValidationTooMany`, `ReviewContextOriginUser`, `ReviewContextOriginAssistant`, `ReviewContextOriginTool`, `ReviewContextOriginRuntime`, `ReviewContextOriginExternal`, `ReviewContextOriginOmission`, `ReviewContextKindUserMessage`, `ReviewContextKindAssistantMessage`, `ReviewContextKindAssistantToolRequest`, `ReviewContextKindToolResult`, `ReviewContextKindRuntimeContext`, `ReviewContextKindExternalContent`, `ReviewContextKindOmission`, `MaxReviewContextInputEntries`, `MaxReviewContextInputBytes`, `MaxReviewContextEntryInputBytes`, `MaxReviewContextRootFieldBytes`, `ReviewTruncationUserEntry`, `ReviewTruncationAssistantEntry`, `ReviewTruncationToolEntry`, `ReviewTruncationBlock`, `ReviewTruncationEntryCount`, `ReviewTruncationTotalBytes`, `ReviewTruncationEstimatedTokens`, `ReviewTruncationActiveAction`, `SupportedReviewTruncationMask`, `ReviewValidationFieldContext`, `ReviewValidationFieldContextEntry`, `ReviewValidationFieldContextPolicy`, `ReviewValidationRequired`, `ReviewValidationInvalid`, `ReviewValidationOutOfBounds`, `ReviewValidationReserved`, `MaxPermissionReviewRationaleBytes`, `MaxPermissionReviewPolicyRevisionBytes`, `MaxPermissionClassifierRevisionBytes`, `ReviewDecisionEligible`, `ReviewDecisionInvalidPolicy`, `ReviewDecisionInvalidAssessment`, `ReviewDecisionBasisMismatch`, `ReviewDecisionRecommendation`, `ReviewDecisionRiskCeiling`, `ReviewDecisionAuthorization`, `ReviewDecisionAbsoluteHuman`, `ReviewDecisionMaterialTruncation`, `ReviewDecisionNoApplicableClassifier`, `ReviewDecisionClassifierStatus`, `ReviewValidationFieldBasis`, `ReviewValidationFieldDigest`, `ReviewValidationFieldRequest`, `ReviewValidationFieldWire`, `ReviewValidationMismatch`, `MaxPermissionReviewRequestRequirements`, `MaxPermissionReviewRequestCandidates`, `MaxPermissionReviewRequestStringBytes`, `MaxPermissionReviewRequestInputBytes`, `MaxPermissionReviewSubjectWireBytes`, `MaxPermissionClassifierNameBytes`, `PermissionClassifierInvalid`, `PermissionClassifierDuplicate`, `PermissionClassifierPanicMarshalInput`, `PermissionClassifierPanicValidateResult`, `GateRestorableNotAllowed`, `GateOriginInvalid`, `OpenURLTargetMissing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AccessError`, `ApprovalActionDecodeError`, `DisplayOriginError`, `EvaluationError`, `FormAnswerError`, `FormAuditError`, `FormSchemaError`, `GateValidationError`, `NilPayloadError`, `NilResponseAuditError`, `OpenURLPayloadError`, `PayloadDecodeError`, `PayloadEncodeError`, `PermissionClassifierNameValidationError`, `PermissionClassifierPanicError`, `PermissionClassifierValidationError`, `RequestDecodeError`, `ResponseAuditDecodeError`, `ResponseAuditEncodeError`, `ReviewValidationError`, `UnknownPayloadKindError`, `UnknownResponseAuditKindError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/gate/access.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/access.go)
- [pkg/gate/evaluator.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evaluator.go)
- [pkg/gate/evidence.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evidence.go)
- [pkg/gate/form.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/form.go)
- [pkg/gate/gate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/gate.go)
- [pkg/gate/observation.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/observation.go)
- [pkg/gate/payload.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/payload.go)
- [pkg/gate/policy.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/policy.go)
- [pkg/gate/prompt.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/prompt.go)
- [pkg/gate/response.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/response.go)
- [pkg/gate/response_audit.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/response_audit.go)
- [pkg/gate/review.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review.go)
- [pkg/gate/review_context.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_context.go)
- [pkg/gate/review_policy.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_policy.go)
- [pkg/gate/review_subject.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_subject.go)
- [pkg/gate/review_wire.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_wire.go)
- [pkg/gate/reviewer.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/reviewer.go)
- [pkg/gate/validate.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/validate.go)

Adjacent tests at the same commit:

- [pkg/gate/access_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/access_test.go)
- [pkg/gate/deps_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/deps_test.go)
- [pkg/gate/evaluator_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/evaluator_test.go)
- [pkg/gate/example_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/example_test.go)
- [pkg/gate/form_audit_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/form_audit_test.go)
- [pkg/gate/form_payload_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/form_payload_test.go)
- [pkg/gate/fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/fuzz_test.go)
- [pkg/gate/gate_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/gate_test.go)
- [pkg/gate/interaction_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/interaction_test.go)
- [pkg/gate/observation_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/observation_test.go)
- [pkg/gate/openurl_payload_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/openurl_payload_test.go)
- [pkg/gate/payload_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/payload_test.go)
- [pkg/gate/permission_payload_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/permission_payload_test.go)
- [pkg/gate/prompt_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/prompt_test.go)
- [pkg/gate/response_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/response_test.go)
- [pkg/gate/review_context_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_context_fuzz_test.go)
- [pkg/gate/review_context_internal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_context_internal_test.go)
- [pkg/gate/review_context_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_context_test.go)
- [pkg/gate/review_context_testbridge_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_context_testbridge_test.go)
- [pkg/gate/review_fuzz_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_fuzz_test.go)
- [pkg/gate/review_policy_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_policy_test.go)
- [pkg/gate/review_subject_internal_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_subject_internal_test.go)
- [pkg/gate/review_subject_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_subject_test.go)
- [pkg/gate/review_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_test.go)
- [pkg/gate/review_wire_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/review_wire_test.go)
- [pkg/gate/reviewer_test.go](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/gate/reviewer_test.go)

Run `GOWORK=off go test ./...` from the `harness` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
