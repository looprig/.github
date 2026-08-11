package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"

	"github.com/looprig/core/content"
	"github.com/looprig/inference"
	"github.com/looprig/inference/codec"
	"github.com/looprig/inference/codec/anthropicapi"
	"github.com/looprig/inference/gateway"
	"github.com/looprig/inference/model"
	"github.com/looprig/inference/stream"
)

func main() {
	output, err := run()
	if err != nil {
		panic(err)
	}
	fmt.Print(output)
}

func run() (string, error) {
	upstream := &recordingClient{}
	providerModel := model.CustomModel("example", model.APIFormatAnthropic, "", "provider-model")
	resolver, err := gateway.NewMux(gateway.Mux{
		Routes: map[gateway.RouteKey]gateway.Target{
			{Ingress: model.APIFormatAnthropic, Model: "primary"}: {
				ID: "primary-target", Client: upstream, Model: providerModel,
			},
		},
	})
	if err != nil {
		return "", err
	}
	handler, err := gateway.New(gateway.Config{
		Resolver: resolver,
		Codecs: map[model.APIFormat]codec.ServerCodec{
			model.APIFormatAnthropic: anthropicapi.Codec{},
		},
		Authenticate: gateway.StaticToken("local-token"),
	})
	if err != nil {
		return "", err
	}

	request := httptest.NewRequest(http.MethodPost, "/v1/messages", strings.NewReader(
		`{"model":"primary","max_tokens":16,"messages":[{"role":"user","content":[{"type":"text","text":"hello"}]}]}`,
	))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Authorization", "Bearer local-token")
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, request)
	if recorder.Code != http.StatusOK {
		return "", fmt.Errorf("gateway response status = %d: %s", recorder.Code, recorder.Body.String())
	}
	var response struct {
		Model string `json:"model"`
	}
	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		return "", err
	}
	_, routeErr := gateway.Strict(resolver).Resolve(context.Background(), model.APIFormatAnthropic, "missing")
	var unknown *gateway.UnknownRouteError
	strictUnknown := errors.As(routeErr, &unknown)
	if !strictUnknown {
		return "", fmt.Errorf("strict route error = %v, want UnknownRouteError", routeErr)
	}
	return fmt.Sprintf("alias=%s response=%s upstream=%s strict-unknown=%t\n",
		"primary", response.Model, upstream.model, strictUnknown), nil
}

type recordingClient struct {
	model string
}

func (c *recordingClient) Invoke(_ context.Context, request inference.Request) (*inference.Response, error) {
	c.model = request.Model.Name
	return &inference.Response{
		Message: &content.AIMessage{Message: content.Message{
			Role:   content.RoleAssistant,
			Blocks: []content.Block{&content.TextBlock{Text: "routed"}},
		}},
		Model:        request.Model.Name,
		FinishReason: stream.FinishReasonStop,
	}, nil
}

func (*recordingClient) Stream(context.Context, inference.Request) (*stream.StreamReader[content.Chunk], error) {
	return nil, errors.New("streaming is not used in this example")
}
