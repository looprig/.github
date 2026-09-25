---
id: guides/evals/integration/composition-and-testing
title: Composition and testing
description: Connect Evals to Inference or a Harness adapter while keeping provider tests deterministic by default.
audience: developer
section: guides
order: 9
publication: released
proofs:
  inference-is-an-adapter-boundary: [release-github-com-looprig-eval]
  match-target-and-scenario-revisions: [release-github-com-looprig-eval]
  structured-output-produces-typed-evidence: [release-github-com-looprig-eval]
  harness-is-a-composition-seam: [release-github-com-looprig-eval]
  prefer-deterministic-tests-gate-live-providers: [release-github-com-looprig-eval]
  a-test-matrix-that-stays-honest: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Composition and testing

Evals intentionally owns the evaluation contract, not provider construction.
The public `Target` interface is the composition boundary: an adapter turns a
scenario into a validated observation, and `eval.Run` applies the same
evaluators regardless of whether the adapter calls a local fixture, a live
provider, an agent, or a process.

## Inference is an adapter boundary

`eval/target/inference` is the code-backed adapter for an
`github.com/looprig/inference` client. `NewTarget` accepts a caller-provided
client and request template. It copies request message and tool slices before
each call, appends the scenario input, invokes the client, and projects the
response into an observation with:

| Observation fact | Inference target projection |
| --- | --- |
| Conversation | Scenario input followed by the assistant response. |
| Subject | `SubjectModel` with configured name and revision. |
| Operation | One `inference` operation with `ok` status and timing references. |
| Evidence | Timing and usage, plus structured-output success or a closed error reason when a schema was requested. |

The caller still owns model identity and provider choices. Start with
Inference's [model selection reference](/docs/guides/inference/requests/model-selection)
for the request template, then connect it to Evals:

```go
func targetForModel(client llm.Client) eval.Target {
	m := model.CustomModel("openai", "openai", "", "gpt-4o-mini")
	request := llm.Request{Model: m}
	return inferenceeval.NewTarget(client, request,
		inferenceeval.WithName("support-agent"),
		inferenceeval.WithRevision("model/v1"),
		inferenceeval.WithSubjectID("support-agent"),
	)
}
```

The adapter returns typed, content-free errors for an invalid identity, failed
inference, empty response, or invalid projected observation. It does not place
provider errors, credentials, system prompts, or raw response text in trace
attributes.

## Match target and scenario revisions

`Sample.Validate` requires the observation subject revision to equal the
scenario revision. Set the scenario to the revision the target is configured to
report:

```go
scenario := eval.Scenario{
	ID: "support-1", Name: "support-agent", Revision: "model/v1",
	Input: content.AgenticMessages{userText("Summarize the order status.")},
}
report, err := eval.Run(context.Background(), eval.RunConfig{},
	eval.Suite{Name: "support", Revision: "v1", Scenarios: []eval.Scenario{scenario}},
	targetForModel(client), exact.RequiredText("status"))
```

If the target reports a different revision, the sample becomes a target-stage
error and evaluators are skipped. That is safer than evaluating a response under
the wrong model identity. The target options also include `WithClock` for
deterministic timing assertions.

## Structured output produces typed evidence

When the request template has a non-empty output schema, the inference target
extracts the structured result and validates it against the portable schema
subset. A conforming document emits `EvidenceStructuredOutput`; an extraction
or conformance problem emits `EvidenceStructuredError` with one of the closed
reasons `invalid_json`, `schema_mismatch`, `missing_field`, `out_of_range`, or
`empty_output`.

`exact.SchemaResult()` consumes those signals. A generic usage entry is never
treated as proof of structured output. See Inference's [structured output
guide](/docs/guides/inference/structured-output) for request-side schema
features, the [exact evaluator contract](/docs/guides/evals/evaluators/exact)
for the three-way pass, fail, and unverified result, and the [model-judge
evaluator](/docs/guides/evals/evaluators/judge) when a rubric needs a
structured decision.

## Harness is a composition seam

Evals does not import Harness. A Harness integration belongs at the application
composition boundary and must implement:

