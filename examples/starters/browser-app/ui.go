package main

import (
	"embed"
	"io/fs"
	"net/http"
	"path"
	"strings"
)

// web/dist is produced by `npm run build` in web/. Only its .gitkeep is
// committed, so `go run .` works before the SPA is built; the API is served
// either way.
//
//go:embed all:web/dist
var webDist embed.FS

const notBuilt = `<!doctype html><title>browser-app</title>
<body style="font-family:system-ui;max-width:36rem;margin:4rem auto">
<h1>The web UI is not built yet</h1>
<p>Run <code>cd web &amp;&amp; npm ci &amp;&amp; npm run build</code>, then restart <code>go run .</code>,
or use <code>npm run dev</code> for live reload. The Factory API is already up under <code>/v1</code>.</p></body>`

// spaHandler serves the built SPA, answering index.html for client-side
// routes. Factory mounts it as the fallback after /v1, so an unknown API path
// is still a JSON 404, never index.html.
func spaHandler() http.Handler {
	dist, err := fs.Sub(webDist, "web/dist")
	if err != nil {
		panic(err)
	}
	files := http.FileServerFS(dist)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := fs.Stat(dist, "index.html"); err != nil {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			_, _ = w.Write([]byte(notBuilt))
			return
		}
		name := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if _, err := fs.Stat(dist, name); name == "" || err != nil {
			r = r.Clone(r.Context())
			r.URL.Path = "/" // client-side route: serve index.html
		}
		files.ServeHTTP(w, r)
	})
}
