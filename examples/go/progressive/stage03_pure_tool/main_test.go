package main

import (
	"bytes"
	"testing"
)

func TestRun(t *testing.T) {
	var output bytes.Buffer
	if err := run(&output); err != nil {
		t.Fatal(err)
	}
	if got, want := output.String(), "tool: add(20, 22) = 42\n"; got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}
