---
id: start/run-cli
title: Run the coding assistant CLI
description: Join the tutorial components in main.go, accept a question and optional session ID, print assistant events, and shut every owned resource down in order.
audience: developer
section: start
order: 9
publication: released
proofs:
  assemble-main: [release-github-com-looprig-harness, release-github-com-looprig-fsstore, release-github-com-looprig-sandbox]
  run-a-new-session: [release-github-com-looprig-harness]
  resume-a-session: [release-github-com-looprig-harness, release-github-com-looprig-fsstore]
  shutdown-order: [release-github-com-looprig-harness, release-github-com-looprig-sandbox]
  runnable-checkpoint: [release-github-com-looprig-harness]
---

# Run the coding assistant CLI

The coding assistant now has a model, Harness runtime, read-only tools, durable sessions, a workspace, and optional confined process execution. Join those pieces in `main.go`; the CLI remains presentation code around a Session.

## Assemble main

```go
func main() {
	// Linux re-exec dispatch must happen before flag parsing or runtime setup.
	sandbox.Init()

	question := flag.String("ask", "Summarize this repository.", "question for the coding assistant")
	resume := flag.String("session", "", "existing session ID to restore")
	data := flag.String("data", "./agent-data", "durable application data")
	flag.Parse()

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	if err := runCLI(ctx, *data, *resume, *question); err != nil {
		log.Fatal(err)
	}
}
```

`runCLI` constructs the client, stores, workspace store, sandbox runner, Loop, and Rig using the functions from the preceding pages. Keep ownership in this composition root so shutdown is visible.

## Run a new session

```sh
# The exact provider variables come from the model page.
export LOOPRIG_MODEL="your-model-name"
export OPENAI_API_KEY="your-api-key"
go run . -ask "Which package owns session restoration?"
```

Print the new session ID before waiting for the terminal event:

```text
session=8c7a3e74-6d4d-4d37-a6b7-1a8a22f9e418
assistant=Session restoration is owned by Harness session runtime and sessionstore.
```

Actual text depends on the selected model and the evidence returned by tools.

## Resume a session

```sh
# Supply the ID printed by the earlier invocation.
go run . -session 8c7a3e74-6d4d-4d37-a6b7-1a8a22f9e418 -ask "What did we inspect previously?"
```

Restoring the Session replays durable state and resumes the same identity. It does not automatically recreate an unpersisted external service or silently accept configuration drift.

## Shutdown order

Use `defer` immediately after each successful acquisition, but understand the intended order:

```go
// Stop accepting work, drain the Session, and close subscriptions first.
defer live.Shutdown(context.Background())
// Then close executor-owned processes and isolated runtime paths.
defer executors.Close()
// Close the underlying durable backend after every Session has stopped.
defer disk.Close()
```

Handle SIGINT and SIGTERM through a context, but use an independent bounded cleanup context when a canceled request context would prevent leases and resources from being released.

## Runnable checkpoint

The [complete Harness quickstart](https://github.com/looprig/.github/blob/main/examples/go/guides/harness-quickstart/main.go) is a runnable CLI-shaped application with a model client, Loop, Rig, Session, subscription, submission, terminal event, and shutdown. Its deterministic model lets the exact-output test run without a provider key. Replace that boundary with `openAI` or your chosen provider to run the coding assistant.

Continue to [choose an interface and extend the agent](/docs/start/next-steps/).
