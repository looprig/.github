---
id: modules/llm
title: Model providers and credential-backed clients
description: Bind model descriptors to provider clients while keeping credentials outside model and request data.
audience: developer
section: modules
order: 12
publication: released
proofs:
  repository: release-github-com-looprig-llm
  model-policy:
    - release-github-com-looprig-llm
  provider-families:
    - release-github-com-looprig-llm
  credential-boundary:
    - release-github-com-looprig-llm
  limitations:
    - release-github-com-looprig-llm
---

# Model providers and credential-backed clients

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/llm` repository](https://github.com/looprig/llm).

LLM `v0.13.3` supplies provider labels, provider implementations, authentication policy, exact counters, and automatic client selection on top of Inference. Install `github.com/looprig/llm@v0.13.3` together with the immutable Core, Inference, Credentials, and Secrets versions named by its module file.

## Model policy {#model-policy}

The root package defines provider constants, authentication kinds, `AuthPolicy`, and validation helpers. A `model.Model` identifies a provider and wire format, but carries no key, OAuth token, secret reference, or system prompt. `AuthPolicyForModel` tells the composition root which credential shape a provider expects. The application still chooses where the credential comes from and which scope is acceptable.

`auto.New` validates a model and selects a registered provider client. `auto.NewWithAuth` makes the credential binding explicit; `auto.NewCounter` chooses an exact context counter when the provider supports one. Counter support is separate from generation support. A provider can generate responses while its exact count endpoint is unavailable, and the caller must handle that typed capability error rather than estimate silently.

## Provider families {#provider-families}

The released module has native packages for Anthropic Messages, OpenAI Chat Completions and Responses, Bedrock Converse, Gemini, Azure variants, OpenRouter, OpenCode, GitHub Copilot, GitLab, Google Vertex, local Ollama and Llama variants, and many OpenAI-compatible hosted services. Each package exposes its own `New` constructor and, where implemented, `NewCounter` and functional options. The provider package owns endpoint validation, wire-specific request options, response mapping, usage normalization, and provider error classification.

Subscription subpackages are policy boundaries, not shortcuts around a provider's account controls. The Anthropic subscription registration gate currently returns an unavailable or blocked status and fails closed; it does not accept a user session or turn an undocumented login flow into a supported credential source.

## Credential boundary {#credential-boundary}

Keep API keys, bearer tokens, SigV4 credentials, OAuth sources, and workload identity in Credentials or Secrets. Construct a client at the composition root, then pass the resulting `inference.Client` to a loop or gateway. Do not put a secret in `model.Model`, `inference.Request`, session history, logs, or a model catalog. Provider errors and diagnostics are bounded or redacted where they could otherwise echo a URL, header, or token.

## Limitations {#limitations}

Provider availability and model capabilities are endpoint facts, not promises made by a provider label. A model's capabilities are conservative until explicitly asserted by a trusted catalog or option. Live provider calls, OAuth callbacks, and remote count endpoints are not deterministic documentation proofs. Use the module's native examples and tests for offline codec behavior, and gate network checks on the environment that owns the credential.
