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
- `func NewPermissionReviewPolicy( revision string, maximum ReviewRisk, minimum map[ReviewRisk]ReviewAuthorization, absoluteHuman []ReviewRiskCategory, material ReviewTruncationMask,) (PermissionReviewPolicy, error)`
- `func DefaultPermissionReviewPolicy(revision string) (PermissionReviewPolicy, error)`
- `func EvaluatePermissionAssessment( policy PermissionReviewPolicy, subject PermissionReviewSubject, assessment PermissionAssessment,) ReviewDecision`
- `func NewPermissionReviewSubject( basis ReviewBasis, request tool.Request, context ReviewContext,) (PermissionReviewSubject, error)`
- `func SubjectDigest(subject PermissionReviewSubject) ([32]byte, error)`
- `func CombinePermissionAssessments( policy PermissionReviewPolicy, classifiers PermissionClassifierSet, outcomes []PermissionAssessmentOutcome,) ReviewDecision`
- `func ValidatePermissionClassifierName(name hustle.Name) error`
- `func NewPermissionClassifierSet( classifiers ...PermissionClassifier,) (PermissionClassifierSet, error)`
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
- `func (c *frozenPermissionClassifier) Name() hustle.Name`
- `func (c *frozenPermissionClassifier) Revision() string`
- `func (c *frozenPermissionClassifier) Definition() hustle.Definition`
- `func (c *frozenPermissionClassifier) Applies(subject PermissionReviewSubject) bool`
- `func (c *frozenPermissionClassifier) MarshalInput( subject PermissionReviewSubject,) (raw json.RawMessage, err error)`
- `func (c *frozenPermissionClassifier) ValidateResult( subject PermissionReviewSubject, result hustle.Result,) (assessment PermissionAssessment, err error)`
- `func (s PermissionClassifierSet) Classifiers() []PermissionClassifier`
- `func (e *GateValidationError) Error() string`
- `func (e *GateValidationError) Unwrap() error`
- `func (e *OpenURLPayloadError) Error() string`
- `func (e *DisplayOriginError) Error() string`

### Types {#types}

`AccessSource`, `AccessBinding`, `AccessErrorKind`, `AccessError`, `AccessBindings`, `RuleMatcher`, `RuleWriter`, `GrantIssuer`, `Evaluation`, `DenialReason`, `Resolution`, `ApprovalPrompt`, `Approver`, `Evaluator`, `EvaluationErrorKind`, `EvaluationError`, `EvidenceAccessEvaluator`, `EvidenceContainmentPolicy`, `EvidenceContainmentVerifier`, `FormSchemaErrorKind`, `FormSchemaError`, `FormAnswerErrorKind`, `FormAnswerError`, `FormAuditErrorKind`, `FormAuditError`, `ID`, `Kind`, `ResolverKind`, `Blocks`, `Effect`, `CloseReason`, `Criticality`, `Subject`, `Route`, `Gate`, `ObservationRequirement`, `EvidenceObservationVerifier`, `Payload`, `OpenPayload`, `PermissionPayload`, `AskUserPayload`, `ResumeInputPayload`, `FormPayload`, `OpenURLPayload`, `UnknownPayloadKindError`, `NilPayloadError`, `PayloadEncodeError`, `PayloadDecodeError`, `RequestDecodeError`, `PolicyAction`, `ResponsePolicy`, `ResponseTemplate`, `ModelDecisionPolicy`, `FieldKind`, `Prompt`, `Control`, `Field`, `Option`, `PromptSchema`, `ApprovalAction`, `ApprovalActionDecodeError`, `ResponseSourceKind`, `ResponseRequest`, `GateResponse`, `Answer`, `ResponseSource`, `ResponseAudit`, `PermissionAudit`, `AskUserAudit`, `FormAudit`, `UnknownResponseAuditKindError`, `NilResponseAuditError`, `ResponseAuditEncodeError`, `ResponseAuditDecodeError`, `ReviewRisk`, `ReviewAuthorization`, `ReviewRecommendation`, `ReviewStatus`, `ReviewRiskCategory`, `ReviewValidationField`, `ReviewValidationReason`, `ReviewValidationError`, `ReviewContextOrigin`, `ReviewContextKind`, `ReviewContextEntry`, `ReviewContext`, `ReviewContextPolicy`, `ReviewTruncationMask`, `ReviewTruncation`, `PermissionAssessment`, `PermissionReviewPolicy`, `ReviewDecisionReason`, `ReviewDecision`, `ReviewBasis`, `PermissionReviewSubject`, `PermissionAssessmentOutcome`, `PermissionClassifier`, `PermissionClassifierSet`, `PermissionClassifierValidationReason`, `PermissionClassifierValidationError`, `PermissionClassifierNameValidationError`, `PermissionClassifierPanicMethod`, `PermissionClassifierPanicError`, `GateValidationErrorKind`, `GateValidationError`, `OpenURLPayloadErrorKind`, `OpenURLPayloadError`, `DisplayOriginError`

