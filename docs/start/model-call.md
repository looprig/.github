---
id: start/model-call
title: Connect a model with Inference
description: Select an OpenAI, Anthropic, or local model, build its inference client, construct provider-neutral messages, and invoke it from the coding assistant.
audience: developer
section: start
order: 3
publication: released
proofs:
  choose-a-model-boundary: [release-github-com-looprig-inference, release-github-com-looprig-llm]
  construct-the-client: [release-github-com-looprig-llm]
  send-the-first-message: [release-github-com-looprig-core, release-github-com-looprig-inference]
  handle-the-response: [release-github-com-looprig-core, release-github-com-looprig-inference]
  runnable-checkpoint: [release-github-com-looprig-core, release-github-com-looprig-inference]
---

# Connect a model with Inference

Inference gives the coding assistant one provider-neutral `Client` interface. LLM constructs concrete clients for OpenAI, Anthropic, Ollama, and other providers. The selected `model.Model` records the provider, API format, base URL, model name, and capabilities used to validate requests.

## Choose a model boundary

Create `model.go`. Keep the model and client together so they cannot drift:

```go
package main

import (
	"fmt"
	"os"

	"github.com/looprig/inference"
	"github.com/looprig/inference/auth"
	"github.com/looprig/inference/model"
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
)

func openAI() (inference.Client, model.Model, error) {
	selected := model.CustomModel(
		model.ProviderName(llm.ProviderOpenAI),
		model.APIFormatOpenAIResponses,
		"https://api.openai.com/v1",
		os.Getenv("LOOPRIG_MODEL"),
		model.WithTools(),
	)
	client, err := auto.New(selected, auth.APIKey(os.Getenv("OPENAI_API_KEY")))
	if err != nil {
		return nil, model.Model{}, fmt.Errorf("create OpenAI client: %w", err)
	}
	return client, selected, nil
}
```

For Anthropic, select `llm.ProviderAnthropic`, `model.APIFormatAnthropic`, `https://api.anthropic.com/v1`, and `ANTHROPIC_API_KEY`. For a local model, select the local provider and its reachable base URL. Local does not mean embedded: the provider process still needs to be running.

## Construct the client

`auto.New` accepts an explicit credential. It does not silently discover provider credentials. Keep secrets in environment variables or your application secret store, and never include them in `model.Model`, messages, logs, or source code.

The model name is provider-owned, so set it explicitly when running:

```sh
# Choose a model name supported by your account and provider.
export LOOPRIG_MODEL="your-model-name"
export OPENAI_API_KEY="your-api-key"
```

See [models and capabilities](/docs/guides/inference/models/), [secrets](/docs/guides/inference/secrets/), and [provider details](/docs/guides/inference/providers/) before adding another provider or API format.

## Send the first message

Add this function to `model.go`:

```go
func askOnce(ctx context.Context, client inference.Client, selected model.Model, question string) (*inference.Response, error) {
	request := inference.Request{
		Model:  selected,
		System: "You are a concise coding assistant. State uncertainty clearly.",
		Messages: content.AgenticMessages{
			&content.UserMessage{Message: content.Message{
				Role: content.RoleUser,
				Blocks: []content.Block{
					// TextBlock is provider-neutral. The selected codec owns wire encoding.
					&content.TextBlock{Text: question},
				},
			}},
		},
	}
	return client.Invoke(ctx, request)
}
```

The imports for this function are `context`, `github.com/looprig/core/content`, and the Inference packages already used above. `content.UserMessage` is part of the conversation contract. Tool calls, thinking, images, documents, and tool results are represented as other typed blocks and messages.

## Handle the response

Do not assume the first block is text. Traverse the assistant message and select the blocks your interface supports:

```go
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

Use [content blocks](/docs/guides/inference/content-blocks/) and [message construction](/docs/guides/inference/messages/construct/) for the full type set. Use [streaming](/docs/guides/inference/streaming/) when the interface should render partial output.

## Runnable checkpoint

The [stage 1 Inference source](https://github.com/looprig/.github/blob/main/examples/go/progressive/stage01_inference/main.go) constructs the same `inference.Request` and asserts the returned assistant text. Its scripted client makes the checkpoint deterministic; swapping the client does not change the request contract.

Continue to [run the agent with Harness](/docs/start/first-run/).
