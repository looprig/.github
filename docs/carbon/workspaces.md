---
id: carbon/workspaces
title: Carbon workspaces and checkout ownership
description: Understand how Carbon identifies the current checkout, leases it, and keeps workspace permission state separate from session state.
audience: [operator, developer]
section: carbon
order: 11
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  persistence:
    - release-github-com-looprig-carbon
  workspace-identity:
    - release-github-com-looprig-carbon
  current-checkout-versus-resources:
    - release-github-com-looprig-carbon
  snapshots:
    - release-github-com-looprig-carbon
  operator-checklist:
    - release-github-com-looprig-carbon
  evidence:
    - release-github-com-looprig-carbon
---

# Carbon workspaces and checkout ownership

Carbon uses the current checkout as the session workspace. The session store
factory opens one workspace store and one lease manager alongside the session
store. A live Carbon session takes an exclusive workspace lease, so two active
sessions cannot silently write the same checkout through the same Carbon
composition.

## Workspace identity

The listing catalog records the workspace fingerprint and filters `--list` to
the current working directory. Sessions that are empty or have no owner remain
visible when the fingerprint is unavailable, which makes recovery possible
without pretending that an unknown workspace is the current one. A session
browser inside the TUI shows matching workspace sessions other than the one
currently open.

Workspace permission state uses the canonical workspace path's SHA-256 under
`<carbon-home>/workspaces/<digest>/permissions.json`. This keeps approvals
scoped to a checkout identity rather than to a process-wide command history.

## Current checkout versus resources

The checkout is the user's workspace. Carbon's per-session resource storage is
separate, under `<data-dir>/resources/<session-id>`, with the resource identity
`carbon:session-resource-storage/v1`. It is shared through the same store
factory, but it is not a reason to grant a tool access to arbitrary host files.

## Snapshots

Carbon installs a manual snapshot policy. It does not automatically snapshot the
user checkout on idle, and it does not archive the checkout simply because a
session closed. Carbon's CLI does not expose a snapshot command. Keep Git or
another explicit backup process for the checkout itself; a different consumer
composition can choose to call its store API deliberately.

## Operator checklist

Before opening a write-capable session, confirm the current directory is the
intended checkout, inspect its status, and check that no other Carbon session
holds the workspace lease. If a session appears in the listing but cannot be
resumed, preserve its ID and inspect the store rather than deleting the
directory. A changed checkout or configuration can make restore reject the
session by design.

## Evidence

Workspace construction, leases, resource storage, and manual snapshot policy
are in [`internal/app/persistence.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence.go).
The workspace permission path and approval families are in
[`internal/app/permissions.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/permissions.go),
with workspace and restore coverage in
[`internal/app/persistence_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence_test.go).
