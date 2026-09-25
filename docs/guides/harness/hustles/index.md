---
id: guides/harness/hustles/index
title: Overview
description: Register bounded auxiliary inference used by Harness facilities such as compaction and permission review.
audience: developer
section: guides
order: 13
publication: released
proofs:
  when-to-use: [release-github-com-looprig-harness]
  configure-a-hustle: [release-github-com-looprig-harness]
  lifecycle: [release-github-com-looprig-harness]
  restore-and-observation: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Hustles

A Hustle is an immutable, bounded auxiliary inference definition. Harness
facilities use registered definitions for focused work such as transcript
compaction or permission review. It is not a conversational Loop, a delegated
agent, or a general task queue.

## When to use

Application code configures a Hustle through the facility that needs it. There
is no public generic execution method for an arbitrary definition. Register
immutable definitions on the Rig, then invoke a supported operation such as
`Session.Compact`.

Proof: [Hustle definition boundary](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [session contract tests](https://github.com/looprig/harness/blob/main/pkg/session/contracts_test.go).

## Configure a Hustle

```go
compactor, err := hustle.Define(
	hustle.WithName("context.compact"),
	hustle.WithParticipation(hustle.ParticipationBlocking),
	hustle.WithTimeout(5*time.Second),
	hustle.WithLimits(hustle.Limits{
		InputBytes:  1024 * 1024,
		OutputBytes: 1024 * 1024,
	}),
	hustle.WithCurrentLoopModel(),
	hustle.WithSystemPrompt("Summarize the earlier conversation.", "v1"),
	hustle.WithPolicyRevision("v1"),
)
if err != nil {
	return fmt.Errorf("define compaction hustle: %w", err)
}

runtime, err := rig.Define(
	rig.WithLoops(assistant),
	rig.WithPrimers("assistant"),
	rig.WithSessionStore(sessions),
	rig.WithHustles(compactor),
	rig.WithHustleLimits(rig.HustleLimits{
		BlockingConcurrent: 1, BlockingQueued: 2,
		BackgroundConcurrent: 1, BackgroundQueued: 2,
		AuditTimeout: time.Second, FinalizationTimeout: time.Second,
		WorkerDrainTimeout: time.Second,
	}),
)
if err != nil {
	return fmt.Errorf("define rig: %w", err)
}
```

`WithCurrentLoopModel` resolves the originating Loop's current model for each run. `WithNamedInference` instead freezes a dedicated client and model into the Hustle definition.

Proof: [definition options](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go) and [Rig Hustle registration](https://github.com/looprig/harness/blob/main/pkg/rig/options.go).

## Lifecycle

Blocking and background definitions use separate bounded lanes. A supported
facility binds the definition, validates input, owns a RunID, persists an
internal `HustleStarted` record, admits the run, resolves inference, validates
bounded output, persists exactly one internal terminal event, and finalizes
once. Session shutdown closes Hustle admission and cancels active work before
it stops the loops, waits for owned invocations to drain, and only then closes
checkpoints, session resources, the event hub, and the session lease.

Proof: [Hustle runtime ownership](https://github.com/looprig/harness/blob/main/internal/hustleruntime/execution.go) and [lifecycle tests](https://github.com/looprig/harness/blob/main/internal/hustleruntime/ownership_test.go).

## Restore and observation

`HustleStarted`, `HustleCompleted`, and `HustleFailed` are internal-visibility
audit records. Correlate them by `RunID` through the internal audit path, not
an ordinary public Session event stream. Restore folds those records but does
not recreate an interrupted queue, worker, request, or finalizer. An unmatched
start is retained as interruption evidence and the restored Session receives a
fresh controller.

Proof: [Hustle audit events](https://github.com/looprig/harness/blob/main/pkg/event/event.go), [restore folding](https://github.com/looprig/harness/blob/main/internal/sessionruntime/hustle.go), and [restore tests](https://github.com/looprig/harness/blob/main/internal/sessionruntime/hustle_restore_test.go).

## Source and proof

- [Hustle public definitions](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go)
- [Hustle Rig options](https://github.com/looprig/harness/blob/main/pkg/rig/options.go)
- [Internal lifecycle audit](https://github.com/looprig/harness/blob/main/internal/hustleruntime/audit.go)
- [Session Hustle binding](https://github.com/looprig/harness/blob/main/internal/sessionruntime/hustle.go)