### Constants {#constants}

`CurrentAccessVersion`, `AccessDeny`, `AccessGated`, `AccessAllow`, `AccessKindInvalid`, `AccessSourceMissing`, `AccessSourceDuplicate`, `AccessSourceNil`, `AccessVersionUnsupported`, `AccessValueInvalid`, `AccessSourceFailed`, `CurrentGrantVersion`, `DenialUnspecified`, `DenialStructural`, `DenialRefused`, `EvaluationRuleMatchFailed`, `EvaluationDenied`, `EvaluationActionInvalid`, `EvaluationApproverMissing`, `EvaluationApprovalRequired`, `EvaluationApprovalFailed`, `EvaluationWriterMissing`, `EvaluationWriteFailed`, `EvaluationIssuerMissing`, `EvaluationGrantVersionUnsupported`, `EvaluationGrantFailed`, `FormActionAccept`, `FormActionDecline`, `FormActionCancel`, `FormSchemaEmpty`, `FormSchemaTooManyFields`, `FormSchemaFieldNameEmpty`, `FormSchemaFieldNameTooLong`, `FormSchemaFieldNameDuplicate`, `FormSchemaFieldKindUnsupported`, `FormSchemaFieldOptionsInvalid`, `FormAnswerUnknownField`, `FormAnswerMissingRequired`, `FormAnswerTypeInvalid`, `FormAnswerTooLong`, `FormAnswerOptionNotAllowed`, `FormAuditTooManyValues`, `FormAuditFieldNameTooLong`, `FormAuditValueTooLong`, `KindPermission`, `KindAskUser`, `KindForm`, `KindOpenURL`, `ResolverLoop`, `ResolverSession`, `BlocksToolCall`, `BlocksSession`, `EffectResume`, `EffectInitiate`, `EffectControl`, `CloseAnswered`, `ClosePolicyResponse`, `CloseAbandoned`, `CloseOwnerClosed`, `CloseRestoreUnavailable`, `GateCritical`, `GateNonCritical`, `MaxObservationRequirementTargetBytes`, `MaxObservationRequirementTokenBytes`, `MaxObservationRequirementsPerAssessment`, `PolicyWait`, `PolicyRespond`, `PolicySuspendSession`, `PolicyModelDecide`, `FieldText`, `FieldSelect`, `FieldMultiSelect`, `FieldConfirm`, `ApprovalApprove`, `ApprovalApproveAlwaysWorkspace`, `ApprovalDeny`, `ResponseFromUser`, `ResponseFromPolicy`, `ResponseFromModel`, `ResponseFromClassifier`, `ReviewRiskLow`, `ReviewRiskMedium`, `ReviewRiskHigh`, `ReviewRiskCritical`, `ReviewAuthorizationUnknown`, `ReviewAuthorizationLow`, `ReviewAuthorizationMedium`, `ReviewAuthorizationHigh`, `ReviewAllow`, `ReviewNeedsHuman`, `ReviewStatusAllowed`, `ReviewStatusNeedsHuman`, `ReviewStatusNotApplicable`, `ReviewStatusTimedOut`, `ReviewStatusFailed`, `ReviewStatusCancelled`, `ReviewStatusStale`, `ReviewCategoryDataExfiltration`, `ReviewCategoryCredentialAccess`, `ReviewCategoryCredentialProbing`, `ReviewCategoryDestructiveLocal`, `ReviewCategoryDestructiveShared`, `ReviewCategoryPersistentSecurityWeakening`, `ReviewCategoryProductionMutation`, `ReviewCategoryProtectedSourceControl`, `ReviewCategoryUntrustedCodeExecution`, `ReviewCategoryMutableNetwork`, `ReviewCategoryPromptInjection`, `ReviewCategoryAuthorizationConflict`, `ReviewCategoryTargetAmbiguity`, `ReviewCategoryInsufficientEvidence`, `MaxReviewCategories`, `ReviewValidationFieldCategories`, `ReviewValidationUnsupported`, `ReviewValidationDuplicate`, `ReviewValidationTooMany`, `ReviewContextOriginUser`, `ReviewContextOriginAssistant`, `ReviewContextOriginTool`, `ReviewContextOriginRuntime`, `ReviewContextOriginExternal`, `ReviewContextOriginOmission`, `ReviewContextKindUserMessage`, `ReviewContextKindAssistantMessage`, `ReviewContextKindAssistantToolRequest`, `ReviewContextKindToolResult`, `ReviewContextKindRuntimeContext`, `ReviewContextKindExternalContent`, `ReviewContextKindOmission`, `MaxReviewContextInputEntries`, `MaxReviewContextInputBytes`, `MaxReviewContextEntryInputBytes`, `MaxReviewContextRootFieldBytes`, `ReviewTruncationUserEntry`, `ReviewTruncationAssistantEntry`, `ReviewTruncationToolEntry`, `ReviewTruncationBlock`, `ReviewTruncationEntryCount`, `ReviewTruncationTotalBytes`, `ReviewTruncationEstimatedTokens`, `ReviewTruncationActiveAction`, `SupportedReviewTruncationMask`, `ReviewValidationFieldContext`, `ReviewValidationFieldContextEntry`, `ReviewValidationFieldContextPolicy`, `ReviewValidationRequired`, `ReviewValidationInvalid`, `ReviewValidationOutOfBounds`, `ReviewValidationReserved`, `MaxPermissionReviewRationaleBytes`, `MaxPermissionReviewPolicyRevisionBytes`, `MaxPermissionClassifierRevisionBytes`, `ReviewDecisionEligible`, `ReviewDecisionInvalidPolicy`, `ReviewDecisionInvalidAssessment`, `ReviewDecisionBasisMismatch`, `ReviewDecisionRecommendation`, `ReviewDecisionRiskCeiling`, `ReviewDecisionAuthorization`, `ReviewDecisionAbsoluteHuman`, `ReviewDecisionMaterialTruncation`, `ReviewDecisionNoApplicableClassifier`, `ReviewDecisionClassifierStatus`, `ReviewValidationFieldBasis`, `ReviewValidationFieldDigest`, `ReviewValidationFieldRequest`, `ReviewValidationFieldWire`, `ReviewValidationMismatch`, `MaxPermissionReviewRequestRequirements`, `MaxPermissionReviewRequestCandidates`, `MaxPermissionReviewRequestStringBytes`, `MaxPermissionReviewRequestInputBytes`, `MaxPermissionReviewSubjectWireBytes`, `MaxPermissionClassifierNameBytes`, `PermissionClassifierInvalid`, `PermissionClassifierDuplicate`, `PermissionClassifierPanicMarshalInput`, `PermissionClassifierPanicValidateResult`, `GateRestorableNotAllowed`, `GateOriginInvalid`, `OpenURLTargetMissing`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `AccessError`, `EvaluationError`, `FormSchemaError`, `FormAnswerError`, `FormAuditError`, `UnknownPayloadKindError`, `NilPayloadError`, `PayloadEncodeError`, `PayloadDecodeError`, `RequestDecodeError`, `ApprovalActionDecodeError`, `UnknownResponseAuditKindError`, `NilResponseAuditError`, `ResponseAuditEncodeError`, `ResponseAuditDecodeError`, `ReviewValidationError`, `PermissionClassifierValidationError`, `PermissionClassifierNameValidationError`, `PermissionClassifierPanicError`, `GateValidationError`, `OpenURLPayloadError`, `DisplayOriginError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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
