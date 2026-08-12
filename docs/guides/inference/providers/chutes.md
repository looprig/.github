---
id: guides/inference/providers/chutes
title: Chutes
description: Configure the Chutes provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 12
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

# Chutes

End-to-end encrypted Chutes client. It resolves model names, verifies NVIDIA TEE evidence, derives an ML-KEM-768 session, and seals OpenAI Chat requests for /e2e/invoke.

## Contract and endpoint

The public constructor is `func New(apiBase, apiKey string, opts ...Option) *Client`. It binds provider identity `chutes` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/chutes` (package `chutes`) |
| Provider | `chutes` |
| Formats | OpenAI |
| Default base | API https://api.chutes.ai; discovery https://llm.chutes.ai; attestation defaults in source |
| Authentication | API key plus TEE attestation |
| Header or signer | Bearer token inside encrypted request envelope |
| Options | WithHTTPClient; WithLLMBase; WithNRAS |

New returns a client without network I/O. Requests require model resolution and attestation; mismatches surface as attestation failures rather than generic transport mismatch.

An explicit model BaseURL is caller-controlled and is used by the provider route builder. It replaces the package default; it is not appended to the default.

## Authentication and model formats

The llm provider registry classifies this identity as requiring API key plus TEE attestation. The constructor receives resolved credential material rather than a secret reference. A credentials or secrets integration can resolve a descriptor and lease before passing the value here; secret labels do not belong in model.Model.

| Decision | Result |
| --- | --- |
| Credential | API key plus TEE attestation |
| Wire auth | Bearer token inside encrypted request envelope |
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

Model-to-chute resolution and attested sessions are cached for sessionTTL. No response cache is implemented.

## Counters, errors, and retries

No NewCounter is exported. Session and model caches are attestation state, not prompt caching.

The shared inference boundary returns typed model-validation, authentication, network, HTTP, request-encoding, response-decoding, and stream errors. A provider-local retry loop is not implied by a constructor name.

Session expiry or exhausted nonces trigger re-attestation. This is authentication lifecycle behavior, not a general response retry.

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
    chutes "github.com/looprig/llm/providers/chutes"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("chutes"), model.APIFormatOpenAI, "", "model-name")
    _ = selected
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := chutes.New("", os.Getenv("CHUTES_API_KEY"))
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [attest.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/attest.go)
- [client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/client.go)
- [decode.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/decode.go)
- [discover.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/discover.go)
- [encode.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/encode.go)
- [errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/errors.go)
- [ssereader.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/ssereader.go)
- [stream.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/stream.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go). Adjacent behavior tests:

- [client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/client_test.go)
- [encode_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/encode_test.go)
- [export_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/export_test.go)
- [usage_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/chutes/usage_test.go)
