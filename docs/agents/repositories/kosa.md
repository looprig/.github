---
id: agents/repositories/kosa
title: Kosa repository knowledge product
description: Run the separate Kosa product for repository documents, relations, search, proposals, HTTP, and MCP access.
audience: agent
section: agents/repositories
order: 27
publication: unavailable
proofs:
  module:
    - module-kosa
---
# kosa

Kosa is a separate source product at `github.com/looprig/kosa`; it is not a runtime dependency for agent composition and has no released consumer module. Use its CLI or local service source rather than adding it to a product's Go module.

The application service is composed with explicit workspace, semantic index, search, proposal, job, fingerprint, clock, ID, logger, and optional extractor ports. The local HTTP API exposes versioned document, commit, index, entity, search, SPARQL, proposal, and health routes with token protection. The MCP server is read-only and delegates its tools to the HTTP client.

Missing ports, invalid repository views, token or body limits, API errors, MCP frame limits, and indexing or proposal failures are construction or transport boundaries. Proofs: [`internal/app/service.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/app/service.go), [`internal/transport/httpapi/server.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/transport/httpapi/server.go), [`internal/transport/mcpserver/server.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/internal/transport/mcpserver/server.go), [`cmd/kosa/main.go`](https://github.com/looprig/kosa/blob/867bb33686fa2b3f4325b503d033c6a0d1ada08b/cmd/kosa/main.go).
