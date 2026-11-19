"use client";

import { useState } from "react";
import type { ProjectType } from "../lib/types";
import { field, btnPrimary, btnGhost } from "../lib/ui";

export interface ProjectValues {
  title: string;
  description: string;
  type: ProjectType;
}

interface Props {
  initial?: ProjectValues;
  submitLabel: string;
  // Return an error message to show, or null when everything went fine.
  onSubmit: (values: ProjectValues) => Promise<string | null>;
  onCancel?: () => void;
}

export default function ProjectForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<ProjectValues>(initial ?? { title: "", description: "", type: "software" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const title = values.title.trim();
    if (!title) {
      setError("Please give your project a title.");
      return;
    }
    setBusy(true);
    setError(null);
    const message = await onSubmit({ ...values, title, description: values.description.trim() });
    if (message) setError(message);
    setBusy(false);
  }

  const label: React.CSSProperties = { fontSize: 13, fontWeight: 500, display: "block" };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <label style={label}>
        Project title
        <input
          style={{ ...field, marginTop: 6 }}
          required
          maxLength={120}
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          placeholder="e.g. Smart irrigation using ESP32"
        />
      </label>
      <label style={label}>
        Type
        <select
          style={{ ...field, marginTop: 6 }}
          value={values.type}
          onChange={(e) => setValues({ ...values, type: e.target.value as ProjectType })}
        >
          <option value="software">Software</option>
          <option value="hardware">Hardware</option>
          <option value="both">Software + Hardware</option>
        </select>
      </label>
      <label style={label}>
        Description <span style={{ fontWeight: 300 }}>(optional)</span>
        <textarea
          style={{ ...field, marginTop: 6, minHeight: 100, resize: "vertical" }}
          maxLength={1000}
          value={values.description}
          onChange={(e) => setValues({ ...values, description: e.target.value })}
          placeholder="What are you building, and for whom?"
        />
      </label>
      {error && <p role="alert" style={{ margin: 0, fontSize: 14, color: "#B42318" }}>{error}</p>}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button type="submit" disabled={busy} style={{ ...btnPrimary, opacity: busy ? 0.6 : 1, cursor: busy ? "wait" : "pointer" }}>
          {busy ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={btnGhost}>Cancel</button>
        )}
      </div>
    </form>
  );
}
