package main

import (
	"testing"
)

func TestTheScriptedAgentFinishesItsTurn(t *testing.T) {
	t.Setenv("OPENROUTER_API_KEY", "") // force the scripted model
	if err := run(); err != nil {
		t.Fatal(err)
	}
}
