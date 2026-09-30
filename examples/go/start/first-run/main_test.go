package main

import (
	"bytes"
	"context"
	"strings"
	"testing"
	"time"
)

func TestOneTurnWithTheScriptedModel(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	var stdout, stderr bytes.Buffer
	if err := run(ctx, &stdout, &stderr, "What can you do?"); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(stdout.String(), "once you give me tools") {
		t.Fatalf("unexpected answer: %q", stdout.String())
	}
}
