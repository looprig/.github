---
id: carbon/processes
title: Carbon supervised processes
description: Run commands through Carbon's process tools, follow output, use PTYs where supported, and recover process journals safely.
audience: [operator, developer]
section: carbon
order: 13
publication: released
proofs:
  release:
    - release-github-com-looprig-carbon
  process-tests:
    - release-github-com-looprig-carbon
---

# Carbon supervised processes

Carbon's Bash and process tools do not call an arbitrary shell outside the
session boundary. They translate a request into a prepared sandbox process,
select the executor for the loop, and expose the resulting activity through
the asynchronous process runner.

## Start and follow a process

A process request carries the command, working directory, grants, origin,
execution ID, PTY request, and deadline. Carbon maps the prepared process to
the tools runner and starts it once. Background execution returns a process
identity; use process output with a cursor, process input for data or EOF, and
wait for completion. Multiple process identities can be followed independently.

The process tool exposes terminate and kill separately. Terminate asks the
process to stop; kill is the stronger cleanup action when it does not respond.
The journal records the completion reason and output cursor so a restored
session does not replay already-consumed output as a new action.

## PTY and deadlines

If a caller asks for a PTY, Carbon keeps that request as a PTY where the
platform supports it. On a platform without PTY support, the request is
rejected rather than silently downgraded to a pipe. The process adapter accepts
a deadline in the request mapping, but the current adapter does not enforce
that deadline itself; use the process lifecycle controls and the enclosing
context for cancellation.

## Access mapping

The prepared process carries the effective access posture. Read-only grants,
scoped writes, and broad writes remain distinct as the request crosses the
adapter. A process cannot use `trusted` or `unconfined` authority when the
parent Carbon session is `readonly`.

When a command is gated, review the exact command and workspace. Carbon's
persisted command-family approvals cover only the five named read-only Git
families. A classifier review, when configured, supplies evidence to the gate;
it does not remove the gate's access ceiling.

## Evidence

The mechanical adapter is in
[`internal/app/process_adapter.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/process_adapter.go).
Process tool behavior, PTY handling, background output, and restore journals
are exercised in
[`internal/app/process_tools_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/process_tools_test.go),
[`internal/app/process_integration_test.go`](https://github.com/looprig/carbon/blob/cac0608ae0bd873e35ee793bec5e4a56b02273bd/internal/app/process_integration_test.go),
and the process restore integration tests in the same package.
