package fakeinference

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sync"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/stream"
)

type operation uint8

const (
	invokeOperation operation = iota + 1
	streamOperation
)

// Step is one deterministic response in a Client script. Construct steps with
// Respond, FailInvoke, StreamResponse, FailStream, Text, or TextStream.
type Step struct {
	operation operation
	response  *inference.Response
	chunks    []content.Chunk
	result    stream.StreamResult
	err       error
}

// Client is an in-memory inference.Client for credential-free examples. Each
// call consumes exactly one scripted step and records its request.
type Client struct {
	mu       sync.Mutex
	steps    []Step
	requests []inference.Request
}

var _ inference.Client = (*Client)(nil)

// New constructs a client that consumes steps in order.
func New(steps ...Step) *Client {
	return &Client{steps: append([]Step(nil), steps...)}
}

// Respond scripts one Invoke response.
func Respond(response *inference.Response) Step {
	return Step{operation: invokeOperation, response: response}
}

// FailInvoke scripts one Invoke error.
func FailInvoke(err error) Step {
	return Step{operation: invokeOperation, err: err}
}

// StreamResponse scripts one Stream response and its terminal metadata.
func StreamResponse(chunks []content.Chunk, result stream.StreamResult) Step {
	return Step{operation: streamOperation, chunks: append([]content.Chunk(nil), chunks...), result: result}
}

// FailStream scripts one Stream establishment error.
func FailStream(err error) Step {
	return Step{operation: streamOperation, err: err}
}

// Text is a compact Invoke step for a plain assistant response.
func Text(text string) Step {
	return Respond(&inference.Response{
		Message: &content.AIMessage{Message: content.Message{
			Role:   content.RoleAssistant,
			Blocks: []content.Block{&content.TextBlock{Text: text}},
		}},
		FinishReason: stream.FinishReasonStop,
	})
}

// TextStream is a compact Stream step made of text deltas.
func TextStream(parts ...string) Step {
	chunks := make([]content.Chunk, len(parts))
	for index, part := range parts {
		chunks[index] = &content.TextChunk{Text: part}
	}
	return StreamResponse(chunks, stream.StreamResult{FinishReason: stream.FinishReasonStop})
}

// Invoke consumes the next Invoke step.
func (c *Client) Invoke(ctx context.Context, request inference.Request) (*inference.Response, error) {
	step, err := c.next(ctx, invokeOperation, request)
	if err != nil {
		return nil, err
	}
	if step.err != nil {
		return nil, step.err
	}
	if step.response == nil {
		return nil, errors.New("fake inference: Invoke step has no response")
	}
	return step.response, nil
}

// Stream consumes the next Stream step.
func (c *Client) Stream(ctx context.Context, request inference.Request) (*stream.StreamReader[content.Chunk], error) {
	step, err := c.next(ctx, streamOperation, request)
	if err != nil {
		return nil, err
	}
	if step.err != nil {
		return nil, step.err
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
		return step.result, true, nil
	}), nil
}

// Requests returns a snapshot of requests in call order.
func (c *Client) Requests() []inference.Request {
	c.mu.Lock()
	defer c.mu.Unlock()
	return append([]inference.Request(nil), c.requests...)
}

// Remaining reports how many scripted steps have not been consumed.
func (c *Client) Remaining() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return len(c.steps)
}

func (c *Client) next(ctx context.Context, want operation, request inference.Request) (Step, error) {
	if err := ctx.Err(); err != nil {
		return Step{}, err
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if len(c.steps) == 0 {
		return Step{}, errors.New("fake inference: script exhausted")
	}
	step := c.steps[0]
	c.steps = c.steps[1:]
	c.requests = append(c.requests, request)
	if step.operation != want {
		return Step{}, fmt.Errorf("fake inference: scripted %s step used by %s", operationName(step.operation), operationName(want))
	}
	return step, nil
}

func operationName(value operation) string {
	if value == invokeOperation {
		return "Invoke"
	}
	if value == streamOperation {
		return "Stream"
	}
	return "unknown"
}
