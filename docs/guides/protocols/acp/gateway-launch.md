---
id: guides/protocols/acp/gateway-launch
title: ACP gateways and launch proxy
description: Choose owned, shared, or native ACP launch paths and keep process, proxy, environment, and model selection boundaries explicit.
audience: developer
section: guides
order: 16
publication: released
proofs:
  launch-has-one-proxy-posture:
    - release-github-com-looprig-acp
  owned-and-shared-proxies:
    - release-github-com-looprig-acp
  native-is-a-separate-path:
    - release-github-com-looprig-acp
  connector-configuration:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP gateways and launch proxy

The `acp/launch` package composes a model proxy, an ACP adapter, a supervised stdio child, and an `acp/client.Client`. It is still an ACP Client path. The package does not own Harness, inference, or a provider implementation. It accepts a structural `ModelProxy` so a proxy built elsewhere can supply a base URL and bearer token without importing this package.

## Launch has one proxy posture

`launch.Config` requires exactly one of `OwnedProxy`, `SharedProxy`, or `NoProxy`:

| Posture | Starts proxy | Closes proxy | Adapter method |
| --- | --- | --- | --- |
| owned | `Dial` calls `Start` | `ManagedClient.Close` and failed launch unwind it | `HarnessAdapter.Configure` |
| shared | never | never, caller owns it | `HarnessAdapter.Configure` |
| native | no proxy | no proxy | `NativeHarnessAdapter.ConfigureNative` |

`launch.Dial` validates, starts an owned proxy, configures a copied command, spawns and initializes the ACP child, and returns a `ManagedClient`. A failure after proxy start closes an owned proxy before returning. A shared binding is borrowed data only.

## Owned and shared proxies

The proxy contract is small:

```go
// A proxy implementation can live in another package.
type ModelProxy interface {
	Start(context.Context) error
	Binding() (baseURL, token string, ready bool)
	Close(context.Context) error
}

managed, err := launch.Dial(ctx, launch.Config{
	OwnedProxy: proxy,
	Harness:    launch.Codex("gpt-5"),
	Command:    stdio.Command{Path: "/absolute/path/to/codex-acp"},
})
if err != nil {
	panic(err)
}
defer managed.Close(context.Background())
```

`Binding` returns a local base URL and token only after the proxy reports readiness. The adapter turns those values into the foreign agent's documented command and environment contract. The proxy token is never placed in a log or an ACP error.

## Native is a separate path

`launch.NativeConfig` has no proxy fields. `launch.DialNative` forwards it through the existing no-proxy validation path, making gateway URL, gateway token, and provider overrides impossible for that helper. Native model selection stays with the child or with explicitly supported connector state.

Do not infer native support from a connector name. The code proves native behavior only where a type implements `NativeHarnessAdapter`. `Gemini` is a bare `HarnessAdapter` for environment configuration; it is not documented here as a native ACP connector because the package does not provide that path.

## Connector configuration

`CodexConnector` exposes `Configure` for gateway launch and `ConfigureNative` for native launch. Its model and effort selectors apply only to advertised ACP config options on an existing session. `ClaudeConnector` configures the executable, environment, model aliases, effort, and permission mode that its adapter actually advertises. `ProbeCodexVersion` is an explicit bounded preflight and is not hidden inside `Configure`.

```go
// Version probing is an explicit acceptance decision before Dial.
result, err := launch.ProbeCodexVersion(ctx, "/absolute/path/to/codex-acp", 0, nil)
if err != nil {
	panic(err)
}
fmt.Println("Codex version:", result.Version)
```

The [Inference gateway reference](/docs/reference/packages/inference/gateway/) describes the model-proxy boundary. ACP launch only connects that binding to the child process and then uses normal ACP sessions. The [Inference guide](/docs/guides/inference/) is the canonical cross-link for model requests below the adapter.

## Source and proof

The lifecycle is in [launch/managed.go](https://github.com/looprig/acp/blob/main/launch/managed.go), [launch/contracts.go](https://github.com/looprig/acp/blob/main/launch/contracts.go), and [launch/version.go](https://github.com/looprig/acp/blob/main/launch/version.go). Adapter behavior is in [codex.go](https://github.com/looprig/acp/blob/main/launch/codex.go), [codex_connector.go](https://github.com/looprig/acp/blob/main/launch/codex_connector.go), and [claudecode.go](https://github.com/looprig/acp/blob/main/launch/claudecode.go), with coverage in the [launch tests](https://github.com/looprig/acp/tree/main/launch).
