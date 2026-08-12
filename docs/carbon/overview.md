---
id: carbon/overview
title: Carbon, the Looprig harness product
description: Understand what Carbon provides, where the reusable components fit, and how a Carbon session is composed.
audience: [human, operator]
section: carbon
order: 1
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  composition:
    - release-github-com-looprig-carbon
  what-a-carbon-session-owns:
    - release-github-com-looprig-carbon
  a-safe-first-path:
    - release-github-com-looprig-carbon
  product-boundary:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon, the Looprig harness product

Carbon is the ready-to-run product in the Looprig workspace. It assembles the
model, credential, tool, access, persistence, process, ACP, MCP, and terminal
interfaces into one supervised harness. Carbon is released as
`github.com/looprig/carbon` at `v0.19.0`; the command is built as `carbon`.

The other Looprig modules are reusable parts. A consumer can compose them into
a purpose-built application with a different user interface, storage policy,
or model boundary. Carbon is the maintained composition for an operator who
wants a complete terminal application, not a claim that every composition
should look the same.

## What a Carbon session owns

At startup Carbon resolves one home directory, one model configuration, one
MCP configuration, one access profile, and one data directory. It uses those
inputs to build a loop and a persisted session. The loop can call the configured
model, run process tools through the selected access boundary, adopt MCP tools,
and delegate to ACP harnesses when those profiles are configured. Sessions and
workspace leases are persisted in the same store factory, so a later process
can list or restore the session.

The terminal UI is Carbon's product interface. It exposes the current model
primer, effort, mode, permission diagnostics, and session browser. A model
selection can change while the session is live when the candidate is present
in `models.json`; the access profile is selected at open and remains fixed for
that session.

## A safe first path

Start with the default `readonly` access profile and a local model. Run
`carbon --list` to inspect sessions, then open a read-only TUI session to make
Carbon decode and normalize the model configuration without asking it to write
to the checkout. Carbon has no separate configuration-validation command.
Move to `trusted` only when the workspace needs writes and you understand the
command approval boundary.
`unconfined` is an explicit escape hatch: it requires
`--acknowledge-unconfined`, uses the real home directory, and gives the process
full filesystem and network authority. It is not a default or a sandbox.

When a task needs a second harness, use an ACP profile. Gateway-backed ACP
models keep provider credentials in Carbon and give the child a short-lived
loopback protocol endpoint. Native ACP profiles let the child use its own
harness authentication. Both kinds inherit the Carbon access posture.

## Product boundary

Carbon is a Go terminal application. It does not ship a browser application.
The repository's browser boundary is a framework-neutral TypeScript core and an
optional Svelte adapter in the separate client workspace. Vanilla consumers can
bind the core directly; React, Vue, Solid, or another framework can provide a
consumer binding, but Looprig does not ship those adapters as Carbon products.
Use Carbon's TUI when you need the supplied user interface.

This distinction matters operationally: a browser client is a consumer of a
client contract, while Carbon is the process that owns a session, an access
profile, MCP connections, and child processes. A browser page does not grant
itself those authorities.

## Evidence

The composition root and flag behavior are in
[`cmd/carbon/main.go` at the v0.19.0 source commit](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
Session assembly and runtime ownership are in
[`internal/app/assembly.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/assembly.go),
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go),
and the release record is pinned by the `release-github-com-looprig-carbon`
proof marker in this page's frontmatter.
