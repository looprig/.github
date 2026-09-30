package main

import (
	"bytes"
	"context"
	"strings"
	"testing"
	"time"
)

func TestAskOnceWithTheScriptedModel(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "") // force the scripted model
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var stdout, stderr bytes.Buffer
	if err := run(ctx, &stdout, &stderr, "What is a Go module?"); err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(stdout.String(), "versioned collection of packages") {
		t.Fatalf("unexpected answer: %q", stdout.String())
	}
	if !strings.Contains(stderr.String(), "using the scripted model") {
		t.Fatalf("the scripted model was not announced: %q", stderr.String())
	}
}

func TestAHostedModelNeedsAModelName(t *testing.T) {
	t.Setenv("OPENAI_API_KEY", "not-a-real-key")
	t.Setenv("LOOPRIG_MODEL", "")
	if _, _, err := newModel(&bytes.Buffer{}); err == nil || !strings.Contains(err.Error(), "LOOPRIG_MODEL") {
		t.Fatalf("expected a LOOPRIG_MODEL error, got %v", err)
	}
}
