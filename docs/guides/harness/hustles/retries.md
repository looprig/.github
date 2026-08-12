---
id: guides/harness/hustles/retries
title: Retries
description: Describe retry behavior for Hustle inference.
audience: developer
section: guides
order: 19
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  policy-api: [release-github-com-looprig-harness]
  what-may-retry: [release-github-com-looprig-harness]
  failure-stage-matrix: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Retries

Retries are an immutable policy on a Hustle definition. They are distinct from [Inference client retries](/docs/guides/inference/retries/): Hustle retries restart classified background work, while transport retries repeat eligible model-provider operations. The default
`RetryPolicyNone` performs one attempt. `RetryPolicyClassifiedOnce` allows one
restart only for the closed evidence-backed classifications accepted by the
runtime.

## Policy API

```go
// package hustle
type RetryPolicy uint8

const (
	RetryPolicyNone RetryPolicy = iota
	RetryPolicyClassifiedOnce
)

definition, err := hustle.Define(
	// Classified retry requires an evidence-enabled, blocking definition.
	hustle.WithRetryPolicy(hustle.RetryPolicyClassifiedOnce),
	// Other required options omitted here for brevity.
)
_ = definition
_ = err
```

`WithRetryPolicy` is a singleton option. Descriptor validation rejects an
unknown value and rejects classified retry without an evidence policy.

Proof: [retry policy type and option](https://github.com/looprig/harness/blob/main/pkg/hustle/run.go) and [definition validation](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go).

## What may retry

The runtime may retry exactly once after a clean restart for a closed set of
transient inference or recoverable terminal-output failures. It does not retry
context cancellation, timeout, controller poison, unsafe result decisions,
basis mismatches, or arbitrary consumer errors. A strict adapter may mark a
malformed terminal with `hustle.NewRecoverableTerminalValidationError()` and a
trusted caller can test it with `IsRecoverableTerminalValidationError`.

The retry keeps one owned RunID and one lifecycle audit record pair. It does not
create a second public operation or call the finalizer twice.

Proof: [retry execution policy](https://github.com/looprig/harness/blob/main/internal/hustleruntime/execution.go) and [retry tests](https://github.com/looprig/harness/blob/main/internal/hustleruntime/retry_test.go).

## Failure stage matrix

`hustle.ReasonAllowed(stage, reason)` is a closed matrix used by audit
validation:

| Stage | Allowed reason families |
| --- | --- |
| `StageQueue` | rejected, canceled, timeout, internal |
| `StageModelResolution` | canceled, timeout, model resolution, internal |
| `StageInference` | canceled, timeout, inference, internal |
| `StageOutput` | canceled, timeout, invalid output, internal |
| `StageTerminal` | timeout, terminal, internal |
| `StageFinalization` | timeout, finalization, internal |

Proof: [ReasonAllowed matrix](https://github.com/looprig/harness/blob/main/pkg/hustle/run.go) and [audit validation tests](https://github.com/looprig/harness/blob/main/pkg/event/hustle_test.go).

## Source and proof

- [Retry and stage types](https://github.com/looprig/harness/blob/main/pkg/hustle/run.go)
- [Runtime retry classifier](https://github.com/looprig/harness/blob/main/internal/hustleruntime/retry.go)
- [Retry proof](https://github.com/looprig/harness/blob/main/internal/hustleruntime/retry_test.go)
