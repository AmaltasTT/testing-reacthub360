"use client";

import { FLAG_STRIPES } from "@/lib/reach-stats/data";

interface CountryFlagProps {
  code: string;
  name: string;
  size?: number;
  style?: React.CSSProperties;
}

export function CountryFlag({ code, name, size = 26, style: extra = {} }: CountryFlagProps) {
  const s = FLAG_STRIPES[code] || ["#ccc", "#eee", "#ccc"];
  return (
    <div
      title={name}
      style={{
        width: size,
        height: Math.round(size * 0.7),
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexShrink: 0,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
        cursor: "default",
        ...extra,
      }}
    >
      <div style={{ flex: 1, background: s[0] }} />
      <div style={{ flex: 1, background: s[1] }} />
      <div style={{ flex: 1, background: s[2] }} />
    </div>
  );
}
