---
id: carbon/mcp
title: Connect MCP tools to Carbon
description: Configure Carbon's stdio, streamable HTTP, and SSE MCP bindings, understand adoption and elicitation, and operate the fixed support boundary.
audience: [human, operator, developer]
section: carbon
order: 8
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  decoder-and-tests:
    - release-github-com-looprig-carbon
  start-and-adopt-tools:
    - release-github-com-looprig-carbon
  elicitation-and-headless-behavior:
    - release-github-com-looprig-carbon
  sampling-and-reconfiguration-posture:
    - release-github-com-looprig-carbon
  shutdown:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Connect MCP tools to Carbon

Carbon reads an optional `mcp.json` from the Carbon home. The top-level object
is `mcpServers`; each name maps to one binding. A server with `command` is
stdio. A server with `url` is streamable HTTP when `type` is omitted or set to
`streamable-http`. SSE uses the explicit `type: "sse"` because its URL shape is
otherwise indistinguishable from streamable HTTP. Explicit types must agree
with the fields present.

The strict decoder rejects unknown fields, duplicate keys, trailing JSON,
invalid UTF-8, unsafe files, and files over 1 MiB. HTTP URLs must be loopback;
HTTPS is allowed, but URL userinfo is not. Environment and header values are
kept out of errors and notices. Roles are a closed set; an omitted role means
the `carbon` role, and duplicate or unknown roles fail validation.

Because MCP configuration can carry environment and authorization headers,
write it as an owner-only regular file. Do not paste those values into a
support ticket. The source test fixture
`validMCPConfigJSON` in `internal/app/mcpconfig_test.go` is the canonical shape
for a multi-transport configuration; it contains secret sentinels, so use the
fixture in tests and replace values locally rather than copying it into a
guide.

## Start and adopt tools

An empty or absent `mcpServers` map turns the MCP feature off. With bindings
present, Carbon constructs all configured transports in deterministic name
order. Construction is all-or-nothing: a malformed server or failed setup
does not leave a partial manager running. The manager connects when the session
attaches, and an adopter makes toolsets available to the Carbon loop. The
active primer is adopted eagerly; other loop boundaries can adopt the same
manager's toolsets. Name collisions and adoption failures become bounded TUI
notices rather than secret-bearing logs.

MCP servers are Carbon-loop tools. They are not automatically injected into a
native ACP harness. ACP collaboration uses the separate, verified
`carbon-collab-mcp` service described in [ACP](acp.md).

## Elicitation and headless behavior

Interactive Carbon sessions bind MCP elicitation to the TUI gate host. A server
can request a user response through that gate. A headless opener has no gate
host, so it refuses elicitation rather than blocking forever or auto-answering.
Event publishing works in either mode.

## Sampling and reconfiguration posture

Carbon does not expose MCP sampling. It also does not reload or reconfigure
`mcp.json` while a process is live. Edit the file, close the Carbon process,
and start a new process. `/clear` creates a new session but retains the process
configuration, so it does not reload the file.

The MCP topology contributes to the session configuration revision. A normal
restore rejects a different configuration fingerprint. Carbon has an internal
allow-mismatch seam for controlled tests or migrations, but the CLI does not
expose it. Treat a binding change as a new process and review its access and
credential implications before opening the session.

## Shutdown

Carbon closes an MCP adoption before it closes the MCP manager. The manager
then closes transport connections and its grants before the access executor
and credential runtime close. This reverse order prevents a late tool callback
from using a closed access boundary or credential source.

## Evidence

The strict configuration shape is in
[`internal/app/mcpconfig.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcpconfig.go),
transport and adoption ownership are in
[`internal/app/mcp.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp.go),
and the tested fixture and fingerprint behavior are in
[`internal/app/mcpconfig_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcpconfig_test.go),
[`internal/app/mcp_fingerprint_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp_fingerprint_test.go),
and [`internal/app/mcp_integration_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp_integration_test.go).
