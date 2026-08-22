---
id: guides/inference/responses/finish-reasons
title: Finish reasons
description: Interpret the provider-neutral reason an assistant stopped producing output.
audience: developer
section: guides
order: 43
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Finish reasons

`stream.FinishReason` normalizes provider stop metadata without pretending every provider has the same vocabulary.

## API surface

```go
type FinishReason string

const (
	FinishReasonUnknown       FinishReason = ""
	FinishReasonStop          FinishReason = "stop"
	FinishReasonLength        FinishReason = "length"
	FinishReasonToolUse       FinishReason = "tool_use"
	FinishReasonContentFilter FinishReason = "content_filter"
)
```

| Reason | Caller meaning |
| --- | --- |
| `FinishReasonUnknown` | Provider omitted or did not map a reason |
| `FinishReasonStop` | Normal stop; structured text can be extracted |
| `FinishReasonLength` | Output was cut by a limit; structured extraction fails closed |
| `FinishReasonToolUse` | Assistant representation is a tool call and may require continuation |
| `FinishReasonContentFilter` | Provider stopped for filtering; structured extraction fails closed |

```go
switch response.FinishReason {
case stream.FinishReasonStop:
	// Safe to inspect normal assistant output.
case stream.FinishReasonToolUse:
	// Continue the tool loop when the representation is a tool call.
default:
	// Handle unknown, length, and filtered output explicitly.
}
```

Structured output additionally rejects non-empty future reasons with `StructuredOutputFinishReasonOther` rather than retaining unbounded provider input.

## Proof

- Source: [`inference/stream/finishreason.go`](https://github.com/looprig/inference/blob/main/stream/finishreason.go), [`inference/structured_result.go`](https://github.com/looprig/inference/blob/main/structured_result.go)
- Tests: [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/main/structured_result_test.go), [`inference/stream/stream_test.go`](https://github.com/looprig/inference/blob/main/stream/stream_test.go)

Related: [Structured output](/docs/guides/inference/structured-output), [Terminal stream results](/docs/guides/inference/streaming/terminal-results).
