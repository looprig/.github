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
  functions-and-methods: release-github-com-looprig-credentials
  types: release-github-com-looprig-credentials
  constants-and-variables: release-github-com-looprig-credentials
  ownership-and-errors: release-github-com-looprig-credentials
  source-and-runnable-proof: release-github-com-looprig-credentials
---

# oauth package · oauth

Import path: `github.com/looprig/credentials/oauth`. The source is pinned to github.com/looprig/credentials@v0.1.0.

## Package role {#package-role}

This page indexes the exported declarations in the current source package. The owning module is released as v0.1.0; pin that version in consumers and keep local workspace replacements out of published go.mod files.

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
- `func (b *atomicBool) Swap(value bool) bool`
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

`CallbackInstructions`, `CallbackResult`, `LoopbackListener`, `Grant`, `ClientRegistration`, `LoopbackRedirectPolicy`, `ClientIdentity`, `ResponseParser`, `Definition`, `ProviderDefinition`, `Config`, `Option`, `AuthorizationFlow`, `DeviceAuthorization`, `DeviceAuthorizationResponse`, `DeviceFlow`, `PKCE`, `StateGuard`, `TokenResponse`, `Token`, `ProviderError`, `Revoker`

### Constants {#constants}

`MaxVerifierLength`, `MinVerifierLength`, `MaxStateLength`, `MaxCallbackValueLength`, `MaxTokenValueLength`, `MaxScopeLength`, `MaxScopes`, `MaxExtraParams`, `MaxRequestBodyBytes`, `MaxResponseBodyBytes`, `MaxRequestHeaders`, `MaxResponseHeaders`, `MaxHeaderBytes`, `MaxPollAttempts`, `MaxPollInterval`, `DefaultPollInterval`, `MaxTokenLifetime`, `CallbackReadHeaderTimeout`, `CallbackIdleTimeout`, `GrantAuthorizationCode`, `GrantDeviceCode`, `GrantDeviceAuthorization`, `GrantRefreshToken`

### Variables {#variables}

`ErrInvalidDefinition`, `ErrInvalidVerifier`

## Ownership and errors {#ownership-and-errors}

The signatures above define the package boundary. The linked source and adjacent tests are the authority for value lifetime and error handling; no ownership, lifecycle, or retry behavior is inferred from declaration names alone.

Exported named types with an explicit `Error() string` method are `ProviderError`. Use `errors.Is` or `errors.As` only when the relevant function or method returns one of these errors or wraps it. No lifecycle or retry guarantee is inferred from a name alone.

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

Run `GOWORK=off go test ./...` from the `credentials` repository. The page records source and test locations only; it does not claim behavior that the implementation and tests do not show.
