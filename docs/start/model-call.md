---
id: start/model-call
title: Connect a model with Inference
description: Build an inference client for OpenAI, Anthropic, a local model, or a credential-free scripted model, then send the coding assistant's first provider-neutral request.
audience: developer
section: start
order: 3
publication: released
proofs:
  choose-a-model-boundary: [release-github-com-looprig-inference, release-github-com-looprig-llm]
  run-without-an-api-key: [release-github-com-looprig-inference]
  send-the-first-message: [release-github-com-looprig-core, release-github-com-looprig-inference]
  run-it: [release-github-com-looprig-inference, release-github-com-looprig-llm]
  runnable-checkpoint: [release-github-com-looprig-core, release-github-com-looprig-inference]
---

# Connect a model with Inference

Inference gives the coding assistant one provider-neutral `inference.Client` interface. LLM constructs concrete clients for OpenAI, Anthropic, Ollama, and other providers. A `model.Model` records the provider, API format, base URL, model name, and capabilities that requests are validated against. It never holds a credential.

## Choose a model boundary

Create `model.go`. It returns the client and its model together, so they cannot drift apart:

<!-- example: examples/go/start/model-call/model.go -->
```go
package main

import (
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/looprig/inference"
	"github.com/looprig/inference/auth"
	"github.com/looprig/inference/inferencetest"
	"github.com/looprig/inference/model"
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
)

// newModel selects the model the coding assistant talks to and builds the
// client that calls it. The model and client are created together so they
// cannot drift apart.
//
// With OPENAI_API_KEY set, it calls OpenAI with the model named by
// LOOPRIG_MODEL. Without a key, it returns the scripted client from
// scripted.go, so the program runs, and can be tested, with no account and
// no network.
func newModel(stderr io.Writer) (inference.Client, model.Model, error) {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		fmt.Fprintln(stderr, "OPENAI_API_KEY is not set: using the scripted model")
		return scriptedClient(), inferencetest.Model(), nil
	}
	// The model name is provider-owned configuration, never a Looprig default.
	name := os.Getenv("LOOPRIG_MODEL")
	if name == "" {
		return nil, model.Model{}, errors.New("set LOOPRIG_MODEL to the OpenAI model to use")
	}
	// model.Model is a secret-free description of what to call and how.
	selected := model.CustomModel(
		model.ProviderName(llm.ProviderOpenAI),
		model.APIFormatOpenAIResponses,
		"https://api.openai.com/v1",
		name,
		model.WithTools(),
	)
	// The client owns the credential. auto.New validates the model and builds
	// the matching provider client; the key is never stored on the model.
	client, err := auto.New(selected, auth.APIKey(apiKey))
	if err != nil {
		return nil, model.Model{}, fmt.Errorf("create OpenAI client: %w", err)
	}
	return client, selected, nil
}
```

`auto.New` takes an explicit credential. It does not discover credentials by itself, so keep keys in environment variables or your secret store, never in `model.Model`, messages, logs, or source code.

To use another provider, change the `model.CustomModel` arguments and the key:

| Provider | Provider name | API format | Base URL | Credential |
| --- | --- | --- | --- | --- |
| OpenAI | `llm.ProviderOpenAI` | `model.APIFormatOpenAIResponses` | `https://api.openai.com/v1` | `OPENAI_API_KEY` |
| Anthropic | `llm.ProviderAnthropic` | `model.APIFormatAnthropic` | `https://api.anthropic.com/v1` | `ANTHROPIC_API_KEY` |
| A local model | the local provider, for example `llm.ProviderOllama` | that server's format | its reachable URL | usually none |

A local model is not embedded: its server must be running. See [models and capabilities](/docs/guides/inference/models), [secrets](/docs/guides/inference/secrets), and [providers](/docs/guides/inference/providers).

## Run without an API key

Create `scripted.go`. `inferencetest.New` returns a scripted `inference.Client` that validates each request like a real client and answers from its script, streaming in chunks the way a provider does. `inferencetest.Model()` is the matching model:

<!-- example: examples/go/start/model-call/scripted.go -->
```go
package main

import (
	"github.com/looprig/inference"
	"github.com/looprig/inference/inferencetest"
)

// scriptedClient stands in for a hosted model. It answers every request with
// the same reply, streamed in small chunks like a real provider.
func scriptedClient() inference.Client {
	return inferencetest.New(
		inferencetest.Text("A Go module is a versioned collection of packages described by go.mod. " +
			"Its path names the module, and its requirements pin the modules it depends on.").Repeat(),
	)
}
```

`Repeat` makes the last reply answer every later call. Later pages script tool calls with `ToolCall`. The same client is what you use in your own tests.

## Send the first message

Create `ask.go`. A request is a model, instructions, and a conversation of typed messages:

<!-- example: examples/go/start/model-call/ask.go -->
```go
package main

import (
	"context"
	"strings"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
)

// askOnce sends one question to the model and returns its complete reply.
func askOnce(ctx context.Context, client inference.Client, selected model.Model, question string) (*inference.Response, error) {
	request := inference.Request{
		Model:  selected,
		System: "You are a concise coding assistant. State uncertainty clearly.",
		Messages: content.AgenticMessages{
			&content.UserMessage{Message: content.Message{
				Role: content.RoleUser,
				Blocks: []content.Block{
					// TextBlock is provider-neutral. The client's codec owns the wire format.
					&content.TextBlock{Text: question},
				},
			}},
		},
	}
	return client.Invoke(ctx, request)
}

// responseText joins the reply's text blocks. A reply can also carry
// reasoning or tool calls, so never assume the first block is text.
func responseText(response *inference.Response) string {
	var output strings.Builder
	for _, block := range response.Message.Blocks {
		if text, ok := block.(*content.TextBlock); ok {
			output.WriteString(text.Text)
		}
	}
	return output.String()
}
```

`content.UserMessage` is part of the provider-neutral conversation contract. Tool calls, reasoning, images, documents, and tool results are other typed blocks and messages; see [content blocks](/docs/guides/inference/content-blocks) and [message construction](/docs/guides/inference/messages/construct). `Client.Invoke` returns the complete reply. Use [streaming](/docs/guides/inference/streaming) when an interface should render partial output; from the next page on, Harness streams for you.

Create `main.go`:

<!-- example: examples/go/start/model-call/main.go -->
```go
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"time"
)

func main() {
	question := flag.String("ask", "What is a Go module?", "question for the coding assistant")
	flag.Parse()

	// Bound the call: a provider that never answers cannot hang the program.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, *question); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, question string) error {
	client, selected, err := newModel(stderr)
	if err != nil {
		return err
	}
	response, err := askOnce(ctx, client, selected, question)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintln(stdout, responseText(response))
	return err
}
```

## Run it

```sh
go run .
```

```text
OPENAI_API_KEY is not set: using the scripted model
A Go module is a versioned collection of packages described by go.mod. Its path names the module, and its requirements pin the modules it depends on.
```

To call OpenAI instead, set a key and a model name that your account can use:

```sh
export OPENAI_API_KEY="your-api-key"
export LOOPRIG_MODEL="your-model-name"
go run . -ask "What is a Go module?"
```

A wrong key fails fast with the provider's typed error, for example `inference: api error 401: invalid_api_key`.

## Runnable checkpoint

The complete program is [`examples/go/start/model-call`](https://github.com/looprig/.github/tree/main/examples/go/start/model-call). Its [test](https://github.com/looprig/.github/blob/main/examples/go/start/model-call/main_test.go) runs the scripted path and checks the answer.

Continue to [run the agent with Harness](/docs/start/first-run).
