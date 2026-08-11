package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"

	"github.com/looprig/core/uuid"
	"github.com/looprig/harness/pkg/serve"
)

var sessionID = uuid.MustParse("11111111-2222-4333-8444-555555555555")

type reader struct{}

func (reader) ListSessions(context.Context, serve.Page) (serve.SessionList, error) {
	return serve.SessionList{
		Sessions: []serve.SessionSummary{{SessionID: sessionID, State: "idle", Title: "Documentation run"}},
		Limit:    20,
		Done:     true,
	}, nil
}

func (reader) ReadStatus(context.Context, uuid.UUID) (serve.SessionStatus, error) {
	return serve.SessionStatus{SessionID: sessionID, State: "idle"}, nil
}

func (reader) ReadJournal(context.Context, uuid.UUID, serve.JournalPage) (serve.EventJournalPage, error) {
	return serve.EventJournalPage{Done: true}, nil
}

func main() {
	if err := run(os.Stdout); err != nil {
		panic(err)
	}
}

func run(output io.Writer) error {
	handler := serve.ReadHandler(reader{})
	request := func(method, target string) *httptest.ResponseRecorder {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest(method, target, http.NoBody))
		return response
	}

	capabilities := request(http.MethodGet, "/v1/capabilities")
	sessions := request(http.MethodGet, "/v1/sessions")
	control := request(http.MethodPost, "/v1/sessions/"+sessionID.String()+"/interrupt")
	if capabilities.Code != http.StatusOK || sessions.Code != http.StatusOK || control.Code != http.StatusNotFound {
		return fmt.Errorf("unexpected statuses: capabilities=%d sessions=%d control=%d",
			capabilities.Code, sessions.Code, control.Code)
	}
	var listed serve.SessionList
	if err := json.Unmarshal(sessions.Body.Bytes(), &listed); err != nil {
		return err
	}
	_, err := fmt.Fprintf(output, "capabilities=%d sessions=%d control-route=%d\n",
		capabilities.Code, len(listed.Sessions), control.Code)
	return err
}
