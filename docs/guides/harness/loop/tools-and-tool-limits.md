---
id: guides/harness/loop/tools-and-tool-limits
title: Tools and Tool Limits
description: Describe Loop tools and their execution limits.
audience: developer
section: guides
order: 11
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  tool-definitions: [release-github-com-looprig-harness]
  limits: [release-github-com-looprig-harness]
  binding: [release-github-com-looprig-harness]
  binding-and-ownership: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Tools and Tool Limits

Tools are declared as factories, not live instances:

```go
func WithTools(defs ...tool.Definition) Option
func WithToolMiddlewares(middlewares ...tool.ToolMiddleware) Option
func WithToolLimits(limits ToolLimits) Option

type ToolLimits struct {
	Iterations int
	Calls      int
	Parallel   int
}
```

`WithTools` and `WithToolMiddlewares` append values and defensively copy their
input slices. A `tool.Definition` must have a nonblank name. Every produced
tool name is checked during `Define` and again after factories run during
`Bind`; the exact structured-output control name is reserved. A nil factory,
nil built tool, bad `ToolInfo`, duplicate produced name, or factory error is a
typed binding failure.

## Limits

Zero limits receive the fixed defaults shown below. Negative values are rejected
by `DefinitionInvalidToolLimits`; a mode may override only positive fields.

| Field | Meaning | Default |
| --- | --- | ---: |
| `Iterations` | maximum tool-loop iterations in one turn | 25 |
| `Calls` | maximum tool calls in one turn | 100 |
| `Parallel` | maximum concurrent calls in one batch | 8 |

The base definition's limits apply to the implicit base mode. For a declared
mode, `resolveLimits` takes each positive mode field and otherwise keeps the
base value. The returned `BoundMode.ToolLimits` is a value copy.

## Binding and ownership

`Definition.Bind(ctx, bindings)` validates nonzero `SessionID` and `LoopID`
before invoking any factory. It caches equal tool definitions within that one
binding, so the same immutable factory used by the base and a mode builds once
and its instances are reused. Different definitions that produce the same
model-facing name are rejected. `bindings.ExtraTools`, when supplied by a
composition root, is appended to the base and every mode and is subject to the
same collision checks.

```go
bound, err := definition.Bind(ctx, tool.Bindings{
	SessionID: sessionID,
	LoopID:    loopID,
	// Workspace and other binding fields are supplied by the Rig/session.
})
if err != nil {
	var bindErr *loop.BindError
	if errors.As(err, &bindErr) {
		log.Printf("bind refused: %s", bindErr.Kind)
	}
	return err
}
for _, candidate := range bound.Tools() {
	info, _ := candidate.Info(ctx)
	log.Println(info.Name)
}
```

Returned `Tools`, `Modes`, and middleware slices are defensive copies. The
invokable tool instances themselves are the binding-owned live collaborators;
the caller must not reuse them in another session.

## Source and proof

- [Tool options, limits, validation, and binding](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [Mode limit defaults and resolution](https://github.com/looprig/harness/blob/main/pkg/loop/mode.go)
- [Tool binding and collision tests](https://github.com/looprig/harness/blob/main/pkg/loop/definition_test.go)
