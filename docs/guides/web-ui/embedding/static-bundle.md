---
id: guides/web-ui/embedding/static-bundle
title: Static bundle
description: Configure SvelteKit and adapter-static to emit one SPA shell and its assets into the Go package's embedded dist directory.
audience: developer
section: guides
order: 12
publication: released
proofs:
  adapter-static-output: [release-github-com-looprig-client]
  client-only-routing: [release-github-com-looprig-client]
  configure-adapter-static: [release-github-com-looprig-client]
  keep-routing-client-only: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Static bundle

## Configure adapter-static

The Vite configuration uses SvelteKit's `adapter-static` with both `pages` and `assets` set to `../pkg/webui/dist`. The `fallback` is `index.html`, so arbitrary session routes return one shell instead of requiring a build-time list of session IDs.

```ts
import adapter from "@sveltejs/adapter-static";

const appAdapter = adapter({
  pages: "../pkg/webui/dist",
  assets: "../pkg/webui/dist",
  fallback: "index.html",
});
```

The output directory is shared intentionally. `pkg/webui` uses `//go:embed dist`, and a split pages/assets layout would make the Go serving boundary need extra path rules.

## Keep routing client-only

The root layout exports `ssr = false`. SvelteKit remains the router and build host, while the browser renders the session route. This matches the static fallback: a request for `/sessions/{sid}` receives `index.html`, then client-side routing selects the view.

```ts
// src/routes/+layout.ts
export const ssr = false;
```

In development, Vite proxies `/api` to the BFF at `http://127.0.0.1:8080`, preserving the same relative request paths used by `BFFTransport`. In production, the composed Go handler supplies the same-origin `/api/` route. See [Application integration](/docs/guides/web-ui/embedding/app-integration/).

## Source

The `adapter-static` output, `index.html` fallback, and development `/api` proxy are configured in [`app/vite.config.ts`](https://github.com/looprig/client/blob/main/app/vite.config.ts). Client-only rendering is declared in [`app/src/routes/+layout.ts`](https://github.com/looprig/client/blob/main/app/src/routes/+layout.ts).

## Proof

The build configuration writes both pages and assets to the embedded `dist` directory and names the same `index.html` fallback used by the Go handler. The layout setting proves that arbitrary session IDs are resolved in the browser rather than enumerated during the build.
