import Link from "next/link";
import Logo from "../components/Logo";

export default function Home() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <Link href="/login" style={{ fontSize: 14, fontWeight: 500 }}>Log in</Link>
      </header>
      <section style={{ padding: "96px 0" }}>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1, margin: 0 }}>
          From idea to{" "}
          <em style={{ fontFamily: "var(--font-lora), serif", fontWeight: 500, color: "#4338CA" }}>verified fix.</em>
        </h1>
        <p style={{ maxWidth: 520, margin: "24px 0 32px", color: "#4A546D", fontWeight: 300, fontSize: 18 }}>
          Plan your project, keep every bug and fix in one place, and hand your guide one clean report.
        </p>
        <Link
          href="/login"
          style={{ display: "inline-block", background: "#0B1530", color: "#EFEBE3", padding: "14px 28px", borderRadius: 999, fontWeight: 500, textDecoration: "none" }}
        >
          Get started
        </Link>
      </section>
    </main>
  );
}
