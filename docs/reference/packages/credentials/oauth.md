---
id: reference/packages/credentials/oauth
title: oauth package · oauth
description: Reference for the oauth package at github.com/looprig/credentials/oauth, including exported declarations, ownership rules, and errors.
audience: developer
section: reference
order: 23
publication: released
proofs:
  package-role: release-github-com-looprig-credentials
  exported-surface: release-github-com-looprig-credentials
  functions: release-github-com-looprig-credentials
  methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants: release-github-com-looprig-credentials
  variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# oauth package · oauth

Import path: `github.com/looprig/credentials/oauth`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

Package oauth contains provider-neutral OAuth acquisition mechanics.

## Exported surface {#exported-surface}

The following surface is read from the pinned implementation files. Signatures are shown as declared by the source package; methods include their receivers.

### Functions {#functions}

- `func ParseCallbackURL(raw, expectedState string, exactPath ...string) (CallbackResult, error)`
- `func ParseCallbackURLForInstructions(raw, expectedState string, instructions CallbackInstructions) (CallbackResult, error)`
- `func ParseCallbackQuery(query url.Values, expectedState string) (CallbackResult, error)`
- `func ListenLoopback(ctx context.Context, options ...Option) (*LoopbackListener, error)`
- `func NewLoopbackListener(ctx context.Context, options ...Option) (*LoopbackListener, error)`
- `func WithHTTPClient(client *http.Client) Option`
- `func WithPollInterval(interval time.Duration) Option`
- `func WithMaxPolls(attempts int) Option`
- `func WithPollSleeper(sleeper func(context.Context, time.Duration) error) Option`
- `func BeginAuthorization(ctx context.Context, definition Definition, options ...Option) (*AuthorizationFlow, error)`
- `func BeginAuthorizationCode(ctx context.Context, definition Definition, options ...Option) (*AuthorizationFlow, error)`
- `func ParseDeviceAuthorizationResponse(body []byte) (DeviceAuthorization, error)`
- `func DeviceAuthorizationRequest(ctx context.Context, definition Definition, options ...Option) (DeviceAuthorization, error)`
- `func Poll(ctx context.Context, definition Definition, device DeviceAuthorization, options ...Option) (TokenResponse, error)`
- `func PollDeviceAuthorization(ctx context.Context, definition Definition, device DeviceAuthorization, options ...Option) (TokenResponse, error)`
- `func NewVerifier() (string, error)`
- `func GenerateVerifier() (string, error)`
- `func NewState() (string, error)`
- `func GenerateState() (string, error)`
- `func NewPKCE() (PKCE, error)`
- `func S256Challenge(verifier string) (string, error)`
- `func S256(verifier string) (string, error)`
- `func ValidateVerifier(verifier string) error`
- `func ValidateState(expected, received string) error`
- `func NewStateGuard(expected string) (*StateGuard, error)`
- `func RotateRefreshToken(previous, next TokenResponse) TokenResponse`
- `func ParseTokenResponse(body []byte) (TokenResponse, error)`
- `func ExchangeAuthorizationCode(ctx context.Context, definition Definition, code, verifier, redirectURI string, options ...Option) (TokenResponse, error)`
- `func IsProviderError(err error) bool`
- `func ParseExpiresIn(value string) (int64, error)`

### Methods {#methods}

