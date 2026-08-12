---
id: carbon/operations
title: Operate Carbon in a working environment
description: Run Carbon with explicit configuration, inspect sessions and credentials, supervise shutdown, and plan for platform differences.
audience: [operator, human]
section: carbon
order: 16
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  ci:
    - release-github-com-looprig-carbon
  a-repeatable-startup-check:
    - release-github-com-looprig-carbon
  credentials-and-logs:
    - release-github-com-looprig-carbon
  network-route:
    - release-github-com-looprig-carbon
  shutdown-and-restart:
    - release-github-com-looprig-carbon
  platform-posture:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Operate Carbon in a working environment

Treat Carbon as a long-lived process with explicit inputs. Pin the Carbon
release, keep the home and store on a private filesystem, choose an access
profile before opening a session, and record the model, MCP, ACP, and launcher
changes that explain a session's configuration revision.

## A repeatable startup check

1. Confirm the current directory is the intended checkout.
2. Run `carbon --list` and make sure no unexpected session owns that workspace.
3. Check the owner-only modes of `models.json`, `mcp.json`, and workspace
   permission state.
4. Validate model and MCP configuration by starting Carbon in `readonly`.
5. Only then choose `trusted` for a task that needs workspace writes.
6. Use `unconfined` only for a deliberate, acknowledged operation and record
   why the broader authority is necessary.

Carbon does not provide a live config reload command. Restart after changing
models, MCP bindings, ACP launchers, access policy, or egress environment.
Restore is intentionally conservative when the configuration revision changes.

## Credentials and logs

Use `carbon credentials list` to inspect safe descriptors. Use explicit login
and logout commands for catalog lifecycle. Keep provider values out of shell
history, launcher `.env` files, issue reports, ACP child environments, and
model descriptions. Carbon's bounded errors and credential summaries are the
supported diagnostic surface.

## Network route

Review `HTTPS_PROXY`, `HTTP_PROXY`, and `NO_PROXY` as part of deployment. Carbon
uses one explicit direct route or one full upstream route. A proxy with
specific exceptions is rejected by the current route implementation. A
loopback model endpoint still requires the model and access policy to permit
the route; loopback is not a credential or authorization bypass.

## Shutdown and restart

SIGINT and SIGTERM cancel the process context. Runtime shutdown proceeds in
reverse composition order: the TUI/session adapter drains and stops loops, the
MCP adopter closes, the MCP manager closes transports and grants, the access
executor closes scratch home and egress resources, and the credential runtime
releases sources and local stores. The session store factory closes after the
runtime returns. `RuntimeAgent.Close` is idempotent and linearized, so callers
can safely follow the same path from a signal and a runtime error.

If a child process remains, use the process tool's terminate and kill controls
under the same access profile. Do not delete a session store or workspace
directory as a substitute for draining a live process.

## Platform posture

Carbon's CI runs race tests on Linux and macOS, an integration process path,
and Windows cross-builds. macOS integration covers real sandbox execution in
the unconfined path and fail-closed behavior before a trusted spawn when the
platform sandbox is unavailable. Linux's composed supervised process path is
covered in Carbon's integration jobs. The lower-level OS backends have their
own platform constraints; verify the host capability and treat a pre-spawn
fail-closed result as a deployment issue, not permission to run unconfined.

## Evidence

Process startup, signals, and command operations are in
[`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
The runtime close order is in
[`internal/app/runtime_controls.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/runtime_controls.go).
The release's CI matrix and integration commands are recorded in
[`.github/workflows/ci.yml`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/.github/workflows/ci.yml).
