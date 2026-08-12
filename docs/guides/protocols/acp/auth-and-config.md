---
id: guides/protocols/acp/auth-and-config
title: ACP authentication and runtime config
description: Advertise ACP authentication, authorize session creation, and apply fresh runtime configuration safely.
audience: developer
section: guides
order: 15
publication: released
proofs:
  authentication-is-advertised:
    - release-github-com-looprig-acp
  authenticate-before-session-creation:
    - release-github-com-looprig-acp
  fresh-catalog-before-write:
    - release-github-com-looprig-acp
  mode-and-config-converge:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP authentication and runtime config

ACP authentication is an optional agent capability. Runtime configuration is a separate, session-scoped capability. Both are explicit in the agent facade so a peer sees what can actually be honored.

## Authentication is advertised

Set `agent.Options.Authenticator` together with one or more `protocol.AuthMethod` values. `agent.New` rejects an authenticator with no advertised methods because a client would have nothing it could select. When an authenticator is present, the facade starts locked. `authenticate` validates the selected method ID, calls `Authenticator.Authenticate`, and unlocks session creation only after success.

```go
// The product owns the credential check. ACP owns method selection and state.
type authenticator struct{}

func (authenticator) Authenticate(ctx context.Context, method protocol.AuthMethodID) error {
	if method != "device-code" {
		return fmt.Errorf("unsupported authentication method")
	}
	return nil
}

facade, err := agent.New(agent.Options{
	Host:          host,
	Authenticator: authenticator{},
	AuthMethods:   []protocol.AuthMethod{{ID: "device-code", Name: "Device code"}},
})
```

The ACP wire receives method IDs and protocol faults, not token material. The product's authenticator should keep secrets out of returned errors and logs.

## Authenticate before session creation

`Agent.AuthorizeSessionCreation` is the host-facing transition used by a product that needs to gate session creation outside the direct request path. The agent's session handlers also enforce the locked state. Logout, when configured, returns the facade to the authenticated-state policy that the host chose.

Authentication is not a model or inference request. If the authenticated agent later calls a tool, follow the [Tools permission guide](/docs/guides/tools/safety/permissions/) and [Harness gate guide](/docs/guides/harness/gates/) for the execution policy.

## Fresh catalog before write

`RuntimeConfigCatalog.RuntimeConfigOptions` is fetched immediately before `session/set_config_option` or `session/set_mode` validates a requested value. The agent does not trust a catalog cached from `session/new` or an earlier write. An unknown option or value fails closed before `RuntimeConfigController.SetRuntimeConfigOption` is called.

```go
// Catalog and controller belong to the product adapter.
type catalog struct{}
func (catalog) RuntimeConfigOptions(context.Context, agent.SessionID) ([]agent.RuntimeConfigOption, error) {
	return []agent.RuntimeConfigOption{{
		ID: "model", Category: protocol.SessionConfigOptionCategoryModel,
		Name: "Model", Values: []agent.RuntimeConfigValue{{ID: "fast", Name: "Fast"}},
		CurrentValue: "fast",
	}}, nil
}
```

If the requested value is already current, the write is an idempotent success. The controller is not called and no `config_option_update` notification is sent. Otherwise, the controller returns the complete new state, the agent translates it, sends one update, and returns the same state to the caller.

## Mode and config converge

`session/set_mode` targets the well-known `mode` config option and passes its mode ID through the same apply path as `session/set_config_option`. This keeps validation, idempotence, controller calls, and update notifications consistent. The client-side `Session.SetMode` updates its cached current mode because the wire response carries no complete mode state; `SetConfigOption` replaces its cache with the authoritative response.

The [Inference model selection guide](/docs/guides/inference/requests/model-selection/) describes model identity and selection below this protocol boundary. ACP only carries the negotiated option and value IDs.

## Source and proof

Authentication and configuration are implemented in [agent/agent.go](https://github.com/looprig/acp/blob/main/agent/agent.go), [agent/config.go](https://github.com/looprig/acp/blob/main/agent/config.go), and [agent/host.go](https://github.com/looprig/acp/blob/main/agent/host.go), with behavior covered by [agent config tests](https://github.com/looprig/acp/blob/main/agent/config_test.go), [capability tests](https://github.com/looprig/acp/blob/main/agent/capabilities_test.go), and [client config tests](https://github.com/looprig/acp/blob/main/client/config_internal_test.go).
