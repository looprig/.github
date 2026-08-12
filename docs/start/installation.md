---
id: start/installation
title: Create the Go project
description: Create the looprig-coding-assistant module, install the consumer dependencies, and establish a small project layout for the rest of the tutorial.
audience: developer
section: start
order: 2
publication: released
proofs:
  prerequisites: [release-github-com-looprig-core]
  create-the-module: [release-github-com-looprig-inference, release-github-com-looprig-harness]
  project-layout: [release-github-com-looprig-harness]
  runnable-checkpoint: [release-github-com-looprig-core, release-github-com-looprig-inference]
---

# Create the Go project

Create a normal Go module for the coding assistant. Looprig does not require a generator, monorepo checkout, or a specific application framework.

## Prerequisites

- Go 1.26 or newer
- A terminal
- An API key for a hosted model, or a local model server such as Ollama

You can complete the structural steps with the deterministic example client before choosing a hosted provider.

## Create the module

Run these commands in a new directory of your choice:

```sh
mkdir looprig-coding-assistant
cd looprig-coding-assistant
go mod init example.com/looprig-coding-assistant

# Install only the boundaries used by the first model call.
go get github.com/looprig/core github.com/looprig/inference github.com/looprig/llm
```

As the tutorial adds capabilities, install their modules from the same project directory:

```sh
# Harness supplies the runtime. Tools, Fsstore, and Sandbox remain optional.
go get github.com/looprig/harness github.com/looprig/tools
go get github.com/looprig/fsstore github.com/looprig/storage
go get github.com/looprig/sandbox
```

`go get` resolves compatible module versions into your `go.mod`. Applications can apply their own upgrade and dependency-review policy.

## Project layout

Use a small layout while learning the boundaries:

```text
looprig-coding-assistant/
├── go.mod
├── go.sum
├── main.go          # CLI entry point and sandbox.Init
├── model.go         # Model selection and inference.Client construction
├── agent.go         # Loop, Rig, Session, and event handling
└── workspace/       # Files the tutorial assistant may inspect
```

The file split is for readability, not a framework requirement. All files use package `main` and compile into one application binary.

## Runnable checkpoint

Open the [complete first Inference example](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage01_inference/main.go). It uses a deterministic client so the request and response path runs without credentials. The next page replaces that client boundary with OpenAI, Anthropic, or a local model.

Continue to [connect a model with Inference](/docs/start/model-call/).
