package main

import (
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
)

// defineAssistant freezes the coding assistant's definition: its name,
// instructions and model. A Loop is configuration, not a running goroutine.
func defineAssistant(client inference.Client, selected model.Model) (loop.Definition, error) {
	return loop.Define(
		loop.WithName("coding-assistant"),
		loop.WithSystem("You are a concise coding assistant. Never claim a file was read unless a tool returned it."),
		// Harness receives the provider-neutral client and its matching model.
		loop.WithInference(client, selected),
	)
}

// defineRuntime assembles the Rig: the Loops a session may run plus the
// services they share. Here that is only the session store.
func defineRuntime(assistant loop.Definition, sessions *sessionstore.Store) (*rig.Rig, error) {
	return rig.Define(
		rig.WithLoops(assistant),
		// A primer is a Loop a new session may start with.
		rig.WithPrimers("coding-assistant"),
		rig.WithSessionStore(sessions),
	)
}
