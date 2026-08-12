---
id: guides/tools/built-in-tools/askuser
title: AskUser
description: Ask the human a question through the Harness loop input seam.
audience: developer
section: guides
order: 11
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# AskUser

`AskUser` pauses a turn and asks the human a question. It optionally supplies a fixed `choices` list. The answer must equal one of those choices or the literal `other`, which is the escape hatch for free text. With no choices, any answer, including an empty answer, is accepted.

## Contract

The JSON shape is `{"question":"...","choices":["..."]}`. `question` must be non-empty. `Info` exposes the `AskUser` name, schema, and a description that states the tool has no filesystem or network access.

Preparation is pure: `PrepareCall` returns a request with no requirements and a nil artifact. The question travels through the `loop.RequestUserInput` seam, so asking the user is not placed behind a second permission prompt. The tool still implements the common `CallPreparer` contract so Harness can validate the call boundary.

```go
// AskUser has no workspace or network dependency. The loop provides the
// user-input callback through the invocation context.
ask := standardtools.AskUserDefinition()
built, err := ask.Build(ctx, tool.Bindings{SessionID: sessionID, LoopID: loopID})
if err != nil {
	panic(err)
}
answer, err := built[0].InvokableRun(ctx, `{"question":"Continue?","choices":["yes","no"]}`)
```

Parsing, a missing question, an answer outside the choice list, a canceled turn, or a provider failure becomes a tool-result error string. `AuditSummary` includes the question because the user sees it directly. It does not expose hidden gate state.

See [Tool Definitions, Preparation, and Results](/docs/guides/tools/core-concepts/) for the common lifecycle and Harness's [tool calls and results](/docs/guides/harness/step/tool-calls-and-results/) for the surrounding turn.

## Source

- [AskUser implementation](https://github.com/looprig/tools/blob/main/askuser/askuser.go)

## Proof

- [AskUser behavior tests](https://github.com/looprig/tools/blob/main/askuser/askuser_test.go)
- [AskUser preparation tests](https://github.com/looprig/tools/blob/main/askuser/preparecall_test.go)
