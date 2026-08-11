---
id: concepts/model-access
title: Model access without secret-bearing models
description: Separate model identity, provider policy, credentials, and request content.
audience: human
section: concepts
order: 2
publication: released
examples:
  - stage-01-inference
  - stage-22-model-gateway
proofs:
  identity:
    - release-github-com-looprig-inference
    - release-github-com-looprig-llm
  credential-boundary:
    - release-github-com-looprig-credentials
    - release-github-com-looprig-secrets
  gateway:
    - release-github-com-looprig-inference
---

# Model access without secret-bearing models

A model is a description, not a credential. Inference `model.Model` names a provider, wire format, endpoint, model ID, capabilities, limits, and default sampling. LLM and Credentials bind that description to an authorizer and an HTTP client. The request adds system prompt, messages, tools, and output constraints for one turn.

## Identity {#identity}

`Model.Key` is the stable provider and model identity. `Model.Validate` checks structural safety, including a non-empty name, safe endpoint, capability relationships, and context limits. It intentionally does not reject an unknown provider or API format. That openness lets an application provide its own codec or route; known-provider policy belongs in LLM or the application's composition root.

## Credential boundary {#credential-boundary}

API keys, OAuth sources, SigV4 credentials, and workload identity stay in Credentials and Secrets. `auto.NewWithAuth` or a provider constructor receives the authorizer at construction. Do not serialize it into a model catalog, request, transcript, or diagnostic. A credential source can expire or be invalidated while the model identity remains reusable.

## Gateway {#gateway}

Inference Gateway is useful when several clients need different ingress dialects but should share one bound target. `NewMux` resolves exact aliases before format defaults and a global default; `Strict` refuses fallback. The gateway authenticates its own inbound bearer token, separately from the outbound provider authorizer. `stage-22-model-gateway` demonstrates this distinction with a fake upstream and a strict unknown route.
