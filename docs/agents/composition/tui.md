---
id: agents/composition/tui
title: Attach the terminal UI
description: Use TUI session adapters, restore policy, runtime hosts, components, and styles without owning the Harness.
audience: agent
section: agents/composition
order: 10
publication: released
proofs:
  tui:
    - release-github-com-looprig-tui
  harness:
    - release-github-com-looprig-harness
---
# TUI

`github.com/looprig/tui` is a presentation and interaction layer over Harness contracts. Use `tui/sessionadapter` to adapt a `harness/pkg/session.SessionController` and event subscription into the UI model. Use `tui/runtime` to host the Bubble Tea runtime, and `tui/components` for input, completion, session status, and value selection. `tui/styles` owns terminal-safe styles and Markdown rendering.

The adapter reads typed events and produces projections. It does not replace the journal, session store, gate evaluator, sandbox, or restore decision. Supply a restore decider explicitly; restore must reject identity, fingerprint, runtime, or workspace drift unless the selected policy accepts it. The runtime host owns the terminal program and must stop it before the process exits.

Lifecycle: construct adapter with a live session controller, start subscriptions, render projections, send commands through the controller, then stop subscriptions and runtime. Component state is UI-owned and should not be treated as durable session state. Keep terminal width and capability checks at the rendering boundary.

Invariants: event order is preserved, URLs and sensitive payloads are not rendered in gate cards, restoration policy is explicit, and close is idempotent. Failures include restore rejection, event subscription closure, terminal setup, Markdown renderer configuration, and controller errors. Use TUI only when a terminal is the chosen client; Carbon ships a complete TUI product separately.

Proofs: [`tui/sessionadapter/adapter.go`](https://github.com/looprig/tui/blob/b37258f96032bf478d25111409990a5e38577727/sessionadapter/adapter.go), [`tui/runtime/run.go`](https://github.com/looprig/tui/blob/c7a4c6d26f8ca5952b782d6cf2d574325e649ef4/runtime/run.go), [`tui/examples/restore/example_test.go`](https://github.com/looprig/tui/blob/b2d88ad42aad1c37481b7bd745b9af18bd36e88b/examples/restore/example_test.go).
