package fakeinference

import (
	"context"
	"errors"
	"io"
	"testing"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/stream"
)

func TestClientRunsInvokeAndStreamStepsInOrder(t *testing.T) {
	client := New(
		Text("hello"),
		TextStream("good", "bye"),
	)

	response, err := client.Invoke(context.Background(), inference.Request{System: "first"})
	if err != nil {
		t.Fatalf("Invoke() error = %v", err)
	}
	block, ok := response.Message.Blocks[0].(*content.TextBlock)
	if !ok || block.Text != "hello" {
		t.Fatalf("Invoke() text = %#v, want hello", response.Message.Blocks)
	}

	reader, err := client.Stream(context.Background(), inference.Request{System: "second"})
	if err != nil {
		t.Fatalf("Stream() error = %v", err)
	}
	defer reader.Close()
	for _, want := range []string{"good", "bye"} {
		chunk, nextErr := reader.Next()
		if nextErr != nil {
			t.Fatalf("Next() error = %v", nextErr)
		}
		text, ok := chunk.(*content.TextChunk)
		if !ok || text.Text != want {
			t.Fatalf("Next() = %#v, want %q", chunk, want)
		}
	}
	if _, err := reader.Next(); !errors.Is(err, io.EOF) {
		t.Fatalf("terminal Next() error = %v, want EOF", err)
	}
	result, ok := reader.Result()
	if !ok || result.FinishReason != stream.FinishReasonStop {
		t.Fatalf("Result() = (%+v, %v), want stop result", result, ok)
	}
	if got := client.Requests(); len(got) != 2 || got[0].System != "first" || got[1].System != "second" {
		t.Fatalf("Requests() = %#v, want two recorded requests", got)
	}
}

func TestClientReportsExhaustionAndOperationMismatch(t *testing.T) {
	client := New(Text("invoke only"))
	if _, err := client.Stream(context.Background(), inference.Request{}); err == nil {
		t.Fatal("Stream() error = nil, want operation mismatch")
	}
	if _, err := client.Invoke(context.Background(), inference.Request{}); err == nil {
		t.Fatal("Invoke() error = nil after mismatch consumed step, want exhaustion")
	}
}

func TestClientHonorsCanceledContextWithoutConsumingStep(t *testing.T) {
	client := New(Text("still available"))
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	if _, err := client.Invoke(ctx, inference.Request{}); !errors.Is(err, context.Canceled) {
		t.Fatalf("Invoke() error = %v, want context.Canceled", err)
	}
	if client.Remaining() != 1 {
		t.Fatalf("Remaining() = %d, want 1", client.Remaining())
	}
}
