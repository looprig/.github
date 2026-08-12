---
id: guides/harness/hustles/define-a-hustle
title: Define a Hustle
description: Describe hustle.Define and immutable Hustle configuration without a public run method.
audience: developer
section: guides
order: 14
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  constructor-apis: [release-github-com-looprig-harness]
  definition-descriptor: [release-github-com-looprig-harness]
  bind-before-a-facility-uses-it: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Define a Hustle

`hustle.Define` validates one immutable definition. The definition is a
configuration and policy identity. A supported Harness facility binds it to a
session; application code does not execute an arbitrary definition directly.

```go
// Every option is explicit. The definition retains no caller-owned slices.
summary, err := hustle.Define(
	hustle.WithName("context.compact"),
	hustle.WithParticipation(hustle.ParticipationBlocking),
	hustle.WithTimeout(5*time.Second),
	hustle.WithLimits(hustle.Limits{InputBytes: 1 << 20, OutputBytes: 1 << 20}),
	hustle.WithCurrentLoopModel(),
	hustle.WithSystemPrompt("Summarize the earlier conversation.", "prompt-v1"),
	hustle.WithPolicyRevision("policy-v1"),
)
if err != nil {
	return fmt.Errorf("define hustle: %w", err)
}
_ = summary
```

## Constructor APIs

| API | Purpose |
| --- | --- |
| `hustle.Define(opts ...hustle.Option) (hustle.Definition, error)` | Validates and freezes the definition. |
| `hustle.WithName(hustle.Name) hustle.Option` | Stable registration name; trimmed emptiness and `_looprig.` names are rejected. |
| `hustle.WithParticipation(hustle.Participation) hustle.Option` | Selects blocking or background lane. |
| `hustle.WithTimeout(time.Duration) hustle.Option` | Requires a positive per-invocation timeout. |
| `hustle.WithLimits(hustle.Limits) hustle.Option` | Requires positive serialized input and output byte bounds. |
| `hustle.WithCurrentLoopModel() hustle.Option` | Resolves the originating Loop model for every invocation. |
| `hustle.WithNamedInference(inference.Client, model.Model) hustle.Option` | Freezes a validated client and model. |
| `hustle.WithSystemPrompt(string, string) hustle.Option` | Freezes prompt bytes and a public prompt revision. |
| `hustle.WithPolicyRevision(string) hustle.Option` | Names parser, policy, and finalization behavior. |
| `hustle.WithOutputSchema(inference.OutputSchema) hustle.Option` | Freezes optional structured-output policy. |
| `hustle.WithEvidenceTools(hustle.EvidenceToolPolicy) hustle.Option` | Enables a bounded, read-only evidence loop. |
| `hustle.WithRetryPolicy(hustle.RetryPolicy) hustle.Option` | Enables the one classified retry only for eligible evidence definitions. |

Proof: [Hustle options and Define](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [definition validation tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Definition descriptor

`Definition.Descriptor()` is the secret-free identity used by Rig validation
and internal audit. It contains these exact fields:

| Field group | Fields |
| --- | --- |
| Registration | `Name`, `Participation`, `ModelSource`, `PolicyRevision`, `TimeoutNanos`, `Limits` |
| Named model | `NamedModelKey`, `NamedModelPolicyRevision` |
| Prompt and output | `PromptRevision`, `PromptSHA256`, `OutputSchemaName`, `OutputSchemaSHA256`, `StructuredOutputRevision` |
| Evidence | `EvidenceToolPolicyRevision`, `EvidenceToolDefinitionsSHA256`, `EvidenceProducedToolNamesSHA256`, `EvidenceToolLimits`, `EvidenceToolDefinitionCount`, `StructuredOutputWithTools` |
| Retry | `RetryPolicy` |

The descriptor contains hashes and revisions, not raw prompts, provider
clients, endpoints, or output bytes. `Definition.PolicyRevision()` is the
frozen digest of this behavior.

Proof: [DefinitionDescriptor](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [descriptor tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Bind before a facility uses it

```go
// package hustle
type Bindings struct {
	Models ModelResolver
}

type BoundDefinition interface {
	Name() Name
	Participation() Participation
	Timeout() time.Duration
	Limits() Limits
	Descriptor() DefinitionDescriptor
	ResolveInference(context.Context, uuid.UUID) (InferenceBinding, error)
	SystemPrompt() string
	OutputSchema() (*inference.OutputSchema, bool)
	EvidenceToolPolicy() (EvidenceToolPolicy, bool)
	RetryPolicy() RetryPolicy
	BindEvidenceTools(context.Context, EvidenceBindings) ([]BoundEvidenceTool, error)
}
```

`Definition.Bind` validates context and requires a model resolver for current
Loop definitions. The bound view clones mutable model and output policy values.
Its sealed interface prevents application implementations from substituting a
definition with different policy identity.

Proof: [binding interface and clone behavior](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [binding tests](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_test.go).

## Source and proof

- [Hustle definition implementation](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go)
- [Definition error kinds](https://github.com/looprig/harness/blob/main/pkg/hustle/definition_errors.go)
- [Run data types](https://github.com/looprig/harness/blob/main/pkg/hustle/run.go)
