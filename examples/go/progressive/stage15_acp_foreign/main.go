package main

import (
	"fmt"
	"io"
	"os"

	"github.com/looprig/acp/protocol"
	"github.com/looprig/foreignloops/driver"
	foreignacp "github.com/looprig/foreignloops/driver/acp"
	"github.com/looprig/harness/pkg/foreign"
	"github.com/looprig/harness/pkg/loop"
)

func main() {
	if err := run(os.Stdout); err != nil {
		panic(err)
	}
}

func run(output io.Writer) error {
	// The application owns the child configuration. MCP servers supplied here
	// are forwarded to the ACP child when it creates or reloads its session.
	cfg := foreignacp.Config{
		Harness:       foreignacp.HarnessCodex,
		Executable:    "/usr/local/bin/codex-acp",
		Credential:    loop.CredentialNativeAuth,
		Posture:       driver.PostureReadOnly,
		WorkspaceRoot: "/workspace",
		McpServers: []protocol.McpServer{{Stdio: &protocol.McpServerStdio{
			Name:    "workspace-tools",
			Command: "/usr/local/bin/workspace-mcp",
		}}},
	}

	// Register the matching constructors together. Harness uses the live
	// constructor for a new foreign Loop and the restored constructor when a
	// journal contains the ACP child's prior session identity.
	profile := loop.RuntimeProfileName("acp-codex")
	var registry foreign.BuilderRegistry
	if err := registry.RegisterServices(
		profile,
		foreignacp.BuildWithServices(cfg),
		foreignacp.BuildRestoredWithServices(cfg),
	); err != nil {
		return err
	}
	live, restored, err := registry.ServicesBuilder(profile)
	if err != nil {
		return err
	}

	_, err = fmt.Fprintf(output,
		"profile=%s live=%t restored=%t scoped-services=%t mcp-servers=%d\n",
		profile, live != nil, restored != nil, registry.HasServicesBuilder(profile), len(cfg.McpServers),
	)
	return err
}
