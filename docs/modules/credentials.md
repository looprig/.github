---
id: modules/credentials
title: Credential catalogs, sources, and refresh
description: Build explicit credential sources from a secret-free catalog and injected dependencies.
audience: developer
section: modules
order: 3
publication: released
proofs:
  catalog-and-source:
    - release-github-com-looprig-credentials
  dependency-injection:
    - release-github-com-looprig-credentials
  refresh-and-oauth:
    - release-github-com-looprig-credentials
  lifecycle-and-failures:
    - release-github-com-looprig-credentials
---

# Credential catalogs, sources, and refresh

Credentials `v0.1.0` turns a catalog identity into a usable, short-lived source without placing secret bytes in the catalog. Install `github.com/looprig/credentials@v0.1.0`. The module depends on the released Secrets contract and keeps provider construction explicit.

## Catalog and source {#catalog-and-source}

`Catalog` stores secret-free `Record` values: provider, usage class, sharing scope, descriptor, generation, and references to secret state. `Reference`, `Descriptor`, `Failure`, and `Generation` validate the identity vocabulary before a record reaches a catalog. `CatalogCAS` supports explicit compare-and-swap replacement for reauthentication; it is not an unconditional update primitive. `catalog.Local` persists the index in an owner-only directory and validates the complete collection before returning a result, so duplicate or unknown records fail closed instead of being hidden by a partial list.

`Source` is the runtime handle for obtaining a provider-specific authorizer. `Builder` receives a catalog, secret resolver/store, state namespace, precondition capabilities, refresh coordinator, clock, and provider factories as explicit dependencies. `Build` resolves exactly one reference and invokes exactly one matching factory. There is no package-level registry, home-directory lookup, or implicit environment configuration.

## Dependency injection {#dependency-injection}

Use `ProviderFactories` to register the exact descriptor and constructor a composition root supports. The builder does not infer a browser, silently choose a credential scheme, or turn an unknown provider response into a usable source. HTTP authorization helpers in `httpauth` accept a `secrets.Secret` and produce a bounded `Authorization` header; they reject nil requests, invalid names, unsafe values, and zero secrets.

## Refresh and OAuth {#refresh-and-oauth}

The `refresh` package supplies in-process, process-scoped, or file-backed coordination. A refresh source acquires a lease, checks state, performs one injected exchange, and publishes new state with compare-and-swap semantics. Ambiguous rotation or refresh is not treated as success. A closed source cannot be reacquired.

The `oauth` package contains PKCE, state guards, loopback callback parsing, device authorization polling, token response parsing, and bounded provider errors. State and verifier values have explicit length limits; callback origin and redirect checks are enforced before exchange; response and header sizes are bounded. OAuth support is a transport and lifecycle primitive, not an authorization decision for a particular provider account.

## Lifecycle and failures {#lifecycle-and-failures}

Catalogs and refresh coordinators must be closed at their documented boundary. A source lease is finite and must be released or allowed to expire; callers must not retain a source after `Close` or `Invalidate`. Catalog mutations may return a visible-durability-unknown error, which means the caller must reread and adopt the visible result. Typed errors deliberately omit provider responses, tokens, and caller-controlled credential strings.

Native examples under `credentials/examples/catalog-selection`, `references`, `source-lifecycle`, and `refresh` exercise these seams. The current central example manifest does not claim a live credential provider, so provider calls remain opt-in and are not presented as offline proof.
