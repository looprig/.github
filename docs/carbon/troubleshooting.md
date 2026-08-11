---
id: carbon/troubleshooting
title: Troubleshoot Carbon without weakening the boundary
description: Diagnose configuration, restore, MCP, ACP, process, and sandbox failures with bounded evidence and safe recovery steps.
audience: [operator, human]
section: carbon
order: 17
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  tests:
    - release-github-com-looprig-carbon
---

# Troubleshoot Carbon without weakening the boundary

Start with the exact bounded error, the Carbon release, the selected access
profile, and the session ID. Do not solve an authorization or configuration
failure by switching to `unconfined`, copying a credential into a child
environment, or deleting the store.

## Carbon says there is no model

Confirm that `~/.looprig/carbon/models.json` exists, is an owner-only regular
file, and is valid UTF-8 JSON under 1 MiB. Confirm `version` is `2` or `3`,
`primer_default` names a row with `uses` containing `primer`, and every model
advertises tools. Use the exact local LM Studio fixture named
`validLMStudioModelConfig` in Carbon's decode tests as a known-good shape. Then
replace only the provider, endpoint, model, and authentication fields that the
provider policy supports.

Unknown fields, duplicate keys, a trailing JSON value, invalid effort
combinations, unsafe aliases, or mismatched credential references are intended
validation failures. Correct the file and restart Carbon.

## Restore is rejected

Run `carbon --list` in the same checkout and confirm the UUID. A changed model,
MCP, access, workspace, or runtime identity can change the configuration
fingerprint. Carbon rejects that restore by default. If the change is
intentional, start a fresh session; the CLI does not expose the internal
allow-mismatch seam. If the checkout is already leased, close the owner before
retrying.

## MCP does not appear

Check that `mcp.json` is in the resolved Carbon home and has a `mcpServers` map.
For stdio use `command`; for streamable HTTP use a loopback HTTP URL or HTTPS;
for SSE set `type: "sse"` explicitly. Remove unknown roles, duplicate keys,
URL userinfo, and unsupported fields. Restart the process because Carbon does
not reload MCP configuration and `/clear` does not reload it. A bounded notice
may report a tool collision or adoption failure; the transport manager is
constructed all-or-nothing.

If a server requests elicitation from a headless session, it is refused because
there is no gate host. Use the interactive TUI when human input is required.

## ACP does not launch

Confirm the harness is exactly `claude-code` or `codex`, the model row includes
`delegate` for a gateway route, and any native allowlist is non-empty when it
is present. Check launcher precedence: environment override, configured
absolute path, then the default executable name. A selected child is checked at
launch, so a path that existed at startup may still fail later. Check the
required `carbon-collab-mcp` executable when the production composition
requires collaboration.

Do not pass a provider key to the child. Gateway routes keep it in Carbon; a
native route uses the harness's own authentication. Read the bounded ACP error
for the safe classification and inspect the child under the selected profile.

## A command is denied or a sandbox is unavailable

Confirm the selected profile and the target path. `readonly` denies workspace
writes, host access, network, and ordinary commands unless a gate can admit the
request. `trusted` allows workspace writes and network but still gates host
writes. `unconfined` is not a repair step; it requires explicit acknowledgment
and removes OS confinement.

If a platform backend cannot prepare a sandbox, Carbon should fail closed before
spawn or reject the request. Check the host prerequisites and Carbon's CI
platform posture. Do not claim that a local runner has the same OS guarantees as
the tested integration environment.

## A process is still running

Use the process identity and output cursor, then wait. Request terminate before
kill. A PTY request is rejected on unsupported platforms rather than silently
converted. If the terminal disappeared, use `--list` and session restore to
recover the journal before starting a duplicate command.

## Evidence

Decoder and restore failure cases are exercised in
[`internal/app/modelconfig_decode_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/modelconfig_decode_test.go)
and [`internal/app/mcp_fingerprint_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/mcp_fingerprint_test.go).
ACP, process, access, and integration diagnostics are pinned in
[`internal/app/acpchildren_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/acpchildren_test.go),
[`internal/app/process_integration_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/process_integration_test.go),
and [`internal/app/access_acceptance_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access_acceptance_test.go).
