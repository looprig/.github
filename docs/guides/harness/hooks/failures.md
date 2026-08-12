---
id: guides/harness/hooks/failures
title: Failure behavior
description: Understand hook validation, panic handling, and failure propagation.
audience: developer
section: guides
order: 15
publication: released
proofs:
  configuration-errors: [release-github-com-looprig-harness]
  call-errors: [release-github-com-looprig-harness]
  guard-errors: [release-github-com-looprig-harness]
  panic-policy: [release-github-com-looprig-harness]
  denial-classification: [release-github-com-looprig-harness]
  source-and-proof: [release-github-com-looprig-harness]
---

# Failure behavior

## Configuration errors

`hook.ValidateSet` and `hook.Compile` return `*hook.ConfigError`. Its fields are `Kind ConfigErrorKind`, `Operation hook.Operation`, `Index int`, and `Field string`. The closed `ConfigErrorKind` values are `ConfigUnknownOperation`, `ConfigOperationNotGuardable`, `ConfigNilGuard`, `ConfigNilAround`, `ConfigMissingPolicyRevision`, `ConfigUnexpectedPolicyRevision`, `ConfigInvalidPolicyRevision`, and `ConfigInvalidDenial`.

Guards require a non-blank policy revision. Around-only sets must leave the revision empty. A revision may not exceed 128 bytes or contain invalid UTF-8 or control characters. The runner validates before taking ownership of the registration slices, so an invalid set cannot partially install.

## Call errors

`hook.Runner.Start` first validates the call. `*hook.CallError` has `Kind CallErrorKind` and `Operation hook.Operation`; its values are `CallUnknownOperation` and `CallInvalidPayload`. The latter covers zero, multiple, or operation-mismatched payload pointers. No callback runs for an invalid call. `CloneCall` also protects the sealed content variants it copies; an unsupported future conversation or block variant causes `*hook.CloneError` with `CloneUnknownConversation` or `CloneUnknownBlock` rather than silently dropping data.

## Guard errors

`*hook.GuardError` has `Operation`, `Index`, and `Cause`. It wraps the original non-denial guard error, so trusted in-process callers can classify the cause with `errors.As`. A guard failure returns the aggregate finish function, and the runtime should finish it with `OutcomeDenied` for an intentional refusal or `OutcomeFailed` for an internal guard failure. The operation itself is not called after a guard error.

```go
var guardErr *hook.GuardError
if errors.As(err, &guardErr) {
	// guardErr.Operation and guardErr.Index identify the registration;
	// guardErr.Cause is still process-local and must be redacted at export.
}
```

## Panic policy

The runner deliberately separates observer and guard trust boundaries:

| Location | Result | Operation continues? |
| --- | --- | :---: |
| `Around.Begin` panic | Log a bounded callback-index/operation message; skip that observer. | Yes |
| `Around.Begin` returns nil context | Log and keep the previous context. | Yes |
| `Guard.Check` panic | Return `*hook.GuardError` with an internal panic cause. | No |
| `AsDenial` classification panic | Return `*hook.GuardError` with an internal classification cause. | No |
| `FinishFunc` panic | Log and continue remaining finishes and releases. | Already terminal |

Panic values are not copied into errors or logs. This prevents callback-controlled content from crossing the observation boundary and keeps an observer bug from crashing the process. A guard panic fails closed because a policy check that did not complete cannot authorize the operation.

## Denial classification

`hook.Deny(code, reason)` validates a lower-case code of at most 64 bytes using letters, digits, `_`, `.`, and `-`, with the first character a lower-case letter. The reason must be non-blank, valid UTF-8, free of control characters, and at most 1024 bytes. Invalid fields return `*hook.ConfigError{Kind: hook.ConfigInvalidDenial}`.

`hook.AsDenial(err)` uses `errors.As`, revalidates the exported fields, and returns an independent copy. A valid denial returns as `*hook.Denial`; an invalid directly constructed value is treated as an ordinary guard failure. The runner therefore cannot mistake arbitrary callback errors for an intentional user-facing denial.

```go
err := hook.Deny("workspace.read", "the requested read is outside the approved scope")
var denial *hook.Denial
if errors.As(err, &denial) {
	// denial.Code and denial.Reason are bounded and safe for local routing.
}
```

The source contract is [`pkg/hook/errors.go`](https://github.com/looprig/harness/blob/main/pkg/hook/errors.go), with dispatch and panic handling in [`pkg/hook/runner.go`](https://github.com/looprig/harness/blob/main/pkg/hook/runner.go). The runtime error adapter is tested in [`internal/loopruntime/hook_runtime_test.go`](https://github.com/looprig/harness/blob/main/internal/loopruntime/hook_runtime_test.go).

## Source and proof

- [`hook` typed errors](https://github.com/looprig/harness/blob/main/pkg/hook/errors.go)
- [`runner panic and guard handling`](https://github.com/looprig/harness/blob/main/pkg/hook/runner.go)
- [`hook runtime error tests`](https://github.com/looprig/harness/blob/main/internal/loopruntime/hook_runtime_test.go)
