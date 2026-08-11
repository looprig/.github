---
id: reference/packages/llm/providers/anthropic/subscription
title: subscription package · providers/anthropic/subscription
description: Reference for the subscription package at github.com/looprig/llm/providers/anthropic/subscription, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 261
publication: released
proofs:
  package-role: release-github-com-looprig-llm
  exported-surface: release-github-com-looprig-llm
  functions-and-methods: release-github-com-looprig-llm
  types: release-github-com-looprig-llm
  constants-and-variables: release-github-com-looprig-llm
  ownership-and-errors: release-github-com-looprig-llm
  source-and-runnable-proof: release-github-com-looprig-llm
---

# subscription package · providers/anthropic/subscription

Import path: `github.com/looprig/llm/providers/anthropic/subscription`. Package subscription exposes the Anthropic subscription registration policy boundary. It deliberately has no credential, request, or discovery implementation: the current policy is to reject unsanctioned third-party registration attempts before they can become

## Package role {#package-role}

This provider package binds one external model service to provider-neutral inference requests. The released module is `github.com/looprig/llm@v0.13.3`. Model descriptors remain secret-free; credentials are injected through `credentials` and `secrets` rather than placed on `model.Model`.

## Exported surface {#exported-surface}

The names below are the exported functions, methods, types, constants, and variables returned by the source package documentation.

### Functions and methods {#functions-and-methods}

`Error`, `EvidenceURLs`, `Format`, `LogValue`, `Provider`, `Require`, `ReviewedAt`, `ReviewedDate`, `Status`

### Types {#types}

`RegistrationGate`, `Status`, `UnsupportedRegistrationError`

### Constants and variables {#constants-and-variables}

`EvidenceAgentOverviewURL`, `EvidenceAgentQuickstartURL`, `EvidenceAuthenticationURL`, `EvidenceLegalURL`, `EvidenceThirdPartyUsageURL`, `RegistrationStatusBlocked`, `RegistrationStatusUnavailable`, `ReviewedAtDate`, `StatusBlocked`, `StatusUnavailable`

## Ownership and errors {#ownership-and-errors}

The Anthropic subscription package exposes `EvidenceURLs`, `Format`, `LogValue`, and `Provider` for its registration policy. `Require` evaluates the `RegistrationGate`; `UnsupportedRegistrationError`, `RegistrationStatusUnavailable`, and `StatusUnavailable` classify a gate that cannot authorize the registration. Provider subscriptions may intentionally fail closed when the required gate is unavailable.

## Source and runnable proof {#source-and-runnable-proof}

Read the [package source](https://github.com/looprig/llm/tree/v0.13.3/providers/anthropic/subscription/) and adjacent tests. Provider deterministic tests run in the llm module; live probes are opt-in. The release proof pins the module tag only; Task15 should promote declaration and adjacent-test evidence from this package path. Draft proof: `release-github-com-looprig-llm`.
