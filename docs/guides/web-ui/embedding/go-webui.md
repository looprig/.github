---
id: guides/web-ui/embedding/go-webui
title: Go webui package
description: Serve the embedded dist tree with an http.Handler that preserves assets, SPA routes, content types, and path confinement.
audience: developer
section: guides
order: 13
publication: released
proofs:
  embedded-files-and-handler: [release-github-com-looprig-client]
  fallback-and-confinement: [release-github-com-looprig-client]
  handler-tests: [release-github-com-looprig-client]
  source: [release-github-com-looprig-client]
  proof: [release-github-com-looprig-client]
---

# Go webui package

## Embedded files and handler

`pkg/webui` exposes two public values: `FS`, the embedded `embed.FS`, and `Handler()`, an `http.Handler` over that tree. The handler maps a request into the `dist` root, serves a real non-directory asset with `http.ServeContent`, and uses `dist/index.html` for an absent asset or client route.

```go
func mount(mux *http.ServeMux) {
  mux.Handle("/", webui.Handler())
}

func inspectBuild() ([]string, error) {
  entries, err := fs.ReadDir(webui.FS, "dist")
  if err != nil {
    return nil, err
  }
  names := make([]string, 0, len(entries))
  for _, entry := range entries {
    names = append(names, entry.Name())
  }
  return names, nil
}
```

## Fallback and confinement

The path helper cleans the request under a rooted slash, joins it below `dist`, and checks the prefix before opening the embedded file. `fs.ValidPath` and `embed.FS` provide another boundary check. A traversal-shaped or unknown request therefore returns the SPA shell rather than content outside the embedded tree. A directory also falls back instead of becoming a directory listing.

```text
/assets/app.js       -> dist/assets/app.js -> asset
/sessions/abc123     -> dist/sessions/... -> index.html fallback
/../../etc/passwd    -> confined dist/...  -> index.html fallback
```

For the guarded API and SPA mount, continue to [Application integration](/docs/guides/web-ui/embedding/app-integration).

## Source

The public `FS`, handler, path confinement, asset serving, and index fallback are implemented in [`pkg/webui/webui.go`](https://github.com/looprig/client/blob/main/pkg/webui/webui.go). Traversal, fallback, content type, and real-asset behavior are checked in [`pkg/webui/webui_test.go`](https://github.com/looprig/client/blob/main/pkg/webui/webui_test.go).

## Proof

The tests exercise the embedded tree, nested assets, missing assets, arbitrary SPA routes, directory paths, URL-encoded traversal, and real HTTP requests. They also verify that the root response is HTML and that no path escapes `dist`.

