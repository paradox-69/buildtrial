import type { CSSProperties } from "react";

// Shared colours and styles, so every screen looks the same.
export const ink = "#0B1530";
export const paper = "#EFEBE3";
export const indigo = "#4338CA";
export const muted = "#4A546D";
export const line = "rgba(11,21,48,.2)";

export const field: CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 16, borderRadius: 8,
  border: "1px solid rgba(11,21,48,.25)", background: paper, color: ink, fontFamily: "inherit",
};
export const btnPrimary: CSSProperties = {
  background: ink, color: paper, padding: "12px 24px", borderRadius: 999, fontSize: 15, fontWeight: 500,
  border: 0, cursor: "pointer", fontFamily: "inherit",
};
export const btnGhost: CSSProperties = {
  background: "none", color: ink, padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 500,
  border: "1px solid rgba(11,21,48,.3)", cursor: "pointer", fontFamily: "inherit",
};
export const pill: CSSProperties = {
  display: "inline-block", border: "1px solid " + ink, borderRadius: 999, padding: "2px 10px",
  fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase",
};
