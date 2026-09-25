---
id: guides/inference/providers/frogbot
title: FrogBot
description: Configure the FrogBot provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 20
publication: released
proofs:
  contract-and-endpoint: [release-github-com-looprig-llm]
  authentication-and-model-formats: [release-github-com-looprig-llm]
  streaming-structured-output-and-tools: [release-github-com-looprig-llm]
  caching-controls: [release-github-com-looprig-llm]
  counters-errors-and-retries: [release-github-com-looprig-llm]
  consumer-example: [release-github-com-looprig-llm]
  source-and-proof: [release-github-com-looprig-llm]
---

# FrogBot

A compatibility-backed provider client binds its declared endpoint to the shared inference request, response, and stream codecs.

## Contract and endpoint

The public constructor is `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`. It binds provider identity `frogbot` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/frogbot` (package `frogbot`) |
| Provider | `frogbot` |
| Formats | OpenAI |
| Default base | https://app.frogbot.ai/api/v1 |
| Authentication | API key |
| Header or signer | Authorization: Bearer |
| Options | WithHeader |

The package has no provider-specific route or model discovery beyond the declared compatibility endpoint.

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

No provider cache controls are exported.

## Counters, errors, and retries

NewCounter returns a typed llm.CounterSupportError because no exact provider counter is implemented.

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
    frogbot "github.com/looprig/llm/providers/frogbot"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("frogbot"), model.APIFormatOpenAI, "", "model-name")
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := frogbot.New(selected, auth.APIKey(os.Getenv("FROGBOT_API_KEY")))
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [client.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/client.go)
- [counter.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/counter.go)
- [errors.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/errors.go)
- [options.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/options.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/v0.15.0/provider.go). Adjacent behavior tests:

- [client_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/client_test.go)
- [counter_test.go](https://github.com/looprig/llm/blob/v0.15.0/providers/frogbot/counter_test.go)
