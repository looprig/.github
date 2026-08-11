---
id: carbon/architecture/overview
title: Carbon architecture overview
description: Map Carbon's composition root, runtime layers, and ownership boundaries from process startup to model turns.
audience: [developer, operator]
section: carbon-architecture
order: 1
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  source:
    - release-github-com-looprig-carbon
---

# Carbon architecture overview

Carbon is a fixed product composition around the Looprig harness. Its
architecture is easiest to understand as one process root that turns explicit
configuration into one supervised runtime:

```text
CLI and signals
  -> resolved Carbon home and store factory
  -> models, credentials, MCP, egress, access, and ACP composition
  -> session adapter and Carbon loop
  -> TUI, model turns, process tools, MCP adoption, and ACP children
  -> journal, workspace lease, resources, and reverse shutdown
```

The arrows describe ownership, not a public network topology. The CLI does not
expose a generic agent server. It creates a TUI process whose runtime controls
the authority and persistence boundaries.

## Process root

`cmd/carbon/main.go` initializes the sandbox package, creates a
SIGINT/SIGTERM-aware context, parses mutually exclusive session and credential
commands, resolves the Carbon home once, and chooses the data directory. The
credential-only and listing paths return before live session composition.

The store factory opens a shared filesystem backend for sessions, workspaces,
the listing catalog, and per-session resources. A session open takes the
current checkout's workspace lease, then binds a selector that either creates a
new session or restores one UUID. The factory is closed only after the runtime
has drained the live session.

## Composition layers

The assembly root compiles configuration into these boundaries:

- the model catalog creates the Carbon client, primer candidates, delegate
  sources, optional native ACP catalog, and optional permission classifier;
- the access layer turns the selected profile and egress route into an executor
  set and a secret-free revision;
- the MCP layer creates session-scoped transports, manager, adopter, notices,
  and elicitation/event hooks;
- the process adapter maps prepared sandbox processes to the harness process
  runner;
- the ACP layer registers gateway and native child builders with the chosen
  profile and credential mode;
- the runtime agent joins those parts to the TUI/session adapter and owns their
  close order.

Each layer can fail closed before a live turn. Runtime controls can change a
primer, effort, or quick/deep mode within the admitted model catalog, but they
cannot mutate the access profile or replace the process boundary.

## Reusable components versus Carbon

Carbon imports released Looprig modules and supplies the product policy that
joins them. A consumer building a different application can choose different
stores, a different UI, or a different composition root. Such a consumer is not
Carbon merely because it imports the same modules. This is why this architecture
describes Carbon's fixed lifecycle instead of presenting its internal wiring as
the only valid Looprig design.

## Evidence

Read the composition in
[`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go),
[`internal/app/assembly.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/assembly.go),
and [`internal/app/persistence.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence.go).
Runtime ownership is pinned in
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go).
