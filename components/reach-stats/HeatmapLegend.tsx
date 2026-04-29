"use client";

import { P } from "@/lib/reach-stats/data";

export function HeatmapLegend() {
  return (
    <div
      style={{
        padding: "10px 24px 14px",
        borderTop: `1px solid ${P.divider}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 10,
        color: P.text3,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "rgba(220,38,38,0.15)",
          }}
        />
        &lt;25%
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#D4D4D8",
          }}
        />
        25–39%
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#A78BFA",
          }}
        />
        40–59%
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#7C3AED",
          }}
        />
        ≥60%
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            border: "2px solid #7C3AED",
            boxSizing: "border-box",
          }}
        />
        Best
      </div>
      <span style={{ marginLeft: "auto", fontStyle: "italic" }}>
        Bubble size = QRR strength
      </span>
    </div>
  );
}
