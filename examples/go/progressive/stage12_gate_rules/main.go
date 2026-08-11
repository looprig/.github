package main

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/looprig/.github/examples/go/progressive/internal/assertoutput"
	"github.com/looprig/harness/pkg/gate"
	"github.com/looprig/harness/pkg/tool"
)

type gatedAccess struct{}

func (gatedAccess) AccessVersion() uint16                   { return gate.CurrentAccessVersion }
func (gatedAccess) AccessFor(string, string) (uint8, error) { return gate.AccessGated, nil }

type conflictingRules struct{ allowChecks int }

func (*conflictingRules) MatchesDeny(context.Context, tool.Requirement) (bool, error) {
	return true, nil
}
func (m *conflictingRules) MatchesAllow(context.Context, tool.Requirement) (bool, error) {
	m.allowChecks++
	return true, nil
}

func run(output io.Writer) error {
	rules := &conflictingRules{}
	evaluator, err := gate.NewHeadlessEvaluator(
		[]gate.AccessBinding{{Kind: "filesystem.read", Source: gatedAccess{}}}, rules, nil,
	)
	if err != nil {
		return err
	}
	resolution, err := evaluator.Authorize(context.Background(), tool.Request{
		ToolName:     "Read",
		Requirements: []tool.Requirement{{Kind: "filesystem.read", Match: "README.md", Description: "read README.md"}},
	})
	if err != nil {
		return err
	}
	assertoutput.MustEqual("approved", resolution.Approved, false)
	assertoutput.MustEqual("allow checks after deny", rules.allowChecks, 0)
	_, err = fmt.Fprintln(output, "gate: deny rule wins before allow")
	return err
}

func main() { assertoutput.MustSucceed(run(os.Stdout)) }
