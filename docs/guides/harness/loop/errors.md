---
id: guides/harness/loop/errors
title: Errors
description: Describe Loop definition and runtime errors.
audience: developer
section: guides
order: 23
publication: released
proofs:
  start: [release-github-com-looprig-harness]
  definition-errors: [release-github-com-looprig-harness]
  binding-errors: [release-github-com-looprig-harness]
  change-errors: [release-github-com-looprig-harness]
  fail-closed-auxiliary-errors: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Errors

Loop errors are typed at each public boundary. Use `errors.As` and inspect the
closed kind fields; error strings are for logs, not program control.

## Definition errors

```go
type DefinitionError struct {
	Kind  DefinitionErrorKind
	Field string
	Value string
	Cause error
}
```

`DefinitionErrorKind` includes missing/invalid name, client, model, tool,
limits, drain timeout, middleware, access gate, engine, runtime context,
delegate, delegation, mode, initial mode, policy revision, context counter,
inference capability, context policy, context transport, compaction, and output
schema categories. Duplicate singleton options use `DefinitionDuplicateOption`.
`Unwrap` preserves the lower-level validator error where present.

## Binding errors

```go
type BindError struct {
	Kind  BindErrorKind
	Name  string
	Index int
	Cause error
}
```

`Definition.Bind` returns `BindInvalidDefinition` for a zero definition or bad
tool metadata, `BindInvalidContext` for a nil context,
`BindInvalidSessionID`/`BindInvalidLoopID` before factories run, and
`BindDuplicateDefinitionName`/`BindDuplicateToolName` for collisions. It also
reports invalid access gates and runtime binding values. `Index` identifies the
offending definition or built instance without rendering request bytes.

```go
var bindErr *loop.BindError
if errors.As(err, &bindErr) {
	fmt.Printf("bind kind=%s name=%q index=%d\n", bindErr.Kind, bindErr.Name, bindErr.Index)
}
```

## Change errors

`Controller.SetMode` and `Controller.Change` return:

| Kind | Meaning |
| --- | --- |
| `ChangeInvalidMode` | name is not base or predeclared mode |
| `ChangeInvalidModel` | model/key validation failed |
| `ChangeInvalidEffort` | effort is not admitted |
| `ChangeNoChanges` | empty or nonselecting batch |
| `ChangeLoopShuttingDown`, `ChangeLoopExited` | lifecycle no longer admits control |
| `ChangeContextDone` | caller cancelled before commit |
| `ChangeDurableAppendFailed` | required enduring append failed; state was not applied |
| `ChangeInvalidExternalSource`, `ChangeInvalidExternalGeneration` | external slot identity invalid |
| `ChangeExternalBuildFailed`, `ChangeExternalToolCollision` | atomic external replacement refused |
| `ChangeExternalToolsUnsupported` | foreign loop owns its tools |

Inspect `ChangeError.Mode`, `ChangeError.Tool`, and `ChangeError.Cause` rather
than parsing the message. Every refusal preserves the prior configuration.

## Fail-closed auxiliary errors

`ContextLimitUnknownError`, `ContextLimitError`,
`ContextObservationPolicyError`, `CompactionPolicyError`,
`ContextTransportNotDeclaredError`, `UserInputContextError`, and
`ApprovalContextError` all represent an explicit boundary failure. A missing
capability is not converted into an allow or an invented default.

## Source and proof

- [Definition and binding error types](https://github.com/looprig/harness/blob/main/pkg/loop/definition_errors.go)
- [Controller change error taxonomy](https://github.com/looprig/harness/blob/main/pkg/loop/controller.go)
- [Context and compaction typed errors](https://github.com/looprig/harness/blob/main/pkg/loop/context.go)
- [Error behavior tests](https://github.com/looprig/harness/blob/main/pkg/loop/errors_test.go)
