package main

import (
	"bytes"
	"context"
	"strings"
	"testing"
	"time"

	"github.com/looprig/core/uuid"
)

func TestRunWeatherAssistant(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var output bytes.Buffer
	if err := run(ctx, &output, "Will I need an umbrella in Boston?"); err != nil {
		t.Fatal(err)
	}
	want := "You: Will I need an umbrella in Boston?\n" +
		"Assistant: Boston: 12°C with light rain. Bring an umbrella.\n"
	if got := output.String(); got != want {
		t.Fatalf("output = %q, want %q", got, want)
	}
}

func TestWeatherAssistantRejectsUnknownCity(t *testing.T) {
	result, err := lookupWeather("Atlantis")
	if err == nil || !strings.Contains(err.Error(), "available cities") || result.City != "" {
		t.Fatalf("lookupWeather = %#v, %v", result, err)
	}
}

func TestWeatherToolRejectsMalformedArgumentsDuringPreparation(t *testing.T) {
	_, _, err := (weatherTool{}).PrepareCall(context.Background(), uuid.MustParse("11111111-1111-4111-8111-111111111111"), `{"city":7}`)
	if err == nil {
		t.Fatal("PrepareCall accepted a non-string city")
	}
}
