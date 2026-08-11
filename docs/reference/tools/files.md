---
id: reference/tools/files
title: Standard file tools
description: Prepare and execute workspace reads, searches, writes, and edits with guard and lease-aware dependencies.
audience: developer
section: reference
order: 261
publication: released
examples:
  - stage-04-prepared-tool
proofs:
  read-and-search: release-github-com-looprig-tools
  mutation: release-github-com-looprig-tools
  limits: release-github-com-looprig-tools
  source-and-runnable-proof: release-github-com-looprig-tools
---

# Standard file tools

`ReadFile`, `Glob`, and `Grep` are read tools. `WriteFile` and `EditFile` mutate workspace files through the session's mutation coordinator. Their constructors accept narrow dependencies rather than the entire gate.

## Read and search {#read-and-search}

`readfile.NewReadFile` binds a root, `loop.ReadGuard`, and observation map. It rejects final-component symlinks, returns line-numbered text, and applies the guard's byte limit. `glob.NewGlob` walks a contained root and caps results. `grep.NewGrep` searches file contents, skips denied paths and noise directories, and caps output. Each preparer resolves its requested path or tree before the gate sees the requirement.

## Mutation {#mutation}

`writefile.New` and `editfile.New` accept `WithMutationCoordinator`; the root definitions inject the session-bound coordinator. A complete read records the content hash used by same-loop mutation checks. Write and edit calls use path permits and lease health, and stale or irregular targets fail closed. `WithHostWrites` is an explicit option for a composition root that has chosen a host-write policy; it does not remove preparation or the gate.

## Limits {#limits}

Do not pass a caller-created coordinator after the root definition has injected its session coordinator. That would replace the permit and lease checks. Keep absolute host reads or writes disabled unless the product's access source intentionally supports them, and treat output truncation or stale-file errors as normal failed tool results rather than retrying against a different path.

## Source and runnable proof {#source-and-runnable-proof}

Read the [pinned file packages](https://github.com/looprig/tools/tree/151f5530f95a9bba95be10551a8f08282d8959ab/). `stage-04-prepared-tool` covers a prepared standard tool; package tests cover path, guard, snapshot, and mutation behavior.
