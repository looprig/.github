---
id: guides/protocols/mcp/auth
title: MCP authentication
description: Attach bearer or OAuth credentials per request, discover authorization servers, store tokens safely, and classify auth state.
audience: developer
section: guides
order: 21
publication: released
proofs:
  credential-seams:
    - release-github-com-looprig-mcp
  oauth-provider:
    - release-github-com-looprig-mcp
  discovery-and-pkce:
    - release-github-com-looprig-mcp
  secrets-stay-secret:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP authentication

Network MCP transports take credentials through `auth.HeaderProvider`. The transport asks for headers for each request, so a provider can refresh an expiring credential without the client knowing about OAuth. Authentication is a transport concern and is not used for stdio child authorization.

## Credential seams

`auth.HeaderProvider` returns `[]auth.Header` or an error. A provider can read a static bearer token, call a cloud credential chain, sign a request, or delegate to `OAuthProvider`. Returned headers are written to the request and are not copied into events, catalogs, or errors.

```go
package main

import (
	"context"

	"github.com/looprig/mcp/pkg/auth"
	"github.com/looprig/mcp/pkg/client"
	"github.com/looprig/mcp/pkg/transport/streamablehttp"
)

// staticBearer is intentionally small. A real provider should read the secret
// from its own secret manager and honor ctx while refreshing it.
type staticBearer struct{ value string }

func (b staticBearer) Headers(context.Context) ([]auth.Header, error) {
	return []auth.Header{auth.NewHeader("Authorization", "Bearer "+b.value)}, nil
}

func main() {
	transport, err := streamablehttp.New(streamablehttp.Config{
		Endpoint: "https://tools.example.test/mcp",
		Auth:     staticBearer{value: "read-from-secret-store"},
	})
	if err != nil {
		panic(err)
	}
	_, err = client.Connect(context.Background(), client.Definition{Name: "tools", Transport: transport}, client.Handlers{})
	if err != nil {
		panic(err)
	}
}
```

Static headers are applied first. A live provider wins when it returns the same header name. The provider must be safe for concurrent use because one connection can have several requests in flight.

## OAuth provider

`auth.NewOAuthProvider` validates an `OAuthConfig` without doing network I/O. It needs the protected server URL, a `TokenStore`, and a `BrowserOpener`. `Credentials` may be empty, in which case the provider can attempt dynamic client registration when the authorization server supports it. `Headers` calls the token ladder: use a valid stored token, refresh a stored refresh token, or run the authorization-code flow.

```go
// A desktop application supplies a browser opener; a headless service may
// provide one that returns a deliberate refusal instead.
provider, err := auth.NewOAuthProvider(auth.OAuthConfig{
	ServerURL: "https://tools.example.test/mcp",
	Store:     auth.NewMemoryStore(),
	Browser:   browserOpener{},
	Scopes:    []string{"tools"},
})
if err != nil {
	panic(err)
}
transport, err := streamablehttp.New(streamablehttp.Config{
	Endpoint: "https://tools.example.test/mcp",
	Auth:     provider,
})
if err != nil {
	panic(err)
}
_ = transport
```

The provider serializes concurrent token flows, so ten requests that discover an expired token do not open ten browser windows. `Status()` exposes state, expiry, scopes, and a bounded failure classification without exposing the token.

## Discovery and PKCE

The OAuth flow discovers protected-resource metadata for the MCP server, follows the authorization-server issuer it names, and validates that issuer. It supports dynamic client registration when no credentials were supplied, uses an authorization-code exchange with PKCE and state, listens on a loopback redirect, and stores the resulting token set under a canonical origin and client ID. Token exchange and refresh are bounded HTTP operations.

The provider does not fetch or register anything in its constructor. `Token` or `Headers` starts the flow. The transport remains ignorant of discovery and asks only for current headers.

## Secrets stay secret

`auth.TokenSet`, `auth.Header`, `auth.ClientCredentials`, and OAuth authorization values keep secret fields behind accessors or unexported storage. Formatting is redacted for every `fmt` verb, JSON marshaling refuses where a secret-bearing value could leak, and errors carry bounded, normalized classifications. Use the explicit accessors only at the point where a request or token store needs the secret.

The [MCP transports guide](/docs/guides/protocols/mcp/transports/) explains origin pinning and per-request attachment. The [Inference security boundary guide](/docs/concepts/security-boundaries/) explains how a credentialed tool call should remain separate from model content, and the [Inference guide](/docs/guides/inference/) is the canonical model boundary.

## Source and proof

The seams are in [pkg/auth/auth.go](https://github.com/looprig/mcp/blob/main/pkg/auth/auth.go), [oauth.go](https://github.com/looprig/mcp/blob/main/pkg/auth/oauth.go), [discovery.go](https://github.com/looprig/mcp/blob/main/pkg/auth/discovery.go), and [tokenstore.go](https://github.com/looprig/mcp/blob/main/pkg/auth/tokenstore.go). The [OAuth integration tests](https://github.com/looprig/mcp/blob/main/pkg/auth/oauth_integration_test.go), [redaction tests](https://github.com/looprig/mcp/blob/main/pkg/auth/redaction_test.go), and [status tests](https://github.com/looprig/mcp/blob/main/pkg/auth/status_test.go) cover the flow and its secret boundary.
