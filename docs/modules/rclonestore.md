---
id: modules/rclonestore
title: Remote blobs through rclone
description: Implement the neutral Blobs contract by driving rclone as a bounded subprocess.
audience: developer
section: modules
order: 7
publication: released
proofs:
  construction:
    - release-github-com-looprig-rclonestore
  blob-contract:
    - release-github-com-looprig-rclonestore
  limits:
    - release-github-com-looprig-rclonestore
---

# Remote blobs through rclone

Rclonestore `v0.3.2` adapts Storage Blobs to an installed `rclone` binary. Install `github.com/looprig/rclonestore@v0.3.2` with `github.com/looprig/storage@v0.3.1`.

## Construction {#construction}

`rclonestore.New` validates a named remote or a `:backend:` connection string, checks the safe relative prefix, resolves the configured binary with `exec.LookPath`, and probes the remote root before returning a Store. `Options.ConfigPath` is passed by path only. The package never opens, parses, copies, or logs the file because it may contain remote credentials. Every subprocess is argv-based and context-bounded; there is no shell string and no librclone or cgo dependency.

## Blob contract {#blob-contract}

`Put` first probes for an existing object. If absent, it streams the reader to `rclone rcat`. If present, it reads and compares bytes; identical content is an idempotent success and different content returns `storage.BlobConflictError` without replacing the object. `Get` buffers the completed `rclone cat` result so a missing object is reported by `Get`, not later by `Read`. `List` sorts and deduplicates relative keys locally. `Delete` maps a missing object to success.

## Limits {#limits}

The present-object comparison path buffers incoming and existing bytes, so it is intended for content-addressed reuses, not unbounded uploads. The absent path streams. A probe failure, invalid path, missing binary, context cancellation, or non-zero rclone exit is typed. `RcloneError` includes only the subcommand, safe flags, exit status, and bounded stderr; remote names, positional paths, and config paths are excluded. `Close` is an idempotent no-op because each call uses a short-lived subprocess. `StoragePaths` returns nil for this remote backend.

The scripted fixture under `rclonestore/examples/blob-remote` exercises the remote command seam without requiring a real provider. Run the module's deterministic tests with `GOWORK=off go test ./...`.
