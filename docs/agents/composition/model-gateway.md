---
id: agents/composition/model-gateway
title: Configure model access and gateways
description: Build secret-free model values, provider clients, retries, counters, and the inference gateway.
audience: agent
section: agents/composition
order: 8
publication: released
proofs:
  model-and-client:
    - release-github-com-looprig-inference
    - release-github-com-looprig-llm
  credentials:
    - release-github-com-looprig-credentials
---
# Model gateway

Keep `inference/model.Model` secret-free. Construct custom values with `model.CustomModel(provider, apiFormat, baseURL, name, options...)` or a literal `Model`, add capability options such as `WithTools`, `WithImages`, `WithThinking`, `WithStructuredOutput`, and call `Validate`. Resolve credentials separately through `credentials` or the provider-specific `llm` binding.

The neutral `inference.Client` has `Invoke(context.Context, inference.Request)` and `Stream(context.Context, inference.Request)`. Build a request from Core messages, model, sampling, tools, and optional output schema. Validate request features before transport. Use `inference.StructuredResult` or `DecodeOutput` only after a complete response; structured output with tool calls is a typed conflict.

`llm` selects provider clients and counters. The auto path chooses a provider from the model and credential catalog. `inference/gateway` exposes a local HTTP boundary that resolves named routes to clients, applies auth and request limits, and forwards invoke or stream. A proxy is a transport composition, not a place to put raw credentials in a model value.

Lifecycle: create provider client once per configured credential scope, reuse it for requests, close streamed readers, and close gateway servers on shutdown. Retry only the failure classes declared by `inference/retry`; never replay a request after an unknown effect without an idempotency decision.

Failures include model validation, unsupported capability, auth, route missing, provider, stream, context, and structured-output errors. Match typed errors. Proofs: [`inference/model/model.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/model.go), [`inference/client.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/client.go), [`inference/gateway/server.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/gateway/server.go), [`llm/auto/auto.go`](https://github.com/looprig/llm/blob/e234f915f6605f278a31f7107cceff90cd52ec7f/auto/auto.go).
