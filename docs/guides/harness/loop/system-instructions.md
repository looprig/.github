---
id: guides/harness/loop/system-instructions
title: System Instructions
description: Describe system instructions configured on a Loop.
audience: developer
section: guides
order: 9
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  system-and-mode: [release-github-com-looprig-harness]
  effective-system: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# System Instructions

The base system text is configured with:

```go
func WithSystem(system string) Option
```

It is stored as immutable definition state. A mode can add a mode-local
`Instructions` string. The runtime never mutates the base prompt when selecting
a mode.

## Effective system

Use the exported composition rule when a consumer needs to reproduce the exact
request identity:

```go
func EffectiveSystem(system, instructions string) string
```

The result is `instructions` when the base is empty, `system` when mode
instructions are empty, and `system + "\n\n" + instructions` otherwise.
`BoundDefinition.EffectiveSystem()` applies the same rule to its selected mode.
This byte-for-byte equality matters because the Rig fingerprints the effective
system text for restore compatibility.

| Input | Result |
| --- | --- |
| `system=""`, `instructions=""` | `""` |
| `system="base"`, `instructions=""` | `"base"` |
| `system=""`, `instructions="mode"` | `"mode"` |
| `system="base"`, `instructions="mode"` | `"base\n\nmode"` |

```go
definition, err := loop.Define(
	loop.WithName("assistant"),
	loop.WithInference(client, selectedModel),
	loop.WithSystem("You are a careful project assistant."),
	loop.WithModes(loop.Mode{
		Name:         "review",
		Instructions: "Explain risks before proposing edits.",
	}),
	loop.WithInitialMode("review"),
)
if err != nil {
	return err
}
bound, err := definition.Bind(ctx, bindings)
if err != nil {
	return err
}
fmt.Println(bound.EffectiveSystem())
```

The definition's `PolicyRevision` includes system and mode instructions. A
description or display name is presentation metadata; `WithDescription` is
included in Rig topology identity because it is injected into delegate
capabilities, while `WithDisplayName` is not an execution-policy input.

## Source and proof

- [System options, effective composition, and bound accessors](https://github.com/looprig/harness/blob/main/pkg/loop/definition.go)
- [System and initial-mode fingerprint tests](https://github.com/looprig/harness/blob/main/pkg/loop/definition_test.go)
