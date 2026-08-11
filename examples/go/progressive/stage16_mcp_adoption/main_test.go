package main

import (
	"bytes"
	"os"
	"testing"
)

func TestMain(m *testing.M) {
	if os.Getenv(childMode) == "1" {
		serveChild()
		os.Exit(0)
	}
	os.Exit(m.Run())
}

func TestRun(t *testing.T) {
	var output bytes.Buffer
	if err := run(&output); err != nil {
		t.Fatal(err)
	}
	if got, want := output.String(), "source=mcp definitions=1 model-tool=mcp__docs__lookup enabled-after-disable=false\n"; got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}
