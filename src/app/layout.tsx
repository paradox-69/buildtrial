import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const lora = Lora({ subsets: ["latin"], style: ["italic"], weight: ["500"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "BuildTrial",
  description: "The project workspace for student builders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${lora.variable}`}
        style={{ background: "#EFEBE3", color: "#0B1530", fontFamily: "var(--font-poppins), system-ui, sans-serif", margin: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
