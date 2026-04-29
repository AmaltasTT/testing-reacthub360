"use client";

import { P } from "@/lib/reach-stats/data";

interface Action {
  action: string;
  impact: string;
}

interface RecommendedActionsCardProps {
  actions: Action[];
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

export function RecommendedActionsCard({ actions }: RecommendedActionsCardProps) {
  return (
    <Card
      style={{
        background: P.accentFaint,
        border: `1px solid rgba(124,58,237,0.05)`,
      }}
    >
      <Label>Recommended Actions</Label>
      {actions.map((x, i) => (
        <div
          key={i}
          style={{ display: "flex", gap: 10, marginBottom: 14 }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              background: P.accent,
              color: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{x.action}</div>
            <div style={{ fontSize: 12, color: P.accent, opacity: 0.7 }}>
              {x.impact}
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
