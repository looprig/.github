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
