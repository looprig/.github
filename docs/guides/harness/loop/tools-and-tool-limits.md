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
	Iterations   int
	Calls        int
	Parallel     int
	ResultBytes  int
	CaptureBytes int
}
```

`WithTools` and `WithToolMiddlewares` append values and defensively copy their
input slices. A `tool.Definition` must have a nonblank name. Every produced
tool name is checked during `Define` and again after factories run during
`Bind`; the exact structured-output control name is reserved. A nil factory,
nil built tool, bad `ToolInfo`, duplicate produced name, or factory error is a
typed binding failure.

## Limits

Zero limits receive the defaults shown below. For `Iterations` and `Calls`, set
`loop.Unlimited` (`-1`) to remove that per-turn cap; values below `-1` are
invalid. Negative `Parallel`, `ResultBytes`, or `CaptureBytes` values, and a
positive byte limit below 256, are rejected with
`DefinitionInvalidToolLimits`. A mode may override `Iterations` and `Calls`
with a positive value or `loop.Unlimited`; it may override the other fields
only with positive values.

| Field | Meaning | Default |
| --- | --- | ---: |
| `Iterations` | maximum tool steps (model and tool round trips) in one turn | 25 |
| `Calls` | maximum tool calls in one turn | 100 |
| `Parallel` | maximum concurrent calls in one batch | 8 |
| `ResultBytes` | maximum model-visible bytes of one tool result | unbounded |
| `CaptureBytes` | maximum bytes of one tool result retained durably | 8 MiB (`loop.DefaultToolResultCaptureBytes`) |

An unlimited turn still ends when the model stops, or on interrupt, shutdown,
or context cancellation. A model that keeps calling tools has no other
per-turn bound, so use the sentinel only with an application-level cancellation
policy. It does not remove the parallel, result, or capture limits.

When a result exceeds `ResultBytes`, the model sees a bounded preview plus a
marker instead of the full text. Without capture, the preview keeps the head
and tail and the marker states how many bytes were omitted; the omitted bytes
are not kept anywhere. When the Rig wires capture with
`rig.WithToolResultObjects`, the full result, up to `CaptureBytes`, is stored as
a session object, `StepDone.Captures` records it, and the marker names
`read_tool_result` only when the mode has a real reader bound
(`BoundMode.ToolResultReaderBound`). See
[Tool result capture](/docs/guides/harness/loop/tool-result-capture).

The base definition's limits apply to the implicit base mode. For a declared
mode, `loop.Unlimited` overrides `Iterations` or `Calls` just as a positive
value does. The other fields take positive overrides only; zero keeps the base
value. The returned `BoundMode.ToolLimits` is a value copy.

## Binding and ownership

`Definition.Bind(ctx, bindings)` validates nonzero `SessionID` and `LoopID`
before invoking any factory. It caches equal tool definitions within that one
binding, so the same immutable factory used by the base and a mode builds once
and its instances are reused. Different definitions that produce the same
model-facing name are rejected. `bindings.ExtraTools`, when supplied by a
composition root, is appended to the base and every mode and is subject to the
same collision checks. A definition that declares
`tool.RequiresToolResultReader` receives `tool.Bindings.ToolResults`, a reader
scoped to this session and loop, and binding fails when that reader is nil.

`Definition.ToolDefinitions()` lists every declared tool definition across the
base tool set and all modes, deduplicated by name, without binding. A
composition can pass it to `tool.ProjectCaptureSafety` to learn whether every
tool's retained output is bounded before any session exists.

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
