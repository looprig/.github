package main

import (
	"bytes"
	"context"
	"testing"
	"time"
)

func TestRun(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var output bytes.Buffer
	if err := run(ctx, &output); err != nil {
		t.Fatal(err)
	}
	if got, want := output.String(), "ready\n"; got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}
