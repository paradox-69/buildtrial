"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";
import { useRequireUser } from "../../lib/useRequireUser";
import AppHeader from "../../components/AppHeader";
import ProjectForm, { ProjectValues } from "../../components/ProjectForm";
import { Project, TYPE_LABEL, formatDate } from "../../lib/types";
import { btnPrimary, line, muted, pill } from "../../lib/ui";

export default function DashboardPage() {
  const router = useRouter();
  const user = useRequireUser();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("projects")
      .select("id, title, description, type, created_at, issues(count)")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProjects((data ?? []) as Project[]);
      });
  }, [user]);

  async function createProject(values: ProjectValues) {
    const { data, error } = await createClient().from("projects").insert(values).select("id").single();
    if (error || !data) return error?.message ?? "Could not create the project. Please try again.";
    router.push(`/projects/${data.id}`);
    return null;
  }

  if (!user) return <main style={{ padding: 48, color: muted }}>Loading…</main>;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" }}>
      <AppHeader email={user.email ?? ""} />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", margin: "56px 0 28px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.03em", margin: 0 }}>Your projects</h1>
        {!creating && (
          <button style={btnPrimary} onClick={() => setCreating(true)}>New project</button>
        )}
      </div>

      {creating && (
        <section style={{ border: "1px solid " + line, borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, margin: "0 0 20px" }}>New project</h2>
          <ProjectForm submitLabel="Create project" onSubmit={createProject} onCancel={() => setCreating(false)} />
        </section>
      )}

      {error && <p role="alert" style={{ color: "#B42318" }}>{error}</p>}
      {!error && projects === null && <p style={{ color: muted }}>Loading your projects…</p>}

      {projects && projects.length === 0 && !creating && (
        <div style={{ border: "1.5px dashed rgba(11,21,48,.3)", borderRadius: 14, padding: "56px 24px", textAlign: "center", color: muted }}>
          No projects yet. Create your first project to get started.
        </div>
      )}

      {projects && projects.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              style={{ display: "block", border: "1px solid " + line, borderRadius: 14, padding: 20, textDecoration: "none", color: "inherit", background: "#F7F4EE" }}
            >
              <span style={pill}>{TYPE_LABEL[p.type]}</span>
              <h3 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "12px 0 6px" }}>{p.title}</h3>
              <p style={{ margin: "0 0 16px", color: muted, fontSize: 14, fontWeight: 300, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {p.description || "No description yet."}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: muted }}>
                <span>{p.issues?.[0]?.count ?? 0} issues</span>
                <span>{formatDate(p.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
