---
id: guides/evals/cases-and-runs/cases-and-suites
title: Cases and suites
description: Define validated scenarios, expectations, observations, and suites for Evals.
audience: developer
section: guides
order: 2
publication: released
proofs:
  scenario-is-the-qualification-case: [release-github-com-looprig-eval]
  suite-gives-cases-a-revision: [release-github-com-looprig-eval]
  observation-and-sample-connect-execution-to-evaluation: [release-github-com-looprig-eval]
  keep-case-data-and-results-separate: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Cases and suites

An Evals case is a value with a stable identity. `Scenario` is the input to an
active target, while `Observation` is what the target actually produced. A
`Suite` gives an ordered set of scenarios one revision and one report identity.
Validation is part of the contract, so malformed fixtures fail before a target
is called.

## Scenario is the qualification case

```go
type Scenario struct {
	ID          string
	Name        eval.Name
	Revision    eval.Revision
	Input       content.AgenticMessages
	Expectation *eval.Expectation
	Labels      []eval.Label
}
```

`ID` is the stable case key used in reports and comparisons. `Name` and
`Revision` identify the target revision being qualified. `Input` must contain at
least one message. `Labels` are bounded key/value tags with unique keys, not a
second payload channel.

`Expectation` is optional and can describe facts, forbidden actions, expected
tool-call counts, structured output, reference answers, and a policy revision.
It is data for evaluators, not an automatic verdict. An empty expectation is
valid and asserts nothing.

```go
func caseForCapital() eval.Scenario {
	return eval.Scenario{
		ID: "capital-fr", Name: "capital-answer", Revision: "v1",
		Input: content.AgenticMessages{&content.UserMessage{Message: content.Message{
			Role: content.RoleUser,
			Blocks: []content.Block{&content.TextBlock{Text: "Name the capital of France."}},
		}}},
		Expectation: &eval.Expectation{
			RequiredFacts: []eval.Fact{"France's capital is Paris"},
			ForbiddenActions: []eval.ActionName{"issue_refund"},
			ExpectedToolCalls: []eval.ToolCallExpectation{{
				Tool: "lookup_city", MinCount: 0,
			}},
			StructuredOutput: &eval.StructuredOutputExpectation{
				Schema: "answer/v1", Strict: true,
			},
			Labels: []eval.Label{{Key: "risk", Value: "low"}},
		},
	}
}
```

The expectation fields are intentionally orthogonal. A programmatic evaluator
may use the typed conversation and trace evidence instead of reading them, or a
caller may construct a custom evaluator that interprets the domain-specific
fields. The built-in exact evaluators are constructor-driven, so their
configuration remains visible in the evaluator descriptor.

## Suite gives cases a revision

```go
suite := eval.Suite{
	Name: "customer-support", Revision: "2026-08-12",
	Scenarios: []eval.Scenario{
		caseForCapital(),
		{
			ID: "refund-policy", Name: "support-agent", Revision: "2026-08-12",
			Input: content.AgenticMessages{&content.UserMessage{Message: content.Message{
				Role: content.RoleUser,
				Blocks: []content.Block{&content.TextBlock{Text: "Can I cancel this order?"}},
			}}},
		},
	},
}
if err := suite.Validate(); err != nil {
	// Duplicate IDs, empty inputs, invalid identities, and malformed
	// expectations are configuration errors, not evaluation outcomes.
	panic(err)
}
```

`Suite.Validate` requires a non-empty scenario set and rejects duplicate
scenario IDs. Scenario order is preserved by `Run`, which makes report order
stable even when [runs use multiple trials or workers](/docs/guides/evals/cases-and-runs/runs-and-results).
The suite revision becomes `Report.Suite`, while each successful observation
supplies the observed target revision.

## Observation and Sample connect execution to evaluation

An `Observation` carries the semantic conversation plus a typed operational
trace:

| Field | Meaning |
| --- | --- |
| `Conversation` | The canonical message sequence, including typed assistant and tool blocks. |
| `Scope` | `ScopeCase`, `ScopeTurn`, `ScopeSession`, or `ScopeRun`. |
| `Subject` | The observed model, agent, prompt, endpoint, or process identity and revision. |
| `Trace` | Timings, correlation IDs, operations, and typed evidence such as usage or tool metadata. |
| `Expectation` | Optional qualification data carried forward from the case. |

`Sample` is the pair an evaluator receives:

```go
type Sample struct {
	Scenario    *eval.Scenario
	Observation eval.Observation
}
```

For an active run, `Scenario` is non-nil and `Sample.Validate` requires
`Observation.Subject.Revision == Scenario.Revision`. A mismatch means the target
ran a different revision than the case qualified, so the runner records a
target-stage error and does not ask evaluators to decide. A continuous
observation may use a nil scenario, in which case the observation alone is
validated.

The `Target.Observe` contract is read-only. A target may copy and transform
input for its request, but it must not mutate the scenario, its message slice,
labels, or expectation. This matters when a suite is repeated or run with
concurrency.

## Keep case data and results separate

`Scenario` says what to try. `Observation` says what happened. `Assessment` says
what one evaluator can prove. The [run contract](/docs/guides/evals/cases-and-runs/runs-and-results) keeps all
three distinguishable in each `SampleReport`; the [reporting contract](/docs/guides/evals/reporting)
then emits a deliberately redacted projection.

## Source

The case and suite declarations are in
[scenario.go](https://github.com/looprig/eval/blob/v0.2.2/scenario.go),
[expectation.go](https://github.com/looprig/eval/blob/v0.2.2/expectation.go),
[observation.go](https://github.com/looprig/eval/blob/v0.2.2/observation.go), and
[suite.go](https://github.com/looprig/eval/blob/v0.2.2/suite.go).

## Proof

The exact fields and validation rules are defined in
[scenario.go](https://github.com/looprig/eval/blob/v0.2.2/scenario.go),
[expectation.go](https://github.com/looprig/eval/blob/v0.2.2/expectation.go),
[observation.go](https://github.com/looprig/eval/blob/v0.2.2/observation.go), and
[suite.go](https://github.com/looprig/eval/blob/v0.2.2/suite.go). Revision
matching is tested by
[scenario_test.go](https://github.com/looprig/eval/blob/v0.2.2/scenario_test.go)
and stage behavior by
[run_test.go](https://github.com/looprig/eval/blob/v0.2.2/run_test.go).
