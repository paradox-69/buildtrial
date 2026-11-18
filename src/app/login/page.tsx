"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";
import Logo from "../../components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ text: string; bad: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMsg({ text: "Check your email to confirm your account, then log in.", bad: false });
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/dashboard");
    } catch (err) {
      setMsg({ text: err instanceof Error ? err.message : "Something went wrong. Please try again.", bad: true });
    } finally {
      setBusy(false);
    }
  }

  const field: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 16, borderRadius: 8,
    border: "1px solid rgba(11,21,48,.25)", background: "#EFEBE3", color: "#0B1530", fontFamily: "inherit",
  };

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px" }}>
      <Logo />
      <h1 style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.03em", margin: "40px 0 8px" }}>
        {mode === "login" ? "Welcome back." : "Create your account."}
      </h1>
      <p style={{ margin: "0 0 28px", color: "#4A546D", fontWeight: 300 }}>
        {mode === "login" ? "Log in to your projects." : "Start tracking your project in minutes."}
      </p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 500 }}>
          Email
          <input style={{ ...field, marginTop: 6 }} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, fontWeight: 500 }}>
          Password
          <input style={{ ...field, marginTop: 6 }} type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button
          type="submit"
          disabled={busy}
          style={{ background: "#0B1530", color: "#EFEBE3", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 500, border: 0, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
        </button>
        {msg && <p role="status" style={{ margin: 0, fontSize: 14, color: msg.bad ? "#B42318" : "#0B1530" }}>{msg.text}</p>}
      </form>
      <p style={{ marginTop: 24, fontSize: 14, color: "#4A546D" }}>
        {mode === "login" ? "New here? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}
          style={{ background: "none", border: 0, padding: 0, font: "inherit", fontWeight: 600, color: "#4338CA", cursor: "pointer", textDecoration: "underline" }}
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>
    </main>
  );
}
