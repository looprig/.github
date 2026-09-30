package main

import (
	"bufio"
	"context"
	"fmt"
	"io"
	"strings"
	"sync"

	"github.com/looprig/harness/pkg/gate"
)

// approveOnTerminal returns the approver the access gate calls while a write
// waits. It prints what the call needs to prompts and reads one answer line
// from answers: y approves this write, a approves it and remembers the answer
// for matching writes in this session while the process runs, and anything
// else, including end of input, denies it. A write never runs unanswered.
func approveOnTerminal(answers io.Reader, prompts io.Writer) gate.Approver {
	var mu sync.Mutex // one question at a time
	lines := bufio.NewScanner(answers)
	return gate.ApproverFunc(func(ctx context.Context, prompt gate.ApprovalPrompt) (gate.ApprovalAction, error) {
		mu.Lock()
		defer mu.Unlock()
		if err := ctx.Err(); err != nil {
			return "", err // an approver error fails the call closed
		}
		fmt.Fprintf(prompts, "%s asks to:\n", prompt.Request.ToolName)
		for _, unmet := range prompt.Unmet {
			fmt.Fprintf(prompts, "  %s\n", unmet.Description)
		}
		fmt.Fprint(prompts, "Allow? [y]es / [a]lways / [N]o: ")
		// Scan blocks until a line or end of input arrives; it does not
		// watch ctx. The cli-agent starter shows a cancellable reader.
		if !lines.Scan() {
			return gate.ApprovalDeny, nil
		}
		switch strings.ToLower(strings.TrimSpace(lines.Text())) {
		case "y", "yes":
			return gate.ApprovalApprove, nil
		case "a", "always":
			return gate.ApprovalApproveAlwaysWorkspace, nil
		}
		return gate.ApprovalDeny, nil
	})
}
