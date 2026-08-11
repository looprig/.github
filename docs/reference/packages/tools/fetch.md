---
id: reference/packages/tools/fetch
title: fetch package · fetch
description: Reference for bounded HTTP fetches.
audience: developer
section: reference
order: 164
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  package-role: release-github-com-looprig-tools
  exported-surface: release-github-com-looprig-tools
  functions-and-methods: release-github-com-looprig-tools
  types: release-github-com-looprig-tools
  constants-and-variables: release-github-com-looprig-tools
  ownership-and-errors: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# fetch package · fetch

Import path: `github.com/looprig/tools/fetch`. Fetch performs a prepared HTTP read through a caller-owned `http.Client`.

## Package role {#package-role}

`NewFetch` binds the HTTP client. The tool validates URL, method, headers, and body limits before the request, while the gate and network enforcement owner decide whether the destination is permitted.

## Exported surface {#exported-surface}

The public API is `Fetch` and `NewFetch`; root composition is `tools.FetchDefinition`.

### Functions and methods {#functions-and-methods}

`NewFetch` constructs a client-bound tool. Calls return bounded status, headers, and body values.

### Types {#types}

`Fetch` implements the Harness tool contract. Transport, status, body-limit, and invalid-request failures stay distinct in the result.

### Constants and variables {#constants-and-variables}

No default global HTTP client or credential source is installed.

## Ownership and errors {#ownership-and-errors}

The caller owns the HTTP client and its transport. Do not log authorization headers or retry a non-idempotent request after a partial response.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned fetch package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/fetch/). Use the prepared tool example for the caller-owned boundary.
