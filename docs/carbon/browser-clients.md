---
id: carbon/browser-clients
title: Carbon and browser clients
description: Set expectations for the browser boundary, the framework-neutral client core, and the UI Carbon actually ships.
audience: [human, developer]
section: carbon
order: 15
publication: source-workspace
proofs:
  carbon-release:
    - release-github-com-looprig-carbon
  client-boundary:
    - source-client-sdk-core-package
    - source-client-sdk-svelte-package
  keep-the-authority-boundary-visible:
    - release-github-com-looprig-carbon
  product-status:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon and browser clients

Carbon itself ships a Go terminal UI. It does not ship a browser application or
a Carbon web server that turns a browser into an agent operator. The browser
boundary is a separate, framework-neutral TypeScript client core and an
optional shipped Svelte adapter in the client workspace. Vanilla JavaScript or
TypeScript can bind the core directly. React, Vue, Solid, or another framework
can be used by a consumer that writes its own binding; Looprig does not ship
those adapters as part of Carbon.

## Keep the authority boundary visible

A browser client can present messages, session state, and transport events. It
does not acquire Carbon's filesystem, network, credential, MCP, or child-process
authority by rendering a page. Those capabilities remain owned by the process
that composes and runs Carbon or another consumer application.

Do not document a browser install command for Carbon. Choose the TUI for the
released Carbon product. If you are building a web consumer, establish its
transport and authentication contract independently, then bind it to the
consumer application that owns the session. The TypeScript core is
framework-neutral by design; its use does not imply that a React, Vue, or Solid
package is available from Looprig.

## Product status

The browser client workspaces have their own publication and release status.
Carbon's release status does not publish them, and a browser client does not
change Carbon's Go module or its CLI flags. Verify the client workspace's own
release record before giving an installation path.

## Evidence

Carbon's supplied interface and process composition are visible in
[`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go)
and [`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go).
This page intentionally describes the browser boundary without presenting a
browser package as a Carbon install artifact.
