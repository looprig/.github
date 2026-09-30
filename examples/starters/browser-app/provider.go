package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

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
// (Same environment contract as the cli-agent starter.)
func newModel(cfg providerConfig) (inference.Client, model.Model, error) {
	if cfg.Provider == "scripted" {
		return scriptedModel(), inferencetest.Model(model.WithTools(), model.WithThinking()), nil
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

// scriptedModel answers without a provider: it reasons briefly, calls
// current_time, then streams a reply that echoes the user's message. It
// loops forever, so every turn of every session gets the same script.
func scriptedModel() *inferencetest.Client {
	return inferencetest.New(inferencetest.Func(func(req inference.Request) inferencetest.Step {
		if n := len(req.Messages); n > 0 {
			if _, answered := req.Messages[n-1].(*content.ToolResultMessage); answered {
				return inferencetest.Text("(scripted model) I checked the clock. You said: " + inferencetest.LastUserText(req)).
					ChunkSize(4).ChunkDelay(40 * time.Millisecond) // stream visibly
			}
		}
		return inferencetest.Thinking("The user wrote something; let me check the clock first.").ToolCall("current_time", `{}`)
	}).Repeat())
}
