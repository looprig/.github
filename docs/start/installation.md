---
id: start/installation
title: Create the Go project
description: Create the looprig-coding-assistant module, install the modules for the first model call, and see the project layout the rest of the tutorial fills in.
audience: developer
section: start
order: 2
publication: released
proofs:
  prerequisites: [release-github-com-looprig-core]
  create-the-module: [release-github-com-looprig-inference, release-github-com-looprig-llm, release-github-com-looprig-harness]
  project-layout: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-core, release-github-com-looprig-inference]
---

# Create the Go project

Create a normal Go module for the coding assistant. Looprig does not require a generator, a monorepo checkout, or an application framework.

## Prerequisites

- Go 1.26.8 or newer.
- A terminal.
- Optionally, an API key for a hosted model. Every step also runs without one, against a scripted model.

## Create the module

Run these commands in a new directory of your choice:

```sh
mkdir looprig-coding-assistant
cd looprig-coding-assistant
go mod init example.com/looprig-coding-assistant

# The modules for the first model call.
go get github.com/looprig/core@v0.13.1 \
  github.com/looprig/inference@v0.15.0 \
  github.com/looprig/llm@v0.15.1
```

Each later page starts with the `go get` line for the modules it adds. These are the released versions the tutorial is tested against; `@latest` also works, and because Looprig modules are pre-1.0, read the release notes when you move to a newer minor version.

## Project layout

The project grows one file at a time. All files are in package `main` and build into one binary:

```text
looprig-coding-assistant/
├── go.mod
├── go.sum
├── main.go       # flags, the composition root, and cleanup
├── model.go      # model selection and the inference client
├── scripted.go   # the scripted model used when no API key is set
├── ask.go        # one direct model call (page 2 only)
├── agent.go      # the Loop and the Rig
├── turn.go       # submitting a question and printing its events
├── guard.go      # the read tools' own path policy
├── stores.go     # durable session and workspace storage
└── sandbox.go    # the process sandbox and its access gate
```

The split is for readability, not a framework requirement. The [last page](/docs/start/run-cli) joins everything into one `main.go`.

## Runnable checkpoint

The [model-call example](https://github.com/looprig/.github/tree/main/examples/go/start/model-call) is the complete program for the next page. Its [`go.mod`](https://github.com/looprig/.github/blob/main/examples/go/start/model-call/go.mod) is what the commands above produce, plus the indirect requirements `go mod tidy` adds.

Continue to [connect a model with Inference](/docs/start/model-call).
