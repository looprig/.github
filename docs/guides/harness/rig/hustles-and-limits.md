---
id: guides/harness/rig/hustles-and-limits
title: Hustles and Limits
description: Describe Hustles and resource limits registered on a Rig.
audience: developer
section: guides
order: 13
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  hustle-registration: [release-github-com-looprig-harness]
  limits-and-ownership: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Hustles and Limits

A Hustle is a named, bounded unit of auxiliary inference or evidence work. A
Rig registers immutable `hustle.Definition` values and the lane limits that
bound their live execution:

```go
func WithHustles(definitions ...hustle.Definition) Option
func WithHustleLimits(limits HustleLimits) Option

type HustleLimits struct {
	BlockingConcurrent   int
	BlockingQueued       int
	BackgroundConcurrent int
	BackgroundQueued     int
	AuditTimeout         time.Duration
	FinalizationTimeout  time.Duration
	WorkerDrainTimeout   time.Duration
}
```

`MaxHustleQueued` is 10,000. Concurrent limits and all three timeouts must be
positive; queue limits must be between zero and that maximum. Missing limits
when any Hustle is registered returns `DefinitionMissingHustleLimits`; limits
without Hustles return `DefinitionUnusedHustleLimits`.

## Hustle registration

The `hustle` package's public definition is constructed with its own immutable
options. Rig validation uses `Name`, `PolicyRevision`, and the descriptor to
reject zero/duplicate definitions. A compaction policy's `Hustle` name must
match one registered definition and its model source/participation must be
compatible with compaction's use.

```go
compact, err := hustle.Define(
	hustle.WithName("context.compact"),
	hustle.WithParticipation(hustle.ParticipationBlocking),
	hustle.WithCurrentLoopModel(),
	hustle.WithTimeout(5*time.Second),
	hustle.WithLimits(hustle.Limits{InputBytes: 1 << 20, OutputBytes: 1 << 20}),
	hustle.WithSystemPrompt("Summarize the transcript.", "prompt-v1"),
	hustle.WithPolicyRevision("compact-v1"),
)
if err != nil { return err }
runtime, err := rig.Define(
	rig.WithHustles(compact),
	rig.WithHustleLimits(rig.HustleLimits{
		BlockingConcurrent: 2, BlockingQueued: 8,
		BackgroundConcurrent: 1, BackgroundQueued: 4,
		AuditTimeout: time.Second, FinalizationTimeout: time.Second,
		WorkerDrainTimeout: 2 * time.Second,
	}),
	// loop, primer, and store options also required
)
```

## Limits and ownership

Blocking and background are independent lanes. Queued work is bounded before
worker allocation; audit, finalization, and drain operations have their own
deadlines. The Rig retains immutable definitions and scalar limits; the session
runtime owns workers, queues, run IDs, and shutdown. Changing limits or Hustle
definitions changes topology fingerprint when the definitions are registered,
while permission-review breaker thresholds are operational tuning and are not
part of Rig identity.

## Source and proof

- [Rig Hustle registration and cross-validation](https://github.com/looprig/harness/blob/main/pkg/rig/definition.go)
- [Rig Hustle options and limit bounds](https://github.com/looprig/harness/blob/main/pkg/rig/options.go)
- [Hustle definition options and descriptor](https://github.com/looprig/harness/blob/main/pkg/hustle/definition.go)
- [Hustle registration and boundary tests](https://github.com/looprig/harness/blob/main/pkg/rig/hustle_test.go)
