---
id: guides/evals/evaluators/exact
title: Exact evaluators
description: Use deterministic text, tool, structured-output, and operational evaluators.
audience: developer
section: guides
order: 5
publication: released
proofs:
  required-and-forbidden-text: [release-github-com-looprig-eval]
  tool-presence-checks: [release-github-com-looprig-eval]
  structured-output-result: [release-github-com-looprig-eval]
  operational-measurements: [release-github-com-looprig-eval]
  use-exact-evaluators-in-a-run: [release-github-com-looprig-eval]
  source: [release-github-com-looprig-eval]
  proof: [release-github-com-looprig-eval]
---

# Exact evaluators

The `exact` package answers questions that typed evidence can settle without a
model judge. Every constructor returns an `eval.Evaluator` with
`MethodProgrammatic` and revision `v1`. Failures cite bounded evidence, while
the evaluator never copies untrusted conversation or tool payloads into a
finding.

## Required and forbidden text

`exact.RequiredText(substrings...)` requires every substring to occur in the
private flattening of assistant text blocks. It ignores user, system, and tool
result text, as well as assistant thinking blocks. Each assistant text block is
joined with a newline, so a substring cannot accidentally match across two
assistant messages.

`exact.ForbiddenText(substrings...)` checks each assistant message separately.
When it finds a match, the failure cites the offending message index through
message-index evidence. It does not echo the forbidden phrase in the finding.

```go
func exactReplyGate() []eval.Evaluator {
	return []eval.Evaluator{
		// Every phrase must occur in assistant text output.
		exact.RequiredText("Paris", "capital"),
		// Neither phrase may occur in any one assistant message.
		exact.ForbiddenText("guaranteed", "risk-free"),
	}
}
```

Both constructors require at least one substring. `RequiredText()` and
`ForbiddenText()` produce an `error` assessment with `config_error`, never a
vacuous pass. This protects a gate from silently doing no work.

The matching boundary is worth testing explicitly:

| Conversation content | `RequiredText("refundprocessed")` | `ForbiddenText("guaranteed")` |
| --- | --- | --- |
| One assistant message: `refundprocessed` | Pass | Depends on its text |
| Two assistant messages: `refund`, then `processed` | Fail, the newline is real | Depends on each message independently |
| Phrase only inside a nested tool result | Fail for required text | Pass for forbidden text, because it is not assistant output |
| No assistant messages | Fail | Pass for a non-empty forbidden list |

The last row is a useful reminder that a forbidden check can prove absence in
an empty response, while a required check cannot prove presence.

## Tool presence checks

`exact.RequiredTool(name)` searches typed `ToolUseBlock` values. It also walks
tool-result content, and it never parses the tool input JSON. A malformed input
payload therefore cannot crash the evaluator or change whether the named tool
was present. `exact.ForbiddenTool(name)` and its alias `exact.NoToolCall(name)`
assert absence. A matching forbidden call produces `tool_operation` evidence
with the safe tool name and argument byte count, plus a message index reference.

```go
evaluators := []eval.Evaluator{
	// The lookup must happen at least once.
	exact.RequiredTool("lookup_account"),
	// A refund action must never happen.
	exact.NoToolCall("issue_refund"),
}
```

An empty or invalid tool name is a configuration error and yields `error`, not
pass. Tool arguments and results stay in the conversation or controlled trace;
the exact evaluator only exposes safe metadata in its evidence.

## Structured-output result

`exact.SchemaResult()` evaluates typed trace evidence, not raw model text:

1. `structured_output_error` means schema validation failed, so the result is
   `fail` even if a positive signal appears elsewhere.
2. `structured_output` with no error means the output validated, so the result is
   `pass` and cites the positive evidence.
3. No structured-output evidence means `unverified`. Generic usage evidence is
   not proof of schema conformance.

The active [Inference target](/docs/guides/evals/integration/composition-and-testing/) emits those evidence
signals when its request carries an output schema. The provider-facing request
contract is documented in Inference's [structured output guide](/docs/guides/inference/structured-output/).

## Operational measurements

| Constructor | Required evidence | Measurement | Verdict rule |
| --- | --- | --- | --- |
| `exact.ToolErrorRate()` | `tool_operation` | `tool_error_rate` as a `ratio` | Measures and passes without a threshold; `MaxErrorRate(r)` fails only when the rate is strictly greater than `r`. |
| `exact.MaxDuration(limit)` | `timing` | `duration_seconds` as a `second` | Fails when the longest recorded timing exceeds `limit`. |

Both checks return `unverified` when the required evidence is absent. A
non-positive duration or an error-rate threshold outside `[0,1]` is an
`error`-status configuration result. Measurements remain finite and carry a
declared unit, so downstream report consumers can distinguish a ratio from a
duration.

## Use exact evaluators in a run

```go
report, err := eval.Run(
	context.Background(), eval.RunConfig{}, suite, target,
	exact.RequiredText("Paris"),
	exact.ForbiddenText("London"),
	exact.NoToolCall("issue_refund"),
)
if err != nil {
	// This is preflight or cancellation. Per-case target and evaluator failures
	// are represented in report data and do not abort the run.
	panic(err)
}
for _, sample := range report.Samples {
	for _, assessment := range sample.Assessments {
		fmt.Printf("%s: %s\n", assessment.Evaluator, assessment.Status)
	}
}
```

Pair this with the [evaluator gates](/docs/guides/evals/evaluators/) and
`evaltest.RequirePass` or `evaltest.RequireVerified` when choosing a gate, and
with [reporting](/docs/guides/evals/reporting/) when
preserving evidence for later review.

## Source

The deterministic constructors are in
[exact/text.go](https://github.com/looprig/eval/blob/main/exact/text.go),
[exact/tool.go](https://github.com/looprig/eval/blob/main/exact/tool.go),
[exact/structured.go](https://github.com/looprig/eval/blob/main/exact/structured.go),
and [exact/operational.go](https://github.com/looprig/eval/blob/main/exact/operational.go).

## Proof

Required and forbidden text are implemented in
[exact/text.go](https://github.com/looprig/eval/blob/main/exact/text.go) and
tested in [exact/text_test.go](https://github.com/looprig/eval/blob/main/exact/text_test.go),
including Unicode, cross-message boundaries, nested tool results, and vacuous
constructors. Tool behavior is in
[exact/tool.go](https://github.com/looprig/eval/blob/main/exact/tool.go) and
[exact/tool_test.go](https://github.com/looprig/eval/blob/main/exact/tool_test.go).
Structured-output and operational semantics are in
[exact/structured.go](https://github.com/looprig/eval/blob/main/exact/structured.go)
and [exact/operational.go](https://github.com/looprig/eval/blob/main/exact/operational.go)
with their focused tests.
