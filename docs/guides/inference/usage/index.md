---
id: guides/inference/usage/index
title: Overview
description: Normalize model token usage and keep it distinct from preflight context counts.
audience: developer
section: guides
order: 92
publication: released
proofs:
  model-usage: [release-github-com-looprig-inference]
  separation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Overview

Inference usage is postflight provider-reported consumption. The public
`inference/usage.Usage` type is an alias of `core/content.Usage`; codecs fill
it from native response fields and streams expose it only after clean EOF.

## Model usage

```go
type Usage struct {
	InputTokens         content.TokenCount
	OutputTokens        content.TokenCount
	CacheReadTokens     content.TokenCount
	CacheCreationTokens content.TokenCount
	ReasoningTokens     content.TokenCount
}
```

`InputTokens` excludes cache subsets when a provider reports gross input;
`ContextTokens` derives input plus cache-read and cache-creation values;
`TotalTokens` adds output. Missing provider usage is represented by `nil` on a
response or stream result.

## Separation

`contextcount.ContextCounter` estimates preflight request occupancy. It has no
response or output field. `Usage` is authoritative provider accounting after a
call. Do not use a zero `Usage` to stand in for a failed count or an absent
provider report.

## Source and proof

- [`usage/usage.go`](https://github.com/looprig/inference/blob/v0.14.0/usage/usage.go)
- [`core/content/usage.go`](https://github.com/looprig/core/blob/v0.12.0/content/usage.go)
- [`responses/usage.md`](../responses/usage.md)

Run `go test ./usage ./stream ./codec/...`.
