---
id: guides/harness/hustles/errors
title: Errors
description: Describe Hustle validation and runtime errors.
audience: developer
section: guides
order: 23
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  definition-and-binding-errors: [release-github-com-looprig-harness]
  model-and-execution-errors: [release-github-com-looprig-harness]
  output-evidence-and-shutdown-errors: [release-github-com-looprig-harness]
  model-facing-rendering: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Errors

Hustle errors identify the boundary and retain only bounded, typed detail.
Inspect them with `errors.As`; error strings intentionally do not expose raw
prompts, provider responses, endpoints, or tool payloads.

## Definition and binding errors

`*hustle.DefinitionError` uses `DefinitionErrorKind` values such as
`DefinitionMissingName`, `DefinitionReservedName`,
`DefinitionDuplicateOption`, `DefinitionInvalidParticipation`,
`DefinitionMissingModelSource`, `DefinitionInvalidClient`,
`DefinitionInvalidModel`, `DefinitionInvalidTimeout`,
`DefinitionInvalidLimits`, `DefinitionInvalidSystemPrompt`,
`DefinitionInvalidPromptRevision`, `DefinitionMissingPolicyRevision`,
`DefinitionInvalidOutputSchema`, `DefinitionInvalidEvidenceTools`, and
`DefinitionInvalidRetryPolicy`.

`*hustle.BindError` reports `BindInvalidDefinition`, `BindInvalidContext`,
`BindMissingModelResolver`, or `BindInvalidEvidenceTools`.

Proof: [definition error kinds](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_errors.go) and [validation tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Model and execution errors

`*hustle.ResolveError` reports `ResolveInvalidContext`, `ResolveInvalidLoopID`,
`ResolveModelFailed`, or `ResolveInvalidBinding`. Internal admission and
execution errors are separated:

| Type | Boundary | Important values |
| --- | --- | --- |
| `AdmissionError` | Before ownership | `invalid_context`, `invalid_participation`, `nil_finalizer`, `run_id`, `full`, `closed`, `poisoned`. |
| `RequestError` | Preflight before ownership | `runtime_unavailable`, `unknown_definition`, `invalid_cause`, `invalid_input`, `input_too_large`, `nil_validator`. |
| `QueueFailureError` | Owned but waiting | `canceled`, `timeout`, `closed`, `poisoned`. |
| `RunError` | Owned execution | Stage and `hustle.ReasonCode`, plus terminal/finalizer/cleanup causes. |

Proof: [resolve errors](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_errors.go), [runtime errors](https://github.com/looprig/harness/blob/main/internal/hustleruntime/errors.go), and [preflight tests](https://github.com/looprig/harness/blob/main/internal/hustleruntime/preflight_test.go).

## Output, evidence, and shutdown errors

`OutputError` classifies invalid shape, empty text, oversized output, or
invalid JSON. `EvidenceError` uses bounded reasons for binding, authorization,
containment, execution, result/evidence limits, rounds/calls, cancellation,
deadline, and internal faults. `WorkerPanicError` and `WorkerPoisonError`
redact panic/provider details. `FinalizerError`, `ActivityError`, `AuditError`,
and `CloseError` preserve cleanup context without rewriting the primary result.

Proof: [bounded error vocabulary](https://github.com/looprig/harness/blob/main/internal/hustleruntime/errors.go) and [advanced failure tests](https://github.com/looprig/harness/blob/main/internal/hustleruntime/advanced_test.go).

## Model-facing rendering

Tool and facility adapters render only a bounded category to model-facing
output. Trusted application code can use typed causes and `errors.Is`; a model
must not receive an error string containing request bytes, credentials, or
provider diagnostics.

Proof: [tool and execution error handling](https://github.com/looprig/harness/blob/main/internal/hustleruntime/execution.go) and [output redaction tests](https://github.com/looprig/harness/blob/main/internal/hustleruntime/advanced_test.go).

## Source and proof

- [Public Hustle errors](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_errors.go)
- [Runtime errors](https://github.com/looprig/harness/blob/main/internal/hustleruntime/errors.go)
- [Retry reason matrix](https://github.com/looprig/harness/blob/main/pkg/hustle/run.go)
- [Error proof](https://github.com/looprig/harness/blob/main/internal/hustleruntime/failure_test.go)
