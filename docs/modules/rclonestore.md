---
id: modules/rclonestore
title: RcloneStore
description: Implement the neutral Blobs contract by driving rclone as a bounded subprocess.
audience: developer
section: modules
order: 10
publication: released
proofs:
  repository: release-github-com-looprig-rclonestore
  description: release-github-com-looprig-rclonestore
  dependencies: release-github-com-looprig-rclonestore
  dependents: release-github-com-looprig-rclonestore
  where-it-fits: release-github-com-looprig-rclonestore
---

# RcloneStore

## Repository

| Field | Value |
| --- | --- |
| Repository | `github.com/looprig/rclonestore` |
| Version | `v0.6.0` |
| GitHub | [looprig/rclonestore](https://github.com/looprig/rclonestore) |

## Description

Implement the neutral Blobs contract by driving rclone as a bounded subprocess.

## Where it fits

RcloneStore is useful on its own when an application needs immutable blob storage through an existing rclone remote. Within Looprig, it provides the Blobs portion of [Storage](/docs/modules/storage) for workspace data and other large objects kept outside a ledger or metadata backend. Since v0.5.0 it implements Storage v0.7.0 nested names: `a` and `a/b` coexist because each object is stored at `<key>@blob`. It still does not implement the bounded blob reader lifecycle, so it cannot back a [SessionStore](/docs/modules/sessionstore). Use [S3Store](/docs/modules/s3store) for session objects in a cloud composition. The v0.5.0 layout is a one-way change with no migration. `New` and `List` refuse legacy objects with `ErrLegacyLayout`; move or delete the old root before upgrading, and never reopen the new root with v0.4.x. Use a dedicated root: a foreign object whose path is a valid storage name is also refused. Startup recursively lists the root to check its layout, and `Options.DisableListR` (v0.6.0) passes `--disable ListR` for a provider whose recursive listing is broken. Since v0.6.0 an ambient `RCLONE_CONFIG_*` variable whose name contains a colon is dropped from the child environment, so an inline remote cannot be configured from the surrounding environment. On filesystems with a 255-byte filename limit, the `@blob` suffix leaves at most 250 bytes for the final key segment.

RcloneStore owns bounded subprocess calls; deployment configuration owns the remote and credentials.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

None.
