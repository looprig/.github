---
id: guides/protocols/mcp/sampling-and-reconfiguration
title: MCP sampling and reconfiguration
description: Handle server-requested sampling under explicit policy and reconfigure MCP bindings with validated ordered operations.
audience: developer
section: guides
order: 23
publication: released
proofs:
  sampling-is-an-opt-in-capability:
    - release-github-com-looprig-mcp
  sample-with-bounded-input:
    - release-github-com-looprig-mcp
  reconfigure-as-a-validated-batch:
    - release-github-com-looprig-mcp
  binding-identity-survives-replacement:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP sampling and reconfiguration

Sampling and reconfiguration are host decisions. An MCP server may request an LLM completion, but it does not choose the host's model, tools, budget, or recursion policy. A binding may be disabled, enabled, replaced, or removed, but a live turn should not observe a half-applied batch.

## Sampling is an opt-in capability

At the direct client layer, set `Definition.Capabilities.Sampling` only when `Handlers.Sampling` is installed. A requested capability without its handler is a configuration error, not a silent downgrade. A nil handler means the client does not advertise sampling.

```go
// The host decides whether and how a server may spend model budget.
type sampler struct{}

func (sampler) Sample(ctx context.Context, req client.SampleRequest) (client.SampleResult, error) {
	// Select a host-owned model and enforce product policy here.
	return client.SampleResult{Model: "host-model", Text: "completion", StopReason: "end_turn"}, nil
}

c, err := client.Connect(ctx, definition, client.Handlers{Sampling: sampler{}})
if err != nil {
	panic(err)
}
_ = c
```

The request contains the binding, bounded system prompt, bounded messages, and a `MaxTokens` ceiling capped by client limits. It has no Harness session controller, unrestricted tool registry, or server-selected provider field. A policy can return a typed sampling-denied failure.

## Sample with bounded input

`SamplingHandler.Sample` runs while the server waits and must honor its context. The client enforces maximum tokens, concurrent sampling requests, and sampling depth before invoking the handler. The policy decides model selection, permission, recursion, and whether the request is acceptable at all.

When the client is mounted into Harness, `mcpharness.Deps.Sampling` supplies a `SamplingPolicy`. The adapter adds binding and Loop attribution, audits the request and result, and leaves model and content policy in the application. A nil policy means no capability is advertised.

The [Inference model request guide](/docs/guides/inference/requests/model-selection/) and [Inference usage guide](/docs/guides/inference/usage/) explain the model and budget contracts below this seam.

## Reconfigure as a validated batch

`Manager.Reconfigure` accepts opaque `BindingOp` values made by `AddBinding`, `RemoveBinding`, `EnableBinding`, `DisableBinding`, or `ReplaceBinding`. It validates every operation before applying any. If one operation is malformed, the batch changes nothing. Valid operations apply in order; a failure affects its binding and does not prevent later operations from being attempted.

```go
// Disable one binding without changing the rest of the manager.
err := manager.Reconfigure(ctx, []mcpharness.BindingOp{
	mcpharness.DisableBinding("docs"),
})
if err != nil {
	panic(err)
}
```

Reconfiguration creates a new immutable binding definition. It does not mutate a `client.Definition` that an active turn may still be using. A replacement therefore has a new connection lifecycle, catalog generation, and status while the binding name remains the stable capability identity.

## Binding identity survives replacement

Binding names qualify model tool names and permission identities. Replacing the server endpoint under `docs` keeps the identity `mcp__docs__...` and `mcp:docs:...`, while the new definition can carry different credentials or working directory. Removing and adding with different names is a deliberate authority change, not a transparent transport refresh.

Required and optional startup posture also belongs to `Binding`, not `client.Definition`, because the same server can be required in one product and optional in another. Visibility belongs there for the same reason: it is a Harness audience decision, not a server property.

## Source and proof

Direct sampling is implemented in [pkg/client/sampling.go](https://github.com/looprig/mcp/blob/main/pkg/client/sampling.go), [client.go](https://github.com/looprig/mcp/blob/main/pkg/client/client.go), and [sampling tests](https://github.com/looprig/mcp/blob/main/pkg/client/sampling_test.go). Harness policy and lifecycle are in [pkg/harness/sampling.go](https://github.com/looprig/mcp/blob/main/pkg/harness/sampling.go) and [reconfigure.go](https://github.com/looprig/mcp/blob/main/pkg/harness/reconfigure.go), with [reconfiguration tests](https://github.com/looprig/mcp/blob/main/pkg/harness/reconfigure_test.go).
