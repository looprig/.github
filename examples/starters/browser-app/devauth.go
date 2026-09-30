package main

// devauth.go is DEVELOPMENT-ONLY identity. Replace all of it before exposing
// this app to anyone.
//
// Anyone who knows LOOPRIG_DEV_TOKEN can sign in as any username. The
// credential is "<username>:<token>", presented either as a bearer token
// (Authorization: Bearer alice:<token>, for curl and tests) or as the
// looprig_dev cookie the /dev/login form sets. There is no password per user,
// no logout on the server side and no rate limiting.
//
// In production, implement identity.Verifier over your real identity
// provider (verify a signed session cookie or an OIDC access token), and
// implement factory.Authorizer with your ownership rules. Everything else in
// this app stays the same.

import (
	"context"
	"crypto/subtle"
	"fmt"
	"html"
	"net/http"
	"regexp"
	"strings"
	"time"

	sessionwire "github.com/looprig/core/sessionwire/v1"
	"github.com/looprig/factory/identity"
	"github.com/looprig/sessionstore"
)

const devCookie = "looprig_dev"

var usernamePattern = regexp.MustCompile(`^[a-z0-9][a-z0-9_-]{0,31}$`)

// devVerifier accepts "<username>:<dev token>".
type devVerifier struct {
	tenant sessionwire.TenantID
	token  string
}

func (v devVerifier) VerifyCredential(_ context.Context, credential identity.Credential) (identity.Claims, error) {
	user, token, ok := strings.Cut(credential.Value(), ":")
	if !ok || !usernamePattern.MatchString(user) || !constantTimeEqual(token, v.token) {
		// Wrapping ErrUnauthenticated makes Factory answer 401; any other
		// error would be reported as the verifier being unavailable.
		return identity.Claims{}, fmt.Errorf("dev credential refused: %w", identity.ErrUnauthenticated)
	}
	return identity.Claims{
		Tenant:    v.tenant,
		Subject:   user,
		Kind:      identity.KindActor,
		ExpiresAt: time.Now().Add(12 * time.Hour), // a credential with no expiry is refused
	}, nil
}

// devAuthorizer lets every signed-in user of the tenant see and drive every
// session in it. A real app decides per session (for example, only its
// creator and collaborators), wrapping identity.ErrUnauthorized on denial.
type devAuthorizer struct{ tenant sessionwire.TenantID }

func (a devAuthorizer) actor(p identity.Principal) error {
	if p.Tenant() != a.tenant || p.IsService() {
		return identity.ErrUnauthorized
	}
	return nil
}

func (a devAuthorizer) AuthorizeSessionList(_ context.Context, p identity.Principal) error {
	return a.actor(p)
}

func (a devAuthorizer) AuthorizeSessionRead(_ context.Context, p identity.Principal, _ sessionwire.SessionID) error {
	return a.actor(p)
}

func (a devAuthorizer) AuthorizeObjectRead(_ context.Context, p identity.Principal, _ sessionwire.SessionID, _ sessionwire.ObjectReference) error {
	return a.actor(p)
}

func (a devAuthorizer) AuthorizeControl(_ context.Context, p identity.Principal, _ sessionwire.SessionID, _ sessionstore.CommandKind) error {
	return a.actor(p)
}

func (a devAuthorizer) AuthorizeSubscribe(_ context.Context, p identity.Principal, _ string) error {
	return a.actor(p)
}

// AuthorizeServiceSweep admits only Factory's own service identity.
func (devAuthorizer) AuthorizeServiceSweep(_ context.Context, p identity.Principal) error {
	if !p.IsService() {
		return identity.ErrUnauthorized
	}
	return nil
}

func constantTimeEqual(a, b string) bool {
	return subtle.ConstantTimeCompare([]byte(a), []byte(b)) == 1
}

// registerDevAuth serves a sign-in form that sets the dev cookie.
func registerDevAuth(mux *http.ServeMux, tenant sessionwire.TenantID, token string) {
	mux.HandleFunc("GET /dev/login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		msg := ""
		if r.URL.Query().Has("failed") {
			msg = `<p style="color:#b00">Wrong username or token.</p>`
		}
		fmt.Fprintf(w, `<!doctype html><title>Sign in (dev)</title>
<body style="font-family:system-ui;max-width:28rem;margin:4rem auto">
<h1>Sign in</h1><p><strong>Development only.</strong> Tenant %s. Use any username and the LOOPRIG_DEV_TOKEN printed at startup.</p>%s
<form method="post" action="/dev/login">
<p><label>Username <input name="user" pattern="[a-z0-9][a-z0-9_\-]{0,31}" required></label></p>
<p><label>Dev token <input name="token" type="password" required></label></p>
<button>Sign in</button></form></body>`, html.EscapeString(string(tenant)), msg)
	})
	mux.HandleFunc("POST /dev/login", func(w http.ResponseWriter, r *http.Request) {
		user := r.PostFormValue("user")
		if !usernamePattern.MatchString(user) || !constantTimeEqual(r.PostFormValue("token"), token) {
			http.Redirect(w, r, "/dev/login?failed", http.StatusSeeOther)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name: devCookie, Value: user + ":" + token, Path: "/",
			HttpOnly: true, SameSite: http.SameSiteLaxMode, MaxAge: int((12 * time.Hour).Seconds()),
		})
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})
	mux.HandleFunc("POST /dev/logout", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{Name: devCookie, Value: "", Path: "/", MaxAge: -1})
		http.Redirect(w, r, "/dev/login", http.StatusSeeOther)
	})
}
