---
id: agents/repositories/rclonestore
title: Rclone blob storage
description: Use an external rclone binary as a context-bounded storage.Blobs adapter.
audience: agent
section: agents/repositories
order: 18
publication: released
proofs:
  module:
    - release-github-com-looprig-rclonestore
---
# rclonestore

`github.com/looprig/rclonestore@v0.3.2` implements `storage.Blobs`, not the full storage composite. Construct it with `rclonestore.New(rclonestore.Options{Remote: "name", Prefix: "..."})`. `Remote` may be a named rclone remote or inline connection string. `Binary`, `ConfigPath`, `Timeout`, and declared `PersistencePaths` control process execution and path reporting.

The adapter resolves the binary, validates the remote and prefix, probes reachability, and then invokes rclone with argv rather than a shell. Every call is bounded by context and optional timeout; stderr is capped and sensitive remote values are omitted from errors. Add it to a `storage.Composite` with other primitives when needed.

Invalid remote or prefix, missing binary, probe, timeout, subprocess, object key, and blob decode errors fail construction or the operation. Proofs: [`rclonestore.go`](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/rclonestore.go), [`runner.go`](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/runner.go), [`blobs.go`](https://github.com/looprig/rclonestore/blob/994e14f9184726b57798df4049b7b731fde608f9/blobs.go), [`examples/blob-remote/blob_remote_test.go`](https://github.com/looprig/rclonestore/blob/1056e69af6b19964bbec56ec8337acfcd6cd43d4/examples/blob-remote/blob_remote_test.go).
