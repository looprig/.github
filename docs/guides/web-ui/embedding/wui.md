---
id: guides/web-ui/embedding/wui
title: Prebuilt wui bundle
description: Serve the prebuilt Looprig React UI from a Go binary, check its bundle marker, and choose between wui and the client SDK.
audience: developer
section: guides
order: 15
publication: released
proofs:
  choose-wui-or-the-client-sdk: [release-github-com-looprig-wui]
  go-api: [release-github-com-looprig-wui]
  mount-the-bundle-under-factory: [release-github-com-looprig-wui]
  read-attributed-messages: [release-github-com-looprig-wui]
  check-the-bundle-marker: [release-github-com-looprig-wui]
  deprecated-harness-serve-adapter: [release-github-com-looprig-wui]
  move-the-pin: [release-github-com-looprig-wui]
  source: [release-github-com-looprig-wui]
  proof: [release-github-com-looprig-wui]
---

# Prebuilt wui bundle

`github.com/looprig/wui` is a finished browser interface for Looprig sessions: a React single-page app built to a static bundle, embedded in the module with `//go:embed`, and exposed as ordinary `http.Handler` values. Use it when you want a working session UI in your Go binary without writing a front end. The pages above describe the other route, building your own app on the [client SDK](/docs/guides/web-ui/client-sdk).

## Choose wui or the client SDK

| Need | Use |
| --- | --- |
| A ready session list, transcript, composer, interrupt, and gate answers served by a [Factory](/docs/modules/factory) | `wui.Assets()` passed to Factory's UI handler option |
| Your own UI, framework, or design system | The client SDK, or your own client over the same HTTP contract |
| An existing product on the deprecated Harness `pkg/serve` API | `wui.Handler`, for compatibility only |

The wui bundle talks to its own origin. It reads Factory's REST routes under `/v1/` (bootstrap, agents, sessions, status, journal, gates, and retained objects) and opens the ClientLink WebSocket at `/v1/realtime`. It supplies no login service and no durable session store: authentication, origin and CSRF checks, and every API route belong to the server that mounts it.

The client SDK in `github.com/looprig/client` targets the Harness `pkg/serve` contract through its BFF. That package is marked deprecated in Harness in favor of Factory, so prefer wui, or your own client over Factory, for a new browser deployment.

## Go API

The exported surface takes and returns `http.Handler` and names no type from another Looprig module.

```go
func Assets() http.Handler                                      // the SPA alone
func Guard(next http.Handler, opts ...GuardOption) http.Handler // Host/Origin guard alone
func BundleProtocolVersion() (Bundle, error)                    // the embedded bundle's marker

// Deprecated: compose Assets, Guard, and API-specific controls explicitly.
func Handler(api http.Handler, opts ...Option) http.Handler

func WithAllowedHosts(hosts ...string) GuardOption // adds to the loopback hosts, never replaces them
func WithGuardOptions(opts ...GuardOption) Option
func WithCSRFTokenTTL(ttl time.Duration) Option     // non-positive falls back to DefaultCSRFTokenTTL (4h)
```

`Assets` serves a real file from the embedded `dist` tree and falls back to `dist/index.html` for any other path, so client routes such as `/sessions/{sid}` load the app shell. Request paths are cleaned and confined to `dist` before the embedded file system is opened, so a traversal-shaped path also returns the shell. `Guard` is the DNS-rebinding defense on its own: it accepts `127.0.0.1`, `localhost`, and `[::1]` plus any hosts you add, and answers a rejected Host or Origin with `403` and code `origin_not_allowed`.

## Mount the bundle under Factory

Factory ships no UI of its own. Pass the bundle to `factory.WithUIHandler`, and Factory serves it as a public asset and SPA fallback beside its authenticated API. This is how Carbon composes its browser path.

```go
import (
	"github.com/looprig/factory"
	"github.com/looprig/wui"
)

func browserOptions() []factory.Option {
	return []factory.Option{
		// Factory owns authentication, origin and CSRF checks, REST, and ClientLink;
		// wui contributes only the static app.
		factory.WithUIHandler(wui.Assets()),
	}
}
```

Own-command matching in the transcript relies on Factory resolving each session's journal. Carbon wires `factory.WithSessionJournalResolver` for this; without a resolver, the UI cannot mark which commands a viewer sent.

## Read attributed messages

WUI v0.4.0 projects a committed user row into the original user blocks, an
optional model-visible presenter frame, and an optional Factory-stamped
principal. The presenter frame is shown dimmed around the user's own blocks;
the verified sender appears separately as a `from` chip. The chip uses the
opaque subject, not a friendly display name. A product that wants names should
resolve them from its trusted member directory, never from client metadata or
the message text. A row without a principal has no chip, including older
sessions. The protocol does not invent a frame when none was journaled, and a
malformed frame count leaves the user's blocks visible.

