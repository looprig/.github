---
id: carbon/access-and-sandbox
title: Carbon access profiles and sandbox boundaries
description: Select a session authority profile, understand its guarantees, and review workspace permission state before allowing a command.
audience: [human, operator]
section: carbon
order: 10
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  access-tests:
    - release-github-com-looprig-carbon
  what-the-table-means:
    - release-github-com-looprig-carbon
  approval-and-persisted-rules:
    - release-github-com-looprig-carbon
  proxy-and-sandbox-routes:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon access profiles and sandbox boundaries

Carbon selects one access profile when a session opens. The profile is fixed
for that session and appears in the TUI's presentation and permission
diagnostics. A runtime model or MCP server cannot raise it.

| Profile | Workspace | Host | Network | Commands | Home | Sandbox posture |
| --- | --- | --- | --- | --- | --- | --- |
| `readonly` | read allowed, write denied | read and write denied | denied | gated | isolated | sandboxed |
| `trusted` | read and write allowed | read allowed, write gated | allowed | allowed | isolated | sandboxed |
| `unconfined` | read and write allowed | read and write allowed | allowed | allowed | real home | unconfined |

`readonly` is the default. `unconfined` requires
`--acknowledge-unconfined`; Carbon prints a warning and does not claim OS
confinement for it. The profile parser accepts only these names after CLI
normalization. Unknown or malformed values fail closed.

## What the table means

The table describes Carbon's access contract, not a universal claim about every
operating system's kernel. Carbon prepares process grants and sandbox posture
for its selected platform backend. The Carbon test suite exercises the profile
gate and its process integration where the runner supports it; the lower-level
Landlock, seccomp, cgroup, or macOS sandbox implementation has its own module
and platform prerequisites. A host that lacks a required backend can reject a
process before spawn. It must not be described as silently equivalent to a
stronger profile.

Workspace writes and host writes are distinct. `trusted` can update the
checkout but still gates a write outside it. `readonly` can inspect workspace
content while denying workspace writes. Network is a separate capability; a
provider credential does not imply network permission for arbitrary tools.

## Approval and persisted rules

Interactive permission state lives at the Carbon home under
`workspaces/<sha256(canonical-workspace)>/permissions.json`. The file is
owner-only and keyed to the canonical workspace. A first approval can be saved
as “always for this workspace” only for the exact five read-only Git families:
`git log`, `git status`, `git diff`, `git show`, and `git push`. Review each
approval; the family memory does not include `git commit`, `git logs`, or an
arbitrary shell command.

Headless permission state is different. A headless Carbon caller must provide
an explicit absolute permission-store path; Carbon does not search HOME for
one. A headless session has no human gate host, so a request that needs
interactive approval remains denied or unresolved rather than being guessed.

## Proxy and sandbox routes

Carbon recognizes `HTTPS_PROXY`, `HTTP_PROXY`, and `NO_PROXY` while building its
egress route. Direct access is explicit when no upstream proxy is configured or
when `NO_PROXY=*`. A proxy with specific exceptions is rejected by this
single-route implementation; a proxy without exceptions is used as one full
upstream route. Malformed proxy or `NO_PROXY` values fail closed. Proxy
credentials stay in the route object and never enter the access digest, logs,
or child environment.

## Evidence

Profile grants and digests are implemented in
[`internal/app/access.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access.go)
and [`internal/app/egress.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/egress.go).
The profile acceptance matrix and proxy redaction tests are in
[`internal/app/access_acceptance_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/access_acceptance_test.go)
and [`internal/app/egress_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/egress_test.go).
