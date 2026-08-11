---
id: build/04-secrets
title: Build 04: secrets
description: Store and resolve opaque secret values with explicit namespaces, references, compare-and-swap, and cleanup.
audience: developer
section: build
order: 4
publication: released
proofs:
  boundary:
    - release-github-com-looprig-secrets
  composition:
    - release-github-com-looprig-secrets
  lifecycle:
    - release-github-com-looprig-secrets
  errors-and-limits:
    - release-github-com-looprig-secrets
  runnable-proof:
    - release-github-com-looprig-secrets
---

# Build 04: secrets

Use `secrets` when a component must refer to sensitive bytes without gaining a general-purpose configuration map. The package gives callers names, references, namespaces, and store operations while keeping the `Secret` value opaque at the API boundary.

## Boundary {#boundary}

`Secret` is the value passed between a secret store and a credential source. `New`, `NewWithOptions`, and `Open` construct values or stores; `NewStore` provides the configured store implementation. A store can put, resolve, delete, list, and close entries. References identify values without requiring callers to copy or print their contents.

The package also exposes namespace and page-token concepts for listing. Listing metadata is not a license to include secret bytes in logs, telemetry, or an API response. Credentials should translate a resolved secret into the narrow provider capability needed by the transport.

## Composition {#composition}

Place a secret store below `credentials` and above the chosen persistence implementation. The caller chooses the namespace and reference policy; the store owns lookup and deletion; a credential source owns provider-specific interpretation. This keeps provider rotation independent from the application loop and makes it possible to replace a local implementation without rewriting provider code.

## Lifecycle {#lifecycle}

`New` copies caller-provided bytes so the store does not alias an input buffer. Treat `Secret.Bytes` as a sensitive read boundary and release any derived buffers promptly. Close the store after all sources and clients stop resolving through it. A delete removes the named entry from the store, but callers remain responsible for revoking the provider credential itself when the provider supports revocation.

## Errors and limits {#errors-and-limits}

Use the package's typed not-found, conflict, validation, and visibility errors with `errors.Is` or `errors.As`. Compare-and-swap operations protect rotation from overwriting a newer version. The local implementation reports `CommitVisibleDurabilityUnknown` when a commit is visible to the process but durability cannot be established; do not describe that state as durable. Namespaces, references, and page tokens are opaque identifiers and should be validated before being accepted from untrusted input.

## Runnable proof {#runnable-proof}

The Secrets module's native examples and tests cover construction, namespace operations, listing, compare-and-swap, and close behavior. Run them with `GOWORK=off`; source is pinned in the [Secrets release tree](https://github.com/looprig/secrets/tree/v0.1.0/). No central progressive example currently registers this boundary, and precise source/test proof IDs are pending Task15 evidence promotion.
