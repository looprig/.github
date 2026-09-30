// Command cli-agent is a starter coding assistant built on Looprig: a harness
// rig with one loop, the standard file tools, an approval prompt for writes,
// and durable sessions you can resume.
//
//	go run .                          # keyless, scripted model
//	LOOPRIG_PROVIDER=anthropic LOOPRIG_MODEL=... LOOPRIG_API_KEY=... go run .
//	go run . --resume <session-id>    # continue a conversation
package main

import (
	"bufio"
	"context"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/looprig/harness/pkg/gate"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "cli-agent:", err)
		os.Exit(1)
	}
}

func run() error {
	root := flag.String("root", ".", "repository the agent works in")
	dataDir := flag.String("data", defaultDataDir(), "directory for durable session state")
	resume := flag.String("resume", "", "session id to resume")
	readOnly := flag.Bool("read-only", false, "give the agent read tools only (no write prompts)")
	prompt := flag.String("p", "", "run one prompt and exit instead of reading stdin")
	flag.Parse()

	// Ctrl-C cancels ctx; the deferred Shutdown below then stops the session.
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	absRoot, err := filepath.Abs(*root)
	if err != nil {
		return err
	}
	providerCfg, err := providerFromEnv()
	if err != nil {
		return err
	}
	client, selected, err := newModel(providerCfg)
	if err != nil {
		return err
	}
	st, err := openStores(*dataDir)
	if err != nil {
		return err
	}
	defer func() { _ = st.Close() }()

	r, err := defineRig(agentConfig{Root: absRoot, ReadOnly: *readOnly, Client: client, Model: selected, Stores: st})
	if err != nil {
		return err
	}
	live, err := openSession(ctx, r, *resume)
	if err != nil {
		return err
	}
	defer func() {
		// Shutdown drains the session and releases its journal lease so the
		// next --resume can take it. Use a fresh context: ctx may be cancelled.
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := live.Shutdown(shutdownCtx); err != nil {
			fmt.Fprintln(os.Stderr, "cli-agent: shutdown:", err)
		}
	}()
	fmt.Fprintf(os.Stderr, "session %s (model %s/%s, workspace %s)\nresume with: --resume %s\n",
		live.SessionID(), selected.Provider, selected.Name, absRoot, live.SessionID())

	lines := readLines(os.Stdin)
	u := ui{out: os.Stdout, approve: stdinApprover(lines, os.Stderr)}
	if *prompt != "" {
		return runTurn(ctx, live, *prompt, u)
	}
	for {
		fmt.Fprint(os.Stderr, "> ")
		var line string
		select {
		case <-ctx.Done():
			fmt.Fprintln(os.Stderr)
			return nil
		case l, ok := <-lines:
			if !ok {
				return nil // EOF
			}
			line = strings.TrimSpace(l)
		}
		if line == "" {
			continue
		}
		if err := runTurn(ctx, live, line, u); err != nil {
			if errors.Is(err, context.Canceled) {
				return nil
			}
			// A failed turn (bad key, provider outage) does not end the session.
			fmt.Fprintln(os.Stderr, "cli-agent:", err)
		}
	}
}

func defaultDataDir() string {
	if dir, err := os.UserConfigDir(); err == nil {
		return filepath.Join(dir, "cli-agent")
	}
	return ".cli-agent"
}

// readLines feeds stdin lines to one channel shared by the prompt loop and
// the approval prompt, so neither steals the other's input.
func readLines(r io.Reader) <-chan string {
	lines := make(chan string)
	go func() {
		defer close(lines)
		scanner := bufio.NewScanner(r)
		for scanner.Scan() {
			lines <- scanner.Text()
		}
	}()
	return lines
}

// stdinApprover asks the human on the terminal. Anything but y or a denies,
// and so does end of input: a write never runs unanswered.
func stdinApprover(lines <-chan string, out io.Writer) func(context.Context, gate.Prompt) gate.ApprovalAction {
	return func(ctx context.Context, p gate.Prompt) gate.ApprovalAction {
		fmt.Fprintf(out, "\n%s\n%s\nAllow? [y]es / [a]lways this session / [N]o: ", p.Title, strings.TrimSpace(p.Body))
		select {
		case <-ctx.Done():
			return gate.ApprovalDeny
		case answer, ok := <-lines:
			if !ok {
				return gate.ApprovalDeny
			}
			switch strings.ToLower(strings.TrimSpace(answer)) {
			case "y", "yes":
				return gate.ApprovalApprove
			case "a", "always":
				return gate.ApprovalApproveAlwaysWorkspace
			}
			return gate.ApprovalDeny
		}
	}
}
