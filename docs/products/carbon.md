---
id: products/carbon
title: Carbon coding agent
description: Install and configure Carbon, then understand its coding tools, safety boundaries, subagents, protocols, sessions, workspaces, and model proxy.
audience: [human, developer, operator]
section: products
order: 2
publication: released
proofs:
  install: release-github-com-looprig-carbon
  configure-a-model: release-github-com-looprig-carbon
  run-carbon: release-github-com-looprig-carbon
  features: release-github-com-looprig-carbon
  coding-tools: release-github-com-looprig-carbon
  permission-gates-and-classifiers: release-github-com-looprig-carbon
  subagents: release-github-com-looprig-carbon
  claude-code-and-codex-through-acp: release-github-com-looprig-carbon
  mcp: release-github-com-looprig-carbon
  compaction: release-github-com-looprig-carbon
  sessions-and-restore: release-github-com-looprig-carbon
  workspaces: release-github-com-looprig-carbon
  model-proxy: release-github-com-looprig-carbon
  tui-and-browser-clients: release-github-com-looprig-carbon
  acp-launcher-troubleshooting: release-github-com-looprig-carbon
  repository: release-github-com-looprig-carbon
---

# Carbon coding agent

Carbon is a coding agent built from Looprig modules. It provides a ready terminal experience for inspecting repositories, editing files, running commands, delegating work, restoring sessions, and connecting external tools while keeping authority explicit.

## Install

```sh
go install github.com/looprig/carbon/cmd/carbon@v0.23.0
```

Carbon stores configuration under `~/.looprig/carbon` by default. Its configuration files must be regular, owner-only files.

## Configure a model

Create `~/.looprig/carbon/models.json`. This minimal catalog uses an OpenAI-compatible local server such as LM Studio:

```json
{
  "version": 2,
  "primer_default": "local",
  "models": [{
    "alias": "local",
    "description": "Local coding model",
    "provider": "lmstudio",
    "api_format": "openai",
    "base_url": "http://localhost:1234/v1",
    "model": "qwen3-coder",
    "api_key": "",
    "uses": ["primer", "delegate"],
    "capabilities": { "tools": true },
    "efforts": ["none"],
    "default_effort": "none"
  }]
}
```

Use an owner-only file containing a credential reference for hosted providers rather than placing a key in source control.

## Run Carbon

```sh
chmod 600 ~/.looprig/carbon/models.json
carbon --access-profile readonly
```

Start with `readonly`. Use `trusted` only when Carbon should modify the workspace. `unconfined` requires explicit acknowledgement and grants the launching user’s authority.

## Features

### Coding tools

Carbon supplies repository-aware read, search, edit, write, process, task, and skill tools. Tool calls use preparation before effect, so validation and permission review happen before an operation changes the system.

### Permission gates and classifiers

Access profiles define the maximum authority for a session. Gates can pause sensitive operations, and deterministic classifiers provide bounded evidence for command permission decisions without expanding authority.

### Subagents

Carbon can delegate bounded work to configured child harnesses. Delegation keeps the parent session responsible for limits, cancellation, evidence, and shutdown.

### Claude Code and Codex through ACP

ACP profiles let Carbon launch Claude Code, Codex, or another compatible agent as a subagent. Native profiles let the child use its own authentication; gateway profiles route its model traffic through Carbon.

### MCP

Carbon can adopt tools from MCP servers and expose configured capabilities across an MCP boundary. Server lifecycle, authentication, tool discovery, and failures stay explicit.

### Compaction

Long sessions can compact older context into a validated summary while preserving the durable event history. Compaction reduces model context without pretending the original session records disappeared.

### Sessions and restore

Sessions persist messages, events, tool activity, and runtime state. Carbon can list prior sessions and restore one by ID after a process restart.

### Workspaces

Each session can bind a workspace with explicit roots, leases, permissions, snapshots, and restore behavior. The workspace is separate from model context and session history.

### Model proxy

Carbon’s model proxy exposes configured models through a local protocol endpoint. ACP children and other compatible Harness compositions can use Carbon’s provider routing and credentials without receiving the original secret.

### TUI and browser clients

Carbon ships with a terminal UI for prompts, events, tools, gates, model selection, and session browsing. Browser clients can consume the separate framework-neutral client contract when a product supplies a web interface.

## ACP launcher troubleshooting

Carbon resolves the launcher for each ACP harness in a fixed order, and the first source that yields a command decides the result.

1. A nonempty harness-specific environment override — `CLAUDE_CODE_ACP_EXECUTABLE` for `claude-code`, `CODEX_ACP_EXECUTABLE` for `codex` — is read first, and an empty value is ignored rather than accepted as a launcher.
2. The matching entry in the configured `acp_launchers` map is consulted next, only when no environment override applies.
3. A lookup of the well-known adapter names on `PATH` is the last source, reached only after the first two yield nothing.

Carbon then verifies the resolved launcher, and it must be a clean absolute path to a regular executable file.

Carbon rejects a symlink at every position of that path, including each symlinked parent directory component, so a launcher reached through a symlinked directory is refused.

Reopen a session after you change a launcher entry in `acp_launchers`, and restart Carbon after you change an environment override.

An unavailable launcher removes its harness from the advertised runtime choices, so a harness whose launcher fails verification is never offered as a delegation target.

Record a launcher as `<absolute-path-to-launcher>` in shared configuration:

```json
{
  "acp_launchers": {
    "claude-code": {"executable": "<absolute-path-to-launcher>"}
  }
}
```

## Repository

Read the source and release information in the [`looprig/carbon` repository](https://github.com/looprig/carbon).