```go
type Target interface {
	Name() string
	Observe(context.Context, Scenario) (Observation, error)
}
```

That wrapper should translate a Harness run's assistant messages, tool blocks,
timings, and safe operational facts into one `Observation`. It should preserve
the target read-only rule and stamp a subject revision that matches the cases
it executes. Then the wrapper can use the same [run and result contract](/docs/guides/evals/cases-and-runs/runs-and-results)
and the Harness runtime's [composition guide](/docs/guides/harness).

This is an adapter seam, not a claim that Evals starts or supervises a Harness
run itself. Keeping ownership explicit prevents a test helper from silently
acquiring lifecycle or credential responsibilities.

## Prefer deterministic tests, gate live providers

Default tests should use a scripted target or a fake `inference.Client`. They
can assert exact assistant text, tool evidence, structured-output evidence,
status transitions, and report ordering without network variance or credentials.
The exact and judge examples are deterministic fixtures, and the runner's race
tests use controlled stubs to prove fixed-slot ordering and bounded concurrency.

Live provider tests are a separate confidence layer. The public inference
integration test is guarded by the `integration` build tag, skips when
`INFERENCE_INTEGRATION_API_KEY` is absent, and leaves client construction to a
caller composition root. It verifies the adapter contract after a real client
has been supplied, rather than pretending a provider is deterministic.

```go
func TestProviderSmoke(t *testing.T) {
	if os.Getenv("INFERENCE_INTEGRATION_API_KEY") == "" {
		t.Skip("provider credential is not configured")
	}
	// Build the real inference.Client in the test's composition layer, then use
	// the same eval.Suite and evaluator set as the deterministic test.
	client := liveClient(t)
	target := targetForModel(client)
	report, err := eval.Run(t.Context(), eval.RunConfig{}, suite, target,
		exact.RequiredText("status"))
	if err != nil {
		t.Fatal(err)
	}
	evaltest.RequireVerified(t, report)
}
```

`evaltest.Run` is a convenient test wrapper when presentation as subtests is
useful; `evaltest.RequirePass` and `RequireVerified` remain explicit gates.
Keep the deterministic fixture as the fast contract test and the live case as a
credential-gated smoke test with its own timeout and provider budget.

## A test matrix that stays honest

| Layer | Target | What it proves | Stability |
| --- | --- | --- | --- |
| Evaluator unit test | Hand-built `Sample` | Matching, evidence references, and status rules | Deterministic |
| Runner test | Scripted `eval.Target` | Preflight, stage separation, trials, cancellation, and worker bounds | Deterministic |
| Adapter test | Fake `inference.Client` | Request cloning, subject identity, usage, timing, and schema evidence | Deterministic |
| Provider smoke test | Real client supplied by the caller | Codec and endpoint wiring plus one observation | Credential-gated and live |
| Product qualification | Pluto `run.Execute` | Table planning, capability skips, scorecard, and profile disposition | Depends on target |

## Source

The inference adapter is in
[target/inference/target.go](https://github.com/looprig/eval/blob/v0.2.2/target/inference/target.go)
and [target/inference/project.go](https://github.com/looprig/eval/blob/v0.2.2/target/inference/project.go).
The target boundary is declared in
[target.go](https://github.com/looprig/eval/blob/v0.2.2/target.go), and test
presentation is in [evaltest/run.go](https://github.com/looprig/eval/blob/v0.2.2/evaltest/run.go).

## Proof

Deterministic target projection and identity behavior are covered by
[target/inference/target_test.go](https://github.com/looprig/eval/blob/v0.2.2/target/inference/target_test.go)
and [target/inference/conform_test.go](https://github.com/looprig/eval/blob/v0.2.2/target/inference/conform_test.go).
The live seam and credential gate are explicit in
[target/inference/target_integration_test.go](https://github.com/looprig/eval/blob/v0.2.2/target/inference/target_integration_test.go).
The deterministic exact fixture is
[examples/exact/example_test.go](https://github.com/looprig/eval/blob/v0.2.2/examples/exact/example_test.go),
and runner concurrency proof is in
[run_race_test.go](https://github.com/looprig/eval/blob/v0.2.2/run_race_test.go).
