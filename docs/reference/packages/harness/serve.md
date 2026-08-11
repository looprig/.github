---
id: reference/packages/harness/serve
title: serve package · serve
description: Reference for the Harness HTTP read and live-session serving seams.
audience: developer
section: reference
order: 151
publication: released
examples:
  - stage-19-http-serve
proofs:
  package-role: release-github-com-looprig-harness
  exported-surface: release-github-com-looprig-harness
  functions-and-methods: release-github-com-looprig-harness
  types: release-github-com-looprig-harness
  constants-and-variables: release-github-com-looprig-harness
  ownership-and-errors: release-github-com-looprig-harness
  source-and-runnable-proof: release-github-com-looprig-harness
---

# serve package · serve

Import path: `github.com/looprig/harness/pkg/serve`. Serve exposes narrow HTTP handlers over live sessions and read-only store projections without importing the concrete session or storage implementations.

## Package role {#package-role}

`ReadHandler` serves capabilities, session lists, status, and public journals through a `Reader`. Generic `Handler` adds live session creation, input, gate response, interruption, and shutdown through structural `Rig` and `LiveSession` interfaces. `Server` validates binding policy and creates an `http.Server`.

## Exported surface {#exported-surface}

Main constructors are `Handler`, `ReadHandler`, and `Server`; options include `WithAuth` and `WithMaxBodyBytes`, while `WithInsecurePublicBind` explicitly changes bind posture. DTOs include `Page`, `SessionList`, `SessionSummary`, `SessionStatus`, `EventJournalPage`, `StatusEvent`, and typed not-found, parameter, store-read, private-event, and public-bind errors.

### Functions and methods {#functions-and-methods}

Handlers implement `http.Handler`. `Server` returns a configured server after validating address and authentication posture.

### Types {#types}

`Reader`, `Rig`, and `LiveSession` are structural interfaces. A read handler cannot access private events, and a public bind requires authentication unless the caller opts into the explicit insecure mode.

### Constants and variables {#constants-and-variables}

Default body and page limits are package values; caller options may narrow them. No global session registry is created.

## Ownership and errors {#ownership-and-errors}

The composition root owns the concrete Rig, sessions, server, and auth function. Serve only routes and bounds requests. Handle `PublicBindWithoutAuthError`, `NonPublicEventError`, `SessionNotFoundError`, and store errors as operational failures rather than returning internal details to clients.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned serve package](https://github.com/looprig/harness/tree/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/pkg/serve/). `stage-19-http-serve` asserts capabilities and session listing while a control route returns 404 because the read handler exposes no live control.
