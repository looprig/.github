---
id: guides/inference/api-formats/bedrock-converse
title: Bedrock Converse
description: Encode Bedrock Converse tagged content, tools, documents, and terminal usage.
audience: developer
section: guides
order: 80
publication: released
proofs:
  request: [release-github-com-looprig-inference]
  validation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Bedrock Converse

`codec/bedrockconverse` speaks the model-neutral Converse request and response
shape. The model ID is deliberately absent from the body because Bedrock puts
it in the URL path.

## Request

`converseContentBlock` is a tagged union with exactly one of `Text`, `Image`,
`Document`, `ReasoningContent`, `ToolUse`, or `ToolResult` set. System content
supports text only. Images require inline bytes and one of jpeg, png, gif, or
webp. Documents can be bytes or text, require a valid name, and require a text
block in the same message. Tool schemas are validated as JSON objects and
required tool choice becomes `toolChoice.any`.

```go
body, err := bedrockconverse.EncodeRequest(req)
if err != nil {
	var unsupported *bedrockconverse.UnsupportedBlockError
	if errors.As(err, &unsupported) {
		fmt.Println(unsupported.Reason)
	}
	return err
}
_ = body
```

## Validation

The decoder rejects missing `output.message`, wrong assistant role, union
blocks with zero or multiple variants, invalid tool objects, invalid document
names, and unsupported media formats. `EncodeCountTokensInput` keeps only the
conversation, system, tools, and additional model fields accepted by the
CountTokens operation. Response usage maps Bedrock's read/write cache fields
to normalized usage; no request-side cache marker is emitted by this codec.

## Source and proof

- [`bedrockconverse/types.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/types.go)
- [`bedrockconverse/encode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/encode.go)
- [`bedrockconverse/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/decode.go)
- [`bedrockconverse/stream_test.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/bedrockconverse/stream_test.go)

Run `go test ./codec/bedrockconverse`.
