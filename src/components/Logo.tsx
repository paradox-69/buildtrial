// BuildTrial logo: the "B" trail mark with the wordmark.
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <linearGradient id="bt-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338CA" />
            <stop offset="1" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>
        <rect width="96" height="96" rx="22" fill="url(#bt-mark)" />
        <path d="M32 72V24H49a12 12 0 0 1 0 24H54a12 12 0 0 1 0 24H32M32 48H49" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="32" cy="24" r="6.5" fill="#fff" /><circle cx="32" cy="24" r="2.6" fill="#312E81" />
        <circle cx="32" cy="48" r="6.5" fill="#fff" /><circle cx="32" cy="48" r="2.6" fill="#312E81" />
        <circle cx="32" cy="72" r="6.5" fill="#fff" /><circle cx="32" cy="72" r="2.6" fill="#312E81" />
        <circle cx="66" cy="60" r="8" fill="#5EEAD4" stroke="#0B1530" strokeWidth="3" />
        <path d="M62.4 60.2l2.6 2.6 4.6-5.2" fill="none" stroke="#0B1530" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontWeight: 700, fontSize: size * 0.6, letterSpacing: "-0.03em", color: "#0B1530" }}>
        Build<span style={{ fontWeight: 400, color: "#4338CA" }}>Trial</span>
      </span>
    </span>
  );
}
