"use client";

import { P, ENGAGE_TOTALS } from "@/lib/engage-stats/data";
import { HBar } from "@/components/reach-stats/HBar";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      background: P.card,
      borderRadius: 14,
      padding: 28,
      boxShadow: P.shadow,
      border: `1px solid ${P.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1.2,
      color: P.text3,
      textTransform: "uppercase",
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

export function SnapshotRow() {
  const goals = [
    { label: "EIS", value: ENGAGE_TOTALS.eis / ENGAGE_TOTALS.eisTarget, displayText: "82% of target" },
    { label: "EQS", value: ENGAGE_TOTALS.eqs / ENGAGE_TOTALS.eqsTarget, displayText: "103% — above target" },
    { label: "ESR", value: ENGAGE_TOTALS.esr / ENGAGE_TOTALS.esrTarget, displayText: "78% of target" },
  ];

  const periodMetrics = [
    { label: "EQS", change: "+3%", changeColor: P.accent, value: "7.0" },
    { label: "CPQE", change: "−13%", changeColor: "#059669", value: "$0.80" },
    { label: "ESR", change: "+3pp", changeColor: P.accent, value: "65%" },
  ];

  const flags = [
    { icon: "⚠", text: "4 channels with >85% low-depth engagement", color: P.warn },
    { icon: "⚠", text: "GDN Standard EIS 3.2 — below minimum threshold", color: P.danger },
  ];

  const actions = [
    { action: "Allocate more to LinkedIn Feed & TikTok Spark", impact: "+18% qualified engagements" },
    { action: "Fix Facebook Feed distortion", impact: "62% CPE-to-CPQE gap" },
    { action: "Validate GDN traffic quality", impact: "EIS 3.2 · 89% T1 engagement" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1fr", gap: 14, marginBottom: 32 }}>
      {/* Progress to Goals */}
      <Card>
        <Label>Progress to Goals</Label>
        {goals.map((g) => (
          <div key={g.label} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{g.label}</span>
              <span style={{ fontSize: 12, color: P.accent, fontWeight: 500, opacity: 0.7 }}>
                {g.displayText}
              </span>
            </div>
            <HBar value={Math.min(g.value, 1)} max={1} />
          </div>
        ))}
      </Card>

      {/* This Period Summary */}
      <Card>
        <Label>This Period</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {periodMetrics.map((m) => (
            <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, color: P.text2 }}>{m.label}</span>
              <span style={{ fontSize: 13 }}>
                <span style={{ color: m.changeColor, fontWeight: 600 }}>{m.change}</span> → {m.value}
              </span>
            </div>
          ))}
          <div
            style={{
              fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
              color: P.text3, textTransform: "uppercase", marginBottom: 2, marginTop: 8,
            }}
          >
            Flags
          </div>
          {flags.map((flag, i) => (
            <div key={i} style={{ fontSize: 12, color: flag.color, display: "flex", alignItems: "center", gap: 6 }}>
              <span>{flag.icon}</span>
              <span>{flag.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommended Actions */}
      <Card style={{ background: P.accentFaint, border: `1px solid rgba(124,58,237,0.05)` }}>
        <Label>Recommended Actions</Label>
        {actions.map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 20, height: 20, background: P.accent, color: "#fff",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{x.action}</div>
              <div style={{ fontSize: 12, color: P.accent, opacity: 0.7 }}>{x.impact}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
