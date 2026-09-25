---
id: guides/harness/hooks/operations
title: Hook operations
description: Choose the exact runtime operations a hook observes.
audience: developer
section: guides
order: 12
publication: released
proofs:
  operation-domain: [release-github-com-looprig-harness]
  call-shape: [release-github-com-looprig-harness]
  payloads: [release-github-com-looprig-harness]
  outcomes: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Hook operations

## Operation domain

`hook.Operation` is a `uint8` with these exact constants:

| Constant | Value | Guardable | Meaning |
| --- | ---: | :---: | --- |
| `OperationTurn` | `1` | yes | One loop turn. |
| `OperationStep` | `2` | no | One turn-local inference/tool step. |
| `OperationInference` | `3` | yes | Provider inference boundary. |
| `OperationCompaction` | `4` | yes | One transcript-compaction attempt. |
| `OperationToolCall` | `5` | yes | Semantic model tool call, including permission resolution. |
| `OperationGateWait` | `6` | no | Time blocked waiting for a gate answer. |
| `OperationToolExecution` | `7` | no | Approved tool execution only. |
| `OperationJournalAppend` | `8` | no | One bounded durable record append. |

`Operation.Valid()` recognizes only values 1 through 8. `Operation.Guardable()` is the capability check used by `ValidateSet`; an `Around` observer may target any valid operation, while a `Guard` may target only the four `yes` rows.

## Call shape

`hook.Call` is the immutable start snapshot:

| Field | Type | Meaning |
| --- | --- | --- |
| `Operation` | `hook.Operation` | Selects the operation and the one legal payload pointer. |
| `StartedAt` | `time.Time` | Runtime-owned start time. |
| `Coordinates` | `identity.Coordinates` | Session, loop, turn, and step location. |
| `AgentName` | `identity.AgentName` | Loop attribution. |
| `Cause` | `identity.Cause` | Direct causal edge that started this operation. |
| `Turn`, `Step`, `Inference`, `Compaction`, `ToolCall`, `GateWait`, `ToolExecution`, `JournalAppend` | pointers | Exactly one is non-nil and must match `Operation`. |

`ValidateCall` returns `*hook.CallError` with `CallUnknownOperation` or `CallInvalidPayload`. The runner clones the call before passing it to each callback. It also clones the `Call` embedded in `hook.Result`; `Result.Err` is the trusted in-process error and is intentionally not deep-cloned.

## Payloads

The operation payloads expose these exact fields:

| Payload | Fields |
| --- | --- |
| `TurnData` | `Index event.TurnIndex`, `Input *content.UserMessage` |
| `StepData` | `Index hook.StepIndex` |
| `InferenceData` | `Request *inference.Request`, `AIMessage *content.AIMessage`, `StreamResult *stream.StreamResult` |
| `CompactionData` | `AttemptID event.CompactAttemptID`, `Input *loop.CompactionInput`, `Output *loop.CompactionOutput` |
| `ToolCallData` | `ToolExecutionID uuid.UUID`, `ToolUseID string`, `ToolName string`, `Summary string`, `ArgsJSON json.RawMessage`, `PermissionEffect event.PermissionDecisionEffect`, `PermissionReason string`, `Result *tool.ToolResult`, `ResultPreview string`, `IsError bool` |
| `GateWaitData` | `GateID gate.ID`, `Kind gate.Kind`, `Resolver gate.ResolverKind`, `Blocks gate.Blocks`, `Effect gate.Effect`, `Answer *gate.Answer` |
| `ToolExecutionData` | `ToolExecutionID uuid.UUID`, `ToolUseID string`, `ToolName string`, `ArgsJSON json.RawMessage`, `Result *tool.ToolResult`, `ResultPreview string`, `IsError bool` |
| `JournalAppendData` | `Family hook.RecordFamily`, `RecordID string` |

`RecordFamily` is closed: `RecordEvent`, `RecordCommand`, `RecordGatePrepared`, `RecordFence`, and `RecordCommandApplication` (the private prefix that maps a Host-admitted public command ID to its runtime command ID and lease epoch). The journal hook sees the family and bounded record identity, not serialized bytes. The runtime uses `JournalAppend` to attach durable append work to the active operation's causal context.

## Outcomes

`hook.Outcome` is closed and starts at one: `OutcomeCompleted`, `OutcomeDenied`, `OutcomeFailed`, and `OutcomeCanceled`. The runtime supplies a valid outcome in `hook.Result.Outcome`; `OutcomeDenied` is the terminal value for a guard refusal. A finish callback must treat `Result.Err` as trusted process-local data and redact or classify it before crossing a logging, telemetry, or network boundary.

This is a compile-realistic observer that records only bounded fields:

```go
package main

import (
	"context"
	"time"

	"github.com/looprig/harness/pkg/hook"
)

func turnObserver() hook.Around {
	return hook.Around{
		Operation: hook.OperationTurn,
		Begin: func(ctx context.Context, call hook.Call) (context.Context, hook.FinishFunc) {
			started := call.StartedAt
			return ctx, func(result hook.Result) {
				_ = started
				_ = result.Outcome.Valid()
				_ = time.Since(result.EndedAt)
			}
		},
	}
}
```

See the public definitions in [`pkg/hook/hook.go`](https://github.com/looprig/harness/blob/main/pkg/hook/hook.go) and [`pkg/hook/data.go`](https://github.com/looprig/harness/blob/main/pkg/hook/data.go), with operation nesting exercised by [`pkg/rig/hooks_integration_test.go`](https://github.com/looprig/harness/blob/main/pkg/rig/hooks_integration_test.go).

## Source and proof

- [`hook` operation and callback declarations](https://github.com/looprig/harness/blob/main/pkg/hook/hook.go)
- [`hook payload data`](https://github.com/looprig/harness/blob/main/pkg/hook/data.go)
- [`operation nesting tests`](https://github.com/looprig/harness/blob/main/pkg/rig/hooks_integration_test.go)
