---
id: guides/inference/api-formats/index
title: Overview
description: Select a wire dialect and keep model identity separate from provider policy.
audience: developer
section: guides
order: 74
publication: released
proofs:
  labels: [release-github-com-looprig-inference]
  routing: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Overview

`model.APIFormat` names a wire dialect. It is intentionally an open string:
unknown values are valid in the model package when a caller supplies matching
codec and router implementations.

## Labels

```go
type APIFormat string

const (
	APIFormatOpenAI            APIFormat = "openai"
	APIFormatOpenAIResponses   APIFormat = "openai-responses"
	APIFormatAnthropic         APIFormat = "anthropic"
	APIFormatGemini            APIFormat = "gemini"
	APIFormatBedrockConverse   APIFormat = "bedrock-converse"
)
```

The label does not carry credentials, endpoint defaults, or provider policy.
`Model.Validate` checks structural safety, while composition code binds the
label to a codec, router, and credential source.

## Routing

| Format | Route helper | Invoke | Stream |
| --- | --- | --- | --- |
| OpenAI Chat | `route.StaticChat("/chat/completions")` | same path | same path, body flag |
| OpenAI Responses | `route.StaticChat("/responses")` | same path | same path, body flag |
| Anthropic | `route.StaticChat("/messages")` | same path | same path, body flag |
| Gemini | `route.GeminiGenerateContent()` | `:generateContent` | `:streamGenerateContent?alt=sse` |
| Bedrock Converse | caller-supplied route | same body | route/API operation chooses stream |

## Source and proof

- [`model/apiformat.go`](https://github.com/looprig/inference/blob/v0.14.0/model/apiformat.go)
- [`model/model.go`](https://github.com/looprig/inference/blob/v0.14.0/model/model.go)
- [`route/route.go`](https://github.com/looprig/inference/blob/v0.14.0/route/route.go)

Run `go test ./model ./route`.