- `func (i CallbackInstructions) String() string`
- `func (i CallbackInstructions) Format(state fmt.State, _ rune)`
- `func (i CallbackInstructions) GoString() string`
- `func (i CallbackInstructions) LogValue() slog.Value`
- `func (r CallbackResult) HasError() bool`
- `func (r CallbackResult) String() string`
- `func (r CallbackResult) Format(state fmt.State, _ rune)`
- `func (r CallbackResult) GoString() string`
- `func (r CallbackResult) LogValue() slog.Value`
- `func (l *LoopbackListener) String() string`
- `func (l *LoopbackListener) Format(state fmt.State, _ rune)`
- `func (l *LoopbackListener) GoString() string`
- `func (l *LoopbackListener) LogValue() slog.Value`
- `func (l *LoopbackListener) Instructions() CallbackInstructions`
- `func (l *LoopbackListener) ParseCallback(raw string) (CallbackResult, error)`
- `func (l *LoopbackListener) State() string`
- `func (l *LoopbackListener) Client() *http.Client`
- `func (l *LoopbackListener) Wait(ctx context.Context) (CallbackResult, error)`
- `func (l *LoopbackListener) Close() error`
- `func (l *LoopbackListener) ServeHTTP(response http.ResponseWriter, request *http.Request)`
- `func (r CallbackResult) CallbackError() error`
- `func (d Definition) String() string`
- `func (d Definition) Format(state fmt.State, _ rune)`
- `func (d Definition) GoString() string`
- `func (d Definition) LogValue() slog.Value`
- `func (d Definition) Validate() error`
- `func (d Definition) BeginAuthorization(ctx context.Context, options ...Option) (*AuthorizationFlow, error)`
- `func (f *AuthorizationFlow) Wait(ctx context.Context) (CallbackResult, error)`
- `func (f *AuthorizationFlow) Exchange(ctx context.Context, result CallbackResult, options ...Option) (TokenResponse, error)`
- `func (f *AuthorizationFlow) Close() error`
- `func (f AuthorizationFlow) String() string`
- `func (f AuthorizationFlow) Format(state fmt.State, _ rune)`
- `func (f AuthorizationFlow) LogValue() slog.Value`
- `func (d Definition) SortOrigins() []string`
- `func (d DeviceAuthorization) Valid() bool`
- `func (d DeviceAuthorization) String() string`
- `func (d DeviceAuthorization) Format(state fmt.State, _ rune)`
- `func (d DeviceAuthorization) GoString() string`
- `func (d DeviceAuthorization) LogValue() slog.Value`
- `func (d Definition) StartDeviceAuthorization(ctx context.Context, options ...Option) (DeviceAuthorization, error)`
- `func (d Definition) StartDeviceFlow(ctx context.Context, options ...Option) (*DeviceFlow, error)`
- `func (f *DeviceFlow) Poll(ctx context.Context, options ...Option) (TokenResponse, error)`
- `func (d Definition) PollDevice(ctx context.Context, device DeviceAuthorization, options ...Option) (TokenResponse, error)`
- `func (p PKCE) String() string`
- `func (p PKCE) Format(state fmt.State, _ rune)`
- `func (p PKCE) GoString() string`
- `func (p PKCE) LogValue() slog.Value`
- `func (g *StateGuard) Consume(received string) error`
- `func (g *StateGuard) State() string`
- `func (g StateGuard) String() string`
- `func (g StateGuard) Format(state fmt.State, _ rune)`
- `func (g StateGuard) GoString() string`
- `func (g StateGuard) LogValue() slog.Value`
- `func (t TokenResponse) Valid() bool`
- `func (t TokenResponse) String() string`
- `func (t TokenResponse) Format(state fmt.State, _ rune)`
- `func (t TokenResponse) GoString() string`
- `func (t TokenResponse) LogValue() slog.Value`
- `func (t TokenResponse) Rotate(previous TokenResponse) TokenResponse`
- `func (e *ProviderError) Error() string`
- `func (e *ProviderError) Unwrap() error`
- `func (e *ProviderError) StatusCode() int`
- `func (e *ProviderError) Code() string`
- `func (e *ProviderError) String() string`
- `func (e *ProviderError) Format(state fmt.State, _ rune)`
- `func (e *ProviderError) GoString() string`
- `func (e *ProviderError) LogValue() slog.Value`
- `func (d Definition) ExchangeCode(ctx context.Context, code, verifier, redirectURI string, options ...Option) (TokenResponse, error)`
- `func (d Definition) RefreshToken(ctx context.Context, refreshToken string, previous TokenResponse, options ...Option) (TokenResponse, error)`
- `func (d Definition) RevokeToken(ctx context.Context, token string, options ...Option) error`

### Types {#types}

```go
type CallbackInstructions struct {
	URL         string
	RedirectURI string
	Path        string
	Method      string
}
```

```go
type CallbackResult struct {
	Code      string
	State     string
	ErrorCode string
}
```

```go
type LoopbackListener struct {
	// contains filtered or unexported fields
}
```

```go
type Grant string
```

```go
type ClientRegistration struct {
	ClientID            string
	ID                  string
	RedirectURIs        []string
	AllowedRedirectURIs []string
	AllowedOrigins      []string
	AllowedGrants       []Grant
	Scopes              []string
	LoopbackRedirect    LoopbackRedirectPolicy
	Sanctioned          bool
	Evidence            string
}
```

```go
type LoopbackRedirectPolicy struct {
	Enabled          bool
	Host             string
	Method           string
	PathPrefix       string
	AllowDynamicPort bool
}
```

```go
type ClientIdentity = ClientRegistration
```

```go
type ResponseParser interface {
	ParseTokenResponse([]byte) (TokenResponse, error)
	ParseDeviceAuthorization([]byte) (DeviceAuthorization, error)
}
```

