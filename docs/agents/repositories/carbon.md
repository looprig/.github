---
id: agents/repositories/carbon
title: Carbon harness product
description: Run the complete Carbon harness product with model configuration, sessions, workspaces, gates, ACP, MCP, and a TUI.
audience: agent
section: agents/repositories
order: 26
publication: released
proofs:
  module:
    - release-github-com-looprig-carbon
---
# carbon

`github.com/looprig/carbon@v0.19.0` is the complete built harness product. It is an executable composition of reusable modules, not the name of the architecture layer. Consumers who need a purpose-built runtime should compose the lower-level packages directly; consumers who need the finished CLI use Carbon.

Run `go run ./cmd/carbon` or the released binary. The CLI supports `--list`, `--resume <uuid>`, `--data-dir`, `--access-profile readonly|trusted|unconfined`, and explicit credential commands. The default data root is `~/.looprig/carbon/store`; unconfined execution requires `--acknowledge-unconfined`.

Carbon reads `~/.looprig/carbon/models.json`. The strict versioned file contains model targets, primer default, native ACP profiles, permission review, and ACP launcher configuration. Model descriptors are validated with `inference/model` and `llm`; credential values stay outside the descriptor. The product assembly opens one durable backend for sessions, workspaces, leases, and process resources, then routes through the TUI and session adapter.

Malformed flags or JSON, unsafe file permissions, model validation, provider auth, store, restore, gate, sandbox, ACP, MCP, and process failures are fail-closed. Proofs: [`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go), [`internal/app/modelconfig.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig.go), [`internal/app/persistence.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence.go), [`cmd/carbon/main_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main_test.go), [`internal/app/modelconfig_validate_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_validate_test.go).
