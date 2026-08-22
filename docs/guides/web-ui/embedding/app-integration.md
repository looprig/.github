---
id: guides/web-ui/embedding/app-integration
title: Application integration
description: Compose the BFF API and embedded SPA under one guarded HTTP surface while preserving same-origin client behavior.
audience: developer
section: guides
order: 14
publication: released
proofs:
  compose-api-and-spa: [release-github-com-looprig-client]
  guard-the-whole-surface: [release-github-com-looprig-client]
  integration-tests: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Application integration

## Compose API and SPA

`compose.Handler` mounts the BFF mux at `/api/` and the SPA handler at `/`. The mux already registers full `/api/...` patterns, so the composition is a direct mount and does not strip the prefix a second time. API paths reach the BFF; root and arbitrary client routes reach the SPA.

```go
func Handler(mux http.Handler, spa http.Handler, guard *bff.HostOriginGuard) http.Handler {
  top := http.NewServeMux()
  top.Handle("/api/", mux)
  top.Handle("/", spa)
  return guard.Wrap(top)
}
```

The SPA can therefore call `/api/v1/...` through `createBFFClient` without CORS or a separate origin. The [Static bundle](/docs/guides/web-ui/embedding/static-bundle) and [Go webui package](/docs/guides/web-ui/embedding/go-webui) provide the two handlers being composed.

## Guard the whole surface

The same `HostOriginGuard` instance wraps the complete top-level handler, including the SPA path. A rebound host is rejected before either the API mux or the embedded shell runs. Reuse the guard passed to the BFF build so allowed-host configuration cannot diverge between API and browser responses.

```text
request
  -> HostOriginGuard
  -> /api/       -> BFF mux -> harness
  -> everything  -> embedded SPA handler
```

This guard covers the shell as well as API requests. That keeps future HTML additions behind the same origin policy as the control plane. The adjacent [Harness guide](/docs/guides/harness) describes the server surface the BFF forwards to.

## Source

The top-level route composition and whole-surface guard are implemented in [`internal/compose/handler.go`](https://github.com/looprig/client/blob/main/internal/compose/handler.go). Routing and rebound-host behavior are covered in [`internal/compose/handler_test.go`](https://github.com/looprig/client/blob/main/internal/compose/handler_test.go).

## Proof

The integration tests assert `/api/v1/sessions` and `/api/` reach the API handler, root and arbitrary session routes reach the SPA, and disallowed hosts are rejected for both branches before either child handler is called.

