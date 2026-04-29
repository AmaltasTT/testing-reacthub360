"use client";

import { P, fmtPct } from "@/lib/reach-stats/data";
import { HBar } from "@/components/reach-stats/HBar";

interface GoalProgress {
  label: string;
  value: number; // 0-1 (progress percentage)
  displayText: string;
}

interface ProgressToGoalsCardProps {
  goals: GoalProgress[];
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

export function ProgressToGoalsCard({ goals }: ProgressToGoalsCardProps) {
  return (
    <Card>
      <Label>Progress to Goals</Label>
      {goals.map((g) => (
        <div key={g.label} style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 500 }}>{g.label}</span>
            <span
              style={{
                fontSize: 12,
                color: P.accent,
                fontWeight: 500,
                opacity: 0.7,
              }}
            >
              {g.displayText}
            </span>
          </div>
          <HBar value={Math.min(g.value, 1)} max={1} />
        </div>
      ))}
    </Card>
  );
}
