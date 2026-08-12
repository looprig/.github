---
id: guides/harness/loop/access-gates
title: Access Gates
description: Describe access-gate configuration for effectful tools declared by a loop definition.
audience: developer
section: guides
order: 12
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  access-contract: [release-github-com-looprig-harness]
  fail-closed-execution: [release-github-com-looprig-harness]
  per-call-capabilities: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Access Gates

An access gate authorizes one fully prepared tool request:

```go
type AccessGate interface {
	Authorize(context.Context, tool.Request) (gate.Resolution, error)
}

func WithAccessGate(access AccessGate) Option
func WithPolicyRevision(revision string) Option
```

`AccessGate` is the loop's narrow policy seam. The implementation evaluates the
complete typed request once and returns fresh execution-bound grant tokens. A
denial is represented by an unapproved resolution with nil error; any error is
fail-closed. Implementations must be safe for concurrent calls. A nil gate is
rejected, and configuring a gate without a nonblank policy revision fails at
`Define`.

## Fail-closed execution

No configured gate does not mean unrestricted tools. The runner denies tool
execution when there is no gate. That preserves the safe default for definitions
that forgot to wire policy. An interactive gate may request one combined human
approval through the loop's per-call capability; `loop.GateApprover()` returns
an adapter for `gate.NewInteractiveEvaluator` and fails with
`*loop.ApprovalContextError` outside a live tool call.

```go
type gateImpl struct{ /* consumer-owned policy */ }

func (g gateImpl) Authorize(ctx context.Context, req tool.Request) (gate.Resolution, error) {
	// Evaluate request fields and return gate.Resolution{Approved: ...}.
	return gate.Resolution{}, nil
}

definition, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
	loop.WithAccessGate(gateImpl{}),
	loop.WithPolicyRevision("access-policy-v3"),
)
```

The access policy belongs to the consumer. Harness does not infer a sandbox
posture, attenuate one loop's gate for another, or copy a gate into the
definition's public fields. A composition root may use
`OverrideBoundAccess(bound, access)` to replace the gate for one bound loop;
passing nil is rejected and the immutable definition is unchanged.

## Per-call capabilities

Tool code can receive the prepared execution contract with
`PreparedCallFromContext`, inspect the provider tool-use ID with
`ToolUseIDFrom`, or request user input with `RequestUserInput`. These values are
installed only for the current live call. `RequestUserInput` outside a live
request returns `*loop.UserInputContextError`; approval outside one returns
`*loop.ApprovalContextError`. Do not put grants in ambient process state.

```go
prepared, ok := loop.PreparedCallFromContext(ctx)
if !ok {
	return tool.TextResult("not running under a prepared call"), nil
}
id, _ := loop.ToolUseIDFrom(ctx)
log.Printf("execution=%s provider-tool-use=%s", prepared.ExecutionID, id)
```

## Source and proof

- [Access gate and fail-closed contract](https://github.com/looprig/harness/blob/main/pkg/loop/deps.go)
- [Access option, bound override, and capability adapters](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Tool context capability helpers](https://github.com/looprig/harness/blob/main/pkg/loop/tool_context.go)
- [Access binding and fail-closed tests](https://github.com/looprig/harness/blob/main/pkg/loop/access_test.go)
