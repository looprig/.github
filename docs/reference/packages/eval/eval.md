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
  functions-and-methods: release-github-com-looprig-eval
  types: release-github-com-looprig-eval
  constants-and-variables: release-github-com-looprig-eval
  ownership-and-errors: release-github-com-looprig-eval
  source-and-runnable-proof: release-github-com-looprig-eval
---

# eval package · eval

Import path: `github.com/looprig/eval`. The source is pinned to github.com/looprig/eval@v0.1.2.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Eval `v0.1.2` separates scenario and observation data from targets, evaluators, exact checks, judge-driven scoring, and redacted report persistence. The root package does not import the inference module; `target/inference` is the explicit integration edge.

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

`FindingCode`, `Measurement`, `Finding`, `Assessment`, `ValidationError`, `InvalidEnumError`, `IndexRangeError`, `DuplicateEvidenceError`, `UnknownEvidenceError`, `EvidencePayloadError`, `DuplicateLabelError`, `DuplicateEvidenceKindError`, `DuplicateMeasurementError`, `DuplicateFindingError`, `StatusConsistencyError`, `DuplicateScenarioError`, `NilTargetError`, `NilEvaluatorError`, `DuplicateEvaluatorNameError`, `TargetError`, `ReportValidationError`, `SampleSubjectMismatchError`, `Descriptor`, `Evaluator`, `RedactedExcerpt`, `ContentHash`, `EvidenceID`, `EvidenceKind`, `Evidence`, `ConversationExcerpt`, `MessageIndexRef`, `TimingEvidence`, `UsageEvidence`, `ToolOperationEvidence`, `StructuredErrorReason`, `StructuredOutputError`, `StructuredOutput`, `DiagnosticEvidence`, `EvidenceRef`, `Fact`, `ActionName`, `ReferenceAnswer`, `ToolCallExpectation`, `StructuredOutputExpectation`, `Expectation`, `Observation`, `SubjectKind`, `Subject`, `MessageRange`, `Trace`, `OperationKind`, `OperationStatus`, `ErrorClass`, `Attribute`, `Operation`, `Sink`, `Report`, `SampleReport`, `Summary`, `EvaluatorRevision`, `Provenance`, `Label`, `Scenario`, `Sample`, `Suite`, `RunConfig`, `Target`, `Name`, `Revision`, `Scope`, `Method`, `AssessmentStatus`, `Severity`, `Unit`

### Constants {#constants}

`MaxFindingMessageBytes`, `MaxAssessmentMeasurements`, `MaxAssessmentFindings`, `MaxAssessmentEvidence`, `FindingMissingRequiredEvidence`, `MaxDescriptionBytes`, `MaxDescriptorRequires`, `MaxExcerptBytes`, `MaxHashBytes`, `MaxIDBytes`, `EvidenceConversationExcerpt`, `EvidenceMessageIndex`, `EvidenceTiming`, `EvidenceUsage`, `EvidenceToolOperation`, `EvidenceStructuredError`, `EvidenceStructuredOutput`, `EvidenceDiagnostic`, `StructuredErrorInvalidJSON`, `StructuredErrorSchemaMismatch`, `StructuredErrorMissingField`, `StructuredErrorOutOfRange`, `StructuredErrorEmptyOutput`, `MaxFactBytes`, `MaxActionNameBytes`, `MaxReferenceAnswerBytes`, `MaxRequiredFacts`, `MaxForbiddenActions`, `MaxExpectedToolCalls`, `MaxReferenceAnswers`, `MaxAttributeValueBytes`, `MaxOperationAttributes`, `SubjectModel`, `SubjectAgent`, `SubjectPrompt`, `SubjectHTTPEndpoint`, `SubjectProcess`, `OperationInference`, `OperationTool`, `OperationNetwork`, `OperationProcess`, `OperationSandbox`, `OperationStep`, `OperationOK`, `OperationFailed`, `OperationCancelled`, `OperationTimedOut`, `ErrorTimeout`, `ErrorCancelled`, `ErrorRateLimited`, `ErrorInvalidInput`, `ErrorUnavailable`, `ErrorInternal`, `MaxReportIDBytes`, `FindingEvaluatorError`, `FindingEvaluatorInvalidAssessment`, `FindingEvaluatorIdentityMismatch`, `MaxScenarioLabels`, `MaxLabelValueBytes`, `MaxScenarioInputMessages`, `MaxTrials`, `MaxNameBytes`, `MaxRevisionBytes`, `ScopeCase`, `ScopeTurn`, `ScopeSession`, `ScopeRun`, `MethodProgrammatic`, `MethodModel`, `MethodComposite`, `StatusPass`, `StatusFail`, `StatusUnverified`, `StatusError`, `StatusSkipped`, `SeverityInfo`, `SeverityLow`, `SeverityMedium`, `SeverityHigh`, `SeverityCritical`, `UnitCount`, `UnitRatio`, `UnitSecond`, `UnitToken`, `UnitByte`

### Variables {#variables}

No exported variables are declared in this package.

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ValidationError`, `InvalidEnumError`, `IndexRangeError`, `DuplicateEvidenceError`, `UnknownEvidenceError`, `EvidencePayloadError`, `DuplicateLabelError`, `DuplicateEvidenceKindError`, `DuplicateMeasurementError`, `DuplicateFindingError`, `StatusConsistencyError`, `DuplicateScenarioError`, `NilTargetError`, `NilEvaluatorError`, `DuplicateEvaluatorNameError`, `TargetError`, `ReportValidationError`, `SampleSubjectMismatchError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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

Run `GOWORK=off go test ./...` from the `eval` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
