---
id: guides/tools/built-in-tools/writefile
title: WriteFile
description: Write full files atomically with containment and optimistic concurrency.
audience: developer
section: guides
order: 21
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# WriteFile

`WriteFile` writes a complete UTF-8 text file. It creates workspace parent directories as needed, writes to a same-directory owner-only temporary file, syncs, and atomically renames into place. A final-component symlink is replaced as a node instead of followed to its target.

## Contract

The JSON shape is `{"path":"src/main.go","content":"package main\n"}`. Preparation canonicalizes the target and emits one direct `filesystem.write` requirement whose scope and match are the same canonical path. The requirement includes an exact-path candidate for the contained target. `WriteTarget` returns that same canonical path for runner scheduling.

For a contained existing file, the tool requires a complete prior observation from `ReadFile` and compares its SHA-256 hash before replacing. A new absent file can be created without a prior read, but atomic no-replace publication reports `FileCreateConflictError` if another writer wins. A changed, missing, symlinked, or irregular target fails without clobbering it.

The session coordinator supplies the shared mutation and canonical path permits. A lease health failure blocks the commit. `WithHostWrites` enables a literal absolute target outside the workspace, subject to the consumer's write authority. Host writes do not consult or update the observation map and are not covered by workspace checkpoint or undo. A missing host parent directory is not created automatically. Relative `../` remains invalid.

```go
// Read first when overwriting an existing contained file. The observation
// lets WriteFile perform its compare-and-swap check.
writer := writefile.New(root, observations)
request, artifact, err := writer.PrepareCall(ctx, executionID,
	`{"path":"src/main.go","content":"package main\n"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := writer.InvokableRun(prepared, `{}`)
```

See [ReadFile](/docs/guides/tools/built-in-tools/readfile/) for observations, [EditFile](/docs/guides/tools/built-in-tools/editfile/) for exact replacements, and [Safety, Permissions, and Gates](/docs/guides/tools/safety/) for permits and gate decisions.

## Source

- [WriteFile public wrapper](https://github.com/looprig/tools/blob/main/writefile/writefile.go)
- [WriteFile implementation](https://github.com/looprig/tools/blob/main/internal/filemutation/writefile.go)

## Proof

- [WriteFile behavior tests](https://github.com/looprig/tools/blob/main/internal/filemutation/writefile_test.go)
- [WriteFile preparation tests](https://github.com/looprig/tools/blob/main/internal/filemutation/preparecall_test.go)
- [Host-write boundary tests](https://github.com/looprig/tools/blob/main/internal/filemutation/hostwrites_test.go)
