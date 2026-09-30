import { useState } from "react";
import { liveToolRows, placeLivePreviews, type FactoryLivePreview, type TranscriptRow } from "@looprig/client";
import {
  useFactoryClient,
  useFactoryComposer,
  useFactorySessionView,
  useFactoryTenantId,
  useFoldedEvents,
} from "@looprig/react";

/**
 * One session: the durable journal folded into transcript rows, plus live
 * previews (streaming text, reasoning and running tool steps) placed after
 * the row of the turn they belong to. A preview disappears when its
 * committed event arrives, so reloading the page shows the same transcript.
 */
export function SessionView({ sessionId }: { sessionId: string }) {
  const client = useFactoryClient();
  const tenantId = useFactoryTenantId();
  const view = useFactorySessionView(client.reads, { tenantId, sessionId });
  const rows = useFoldedEvents(view.events).view.rows;
  const previews = placeLivePreviews(
    rows, 0, rows.length, view.liveText, view.liveReasoning, liveToolRows(view.liveToolSteps),
  );

  return (
    <div className="session">
      <header>
        <code>{sessionId}</code> <span className="muted">{view.status?.state ?? "loading"} · link {view.liveState}</span>
      </header>
      <div className="transcript" role="log">
        {previews.unplaced.length === 0 && rows.length === 0 && <p className="muted">Nothing yet.</p>}
        {rows.map((row, index) => (
          <div key={row.ordinal}>
            <Row row={row} />
            {previews.afterRow.get(index)?.map((preview) => <Preview key={previewKey(preview)} preview={preview} />)}
          </div>
        ))}
        {previews.unplaced.map((preview) => <Preview key={previewKey(preview)} preview={preview} />)}
      </div>
      {view.error && <p className="error">{view.error.message}</p>}
      <Composer sessionId={sessionId} />
    </div>
  );
}

function Row({ row }: { row: TranscriptRow }) {
  switch (row.kind) {
    case "user":
      return (
        <div className="row user">
          {row.principal && <span className="muted">{row.principal.subject}: </span>}
          {row.blocks.map((block) => ("text" in block && typeof block.text === "string" ? block.text : "")).join("")}
        </div>
      );
    case "assistant":
      return (
        <div className="row assistant">
          {row.thinking && <details><summary className="muted">reasoning</summary>{row.thinking}</details>}
          {row.text}
        </div>
      );
    case "tool":
      return <ToolRowView name={row.toolName} status={row.status} summary={row.summary} result={row.result} />;
    case "notice":
      return <div className="row notice">{row.text}</div>;
    case "tombstone":
      return <div className="row notice">Turn interrupted</div>;
  }
}

function Preview({ preview }: { preview: FactoryLivePreview }) {
  if (preview.kind === "tool") {
    const row = preview.row;
    return <ToolRowView name={row.toolName} status={row.status} summary={row.summary} result={row.result} />;
  }
  return <div className={`row live ${preview.kind}`}>{preview.text}▍</div>;
}

function previewKey(preview: FactoryLivePreview): string {
  return preview.kind === "tool" ? `tool:${preview.row.toolExecutionId}` : `${preview.kind}:${preview.loopId}:${preview.turnId}`;
}

function ToolRowView(props: { name: string; status: string; summary: string; result: string }) {
  return (
    <div className="row tool">
      <strong>{props.name}</strong> <span className="muted">{props.status}</span> {props.summary}
      {props.result && <pre>{props.result}</pre>}
    </div>
  );
}

/** Sends input. The composer keeps one command envelope per message, so a retry never sends twice. */
function Composer({ sessionId }: { sessionId: string }) {
  const composer = useFactoryComposer(sessionId);
  const [text, setText] = useState("");
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (text.trim() === "") return;
    const result = await composer.submit(text);
    if (result.outcome !== "rejected" && result.outcome !== "refused") setText("");
  }
  return (
    <form className="composer" onSubmit={(e) => void send(e)}>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the agent…" />
      <button disabled={composer.pending?.sending === true}>Send</button>
      {composer.pending && !composer.pending.sending && (
        <button type="button" onClick={() => void composer.retry()}>Retry</button>
      )}
      {composer.error && <span className="error">{composer.error.message}</span>}
    </form>
  );
}
