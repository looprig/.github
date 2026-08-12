---
id: reference/packages/sandbox/pkg/network
title: network package · pkg/network
description: Reference for the network package at github.com/looprig/sandbox/pkg/network, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 81
publication: released
examples:
  - stage-11-sandbox-process
proofs:
  package-role: release-github-com-looprig-sandbox
  exported-surface: release-github-com-looprig-sandbox
  functions-and-methods: release-github-com-looprig-sandbox
  types: release-github-com-looprig-sandbox
  constants-and-variables: release-github-com-looprig-sandbox
  ownership-and-errors: release-github-com-looprig-sandbox
  source-and-runnable-proof: release-github-com-looprig-sandbox
---

# network package · pkg/network

Import path: `github.com/looprig/sandbox/pkg/network`. The source is pinned to github.com/looprig/sandbox@v0.8.1.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. Sandbox `v0.8.1` separates profile construction and achieved guarantees from executor and network details. It does not decide whether a tool call is allowed; it enforces the authority the caller has already chosen.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewTargetDeniedError(exitCode int, processErr, denial error) *TargetDeniedError`
- `func NewProxy(route Route) (*Proxy, error)`
- `func NewProxyWithListener(route Route, listener net.Listener) (*Proxy, error)`
- `func ParseTarget(raw string) (Target, error)`
- `func NewDirectRoute() (Route, error)`
- `func NewUpstreamRoute(rawURL string, trustedAddressGuarantee bool) (Route, error)`
- `func NewRouteResolver(routes []Route, selector func(context.Context, Target) string) (*RouteResolver, error)`

### Methods {#methods}

- `func (route Route) IsDirect() bool`
- `func (route Route) Upstream() *url.URL`
- `func (route Route) WithDialer(lookup LookupFunc, dial DialFunc) Route`
- `func (proxy *Proxy) Route() Route`
- `func (route Route) DialTarget(ctx context.Context, target Target) (net.Conn, error)`
- `func (route Route) DialUpstream(ctx context.Context) (net.Conn, error)`
- `func (err *TargetDeniedError) Error() string`
- `func (err *TargetDeniedError) Unwrap() error`
- `func (proxy *Proxy) Addr() string`
- `func (proxy *Proxy) Authorize(executionID string, targets []Target) (string, error)`
- `func (proxy *Proxy) AuthorizeAll(executionID string) (string, error)`
- `func (proxy *Proxy) URL(executionID, credential string) string`
- `func (proxy *Proxy) Release(executionID string)`
- `func (proxy *Proxy) Denial(executionID string) error`
- `func (proxy *Proxy) ServeHTTP(writer http.ResponseWriter, request *http.Request)`
- `func (connection *contextOwnedConn) Close() error`
- `func (connection *idleTimeoutConn) Read(buffer []byte) (int, error)`
- `func (connection *idleTimeoutConn) Write(buffer []byte) (int, error)`
- `func (proxy *Proxy) Close() error`
- `func (target Target) String() string`
- `func (target Target) Transport() string`
- `func (target Target) Hostname() string`
- `func (target Target) Port() uint16`
- `func (target Target) Address() string`
- `func (route Route) Validate() error`
- `func (route Route) Fingerprint() string`
- `func (route Route) TargetGuarantee() bool`
- `func (route Route) AddressGuarantee() bool`
- `func (route Route) String() string`
- `func (resolver *RouteResolver) Resolve(ctx context.Context, target Target) (Route, error)`

### Types {#types}

`LookupFunc`, `DialFunc`, `TargetDeniedError`, `Proxy`, `Target`, `Route`, `RouteResolver`

### Constants {#constants}

No exported constants are declared in this package.

### Variables {#variables}

`ErrClosed`, `UnparseableTarget`, `ErrAddressDenied`, `ErrTargetDenied`, `ErrRouteDenied`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `TargetDeniedError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/network/access.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/access.go)
- [pkg/network/dial.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/dial.go)
- [pkg/network/proxy.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/proxy.go)
- [pkg/network/route.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/route.go)

Adjacent tests at the same commit:

- [pkg/network/proxy_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/proxy_test.go)
- [pkg/network/route_test.go](https://github.com/looprig/sandbox/blob/b76852a7c5327c9dcb4f2b3f74ef36a3e9ca06e7/pkg/network/route_test.go)

Run `GOWORK=off go test ./...` from the `sandbox` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
