---
id: guides/protocols/mcp/harness-adoption
title: MCP discovery and Harness adoption
description: Move an MCP catalog from handshake discovery through safe generation adoption and into Harness Loop toolsets and permissions.
audience: developer
section: guides
order: 22
publication: released
proofs:
  discover-a-catalog:
    - release-github-com-looprig-mcp
  candidate-before-adoption:
    - release-github-com-looprig-mcp
  bind-into-harness:
    - release-github-com-looprig-mcp
  install-at-an-idle-boundary:
    - release-github-com-looprig-mcp
  source-and-proof:
    - release-github-com-looprig-mcp
---

# MCP discovery and Harness adoption

Discovery and adoption are deliberately separate. MCP Client can fetch, validate, digest, and hold a candidate catalog without changing the toolset a Loop is using. Harness adoption chooses a safe idle boundary, then replaces the Loop's external toolset and permission identities as one owned transition.

## Discover a catalog

During `client.Connect`, the client performs initialize, learns server capabilities, lists tools, prompts, resources, and templates, and builds a complete generation. `client.Catalog()` returns the adopted model-facing projection. It includes a `Generation` ordinal and canonical `Digest` that identify the server offering independently of the host's filter.

```go
// Connect returns only after one catalog generation is adopted.
c, err := client.Connect(ctx, definition, handlers)
if err != nil {
	panic(err)
}
catalog := c.Catalog()
for _, tool := range catalog.Tools {
		fmt.Println(tool.RawName, "as", tool.ModelName)
}
```

When a server announces that a list changed, the client refreshes into a complete candidate. A refresh failure leaves the previously adopted catalog usable and records stale families in status. The server's instructions are bounded and reported, not injected into a host's system prompt.

## Candidate before adoption

`Client.Candidate()` returns a `CatalogCandidate` only after a full, validated generation differs from the adopted one. The candidate carries the generation, digest, and the generation still adopted. Nothing visible to a Loop changes at this point. The owner calls `Client.Adopt(generation)` at a safe boundary. `CatalogAdopted` then records the replacement.

This split matters for long turns. A server can change its tools while a Loop is running, but the current turn should keep the toolset it started with. Adopt after the turn reaches the idle boundary, not in the notification handler.

## Bind into Harness

`mcpharness.Binding` mounts one client definition under a stable name with a scope, visibility selector, and required or optional startup posture. The name qualifies both model tool identity and permission identity:

| Binding name | Model-facing tool | Permission identity |
| --- | --- | --- |
| `docs` | `mcp__docs__lookup` | `mcp:docs:lookup` |

The same server endpoint can be mounted twice under different names when each binding needs separate credentials, working directories, filters, or lifecycle. `NewManager` validates every binding and rejects duplicate names before any connection starts.

```go
// Manager owns connection startup and integration events for one Session.
manager, err := mcpharness.NewManager([]mcpharness.Binding{
	{
		Name: "docs",
		Server: definition,
		Scope: mcpharness.ScopeSession,
		Visibility: mcpharness.AllLoops(),
		Required: true,
	},
}, deps)
if err != nil {
	panic(err)
}
if err := manager.Start(ctx); err != nil {
	panic(err)
}
defer manager.Close(context.Background())
```

Required bindings gate owner startup. Optional failures leave the owner usable and mark only that binding failed. Events carry the binding identity, and failures remain observable instead of being converted into an empty tool list.

## Install at an idle boundary

`Manager.StartAdoption` returns an `Adopter`. It listens for catalog candidates and installs each Loop's MCP toolset only when the host calls `Adopter.Install` for that Loop. The adopter serializes replacements through one goroutine, while loops still adopt independently. The active turn is never mutated under its feet.

When installed, the `tool.Definition` source is `mcp`, model names are binding-qualified, and permission requests are scoped to the same binding identity. Use `Manager.Reconfigure` for explicit binding changes, not a direct mutation of a live client. Follow the [Tools registration guide](/docs/guides/tools/core-concepts/registration/) for preparation and the [Harness gates guide](/docs/guides/harness/gates/) for the approval boundary.

## Source and proof

Catalog and generation behavior is in [pkg/client/catalog.go](https://github.com/looprig/mcp/blob/main/pkg/client/catalog.go), [refresh.go](https://github.com/looprig/mcp/blob/main/pkg/client/refresh.go), and [client.go](https://github.com/looprig/mcp/blob/main/pkg/client/client.go). Harness integration is in [binding.go](https://github.com/looprig/mcp/blob/main/pkg/harness/binding.go), [manager.go](https://github.com/looprig/mcp/blob/main/pkg/harness/manager.go), [adoption.go](https://github.com/looprig/mcp/blob/main/pkg/harness/adoption.go), and the [adoption tests](https://github.com/looprig/mcp/blob/main/pkg/harness/adoption_test.go). The [Harness adoption example](https://github.com/looprig/mcp/blob/main/examples/harness-adoption/main.go) proves the tool and permission names.
