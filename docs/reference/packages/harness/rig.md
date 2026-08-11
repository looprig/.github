---
id: reference/packages/harness/rig
title: rig package · rig
description: Reference for the Harness Rig composition root, session options, limits, workspaces, and restore policy.
audience: developer
section: reference
order: 150
publication: released
examples:
  - stage-06-rig
  - stage-14-delegation
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# rig package · rig

Import path: `github.com/looprig/harness/pkg/rig`. Rig is the design-time composition root and lifecycle owner for sessions.

## Package role {#package-role}

`Define` validates loop and hustle topology, storage, gates, classifiers, foreign builders, workspace placement, permission review, snapshots, and runtime catalogs. A `Rig` creates or restores sessions through explicit options; it does not perform model inference itself.

## Exported surface {#exported-surface}

Options include `WithLoops`, `WithHustles`, `WithSessionStore`, `WithSessionWorkspaces`, `WithSharedWorkspace`, `WithExclusiveWorkspace`, `WithDelegationLimits`, `WithGateCaps`, `WithPermissionReviewPolicy`, `WithPermissionClassifiers`, `WithForeignBuilders`, `WithRuntimeCatalog`, `WithRestoreDecider`, `WithSnapshots`, and `WithOffloadGC`. Public values include `Rig`, `DelegationLimits`, `GateCaps`, `HustleLimits`, `SnapshotPolicy`, `PermissionReviewLimits`, `SessionResourceStorage`, and workspace recovery errors.

### Functions and methods {#functions-and-methods}

`Define` constructs a Rig. `FingerprintFrom` derives configuration identity from a bound definition. `WithSeedSnapshot` is a session option for workspace recovery.

### Types {#types}

Typed errors classify definition, lifecycle, snapshot, session-option, persistence-overlap, workspace-placement, and workspace-recovery failures. Snapshot priority and trigger enums make persistence policy explicit.

### Constants and variables {#constants-and-variables}

The package exposes queue and permission-review breaker defaults plus snapshot, delegation, and workspace enum values. Defaults are conservative bounds, not user authority.

## Ownership and errors {#ownership-and-errors}

The Rig owns the session store, workspace store, child builders, and resource providers passed to it. A failed `Define` or `NewSession` must be handled before any turn starts. Shutdown is the final owner operation and should be called even after a turn error.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned Rig package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/rig/). `stage-06-rig` and `stage-14-delegation` show composition and session creation.
