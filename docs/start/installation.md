---
id: start/installation
title: Use Inference
description: Construct one provider-neutral request, call an inference client, read the assistant message, and understand where production provider clients enter.
audience: developer
section: start
order: 2
publication: released
proofs:
  invoke:
    - release-github-com-looprig-core
    - release-github-com-looprig-inference
  production:
    - release-github-com-looprig-llm
---

# Use Inference

Inference is the provider-neutral boundary used by the rest of Looprig:

```go
type Client interface {
	Invoke(context.Context, inference.Request) (*inference.Response, error)
	Stream(context.Context, inference.Request) (*stream.StreamReader[content.Chunk], error)
}
```

Install the message and inference contracts:

```sh
go mod init example.com/model-call
go get github.com/looprig/core@v0.5.1 github.com/looprig/inference@v0.9.2
```

## Invoke a client {#invoke}

Construct messages with Core and pass them through `Client.Invoke`:

```go
request := inference.Request{
	Model: selectedModel,
	System: "Answer briefly.",
	Messages: content.AgenticMessages{
		&content.UserMessage{Message: content.Message{
			Role: content.RoleUser,
			Blocks: []content.Block{
				&content.TextBlock{Text: "Say hello."},
			},
		}},
	},
}

response, err := client.Invoke(context.Background(), request)
if err != nil {
	return err
}
text := response.Message.Blocks[0].(*content.TextBlock).Text
fmt.Println(text)
```

Expected output depends on the model. A deterministic test client can return:

```text
Hello from Looprig.
```

## Use a production provider {#production}

Inference does not choose credentials or construct hosted clients. LLM provides OpenAI, Anthropic, Ollama, and other provider adapters that implement `inference.Client`:

```go
selected := model.CustomModel(
	model.ProviderName(llm.ProviderOpenAI),
	model.APIFormatOpenAIResponses,
	"https://api.openai.com/v1",
	"your-model-id",
)
client, err := auto.New(selected, auth.APIKey(os.Getenv("OPENAI_API_KEY")))
```

Call `Invoke` for a complete response or `Stream` for text, thinking, and tool-call chunks. Continue with [Messages and content blocks](/docs/modules/core) or [build an agent with Harness](/docs/start/first-run).
