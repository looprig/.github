---
id: carbon/sessions-and-stores
title: Carbon sessions, listing, restore, and stores
description: Operate the shared on-disk stores, list resumable sessions, restore safely, and understand the limits of configuration continuity.
audience: [operator, developer]
section: carbon
order: 12
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  restore:
    - release-github-com-looprig-carbon
---

# Carbon sessions, listing, restore, and stores

Carbon's default store root is `<carbon-home>/store`. A
`SessionStoreFactory` opens the harness session store, workspace store, and
listing catalog over one filesystem backend. It opens lazily enough for
credential-only commands and `--list` to avoid constructing a live session.
The factory remains open until the runtime and every session it opened have
closed.

## List without replaying

Use:

```sh
carbon --list
```

Carbon reads the listing index, prints session ID, status, last-active time,
and title in most-recently-active order, and exits. It does not acquire a
session lease, replay a journal, or contend with a running session. The list is
scoped to the current workspace fingerprint.

## Resume deliberately

Use `carbon --resume <uuid>` to select one listed session. The first TUI open
passes that UUID to the store selector and restores it. The selector checks the
workspace and configuration identity, including model, MCP, access, and other
runtime revisions. A mismatch fails closed by default. The internal
`AllowConfigMismatch` field exists for controlled composition tests, not as a
CLI recovery switch.

The TUI's `/clear` is a lifecycle boundary. Carbon drains and closes the live
session, then opens a fresh session with no resume ID. It does not replay the
old session a second time.

## Durable scope

The session journal and metadata are durable in the session store. Workspace
leases are separate state, and process resource artifacts are under the
session-specific resources path. Carbon does not automatically archive the
checkout on close, so a restored session is not a substitute for a source
control backup.

## Store maintenance

Keep one Carbon process as the owner of a live session and let it handle normal
close. If a process is interrupted, first use `--list` and the TUI browser to
identify the session. Do not remove a store directory while another process
may still hold a lease. If the listing catalog and session records disagree,
preserve the data and collect the session ID and bounded diagnostics for
recovery.

## Evidence

The factory, selectors, workspace scope, and manual snapshot policy are in
[`internal/app/persistence.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence.go)
and [`internal/app/session_browser.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/session_browser.go).
CLI list and resume behavior are covered by
[`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go)
and the persistence and restore tests in
[`internal/app/persistence_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence_test.go).