```go
type Definition struct {
	AuthorizationEndpoint       string
	TokenEndpoint               string
	DeviceAuthorizationEndpoint string
	RevocationEndpoint          string

	AuthorizationURL       string
	TokenURL               string
	DeviceAuthorizationURL string
	DeviceURL              string
	RevocationURL          string

	ClientID               string
	SanctionedClientID     string
	Client                 ClientRegistration
	Registration           ClientRegistration
	AllowedOrigins         []string
	Origins                []string
	AllowedEndpointOrigins []string
	AllowedGrants          []Grant
	Grants                 []Grant
	Scopes                 []string
	ExtraParams            map[string]string
	AuthorizationParams    map[string]string
	DeviceParams           map[string]string
	TokenParams            map[string]string
	Parser                 ResponseParser

	TokenParser         func([]byte) (TokenResponse, error)
	DeviceParser        func([]byte) (DeviceAuthorization, error)
	ParseTokenResponse  func([]byte) (TokenResponse, error)
	ParseDeviceResponse func([]byte) (DeviceAuthorization, error)
}
```

```go
type ProviderDefinition = Definition
```

```go
type Config = Definition
```

```go
type Option func(*operationOptions)
```

```go
type AuthorizationFlow struct {
	URL       string
	State     string
	Verifier  string
	Challenge string
	Callback  CallbackInstructions
	// contains filtered or unexported fields
}
```

```go
type DeviceAuthorization struct {
	DeviceCode              string
	UserCode                string
	VerificationURI         string
	VerificationURIComplete string
	ExpiresIn               int64
	Interval                int
	ExpiresAt               time.Time
}
```

```go
type DeviceAuthorizationResponse = DeviceAuthorization
```

```go
type DeviceFlow struct {
	Definition Definition
	Device     DeviceAuthorization
}
```

```go
type PKCE struct {
	Verifier  string
	Challenge string
	State     string
}
```

```go
type StateGuard struct {
	// contains filtered or unexported fields
}
```

```go
type TokenResponse struct {
	AccessToken  string
	RefreshToken string
	TokenType    string
	Scope        string
	ExpiresIn    int64
	ExpiresAt    time.Time
}
```

```go
type Token = TokenResponse
```

```go
type ProviderError struct {
	// contains filtered or unexported fields
}
```

```go
type Revoker interface {
	RevokeToken(context.Context, string, ...Option) error
}
```

### Constants {#constants}

`MaxVerifierLength`, `MinVerifierLength`, `MaxStateLength`, `MaxCallbackValueLength`, `MaxTokenValueLength`, `MaxScopeLength`, `MaxScopes`, `MaxExtraParams`, `MaxRequestBodyBytes`, `MaxResponseBodyBytes`, `MaxRequestHeaders`, `MaxResponseHeaders`, `MaxHeaderBytes`, `MaxPollAttempts`, `MaxPollInterval`, `DefaultPollInterval`, `MaxTokenLifetime`, `CallbackReadHeaderTimeout`, `CallbackIdleTimeout`, `GrantAuthorizationCode`, `GrantDeviceCode`, `GrantDeviceAuthorization`, `GrantRefreshToken`

### Variables {#variables}

`ErrInvalidDefinition`, `ErrInvalidEndpoint`, `ErrOriginMismatch`, `ErrRedirectRejected`, `ErrUnsupportedGrant`, `ErrInvalidClient`, `ErrInvalidRequest`, `ErrInvalidResponse`, `ErrResponseTooLarge`, `ErrResponseHeadersTooLarge`, `ErrRequestTooLarge`, `ErrRequestHeadersTooLarge`, `ErrProvider`, `ErrNetwork`, `ErrCanceled`, `ErrNilContext`, `ErrStateMismatch`, `ErrStateUsed`, `ErrCallbackOrigin`, `ErrCallbackClosed`, `ErrCallbackTimeout`, `ErrPollLimit`, `ErrDeviceExpired`, `ErrRevocationUnsupported`, `ErrInvalidVerifier`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ProviderError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it.

## Source and runnable proof {#source-and-runnable-proof}

Source files at the pinned commit:

- [oauth/callback.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/callback.go)
- [oauth/config.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/config.go)
- [oauth/device.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/device.go)
- [oauth/pkce.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/pkce.go)
- [oauth/token.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/token.go)

Adjacent tests at the same commit:

- [oauth/fuzz_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/fuzz_test.go)
- [oauth/oauth_test.go](https://github.com/looprig/credentials/blob/d696dd78cf4773da660b7cbf59533832fbaf4ed0/oauth/oauth_test.go)

Run `go test ./...` from a checkout of the `credentials` module. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
