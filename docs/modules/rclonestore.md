---
id: modules/rclonestore
title: RcloneStore
description: Implement the neutral Blobs contract by driving rclone as a bounded subprocess.
audience: developer
section: modules
order: 7
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
| Version | `v0.4.0` |
| GitHub | [looprig/rclonestore](https://github.com/looprig/rclonestore) |

## Description

Implement the neutral Blobs contract by driving rclone as a bounded subprocess.

## Where it fits

RcloneStore is useful on its own when an application needs immutable blob storage through an existing rclone remote. Within Looprig, it provides the blob portion of [Storage](/docs/modules/storage) for runtimes that keep large objects outside their ledger or metadata backend. RcloneStore owns bounded subprocess calls; deployment configuration owns the remote and credentials.

## Dependencies

- [Storage](/docs/modules/storage)

## Dependents

None.
