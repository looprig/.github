---
id: modules/wui
title: WUI
description: Embed a prebuilt React web interface for Looprig sessions as a Go http.Handler, with Host and Origin guards and a bundle protocol marker.
audience: developer
section: modules
order: 30
publication: released
proofs:
  repository: release-github-com-looprig-wui
  description: release-github-com-looprig-wui
  dependencies: release-github-com-looprig-wui
  dependents: release-github-com-looprig-wui
  where-it-fits: release-github-com-looprig-wui
---

# WUI

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/wui` |
| Version | `v0.3.0` |
| GitHub | [looprig/wui](https://github.com/looprig/wui) |

## Description

Embed a prebuilt React web interface for Looprig sessions as a Go http.Handler, with Host and Origin guards and a bundle protocol marker.

## Where it fits

WUI is useful on its own when a Go binary needs a ready browser interface for agent sessions without a Node toolchain at build time. The React SPA is committed as a static bundle and embedded with `//go:embed`, so importing the module is enough. It covers a session list, a live transcript, a message composer, interrupt, approval gates, and a viewer for captured tool output. `wui.Assets()` serves the bundle with a path-confined fallback to the SPA shell, `wui.Guard` adds a Host and Origin check, and `wui.BundleProtocolVersion()` reports which sessionwire version, Core version, and protocol build the embedded bundle speaks and whether it is a release build. A server should refuse a bundle whose marker is missing or not a release build.

Within Looprig, WUI is the browser counterpart to [TUI](/docs/modules/tui). A composition passes `wui.Assets()` to [Factory](/docs/modules/factory) through its UI handler option, and Factory then owns authentication, origin and CSRF checks, the REST and ClientLink API, and reaching sessions on a [Host](/docs/modules/host). WUI's only Looprig requirement is [Core](/docs/modules/core), used by a test that checks the vendored `sessionwire/v1` schemas against the pinned Core version. No compiled file imports Core, so `go mod tidy` would drop the requirement; update the pin explicitly instead. WUI owns the bundle, its self-description, and the browser guards. The serving application owns login, durable session state, and the API the bundle talks to.

## Dependencies

- [Core](/docs/modules/core)

## Dependents

None.
