---
id: guides/tools/built-in-tools/readtoolresult
title: read_tool_result
description: Let the model page through a large tool result that Harness retained in full.
audience: developer
section: guides
order: 22
publication: released
proofs:
  when-to-register-it: [release-github-com-looprig-tools]
  contract: [release-github-com-looprig-tools]
  pages-and-failures: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# read_tool_result

`read_tool_result` lets a model read the rest of a tool result it was shown only in part. When a loop retains tool results durably, a result larger than the preview budget reaches the conversation as a shaped preview that ends with a marker such as `read the rest with read_tool_result capture_id="<uuid>"`. The model calls this tool with that id and pages forward until it has what it needs. A long test run, a build log, or a large file read therefore stays available without flooding the context.

The tool is a thin, strict front end over Harness's `tool.ToolResultReader`. Harness decides what may be read: it binds one reader per session and calling loop, resolves the capture id against that loop's own captures, verifies the stored object, and fits each page under the loop's preview budget. A parent loop cannot page a child's captures, and a child cannot page its parent's.

## When to register it

Register `ReadToolResultDefinition()` only in a rig that wires readable retention with Harness's `rig.WithToolResultObjects`. The definition declares `tool.RequiresToolResultReader`, and a rig that registers it without readable tool-result objects is refused at definition time with `tool_result_reader_without_objects`. Harness also names the tool in its retention marker only when the calling loop actually has it bound, so a model is never told to call a tool that is not there.

```go
// Wire retention and the reader together. store is the Harness
// *sessionstore.Store the session journals into; spillBase is an absolute
// local directory outside the workspace region.
rigOptions = append(rigOptions,
	rig.WithToolResultObjects(store.ToolResultObjects(), spillBase))

tools := []tool.Definition{
	standardtools.BashDefinition(resolver),
	standardtools.ReadToolResultDefinition(),
}
```

Retention only produces something to read when the preview is bounded, so give the loop a finite `ToolLimits.ResultBytes`. See [Registering Tools With Harness](/docs/guides/tools/core-concepts/registration#register-the-result-reader-with-capture) and [Large results and capture](/docs/guides/tools/core-concepts#large-results-and-capture) for the rest of the wiring.

## Contract

The JSON shape is `{"capture_id":"<uuid>","offset":0,"max_bytes":65536}`. Only `capture_id` is required.

| Argument | Rule |
| --- | --- |
| `capture_id` | The canonical lower-case UUID printed by the retention marker. Any other form is refused. |
| `offset` | First retained byte to return. Defaults to 0. Use the `next_offset` a previous page reported. |
| `max_bytes` | At least 1. Defaults to, and is clamped at, 64 KiB (`tool.MaxToolResultPageBytes`), and Harness lowers it further to fit the conversation's tool-result budget. |

Preparation is strict. The arguments must be exactly one JSON object, and member names must match `capture_id`, `offset`, and `max_bytes` exactly, including case, with no duplicates or extra members. This matters because Go's JSON decoder matches names case-insensitively, which would otherwise let `{"capture_id":"A","CAPTURE_ID":"B"}` silently read `B`. The request carries no requirements: reading the loop's own retained output performs no new effect, so no permission gate opens. `InvokableRun` executes the prepared page and never re-parses the raw arguments.

## Pages and failures

A page is the retained bytes followed by a footer that names its range, for example `[capture <uuid>: bytes 0-65535 of 240000 retained (original 240000); next_offset=65536]`. The last page ends with `; end`, and a capture that stopped at its retention ceiling says how many bytes were not kept. A UTF-8 page never splits a character. A binary capture is returned base64-encoded and the footer says `encoding=base64`.

The tool never returns a Go error. Every failure is a model-facing result:

- A loop with no bound reader answers `no retained tool results are readable in this session`.
- A typed reader error, such as an unknown or foreign capture, renders the reader's own model-safe message.
- Cancellation is reported as `cancelled`.
- Any other reader error, or a page for a different capture than the one requested, is reported as `the retained object is unavailable`, because an untyped error may carry a backend detail.

```go
// A strictly prepared page request. The artifact, not argsJSON, is what runs.
reader := readtoolresult.New(bindings.ToolResults)
request, artifact, err := reader.PrepareCall(ctx, executionID,
	`{"capture_id":"0b9d1c3e-6f1a-4c52-9a51-1f2e3d4c5b6a","offset":65536}`)
if err != nil {
	return err // a *readtoolresult.PrepareError with a model-safe message
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request:     request,
	Artifact:    artifact,
})
page, err := reader.InvokableRun(prepared, `{}`)
```

Retention is a privacy decision as much as a context one. [Capture safety](/docs/guides/tools/safety#capture-safety) explains what a retained result can contain. The retained result itself is produced by tools such as [Bash](/docs/guides/tools/built-in-tools/bash), whose preview and capture are described on that page, and it surfaces in the turn described by Harness's [tool calls and results](/docs/guides/harness/step/tool-calls-and-results).

## Source

- [read_tool_result implementation](https://github.com/looprig/tools/blob/main/readtoolresult/tool.go)
- [ReadToolResultDefinition](https://github.com/looprig/tools/blob/main/definitions.go)

## Proof

- [read_tool_result tests](https://github.com/looprig/tools/blob/main/readtoolresult/tool_test.go)
- [Tool-result retention tests](https://github.com/looprig/tools/blob/main/tool_result_retention_test.go)
