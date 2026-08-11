package main

import "testing"

func TestRun(t *testing.T) {
	got, err := run()
	if err != nil {
		t.Fatalf("run() error = %v", err)
	}
	want := "alias=primary response=primary upstream=provider-model strict-unknown=true\n"
	if got != want {
		t.Fatalf("run() = %q, want %q", got, want)
	}
}
