"use client";

import { ProgressToGoalsCard } from "./sections/ProgressToGoalsCard";
import { ThisPeriodSummaryCard } from "./sections/ThisPeriodSummaryCard";
import { RecommendedActionsCard } from "./sections/RecommendedActionsCard";
import { P, totals, fmtPct, fmtMoney } from "@/lib/reach-stats/data";

export function SnapshotRow() {
  // Define goals data
  const goalsData = [
    { label: "Qualified Reach", value: 0.98, displayText: "98% of target" },
    {
      label: "Share of Voice (SOV)",
      value: totals.qrr,
      displayText: fmtPct(totals.qrr),
    },
    {
      label: "Audience Penetration",
      value: totals.apr / 0.6,
      displayText: `${fmtPct(totals.apr)} / 60%`,
    },
  ];

  // Define period metrics
  const periodMetrics = [
    {
      label: "SOV",
      change: "+5pts",
      changeColor: P.accent,
      value: fmtPct(totals.qrr),
    },
    {
      label: "CpQR",
      change: "−5%",
      changeColor: "#059669",
      value: fmtMoney(totals.avgCpqr),
    },
    {
      label: "APR",
      change: "+3pts",
      changeColor: P.accent,
      value: fmtPct(totals.apr),
    },
  ];

  // Define flags
  const flags = [
    {
      icon: "⚠",
      text: "Google Display CpQR 176% above avg",
      color: P.warn,
    },
    {
      icon: "⚠",
      text: "Meta overlap: $16.5K wasted/mo",
      color: P.caution,
    },
  ];

  // Define recommended actions
  const actions = [
    { action: "Scale TikTok spend +30%", impact: "+18% incremental QR" },
    { action: "Review Google Display", impact: "CpQR 176% above avg" },
    {
      action: "Differentiate Meta creative",
      impact: "65% overlap · $16.5K waste",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.3fr 1fr",
        gap: 14,
        marginBottom: 32,
      }}
    >
      <ProgressToGoalsCard goals={goalsData} />
      <ThisPeriodSummaryCard metrics={periodMetrics} flags={flags} />
      <RecommendedActionsCard actions={actions} />
    </div>
  );
}
