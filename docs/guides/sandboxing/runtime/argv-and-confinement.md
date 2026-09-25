---
id: guides/sandboxing/runtime/argv-and-confinement
title: RunArgv and Confinement
description: Choose direct argv or shell commands and understand the synchronous executor result contract.
audience: developer
section: guides
order: 10
publication: released
proofs:
  direct-argv: [release-github-com-looprig-sandbox]
  shell-commands-are-an-explicit-choice: [release-github-com-looprig-sandbox]
  confinement-is-decided-before-execution: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  command-contract: [release-github-com-looprig-sandbox]
  argv-contract: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# RunArgv and Confinement

`Executor.RunArgv` accepts an already separated argument vector. It does not insert a shell, split words, or expand metacharacters. `Executor.RunCommand` accepts a command string and normalizes it through the platform shell before the compiled backend wraps it. Choose `RunArgv` whenever the caller already has structured arguments.

## Direct argv

```go
package example

import (
	"context"
	"fmt"

	"github.com/looprig/sandbox"
)

func direct(executor *sandbox.Executor, workspace string) error {
	output, exitCode, err := executor.RunArgv(context.Background(), workspace,
		[]string{"printf", "%s\\n", "literal; no shell expansion"})
	if err != nil {
		return err
	}
	// A process that ran and returned 7 is not a Go error.
	fmt.Printf("exit=%d output=%q\\n", exitCode, output)
	return nil
}
```

For a normal exit, including a non-zero exit, the method returns `(output, exitCode, nil)`. A non-nil error means the process did not complete normally: setup failed, the process was killed, context cancellation was observed, output exceeded a limit, or cleanup/proof failed. The exit code is `-1` on those paths, so key off `err`, not just the number.

`RunArgvLimited` takes a positive combined stdout/stderr byte limit. When the process exceeds it, the executor terminates the process, keeps at most the limit, and returns `ErrOutputLimit`. This is a memory boundary, not an authority grant.

## Shell commands are an explicit choice

```go
package example

import (
	"context"
	"fmt"

	"github.com/looprig/sandbox"
)

func shell(executor *sandbox.Executor, workspace string) error {
	// RunCommand is useful when the operation intentionally uses shell syntax.
	output, exitCode, err := executor.RunCommand(
		context.Background(), workspace, "printf '%s\\n' intentional-shell",
	)
	if err != nil {
		return err
	}
	fmt.Println(exitCode, string(output))
	return nil
}
```

The backend receives the normalized argv and applies its own spawn transform. On Unix this is `/bin/sh -c`; Windows resolves and revalidates the system command interpreter rather than trusting a mutable `PATH` spelling. Neither method bypasses command access. `Deny` refuses before spawn and `Gated` requires a valid grant for the grant-aware path.

## Confinement is decided before execution

The executor compiles the effective policy once, then each spawn applies a fresh wrapper/configuration closure. Linux may re-exec the current binary into a stage-2 helper. macOS may prepend `sandbox-exec`. Windows may use a backend-owned launch where the OS authority must be assigned before control returns. The executor still owns the working directory, environment, output, result normalization, and cleanup.

See [platform levels and guarantees](/docs/guides/sandboxing/enforcement/platforms) for what the wrapper can truthfully claim and [prepared processes](/docs/guides/sandboxing/runtime/processes) when output must be streamed instead of collected.

## Source

- [RunCommand, RunArgv, and output limits](https://github.com/looprig/sandbox/blob/v0.9.1/internal/exec/executor.go)
- [Public execution facade](https://github.com/looprig/sandbox/blob/v0.9.1/sandbox.go)

## Proof

- [Portable command and argv tests](https://github.com/looprig/sandbox/blob/v0.9.1/internal/exec/portable_command_test.go)
