---
id: build/08-providers-and-counters
title: Build 08: providers and counters
description: Select provider implementations through LLM policy and add counters without exposing provider secrets or changing inference calls.
audience: developer
section: build
order: 8
publication: released
proofs:
  boundary:
    - release-github-com-looprig-llm
    - release-github-com-looprig-inference
    - release-github-com-looprig-credentials
  composition:
    - release-github-com-looprig-llm
    - release-github-com-looprig-inference
  provider-policy:
    - release-github-com-looprig-llm
  automatic-selection:
    - release-github-com-looprig-llm
  counters:
    - release-github-com-looprig-llm
  subscription-and-credential-boundaries:
    - release-github-com-looprig-llm
    - release-github-com-looprig-credentials
  lifecycle:
    - release-github-com-looprig-llm
  errors-and-limits:
    - release-github-com-looprig-llm
    - release-github-com-looprig-credentials
  runnable-proof:
    - release-github-com-looprig-llm
---

# Build 08: providers and counters

Use `llm` as the provider assembly layer when a process needs a common model policy, credential boundary, and optional preflight context counting. Provider packages remain independently testable; the returned clients satisfy the same Inference contract used by the rest of the application.

## Provider policy {#provider-policy}

`AuthPolicy` makes credential behavior explicit. A caller can require an explicit credential, permit a named source, or allow a provider's configured default according to the policy. Model metadata remains secret-free: it identifies a provider and model, but it does not carry API keys, tokens, or resolved secret bytes.

## Automatic selection {#automatic-selection}

`auto.New` constructs the provider selected by the model and process configuration. `auto.NewWithAuth` makes the credential policy explicit at construction. Use the provider-specific package directly when the application needs a provider option that automatic selection cannot express; otherwise keep the application on the provider-neutral `inference.Client` interface.

## Counters {#counters}

`auto.NewCounter` and provider-level counter constructors return a `contextcount.ContextCounter`. A counter estimates or obtains the number of input-context tokens before a model call; it does not wrap an inference client or aggregate response usage. Automatic selection returns only exact counters for supported provider and API-format pairs. Unsupported pairs fail closed with a typed support error rather than silently substituting an estimator. Call `CountContext` with the intended `inference.Request`, inspect the returned capability when policy depends on exactness, and keep response usage accounting separate.

## Subscription and credential boundaries {#subscription-and-credential-boundaries}

Subscription-backed providers fail closed when their availability gate or required account state is absent. An unavailable subscription is not equivalent to an anonymous API call. Keep credential resolution in Credentials and Secrets, and make the selected credential source visible in configuration without logging its value.

## Errors and limits {#errors-and-limits}

Handle unsupported provider/model combinations, missing credentials, unavailable subscription access, provider transport failures, and counter wrapping errors separately. Use typed errors and `errors.As`; do not infer policy from an error string. Provider constructors may accept provider-specific limits, but the resulting Model must still advertise capabilities that the inference client can enforce.

## Runnable proof {#runnable-proof}

The LLM module's native provider, automatic-selection, counter, and subscription examples are the runnable evidence for this path. Run those examples and tests with `GOWORK=off`; source is pinned in the [LLM release tree](https://github.com/looprig/llm/tree/v0.13.3/) and [Credentials release tree](https://github.com/looprig/credentials/tree/v0.1.0/). No central progressive example currently covers provider counters; use the native examples, tests, and pinned package proof links above.
