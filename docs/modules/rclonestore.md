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
| Version | `v0.4.2` |
| GitHub | [looprig/rclonestore](https://github.com/looprig/rclonestore) |

## Description

Implement the neutral Blobs contract by driving rclone as a bounded subprocess.

## Where it fits

RcloneStore is useful on its own when an application needs immutable blob storage through an existing rclone remote. Within Looprig, it provides the Blobs portion of [Storage](/docs/modules/storage) for workspace data and other large objects kept outside a ledger or metadata backend. The v0.4.2 release still targets the storage v0.6 contract and does not implement the bounded blob reader lifecycle, so it cannot back a [SessionStore](/docs/modules/sessionstore). Use [S3Store](/docs/modules/s3store) for session objects in a cloud composition. RcloneStore owns bounded subprocess calls; deployment configuration owns the remote and credentials.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

None.
