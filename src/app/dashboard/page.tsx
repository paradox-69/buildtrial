"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";
import Logo from "../../components/Logo";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!data.user) router.replace("/login");
        else setEmail(data.user.email ?? "");
      });
  }, [router]);

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  if (email === null) {
    return <main style={{ padding: 48, color: "#4A546D" }}>Loading…</main>;
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
          <span style={{ color: "#4A546D" }}>{email}</span>
          <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(11,21,48,.3)", borderRadius: 999, padding: "8px 16px", font: "inherit", cursor: "pointer" }}>
            Log out
          </button>
        </div>
      </header>
      <h1 style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.03em", margin: "64px 0 8px" }}>Your projects</h1>
      <p style={{ margin: "0 0 32px", color: "#4A546D", fontWeight: 300 }}>Login is working. Projects come next.</p>
      <div style={{ border: "1.5px dashed rgba(11,21,48,.3)", borderRadius: 14, padding: "48px 24px", textAlign: "center", color: "#4A546D" }}>
        No projects yet. This is where your first project will appear.
      </div>
    </main>
  );
}
