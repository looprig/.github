---
id: guides/tools/built-in-tools/fetch
title: Fetch
description: Make one bounded, target-scoped HTTP request with an injected client.
audience: developer
section: guides
order: 14
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  bounded-runtime: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Fetch

`Fetch` performs one HTTP `GET` or `POST` with an injected `*http.Client`. It has no filesystem dependency. The client belongs to the composition root, which can set transport, TLS, and timeout policy without giving the tool a way to construct a broader client.

## Contract

The JSON shape is `{"url":"https://example.com/api","method":"GET","headers":{},"body":"","timeout":30}`. Only `http://` and `https://` URLs with a host are accepted. Method, scheme, host, and port are normalized during preparation. HTTPS defaults to port 443 and HTTP to port 80. The prepared request emits one `network` requirement with `tcp://host:port` as its canonical match and an empty grant pair. A durable target candidate can cover another request to the same host and port.

The request path, query, headers, and body remain inside the prepared artifact. Audit summaries and errors use method and host only, so a query credential or request body is not logged.

## Bounded Runtime

The default runtime is 30 seconds and the hard maximum is 60 seconds. Response bodies are capped at 64 KiB. At most 16 response headers are summarized. A non-2xx status is a normal result with status, header summary, and body. Transport errors and timeouts are result errors.

Redirects are constrained to the same normalized scheme, host, and port as the approved target. A redirect to a different target is blocked, including a redirect that would otherwise remain within HTTP. This is target enforcement in addition to the gate requirement.

```go
// Inject the client so the product controls transport and TLS policy.
client := &http.Client{Timeout: 10 * time.Second}
fetcher := fetch.NewFetch(client)
request, artifact, err := fetcher.PrepareCall(ctx, executionID,
	`{"url":"https://example.com/data","method":"GET"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := fetcher.InvokableRun(prepared, `{}`)
```

Pair Fetch with [Safety, Permissions, and Gates](/docs/guides/tools/safety) and the Inference [tool request](/docs/guides/inference/requests/tools) and [tool-result](/docs/guides/inference/content-blocks/tool-result) pages. `Fetch` is distinct from [WebSearch](/docs/guides/tools/built-in-tools/websearch): Fetch accepts one model-selected URL, while WebSearch accepts a provider with a declared endpoint set.

## Source

- [Fetch implementation](https://github.com/looprig/tools/blob/main/fetch/fetch.go)

## Proof

- [Fetch behavior tests](https://github.com/looprig/tools/blob/main/fetch/fetch_test.go)
- [Fetch preparation and redirect tests](https://github.com/looprig/tools/blob/main/fetch/preparecall_test.go)
