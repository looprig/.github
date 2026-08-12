---
id: reference/packages/mcp/auth
title: auth package · auth
description: Reference for MCP bearer and OAuth credential seams with secret-safe values.
audience: developer
section: reference
order: 210
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  package-role: release-github-com-looprig-mcp
  exported-surface: release-github-com-looprig-mcp
  functions: release-github-com-looprig-mcp
  methods: release-github-com-looprig-mcp
  types: release-github-com-looprig-mcp
  constants: release-github-com-looprig-mcp
  variables: release-github-com-looprig-mcp
  ownership-and-errors: release-github-com-looprig-mcp
  source-and-runnable-proof: release-github-com-looprig-mcp
---

# auth package · auth

Import path: `github.com/looprig/mcp/pkg/auth`. The source is pinned to github.com/looprig/mcp@v0.6.2.

## Package role {#package-role}

`TokenSet`, `Header`, `ClientCredentials`, and `Status` separate secret material from loggable metadata. `OAuthProvider` drives the configured browser, token store, and provider endpoints through explicit interfaces.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func NewHeader(name, value string) Header`
- `func NewError(class Class, op string, msg string, wrapped error) *Error`
- `func NewNoTokenError(op string) *Error`
- `func ClassOf(err error) (Class, bool)`
- `func NewOAuthProvider(cfg OAuthConfig) (*OAuthProvider, error)`
- `func CanonicalOrigin(rawURL string) (string, error)`
- `func NewClientCredentials(id, secret string) ClientCredentials`
- `func NewStatus(state State, expiry time.Time, scopes []string, failure string) Status`
- `func StatusOf(set TokenSet, now time.Time) Status`
- `func NewTokenSet(access, refresh string, expiry time.Time, scopes []string) TokenSet`
- `func NewMemoryStore() *MemoryStore`

### Methods {#methods}

- `func (h Header) Name() string`
- `func (h Header) Value() string`
- `func (h Header) Validate() error`
- `func (h Header) String() string`
- `func (h Header) GoString() string`
- `func (h Header) Format(f fmt.State, verb rune)`
- `func (h Header) MarshalJSON() ([]byte, error)`
- `func (h *Header) UnmarshalJSON([]byte) error`
- `func (c Class) String() string`
- `func (e Error) Error() string`
- `func (e Error) Unwrap() error`
- `func (e Error) Format(f fmt.State, verb rune)`
- `func (p *OAuthProvider) Credentials() ClientCredentials`
- `func (p *OAuthProvider) Status() Status`
- `func (p *OAuthProvider) Headers(ctx context.Context) ([]Header, error)`
- `func (p *OAuthProvider) Token(ctx context.Context) (TokenSet, error)`
- `func (p pkce) Verifier() string`
- `func (p pkce) Challenge() string`
- `func (p pkce) String() string`
- `func (p pkce) GoString() string`
- `func (p pkce) Format(f fmt.State, verb rune)`
- `func (s state) Value() string`
- `func (s state) Matches(got string) bool`
- `func (s state) String() string`
- `func (s state) GoString() string`
- `func (s state) Format(f fmt.State, verb rune)`
- `func (c authCode) Value() string`
- `func (c authCode) Valid() bool`
- `func (c authCode) String() string`
- `func (c authCode) GoString() string`
- `func (c authCode) Format(f fmt.State, verb rune)`
- `func (r *redirectServer) URI() string`
- `func (r *redirectServer) Close() error`
- `func (c ClientCredentials) ID() string`
- `func (c ClientCredentials) Secret() string`
- `func (c ClientCredentials) Valid() bool`
- `func (c ClientCredentials) Confidential() bool`
- `func (c ClientCredentials) String() string`
- `func (c ClientCredentials) GoString() string`
- `func (c ClientCredentials) Format(f fmt.State, verb rune)`
- `func (c ClientCredentials) MarshalJSON() ([]byte, error)`
- `func (c *ClientCredentials) UnmarshalJSON([]byte) error`
- `func (s State) String() string`
- `func (k Key) Validate() error`
- `func (k Key) String() string`
- `func (t TokenSet) Access() string`
- `func (t TokenSet) Refresh() string`
- `func (t TokenSet) Expiry() time.Time`
- `func (t TokenSet) Scopes() []string`
- `func (t TokenSet) Expired(now time.Time) bool`
- `func (t TokenSet) Valid() bool`
- `func (t TokenSet) String() string`
- `func (t TokenSet) GoString() string`
- `func (t TokenSet) Format(f fmt.State, verb rune)`
- `func (t TokenSet) MarshalJSON() ([]byte, error)`
- `func (t *TokenSet) UnmarshalJSON([]byte) error`
- `func (s *MemoryStore) Load(ctx context.Context, key Key) (TokenSet, error)`
- `func (s *MemoryStore) Store(ctx context.Context, key Key, set TokenSet) error`
- `func (s *MemoryStore) Delete(ctx context.Context, key Key) error`
- `func (s *MemoryStore) String() string`
- `func (s *MemoryStore) GoString() string`
- `func (s *MemoryStore) Format(f fmt.State, verb rune)`

### Types {#types}

`BrowserOpener`, `HeaderProvider`, `Header`, `Class`, `Error`, `OAuthConfig`, `OAuthProvider`, `ClientCredentials`, `State`, `Status`, `Key`, `TokenSet`, `TokenStore`, `MemoryStore`

### Constants {#constants}

`ClassInvalidConfig`, `ClassNoToken`, `ClassRequired`, `ClassDenied`, `ClassExpired`, `ClassFailed`, `MaxMessageBytes`, `DefaultAuthorizationTimeout`, `DefaultHTTPTimeout`, `MaxURLBytes`, `StateAnonymous`, `StateRequired`, `StateAuthenticated`, `StateExpired`, `StateDenied`, `StateFailed`, `Redacted`, `MaxOriginBytes`, `MaxClientIDBytes`, `ExpirySkew`

### Variables {#variables}

`ErrNoToken`, `ErrMarshalRefused`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `Error`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [pkg/auth/auth.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/auth.go)
- [pkg/auth/discovery.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/discovery.go)
- [pkg/auth/errors.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/errors.go)
- [pkg/auth/oauth.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/oauth.go)
- [pkg/auth/origin.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/origin.go)
- [pkg/auth/pkce.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/pkce.go)
- [pkg/auth/redirect.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/redirect.go)
- [pkg/auth/register.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/register.go)
- [pkg/auth/status.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/status.go)
- [pkg/auth/tokenstore.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/tokenstore.go)

Adjacent tests at the same commit:

- [pkg/auth/auth_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/auth_test.go)
- [pkg/auth/errors_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/errors_test.go)
- [pkg/auth/oauth_integration_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/oauth_integration_test.go)
- [pkg/auth/oauth_internal_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/oauth_internal_test.go)
- [pkg/auth/oauth_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/oauth_test.go)
- [pkg/auth/redaction_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/redaction_test.go)
- [pkg/auth/sentinel_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/sentinel_test.go)
- [pkg/auth/status_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/status_test.go)
- [pkg/auth/tokenstore_test.go](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/auth/tokenstore_test.go)

Run `GOWORK=off go test ./...` from the `mcp` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
