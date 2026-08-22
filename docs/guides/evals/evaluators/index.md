---
id: guides/evals/evaluators/index
title: Evaluator contracts and gates
description: Implement evaluators that separate quality verdicts from missing evidence and infrastructure errors.
audience: developer
section: guides
order: 4
publication: released
proofs:
  evidence-gates-are-explicit: [release-github-com-looprig-eval]
  keep-error-and-quality-semantics-distinct: [release-github-com-looprig-eval]
  evidence-makes-findings-auditable: [release-github-com-looprig-eval]
  test-gates-at-the-report-level: [release-github-com-looprig-eval]
  a-small-custom-evaluator: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Evaluator contracts and gates

An `eval.Evaluator` is a read-only observer of one `Sample`. It declares a
versioned `Descriptor`, then returns an `Assessment` or an error. It does not
authorize actions, mutate a session, retry a target, or turn a missing signal
into a pass.

```go
type Evaluator interface {
	Descriptor() eval.Descriptor
	Evaluate(context.Context, eval.Sample) (eval.Assessment, error)
}

type Descriptor struct {
	Name        eval.Name
	Revision    eval.Revision
	Method      eval.Method
	Description string
	Requires    []eval.EvidenceKind
}
```

`MethodProgrammatic` describes deterministic evidence checks, `MethodModel`
describes a model judge, and `MethodComposite` describes a conclusion grounded
in component evaluators and operational facts. `Name` must be unique within one
run. `Revision` changes when the evaluator's meaning changes, so a report can
be compared without confusing two versions of the same check.

## Evidence gates are explicit

If a descriptor declares `Requires`, the runner calls `Descriptor.CheckRequires`
before `Evaluate`. When any required `EvidenceKind` is absent, the result is an
`unverified` assessment with the stable finding code
`missing_required_evidence`. The evaluator is not called and the result is
never upgraded to a pass merely because the conversation looks plausible.

```go
func (d eval.Descriptor) CheckRequires(s eval.Sample) (eval.Assessment, bool)
```

This is useful for operational measurements. For example, the exact tool error
rate evaluator requires `EvidenceToolOperation`; a sample with no tool
operation has no defined denominator, so it is unverified rather than a
zero-error pass. The [exact evaluator page](/docs/guides/evals/evaluators/exact) lists the built-in
requirements.

## Keep error and quality semantics distinct

Use the status constructors to make intent visible:

```go
func evaluateReply(d eval.Descriptor, ok bool) (eval.Assessment, error) {
	if ok {
		return eval.Pass(d, eval.Measurement{
			Name: "reply_length", Value: 3, Unit: eval.UnitCount,
		}), nil
	}
	return eval.Fail(d, eval.Finding{
		Code: "missing_answer", Severity: eval.SeverityHigh,
		Message: "the required answer was not present",
	}), nil
}
```

Return a non-nil error when the evaluator cannot decide because a provider is
unreachable, a context deadline fired, or a model response is malformed. The
runner contains that error as an `error` assessment with a safe finding. If a
caller wants the failure to flow through a report directly, `eval.Errored` is
the explicit alternative. Do not return `eval.Fail` for an evaluator outage.

`eval.Unverified` is for missing authoritative evidence. `eval.Skipped` is for
intentional non-execution. Neither status may carry a measurement. A `pass` may
carry informational, low, or medium findings, but a high or critical finding
would contradict a passing verdict and is rejected by validation.

## Evidence makes findings auditable

An assessment owns its evidence entries. A finding can point to an
`EvidenceID`, a conversation message index, or both. `Assessment.Validate`
resolves every named evidence ID, so a finding with a dangling reference cannot
enter a report. The evidence union supports bounded, typed facts:

| Evidence kind | What it proves | What it avoids storing |
| --- | --- | --- |
| `conversation_excerpt` | A message location plus optional hash or redacted excerpt | Unbounded transcript text |
| `message_index` | A message location | A copied message |
| `timing` | A named duration | Provider or prompt text |
| `usage` | Token usage and safe model revision | Credentials or raw responses |
| `tool_operation` | Tool name, argument size/hash, result size, and error bit | Raw arguments and results |
| `structured_output` / `structured_output_error` | Schema success or a closed failure reason | Raw model JSON |
| `evaluator_diagnostic` | A bounded safe diagnostic | Unredacted judge or provider prose |

The [reporting guide](/docs/guides/evals/reporting) explains how these fields survive the
redacted wire projection.

## Test gates at the report level

`evaltest.Run` presents a report through `*testing.T` subtests or a flat test
log. Presentation is informational and does not fail a test. Use an assertion
for policy:

| Gate | Accepts | Rejects |
| --- | --- | --- |
| `evaltest.RequirePass` | `pass` and intentional `skipped`, with at least one pass and coverage for every sample | Target errors, `fail`, `unverified`, `error`, empty reports, and samples with no evaluator |
| `evaltest.RequireVerified` | Definite `pass`, `fail`, and `skipped` assessments | Target errors, `unverified`, `error`, empty reports, and samples with no evaluator |

This distinction lets a test assert either “everything passed” or the weaker
property “every attempted check reached a definite disposition.”

## A small custom evaluator

```go
type replyGate struct {
	desc eval.Descriptor
}

func newReplyGate() eval.Evaluator {
	return replyGate{desc: eval.Descriptor{
		Name: "reply/present", Revision: "v1",
		Method: eval.MethodProgrammatic,
		Description: "requires at least one assistant message",
	}}
}

func (g replyGate) Descriptor() eval.Descriptor { return g.desc }

func (g replyGate) Evaluate(_ context.Context, s eval.Sample) (eval.Assessment, error) {
	for _, message := range s.Observation.Conversation {
		if _, ok := message.(*content.AIMessage); ok {
			return eval.Pass(g.desc), nil
		}
	}
	return eval.Fail(g.desc, eval.Finding{
		Code: "assistant_missing", Severity: eval.SeverityHigh,
		Message: "no assistant message was observed",
	}), nil
}
```

The descriptor and returned assessment carry the same identity. The runner
checks that identity after `Assessment.Validate`, so a buggy evaluator cannot
masquerade as another evaluator in provenance or comparison.

Continue with [exact programmatic checks](/docs/guides/evals/evaluators/exact)
or the [structured model judge](/docs/guides/evals/evaluators/judge). For
active model execution, connect a target as described in [composition and
testing](/docs/guides/evals/integration/composition-and-testing).

## Source

The evaluator boundary is declared in
[evaluator.go](https://github.com/looprig/eval/blob/main/evaluator.go),
[assessment.go](https://github.com/looprig/eval/blob/main/assessment.go), and
[evidence.go](https://github.com/looprig/eval/blob/main/evidence.go). Report
gates are exposed by
[evaltest/assert.go](https://github.com/looprig/eval/blob/main/evaltest/assert.go).

## Proof

The interface, descriptor gate, and status constructors are in
[evaluator.go](https://github.com/looprig/eval/blob/main/evaluator.go) and
[assessment.go](https://github.com/looprig/eval/blob/main/assessment.go).
Evidence references and validation are in
[evidence.go](https://github.com/looprig/eval/blob/main/evidence.go). The
report-level assertions are implemented in
[evaltest/assert.go](https://github.com/looprig/eval/blob/main/evaltest/assert.go),
with behavior covered by
[evaluator_test.go](https://github.com/looprig/eval/blob/main/evaluator_test.go),
[assessment_test.go](https://github.com/looprig/eval/blob/main/assessment_test.go),
and [evaltest/run_test.go](https://github.com/looprig/eval/blob/main/evaltest/run_test.go).
