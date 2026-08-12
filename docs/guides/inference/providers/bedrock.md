---
id: guides/inference/providers/bedrock
title: Amazon Bedrock
description: Configure the Amazon Bedrock provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 10
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

# Amazon Bedrock

Region-bound Bedrock Runtime client with Anthropic InvokeModel and native Converse or ConverseStream routes.

## Contract and endpoint

The public constructor is `func New(creds auth.SigV4Credentials, region string, options ...Option) (inference.Client, error)`. It binds provider identity `bedrock` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/bedrock` (package `bedrock`) |
| Provider | `bedrock` |
| Formats | Anthropic, Bedrock Converse |
| Default base | dynamic: https://bedrock-runtime.{region}.amazonaws.com |
| Authentication | AWS SigV4 |
| Header or signer | AWS SigV4 Authorization |
| Options | WithReasoning; WithAdditionalModelRequestFields; WithAdditionalModelResponseFieldPaths; WithGuardrail; WithPerformanceLatency; WithServiceTier; WithRequestMetadata; WithPromptCachePoint |

New requires region, access key, and secret key. Optional session tokens are signed. OpenAI format is rejected before I/O.

An explicit model BaseURL is caller-controlled and is used by the provider route builder. It replaces the package default; it is not appended to the default.

## Authentication and model formats

The llm provider registry classifies this identity as requiring AWS SigV4. The constructor receives resolved credential material rather than a secret reference. A credentials or secrets integration can resolve a descriptor and lease before passing the value here; secret labels do not belong in model.Model.

| Decision | Result |
| --- | --- |
| Credential | AWS SigV4 |
| Wire auth | AWS SigV4 Authorization |
| Format gate | Anthropic, Bedrock Converse; unsupported values fail model validation before I/O |
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

WithPromptCachePoint adds a native Converse cache point with the declared TTL and does not alter the Anthropic InvokeModel path.

## Counters, errors, and retries

NewCounter sends exact countTokens requests for supported Anthropic and Converse formats; unsupported formats return UnsupportedAPIFormatError.

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
    bedrock "github.com/looprig/llm/providers/bedrock"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("bedrock"), model.APIFormatBedrockConverse, "", "model-name")
    _ = selected
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := bedrock.New(auth.SigV4Credentials{AccessKeyID: os.Getenv("AWS_ACCESS_KEY_ID"), SecretAccessKey: os.Getenv("AWS_SECRET_ACCESS_KEY")}, "us-east-1")
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [body.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/body.go)
- [client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/client.go)
- [counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/counter.go)
- [errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/errors.go)
- [options.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/options.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go). Adjacent behavior tests:

- [body_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/body_test.go)
- [client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/client_test.go)
- [converse_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/converse_test.go)
- [counter_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/counter_test.go)
- [export_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/export_test.go)
- [options_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/options_test.go)
- [usage_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/bedrock/usage_test.go)
