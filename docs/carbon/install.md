---
id: carbon/install
title: Install and start Carbon
description: Build or install the released Carbon command, choose a home and data directory, and make the first safe run.
audience: [human, operator]
section: carbon
order: 2
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  cli:
    - release-github-com-looprig-carbon
---

# Install and start Carbon

Carbon `v0.19.0` is a Go command. The release module is
`github.com/looprig/carbon`; use a tagged source checkout or build the command
from that release. The Carbon repository's own Makefile builds with
`CGO_ENABLED=0` and writes the binary to `bin/carbon`. Its `install` target
copies the result atomically to `~/.looprig/bin/carbon`.

If you are working from a coordinated source workspace, keep the workspace
replacements in the local build only. A published module must resolve the
released dependency versions recorded in Carbon's `go.mod`.

## First run

Run `carbon --help` first. The process resolves the Carbon home once. By
default it is `~/.looprig/carbon`; the default session data directory is
`~/.looprig/carbon/store`. `--data-dir` selects another store root. The home
also contains `models.json`, `mcp.json`, and workspace permission state.

For a first, non-writing check, run:

```sh
carbon --list
carbon --access-profile readonly
```

`--list` reads the listing catalog scoped to the current workspace and exits;
it does not acquire a session lease or replay a session. An empty store prints
that there are no sessions yet. The second command opens the TUI with the
default read-only boundary. Carbon creates the store lazily when it opens a
session.

Use `--resume <uuid>` only with an ID printed by `--list`. A resume selects the
session on the first open. The TUI's `/clear` closes that session and opens a
new one; it does not silently restore the same ID.

## Home and data choices

Keep the home and data directory on a filesystem that supports owner-only
permissions and atomic rename. Carbon rejects unsafe model and MCP
configuration files, including symlinks, non-regular files, and files that are
readable by group or other users. The data directory is shared by the session,
workspace, and resource stores, so do not point two unrelated Carbon instances
at the same root unless they are intentionally sharing that store.

The environment file used by the repository Makefile is for launcher settings,
such as ACP executable paths. Do not place provider credentials in it. Inline
model keys belong only in the owner-only model file; credential references are
the preferred durable binding described in [Credentials](credentials.md).

## Access profile warning

Carbon defaults to `readonly`. `trusted` allows workspace writes, host reads,
network access, and ordinary commands, while host writes remain gated.
`unconfined` allows host and workspace writes, host reads, network, and
commands, uses the real home, and requires both the profile flag and
`--acknowledge-unconfined`. Carbon prints a warning for this profile. Treat it
as equivalent to handing the process the authority of the launching user.

Invalid flags, unknown profiles, and incompatible session or credential
arguments fail closed with a usage or failure exit status. Credential commands
are short-lived and cannot be combined with `--resume` or a TUI session.

## Evidence

The supported flags, defaults, exit statuses, and signal setup are implemented
in [`cmd/carbon/main.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/cmd/carbon/main.go).
Home and store resolution are in
[`internal/app/home.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/home.go)
and [`internal/app/persistence.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/persistence.go).
The release and runnable CLI proof are pinned to the Carbon `v0.19.0` release
record.