The [Message presenter](/docs/guides/harness/commands/message-presenter) guide
explains how a product adds model-visible household context without replacing
the original message. [WUI's row projection](https://github.com/looprig/wui/blob/v0.4.0/packages/protocol/src/rows.ts),
[user bubble](https://github.com/looprig/wui/blob/v0.4.0/app/src/components/transcript/user-bubble.tsx),
and [row tests](https://github.com/looprig/wui/blob/v0.4.0/packages/protocol/test/rows-principal.test.ts)
pin this separation.

## Check the bundle marker

A Go module zip is source only, and `go get` runs no build step, so the committed `dist` tree is exactly what your binary embeds. `BundleProtocolVersion` reads the marker the build wrote into that tree.

```go
type Bundle struct {
	CoreVersion        string // Core module whose sessionwire/v1 schemas the client was built against
	ProtocolVersion    string // @looprig/protocol build inside the bundle
	Release            bool   // true only for a tree produced by the release process
	SessionwireVersion int    // sessionwire version the client negotiates
}
```

Check it once at startup and refuse to serve anything that is not a release build your server supports:

```go
bundle, err := wui.BundleProtocolVersion()
if errors.Is(err, wui.ErrNoBundleManifest) {
	return fmt.Errorf("wui bundle predates the marker: %w", err)
}
if err != nil {
	return err // malformed marker
}
if !bundle.Release || bundle.SessionwireVersion != 1 {
	return fmt.Errorf("wui bundle %+v is not an official build this server supports", bundle)
}
```

`ErrNoBundleManifest` is distinct from a marker that parses and declares `Release: false`, so you can report which of the two you refused. The v0.4.0 bundle is built against Core v0.12.0 and mirrors its 43 schemas and 43 fixtures, including the principal and metadata contracts.

## Deprecated Harness serve adapter

`wui.Handler` wraps a Harness `pkg/serve` handler: the SPA at `/`, the API under `/v1/`, `GET /v1/csrf-token`, a CSRF check on five fixed state-changing routes (`X-CSRF-Token`, answered `403` `csrf_invalid` when missing or expired), and the Host/Origin guard over everything. Its protected route set is frozen. It exists so published consumers keep working; new compositions should use `Assets` under Factory, or `Assets` and `Guard` in their own mux.

## Move the pin

wui's only Looprig requirement is Core, used by its contract tests, and no compiled file imports it. `go mod tidy` in the wui module would therefore drop that requirement, so the module's own pin is moved with `go get`. In your application, add or upgrade wui the same way:

```sh
go get github.com/looprig/wui@v0.4.0
```

Use v0.4.0 or later when the UI should show attributed user rows and presenter frames. v0.3.0 was the first bundle that connected to Factory's ClientLink and answered gates with `gate.respond`; v0.1.0 is retracted because it shipped a placeholder page instead of the app.

## Source

The SPA handler and path confinement are in [`assets.go`](https://github.com/looprig/wui/blob/v0.4.0/assets.go), the options, `Guard`, and the deprecated `Handler` in [`handler.go`](https://github.com/looprig/wui/blob/v0.4.0/handler.go), the marker in [`bundle.go`](https://github.com/looprig/wui/blob/v0.4.0/bundle.go), and the guards in [`guard.go`](https://github.com/looprig/wui/blob/v0.4.0/guard.go) and [`csrf.go`](https://github.com/looprig/wui/blob/v0.4.0/csrf.go). The browser's Factory routes are in [`factory-rest.ts`](https://github.com/looprig/wui/blob/v0.4.0/packages/protocol/src/factory-rest.ts) and its ClientLink connection in [`clientlink.ts`](https://github.com/looprig/wui/blob/v0.4.0/packages/protocol/src/clientlink.ts). Carbon's composition is in [`browser/factory.go`](https://github.com/looprig/carbon/blob/v0.30.0/browser/factory.go).

## Proof

[`assets_test.go`](https://github.com/looprig/wui/blob/v0.4.0/assets_test.go) covers real assets, SPA fallback, and traversal confinement. [`bundle_test.go`](https://github.com/looprig/wui/blob/v0.4.0/bundle_test.go) drives each marker rejection, including a missing manifest and a release claim over an unbuilt tree. [`handler_test.go`](https://github.com/looprig/wui/blob/v0.4.0/handler_test.go) and [`guard_test.go`](https://github.com/looprig/wui/blob/v0.4.0/guard_test.go) check routing, per-route CSRF, and origin rejection, and [`module_graph_test.go`](https://github.com/looprig/wui/blob/v0.4.0/module_graph_test.go) enforces that no compiled package imports Core and that Harness is absent from the module graph.
