"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase";
import { useRequireUser } from "../../../lib/useRequireUser";
import AppHeader from "../../../components/AppHeader";
import ProjectForm, { ProjectValues } from "../../../components/ProjectForm";
import RoadmapPanel from "../../../components/RoadmapPanel";
import { Project, TYPE_LABEL, formatDate } from "../../../lib/types";
import type { Roadmap } from "../../../lib/roadmap";
import { btnGhost, line, muted, pill } from "../../../lib/ui";

export default function ProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const user = useRequireUser();
  const [project, setProject] = useState<Project | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("projects")
      .select("id, title, description, type, created_at, roadmap_json")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setProject((data as Project | null) ?? null);
        setLoaded(true);
      });
  }, [user, id]);

  async function save(values: ProjectValues) {
    const { error } = await createClient().from("projects").update(values).eq("id", id);
    if (error) return error.message;
    setProject((p) => (p ? { ...p, ...values } : p));
    setEditing(false);
    return null;
  }

  async function remove() {
    if (!window.confirm("Delete this project and everything in it? This cannot be undone.")) return;
    const { error } = await createClient().from("projects").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/dashboard");
  }

  if (!user || !loaded) return <main style={{ padding: 48, color: muted }}>Loading…</main>;

  if (!project) {
    return (
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <AppHeader email={user.email ?? ""} />
        <h1 style={{ fontSize: 32, fontWeight: 500, margin: "56px 0 12px" }}>Project not found</h1>
        <p style={{ color: muted }}>It may have been deleted, or it does not belong to your account.</p>
        <Link href="/dashboard" style={{ fontWeight: 500 }}>Back to your projects</Link>
      </main>
    );
  }

  const soon: React.CSSProperties = { border: "1.5px dashed rgba(11,21,48,.3)", borderRadius: 14, padding: 24, marginTop: 24 };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" }}>
      <AppHeader email={user.email ?? ""} />
      <p style={{ margin: "40px 0 0", fontSize: 14 }}>
        <Link href="/dashboard" style={{ color: muted }}>← All projects</Link>
      </p>

      {editing ? (
        <section style={{ border: "1px solid " + line, borderRadius: 14, padding: 24, marginTop: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 20px" }}>Edit project</h2>
          <ProjectForm
            initial={{ title: project.title, description: project.description, type: project.type }}
            submitLabel="Save changes"
            onSubmit={save}
            onCancel={() => setEditing(false)}
          />
        </section>
      ) : (
        <section style={{ marginTop: 16 }}>
          <span style={pill}>{TYPE_LABEL[project.type]}</span>
          <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.03em", margin: "14px 0 10px" }}>{project.title}</h1>
          <p style={{ color: muted, fontWeight: 300, maxWidth: 640, margin: "0 0 8px" }}>{project.description || "No description yet."}</p>
          <p style={{ color: muted, fontSize: 13, margin: "0 0 24px" }}>Created {formatDate(project.created_at)}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button style={btnGhost} onClick={() => setEditing(true)}>Edit</button>
            <button style={{ ...btnGhost, color: "#B42318", borderColor: "rgba(180,35,24,.4)" }} onClick={remove}>Delete</button>
          </div>
          {error && <p role="alert" style={{ color: "#B42318" }}>{error}</p>}
        </section>
      )}

      <RoadmapPanel
        projectId={project.id}
        initialIdea={project.description}
        roadmap={project.roadmap_json ?? null}
        onChange={(r: Roadmap) => setProject((p) => (p ? { ...p, roadmap_json: r } : p))}
      />

      <div style={soon}>
        <h3 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 6px" }}>Issues (ReproLab)</h3>
        <p style={{ margin: 0, color: muted, fontWeight: 300 }}>Coming next: log bugs and failures, then verify the fixes.</p>
      </div>
    </main>
  );
}
