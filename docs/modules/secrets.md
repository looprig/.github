---
id: modules/secrets
title: Secrets and opaque references
description: Store secret values without making ordinary formatting or references disclose them.
audience: developer
section: modules
order: 2
publication: released
proofs:
  repository: release-github-com-looprig-secrets
  value-safety:
    - release-github-com-looprig-secrets
  references-and-pages:
    - release-github-com-looprig-secrets
  local-store:
    - release-github-com-looprig-secrets
  failures:
    - release-github-com-looprig-secrets
---

# Secrets and opaque references

## Repository

Source, package documentation, tests, and examples are available in the [`looprig/secrets` repository](https://github.com/looprig/secrets).

Secrets `v0.1.0` defines the value, reference, version, and store contracts used by credential implementations. Install `github.com/looprig/secrets@v0.1.0` when consuming the released API. A secret value is not a configuration string with convenient formatting; it is an opaque value that a caller explicitly unwraps only at the point of use.

## Value safety {#value-safety}

`secrets.New` copies the supplied bytes and rejects an empty value or a value over `MaxSecretSize`. The resulting `Secret` has no useful ordinary representation. Call `Bytes` only at the boundary that needs the bytes, and clear or discard that copy as soon as the downstream operation permits. A zero `Secret` is invalid and must not be stored as if it were an empty credential.

The package-owned error types keep caller values out of diagnostics. Cancellation, conflicts, corrupt records, unavailable backends, invalid versions, and invalid paths are classified with exported errors and `errors.Is` or `errors.As`.

## References and pages {#references-and-pages}

`Reference` is a strict `scheme://path` identity. Schemes are normalized to lowercase; the path is an opaque slash-separated identifier, not a filesystem path. Query strings, fragments, authorities, traversal elements, and endpoint-style URLs are rejected. `Namespace` provides a canonical scheme and prefix for listings. `Page`, `PageToken`, and `Metadata` let a store return bounded metadata without returning secret bytes. Page and token limits are part of the contract, not suggestions to an implementation.

`Store` performs value operations, `Resolver` supplies read access, and `Lister` supplies metadata pages. `PutOptions` and `DeleteOptions` describe create-only, unconditional, or compare-and-swap behavior. `VersionUnsupported` is an explicit backend capability marker; it must not be invented from timestamps or hashes.

## Local store {#local-store}

The `secrets/local` package implements an owner-only store rooted at an absolute path supplied by the caller. `New` or `NewWithOptions` opens the root, keeps its directory handle for the store lifetime, and rejects unsupported platforms. `Put` uses rename as its mutation linearization point; `Delete` is idempotent for an absent reference; `Resolve` validates the stored envelope before returning a record; and `List` returns metadata from a bounded snapshot. Close is idempotent.

If a rename or unlink is visible but directory durability cannot be confirmed, the local store returns a visible-commit durability error. Reread and adopt the visible state. Do not assume the old record survived merely because the operation returned an error.

## Failures {#failures}

Never treat a malformed reference, corrupt envelope, unsupported scheme, expired page token, or unavailable store as an empty result. A conflict means the compare-and-swap precondition did not hold. The package's contract tests and native examples under `secrets/examples/secret-safety`, `references`, `local-store`, and `contracttest` are the practical proof of these boundaries.
