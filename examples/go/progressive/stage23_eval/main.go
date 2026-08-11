package main

import (
	"context"
	"fmt"

	"github.com/looprig/core/content"
	"github.com/looprig/eval"
	"github.com/looprig/eval/exact"
	evalreportjson "github.com/looprig/eval/reportjson"
	"github.com/looprig/pluto/pkg/codepacks/capability"
	"github.com/looprig/pluto/pkg/profile"
	"github.com/looprig/pluto/pkg/qual"
	fixtarget "github.com/looprig/pluto/pkg/qual/target"
	plutoreportjson "github.com/looprig/pluto/pkg/reportjson"
	plutorun "github.com/looprig/pluto/pkg/run"
)

func main() {
	output, err := run()
	if err != nil {
		panic(err)
	}
	fmt.Print(output)
}

func run() (string, error) {
	evalReport, err := eval.Run(
		context.Background(),
		eval.RunConfig{},
		eval.Suite{
			Name:     "report-suite",
			Revision: "v1",
			Scenarios: []eval.Scenario{{
				ID:       "ready-check",
				Name:     "report-target",
				Revision: "v1",
				Input:    content.AgenticMessages{userText("Are you ready?")},
			}},
		},
		reportTarget{},
		exact.RequiredText("ready"),
	)
	if err != nil {
		return "", err
	}
	evalWire, err := evalreportjson.Encode(evalReport)
	if err != nil {
		return "", err
	}
	evalDecoded, err := evalreportjson.Decode(evalWire)
	if err != nil {
		return "", err
	}

	card, err := plutorun.Execute(context.Background(), plutorun.Spec{
		Manifest: candidateManifest("candidate-v2"),
		Packs:    []qual.Pack{capability.V1()},
		Target:   fixtarget.NewScripted("candidate-v2", conformingScripts()),
	})
	if err != nil {
		return "", err
	}
	minimumScore := 90.0
	minimumCoverage := 1.0
	decision, err := profile.Evaluate(card.Scorecard, profile.Profile{
		Name:     "production-release",
		Revision: "v1",
		Requirements: []profile.Requirement{{
			Dimension:   "capability",
			MinScore:    &minimumScore,
			MinCoverage: &minimumCoverage,
		}},
	})
	if err != nil {
		return "", err
	}
	dimensions, err := card.Scorecard.Dimensions()
	if err != nil {
		return "", err
	}
	plutoWire, err := plutoreportjson.Encode(card.Scorecard, &decision)
	if err != nil {
		return "", err
	}
	plutoDecoded, err := plutoreportjson.Decode(plutoWire)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf(
		"eval-report=%s samples=%d pass=%d\nqualification score=%.0f coverage=%.0f%% disposition=%s report=%s tables=%d\n",
		evalDecoded.ID,
		evalDecoded.Summary.Samples,
		evalDecoded.Summary.Assessments[eval.StatusPass],
		dimensions[0].Score, dimensions[0].Coverage*100, decision.Disposition,
		plutoDecoded.Version, len(plutoDecoded.Tables),
	), nil
}

type reportTarget struct{}

func (reportTarget) Name() string { return "report-target" }

func (reportTarget) Observe(_ context.Context, scenario eval.Scenario) (eval.Observation, error) {
	return eval.Observation{
		Conversation: content.AgenticMessages{assistantText("ready")},
		Scope:        eval.ScopeCase,
		Subject: eval.Subject{
			ID:       "report-target",
			Kind:     eval.SubjectAgent,
			Name:     scenario.Name,
			Revision: scenario.Revision,
		},
	}, nil
}

func userText(text string) *content.UserMessage {
	return &content.UserMessage{Message: content.Message{
		Role:   content.RoleUser,
		Blocks: []content.Block{&content.TextBlock{Text: text}},
	}}
}

func assistantText(text string) *content.AIMessage {
	return &content.AIMessage{Message: content.Message{
		Role:   content.RoleAssistant,
		Blocks: []content.Block{&content.TextBlock{Text: text}},
	}}
}

func candidateManifest(targetID string) qual.Manifest {
	return qual.Manifest{
		TargetID:      targetID,
		Role:          qual.RoleCandidate,
		Provider:      "fixture",
		Model:         "scripted",
		APIFormat:     "offline",
		BaseURL:       "https://example.invalid/v1",
		Revision:      "fixture-v1",
		EndpointClass: qual.EndpointRemote,
	}
}

func conformingScripts() map[string]fixtarget.Script {
	return map[string]fixtarget.Script{
		"if-001-exact-phrase":      {Reply: "the beacon is lit"},
		"if-002-forbidden-word":    {Reply: "The sky turned amber and rose."},
		"if-003-format-constraint": {Reply: "- apple\n- banana\n- cherry"},
		"if-004-priority-conflict": {Reply: "I will answer in English."},
		"ka-001-capital":           {Reply: "Canberra"},
		"ka-002-arithmetic":        {Reply: "391"},
		"ka-003-unit-conversion":   {Reply: "2500"},
	}
}
