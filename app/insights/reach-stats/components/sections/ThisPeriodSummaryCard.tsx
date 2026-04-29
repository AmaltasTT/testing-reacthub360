"use client";

import { P, fmtPct, fmtMoney } from "@/lib/reach-stats/data";

interface PeriodMetric {
  label: string;
  change: string; // e.g., "+5pts", "−5%"
  changeColor: string;
  value: string; // Formatted value
}

interface Flag {
  icon: string;
  text: string;
  color: string;
}

interface ThisPeriodSummaryCardProps {
  metrics: PeriodMetric[];
  flags: Flag[];
}

const Card = ({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
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

export function ThisPeriodSummaryCard({
  metrics,
  flags,
}: ThisPeriodSummaryCardProps) {
  return (
    <Card>
      <Label>This Period</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {metrics.map((m) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 13, color: P.text2 }}>{m.label}</span>
            <span style={{ fontSize: 13 }}>
              <span style={{ color: m.changeColor, fontWeight: 600 }}>
                {m.change}
              </span>{" "}
              → {m.value}
            </span>
          </div>
        ))}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.6,
            color: P.text3,
            textTransform: "uppercase",
            marginBottom: 2,
            marginTop: 8,
          }}
        >
          Flags
        </div>
        {flags.map((flag, i) => (
          <div
            key={i}
            style={{
              fontSize: 12,
              color: flag.color,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{flag.icon}</span>
            <span>{flag.text}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
