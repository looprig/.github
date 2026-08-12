---
id: guides/tools/built-in-tools/glob
title: Glob
description: Find workspace paths with bounded, denied-path-aware glob matching.
audience: developer
section: guides
order: 15
publication: released
proofs:
  contract: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Glob

`Glob` lists paths under a workspace root. `**` spans directories, while `*`, `?`, and character classes stay within one path segment. Results are sorted, capped at 500 paths, and rendered as newline-separated workspace-relative names.

## Contract

The JSON shape is `{"pattern":"**/*.go","root":"src"}`. `root` defaults to the workspace root. Preparation resolves the walk root and emits one `filesystem.read` requirement. The requirement scope is the plain canonical root, while its match uses `permission.TreeMatch(root)` so a durable tree rule can cover descendants. Direct execution enforces the approved root again.

The walk prunes common noise directories such as `.git`, `vendor`, `node_modules`, `build`, and `dist`. The explicit search root itself is never pruned. Every discovered file passes the authoritative `ReadGuard.DeniedRead` filter, so a denied name is not leaked. A canceled walk returns `glob timed out` rather than a partial listing.

`WithHostReads` permits a literal absolute search root outside the workspace, subject to the consumer's read authority. It does not widen relative traversal. Host matches are displayed relative to the searched directory and are not recorded as workspace observations.

```go
// A tree requirement authorizes the walked root, not an arbitrary path.
finder := glob.NewGlob(root, readGuard)
request, artifact, err := finder.PrepareCall(ctx, executionID,
	`{"pattern":"**/*.go","root":"src"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := finder.InvokableRun(prepared, `{}`)
```

See [ReadFile](/docs/guides/tools/built-in-tools/readfile/) for reading one file and [Grep](/docs/guides/tools/built-in-tools/grep/) for content search. The shared gate boundary is described in [Safety, Permissions, and Gates](/docs/guides/tools/safety/).

## Source

- [Glob implementation](https://github.com/looprig/tools/blob/main/glob/glob.go)

## Proof

- [Glob behavior tests](https://github.com/looprig/tools/blob/main/glob/glob_test.go)
- [Glob preparation tests](https://github.com/looprig/tools/blob/main/glob/preparecall_test.go)
- [Host-read boundary tests](https://github.com/looprig/tools/blob/main/glob/glob_hostreads_test.go)
