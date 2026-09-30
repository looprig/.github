// Command browser-app is a single-process, multi-user Looprig web app:
// Factory (public API + browser realtime), an in-process Host running a
// harness agent, local durable storage, dev-only sign-in, and a React UI.
//
//	go run .                     # keyless, scripted model
//	LOOPRIG_PROVIDER=openai LOOPRIG_MODEL=gpt-5-mini LOOPRIG_API_KEY=... go run .
//
// If you add sandboxed tools (Bash through github.com/looprig/sandbox), call
// sandbox.Init() as the very first statement of main: on Linux the sandbox
// refuses to build an executor without it. This agent runs no commands.
package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"
)

func main() {
	if err := run(); err != nil {
		fmt.Fprintln(os.Stderr, "browser-app:", err)
		os.Exit(1)
	}
}

func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	addr := envOr("LOOPRIG_ADDR", "127.0.0.1:8080")
	dataDir, err := filepath.Abs(envOr("LOOPRIG_DATA", "data"))
	if err != nil {
		return err
	}
	token := os.Getenv("LOOPRIG_DEV_TOKEN")
	if token == "" {
		if token, err = randomToken(); err != nil {
			return err
		}
	}
	provider, err := providerFromEnv()
	if err != nil {
		return err
	}
	client, selected, err := newModel(provider)
	if err != nil {
		return err
	}
	logger := slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelWarn}))

	_, port, err := net.SplitHostPort(addr)
	if err != nil {
		return err
	}
	app, err := Start(ctx, Config{
		DataDir:  dataDir,
		Tenant:   "dev",
		DevToken: token,
		// The page's own origin, plus the Vite dev server (npm run dev).
		Origins: []string{"http://localhost:" + port, "http://127.0.0.1:" + port, "http://localhost:5173", "http://127.0.0.1:5173"},
		Client:  client,
		Model:   selected,
		Logger:  logger,
	})
	if err != nil {
		return err
	}
	server := &http.Server{Addr: addr, Handler: app.Handler(), ReadHeaderTimeout: 10 * time.Second}
	serveErr := make(chan error, 1)
	go func() { serveErr <- server.ListenAndServe() }()

	fmt.Printf("browser-app listening on http://%s (data in %s)\n", addr, dataDir)
	fmt.Printf("DEV sign-in: open http://%s/dev/login, any username, token %s\n", addr, token)
	fmt.Printf("curl: curl -H 'Authorization: Bearer alice:%s' http://%s/v1/sessions\n", token, addr)

	select {
	case <-ctx.Done():
	case err = <-serveErr:
		if !errors.Is(err, http.ErrServerClosed) {
			fmt.Fprintln(os.Stderr, "browser-app: listener:", err)
		}
	}
	shutdown, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	// Stop the app first: it fences new commands and closes browser links
	// while the listener is still up, then drains the Host.
	stopErr := app.Stop(shutdown)
	return errors.Join(stopErr, server.Shutdown(shutdown))
}

func envOr(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}
