---
id: guides/harness/hustles/model-selection
title: Model Selection
description: Describe model selection for a Hustle run.
audience: developer
section: guides
order: 16
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  current-loop-model: [release-github-com-looprig-harness]
  named-inference: [release-github-com-looprig-harness]
  binding-and-errors: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Model Selection

Hustle model selection is explicit in the immutable definition. The two
sources have different identity and restore behavior.

## Current Loop model

`hustle.WithCurrentLoopModel()` stores no client or model. At each invocation,
the bound definition calls:

```go
// package hustle
type ModelResolver interface {
	ResolveHustleModel(context.Context, uuid.UUID) (InferenceBinding, error)
}

binding, err := bound.ResolveInference(ctx, originatingLoopID)
if err != nil {
	var resolveErr *hustle.ResolveError
	if errors.As(err, &resolveErr) {
		log.Printf("resolve kind: %s", resolveErr.Kind)
	}
	return err
}
_ = binding
```

The UUID must identify the exact originating Loop. A foreign, missing, or
exited Loop does not fall back to another model. The live binding is cloned for
the invocation and its runtime identity is recorded only in internal terminal
audit.

Proof: [current Loop resolver](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [session resolver](https://github.com/looprig/harness/blob/main/internal/sessionruntime/hustle.go).

## Named inference

`hustle.WithNamedInference(client, model)` validates and freezes a dedicated
client/model pair. Every bound invocation uses a clone of the model without a
Loop lookup. The descriptor records `ModelSourceNamed`, `NamedModelKey`, and
`NamedModelPolicyRevision`; it does not record provider secrets.

| Source | Definition fields | Resolve requirement |
| --- | --- | --- |
| `ModelSourceCurrentLoop` | `ModelSource` only | Non-nil resolver and nonzero originating Loop ID. |
| `ModelSourceNamed` | `NamedModelKey` and `NamedModelPolicyRevision` | Frozen client/model; Loop ID is not used for selection. |

Proof: [named/current options](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [model selection tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Binding and errors

`Definition.Bind(ctx, Bindings)` rejects a nil context and requires
`Bindings.Models` for current Loop definitions. `ResolveError.Kind` is one of
`ResolveInvalidContext`, `ResolveInvalidLoopID`, `ResolveModelFailed`, or
`ResolveInvalidBinding`. Use `errors.As` and preserve the cause for trusted
diagnostics; never expose client or model endpoint details to model output.

Proof: [Bind and Resolve errors](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_errors.go) and [resolution tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Source and proof

- [Model source options and resolver](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go)
- [Hustle binding in Session](https://github.com/looprig/harness/blob/main/internal/sessionruntime/hustle.go)
- [Model selection proof](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go)
