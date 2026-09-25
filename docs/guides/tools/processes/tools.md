---
id: guides/tools/processes/tools
title: Process Output, Input, and Stop Tools
description: Use cursor-addressed output, bounded input, and confirmed process stops.
audience: developer
section: guides
order: 9
publication: released
proofs:
  processoutput: [release-github-com-looprig-tools]
  processinput: [release-github-com-looprig-tools]
  processstop: [release-github-com-looprig-tools]
  source: [release-github-com-looprig-tools]
  proof: [release-github-com-looprig-tools]
---

# Process Output, Input, and Stop Tools

The process companion tools operate on an already-owned supervised process. Their `PrepareCall` requests carry no new capability requirements. The original Bash admission established process authority; each follow-up call still validates its own arguments and carries a typed artifact.

## ProcessOutput

`ProcessOutput` is read-only. Supply exactly one `process_id` or a distinct, non-empty `process_ids` array. `cursor` is a byte offset, `limit_bytes` defaults to 32 KiB and has no upper bound in this release, and `encoding` is `safe_text` or `base64`. `wait` is `poll`, `any`, or `all`; `any` waits for one selected process to append output past the cursor or become terminal, while `all` waits for every selected process. `timeout_ms` bounds only that wait, not the process.

Single calls return one JSON object. Multi calls preserve the input order in an array. Each entry can include `output`, `start_cursor`, `next_cursor`, `gap`, `total_bytes`, `status`, `exit_code`, `reason`, `started_at`, `finished_at`, normalization and binary indicators, or a stable `error`. A missing or cross-owner handle is `not_found`. A cursor beyond the retained stream is `cursor_ahead`.

Safe text removes unsafe terminal sequences and invalid UTF-8 before returning inline output. Base64 returns raw retained bytes and an opaque artifact reference. Neither form reveals the spool location.

## ProcessInput

`ProcessInput` writes only to an owned live process. A call must include at least one of `data`, `eof`, or both `rows` and `cols`. Data is serialized per process and bounded by `MaxPendingInputBytes` plus a 500 millisecond write bound. Pipe-mode EOF closes stdin; PTY-mode EOF sends an EOT byte. Resize is valid only for a PTY and fails with `pty_unavailable` before data or EOF is attempted when the target uses pipes.

After a successful operation, the result uses the same cursor-addressed snapshot shape as `ProcessOutput`. An omitted cursor snapshots from the output end captured before the operation, which lets a caller ask for output caused by its own input. `yield_time_ms` waits for new output or termination after the operation, but a wait timeout does not stop the process.

## ProcessStop

`ProcessStop` accepts one owned `process_id`, a `mode`, and an optional `grace_ms`:

- `interrupt` sends the platform interrupt and waits up to the grace period without escalation;
- `terminate` sends graceful termination and escalates once to `kill` if exit is not confirmed within grace; and
- `kill` sends immediate forceful termination and waits for confirmation.

Success means the supervisor has confirmed and persisted the terminal state. A repeated stop on a terminal entry is idempotent and returns the existing result without signaling again. A missing or foreign handle is `not_found`; signal or teardown problems use stable error fields.

```go
// Follow-up operations use the same owner, but they do not replay Bash's gate.
output := standardtools.ProcessOutputDefinition()
input := standardtools.ProcessInputDefinition()
stop := standardtools.ProcessStopDefinition()

for _, definition := range []tool.Definition{output, input, stop} {
	built, err := definition.Build(ctx, bindingsWithProcess)
	if err != nil {
		panic(err)
	}
	fmt.Println(built[0].Info(ctx))
}
```

For the shared supervisor and ownership model, read [Process Supervision](/docs/guides/tools/processes). For restore and shutdown, read [Process Lifecycle, Storage, and Restore](/docs/guides/tools/processes/lifecycle). The surrounding model exchange is described by Harness's [tool calls and results](/docs/guides/harness/step/tool-calls-and-results) and Inference's [tool-result blocks](/docs/guides/inference/content-blocks/tool-result).

## Source

- [ProcessOutput](https://github.com/looprig/tools/blob/main/process/output_tool.go)
- [ProcessInput](https://github.com/looprig/tools/blob/main/process/input_tool.go)
- [ProcessStop](https://github.com/looprig/tools/blob/main/process/stop_tool.go)

## Proof

- [ProcessOutput tests](https://github.com/looprig/tools/blob/main/process/output_tool_test.go)
- [ProcessInput tests](https://github.com/looprig/tools/blob/main/process/input_tool_test.go)
- [ProcessStop tests](https://github.com/looprig/tools/blob/main/process/stop_tool_test.go)
