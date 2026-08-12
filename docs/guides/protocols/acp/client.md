---
id: guides/protocols/acp/client
title: ACP Client
description: Launch and drive a foreign ACP agent with a supervised client, typed sessions, updates, permissions, files, and terminals.
audience: developer
section: guides
order: 11
publication: released
proofs:
  client-owns-the-foreign-process:
    - release-github-com-looprig-acp
  dial-and-initialize:
    - release-github-com-looprig-acp
  one-session-one-prompt-at-a-time:
    - release-github-com-looprig-acp
  client-served-methods:
    - release-github-com-looprig-acp
  source-and-proof:
    - release-github-com-looprig-acp
---

# ACP Client

ACP Client is the host-side path. `acp/client` owns one connection to a foreign agent, receives `session/update` notifications, and exposes a typed `Session` for prompting and cancellation. `acp/transport/stdio` owns the child process. The two packages meet at `protocol.Conn`.

## Client owns the foreign process

`client.New` is lazy: it validates and stores the command, and the first dial starts the connection. `client.Dial` is the convenience path for spawn and initialize in one call. Both use `stdio.Command`, which has an executable path, argument list, complete environment, and optional working directory. There is no shell command string and no ambient environment merge.

```go
package main

import (
	"context"
	"time"

	"github.com/looprig/acp/client"
	"github.com/looprig/acp/transport/stdio"
)

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	// The child receives only the environment explicitly listed here.
	cmd := stdio.Command{Path: "/absolute/path/to/agent", Args: []string{"--stdio"}}
	c, err := client.Dial(ctx, cmd, client.Options{})
	if err != nil {
		panic(err)
	}
	defer c.Close(context.Background())
	// NewSession returns the typed Session used by Prompt, Cancel, and Updates.
	s, err := c.NewSession(ctx, client.NewSessionParams{Cwd: "/workspace"})
	if err != nil {
		panic(err)
	}
	_ = s
}
```

The absolute path and clean working directory checks happen at the process boundary. `Spawn` starts the child in its own process group and reports bounded stderr on abnormal exit. Teardown escalates from interrupt to a grace period and then kills the process group, so descendants do not outlive the connection.

## Dial and initialize

The client handshake is ordered and one-shot per connected child: spawn, build a `protocol.Conn`, register the client-served handlers, call `initialize`, and expose the initialized client. A failed dial closes the transport and returns no usable client. The `ctx` bounds startup only. After `Dial` returns, `Close` owns the client's lifetime.

`client.Options` maps host capabilities to handlers. `FS` enables filesystem reads and writes, `Terminal` enables terminal operations, and `Permissions` enables permission requests. `ClientInfo` is sent in `initialize`; `LoadTimeout` bounds the response wait for `session/load`.

## One session, one prompt at a time

`NewSession`, `LoadSession`, and `ResumeSession` return a `*client.Session`. `Session.Prompt` sends `session/prompt` and waits for the terminal response while updates arrive on `Session.Updates()`. The session rejects a second in-flight prompt. `Session.Cancel` sends `session/cancel`; cancellation is represented as a successful `PromptResult` with `protocol.StopReasonCancelled`, not as a transport error.

```go
// Prompt and update consumption are intentionally separate. A caller can
// render progress while Prompt waits for the terminal response.
go func() {
	for update := range session.Updates() {
		_ = update // translate update into the host's event or UI model
	}
}()
result, err := session.Prompt(ctx, []protocol.ContentBlock{
		{Text: &protocol.TextContent{Text: "Inspect the workspace."}},
})
if err != nil {
	panic(err)
}
_ = result.StopReason
```

The `protocol.ContentBlock` construction above is the content boundary. Map model-facing content and tool results through the [Inference content block guide](/docs/guides/inference/content-blocks/) and connect resulting calls to [Harness steps](/docs/guides/harness/step/).

## Client-served methods

The foreign agent can call methods served by the client. `Permissions` answers `session/request_permission`, `FS` answers `fs/read_text_file` and `fs/write_text_file`, and `Terminal` answers `terminal/create`, `terminal/output`, `terminal/wait_for_exit`, `terminal/kill`, and `terminal/release`. Dispatch validates session IDs, paths, and terminal IDs before invoking the injected handler.

That validation is part of the host boundary. The agent is a peer process, so an inbound path or terminal ID is untrusted even when the client created the session. Permission identity and gate behavior belong in the host's [Tools permission model](/docs/guides/tools/safety/permissions/) and [Harness gates](/docs/guides/harness/gates/).

## Source and proof

The contract is in the [client runtime](https://github.com/looprig/acp/tree/main/client), [client session code](https://github.com/looprig/acp/blob/main/client/session.go), [dispatch handlers](https://github.com/looprig/acp/blob/main/client/dispatch.go), [prompt lifecycle](https://github.com/looprig/acp/blob/main/client/prompt.go), and [integration tests](https://github.com/looprig/acp/blob/main/client/client_integration_test.go).
