---
id: reference/tools/network
title: Standard network tools
description: Use Fetch and WebSearch with injected clients, declared endpoints, bounded I/O, and explicit network requirements.
audience: developer
section: reference
order: 263
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  fetch: release-github-com-looprig-tools
  web-search: release-github-com-looprig-tools
  boundaries: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# Standard network tools

`Fetch` and `WebSearch` have no filesystem dependency. Both use an injected network implementation so the composition root can set transport policy and declare the endpoints the gate should evaluate.

## Fetch {#fetch}

`fetch.NewFetch` accepts an `*http.Client`. It permits only HTTP and HTTPS GET or POST, applies a bounded timeout, caps the response body, and returns non-2xx statuses as ordinary results. The client must be configured by the composition root with its intended TLS and proxy policy. Fetch does not manufacture a client or infer trust from a successful status.

## Web search {#web-search}

`websearch.NewWebSearch` accepts a `SearchProvider`. The provider declares every endpoint through `Endpoints`; preparation turns that declaration into a shared network requirement. Search results are capped, and the provider must honor cancellation and fail closed when an auxiliary target is outside its declaration.

## Boundaries {#boundaries}

A network requirement is prepared before the request and evaluated by the gate. Sandbox or transport policy may still block the connection. Keep credentials in the injected client or provider, not in audit summaries, and do not treat a remote response as evidence that the requested product effect was authorized.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned network packages](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/). The prepared-tool example and package tests cover bounded request and provider behavior.
