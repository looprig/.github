---
id: guides/inference/errors-and-cancellation/index
title: Overview
description: Classify request, codec, transport, stream, cancellation, and deadline failures.
audience: developer
section: guides
order: 97
publication: released
proofs:
  layers: [release-github-com-looprig-inference]
  cancellation: [release-github-com-looprig-inference]
  source-and-proof: [release-github-com-looprig-inference]
---

# Overview

Inference errors are typed at the boundary that owns the failure. Request
validation and model capability errors happen before I/O; codecs classify wire
shape; transport maps network and HTTP status; streams preserve the first
terminal failure. Context cancellation is never converted into a retryable
provider failure.

## Layers

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#111827","primaryColor":"#1f2937","primaryTextColor":"#f9fafb","primaryBorderColor":"#60a5fa","lineColor":"#94a3b8","secondaryColor":"#172033","tertiaryColor":"#0f172a","fontFamily":"Inter, ui-sans-serif, system-ui"}}}%%
flowchart TD
    V["request/model validation"] --> C["codec error"]
    C --> T["transport: network or API status"]
    T --> S["stream reader terminal state"]
    X["context cancellation/deadline"] --> T
    X --> S
```

Use `errors.As` for stable typed inspection and `errors.Is` for context and
package sentinel errors. Error strings are diagnostics, not a protocol.

## Cancellation

`Invoke` observes the caller context through request construction, authorization,
HTTP, and bounded body reading. `Stream` uses the context for setup and leaves
the long-lived body bounded by that context after response headers arrive.
`StreamReader.Close` releases the body and is safe to call repeatedly.

## Source and proof

- [`failure/errors.go`](https://github.com/looprig/inference/blob/v0.14.0/failure/errors.go)
- [`transport/client.go`](https://github.com/looprig/inference/blob/v0.14.0/transport/client.go)
- [`stream/stream.go`](https://github.com/looprig/inference/blob/v0.14.0/stream/stream.go)

Run `go test ./failure ./transport ./stream ./gateway`.
