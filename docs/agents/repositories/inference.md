---
id: agents/repositories/inference
title: Provider-neutral inference
description: Build model descriptors and invoke or stream through a provider-neutral client.
audience: agent
section: agents/repositories
order: 12
publication: released
proofs:
  module:
    - release-github-com-looprig-inference
---
# inference

`github.com/looprig/inference@v0.9.2` depends on `core`, `credentials`, and `secrets`. The `inference.Client` interface has `Invoke(context.Context, Request)` and `Stream(context.Context, Request)`. A request carries a secret-free `model.Model`, Core messages, tools, optional output schema, tool choice, and sampling override.

Construct custom models with `model.CustomModel(provider, apiFormat, baseURL, name, options...)`; capabilities default off and `Validate` is required before use. Add `WithTools`, `WithImages`, `WithThinking`, `WithStructuredOutput`, or `WithStructuredOutputWithTools` only when the endpoint supports them. `inference/gateway.NewServer` exposes a loopback authenticated HTTP client boundary.

Validate request feature combinations before codec or transport work. Typed failures cover unsupported images or structured output, duplicate tools, malformed schema, transport, route, auth, retry exhaustion, stream, and context errors. Proofs: [`client.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/client.go), [`model/model.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/model/model.go), [`gateway/server.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/gateway/server.go), [`retry/retry.go`](https://github.com/looprig/inference/blob/c56f83bd8653e650631ebfbf4035319fffba9033/retry/retry.go).
