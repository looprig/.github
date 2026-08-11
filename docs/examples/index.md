---
id: examples/index
title: Reviewed examples
description: Progressive examples that connect Flow, Workflows, serving, browser clients, TUI, and evaluation to pinned source and test evidence.
audience: [human, developer]
section: examples
order: 400
publication: released
examples:
  - stage-17-flow
  - stage-18-workflows
  - stage-19-http-serve
  - stage-20-web-client
  - stage-21-tui
  - stage-23-eval
proofs:
  flow: release-github-com-looprig-flow
  workflows: [module-workflows, central-workflows-stage18-output-test]
  serving: release-github-com-looprig-harness
  client: [source-client-sdk-core-package, central-client-stage20-session-client-proof]
  tui: release-github-com-looprig-tui
  evaluation: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
  stage-17-flow: release-github-com-looprig-flow
  stage-18-workflows: central-workflows-stage18-output-test
  stage-19-http-serve: release-github-com-looprig-harness
  stage-20-web-client: central-client-stage20-session-client-proof
  stage-21-tui: release-github-com-looprig-tui
  stage-23-eval: [release-github-com-looprig-eval, release-github-com-looprig-pluto]
---

# Reviewed examples

These entries follow the progressive example manifest. “Released” means the Go component has a pinned release record. “Source-workspace” means the example is reviewed and runnable from the workspace, but its component does not yet have a release claim.

## Stage 17: Flow {#stage-17-flow}

The [stage 17 Flow example](../build/20-flow.md) starts an interrupted graph run, resumes it, and shows growing checkpoint history. It uses released core and Flow modules. The assertion is about interruption and resumption, not about an event journal or UI.

## Stage 18: Workflows {#stage-18-workflows}

The [stage 18 Workflows fixture](../build/21-workflows.md) is source-workspace. It proves typed validation, interruption, checkpoint recovery, typed resume, cancellation, and append-only history. Its exact output is `started: Interrupted`, `interrupt: awaiting increment`, `recovered: Interrupted`, `resumed: Completed count=3`, `cancelled: Cancelled`, and `history: append-only`.

## Stage 19: HTTP serving {#stage-19-http-serve}

The [stage 19 serving example](../build/22-serving.md) uses released core and Harness. It prints the capabilities document, one session, and a protected control-route response. Read routes are durable projections; the live SSE route is a separate live-session boundary.

## Stage 20: Web client {#stage-20-web-client}

The [stage 20 web example](../build/23-client.md) is source-workspace because the private browser packages are not release claims. It typechecks the framework-neutral TypeScript, runs Svelte checks for the optional source adapter, and proves that `SessionClient.disconnect()` disposes the active async iterator. Vanilla and Svelte are reviewed; React, Vue, and Solid remain possible consumers, not shipped bindings.

## Stage 21: TUI {#stage-21-tui}

The [stage 21 TUI example](../build/24-tui.md) uses released core, Harness, inference, and TUI. It prints session-adapter state, image capability, an event, and one shutdown. Adapter close is session shutdown; it is not deletion of durable history.

## Stage 23: Evaluation {#stage-23-eval}

The [stage 23 evaluation example](../build/25-evaluation.md) uses released core, Eval, and Pluto. It prints a passing exact evaluation report and a Qualified capability report. The report is an evaluation artifact, separate from session event history, workflow checkpoints, workspace snapshots, and model context.
