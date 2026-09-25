---
id: guides/inference/providers/openrouter
title: OpenRouter
description: Configure the OpenRouter provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 42
publication: released
proofs:
  contract-and-endpoint: [release-github-com-looprig-llm]
  authentication-and-model-formats: [release-github-com-looprig-llm]
  streaming-structured-output-and-tools: [release-github-com-looprig-llm]
  reasoning-details: [release-github-com-looprig-llm]
  caching-controls: [release-github-com-looprig-llm]
  counters-errors-and-retries: [release-github-com-looprig-llm]
  consumer-example: [release-github-com-looprig-llm]
  source-and-proof: [release-github-com-looprig-llm]
---

# OpenRouter

OpenRouter Chat client with attribution, usage, reasoning, provider-routing, and TLS root options.

## Contract and endpoint

The public constructor is `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`. It binds provider identity `openrouter` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/openrouter` (package `openrouter`) |
| Provider | `openrouter` |
| Formats | OpenAI |
| Default base | https://openrouter.ai/api/v1 |
| Authentication | API key |
| Header or signer | Authorization: Bearer |
| Options | WithTLSRootCAs; WithHTTPReferer; WithTitle; WithUsage; WithReasoning; WithPromptCacheKey; WithProviderRouting |

Only OpenAI Chat is registered. WithTLSRootCAs(nil) panics at option creation instead of changing TLS defaults.

An explicit model BaseURL is caller-controlled and is used by the provider route builder. It replaces the package default; it is not appended to the default.

## Authentication and model formats

The llm provider registry classifies this identity as requiring API key. The constructor receives resolved credential material rather than a secret reference. A credentials or secrets integration can resolve a descriptor and lease before passing the value here; secret labels do not belong in model.Model.

| Decision | Result |
| --- | --- |
| Credential | API key |
| Wire auth | Authorization: Bearer |
| Format gate | OpenAI; unsupported values fail model validation before I/O |
| Model identity | Provider and APIFormat select the route and codec; optional capabilities remain request-level and are not inferred from the model string. |

Optional capability bits on model.Model remain caller input. Request validation is authoritative for tools, structured output, images, thinking, sampling, and output limits; this page records only features encoded by the selected codec or provider patch.

## Streaming, structured output, and tools

The client returns the shared stream reader from Stream. Its selected codec encodes provider-neutral tool declarations, tool results, and structured-output schemas when the request is valid. Streaming responses preserve codec usage and finish metadata; no capability beyond the source-backed format is inferred.

A stream owns its response body through the returned reader. Transport and non-success HTTP failures are returned before a reader is exposed; decode failures surface from Next or the terminal result.

### Reasoning details

OpenRouter returns its reasoning continuation state as a `reasoning_details` array of typed records (`reasoning.text`, `reasoning.summary`, `reasoning.encrypted`, or a newer variant it adds later). The client keeps that array as provider state, never as text, so a multi-turn conversation can hand it back intact:

| Path | Behavior |
| --- | --- |
| Invoke | The array from the first choice is stored on the response's `*content.ThinkingBlock` as `ProviderState`, with `ProviderStateFormat` set to `openrouter-reasoning-details`. If the message has no thinking block, a zero-text one is inserted first. |
| Stream | Records are accumulated in arrival order and carried on `*content.ThinkingChunk.ProviderState` with the same format label. Encrypted-only reasoning has no readable text, so the client emits a zero-text thinking chunk to carry it ahead of the text or tool call from the same delta. State not yet delivered when the stream ends, including on a failure, is emitted as one final carrier before the terminal error. |
| Request | Each assistant message whose thinking block is `ReplayableAs("openrouter-reasoning-details")` gets its array back as `reasoning_details` on the matching wire message. |

A stored array is replayed only if it still has the documented shape: a non-empty array of objects, each with a non-empty `type`. A malformed or foreign-format state is silently omitted rather than sent, because OpenRouter would reject it with HTTP 400. Unknown record types are preserved byte for byte. If the shared OpenAI encoder ever stops emitting one wire message per neutral message, the request fails to encode instead of attaching state to the wrong turn.

```mermaid
%%{init: {"theme":"base","themeVariables":{"background":"#0b1020","primaryColor":"#172554","primaryTextColor":"#f8fafc","primaryBorderColor":"#60a5fa","lineColor":"#94a3b8","secondaryColor":"#1e293b","tertiaryColor":"#111827","fontFamily":"ui-sans-serif,system-ui"}}}%%
flowchart LR
    Req[Request] --> Enc[format codec]
    Enc --> Wire[provider route]
    Wire --> Stream[stream framing]
    Stream --> Reader[StreamReader]
    Reader --> Result[terminal result and usage]
    classDef dark fill:#172554,stroke:#60a5fa,color:#f8fafc;
    class Req,Enc,Wire,Stream,Reader,Result dark;
```

## Caching controls

WithPromptCacheKey sets OpenRouter prompt cache key. Provider routing is routing policy, not cache policy.

## Counters, errors, and retries

No NewCounter is exported. The package has an explicit no-counter boundary.

Usage is decoded by the shared OpenAI codec and passed through as OpenRouter reports it. The client does not add reasoning tokens to completion tokens, because OpenRouter documents reasoning tokens as part of output. When a response reports more reasoning tokens than completion tokens, `content.Usage.ReasoningWithinOutput` returns false, so anything that prices or reports usage can detect the inconsistency.

The shared inference boundary returns typed model-validation, authentication, network, HTTP, request-encoding, response-decoding, and stream errors. A provider-local retry loop is not implied by a constructor name.

No provider-local response retry is declared. Use inference/retry only around an operation your caller can repeat safely.

## Consumer example

The example keeps credentials out of model.Model and calls the public constructor. Replace environment lookup with an application-owned credentials or secrets lease.

```go
package example
import (
    "context"
    "os"
    "github.com/looprig/inference"
    "github.com/looprig/inference/auth"
    model "github.com/looprig/inference/model"
    openrouter "github.com/looprig/llm/providers/openrouter"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("openrouter"), model.APIFormatOpenAI, "", "model-name")
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := openrouter.New(selected, auth.APIKey(os.Getenv("OPENROUTER_API_KEY")), openrouter.WithUsage(true))
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [openrouter.go](https://github.com/looprig/llm/blob/v0.15.0/providers/openrouter/openrouter.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/v0.15.0/provider.go). Adjacent behavior tests:

- [openrouter_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/openrouter/openrouter_test.go)
- [reasoning_state_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/openrouter/reasoning_state_test.go)
- [stream_terminal_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/openrouter/stream_terminal_test.go)
- [usage_reasoning_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/openrouter/usage_reasoning_test.go)
