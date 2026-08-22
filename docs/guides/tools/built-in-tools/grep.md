---
id: guides/tools/built-in-tools/grep
title: Grep
description: Search workspace content with ripgrep or a bounded standard-library fallback.
audience: developer
section: guides
order: 16
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Grep

`Grep` searches file contents for a regular expression. It prefers ripgrep when available and falls back to a standard-library `WalkDir` and RE2 scan. The ripgrep path receives an argument vector, never a shell string, so a pattern or path beginning with `-` cannot become a flag.

## Contract

The JSON shape is `{"pattern":"TODO","path":"src","recursive":true,"ignore_case":true,"context_lines":2,"include_all":false}`. `path` defaults to the workspace root. Preparation compiles the pattern, validates the options, resolves the search root, and emits one `filesystem.read` tree requirement. An invalid regular expression fails before the gate.

Both backends apply the denied-path filter. The ripgrep command uses deny globs as a performance hint and then filters every emitted path again. The fallback filters before opening a file. Noise directories are skipped unless `include_all` is true. Results are capped at 200 matching lines, each line is capped at 64 KiB, and the search is bounded by a 30 second timeout.

`WithArgvRunner` routes the ripgrep argument vector through a confined runner. `WithHostReads` permits only a literal absolute external path and still leaves the filesystem requirement to the consumer's access source. The run path checks that the approved root resolution has not changed.

```go
// The tool chooses ripgrep or its safe fallback internally.
search := grep.NewGrep(root, readGuard)
request, artifact, err := search.PrepareCall(ctx, executionID,
	`{"pattern":"TODO","path":"src","context_lines":1}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := search.InvokableRun(prepared, `{}`)
```

Use [Glob](/docs/guides/tools/built-in-tools/glob) to discover filenames first and [ReadFile](/docs/guides/tools/built-in-tools/readfile) when the model needs a bounded file view. For the request envelope, see Inference's [tool requests](/docs/guides/inference/requests/tools).

## Source

- [Grep implementation](https://github.com/looprig/tools/blob/main/grep/grep.go)

## Proof

- [Grep behavior tests](https://github.com/looprig/tools/blob/main/grep/grep_test.go)
- [Grep preparation tests](https://github.com/looprig/tools/blob/main/grep/preparecall_test.go)
- [Runner injection tests](https://github.com/looprig/tools/blob/main/grep/runner_injection_test.go)
