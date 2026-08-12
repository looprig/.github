---
id: guides/inference/providers/gitlab
title: GitLab Duo Gateway
description: Configure the GitLab Duo Gateway provider from its released llm package, including endpoint, auth, formats, capabilities, counters, and failure boundaries.
audience: developer
section: guides
order: 23
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

# GitLab Duo Gateway

GitLab AI Gateway client. It exchanges a GitLab token for a short-lived direct-access token and patches selected aliases to upstream model IDs.

## Contract and endpoint

The public constructor is `func New(selected model.Model, key auth.APIKey, options ...Option) (inference.Client, error)`. It binds provider identity `gitlab` and resolves the base below when Model.BaseURL is empty, unless the dynamic rule says otherwise.

| Field | Source-backed behavior |
| --- | --- |
| Package | `github.com/looprig/llm/providers/gitlab` (package `gitlab`) |
| Provider | `gitlab` |
| Formats | OpenAI, OpenAI Responses, Anthropic |
| Default base | GitLab AI Gateway OpenAI or Anthropic proxy root |
| Authentication | OAuth or PAT exchange |
| Header or signer | Bearer direct-access token after exchange |
| Options | WithHeader; WithAIGatewayURL; WithInstanceURL; WithFeatureFlag; WithUpstreamModelID; WithAIGatewayHeader; WithReasoningEffort; WithThinkingBudget |

On an inference 401, the wrapper invalidates the direct token and retries the same Invoke or Stream once.

An explicit model BaseURL is caller-controlled and is used by the provider route builder. It replaces the package default; it is not appended to the default.

## Authentication and model formats

The llm provider registry classifies this identity as requiring OAuth or PAT exchange. The constructor receives resolved credential material rather than a secret reference. A credentials or secrets integration can resolve a descriptor and lease before passing the value here; secret labels do not belong in model.Model.

| Decision | Result |
| --- | --- |
| Credential | OAuth or PAT exchange |
| Wire auth | Bearer direct-access token after exchange |
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

NewCounter returns a typed llm.CounterSupportError because no exact provider counter is implemented.

The shared inference boundary returns typed model-validation, authentication, network, HTTP, request-encoding, response-decoding, and stream errors. A provider-local retry loop is not implied by a constructor name.

The direct-access token is invalidated and refreshed once after a 401; no general response retry is declared.

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
    gitlab "github.com/looprig/llm/providers/gitlab"
)
func invoke() error {
    // Resolve credentials from an application-owned lease or environment, never model.Model.
    selected := model.CustomModel(model.ProviderName("gitlab"), model.APIFormatOpenAI, "", "model-name")
    // Construction validates provider policy and binds its endpoint and codec.
    client, err := gitlab.New(selected, auth.APIKey(os.Getenv("GITLAB_API_KEY")))
    if err != nil { return err }
    // The context controls the request lifetime, including a stream if used.
    _, err = client.Invoke(context.Background(), inference.Request{Model: selected})
    return err
}
```

## Source and proof

- [auth.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/auth.go)
- [client.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/client.go)
- [counter.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/counter.go)
- [errors.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/errors.go)
- [model_mapping.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/model_mapping.go)

The provider identity and API-format truth table are defined in [provider.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go). Adjacent behavior tests:

- [client_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/client_test.go)
- [model_mapping_test.go](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/providers/gitlab/model_mapping_test.go)
