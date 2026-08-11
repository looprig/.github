package main

import (
	"bytes"
	"os"
	"testing"

	"github.com/looprig/sandbox"
)

func TestMain(m *testing.M) {
	sandbox.Init()
	os.Exit(m.Run())
}

func TestRun(t *testing.T) {
	var output bytes.Buffer
	if err := run(&output); err != nil {
		t.Fatal(err)
	}
	if got, want := output.String(), "sandbox: confined process exited 0\n"; got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}
