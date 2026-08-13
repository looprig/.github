package main

import (
	"context"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
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
	"github.com/looprig/harness/pkg/session"
	"github.com/looprig/harness/pkg/sessionstore"
	"github.com/looprig/harness/pkg/tool"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/inference/stream"
	"github.com/looprig/storage/memstore"
	"github.com/looprig/tools/skill"
)

//go:embed skills/*/SKILL.md corpus/*.txt
var exampleFiles embed.FS

const (
	primaryName    identity.AgentName = "research-assistant"
	researcherName identity.AgentName = "researcher"
	reportText                        = "# Research brief\n\nLooprig skills are loaded only when needed and are authorized against a per-agent allow-set. [1]\n\n## Sources\n\n1. Looprig Tools source, `skill/skill_loader.go`.\n"
)

type article struct {
	Title  string `json:"title"`
	Source string `json:"source"`
	Text   string `json:"text"`
}

func searchArticles(query string) []article {
	query = strings.ToLower(query)
	if !strings.Contains(query, "skill") && !strings.Contains(query, "context") {
		return nil
	}
	return []article{{
		Title:  "Looprig skill loading",
		Source: "Looprig Tools source, skill/skill_loader.go",
		Text:   "Skills are loaded on demand and authorized against a closed allow-set for one agent.",
	}}
}

type corpusSearch struct{}

func (corpusSearch) Info(context.Context) (*tool.ToolInfo, error) {
	return &tool.ToolInfo{
		Name:   "corpus.search",
		Desc:   "Search the bundled, deterministic article corpus.",
		Schema: json.RawMessage(`{"type":"object","properties":{"query":{"type":"string"}},"required":["query"]}`),
	}, nil
}

func (corpusSearch) PrepareCall(_ context.Context, executionID uuid.UUID, argsJSON string) (tool.Request, tool.PreparedArtifact, error) {
	var args struct {
		Query string `json:"query"`
	}
	if err := json.Unmarshal([]byte(argsJSON), &args); err != nil || strings.TrimSpace(args.Query) == "" {
		return tool.Request{}, nil, errors.New("query must be a non-empty string")
	}
	results, err := json.Marshal(searchArticles(args.Query))
	if err != nil {
		return tool.Request{}, nil, err
	}
	return tool.Request{
		ToolName: "corpus.search",
		Summary:  "Search the bundled article corpus",
	}, tool.TokenArtifact{Token: string(results)}, nil
}

func (corpusSearch) InvokableRun(ctx context.Context, _ string) (*tool.ToolResult, error) {
	prepared, ok := loop.PreparedCallFromContext(ctx)
	if !ok {
		return tool.TextResult("error: corpus.search requires prepared arguments"), nil
	}
	artifact, ok := prepared.Artifact.(tool.TokenArtifact)
	if !ok || artifact.Token == "" {
		return tool.TextResult("error: corpus.search has no prepared result"), nil
	}
	return tool.TextResult(artifact.Token), nil
}

type allowExampleTools struct{}

func (allowExampleTools) Authorize(context.Context, tool.Request) (gate.Resolution, error) {
	return gate.Resolution{Approved: true}, nil
}

type responseStep struct {
	expect string
	chunks []content.Chunk
	finish stream.FinishReason
}

type scriptedModel struct {
	mu    sync.Mutex
	steps []responseStep
}

func (*scriptedModel) Invoke(context.Context, inference.Request) (*inference.Response, error) {
	return nil, errors.New("research assistant uses streaming")
}

