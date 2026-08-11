---
id: carbon/model-proxy
title: Carbon's model proxy boundary
description: Understand the short-lived loopback gateway Carbon gives ACP children and the credentials it keeps out of that boundary.
audience: [operator, developer]
section: carbon
order: 7
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  gateway:
    - release-github-com-looprig-carbon
---

# Carbon's model proxy boundary

The Carbon model proxy is an internal gateway for a gateway-backed ACP child.
It is not a public provider proxy and it is not a second credential store. When
Carbon launches a delegate child, it starts one loopback
`inference/gateway.Server` for that child, selects the protocol codec required
by the harness, and gives the child a fresh short-lived token. The gateway
routes only the model aliases authorized for that child.

## What crosses the boundary

Claude ACP reaches an Anthropic-compatible ingress. Codex ACP reaches an
OpenAI Responses-compatible ingress. Carbon translates the request into its
already-composed inference client, applies its retry and model policy, and
returns the bounded result. The child receives the endpoint and token needed to
connect, not the provider credential that authorizes the upstream call.

The child environment is filtered to a small process allowlist. Errors are
bounded and scrubbed for URLs, authorization material, tokens, and local paths.
The loopback listener and token are scoped to the child route and are closed
when the child exits.

## What the proxy does not do

It does not expose Carbon's inference client to the network, accept arbitrary
model aliases, or permit a child to choose a different credential source. It
does not replace a native ACP login. It also does not make a provider endpoint
available to a browser or another local process merely because that process can
guess a loopback port.

When a delegate row is unavailable, a credential reference cannot be resolved,
or the child route fails validation, Carbon rejects the ACP launch rather than
starting a weaker unauthenticated proxy. The proxy has no operator-facing
reload command; changing models or credentials means composing a new session.

## Debugging the proxy

Start with the Carbon model and credential diagnostics. Confirm that the row is
marked `delegate`, the credential reference matches the provider policy, and
the selected harness is one of the two supported names. Then confirm the ACP
launcher and collaboration service paths. Do not copy a proxy token into a bug
report. A bounded Carbon error is the diagnostic surface; inspect local process
logs only under the selected access profile.

## Evidence

Gateway construction and child route binding are in
[`internal/app/acpchildren.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren.go)
and [`internal/app/acpproduction.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpproduction.go).
The model gateway's protocol composition is covered by
[`internal/app/acpproduction_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpproduction_test.go)
and the child redaction tests in
[`internal/app/acpchildren_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren_test.go).
