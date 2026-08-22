---
id: guides/tools/built-in-tools/editfile
title: EditFile
description: Apply exact substring edits with optimistic concurrency and diff previews.
audience: developer
section: guides
order: 13
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# EditFile

`EditFile` replaces an exact substring in a UTF-8 text file and returns a compact diff preview. Its default unique mode requires `old` to occur exactly once. Set `replace_all` to replace every occurrence. Zero matches and ambiguous matches are tool-result errors, not silent edits.

## Contract

The JSON shape is `{"path":"file.txt","old":"before","new":"after","replace_all":false}`. Preparation resolves the canonical target once and emits one `filesystem.write` requirement with an empty grant pair for a contained path. `WriteTarget` returns the same canonical path as the requirement scope, so Harness can serialize aliases such as `a/../f.txt` and `f.txt` together.

Contained edits use the loop observation map. A complete prior read must have recorded the file hash, and the current hash must still match. The session coordinator supplies the outer path permit and lease-health check. Final-component symlinks and non-regular nodes are refused. The run path rechecks the approved resolution before reading or writing.

For an uncontained absolute target enabled by `WithHostWrites`, preparation adds a paired `filesystem.read` requirement because the editor reads before writing. Host edits do not use the workspace observation map and are not covered by workspace checkpoint or undo. A relative `../` escape is still rejected.

```go
// The exact anchor protects a normal edit from replacing the wrong region.
editor := editfile.New(root, observations)
request, artifact, err := editor.PrepareCall(ctx, executionID,
	`{"path":"main.go","old":"oldName","new":"newName"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := editor.InvokableRun(prepared, `{}`)
```

When the file changed since the complete read, the result uses `StaleFileError`. A missing file, irregular node, bad anchor, lease failure, or changed resolution is also surfaced as a bounded error string. See [WriteFile](/docs/guides/tools/built-in-tools/writefile) for full-file replacement and [Safety, Permissions, and Gates](/docs/guides/tools/safety) for coordinator behavior.

## Source

- [EditFile public wrapper](https://github.com/looprig/tools/blob/main/editfile/editfile.go)
- [EditFile implementation](https://github.com/looprig/tools/blob/main/internal/filemutation/editfile.go)

## Proof

- [EditFile behavior tests](https://github.com/looprig/tools/blob/main/internal/filemutation/editfile_test.go)
- [EditFile preparation tests](https://github.com/looprig/tools/blob/main/internal/filemutation/preparecall_test.go)
- [Host-write and paired-read tests](https://github.com/looprig/tools/blob/main/internal/filemutation/hostwrites_test.go)
