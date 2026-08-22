---
id: guides/inference/responses/index
title: Overview
description: Read complete provider-neutral assistant output and terminal metadata.
audience: developer
section: guides
order: 41
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Responses overview

`inference.Response` is the complete result of `Client.Invoke`. It keeps the assistant message separate from normalized usage and terminal metadata so callers do not need to parse provider envelopes.

## API surface

```go
type Response struct {
	Message      *content.AIMessage
	Usage        *content.Usage
	Model        string
	FinishReason stream.FinishReason
	Attempts     int
}
```

| Field | Meaning |
| --- | --- |
| `Message` | Assistant turn with ordered text, thinking, and tool-use blocks |
| `Usage` | Optional normalized token counts |
| `Model` | Resolved provider model name returned by the serving path |
| `FinishReason` | Provider-neutral terminal reason |
| `Attempts` | Retry establishment count; zero if uncounted, one for first-try success |

```go
response, err := client.Invoke(ctx, req)
if err != nil {
	return err
}
if response.Message != nil {
	for _, block := range response.Message.Blocks {
		if text, ok := block.(*content.TextBlock); ok {
			fmt.Println(text.Text)
		}
	}
}
```

A nil message or unknown finish reason is representable and should be handled explicitly. Structured-output helpers apply additional representation checks before returning data.

## Proof

- Source: [`inference/client.go`](https://github.com/looprig/inference/blob/main/client.go)
- Tests: [`inference/client_test.go`](https://github.com/looprig/inference/blob/main/client_test.go), [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/main/structured_result_test.go)

Related: [Assistant messages](/docs/guides/inference/responses/assistant-message), [Finish reasons](/docs/guides/inference/responses/finish-reasons), [Response usage](/docs/guides/inference/responses/usage).
