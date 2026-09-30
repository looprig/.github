package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"time"
)

func main() {
	question := flag.String("ask", "What is a Go module?", "question for the coding assistant")
	flag.Parse()

	// Bound the call: a provider that never answers cannot hang the program.
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := run(ctx, os.Stdout, os.Stderr, *question); err != nil {
		log.Fatal(err)
	}
}

func run(ctx context.Context, stdout, stderr io.Writer, question string) error {
	client, selected, err := newModel(stderr)
	if err != nil {
		return err
	}
	response, err := askOnce(ctx, client, selected, question)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintln(stdout, responseText(response))
	return err
}
