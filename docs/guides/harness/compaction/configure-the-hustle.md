---
id: guides/harness/compaction/configure-the-hustle
title: Configure the Hustle
description: Describe the Hustle registration used by compaction.
audience: developer
section: guides
order: 17
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  definition: [release-github-com-looprig-harness]
  wire-contract: [release-github-com-looprig-harness]
  prompt-and-output-policy: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Configure the Hustle

Compaction calls one registered Hustle by name. The definition is a blocking
current-Loop Hustle so the summary uses the originating Loop's model and does
not introduce a second model authority.

## Definition

```go
compactor, err := hustle.Define(
	hustle.WithName("context.compact"),
	hustle.WithParticipation(hustle.ParticipationBlocking),
	hustle.WithTimeout(5*time.Second),
	hustle.WithLimits(hustle.Limits{InputBytes: 1 << 20, OutputBytes: 64 << 10}),
	hustle.WithCurrentLoopModel(),
	hustle.WithSystemPrompt("Return the required conversation summary XML.", "summary-prompt-v1"),
	hustle.WithPolicyRevision("summary-policy-v1"),
)
if err != nil {
	return err
}

// The Rig validates the compaction policy's Hustle name and descriptor.
runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers(string(assistant.Name())),
	rig.WithHustles(compactor),
	rig.WithHustleLimits(rig.HustleLimits{
		BlockingConcurrent: 1, BlockingQueued: 2,
		BackgroundConcurrent: 1, BackgroundQueued: 1,
		AuditTimeout: time.Second, FinalizationTimeout: time.Second,
		WorkerDrainTimeout: time.Second,
	}),
)
_ = runtime
_ = err
```

The Rig rejects a missing named Hustle with `DefinitionMissingCompactionHustle`
and rejects a nonblocking or non-current-loop descriptor with
`DefinitionIncompatibleCompactionHustle`.

Proof: [Hustle definition](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [Rig compaction validation](https://github.com/looprig/harness/blob/main/pkg/rig/definition.go).

## Wire contract

The internal adapter sends strict JSON with `version: CompactionWireV1`, the
input basis, model key, lowercase hexadecimal request fingerprint, transcript,
and `max_summary_tokens`. It accepts only an output with the same basis, model,
and fingerprint. Usage must be present, valid, positive for output tokens, and
within the policy budget.

The model result is then parsed as the exact summary XML grammar. Compaction
does not accept caller-provided summary bytes and does not expose an arbitrary
Hustle invocation to application code.

Proof: [compaction adapter](https://github.com/looprig/harness/blob/main/internal/sessionruntime/compaction_adapter.go) and [adapter tests](https://github.com/looprig/harness/blob/main/internal/sessionruntime/compaction_adapter_test.go).

## Prompt and output policy

The system prompt and its revision are part of the Hustle descriptor. Keep the
prompt stable across restore and deployments that share the same policy
revision. Output byte limits protect the adapter before XML parsing; summary
token limits protect the isolated inference result before post-replacement
counting.

Proof: [definition descriptor](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [compaction output validation](https://github.com/looprig/harness/blob/main/pkg/loop/compaction.go).

## Source and proof

- [Compaction Hustle adapter](https://github.com/looprig/harness/blob/main/internal/sessionruntime/compaction_adapter.go)
- [Hustle definition contract](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go)
- [Rig compatibility tests](https://github.com/looprig/harness/blob/main/pkg/rig/compaction_test.go)
