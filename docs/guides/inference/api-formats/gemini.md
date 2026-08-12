---
id: guides/inference/api-formats/gemini
title: Gemini
description: Encode Gemini GenerateContent turns, function parts, thinking, and usage.
audience: developer
section: guides
order: 79
publication: released
proofs:
  content: [release-github-com-looprig-inference]
  route-and-stream: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Gemini

`codec/geminiapi` targets `generateContent` and `streamGenerateContent`. The
request body is identical in both modes; the route selects streaming.

## Content

System text becomes `systemInstruction`. User and model turns use `contents`
with roles `user` and `model`; tool results are a user turn carrying a
`functionResponse`. Images become inline base64 or `fileData`; tool calls use
`functionCall` with raw object arguments. Thinking is a part with
`thought: true` when the model advertises thinking and the request asks for it.

```go
body, err := geminiapi.EncodeRequest(req)
if err != nil {
	return err
}
fmt.Println(string(body))
```

## Route and stream

`route.GeminiGenerateContent` builds
`POST {base}/models/{name}:generateContent` for invoke and
`POST {base}/models/{name}:streamGenerateContent?alt=sse` for stream. The
codec does not add a `stream` JSON flag. `DecodeResponse` reads
`candidates[0]`. `promptTokenCount` is split from
`cachedContentTokenCount`; output is candidates plus thoughts, and the
reported total is checked. The codec does not emit a request cache marker; the
only cache evidence it consumes is the response usage field.

## Source and proof

- [`geminiapi/types.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/geminiapi/types.go)
- [`geminiapi/encode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/geminiapi/encode.go)
- [`geminiapi/decode.go`](https://github.com/looprig/inference/blob/v0.9.2/codec/geminiapi/decode.go)
- [`route/route.go`](https://github.com/looprig/inference/blob/v0.9.2/route/route.go)

Run `go test ./codec/geminiapi ./route`.
