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

The default foreground timeout is 30 seconds and the hard maximum is 120 seconds. Combined stdout and stderr are capped at 32 KiB, with a truncation notice. A non-zero exit code is normal tool output. A timeout, start failure, missing artifact, or workdir mismatch is a tool-result error string. Audit summaries show the command already presented for approval.

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

Read [Safety, Permissions, and Gates](/docs/guides/tools/safety) before allowing shell access. For supervised follow-ups, see [Process Supervision](/docs/guides/tools/processes) and [Process Output, Input, and Stop Tools](/docs/guides/tools/processes/tools). The model request and stream envelope live in Inference's [tool requests](/docs/guides/inference/requests/tools) and [tool-call deltas](/docs/guides/inference/streaming/tool-call-deltas).

## Source

- [Bash execution](https://github.com/looprig/tools/blob/main/bash/bash.go)
- [Bash preparation](https://github.com/looprig/tools/blob/main/bash/prepare.go)
- [Supervised path](https://github.com/looprig/tools/blob/main/bash/supervised.go)

## Proof

- [Bash behavior tests](https://github.com/looprig/tools/blob/main/bash/bash_test.go)
- [Bash preparation tests](https://github.com/looprig/tools/blob/main/bash/preparecall_test.go)
- [Supervision tests](https://github.com/looprig/tools/blob/main/bash/supervised_test.go)
- [Runnable preparation fixture](https://github.com/looprig/tools/blob/main/examples/preparation/example_test.go)
