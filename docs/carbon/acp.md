---
id: carbon/acp
title: Use ACP harnesses from Carbon
description: Configure Claude Code and Codex ACP profiles, choose gateway or native authentication, and understand child-process posture.
audience: [human, operator, developer]
section: carbon
order: 6
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  harnesses:
    - release-github-com-looprig-carbon
---

# Use ACP harnesses from Carbon

ACP lets Carbon delegate a bounded subtask to a supported external harness. The
current catalog recognizes exactly two harnesses: `claude-code` and `codex`.
Carbon gives each child a workspace, an access posture, a runtime identity, and
an explicit credential mode. A missing or unsafe launcher fails closed; Carbon
does not fall back to an arbitrary executable found on the path.

## Choose a source

There are two ACP source modes:

- A gateway-backed delegate row uses a Carbon model row marked `delegate`.
  Carbon starts a child-specific loopback inference gateway. The Claude child
  speaks the Anthropic API codec; the Codex child speaks the OpenAI Responses
  codec. Carbon routes the configured model alias and, where configured, the
  Claude small-model alias. Provider credentials remain bound to the
  in-process client and never enter the child environment.
- A native profile uses the harness's own authentication. Set
  `native_acp.<harness>.enabled` and omit `models` for harness-managed model
  selection, or provide a non-empty explicit allowlist. Carbon passes only the
  native harness's approved environment names and does not turn a native
  profile into a gateway route.

The choice is part of the runtime identity. It is not safe to restore a
gateway session as native or to treat a native model name as a Carbon provider
alias.

## Launchers

An `acp_launchers` entry can specify an absolute executable path for each
harness. At runtime Carbon checks the environment override first:
`CLAUDE_CODE_ACP_EXECUTABLE` for Claude Code and `CODEX_ACP_EXECUTABLE` for
Codex, then the configured launcher, then the default executable name. Static
checks can omit a profile with a bounded diagnostic. A selected child is
validated again at launch, so an executable can disappear between startup and
use.

Use a launcher path that you control. Do not put a shell pipeline, a relative
path, or an argument string in `executable`; the decoder accepts only a clean
absolute path. Keep launcher settings in the environment or owner-only config,
not in a model description.

## Access posture inherited by children

ACP children receive the Carbon profile's posture. `readonly` maps to ACP
read-only. Both `trusted` and `unconfined` map to workspace-write at the ACP
driver boundary; `unconfined` still retains its broader Carbon authority and
real home. The child cannot select a stronger profile than the parent session.

The gateway child receives a narrow environment allowlist. Native children
receive the native harness home and standard locale and temporary-directory
names, plus the profile's workspace. Carbon strips provider keys, credential
references, and unrelated parent environment values. ACP errors are bounded and
redacted before they reach the model or TUI.

## Collaboration MCP service

When runnable ACP rows are present, Carbon's production composition verifies the
`carbon-collab-mcp` sibling and supplies one loop-scoped collaboration service
descriptor to the child. Lower-level composition and test seams can omit this
requirement. This is the service used for ACP coordination. It does not mean
that every configured MCP server is injected into a native harness.
Carbon's own MCP bindings stay on the Carbon loop and are adopted there from
`mcp.json`.

If the required collaboration executable is missing or fails its path checks,
the ACP route fails closed. Keep the child and broker versions aligned with the
Carbon release and inspect the bounded startup diagnostic rather than guessing
at a replacement command.

## Evidence

ACP catalog and source identity are in
[`internal/app/acpcatalog.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpcatalog.go),
production launcher wiring is in
[`internal/app/acpproduction.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpproduction.go),
and child environment and posture handling are in
[`internal/app/acpchildren.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren.go).
The posture matrix and redaction checks are pinned in
[`internal/app/acpchildren_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren_test.go).
