---
id: build/18-mcp-adoption
title: Build 18: MCP adoption
description: Mount discovered MCP tools into selected loops with stable identities, gate requests, event notices, and live reconfiguration.
audience: developer
section: build
order: 18
publication: released
examples:
  - stage-16-mcp-adoption
proofs:
  adoption-boundary:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  identity-and-scope:
    - release-github-com-looprig-mcp
  reconfiguration:
    - release-github-com-looprig-mcp
    - release-github-com-looprig-harness
  errors-and-limits:
    - release-github-com-looprig-mcp
  runnable-proof:
    - release-github-com-looprig-mcp
---

# Build 18: MCP adoption

`mcp/pkg/harness` is the adapter between an MCP client catalog and Harness tool definitions. It keeps MCP wire values below the Harness boundary, derives model-facing names from a binding and raw tool name, and asks Harness to gate each invocation rather than treating discovery as authorization.

## Adoption boundary {#adoption-boundary}

Create a `harness.Binding` with a name, `client.Definition`, scope, visibility selector, and required startup posture. `NewManager` validates the binding set and dependencies. `Start` connects and discovers servers; `StartAdoption` listens for loop and session changes; `Adopter.Install` replaces the selected loop's external toolset with protocol-neutral definitions.

## Identity and scope {#identity-and-scope}

`ToolInvokeIdentity` and `ToolIdentity` preserve binding and server identity while preventing raw server descriptions from entering durable fingerprints. `AllLoops`, `Loops`, and `Named` choose visibility. A required binding failure stops startup; an optional binding reports a typed failure and leaves the remaining bindings available. Duplicate model names are rejected rather than silently shadowed.

## Reconfiguration {#reconfiguration}

`EnableBinding`, `DisableBinding`, `AddBinding`, `ReplaceBinding`, and `RemoveBinding` are explicit operations. Reconfiguration updates status and publishes notices; disabling a binding withdraws its definitions from later loop builds but does not retroactively grant or cancel an already running call. Sampling and elicitation use host-provided policies, and every tool call still passes through the Harness gate.

## Errors and limits {#errors-and-limits}

Use `ErrAlreadyStarted`, `ErrAlreadyBound`, `ErrNotBound`, `ErrManagerClosed`, `StartupError`, `BindingFailure`, and `DuplicateModelNameError` with `errors.Is` or `errors.As`. Limits cover tool names, schemas, message bodies, startup and retirement timeouts, elicitation, sampling, and event queues. The adapter cannot make a disabled, failed, or unauthorized server available by editing an MCP catalog entry.

## Runnable proof {#runnable-proof}

`stage-16-mcp-adoption` uses a child server with one `lookup` tool, starts a session-scoped binding visible to all loops, installs it, disables it, and verifies the source, definition count, model-facing tool name, and status. Run it with `node scripts/docs/run-examples.mjs`. See the [pinned manager](https://github.com/looprig/mcp/blob/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/manager.go), [adopter](https://github.com/looprig/mcp/tree/e900ad4bcddc76a593c0719b607bd2b0c9561cc0/pkg/harness/), and [Harness external-tool runtime](https://github.com/looprig/harness/blob/43e0939bb78ae5d113add0ecc0fddd22c6a2b7eb/internal/loopruntime/external_tools.go).
