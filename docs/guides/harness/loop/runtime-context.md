---
id: guides/harness/loop/runtime-context
title: Runtime Context
description: Describe runtime context supplied while a bound loop runtime runs.
audience: developer
section: guides
order: 16
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  provider-contract: [release-github-com-looprig-harness]
  per-turn-behavior: [release-github-com-looprig-harness]
  ownership-and-limits: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Runtime Context

Runtime context is a volatile per-turn provider, not a second system prompt
stored in the session definition:

```go
type RuntimeContextProvider interface {
	Blocks(context.Context) []content.Block
}

func WithRuntimeContext(provider RuntimeContextProvider) Option
```

The provider commonly supplies date, current directory, or Git-state blocks.
Harness calls it at the turn tail and appends returned blocks to that request's
context. A nil or empty slice appends nothing.

## Per-turn behavior

The callback receives the turn context and must be cheap and non-fatal. The
contract deliberately has no error return: an implementation failure should
degrade to fewer blocks, never fail the turn or cause a retry storm. The
provider must not mutate a slice it returned after the call; the runtime treats
the blocks as input for that request.

```go
type gitContext struct{}

func (gitContext) Blocks(ctx context.Context) []content.Block {
	// Read-only, bounded collection. Return nil if the context is cancelled or
	// the optional source is unavailable.
	return []content.Block{&content.TextBlock{Text: "cwd: /work"}}
}

definition, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
	loop.WithRuntimeContext(gitContext{}),
	loop.WithPolicyRevision("runtime-context-v2"),
)
```

Because the provider is an opaque function-valued collaborator, configuring it
requires `WithPolicyRevision`. The revision is included in context request
fingerprints and the definition policy revision; a provider behavior change
must use a new revision. The provider is not copied into a durable event and
must be rebuilt by the composition root on restore.

## Ownership and limits

`Definition` retains the provider interface; it does not assume ownership of
external resources the provider uses. The provider should honor `ctx.Done()`
and enforce its own byte/time bounds. Do not put credentials or unbounded file
contents in runtime blocks. If context counting is configured, the provider's
revision is one of the inputs to `loop.RequestFingerprint`, so changing blocks
cannot masquerade as the same measured request.

## Source and proof

- [RuntimeContextProvider contract and option](https://github.com/looprig/harness/blob/main/pkg/loop/runtime_context.go)
- [Runtime-context validation and callback contract tests](https://github.com/looprig/harness/blob/main/pkg/loop/runtime_context_test.go)
- [Request fingerprint inputs](https://github.com/looprig/harness/blob/main/pkg/loop/compaction_policy.go)
