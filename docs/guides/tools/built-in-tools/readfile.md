---
id: guides/tools/built-in-tools/readfile
title: ReadFile
description: Read bounded, line-numbered workspace text with observation tracking.
audience: developer
section: guides
order: 17
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# ReadFile

`ReadFile` reads a UTF-8 text file and returns line-numbered text. It supports an optional 1-based inclusive `start_line` and `end_line` range. The tool reads and hashes the full file for its observation contract, then narrows only the displayed lines.

## Contract

The JSON shape is `{"path":"src/main.go","start_line":1,"end_line":80}`. Preparation resolves the canonical target and emits one direct `filesystem.read` requirement with an empty grant pair. A final-component symlink, path escape, non-regular file, or changed resolution fails closed. The injected `loop.ReadGuard` denies secret paths and supplies the per-file byte cap.

The output uses a right-aligned line number prefix. A complete, non-truncated contained read records the raw content SHA-256 in the loop's shared observation map. That observation is what allows a later contained `WriteFile` or `EditFile` call to compare the current file against what the loop observed. A truncated or host read does not authorize a workspace write.

`WithHostReads` permits a literal absolute path outside the workspace if the consumer's read authority allows it. It does not widen relative `../` traversal. Host reads never record an observation and do not alter the workspace write boundary.

```go
// ReadFile uses the narrow ReadGuard interface instead of the full gate.
reader := readfile.NewReadFile(root, readGuard, tool.NewWorkspaceObservations())
request, artifact, err := reader.PrepareCall(ctx, executionID,
	`{"path":"src/main.go","start_line":1,"end_line":40}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := reader.InvokableRun(prepared, `{}`)
```

ReadFile pairs naturally with [WriteFile](/docs/guides/tools/built-in-tools/writefile/) and [EditFile](/docs/guides/tools/built-in-tools/editfile/). The common prepare and gate behavior is in [Tool Definitions, Preparation, and Results](/docs/guides/tools/core-concepts/) and [Safety, Permissions, and Gates](/docs/guides/tools/safety/).

## Source

- [ReadFile implementation](https://github.com/looprig/tools/blob/main/readfile/readfile.go)

## Proof

- [ReadFile behavior tests](https://github.com/looprig/tools/blob/main/readfile/readfile_test.go)
- [ReadFile preparation tests](https://github.com/looprig/tools/blob/main/readfile/preparecall_test.go)
- [Host-read boundary tests](https://github.com/looprig/tools/blob/main/readfile/readfile_hostreads_test.go)
