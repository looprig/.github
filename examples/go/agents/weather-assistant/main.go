package main

import (
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/event"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/identity"
	"github.com/looprig/harness/pkg/loop"
	"github.com/looprig/harness/pkg/rig"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/tool"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/inference/stream"
	"github.com/looprig/storage/memstore"
	"github.com/looprig/tools/skill"
)

//go:embed skills/*/SKILL.md
var skillFiles embed.FS

const assistantName identity.AgentName = "weather-assistant"

type weather struct {
	City       string `json:"city"`
	Celsius    int    `json:"celsius"`
	Conditions string `json:"conditions"`
}

var forecasts = map[string]weather{
	"boston":  {City: "Boston", Celsius: 12, Conditions: "light rain"},
	"miami":   {City: "Miami", Celsius: 28, Conditions: "sunny"},
	"seattle": {City: "Seattle", Celsius: 10, Conditions: "overcast"},
}

func lookupWeather(city string) (weather, error) {
	forecast, ok := forecasts[strings.ToLower(strings.TrimSpace(city))]
	if !ok {
		return weather{}, fmt.Errorf("unknown city %q; available cities: Boston, Miami, Seattle", city)
	}
	return forecast, nil
}

type weatherTool struct{}

func (weatherTool) Info(context.Context) (*tool.ToolInfo, error) {
	return &tool.ToolInfo{
		Name:   "weather.lookup",
		Desc:   "Return the current deterministic forecast for a supported city.",
		Schema: json.RawMessage(`{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}`),
	}, nil
}

func (weatherTool) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error) {
	var args struct {
		City string `json:"city"`
	}
	if err := json.Unmarshal([]byte(argsJSON), &args); err != nil || strings.TrimSpace(args.City) == "" {
		return tool.Request{}, nil, errors.New("city must be a non-empty string")
	}
	forecast, err := lookupWeather(args.City)
	if err != nil {
		return tool.Request{}, nil, err
	}
	data, err := json.Marshal(forecast)
	if err != nil {
		return tool.Request{}, nil, err
	}
	return tool.Request{
		ToolName: "weather.lookup",
		Summary:  "Look up weather for " + forecast.City,
	}, tool.TokenArtifact{Token: string(data)}, nil
}

func (weatherTool) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error) {
	prepared, ok := loop.PreparedCallFromContext(ctx)
	if !ok {
		return tool.TextResult("error: weather.lookup requires prepared arguments"), nil
	}
	artifact, ok := prepared.Artifact.(tool.TokenArtifact)
	if !ok || artifact.Token == "" {
		return tool.TextResult("error: weather.lookup has no prepared forecast"), nil
	}
	return tool.TextResult(artifact.Token), nil
}

// allowDemoTools is deliberately local to this example. Production applications
// should bind Harness gates to their own access policy instead of approving every
// request.
type allowDemoTools struct{}

func (allowDemoTools) Authorize(context.Context, tool.Request) (gate.Resolution, error) {
	return gate.Resolution{Approved: true}, nil
}

type scriptedModel struct {
	mu   sync.Mutex
	step int
}

func (*scriptedModel) Invoke(context.Context, inference.Request) (*inference.Response, error) {
	return nil, errors.New("weather assistant uses streaming")
}

func (m *scriptedModel) Stream(_ context.Context, request inference.Request) (*stream.StreamReader[content.Chunk], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.step++
	var chunks []content.Chunk
	finish := stream.FinishReasonToolUse
	switch m.step {
	case 1:
		if !requestHasText(request, "umbrella in Boston") {
			return nil, errors.New("script expected the user's Boston question")
		}
		chunks = []content.Chunk{&content.ToolUseChunk{Index: 0, ID: "skill-1", Name: "Skill", InputJSON: `{"name":"weather-briefing"}`}}
	case 2:
		if !requestHasText(request, "Do not invent measurements") {
			return nil, errors.New("script expected the loaded weather skill")
		}
		chunks = []content.Chunk{&content.ToolUseChunk{Index: 0, ID: "weather-1", Name: "weather.lookup", InputJSON: `{"city":"Boston"}`}}
	case 3:
		if !requestHasText(request, `"celsius":12`) {
			return nil, errors.New("script expected the weather tool result")
		}
		finish = stream.FinishReasonStop
		chunks = []content.Chunk{&content.TextChunk{Text: "Boston: 12°C with light rain. Bring an umbrella."}}
	default:
		return nil, errors.New("weather script exhausted")
	}
	index := 0
	return stream.NewStreamReaderWithResult(func() (content.Chunk, error) {
		if index == len(chunks) {
			return nil, io.EOF
		}
		chunk := chunks[index]
		index++
		return chunk, nil
	}, nil, func() (stream.StreamResult, bool, error) {
		return stream.StreamResult{FinishReason: finish}, true, nil
	}), nil
}

