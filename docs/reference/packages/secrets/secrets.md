---
id: reference/packages/secrets/secrets
title: secrets package
description: Reference for the secrets package at github.com/looprig/secrets, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 27
publication: released
proofs:
  package-role: release-github-com-looprig-secrets
  exported-surface: release-github-com-looprig-secrets
  functions-and-methods: release-github-com-looprig-secrets
  types: release-github-com-looprig-secrets
  constants-and-variables: release-github-com-looprig-secrets
  ownership-and-errors: release-github-com-looprig-secrets
  source-and-runnable-proof: release-github-com-looprig-secrets
---

# secrets package

Import path: `github.com/looprig/secrets`. Package secrets defines the opaque value and reference contracts used by LoopRig's credential stores. Secret values deliberately have no useful ordinary representation: callers must opt in to Bytes at the point where a value is consumed.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Bytes`, `Canonical`, `Contains`, `Error`, `Format`, `GoString`, `Is`, `IsUnsupported`, `IsVisibleCommit`, `IsZero`, `LogValue`, `MarshalText`, `Metadata`, `New`, `NewDeleteResult`, `NewNamespace`, `NewPage`, `NewPageToken`, `NewReference`, `NewVersion`, `ParseNamespace`, `ParseReference`, `Path`, `Prefix`, `Reason`, `Reference`, `Scheme`, `String`, `UnmarshalText`, `Unwrap`, `Valid`, `Validate`

### Types {#types}

`CanceledError`, `ConflictError`, `CorruptRecordError`, `DeleteOptions`, `DeleteResult`, `DeleteStatus`, `EmptySecretError`, `InsecurePathError`, `InvalidNamespaceError`, `InvalidOptionsError`, `InvalidPageTokenError`, `InvalidReferenceError`, `InvalidVersionError`, `Lister`, `Metadata`, `Namespace`, `NotFoundError`, `Page`, `PageToken`, `Precondition`, `PreconditionCapabilities`, `PutOptions`, `Record`, `Reference`, `Resolver`, `Secret`, `SecretSizeError`, `Store`, `UnavailableError`, `UnsupportedCapabilityError`, `UnsupportedSchemeError`, `Version`, `VersionMismatchError`, `VisibleCommitError`, `ZeroSecretError`

### Constants and variables {#constants-and-variables}

`MaxPageItems`, `MaxPageTokenLength`, `MaxReferenceLength`, `MaxReferencePathLength`, `MaxReferenceSchemeLen`, `MaxSecretSize`, `MaxVersionLength`, `ErrCanceled`, `ErrConflict`, `ErrCorruptRecord`, `ErrEmptySecret`, `ErrInsecurePath`, `ErrInvalidNamespace`, `ErrInvalidOptions`, `ErrInvalidPageToken`, `ErrInvalidReference`, `ErrInvalidVersion`, `ErrNotFound`, `ErrSecretTooLarge`, `ErrUnavailable`, `ErrUnsupportedCapability`, `ErrUnsupportedScheme`, `ErrZeroSecret`, `VersionUnsupported`

## Ownership and errors {#ownership-and-errors}

The secrets package exposes `Bytes`, `Canonical`, `Contains`, `Format` as its main operations. The principal handle or value is `Store`; retain it according to its declaration before calling a terminal method. Use `New` as the package construction entry point when creating that value. Its exported typed failures include `CanceledError`, `ConflictError`, `CorruptRecordError`, `EmptySecretError`; classify them with errors.Is or errors.As. Secret bytes remain sensitive, and the local store can report a visible but not durable commit.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/secrets/tree/v0.1.0/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-secrets`.
