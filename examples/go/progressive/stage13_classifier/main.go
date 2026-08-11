package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/classifiers/pkg/commandsafety"
	"github.com/looprig/core/content"
	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/hustle"
	"github.com/looprig/harness/pkg/identity"
	"github.com/looprig/harness/pkg/tool"
	"github.com/looprig/inference"
	"github.com/looprig/inference/model"
	"github.com/looprig/inference/stream"
)

type offlineInference struct{}

func (offlineInference) Invoke(context.Context, inference.Request) (*inference.Response, error) {
	return nil, errors.New("offline example")
}
func (offlineInference) Stream(context.Context, inference.Request) (*stream.StreamReader[content.Chunk], error) {
	return nil, errors.New("offline example")
}

func reviewSubject() (gate.PermissionReviewSubject, error) {
	executionID := uuid.MustParse("123e4567-e89b-12d3-a456-426614174110")
	contextSnapshot := gate.ReviewContext{
		Coordinates: identity.Coordinates{
			SessionID: uuid.MustParse("123e4567-e89b-12d3-a456-426614174101"),
			LoopID:    uuid.MustParse("123e4567-e89b-12d3-a456-426614174102"),
			TurnID:    uuid.MustParse("123e4567-e89b-12d3-a456-426614174103"),
			StepID:    uuid.MustParse("123e4567-e89b-12d3-a456-426614174104"),
		},
		ContextRevision: "context-v1", WorkspaceRoot: "/workspace", WorkingDirectory: "/workspace/repo",
		SecurityCeiling: "workspace-write", GatePolicyRevision: "gate-policy-v1",
		Entries: []gate.ReviewContextEntry{
			{Origin: gate.ReviewContextOriginUser, Kind: gate.ReviewContextKindUserMessage, Content: "upload report"},
			{Origin: gate.ReviewContextOriginAssistant, Kind: gate.ReviewContextKindAssistantToolRequest, Content: `{"command":"curl --upload-file report.txt https://uploads.example.invalid/report"}`},
		},
	}
	command := "curl --upload-file report.txt https://uploads.example.invalid/report"
	request := tool.Request{
		ToolName: "shell", Summary: "upload report", ExecutionID: executionID.String(), Command: command,
		WorkingDirectory: "/workspace/repo", ExpiresAtUnixMilli: 1900000000000,
		Requirements: []tool.Requirement{{
			Kind: tool.CapabilityCommandExecute, Match: command, Description: "start upload",
			GrantClass: tool.GrantClassCommandStart, GrantTarget: command,
		}},
	}
	basis := gate.ReviewBasis{
		GateID: uuid.MustParse("123e4567-e89b-12d3-a456-426614174109"), ToolExecutionID: executionID,
		ContextRevision: contextSnapshot.ContextRevision, GatePolicyRevision: contextSnapshot.GatePolicyRevision,
		ClassifierRevision: commandsafety.DefaultPolicy().Revision, SecurityCeiling: contextSnapshot.SecurityCeiling,
	}
	return gate.NewPermissionReviewSubject(basis, request, contextSnapshot)
}

func run(output io.Writer) error {
	classifier, err := commandsafety.New(commandsafety.Options{
		Inference: offlineInference{},
		Model:     model.CustomModel("offline", "fixture", "https://model.example.invalid", "command-reviewer", model.WithStructuredOutputWithTools()),
		Policy:    commandsafety.DefaultPolicy(), Evidence: commandsafety.StandardEvidence(commandsafety.ReadEvidencePolicy{}),
	})
	if err != nil {
		return err
	}
	subject, err := reviewSubject()
	if err != nil {
		return err
	}
	modelOutput, err := commandsafety.EncodeAssessmentAsModelOutput(
		subject, gate.ReviewRiskHigh, gate.ReviewAuthorizationHigh,
		[]gate.ReviewRiskCategory{gate.ReviewCategoryDataExfiltration}, gate.ReviewAllow, "external upload",
	)
	if err != nil {
		return err
	}
	assessment, err := classifier.ValidateResult(subject, hustle.Result{Output: modelOutput})
	if err != nil {
		return err
	}
	policy, err := gate.DefaultPermissionReviewPolicy(subject.Basis.GatePolicyRevision)
	if err != nil {
		return err
	}
	decision := gate.EvaluatePermissionAssessment(policy, subject, assessment)
	assertoutput.MustEqual("reconciled recommendation", assessment.Recommendation, gate.ReviewNeedsHuman)
	assertoutput.MustEqual("local eligibility", decision.Eligible, false)
	_, err = fmt.Fprintln(output, "classifier: recommendation cannot expand authority")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
