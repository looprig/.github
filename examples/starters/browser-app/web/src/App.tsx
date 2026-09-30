import { useState } from "react";
import { textBlock } from "@looprig/client";
import { useFactoryClient, useFactorySessionList, useFactoryTenantId } from "@looprig/react";
import { SessionView } from "./SessionView";

/** Session list on the left, the selected session on the right. */
export function App() {
  const client = useFactoryClient();
  const tenant = useFactoryTenantId();
  const list = useFactorySessionList(client.reads);
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text === "") return;
    setError(null);
    // create() mints the session id and command id up front, so a retry of
    // the same pending command can never create a second session.
    const command = client.commands.create({ agentId: "assistant", blocks: [textBlock(text)] });
    const result = await command.attempt();
    if (result.outcome === "rejected") {
      setError(result.error.message);
      return;
    }
    setDraft("");
    setSelected(command.request.session_id);
    void list.refresh();
  }

  return (
    <div className="layout">
      <aside>
        <header>
          <strong>Sessions</strong> <span className="muted">tenant {tenant}</span>
          <form method="post" action="/dev/logout" className="inline">
            <button>Sign out</button>
          </form>
        </header>
        <form onSubmit={(e) => void create(e)} className="new">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Start a new session…" />
          <button disabled={draft.trim() === ""}>Create</button>
        </form>
        {error && <p className="error">{error}</p>}
        {list.error && <p className="error">{list.error.message}</p>}
        <ul>
          {list.sessions.map((session) => (
            <li key={session.session_id}>
              <button
                className={session.session_id === selected ? "active" : ""}
                onClick={() => setSelected(session.session_id)}
              >
                {session.session_id.slice(0, 8)} <span className="muted">{session.state}</span>
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => void list.refresh()}>Refresh</button>
      </aside>
      <main>{selected ? <SessionView key={selected} sessionId={selected} /> : <p className="muted pad">Pick or create a session.</p>}</main>
    </div>
  );
}
