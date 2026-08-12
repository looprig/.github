---
id: reference/packages/eval/eval
title: eval package · eval
description: Reference for the eval package at github.com/looprig/eval, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 400
publication: released
examples:
  - stage-23-eval
proofs:
  package-role: release-github-com-looprig-eval
  exported-surface: release-github-com-looprig-eval
  functions: release-github-com-looprig-eval
  methods: release-github-com-looprig-eval
  types: release-github-com-looprig-eval
  constants: release-github-com-looprig-eval
  variables: release-github-com-looprig-eval
  ownership-and-errors: release-github-com-looprig-eval
  source-and-runnable-proof: release-github-com-looprig-eval
---

# eval package · eval

Import path: `github.com/looprig/eval`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

Package eval is an application-neutral evaluation framework for agentic systems.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func Pass(desc Descriptor, measurements ...Measurement) Assessment`
- `func Fail(desc Descriptor, findings ...Finding) Assessment`
- `func Unverified(desc Descriptor, findings ...Finding) Assessment`
- `func Errored(desc Descriptor, findings ...Finding) Assessment`
- `func Skipped(desc Descriptor) Assessment`
- `func Run(ctx context.Context, cfg RunConfig, suite Suite, target Target, evaluators ...Evaluator) (Report, error)`

### Methods {#methods}

- `func (c FindingCode) Validate() error`
- `func (m Measurement) Validate() error`
- `func (a Assessment) Validate() error`
- `func (e *ValidationError) Error() string`
- `func (e *InvalidEnumError) Error() string`
- `func (e *IndexRangeError) Error() string`
- `func (e *DuplicateEvidenceError) Error() string`
- `func (e *UnknownEvidenceError) Error() string`
- `func (e *EvidencePayloadError) Error() string`
- `func (e *DuplicateLabelError) Error() string`
- `func (e *DuplicateEvidenceKindError) Error() string`
- `func (e *DuplicateMeasurementError) Error() string`
- `func (e *DuplicateFindingError) Error() string`
- `func (e *StatusConsistencyError) Error() string`
- `func (e *DuplicateScenarioError) Error() string`
- `func (e *NilTargetError) Error() string`
- `func (e *NilEvaluatorError) Error() string`
- `func (e *DuplicateEvaluatorNameError) Error() string`
- `func (e *TargetError) Error() string`
- `func (e *TargetError) Unwrap() error`
- `func (e *ReportValidationError) Error() string`
- `func (e *SampleSubjectMismatchError) Error() string`
- `func (d Descriptor) Validate() error`
- `func (d Descriptor) CheckRequires(s Sample) (Assessment, bool)`
- `func (x RedactedExcerpt) Validate() error`
- `func (h ContentHash) Validate() error`
- `func (id EvidenceID) Validate() error`
- `func (k EvidenceKind) Validate() error`
- `func (r StructuredErrorReason) Validate() error`
- `func (e Evidence) Validate() error`
- `func (f Fact) Validate() error`
- `func (a ActionName) Validate() error`
- `func (r ReferenceAnswer) Validate() error`
- `func (t ToolCallExpectation) Validate() error`
- `func (s StructuredOutputExpectation) Validate() error`
- `func (e *Expectation) Validate() error`
- `func (k SubjectKind) Validate() error`
- `func (s Subject) Validate() error`
- `func (k OperationKind) Validate() error`
- `func (s OperationStatus) Validate() error`
- `func (c ErrorClass) Validate() error`
- `func (a Attribute) Validate() error`
- `func (o Operation) Validate() error`
- `func (o Observation) Validate() error`
- `func (r Report) Validate() error`
- `func (l Label) Validate() error`
- `func (s Scenario) Validate() error`
- `func (s Sample) Validate() error`
- `func (s Suite) Validate() error`
- `func (c RunConfig) Validate() error`
- `func (n Name) Validate() error`
- `func (r Revision) Validate() error`
- `func (s Scope) Validate() error`
- `func (m Method) Validate() error`
- `func (s AssessmentStatus) Validate() error`
- `func (s Severity) Validate() error`
- `func (u Unit) Validate() error`

### Types {#types}

```go
type FindingCode string
```

```go
type Measurement struct {
	Name  Name
	Value float64
	Unit  Unit
}
```

```go
type Finding struct {
	Code     FindingCode
	Severity Severity
	Message  string
	Evidence []EvidenceRef
}
```

```go
type Assessment struct {
	Evaluator    Name
	Revision     Revision
	Status       AssessmentStatus
	Measurements []Measurement
	Findings     []Finding
	Evidence     []Evidence
	Duration     time.Duration
}
```

```go
type ValidationError struct {
	Field string

	Reason string
}
```

```go
type InvalidEnumError struct {
	Enum string

	Value string
}
```

```go
type IndexRangeError struct {
	Field string

	Index int

	Len int
}
```

```go
type DuplicateEvidenceError struct{}
```

```go
type UnknownEvidenceError struct{}
```

```go
type EvidencePayloadError struct {
	Reason string
}
```

```go
type DuplicateLabelError struct{}
```

```go
type DuplicateEvidenceKindError struct{}
```

```go
type DuplicateMeasurementError struct{}
```

```go
type DuplicateFindingError struct{}
```

```go
type StatusConsistencyError struct {
	Status AssessmentStatus

	Reason string
}
```

```go
type DuplicateScenarioError struct{}
```

```go
type NilTargetError struct{}
```

```go
type NilEvaluatorError struct{}
```

```go
type DuplicateEvaluatorNameError struct{}
```

```go
type TargetError struct {
	Cause error
}
```

```go
type ReportValidationError struct {
	Reason string
}
```

```go
type SampleSubjectMismatchError struct{}
```

```go
type Descriptor struct {
	Name        Name
	Revision    Revision
	Method      Method
	Description string
	Requires    []EvidenceKind
}
```

```go
type Evaluator interface {
	Descriptor() Descriptor
	Evaluate(context.Context, Sample) (Assessment, error)
}
```

```go
type RedactedExcerpt string
```

```go
type ContentHash string
```

```go
type EvidenceID string
```

```go
type EvidenceKind string
```

```go
type Evidence struct {
	ID   EvidenceID
	Kind EvidenceKind

	ConversationExcerpt *ConversationExcerpt
	MessageIndex        *MessageIndexRef
	Timing              *TimingEvidence
	Usage               *UsageEvidence
	ToolOperation       *ToolOperationEvidence
	StructuredError     *StructuredOutputError
	StructuredOutput    *StructuredOutput
	Diagnostic          *DiagnosticEvidence
}
```

```go
type ConversationExcerpt struct {
	MessageIndex int
	Role         content.Role
	Hash         ContentHash
	Redacted     RedactedExcerpt
}
```

```go
type MessageIndexRef struct {
	Index int
}
```

```go
type TimingEvidence struct {
	Label    Name
	Duration time.Duration
}
```

```go
type UsageEvidence struct {
	Model Revision
	Usage content.Usage
}
```

```go
type ToolOperationEvidence struct {
	ToolName    Name
	ToolUseID   string
	ArgsHash    ContentHash
	ArgsBytes   int
	ResultBytes int
	IsError     bool
}
```

```go
type StructuredErrorReason string
```

```go
type StructuredOutputError struct {
	Schema     Revision
	Reason     StructuredErrorReason
	DetailHash ContentHash
}
```

```go
type StructuredOutput struct {
	SchemaName     Name
	SchemaRevision Revision
}
```

```go
type DiagnosticEvidence struct {
	Code     Name
	Severity Severity
	Message  RedactedExcerpt
}
```

```go
type EvidenceRef struct {
	Evidence     EvidenceID
	MessageIndex *int
}
```

```go
type Fact string
```

```go
type ActionName string
```

```go
type ReferenceAnswer string
```

```go
type ToolCallExpectation struct {
	Tool     Name
	MinCount int
	MaxCount *int
}
```

```go
type StructuredOutputExpectation struct {
	Schema Revision
	Strict bool
}
```

```go
type Expectation struct {
	RequiredFacts []Fact

	ForbiddenActions []ActionName

	ExpectedToolCalls []ToolCallExpectation

	StructuredOutput *StructuredOutputExpectation

	ReferenceAnswers []ReferenceAnswer

	PolicyRef Revision
}
```

```go
type Observation struct {
	Conversation content.AgenticMessages
	Scope        Scope
	Subject      Subject
	Trace        Trace
	Expectation  *Expectation
}
```

```go
type SubjectKind string
```

```go
type Subject struct {
	ID       string
	Kind     SubjectKind
	Name     Name
	Revision Revision
}
```

```go
type MessageRange struct {
	Start int
	Len   int
}
```

```go
type Trace struct {
	TraceID       string
	SessionID     string
	TurnID        string
	StartedAt     time.Time
	EndedAt       time.Time
	Model         Revision
	Prompt        Revision
	MessageRanges []MessageRange
	Operations    []Operation
	Evidence      []Evidence
}
```

```go
type OperationKind string
```

```go
type OperationStatus string
```

```go
type ErrorClass string
```

```go
type Attribute struct {
	Key   Name
	Value string
}
```

```go
type Operation struct {
	ID         string
	ParentID   string
	Kind       OperationKind
	Status     OperationStatus
	StartedAt  time.Time
	EndedAt    time.Time
	Attributes []Attribute
	ErrorClass ErrorClass
	Evidence   []EvidenceRef
}
```

```go
type Sink interface {
	WriteReport(context.Context, Report) error
}
```

```go
type Report struct {
	ID         string
	Suite      Revision
	Target     Revision
	StartedAt  time.Time
	EndedAt    time.Time
	Samples    []SampleReport
	Summary    Summary
	Provenance Provenance
}
```

```go
type SampleReport struct {
	ScenarioID  string
	TrialIndex  int
	Observation Observation
	TargetErr   *TargetError
	Assessments []Assessment
}
```

```go
type Summary struct {
	Samples      int
	TargetErrors int
	Assessments  map[AssessmentStatus]int
}
```

```go
type EvaluatorRevision struct {
	Name     Name
	Revision Revision
}
```

```go
type Provenance struct {
	Suite      Revision
	Target     Revision
	Evaluators []EvaluatorRevision
}
```

```go
type Label struct {
	Key   Name
	Value string
}
```

```go
type Scenario struct {
	ID          string
	Name        Name
	Revision    Revision
	Input       content.AgenticMessages
	Expectation *Expectation
	Labels      []Label
}
```

```go
type Sample struct {
	Scenario    *Scenario
	Observation Observation
}
```

```go
type Suite struct {
	Name      Name
	Revision  Revision
	Scenarios []Scenario
}
```

```go
type RunConfig struct {
	Trials int

	Concurrency int

	TargetTimeout time.Duration

	EvaluatorTimeout time.Duration
	// contains filtered or unexported fields
}
```

```go
type Target interface {
	Name() string
	Observe(context.Context, Scenario) (Observation, error)
}
```

```go
type Name string
```

```go
type Revision string
```

```go
type Scope uint8
```

```go
type Method uint8
```

```go
type AssessmentStatus string
```

```go
type Severity string
```

```go
type Unit string
```

### Constants {#constants}

`MaxFindingMessageBytes`, `MaxAssessmentMeasurements`, `MaxAssessmentFindings`, `MaxAssessmentEvidence`, `FindingMissingRequiredEvidence`, `MaxDescriptionBytes`, `MaxDescriptorRequires`, `MaxExcerptBytes`, `MaxHashBytes`, `MaxIDBytes`, `EvidenceConversationExcerpt`, `EvidenceMessageIndex`, `EvidenceTiming`, `EvidenceUsage`, `EvidenceToolOperation`, `EvidenceStructuredError`, `EvidenceStructuredOutput`, `EvidenceDiagnostic`, `StructuredErrorInvalidJSON`, `StructuredErrorSchemaMismatch`, `StructuredErrorMissingField`, `StructuredErrorOutOfRange`, `StructuredErrorEmptyOutput`, `MaxFactBytes`, `MaxActionNameBytes`, `MaxReferenceAnswerBytes`, `MaxRequiredFacts`, `MaxForbiddenActions`, `MaxExpectedToolCalls`, `MaxReferenceAnswers`, `MaxAttributeValueBytes`, `MaxOperationAttributes`, `SubjectModel`, `SubjectAgent`, `SubjectPrompt`, `SubjectHTTPEndpoint`, `SubjectProcess`, `OperationInference`, `OperationTool`, `OperationNetwork`, `OperationProcess`, `OperationSandbox`, `OperationStep`, `OperationOK`, `OperationFailed`, `OperationCancelled`, `OperationTimedOut`, `ErrorTimeout`, `ErrorCancelled`, `ErrorRateLimited`, `ErrorInvalidInput`, `ErrorUnavailable`, `ErrorInternal`, `MaxReportIDBytes`, `FindingEvaluatorError`, `FindingEvaluatorInvalidAssessment`, `FindingEvaluatorIdentityMismatch`, `MaxScenarioLabels`, `MaxLabelValueBytes`, `MaxScenarioInputMessages`, `MaxTrials`, `MaxNameBytes`, `MaxRevisionBytes`, `ScopeCase`, `ScopeTurn`, `ScopeSession`, `ScopeRun`, `MethodProgrammatic`, `MethodModel`, `MethodComposite`, `StatusPass`, `StatusFail`, `StatusUnverified`, `StatusError`, `StatusSkipped`, `SeverityInfo`, `SeverityLow`, `SeverityMedium`, `SeverityHigh`, `SeverityCritical`, `UnitCount`, `UnitRatio`, `UnitSecond`, `UnitToken`, `UnitByte`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `DuplicateEvaluatorNameError`, `DuplicateEvidenceError`, `DuplicateEvidenceKindError`, `DuplicateFindingError`, `DuplicateLabelError`, `DuplicateMeasurementError`, `DuplicateScenarioError`, `EvidencePayloadError`, `IndexRangeError`, `InvalidEnumError`, `NilEvaluatorError`, `NilTargetError`, `ReportValidationError`, `SampleSubjectMismatchError`, `StatusConsistencyError`, `TargetError`, `UnknownEvidenceError`, `ValidationError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [assessment.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/assessment.go)
- [doc.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/doc.go)
- [errors.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/errors.go)
- [evaluator.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaluator.go)
- [evidence.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evidence.go)
- [expectation.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/expectation.go)
- [observation.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/observation.go)
- [report.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/report.go)
- [run.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/run.go)
- [scenario.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/scenario.go)
- [suite.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/suite.go)
- [target.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/target.go)
- [types.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/types.go)
- [validate.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/validate.go)

Adjacent tests at the same commit:

- [assessment_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/assessment_test.go)
- [doc_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/doc_test.go)
- [evaluator_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evaluator_test.go)
- [evidence_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/evidence_test.go)
- [observation_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/observation_test.go)
- [report_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/report_test.go)
- [run_race_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/run_race_test.go)
- [run_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/run_test.go)
- [scenario_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/scenario_test.go)
- [types_test.go](https://github.com/looprig/eval/blob/ba758feb51fc22f009acf67dadfa692750e3cdd1/types_test.go)

Run `go test ./...` from a checkout of the `eval` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
