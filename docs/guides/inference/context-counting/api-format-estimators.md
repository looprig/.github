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
default:
	return contextcount.UnsupportedAPIFormatError{}
}
```

Bedrock Converse is not in the bundled estimator switch because its exact
provider CountTokens shape is separate. Unsupported formats return a typed
`UnsupportedAPIFormatError`, not a guessed count.

## Formula

The estimator counts encoded bytes with a ceiling division by four:

`estimatedTokens = ceil(len(encodedRequest) / 4)`.

The revision constant
`bundled-openai-responses-anthropic-gemini-request-bytes-div4-v1` identifies
the encoder suite and formula. A count-affecting codec change requires a new
revision so stored measurements remain attributable.

## Source and proof

- [`contextcount/estimator.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/estimator.go)
- [`contextcount/estimator_test.go`](https://github.com/looprig/inference/blob/v0.9.2/contextcount/estimator_test.go)

Run `go test ./contextcount`.
