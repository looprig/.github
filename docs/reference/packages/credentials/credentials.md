---
id: reference/packages/credentials/credentials
title: credentials package
description: Reference for the credentials package at github.com/looprig/credentials, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 20
publication: released
proofs:
  package-role: release-github-com-looprig-credentials
  exported-surface: release-github-com-looprig-credentials
  functions-and-methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants-and-variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# credentials package

Import path: `github.com/looprig/credentials`. This public package defines one part of the module API.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Acquire`, `AtLeast`, `Binding`, `BindingCanonical`, `Build`, `Canonical`, `CatalogTimeValid`, `Close`, `Create`, `CreateCredentialState`, `Delete`, `DeleteCredentialState`, `Descriptor`, `Error`, `Format`, `GoString`, `Invalidate`, `Is`, `IsZero`, `List`, `LogValue`, `Lookup`, `MarshalText`, `Name`, `NewCatalogCanceledError`, `NewCatalogConflictError`, `NewCatalogCorruptError`, `NewCatalogDurabilityUnknownError`, `NewCatalogNotFoundError`, `NewCatalogUnavailableError`, `NewCatalogUnsupportedError`, `Now`, `Orphaned`, `Provider`, `PublishState`, `Reason`, `Reconcile`, `Reference`, `Scheme`, `Snapshot`, `String`, `UnmarshalText`, `Unwrap`, `Valid`, `Validate`, `ValidateRecord`, `Visible`

### Types {#types}

`Builder`, `CallbackListener`, `CanceledError`, `Catalog`, `CatalogCAS`, `CatalogDurabilityUnknownError`, `CatalogError`, `Clock`, `ClockFunc`, `Descriptor`, `DescriptorBinding`, `FactoryInput`, `Failure`, `FailureClass`, `Finding`, `FindingKind`, `Generation`, `InvalidDescriptorError`, `InvalidFailureError`, `InvalidGenerationError`, `InvalidRecordError`, `InvalidReferenceError`, `Lease`, `NilContextError`, `NoneSource`, `OrphanState`, `ProviderFactories`, `ReconcileFinding`, `Record`, `Reference`, `RefreshCoordinator`, `Scheme`, `SharingScope`, `Source`, `SourceClosedError`, `SourceFactory`, `StateDeletionError`, `StatePublicationError`, `StatePublisher`, `UsageClass`

### Constants and variables {#constants-and-variables}

`FailureAuthExpired`, `FailureAuthRejected`, `FailureAuthRevoked`, `FailureExpired`, `FailureRejected`, `FailureRevoked`, `FindingMissing`, `FindingOrphan`, `MaxDescriptorFieldLength`, `MaxDescriptorIdentifierLength`, `MaxDescriptorLength`, `MaxGenerationLength`, `MaxReferenceComponentLength`, `MaxReferenceLength`, `RecordSchemaV1`, `ScopeDistributed`, `ScopeHost`, `ScopeProcess`, `SharingScopeDistributed`, `SharingScopeHost`, `SharingScopeProcess`, `ErrBuilderDependency`, `ErrBuilderRecord`, `ErrCanceled`, `ErrCatalogCanceled`, `ErrCatalogConflict`, `ErrCatalogCorrupt`, `ErrCatalogDuplicate`, `ErrCatalogDurabilityUnknown`, `ErrCatalogInsecurePath`, `ErrCatalogInvalidDependency`, `ErrCatalogInvalidRecord`, `ErrCatalogNotFound`, `ErrCatalogUnavailable`, `ErrCatalogUnknownSchema`, `ErrCatalogUnsupported`, `ErrCatalogUnsupportedPlatform`, `ErrCatalogVisibleDurabilityUnknown`, `ErrClosed`, `ErrFactoryConstruction`, `ErrFactoryMismatch`, `ErrFactoryUnsupported`, `ErrInvalidDescriptor`, `ErrInvalidFailure`, `ErrInvalidGeneration`, `ErrInvalidRecord`, `ErrInvalidReference`, `ErrInvalidScheme`, `ErrInvalidUsage`, `ErrNilContext`, `ErrOrphanState`, `ErrRefreshScope`, `ErrSourceClosed`, `ErrStateDeleteFailed`, `ErrStateDurabilityUnknown`, `ErrStateNamespace`, `ErrStateUnavailable`

## Ownership and errors {#ownership-and-errors}

The credentials package exposes `Acquire`, `AtLeast`, `Binding`, `BindingCanonical` as its main operations. The principal handle or value is `Builder`; retain it according to its declaration before calling a terminal method. Use `Build` as the package construction entry point when creating that value. Its exported typed failures include `CanceledError`, `CatalogDurabilityUnknownError`, `CatalogError`, `Failure`; classify them with errors.Is or errors.As. Credential sources must redact tokens and cannot make provider authorization durable by themselves.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/credentials/tree/v0.1.0/) and adjacent tests. The repository keeps deterministic examples beside the implementation. Run the module tests with `GOWORK=off go test ./...` and use the package-level examples where present. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-credentials`.
