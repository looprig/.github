---
id: guides/inference/context-counting/api-format-estimators
title: API-format estimators
description: See how the bundled estimator selects a dialect encoder and derives tokens from bytes.
audience: developer
section: guides
order: 88
publication: released
proofs:
  selection: [release-github-com-looprig-inference]
  formula: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# API-Format Estimators

`contextcount.Estimator` uses the request's API format to choose one of the
bundled request encoders. Its zero value is ready for use.

## Selection

```go
switch req.Model.APIFormat {
case model.APIFormatOpenAI:
	body, err = openaiapi.EncodeRequest(req, false)
case model.APIFormatOpenAIResponses:
	body, err = openairesponses.EncodeRequest(req, false)
case model.APIFormatAnthropic:
	body, err = anthropicapi.EncodeRequest(req, false)
case model.APIFormatGemini:
	body, err = geminiapi.EncodeRequest(req)
case model.APIFormatBedrockConverse:
	body, err = bedrockconverse.EncodeRequest(req)
default:
	return nil, &contextcount.UnsupportedAPIFormatError{APIFormat: req.Model.APIFormat}
}
```

Bedrock Converse is in the bundle: Converse and ConverseStream share one
request body, so the encoder takes no mode and the estimator counts exactly what
inference sends. A format with no bundled encoder returns a typed
`UnsupportedAPIFormatError`, not a guessed count.

## Formula

The estimator counts encoded bytes with a ceiling division by four:

`estimatedTokens = ceil(len(encodedRequest) / 4)`.

The revision constant
`bundled-openai-responses-anthropic-gemini-bedrock-request-bytes-div4-v3`
identifies
the encoder suite and formula. A count-affecting codec change requires a new
revision so stored measurements remain attributable.

## Source and proof

- [`contextcount/estimator.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.13.0/contextcount/estimator_test.go)

Run `go test ./contextcount`.
