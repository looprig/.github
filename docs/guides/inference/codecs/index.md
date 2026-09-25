---
id: guides/inference/codecs/index
title: Overview
description: Translate provider-neutral inference requests, responses, and streams at the wire boundary.
audience: developer
section: guides
order: 64
publication: released
proofs:
  boundary: [release-github-com-looprig-inference]
  choose-a-codec: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Overview

Codecs are the only layer that knows a provider's JSON and stream dialect. A
codec maps the secret-free `inference.Request` and `inference.Response` types
to and from bytes; transport, routing, authorization, and cancellation remain
outside the codec.

## Boundary

The public contracts are deliberately split. `RequestEncoder` and
`ResponseDecoder` handle one-shot calls, while `StreamDecoder` is optional.
`ServerCodec` is the inverse boundary used by the gateway. A codec is expected
to be stateless and safe to share; only a returned `StreamEncoder` is
request-scoped.

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f9fafb","primaryBorderColor":"#60a5fa","lineColor":"#94a3b8","secondaryColor":"#172033","tertiaryColor":"#0f172a","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart LR
    R["inference.Request"] --> E["RequestEncoder"]
    E --> B["single-shot body"]
    B --> T["transport"]
    T --> D["ResponseDecoder"]
    D --> P["inference.Response"]
    T --> S["optional StreamDecoder"]
    S --> C["content.Chunk stream"]
```

## Choose a codec

| Package | Native endpoint shape | Streaming selection | Distinctive mapping |
| --- | --- | --- | --- |
| `codec/openaiapi` | `POST /v1/chat/completions` | JSON `stream: true` and SSE | string or multipart message content |
| `codec/openairesponses` | `POST /v1/responses` | JSON `stream: true` and typed SSE events | items, function calls, reasoning items |
| `codec/anthropicapi` | `POST /v1/messages` | JSON `stream: true` and SSE | top-level system, content blocks, cache breakpoints |
| `codec/geminiapi` | `:generateContent` | route changes to `:streamGenerateContent?alt=sse` | `contents` roles and function parts |
| `codec/bedrockconverse` | Converse body | route and response framing change | tagged Converse union, inline media |

Use the matching route builder with the codec. The generic transport must not
guess a path or replay a body.

## Source and proof

- [`codec/contracts.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/contracts.go)
- [`codec/requestmode.go`](https://github.com/looprig/inference/blob/v0.13.0/codec/requestmode.go)
- [`codec` contract tests](https://github.com/looprig/inference/blob/v0.13.0/codec/contracts_test.go)

Run the contract tests with `go test ./codec/...`.
