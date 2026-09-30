import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FactoryIdentityProvider } from "@looprig/react";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("index.html is missing #root");

// FactoryIdentityProvider reads GET /v1/bootstrap before rendering anything,
// then owns ONE Factory client and ONE ClientLink WebSocket for the whole app.
// No options: the page is served by Factory, so the API is same-origin and the
// browser authenticates with the session cookie (plus Factory's CSRF token,
// which the client handles).
createRoot(root).render(
  <StrictMode>
    <FactoryIdentityProvider
      pending={<p className="muted pad">Signing in…</p>}
      renderBootstrapError={(error, retry) => (
        <div className="pad">
          <p>Not signed in ({error.message}).</p>
          <p>
            <a href="/dev/login">Sign in (dev)</a> · <button onClick={retry}>Retry</button>
          </p>
        </div>
      )}
    >
      <App />
    </FactoryIdentityProvider>
  </StrictMode>,
);
