---
id: carbon/architecture/security
title: Carbon security and evidence boundaries
description: Explain how Carbon combines access profiles, egress, credentials, classifier review, MCP, and ACP without widening authority.
audience: [developer, operator]
section: carbon-architecture
order: 4
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  security-tests:
    - release-github-com-looprig-carbon
---

# Carbon security and evidence boundaries

Carbon has separate authority boundaries for model calls, local tools,
credentials, child processes, MCP servers, and persistent state. A capability
at one boundary does not imply a capability at another. The selected access
profile is the ceiling that all of them must respect.

## Access ceiling

The access executor translates a profile into workspace, host, network, command,
home, and sandbox grants. Tool kinds such as `tool.invoke` and `context.load`
are admitted through the same gate with a canonical scope. Unknown or malformed
operations fail closed. Egress resolution produces explicit direct or upstream
routes; proxy authentication is held in the route object and excluded from
digests and child environments.

## Credentials

A credential reference is a lookup identity. Carbon's credential runtime checks
the provider and transport policy, acquires a lease, and constructs the client.
The value is not present in model or access revisions, diagnostics, MCP config
notices, ACP environments, or gateway responses. Logout blocks new uses before
separately deleting local catalog and state, and does not claim remote
revocation for API-key sources.

## Classifier review

Permission review is a policy layer inside the access ceiling. It uses a
command-safety classifier, read-only evidence tools, containment checks, and a
last observation check before an automatic decision. Carbon enables it only for
trusted sessions and only for a configured structured-output tools model. A
strict policy can narrow automatic approval, never widen access. A needs-human
or unavailable classifier leaves a human gate instead of auto-allowing.

## MCP and ACP

MCP bindings are session-scoped Carbon-loop tools. Their environment, headers,
transport, and role are decoded strictly; interactive elicitation requires the
TUI gate host, while headless elicitation is refused. MCP is not silently
injected into native ACP children. ACP children receive an allowlisted
environment, a derived posture, and either native harness auth or a short-lived
gateway route. The collaboration MCP service is a separate verified child
descriptor, not a general credential tunnel.

## Persistence and restore

Workspace leases prevent concurrent Carbon sessions from silently sharing the
checkout. Session and resource stores are scoped by identity. Configuration
revisions make restore conservative; an operator must create a fresh session
when an authority or topology change is intentional. Carbon's manual snapshot
policy does not claim to archive the checkout automatically.

## Platform qualification

Carbon tests its profile gates, process adapter, and supported CI paths. The
actual OS sandbox backend depends on host capabilities and platform. If a
required backend is unavailable, Carbon should reject the process before spawn;
that failure is a safety result, not evidence that the host is equivalent to an
unconfined run. Keep platform-specific guarantees tied to the source and test
commit that proves them.

## Evidence

The access contract and egress redaction are in
[`internal/app/access.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access.go)
and [`internal/app/egress.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/egress.go).
Credential and classifier boundaries are in
[`internal/app/credentials.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/credentials.go)
and [`internal/app/permission_review.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/permission_review.go).
MCP and ACP tests are pinned in
[`internal/app/mcp_integration_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp_integration_test.go)
and [`internal/app/acpchildren_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren_test.go).
