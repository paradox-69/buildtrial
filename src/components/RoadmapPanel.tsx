"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase";
import type { Roadmap } from "../lib/roadmap";
import { btnGhost, btnPrimary, field, ink, line, muted, paper, pill } from "../lib/ui";

interface Props {
  projectId: string;
  initialIdea: string;
  roadmap: Roadmap | null;
  onChange: (roadmap: Roadmap) => void;
}

export default function RoadmapPanel({ projectId, initialIdea, roadmap, onChange }: Props) {
  const [showForm, setShowForm] = useState(!roadmap);
  const [idea, setIdea] = useState(initialIdea);
  const [teamSize, setTeamSize] = useState(3);
  const [weeks, setWeeks] = useState(12);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { data } = await createClient().auth.getSession();
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
        body: JSON.stringify({ projectId, idea, teamSize, weeks }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; roadmap?: Roadmap };
      if (!res.ok || !body.roadmap) {
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      onChange(body.roadmap);
      setShowForm(false);
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const label: React.CSSProperties = { fontSize: 13, fontWeight: 500, display: "block" };

  return (
    <section style={{ border: "1px solid " + line, borderRadius: 14, padding: 24, marginTop: 48 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>Smart Roadmap</h2>
        {roadmap && !showForm && (
          <button style={btnGhost} onClick={() => setShowForm(true)}>Regenerate</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={generate} style={{ display: "grid", gap: 16, marginTop: 20 }}>
          <label style={label}>
            Describe your idea
            <textarea
              style={{ ...field, marginTop: 6, minHeight: 110, resize: "vertical" }}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              maxLength={1500}
              required
              placeholder="What will it do, who is it for, and what do you already have (parts, skills, tools)?"
            />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label style={label}>
              Team size
              <input style={{ ...field, marginTop: 6 }} type="number" min={1} max={10} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} />
            </label>
            <label style={label}>
              Weeks available
              <input style={{ ...field, marginTop: 6 }} type="number" min={2} max={40} value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} />
            </label>
          </div>
          {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: "#B42318" }}>{error}</p>}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.6 : 1, cursor: busy ? "wait" : "pointer" }}>
              {busy ? "Planning your project…" : roadmap ? "Generate again" : "Generate roadmap"}
            </button>
            {roadmap && <button type="button" style={btnGhost} onClick={() => setShowForm(false)}>Cancel</button>}
            {busy && <span style={{ fontSize: 13, color: muted }}>This can take up to half a minute.</span>}
          </div>
        </form>
      )}

      {roadmap && !showForm && (
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: "0 0 20px", color: muted, fontWeight: 300, maxWidth: 680 }}>{roadmap.summary}</p>

          <h3 style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: muted, margin: "0 0 10px" }}>Tech stack</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {roadmap.tech_stack.map((t) => (
              <li key={t.name} title={t.why} style={{ ...pill, fontWeight: 500, textTransform: "none", letterSpacing: 0, fontSize: 13, padding: "4px 12px" }}>
                {t.name}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: muted, margin: "0 0 14px" }}>Milestones</h3>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
            <span aria-hidden style={{ position: "absolute", left: 11, top: 14, bottom: 14, width: 2, background: ink }} />
            {roadmap.milestones.map((m, i) => (
              <li key={i} style={{ position: "relative", paddingLeft: 48, paddingBottom: 24 }}>
                <span
                  aria-hidden
                  style={{ position: "absolute", left: 0, top: 4, width: 24, height: 24, borderRadius: "50%", border: "2.5px solid " + ink, background: i === roadmap.milestones.length - 1 ? "#5EEAD4" : paper, boxSizing: "border-box" }}
                />
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".1em", color: "#4338CA" }}>{m.weeks.toUpperCase()}</div>
                <h4 style={{ fontSize: 18, fontWeight: 500, margin: "2px 0 8px" }}>{m.title}</h4>
                <ul style={{ margin: "0 0 8px", paddingLeft: 18, color: muted, fontWeight: 300, fontSize: 15 }}>
                  {m.tasks.map((t, k) => <li key={k}>{t}</li>)}
                </ul>
                {m.deliverable && <p style={{ margin: 0, fontSize: 14 }}><strong style={{ fontWeight: 600 }}>Done when:</strong> {m.deliverable}</p>}
              </li>
            ))}
          </ol>

          {roadmap.risks.length > 0 && (
            <>
              <h3 style={{ fontSize: 13, letterSpacing: ".14em", textTransform: "uppercase", color: muted, margin: "8px 0 10px" }}>Watch out for</h3>
              <ul style={{ margin: 0, paddingLeft: 18, color: muted, fontWeight: 300, fontSize: 15 }}>
                {roadmap.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
}
