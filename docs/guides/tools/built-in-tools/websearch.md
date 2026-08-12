---
id: guides/tools/built-in-tools/websearch
title: WebSearch
description: Search through an injected provider with declared network endpoints.
audience: developer
section: guides
order: 20
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# WebSearch

`WebSearch` delegates search to an injected `SearchProvider`. The provider exposes both `Search(ctx, query, max)` and `Endpoints()`. This seam keeps network behavior in a product-owned provider while the tool validates the endpoint declaration and prepares the gate request.

## Contract

The JSON shape is `{"query":"Looprig","results":5}`. Empty queries fail preparation. Results default to 5 and are capped at 10. Preparation normalizes and deduplicates every provider endpoint, then emits one `network` requirement per declared HTTPS target using the shared `network` capability and `tcp://host:port` match. A provider with no valid endpoint declaration cannot be prepared.

The direct tool carries no filesystem access. At runtime the provider must honor the caller context and fail closed on redirects or secondary targets outside its declared endpoints. A provider error becomes the generic result `error: web search failed`, not a transport detail or URL dump. `SearchResult` values contain title, URL, and snippet, and an empty result set becomes `No results found.`

`NewDuckDuckGoProvider(client)` declares `html.duckduckgo.com:443`, uses the injected client, bounds HTML parsing to 1 MiB, limits redirect chains, and parses malformed HTML defensively. A different provider can implement the same interface and declare its own endpoints.

```go
// The provider owns the HTTP client and endpoint declaration.
provider := websearch.NewDuckDuckGoProvider(client)
search := websearch.NewWebSearch(provider)
request, artifact, err := search.PrepareCall(ctx, executionID,
	`{"query":"Looprig","results":5}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := search.InvokableRun(prepared, `{}`)
```

Compare [Fetch](/docs/guides/tools/built-in-tools/fetch/) when the model already knows the URL. Both use the shared network capability and target matching. See [Safety, Permissions, and Gates](/docs/guides/tools/safety/) and Inference's [tool requests](/docs/guides/inference/requests/tools/).

## Source

- [WebSearch tool and provider interface](https://github.com/looprig/tools/blob/main/websearch/websearch.go)
- [DuckDuckGo provider](https://github.com/looprig/tools/blob/main/websearch/duckduckgo.go)

## Proof

- [WebSearch behavior tests](https://github.com/looprig/tools/blob/main/websearch/websearch_test.go)
- [Provider preparation tests](https://github.com/looprig/tools/blob/main/websearch/preparecall_test.go)
- [DuckDuckGo integration tests](https://github.com/looprig/tools/blob/main/websearch/web_integration_test.go)
