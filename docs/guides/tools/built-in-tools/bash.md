---
id: guides/tools/built-in-tools/bash
title: Bash
description: Run bounded shell commands with explicit command and access requirements.
audience: developer
section: guides
order: 12
publication: released
proofs:
  foreground-and-supervised-definitions: [release-github-com-looprig-tools]
  arguments-and-preparation: [release-github-com-looprig-tools]
  limits-and-results: [release-github-com-looprig-tools]
  full-output-capture: [release-github-com-looprig-tools]
  cancellation-and-background-jobs: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Bash

`Bash` runs one shell command through `sh -c` in a workspace-contained working directory. Pipes, globs, redirects, and `&&` are supported because the command is intentionally handed to a shell. The boundary is the prepared command requirement, the gate decision, and the optional confined runner, not the shape of the shell invocation alone.

## Foreground and Supervised Definitions

`tools.Bash(options...)` builds the foreground path. It requires a workspace binding and can receive a `bash.WithRunner` command runner, a workspace coordinator, observations, or a family eligibility catalog. With no runner it uses direct shell execution.

`tools.BashDefinition(resolver, options...)` builds the session-supervised path. It requires `RequiresWorkspace | RequiresProcessServices`. The resolver is called exactly once at Build with the validated `bindings.LoopID`. A call with `background: true` or a present `yield_time_ms` goes through the shared runner-free process supervisor. Ordinary foreground calls retain the synchronous path.

## Arguments and Preparation

The required argument is `command`. Optional fields are `workdir`, bounded `timeout`, `background`, `yield_time_ms`, `tty`, `max_output_bytes`, and structured `access` declarations for `network`, `read`, and `write` deltas. A relative or contained absolute `workdir` is resolved against the workspace. A symlink or resolution change that escapes or changes after approval fails closed.

Preparation trims surrounding command whitespace but preserves interior bytes. It always emits one `command.execute` requirement whose match and grant target are the exact normalized command, with `command.start.v1` as its command-backed grant class. Explicit access deltas add filesystem or network requirements to the same gate decision. The request is authority to ask for, not authority already granted.

When `WithFamilyCatalog` recognizes a simple command prefix, preparation may display a reusable candidate such as `Bash(git log:*)`. The issued grant remains bound to the exact command. A compound or ambiguous shell command falls back to an exact candidate or no reusable candidate.

## Limits and Results

The default foreground timeout is 30 seconds and the hard maximum is 120 seconds. Combined stdout and stderr are capped at 32 KiB, keeping the beginning and the end of the stream around an `[output truncated: omitted N of M bytes]` marker. A completed synchronous call ends with `[exit code: N]`. A non-zero exit code is normal tool output. A timeout, start failure, missing artifact, or workdir mismatch is a tool-result error string. Audit summaries show the command already presented for approval.

```go
// The fixture in examples/preparation/example_test.go proves that changing
// raw JSON after PrepareCall cannot change the command that runs.
runner := &recordingRunner{}
b := bash.NewBash("/workspace", bash.WithRunner(runner))
request, artifact, err := b.PrepareCall(ctx, executionID, `{"command":"printf prepared"}`)
if err != nil {
	panic(err)
}
prepared := loop.WithPreparedCall(ctx, tool.PreparedCall{
	ExecutionID: executionID,
	Request: request,
	Artifact: artifact,
})
result, err := b.InvokableRun(prepared, `{"command":"printf changed"}`)
```

## Full output capture

Bash implements Harness's `tool.CapturingInvokableTool`. When the loop wires tool-result retention, `InvokableRunCaptured` sends the complete result to the capture sink while the 32 KiB preview is still what enters the conversation. The model can then page the rest with [read_tool_result](/docs/guides/tools/built-in-tools/readtoolresult). How the output reaches the sink depends on the execution path:

| Path | Capture behavior | Declared capture safety |
| --- | --- | --- |
| Direct `sh -c` (no runner) | Every byte is streamed to the sink before the preview cap, so the full output is never resident. Timeout and cancellation capture the partial output. | streaming, high output |
| Injected `bash.WithRunner` runner, including a sandbox executor | The runner returns the whole output at once; Bash captures it and returns the same head-and-tail preview. | materialized, high output |
| Supervised background or yielded call | The terminal process's retained spool is streamed through `process.Supervisor.CopyOutput`. Bytes the spool already dropped are reported, not invented. | same as the synchronous path |

`bash.Factory.DeclaredCaptureSafety()` and `bash.SupervisedFactory.DeclaredCaptureSafety()` report the sealed configuration, and the root `Bash` and `BashDefinition` definitions carry that value. A materialized configuration is safe only when the runtime declares a finite materialized maximum, as explained in [Large results and capture](/docs/guides/tools/core-concepts#large-results-and-capture). When nothing was elided, the captured bytes equal the returned text and Harness stores no object.

## Cancellation and background jobs

Direct execution runs `sh` in its own process group on Unix. A timeout or cancellation kills the whole group, including `&` and `nohup` jobs; only `setsid` escapes. After `sh` exits, a descendant holding the output pipe keeps the call open for at most two seconds, and its later output is dropped. Redirect a background job's output to a file if it must keep writing, or use the supervised path with `background: true`. [Shell cancellation and process groups](/docs/guides/tools/safety#shell-cancellation-and-process-groups) lists the behavior changes in full.

Read [Safety, Permissions, and Gates](/docs/guides/tools/safety) before allowing shell access. For supervised follow-ups, see [Process Supervision](/docs/guides/tools/processes) and [Process Output, Input, and Stop Tools](/docs/guides/tools/processes/tools). The model request and stream envelope live in Inference's [tool requests](/docs/guides/inference/requests/tools) and [tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas).

## Source

- [Bash execution](https://github.com/looprig/tools/blob/main/bash/bash.go)
- [Bash preparation](https://github.com/looprig/tools/blob/main/bash/prepare.go)
- [Supervised path](https://github.com/looprig/tools/blob/main/bash/supervised.go)
- [Result capture and declared capture safety](https://github.com/looprig/tools/blob/main/bash/capture.go)
- [Process-group isolation](https://github.com/looprig/tools/blob/main/bash/procgroup_unix.go)

## Proof

- [Bash behavior tests](https://github.com/looprig/tools/blob/main/bash/bash_test.go)
- [Bash preparation tests](https://github.com/looprig/tools/blob/main/bash/preparecall_test.go)
- [Supervision tests](https://github.com/looprig/tools/blob/main/bash/supervised_test.go)
- [Capture tests](https://github.com/looprig/tools/blob/main/bash/capture_test.go)
- [Descendant and timeout tests](https://github.com/looprig/tools/blob/main/bash/descendants_test.go)
- [Runnable preparation fixture](https://github.com/looprig/tools/blob/main/examples/preparation/example_test.go)