func (m *scriptedModel) Stream(_ context.Context, request inference.Request) (*stream.StreamReader[content.Chunk], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if len(m.steps) == 0 {
		return nil, errors.New("research script exhausted")
	}
	step := m.steps[0]
	m.steps = m.steps[1:]
	if !requestHasText(request, step.expect) {
		return nil, fmt.Errorf("script expected request containing %q", step.expect)
	}
	index := 0
	return stream.NewStreamReaderWithResult(func() (content.Chunk, error) {
		if index == len(step.chunks) {
			return nil, io.EOF
		}
		chunk := step.chunks[index]
		index++
		return chunk, nil
	}, nil, func() (stream.StreamResult, bool, error) {
		return stream.StreamResult{FinishReason: step.finish}, true, nil
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

func definition(name identity.AgentName, client inference.Client, options ...loop.Option) (loop.Definition, error) {
	base := []loop.Option{
		loop.WithName(name),
		loop.WithInference(client, model.CustomModel("scripted", model.APIFormatOpenAI, "http://localhost", string(name)+"-script")),
	}
	return loop.Define(append(base, options...)...)
}

func submitAndWait(ctx context.Context, live session.Session, loopID uuid.UUID, prompt string) (string, error) {
	events, err := live.SubscribeEvents(event.EventFilter{Enduring: event.LoopScope{All: true}})
	if err != nil {
		return "", err
	}
	defer events.Close()
	if _, err := live.SubmitToLoop(ctx, loopID, []content.Block{&content.TextBlock{Text: prompt}}); err != nil {
		return "", err
	}
	for delivery := range events.Events() {
		done, ok := delivery.Event.(event.TurnDone)
		if !ok || done.EventHeader().LoopID != loopID {
			continue
		}
		if len(done.Message.Blocks) != 1 {
			return "", errors.New("unexpected assistant message shape")
		}
		text, ok := done.Message.Blocks[0].(*content.TextBlock)
		if !ok {
			return "", errors.New("assistant response is not text")
		}
		return text.Text, nil
	}
	return "", fmt.Errorf("events closed before TurnDone: %w", events.Err())
}

func run(ctx context.Context, output io.Writer, workspace, question string) error {
	loader := skill.NewEmbeddedSkillLoader(exampleFiles, map[identity.AgentName]map[string]struct{}{
		researcherName: {"research-citations": {}},
	})
	skillDefinition := tool.NewDefinition("Skill", 0, func(context.Context, tool.Bindings) ([]tool.InvokableTool, error) {
		return []tool.InvokableTool{skill.NewSkill(loader, researcherName)}, nil
	})
	searchDefinition := tool.NewDefinition("corpus.search", 0, func(context.Context, tool.Bindings) ([]tool.InvokableTool, error) {
		return []tool.InvokableTool{corpusSearch{}}, nil
	})
	researchModel := &scriptedModel{steps: []responseStep{
		{expect: "How do Looprig skills", chunks: []content.Chunk{&content.ToolUseChunk{Index: 0, ID: "skill-1", Name: "Skill", InputJSON: `{"name":"research-citations"}`}}, finish: stream.FinishReasonToolUse},
		{expect: "Search the available corpus", chunks: []content.Chunk{&content.ToolUseChunk{Index: 0, ID: "search-1", Name: "corpus.search", InputJSON: `{"query":"Looprig skills context"}`}}, finish: stream.FinishReasonToolUse},
		{expect: "closed allow-set", chunks: []content.Chunk{&content.TextChunk{Text: "Skills are loaded on demand and authorized per agent. [1]"}}, finish: stream.FinishReasonStop},
	}}
	researcher, err := definition(researcherName, researchModel,
		loop.WithSystem("Load research-citations, search the corpus, and return a cited evidence note."),
		loop.WithTools(skillDefinition, searchDefinition),
		loop.WithAccessGate(allowExampleTools{}),
		loop.WithPolicyRevision("research-worker-v1"),
	)
	if err != nil {
		return err
	}
	primaryModel := &scriptedModel{steps: []responseStep{{
		expect: "Skills are loaded on demand",
		chunks: []content.Chunk{&content.TextChunk{Text: reportText}},
		finish: stream.FinishReasonStop,
	}}}
	primary, err := definition(primaryName, primaryModel, loop.WithDelegates(researcherName))
	if err != nil {
		return err
	}

	store, err := sessionstore.Open(memstore.New())
	if err != nil {
		return err
	}
	runtime, err := rig.Define(
		rig.WithLoops(primary, researcher),
		rig.WithPrimers(string(primaryName)),
		rig.WithSessionStore(store),
		rig.WithDelegationLimits(rig.DelegationLimits{Depth: 2, Quota: 2}),
	)
	if err != nil {
		return err
	}
	live, err := runtime.NewSession(ctx)
	if err != nil {
		return err
	}
	defer live.Shutdown(context.Background())

	spawner := live.(interface {
		NewLoop(loop.Provenance, loop.Definition) (uuid.UUID, error)
	})
	childID, err := spawner.NewLoop(loop.Provenance{LoopID: live.ActiveLoop().ID()}, researcher)
	if err != nil {
		return fmt.Errorf("start researcher: %w", err)
	}
	evidence, err := submitAndWait(ctx, live, childID, question)
	if err != nil {
		return fmt.Errorf("research: %w", err)
	}
	if _, err := fmt.Fprintf(output, "Researcher: %s\n", evidence); err != nil {
		return err
	}
	result, err := submitAndWait(ctx, live, live.ActiveLoop().ID(), "Write a brief using this evidence:\n"+evidence)
	if err != nil {
		return fmt.Errorf("draft: %w", err)
	}
	if err := os.MkdirAll(workspace, 0o755); err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(workspace, "research-report.md"), []byte(result), 0o600); err != nil {
		return err
	}
	_, err = fmt.Fprintln(output, "Assistant: wrote a cited brief from 1 source.\nSaved: research-report.md")
	return err
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := run(ctx, os.Stdout, "artifacts", "How do Looprig skills limit context?"); err != nil {
		panic(err)
	}
}
