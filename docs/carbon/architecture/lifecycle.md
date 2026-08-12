---
id: carbon/architecture/lifecycle
title: Carbon runtime lifecycle and shutdown
description: Follow a Carbon session from lease acquisition through tool work, restore, cancellation, and reverse-order teardown.
audience: [developer, operator]
section: carbon-architecture
order: 3
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  lifecycle:
    - release-github-com-looprig-carbon
  open:
    - release-github-com-looprig-carbon
  work:
    - release-github-com-looprig-carbon
  close:
    - release-github-com-looprig-carbon
  cancellation-and-failure:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon runtime lifecycle and shutdown

Carbon's lifecycle has one owner at each stage:

```text
process root
  -> store factory
  -> session and workspace lease
  -> RuntimeAgent and TUI/session adapter
  -> model turns, process tools, MCP, and ACP children
  -> drain
  -> adopter, manager, access, credentials, store factory
```

## Open

The process root resolves the home and configuration. The store factory opens
the shared backend, the session selector creates or restores a session, and the
workspace lease protects the current checkout. Assembly constructs the model,
access, MCP, ACP, and process boundaries before the runtime hands control to
the TUI.

An initial resume ID is consumed only by the first open. A `/clear` reopen uses
an empty selector and therefore creates a new session. Runtime controls update
the admitted primer, effort, or mode without reconstructing the access profile.

## Work

The session adapter owns loop draining and persistence. Process requests pass
through Carbon's prepared-process adapter and produce journaled output. MCP
manager connections are session-scoped; the adopter exposes their tools at
loop boundaries. ACP children receive a bounded profile and source identity.
Credentials are borrowed through leases, not copied into tool or child state.

Restore reuses these boundaries only if workspace, configuration, and runtime
identity revisions match. Completed process journals and session metadata make
the result observable after a terminal or process interruption.

## Close

`RuntimeAgent.Close` is idempotent and linearized. The close sequence is:

1. drain and stop the TUI/session adapter and loops;
2. close MCP adoption;
3. close MCP manager connections and grants;
4. close access executors, scratch home, and egress resources;
5. end credential runtime leases and close its source/catalog/store;
6. return to the CLI, which closes the session store factory.

The order is intentionally reverse construction. A late MCP callback cannot
reach an already-closed access executor, and a process or model turn cannot
borrow a credential after the runtime has released it.

## Cancellation and failure

Signal cancellation follows the same runtime close path. If a child or MCP
transport fails during assembly, Carbon returns a bounded error before handing
control to the TUI. If a close step returns an error, the runtime still
attempts later close steps and returns the first relevant failure. Operators
should retain the session ID and close diagnostics rather than deleting state.

## Evidence

The runtime lifecycle is implemented in
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go),
[`internal/app/assembly.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/assembly.go),
and [`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
Close and restore behavior is covered by the Carbon internal app tests linked
from those source files.
