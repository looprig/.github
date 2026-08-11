package main

import "testing"

func TestRun(t *testing.T) {
	got, err := run()
	if err != nil {
		t.Fatalf("run() error = %v", err)
	}
	want := "eval-report=report-suite@v1 samples=1 pass=1\nqualification score=100 coverage=100% disposition=qualified report=pluto-report/v1 tables=7\n"
	if got != want {
		t.Fatalf("run() = %q, want %q", got, want)
	}
}
