---
id: guides/web-ui/embedding/static-bundle
title: Static bundle
description: Build a Vite single-page app over the Looprig npm packages, embed its output in Go, and serve it with an index.html fallback.
audience: developer
section: guides
order: 14
publication: released
proofs:
  project-layout: [release-npm-looprig-client, release-npm-looprig-react]
  configure-vite: [release-npm-looprig-client]
  embed-and-serve-in-go: [release-npm-looprig-client]
  develop-against-a-running-factory: [release-npm-looprig-client]
  keep-the-bundle-reproducible: [release-npm-looprig-client, release-npm-looprig-react]
  source: [release-npm-looprig-client, release-npm-looprig-react]
  proof: [release-npm-looprig-client, release-npm-looprig-react]
---

# Static bundle

The goal is one Go binary that contains your compiled browser app and serves it next to Factory's API. The app is built once with Vite, the output directory is embedded with `//go:embed`, and a small handler serves real files and falls back to `index.html` for client-side routes.

## Project layout

```text
myapp/
  web/                     # Vite + React source, package.json pins @looprig/* exactly
    vite.config.ts
    src/main.tsx
  internal/webui/
    webui.go               # //go:embed all:dist and the SPA handler
    dist/                  # vite build output (commit it, or build before go build)
  main.go                  # factory.New(..., factory.WithUIHandler(webui.Handler()))
```

`//go:embed` needs `dist/` to exist at compile time. Committing the built tree lets `go build` work on a machine without Node, which is what Carbon does.

## Configure Vite

```ts
// web/vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const factoryTarget = process.env.FACTORY_TARGET ?? "http://127.0.0.1:8080";

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  build: {
    outDir: "../internal/webui/dist",
    emptyOutDir: true, // required when outDir is outside the Vite root
    assetsDir: "assets", // never a name starting with "_" or "."
  },
  // Development only: forward Factory's routes. No rewrite, because Factory routes on /v1.
  ...(command === "serve" && mode !== "test"
    ? { server: { proxy: {
        "/v1/realtime": { target: factoryTarget, ws: true, changeOrigin: false },
        "/v1": { target: factoryTarget, changeOrigin: false },
      } } }
    : {}),
}));
```

In the app, call `createFactoryClient()` or mount `FactoryIdentityProvider` with no `baseUrl`. The client then uses relative `/v1/...` paths and `/v1/realtime`, which are correct both under the dev proxy and when Factory serves the bundle.

## Embed and serve in Go

```go
package webui

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

// all: keeps files whose names start with "_" or "." that a plain embed skips.
//
//go:embed all:dist
var embedded embed.FS

// Factory sets no Content-Security-Policy for UI responses. Adjust this to your bundle.
const csp = "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"

// Handler serves a real file from dist, or index.html so the client router can resolve the path.
func Handler() http.Handler {
	dist, err := fs.Sub(embedded, "dist")
	if err != nil {
		panic(err) // "dist" is a constant embedded path
	}
	files := http.FileServerFS(dist)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		name := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		if info, err := fs.Stat(dist, name); name == "" || err != nil || info.IsDir() {
			w.Header().Set("Content-Security-Policy", csp)
			http.ServeFileFS(w, r, dist, "index.html")
			return
		}
		files.ServeHTTP(w, r)
	})
}
```

Factory never passes a `/v1/...` path to this handler, so the fallback cannot shadow an API route. Cleaning a rooted path before the lookup keeps every name inside `dist`, and `fs.Sub` over `embed.FS` rejects `..` on its own as well.

## Develop against a running Factory

Run Factory, then `npm run dev` in `web/` with `FACTORY_TARGET` pointing at it. With `changeOrigin: false` the browser's origin reaches Factory unchanged, so add the Vite origin, for example `http://localhost:5173`, to `identity.CSRFConfig.TrustedOrigins` in development. Factory checks the request host and origin against that list on every API request and on the ClientLink upgrade.

## Keep the bundle reproducible

Pin `@looprig/client` and `@looprig/react` to the same exact version, `0.2.0`, and commit the lockfile. `@looprig/react` itself depends on exactly `@looprig/client` 0.2.0, so a caret range on one and not the other can install two copies. Carbon v0.31.0 goes further: its release script builds twice into separate directories and compares the results before it commits `dist/`.

## Source

Carbon's [`web/vite.config.ts`](https://github.com/looprig/carbon/blob/v0.31.0/web/vite.config.ts) and [`internal/browserui/assets.go`](https://github.com/looprig/carbon/blob/v0.31.0/internal/browserui/assets.go) are the released model for this page. The relative endpoints come from `createFactoryClient` in [`packages/client/src/client.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/src/client.ts), and the exact client pin is in [`packages/react/package.json`](https://github.com/looprig/client/blob/v0.2.0/packages/react/package.json).

## Proof

[`packages/client/test/vanilla-consumer.test.ts`](https://github.com/looprig/client/blob/v0.2.0/packages/client/test/vanilla-consumer.test.ts) builds and runs a clean consumer from the packed tarball, and Carbon's asset tests cover traversal confinement and the index fallback in the same shape as the handler above. Continue with [Application integration](/docs/guides/web-ui/embedding/app-integration).
