package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/auth"
	"github.com/looprig/inference/inferencetest"
	"github.com/looprig/inference/model"
	"github.com/looprig/llm"
	"github.com/looprig/llm/auto"
)

// Provider selection is read from the environment:
//
//	LOOPRIG_PROVIDER    scripted (default) | openai | anthropic | ollama | llama.cpp | lmstudio
//	                    | any other provider llm's auto.New can build from a model and a
//	                    key (openrouter, groq, google, ...). auto.New refuses bedrock
//	                    (AWS SigV4 credentials) and phala (an attestation policy); use
//	                    bedrock.New or phala.New in newModel instead.
//	LOOPRIG_MODEL       the provider's model name (required unless scripted)
//	LOOPRIG_API_KEY     the provider key (not needed for local providers)
//	LOOPRIG_BASE_URL    optional; an OpenAI-compatible endpoint when LOOPRIG_PROVIDER=openai,
//	                    or a non-default port for ollama / llama.cpp
//	LOOPRIG_API_FORMAT  optional; openai | openai-responses | anthropic | gemini (default:
//	                    anthropic for anthropic, openai otherwise). Set it for a provider
//	                    that does not speak the default: gemini for google,
//	                    openai-responses for azure, anthropic for minimax and
//	                    google-vertex-anthropic.
//	LOOPRIG_CONTEXT_WINDOW  optional; the model's context window in tokens (default 128000)
type providerConfig struct {
	Provider, Model, APIKey, BaseURL, APIFormat string
	ContextWindow                               int
}

func providerFromEnv() (providerConfig, error) {
	cfg := providerConfig{
		Provider:      strings.TrimSpace(os.Getenv("LOOPRIG_PROVIDER")),
		Model:         strings.TrimSpace(os.Getenv("LOOPRIG_MODEL")),
		APIKey:        strings.TrimSpace(os.Getenv("LOOPRIG_API_KEY")),
		BaseURL:       strings.TrimSpace(os.Getenv("LOOPRIG_BASE_URL")),
		APIFormat:     strings.TrimSpace(os.Getenv("LOOPRIG_API_FORMAT")),
		ContextWindow: 128_000,
	}
	if raw := os.Getenv("LOOPRIG_CONTEXT_WINDOW"); raw != "" {
		n, err := strconv.Atoi(raw)
		if err != nil || n <= 0 {
			return cfg, fmt.Errorf("LOOPRIG_CONTEXT_WINDOW must be a positive integer, got %q", raw)
		}
		cfg.ContextWindow = n
	}
	if cfg.Provider == "" {
		cfg.Provider = "scripted"
	}
	return cfg, nil
}

// newModel returns the inference client and model descriptor the agent runs
// on. With no provider configured it returns a scripted, keyless model from
// inference/inferencetest so the starter runs without a key or a network.
func newModel(cfg providerConfig) (inference.Client, model.Model, error) {
	if cfg.Provider == "scripted" {
		return inferencetest.New(demoScript().Repeat()), inferencetest.Model(), nil
	}
	if cfg.Model == "" {
		return nil, model.Model{}, fmt.Errorf("LOOPRIG_MODEL is required for provider %q", cfg.Provider)
	}
	format := model.APIFormat(cfg.APIFormat)
	if format == "" {
		format = model.APIFormatOpenAI
		if cfg.Provider == string(llm.ProviderAnthropic) {
			format = model.APIFormatAnthropic
		}
	}
	// An empty base URL selects the provider's default endpoint (for ollama
	// and llama.cpp that is the usual localhost port).
	selected := model.CustomModel(model.ProviderName(cfg.Provider), format, cfg.BaseURL, cfg.Model,
		model.WithTools(),
		model.WithContextLimits(model.ContextLimits{WindowTokens: content.TokenCount(cfg.ContextWindow)}),
	)
	// auto.New validates the model against llm's provider table and refuses a
	// hosted provider with no key before any network object exists.
	client, err := auto.New(selected, auth.APIKey(cfg.APIKey))
	if err != nil {
		return nil, model.Model{}, fmt.Errorf("provider %q: %w", cfg.Provider, err)
	}
	return client, selected, nil
}

// demoScript is the keyless model. "write NAME TEXT" asks to write TEXT to
// NAME (so you can try the approval prompt); anything else lists the
// workspace with Glob. It then reports what the tool returned. It only
// demonstrates that tools, the access gate and streaming work without a
// provider.
func demoScript() inferencetest.Step {
	return inferencetest.Func(func(req inference.Request) inferencetest.Step {
		if result, ok := lastToolResult(req); ok {
			return inferencetest.Text("Scripted model (set LOOPRIG_PROVIDER for a real one). The tool returned:\n" + result)
		}
		if fields := strings.Fields(inferencetest.LastUserText(req)); len(fields) >= 3 && fields[0] == "write" {
			args, err := json.Marshal(map[string]string{"path": fields[1], "content": strings.Join(fields[2:], " ") + "\n"})
			if err == nil {
				return inferencetest.Text("Writing "+fields[1]+". ").ToolCall("WriteFile", string(args))
			}
		}
		return inferencetest.Text("Listing the workspace. ").ToolCall("Glob", `{"pattern":"*"}`)
	})
}

// lastToolResult returns the text of the request's final message when it is
// a tool result.
func lastToolResult(req inference.Request) (string, bool) {
	if len(req.Messages) == 0 {
		return "", false
	}
	msg, ok := req.Messages[len(req.Messages)-1].(*content.ToolResultMessage)
	if !ok {
		return "", false
	}
	var b strings.Builder
	for _, block := range msg.Blocks {
		if text, ok := block.(*content.TextBlock); ok {
			b.WriteString(text.Text)
		}
	}
	return b.String(), true
}
