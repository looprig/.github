---
id: guides/inference/structured-output/decoding
title: Typed decoding
description: Extract structured JSON and strictly decode it into an unchanged-on-error struct.
audience: developer
section: guides
order: 62
publication: released
proofs:
  api-surface: [release-github-com-looprig-inference]
  proof: [release-github-com-looprig-inference]
---

# Typed decoding

Use `StructuredResult` when you need raw compact JSON. Use `DecodeOutput` or `DecodeMessageOutput` when the result should populate a concrete struct.

## API surface

```go
func StructuredResult(resp *Response) (json.RawMessage, error)
func StructuredMessageResult(msg *content.AIMessage) (json.RawMessage, error)
func DecodeOutput(resp *Response, out any) error
func DecodeMessageOutput(msg *content.AIMessage, out any) error
```

```go
type Answer struct {
	Answer     string  `json:"answer"`
	Confidence float64 `json:"confidence"`
}

var answer Answer
if err := inference.DecodeOutput(response, &answer); err != nil {
	return err
}
fmt.Println(answer.Answer, answer.Confidence)
```

The target must be a non-nil pointer to a struct. The decoder uses `DisallowUnknownFields`, rejects trailing JSON, and decodes into scratch storage first. If decoding fails, the caller's target remains unchanged. Missing struct fields are not domain validation errors; add required-field checks after decoding.

`StructuredMessageResult` accepts thinking blocks around the representation, joins ordered text fragments, compacts whitespace, and returns independently owned bytes. It also accepts exactly one reserved terminal tool input. Mixed text and tool representations are rejected.

## Proof

- Source: [`inference/structured_result.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result.go)
- Tests: [`inference/structured_result_test.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result_test.go), [`inference/structured_result_internal_test.go`](https://github.com/looprig/inference/blob/v0.13.0/structured_result_internal_test.go)

Related: [OutputSchema](/docs/guides/inference/structured-output/output-schema), [Structured-output errors](/docs/guides/inference/structured-output/errors), [Assistant messages](/docs/guides/inference/responses/assistant-message).
