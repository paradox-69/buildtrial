"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { createClient } from "../lib/supabase";
import { btnGhost, muted } from "../lib/ui";

export default function AppHeader({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
  }

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <Link href="/dashboard" style={{ textDecoration: "none" }} aria-label="BuildTrial dashboard">
        <Logo />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
        <span style={{ color: muted }}>{email}</span>
        <button onClick={signOut} style={btnGhost}>Log out</button>
      </div>
    </header>
  );
}
