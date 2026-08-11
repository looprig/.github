---
id: build/03-credentials
title: Build 03: credentials
description: Resolve provider credentials through catalog sources and refreshable builders without exposing secret bytes to callers.
audience: developer
section: build
order: 3
publication: released
proofs:
  boundary:
    - release-github-com-looprig-credentials
    - release-github-com-looprig-secrets
  composition:
    - release-github-com-looprig-credentials
  lifecycle:
    - release-github-com-looprig-credentials
    - release-github-com-looprig-secrets
  errors-and-limits:
    - release-github-com-looprig-credentials
    - release-github-com-looprig-secrets
  runnable-proof:
    - release-github-com-looprig-credentials
---

# Build 03: credentials

Treat credentials as a provider-facing capability with an explicit source and lifecycle. `credentials` decides how a model client obtains a usable credential; `secrets` owns the opaque value. This separation supports local development and service-managed stores without changing the client construction path.

## Boundary {#boundary}

The credential package exposes `Source`, `Catalog`, `Builder`, and provider factory contracts. A source identifies how a credential is obtained. A catalog resolves a named source, while a builder creates, updates, deletes, or reconciles entries. `ProviderFactories` lets an application register provider-specific construction without making the catalog know every provider package.

The `catalog.Local` implementation is useful for an in-process catalog. HTTP authorization, OAuth, and refresh packages provide provider-facing helpers and typed state transitions; they do not turn a credential source into a general-purpose secret store.

## Composition {#composition}

Have application configuration select a source name and provider. Resolve that source through the catalog, then pass the resulting provider credential capability to the provider factory or `llm.AuthPolicy`. Keep `secrets.Secret` and `secrets.Store` behind the source implementation. A model request should receive the minimum credential material required by its transport, not a catalog or a store handle.

Use a builder when the operation changes catalog state or must reconcile an external account. Use a source when a read-only client needs a credential. This distinction makes rotation and deletion explicit and keeps a request path from unexpectedly mutating configuration.

## Lifecycle {#lifecycle}

Catalogs and stores are owned resources. Close them at the application boundary after clients and refresh workers stop using them. Builders return the created or reconciled result; callers own any resulting handles according to the declaration. Refresh flows should retain only the current usable credential and should not assume that an access token is durable after its expiry window.

## Errors and limits {#errors-and-limits}

Missing names, invalid source configuration, authorization failures, refresh failures, and conflict outcomes have typed errors in the relevant package. Match them with `errors.Is` or `errors.As`, and report whether a caller should retry, reauthorize, or change configuration. Do not treat a provider error string as a portable classification. Credential helpers must redact tokens and authorization headers from logs and returned diagnostics.

## Runnable proof {#runnable-proof}

The released Credentials module's native examples and tests exercise local catalog construction, provider sources, HTTP authorization, OAuth state, and refresh behavior. Run the module's own example and test commands with `GOWORK=off`; its source is pinned in the [Credentials release tree](https://github.com/looprig/credentials/tree/v0.1.0/) and the [Secrets release tree](https://github.com/looprig/secrets/tree/v0.1.0/). A central progressive example for this boundary is not currently registered, and precise source/test proof IDs are pending Task15 evidence promotion.
