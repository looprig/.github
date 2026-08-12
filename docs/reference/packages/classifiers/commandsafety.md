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
  functions: release-github-com-looprig-classifiers
  methods: release-github-com-looprig-classifiers
  types: release-github-com-looprig-classifiers
  constants: release-github-com-looprig-classifiers
  variables: release-github-com-looprig-classifiers
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
- `func EncodeAssessmentAsModelOutput(subject gate.PermissionReviewSubject, risk gate.ReviewRisk, authorization gate.ReviewAuthorization, categories []gate.ReviewRiskCategory, recommendation gate.ReviewRecommendation, rationale string) (json.RawMessage, error)`
- `func RequiredEvidenceKinds() []string`

### Methods {#methods}

- `func (e *ConstructionError) Error() string`
- `func (e *ConstructionError) Unwrap() error`
- `func (c *Classifier) Name() hustle.Name`
- `func (c *Classifier) Revision() string`
- `func (c *Classifier) Definition() hustle.Definition`
- `func (c *Classifier) Applies(subject gate.PermissionReviewSubject) bool`
- `func (c *Classifier) MarshalInput(subject gate.PermissionReviewSubject) (json.RawMessage, error)`
- `func (c *Classifier) ValidateResult(subject gate.PermissionReviewSubject, result hustle.Result) (gate.PermissionAssessment, error)`
- `func (e *EvaluationError) Error() string`

### Types {#types}

```go
type Policy = policy.Policy
```

```go
type ReadEvidencePolicy struct {
	Limits             evidence.Limits
	VisibilityResolver evidence.VisibilityResolver
}
```

```go
type Options struct {
	Inference inference.Client
	Model     model.Model
	Policy    Policy
	Evidence  hustle.EvidenceToolPolicy
}
```

```go
type ConstructionField string
```

```go
type ConstructionError struct {
	Field ConstructionField
	Cause error
}
```

```go
type Classifier struct {
	// contains filtered or unexported fields
}
```

```go
type ModelResponder func(subject gate.PermissionReviewSubject) (json.RawMessage, error)
```

```go
type EvaluationCase struct {
	ID               string
	Subject          gate.PermissionReviewSubject
	Respond          ModelResponder
	ExpectedEligible bool
}
```

```go
type EvaluationOptions struct {
	CorpusRevision string
}
```

```go
type ConfusionMatrix struct {
	TrueAllow int

	TrueHuman int

	FalseAllow int

	FalseHuman int
}
```

```go
type CaseMismatch struct {
	ID               string
	ExpectedEligible bool
	ActualEligible   bool
	Risk             gate.ReviewRisk
}
```

```go
type CaseFailureReason string
```

```go
type CaseFailure struct {
	ID     string
	Reason CaseFailureReason
}
```

```go
type Report struct {
	CorpusRevision     string
	ClassifierName     string
	ClassifierRevision string

	ModelIdentity string

	TotalCases      int
	ConfusionMatrix ConfusionMatrix

	ByRisk          map[gate.ReviewRisk]int
	ByAuthorization map[gate.ReviewAuthorization]int

	CriticalFalseAllows int
	HighRiskFalseAllows int

	BenignSentToHuman int

	Mismatches []CaseMismatch
	Failures   []CaseFailure

	ToolEvidenceUsage          string
	LatencyTokenUsage          string
	PreviousRevisionComparison string
}
```

```go
type EvaluationError struct {
	Reason string
}
```

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
