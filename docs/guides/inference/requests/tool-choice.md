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
type ToolChoiceMode uint8

const (
	ToolChoiceModeAuto ToolChoiceMode = iota
	ToolChoiceModeRequired
	ToolChoiceModeNamed
)

// ToolChoice is an opaque comparable value; the constructors are the only way in.
type ToolChoice struct{ /* unexported */ }

func ToolAuto() ToolChoice
func ToolRequired() ToolChoice
func ToolNamed(name string) ToolChoice

func (c ToolChoice) Mode() ToolChoiceMode
func (c ToolChoice) Named() (name string, ok bool)
```

```go
request := inference.Request{
	Tools: []inference.Tool{{Name: "lookup", Description: "Read a record."}},
	ToolChoice: inference.ToolRequired(),
}
if err := inference.ValidateRequestFeatures(request); err != nil {
	panic(err)
}
```

`ToolRequired()` without at least one tool returns `*StructuredOutputConflictError` with feature `tool_choice_required_without_tools`. `ToolNamed(name)` whose name matches no declared tool returns the same typed error with feature `tool_choice_tool_undeclared_name`. `ToolAuto()` is the zero value, does not require tools, and leaves provider-specific automatic behavior unchanged. The forced name cannot be separated from the named variant: `Named()` reports `ok` false for every other mode.

## Tool result loop

Required choice does not execute a tool for you. Read the assistant's `ToolUseBlock`, validate its raw input, run the tool, then append a matching [ToolResultMessage](/docs/guides/inference/messages/message-types/tool-result-message) before the next request.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go) covers the required-without-tools and unknown-value cases.

Related: [Tool definitions](/docs/guides/inference/requests/tools), [ToolUseBlock](/docs/guides/inference/content-blocks/tool-use).
