---
id: reference/packages/harness/foreign
title: foreign package · foreign
description: Reference for Harness foreign-loop builder and delivery seams.
audience: developer
section: reference
order: 142
publication: released
examples:
  - stage-15-acp-foreign
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# foreign package · foreign

Import path: `github.com/looprig/harness/pkg/foreign`. Foreign defines the structural seam a Harness Rig uses to install ACP, Claude, Codex, or another external loop backend.

## Package role {#package-role}

Builders receive the loop context, session and loop identity, parent provenance, and optional scoped services. A restored builder receives persisted foreign identity instead of assuming a live provider process. Delivery hooks reserve, publish, and resolve cross-boundary messages.

## Exported surface {#exported-surface}

The surface contains `Builder`, `RestoredBuilder`, `ServicesBuilder`, `ServicesRestoredBuilder`, `BuilderRegistry`, `Services`, `RestoredForeign`, `BrokerDescriptor`, `DeliveryHook`, `DeliveryIntent`, `DeliveryResolution`, `EventPublisher`, and `UnknownProfileError`. `NewBrokerDescriptor` and `NewServices` construct the value seams.

### Functions and methods {#functions-and-methods}

`NewBrokerDescriptor` copies a broker endpoint and capability token; `NewServices` groups broker and delivery hooks. `BuilderRegistry.Register`, `RegisterServices`, `ServicesBuilder`, and lookup methods keep live and restored constructors under one profile.

### Types {#types}

`DeliveryResolutionState` distinguishes injected, queued, rejected, and unknown delivery. `RestoredForeign` carries persisted provider identity and session state without exposing provider wire data to the loop package.

### Constants and variables {#constants-and-variables}

The package has no authority-bearing global registry. Profile names and delivery states are values supplied by the composition root.

## Ownership and errors {#ownership-and-errors}

The Rig owns registration and lifetime. A builder owns only the backend it creates and must not retain mutable caller bindings after construction. Unknown profile, invalid service, and delivery errors are terminal for that operation; do not fabricate a restored backend.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned foreign seam](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/foreign/). `stage-15-acp-foreign` registers both service builder variants and checks their availability.
