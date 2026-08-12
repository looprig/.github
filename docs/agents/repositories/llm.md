---
id: agents/repositories/llm
title: LLM provider adapters
description: Select provider clients and credentials behind the inference.Client interface.
audience: agent
section: agents/repositories
order: 13
publication: released
proofs:
  module:
    - release-github-com-looprig-llm
---
# llm

`github.com/looprig/llm@v0.13.3` depends on `core`, `credentials`, `inference`, and `secrets`. It contains provider identity and API-format validation, authentication policy, provider adapters, counters, and TEE-related packages. Application code should depend on `inference.Client`, not a provider package.

Use `auto.New(model, auth.APIKey, options...)` when the model and explicit API key are sufficient. Use `auto.NewWithAuth(model, credentials.Source, options...)` when credentials must be resolved per call. The auto constructor validates the model and provider auth policy before constructing a client. Providers that require a credential kind or policy not represented by those arguments return a typed construct-directly error.

Keep the model descriptor secret-free. Close the returned client when its concrete implementation supports close. Auth, provider, route, codec, quota, and unsupported-construction errors are part of the boundary. Proofs: [`auto/auto.go`](https://github.com/looprig/llm/blob/e234f915f6605f278a31f7107cceff90cd52ec7f/auto/auto.go), [`provider.go`](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/provider.go), [`auth/sigv4.go`](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auth/sigv4.go), [`auto/auto_test.go`](https://github.com/looprig/llm/blob/107b378c3882c0a99ad98e36d89e542c5461bc55/auto/auto_test.go).
