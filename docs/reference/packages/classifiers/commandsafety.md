---
id: reference/packages/classifiers/commandsafety
title: commandsafety package · commandsafety
description: Reference for command-safety classifier construction, evidence, reconciliation, and deterministic evaluation.
audience: developer
section: reference
order: 181
publication: released
examples:
  - stage-13-classifier
proofs:
  package-role: release-github-com-looprig-classifiers
  exported-surface: release-github-com-looprig-classifiers
  functions-and-methods: release-github-com-looprig-classifiers
  types: release-github-com-looprig-classifiers
  constants-and-variables: release-github-com-looprig-classifiers
  ownership-and-errors: release-github-com-looprig-classifiers
  source-and-runnable-proof: release-github-com-looprig-classifiers
---

# commandsafety package · commandsafety

Import path: `github.com/looprig/classifiers/pkg/commandsafety`. The source is pinned to github.com/looprig/classifiers@v0.1.4.

## Package role {#package-role}

`New` validates the inference/model binding, policy revision, and evidence policy. The resulting `Classifier` implements Harness permission-classifier methods and preserves the subject basis through model input and output.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func DefaultPolicy() Policy`
- `func StandardEvidence(policy ReadEvidencePolicy) hustle.EvidenceToolPolicy`
- `func New(options Options) (*Classifier, error)`
- `func Evaluate(classifier *Classifier, cases []EvaluationCase, options EvaluationOptions) (Report, error)`
- `func EncodeAssessmentAsModelOutput( subject gate.PermissionReviewSubject, risk gate.ReviewRisk, authorization gate.ReviewAuthorization, categories []gate.ReviewRiskCategory, recommendation gate.ReviewRecommendation, rationale string,) (json.RawMessage, error)`
- `func RequiredEvidenceKinds() []string`

### Methods {#methods}

- `func (e *ConstructionError) Error() string`
- `func (e *ConstructionError) Unwrap() error`
- `func (c *Classifier) Name() hustle.Name`
- `func (c *Classifier) Revision() string`
- `func (c *Classifier) Definition() hustle.Definition`
- `func (c *Classifier) Applies(subject gate.PermissionReviewSubject) bool`
- `func (c *Classifier) MarshalInput(subject gate.PermissionReviewSubject) (json.RawMessage, error)`
- `func (c *Classifier) ValidateResult( subject gate.PermissionReviewSubject, result hustle.Result,) (gate.PermissionAssessment, error)`
- `func (e *EvaluationError) Error() string`

### Types {#types}

`Policy`, `ReadEvidencePolicy`, `Options`, `ConstructionField`, `ConstructionError`, `Classifier`, `ModelResponder`, `EvaluationCase`, `EvaluationOptions`, `ConfusionMatrix`, `CaseMismatch`, `CaseFailureReason`, `CaseFailure`, `Report`, `EvaluationError`

### Constants {#constants}

`Name`, `FieldInference`, `FieldModel`, `FieldModelCapabilities`, `FieldPolicy`, `FieldEvidence`, `FieldDefinition`, `CaseFailureMarshalInput`, `CaseFailureRespond`, `CaseFailureValidateResult`, `CaseFailureGatePolicy`

### Variables {#variables}

`AbsoluteHumanCategoryFloor`, `ErrPolicyMissingAbsoluteHumanFloor`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ConstructionError`, `EvaluationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/commandsafety/commandsafety.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/commandsafety.go)
- [pkg/commandsafety/doc.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/doc.go)
- [pkg/commandsafety/evaluation.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/evaluation.go)
- [pkg/commandsafety/evidence_kinds.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/evidence_kinds.go)

Adjacent tests at the same commit:

- [pkg/commandsafety/commandsafety_test.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/commandsafety_test.go)
- [pkg/commandsafety/evaluation_test.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/evaluation_test.go)
- [pkg/commandsafety/evidence_kinds_test.go](https://github.com/looprig/classifiers/blob/9df4a42884187de95a8ece6b75c4ee4a3eacd45d/pkg/commandsafety/evidence_kinds_test.go)

Run `GOWORK=off go test ./...` from the `classifiers` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
