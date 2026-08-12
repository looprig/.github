---
id: guides/inference/providers/github-copilot
title: GitHub Copilot
description: Configure the GitHub Copilot provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 22
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

# GitHub Copilot

Copilot gateway client. The caller supplies an already-authorized token; OAuth exchange is outside this transport.

## Contract and endpoint

The public constructor is `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`. It binds provider identity `github-copilot` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/github-copilot` (package `githubcopilot`) |
| Provider | `github-copilot` |
| Formats | OpenAI, OpenAI Responses, Anthropic |
| Default base | https://api.githubcopilot.com |
| Authentication | OAuth-derived token |
| Header or signer | Authorization: Bearer |
| Options | WithHeader; WithInitiator; WithOpenAIIntent; WithVision |

Adds API-version and attribution headers, infers x-initiator from the last message, and enables Copilot-Vision-Request when images are present.

An explicit model BaseURL is caller-controlled and is used by the provider route builder. It replaces the package default; it is not appended to the default.

## Authentication and model formats

The llm provider registry classifies this identity as requiring OAuth-derived token. The constructor receives resolved credential material rather than a secret reference. A credentials or secrets integration can resolve a descriptor and lease before passing the value here; secret labels do not belong in model.Model.

| Decision | Result |
| --- | --- |
| Credential | OAuth-derived token |
| Wire auth | Authorization: Bearer |
| Format gate | OpenAI, OpenAI Responses, Anthropic; unsupported values fail model validation before I/O |
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

NewCounter returns llm.CounterSupportError; no exact Copilot counter is implemented.

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
    githubcopilot "github.com/looprig/llm/providers/github-copilot"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("github-copilot"), model.APIFormatOpenAI, "", "model-name")
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := githubcopilot.New(selected, auth.APIKey(os.Getenv("GITHUB_COPILOT_API_KEY")))
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/github-copilot/client.go)
- [counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/github-copilot/counter.go)
- [errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/github-copilot/errors.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go). Adjacent behavior tests:

- [client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/github-copilot/client_test.go)
- [reasoning_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/github-copilot/reasoning_test.go)
