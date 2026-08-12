---
id: guides/sandboxing/integration/index
title: Harness Gates and Prepared Tools
description: Connect Tool requirements and Harness gate decisions to sandbox profiles, grants, and pre-spawn enforcement.
audience: developer
section: guides
order: 13
publication: released
proofs:
  the-pre-spawn-decision: [release-github-com-looprig-sandbox]
  prepared-requirement-to-sandbox-process: [release-github-com-looprig-sandbox]
  model-requests-are-adjacent-not-interchangeable: [release-github-com-looprig-sandbox]
  source: [release-github-com-looprig-sandbox]
  proof: [release-github-com-looprig-sandbox]
  integration-fixture: [release-github-com-looprig-sandbox]
  artifact-contract: [release-github-com-looprig-sandbox]
  source-and-proof: [release-github-com-looprig-sandbox]
---

# Harness Gates and Prepared Tools

Sandboxing sits below the Tool and Harness admission layers. The layers answer different questions:

| Layer | Question | Typical artifact |
| --- | --- | --- |
| Tool | What effect does this operation request, and what bindings does it need? | A prepared Tool requirement and sealed `PreparedArtifact`. |
| Harness gate | Is this exact request approved under the session/loop policy? | An approved candidate or denial. |
| Sandbox profile | What is the least authority the executor may ever use? | An immutable `Profile` and fingerprint. |
| Sandbox grant | May this one execution consume a gated command, path, or target? | A single-use executor-bound token. |
| OS backend | What boundary did this host actually enforce? | `Level`, `Guarantees`, and `CompileReport`. |

## The pre-spawn decision

A Tool's requirement is not a process. Harness can render a gate, collect an approval, and pass the approved capability to the consumer-owned runtime. The sandbox then performs its own checks before any OS child is created:

1. validate the command, execution ID, working directory, and grant text;
2. check `Deny`, `Gated`, or `Allow` command access;
3. authenticate the grant and bind it to profile, route, command, and directory;
4. capture or reacquire path identity and authorize network targets;
5. compile the transient backend spec and verify required guarantee bits; and
6. only then call the native spawn or backend-owned launch.

The gate is not a substitute for OS enforcement. An approved Tool call can still fail because the host cannot provide a required guarantee. OS enforcement is not a substitute for a gate either. A `Sandboxed` executor with `Command: Gated` still refuses a command without a grant. This is why [Tools safety and gates](/docs/guides/tools/safety/) and [Harness tool calls and results](/docs/guides/harness/step/tool-calls-and-results/) are useful companion pages.

## Prepared requirement to sandbox process

```go
package example

import (
	"context"
	"fmt"

	"github.com/looprig/sandbox"
)

func admitApprovedCommand(executor *sandbox.Executor, workspace, command string, grants []string) error {
	prepared, err := executor.PrepareProcess(context.Background(), sandbox.ProcessOptions{
		Directory: workspace,
		Command:   command,
		Grants:    grants,
	})
	if err != nil {
		// The Tool/Harness layer can turn ErrGrantRequired or a binding error
		// into a gate result. No child exists on this path.
		return err
	}
	defer prepared.Close()
	fmt.Printf("reserved access=%+v\\n", prepared.EffectiveAccess())
	process, err := prepared.Start(context.Background())
	if err != nil {
		return err
	}
	defer process.Close(context.Background())
	_, err = process.Wait(context.Background())
	return err
}
```

`PreparedProcess` is structurally compatible with Harness's asynchronous process adapter without making the sandbox package import Harness. That keeps the module boundary clear: Harness owns session, gate, event, and restore behavior; sandbox owns native process authority and cleanup. A Tool may report `EffectiveAccess` or `ProcessActivity` to its higher-level workspace coordinator, but it must not claim that a prepared request has run until `Start` succeeds.

## Model requests are adjacent, not interchangeable

The model request can contain tool definitions and later tool-use blocks, but it does not itself carry a host grant. Use the Harness [model request step](/docs/guides/harness/step/model-request/), Inference's [model selection contract](/docs/guides/inference/requests/model-selection/), and Inference's [tool request contract](/docs/guides/inference/requests/tools/) to understand that content. Use this page when the approved tool call crosses into a process or network effect.

## Source

- [Executable policy, gate, and ExecutorSet fixture](https://github.com/looprig/sandbox/blob/main/examples/policy-enforcement/example_test.go)
- [Public asynchronous process aliases](https://github.com/looprig/sandbox/blob/main/sandbox.go)

## Proof

- [Sandbox example artifact contract](https://github.com/looprig/sandbox/blob/main/examples/contract_test.go)
