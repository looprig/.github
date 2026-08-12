---
id: carbon/architecture/configuration
title: Carbon configuration architecture
description: Trace how owner-only model, MCP, credential, access, and launcher inputs become stable runtime revisions.
audience: [developer, operator]
section: carbon-architecture
order: 2
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  configuration:
    - release-github-com-looprig-carbon
  file-boundaries:
    - release-github-com-looprig-carbon
  normalization-and-identity:
    - release-github-com-looprig-carbon
  client-construction:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon configuration architecture

Carbon treats configuration as a typed composition input, not as ambient
process state. The process resolves the home once, reads owner-only files with
strict decoders, normalizes them, and carries secret-free revisions into
session selection and restore.

## File boundaries

`models.json` describes model deployment identity, capabilities, efforts,
credential binding, primer/delegate uses, native ACP profiles, launcher paths,
and optional permission review. `mcp.json` describes named stdio,
streamable-HTTP, or SSE bindings, environment and headers, and Carbon roles.
Workspace permissions are stored separately by canonical checkout digest.
Launcher environment variables are read only at ACP composition. Egress
environment is resolved into a route object rather than copied into model or
access configuration.

Each file has its own size, UTF-8, duplicate-key, unknown-field, and file-mode
rules. The decoders avoid echoing environment, header, credential, and path
values in errors. This matters because a configuration failure is often the
first thing an operator sends to another person.

These are complete minimal inputs for the two user-editable configuration
files. They are separate files; Carbon does not accept one merged object.

`models.json`:

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local LM Studio coding model.",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": {
      "tools": true,
      "thinking": false,
      "images": false,
      "prompt_caching": false,
      "structured_output": false,
      "structured_output_with_tools": false
    },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
```

`mcp.json`:

```json
{
  "mcpServers": {
    "local-tools": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {"MCP_MODE": "readonly"},
      "roles": ["carbon"]
    }
  }
}
```

The exact decoders and normalization paths are covered by Carbon's
[`modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go)
and [`mcpconfig_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcpconfig_test.go).

## Normalization and identity

Model rows are normalized by alias, and model credentials are represented as
safe reference identity or an inline-key eligibility bit. The model digest
does not contain an inline key's bytes. MCP fingerprints contain binding
topology and safe transport identity, not header or environment values. Access
digests contain the selected profile and egress guarantee bits, not proxy
credentials. ACP runtime identity distinguishes harness, source mode, model
alias, effort, and harness-managed selection.

Those revisions are used to reject an unsafe restore. A credential rotation can
preserve a reference identity, but a changed model row, access profile, MCP
topology, or ACP selection is a different composition. The normal CLI chooses
fresh composition instead of hiding the mismatch.

## Client construction

The production model loader binds a credential reference through Carbon's
credential runtime, creates the inference client, and applies the stable retry
policy. The loader then derives primer candidates and delegate sources from the
same normalized catalog, so a TUI selection and an ACP route cannot silently
use different model rules. Native ACP is added as a separate source because
its child owns authentication.

MCP manager construction is sorted by binding name and all-or-nothing. Access
executor construction resolves the profile and egress route before tools are
registered. This ordering lets the runtime reject an incomplete composition
without leaving a partially connected MCP manager or a child process with a
half-built policy.

## Evidence

Model wire and revision code are in
[`internal/app/modelconfig.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig.go),
[`internal/app/modelconfig_digest.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_digest.go),
and [`internal/app/productionmodels.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/productionmodels.go).
MCP, access, and egress revisions are implemented in
[`internal/app/mcp.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp.go),
[`internal/app/access.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access.go),
and [`internal/app/egress.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/egress.go).