func requestHasText(request inference.Request, needle string) bool {
	for _, message := range request.Messages {
		var blocks []content.Block
		switch value := message.(type) {
		case *content.UserMessage:
			blocks = value.Blocks
		case *content.AIMessage:
			blocks = value.Blocks
		case *content.ToolResultMessage:
			blocks = value.Blocks
		}
		if blocksHaveText(blocks, needle) {
			return true
		}
	}
	return false
}

func blocksHaveText(blocks []content.Block, needle string) bool {
	for _, block := range blocks {
		switch value := block.(type) {
		case *content.TextBlock:
			if strings.Contains(value.Text, needle) {
				return true
			}
		case *content.ToolResultBlock:
			if blocksHaveText(value.Content, needle) {
				return true
			}
		}
	}
	return false
}

func run(ctx context.Context, output io.Writer, question string) error {
	loader := skill.NewEmbeddedSkillLoader(skillFiles, map[identity.AgentName]map[string]struct{}{
		assistantName: {"weather-briefing": {}},
	})
	skillDefinition := tool.NewDefinition("Skill", 0, func(context.Context, tool.Bindings) ([]tool.InvokableTool, error) {
		return []tool.InvokableTool{skill.NewSkill(loader, assistantName)}, nil
	})
	weatherDefinition := tool.NewDefinition("weather.lookup", 0, func(context.Context, tool.Bindings) ([]tool.InvokableTool, error) {
		return []tool.InvokableTool{weatherTool{}}, nil
	})

	assistant, err := loop.Define(
		loop.WithName(assistantName),
		loop.WithInference(&scriptedModel{}, model.CustomModel("scripted", model.APIFormatOpenAI, "http://localhost", "weather-script")),
		loop.WithSystem("Use the Skill tool to load weather-briefing, then call weather.lookup before answering."),
		loop.WithTools(skillDefinition, weatherDefinition),
		loop.WithAccessGate(allowDemoTools{}),
		loop.WithPolicyRevision("weather-example-v1"),
	)
	if err != nil {
		return fmt.Errorf("define assistant: %w", err)
	}
	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return fmt.Errorf("open session store: %w", err)
	}
	runtime, err := rig.Define(rig.WithLoops(assistant), rig.WithPrimers(string(assistantName)), rig.WithSessionStore(store))
	if err != nil {
		return fmt.Errorf("define rig: %w", err)
	}
	live, err := runtime.NewSession(ctx)
	if err != nil {
		return fmt.Errorf("new session: %w", err)
	}
	defer live.Shutdown(context.Background())

	events, err := live.SubscribeEvents(event.EventFilter{Enduring: event.LoopScope{All: true}})
	if err != nil {
		return fmt.Errorf("subscribe: %w", err)
	}
	defer events.Close()
	if _, err := fmt.Fprintf(output, "You: %s\n", question); err != nil {
		return err
	}
	if _, err := live.Submit(ctx, []content.Block{&content.TextBlock{Text: question}}); err != nil {
		return fmt.Errorf("submit: %w", err)
	}
	for delivery := range events.Events() {
		if done, ok := delivery.Event.(event.TurnDone); ok {
			if len(done.Message.Blocks) != 1 {
				return errors.New("assistant returned an unexpected message shape")
			}
			text, ok := done.Message.Blocks[0].(*content.TextBlock)
			if !ok {
				return errors.New("assistant did not return text")
			}
			_, err := fmt.Fprintf(output, "Assistant: %s\n", text.Text)
			return err
		}
	}
	return fmt.Errorf("events closed before TurnDone: %w", events.Err())
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := run(ctx, os.Stdout, "Will I need an umbrella in Boston?"); err != nil {
		panic(err)
	}
}
