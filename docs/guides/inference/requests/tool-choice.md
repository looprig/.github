---
id: guides/inference/requests/tool-choice
title: Tool choice
description: Choose automatic tool behavior or require a tool call with typed constants.
audience: developer
section: guides
order: 37
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  tool-result-loop: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Tool choice

`ToolChoice` controls whether the model may answer normally or must choose a tool. Its zero value is automatic behavior.

## API surface

```go
type ToolChoice uint8

const (
	ToolChoiceAuto ToolChoice = iota
	ToolChoiceRequired
)
```

```go
request := inference.Request{
	Tools: []inference.Tool{{Name: "lookup", Description: "Read a record."}},
	ToolChoice: inference.ToolChoiceRequired,
}
if err := inference.ValidateRequestFeatures(request); err != nil {
	panic(err)
}
```

`ToolChoiceRequired` without at least one tool returns `*StructuredOutputConflictError` with feature `tool_choice_required_without_tools`. An unknown numeric value returns the same typed error with feature `tool_choice`. `ToolChoiceAuto` does not require tools and leaves provider-specific automatic behavior unchanged.

## Tool result loop

Required choice does not execute a tool for you. Read the assistant's `ToolUseBlock`, validate its raw input, run the tool, then append a matching [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message/) before the next request.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go) covers the required-without-tools and unknown-value cases.

Related: [Tool definitions](/docs/guides/inference/requests/tools/), [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use/).
