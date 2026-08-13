package main

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/looprig/core/uuid"
)

func TestRunResearchAssistant(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var output bytes.Buffer
	workspace := t.TempDir()
	if err := run(ctx, &output, workspace, "How do Looprig skills limit context?"); err != nil {
		t.Fatal(err)
	}
	want := "Researcher: Skills are loaded on demand and authorized per agent. [1]\n" +
		"Assistant: wrote a cited brief from 1 source.\n" +
		"Saved: research-report.md\n"
	if got := output.String(); got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
	report, err := os.ReadFile(filepath.Join(workspace, "research-report.md"))
	if err != nil {
		t.Fatal(err)
	}
	wantReport := "# Research brief\n\nLooprig skills are loaded only when needed and are authorized against a per-agent allow-set. [1]\n\n## Sources\n\n1. Looprig Tools source, `skill/skill_loader.go`.\n"
	if got := string(report); got != wantReport {
		t.Fatalf("report = %q, want %q", got, wantReport)
	}
}

func TestSearchCorpusReturnsNoResultForUnknownTopic(t *testing.T) {
	if got := searchArticles("gardening"); len(got) != 0 {
		t.Fatalf("searchArticles returned %#v", got)
	}
}

func TestCorpusToolRejectsEmptyQueryDuringPreparation(t *testing.T) {
	_, _, err := (corpusSearch{}).PrepareCall(context.Background(), uuid.MustParse("22222222-2222-4222-8222-222222222222"), `{"query":"  "}`)
	if err == nil {
		t.Fatal("PrepareCall accepted an empty query")
	}
}
