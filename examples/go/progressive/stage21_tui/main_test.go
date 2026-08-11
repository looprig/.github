package main

import "testing"

func TestRun(t *testing.T) {
	got, err := run()
	if err != nil {
		t.Fatalf("run() error = %v", err)
	}
	want := "session=10000000-0000-4000-8000-000000000001 images=true event=active:7 shutdowns=1 runtime-exit=1\n"
	if got != want {
		t.Fatalf("run() = %q, want %q", got, want)
	}
}
