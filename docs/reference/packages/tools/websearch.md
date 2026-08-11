---
id: reference/packages/tools/websearch
title: websearch package · websearch
description: Reference for provider-backed bounded web search.
audience: developer
section: reference
order: 172
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

# websearch package · websearch

Import path: `github.com/looprig/tools/websearch`. Websearch adapts an injected search provider to a bounded Harness tool.

## Package role {#package-role}

`SearchProvider` is the caller-owned network seam. `NewWebSearch` binds it; the tool validates query, result, and content limits before returning a model-facing result.

## Exported surface {#exported-surface}

The API includes `WebSearch`, `SearchProvider`, `SearchResult`, `Endpoint`, and `DuckDuckGoProvider`; constructors are `NewWebSearch` and `NewDuckDuckGoProvider`.

### Functions and methods {#functions-and-methods}

The provider performs one bounded search; no automatic retry or credential selection is hidden in the tool.

### Types {#types}

`SearchResult` carries bounded title, URL, and snippet values. Provider and decoding failures are distinct from zero results.

### Constants and variables {#constants-and-variables}

No network provider is global; the caller chooses the implementation.

## Ownership and errors {#ownership-and-errors}

The caller owns the HTTP client and provider. Search results are untrusted text and cannot add tools or authority.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned websearch package](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/websearch/). The package tests cover provider and result boundaries.
