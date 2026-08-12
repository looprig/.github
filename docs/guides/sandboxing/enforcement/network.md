---
id: guides/sandboxing/enforcement/network
title: Network Routes and Target Grants
description: Configure explicit egress routes, authenticate loopback proxy targets, and preserve address safety.
audience: developer
section: guides
order: 7
publication: released
proofs:
  configure-an-explicit-route: [release-github-com-looprig-sandbox]
  normalize-a-target: [release-github-com-looprig-sandbox]
  target-scoped-grants: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  routes: [release-github-com-looprig-sandbox]
  proxy: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Network Routes and Target Grants

Network authority has two layers. A profile decides whether the process is allowed to request network access. An explicit `EgressRoute` decides how that traffic leaves the sandbox. For a gated profile, a single-use grant can add one normalized TCP target or one broad port rule. The route and target are authenticated independently.

## Configure an explicit route

```go
package example

import (
	"fmt"

	"github.com/looprig/sandbox"
)

func route() (sandbox.EgressRoute, error) {
	// Direct routes resolve locally and reject loopback, link-local, and
	// metadata destinations after resolution.
	direct, err := sandbox.NewDirectEgressRoute()
	if err != nil {
		return sandbox.EgressRoute{}, err
	}
	fmt.Println(direct.String(), direct.AddressGuarantee(), direct.TargetGuarantee())
	return direct, nil
}
```

`NewDirectEgressRoute` carries address and target guarantees. `NewUpstreamEgressRoute` accepts only an HTTP or HTTPS authority URL and requires the caller to state whether the upstream contract itself filters resolved addresses. The route's fingerprint includes its kind, endpoint, and address guarantee, but never upstream credentials.

For a set, pass the route through `sandbox.WithEgressRoute(route)`. The set reserves one loopback listener and can share one `network.Proxy` across keyed executors. Every execution receives its own credential and authorization record. On completion or denial, the executor releases that execution identity.

## Normalize a target

Targets use the stable `tcp:<host>:<port>` vocabulary. Host names are lowercased, trailing dots are removed, IPv4 and IPv6 are normalized, and invalid ports or characters fail before any dial. `Route.DialTarget` resolves a host and rejects private, loopback, link-local, and metadata addresses unless the route's policy allows the trusted path. A custom resolver or dialer does not change the route fingerprint or bypass that check.

```go
package example

import (
	"fmt"

	"github.com/looprig/sandbox"
)

func target() error {
	target, err := sandbox.ParseNetworkTarget("tcp:api.example.com:443")
	if err != nil {
		return err
	}
	fmt.Println(target.String(), target.Hostname(), target.Port())
	return nil
}
```

## Target-scoped grants

The canonical class is `network.proxy-target.v1`. Its requirement includes both `GuaranteeNetworkBoundary` and `GuaranteeTargetNetwork`. The proxy authenticates the execution ID and credential, compares the requested target to the authorized set, and records a denial. If a process exits normally after a target denial, the executor surfaces a `*NetworkTargetDeniedError` that preserves the exit code while allowing `errors.Is(err, sandbox.ErrNetworkTargetDenied)`.

Linux Rung 2's native network restriction is a TCP-port allowlist. It cannot claim address scoping for loopback, private, or metadata destinations. If the operation requires address-level isolation, require `GuaranteeAddressNetwork` and select a backend that reports it, such as the Linux Rung 1 in-namespace nftables path. See [platform levels](/docs/guides/sandboxing/enforcement/platforms/) and [typed errors](/docs/guides/sandboxing/runtime/errors/).

## Source

- [Route and target types](https://github.com/looprig/sandbox/blob/main/pkg/network/route.go)
- [Authenticated proxy](https://github.com/looprig/sandbox/blob/main/pkg/network/proxy.go)
- [Public route facade](https://github.com/looprig/sandbox/blob/main/sandbox.go)

## Proof

- [Proxy authorization and denial tests](https://github.com/looprig/sandbox/blob/main/pkg/network/proxy_test.go)
