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
	if got, want := output.String(), "event: turn done with ready\n"; got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}
