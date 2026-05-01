"use client";

import { useState } from "react";
import type { ReachOverviewOverlapViewModel } from "@/lib/reach-stats/overview-view-model";
import { P, fmt, fmtSpend } from "@/lib/reach-stats/data";

interface OverlapAnalysisSectionProps {
  data: ReachOverviewOverlapViewModel;
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

const AgentIQHint = ({ text, action }: { text: string; action: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background:
        "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(139,92,246,0.07) 100%)",
      borderRadius: 8,
      border: "1px solid rgba(124,58,237,0.08)",
      marginTop: 10,
      cursor: "pointer",
    }}
  >
    <span style={{ fontSize: 13, color: P.accent }}>✦</span>
    <span style={{ fontSize: 12, color: P.text2, flex: 1 }}>{text}</span>
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: P.accent,
        whiteSpace: "nowrap",
      }}
    >
      {action} →
    </span>
  </div>
);

const severityColors: Record<string, string> = {
  high: P.danger,
  moderate: P.caution,
  low: P.accent,
};

export function OverlapAnalysisSection({ data }: OverlapAnalysisSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sortedOverlaps = [...data.overlaps].sort((a, b) => b.wastedSpend - a.wastedSpend);
  const topOverlap = sortedOverlaps[0];

  return (
    <>
      <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "24px 28px 18px",
            borderBottom: `1px solid ${P.divider}`,
            background:
              "linear-gradient(180deg, rgba(250,249,255,0.5) 0%, transparent 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: -0.3 }}>
                Audience Overlap
              </h3>
              <p style={{ fontSize: 13, color: P.text3, margin: "4px 0 0" }}>
                Where your channels share the same users and what it costs
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: P.text3, fontWeight: 500, marginBottom: 2 }}>
                Redundant Spend
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: P.caution, letterSpacing: -0.5 }}>
                {((data.totalOverlapWaste ?? 0) / 1000).toFixed(1)}K
                <span style={{ fontSize: 12, fontWeight: 400, color: P.text3 }}>/mo</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {sortedOverlaps.slice(0, 6).map((overlap, index) => {
              const isHovered = hoveredIndex === index;
              const severityColor = severityColors[overlap.severity] ?? P.accent;
              const shareOfCombined =
                overlap.totalCombined > 0 ? overlap.shared / overlap.totalCombined : overlap.overlap;

              return (
                <div
                  key={`${overlap.pair.join("-")}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    borderRadius: 16,
                    border: `1.5px solid ${isHovered ? `${severityColor}40` : P.divider}`,
                    background: isHovered ? `${severityColor}06` : "#fff",
                    boxShadow: isHovered
                      ? `0 10px 28px ${severityColor}10`
                      : "0 1px 3px rgba(0,0,0,0.03)",
                    padding: 16,
                    transition: "all 0.25s ease",
                    transform: isHovered ? "translateY(-2px)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      {[0, 1].map((pairIndex) => (
                        <div
                          key={pairIndex}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            background: overlap.pairColors[pairIndex],
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {overlap.pairIcons[pairIndex]}
                        </div>
                      ))}
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          letterSpacing: -0.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {overlap.pair.join(" × ")}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: severityColor,
                        background: `${severityColor}14`,
                        padding: "4px 8px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                      }}
                    >
                      {overlap.severity}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: `${overlap.pairColors[0]}2A`,
                        border: `2px solid ${overlap.pairColors[0]}`,
                        marginRight: -18,
                      }}
                    />
                    <div
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: `${overlap.pairColors[1]}2A`,
                        border: `2px solid ${overlap.pairColors[1]}`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 18,
                          borderRadius: "50%",
                          background: `${severityColor}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: severityColor,
                        }}
                      >
                        {((overlap.overlap ?? 0) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(0,0,0,0.03)" }}>
                      <div style={{ fontSize: 10, color: P.text3, fontWeight: 600, marginBottom: 4 }}>
                        Shared audience
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{fmt(overlap.shared)}</div>
                      <div style={{ fontSize: 11, color: P.text3 }}>{((shareOfCombined ?? 0) * 100).toFixed(0)}% of combined</div>
                    </div>
                    <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(0,0,0,0.03)" }}>
                      <div style={{ fontSize: 10, color: P.text3, fontWeight: 600, marginBottom: 4 }}>
                        Wasted spend
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: severityColor }}>
                        {fmtSpend(overlap.wastedSpend)}
                      </div>
                      <div style={{ fontSize: 11, color: P.text3 }}>estimated monthly overlap cost</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.5, marginBottom: 8 }}>
                    {overlap.insight}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: severityColor }}>{overlap.action}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {topOverlap && (
        <AgentIQHint
          text={`${topOverlap.pair.join(
            " and "
          )} have the largest overlap burden, with ${fmtSpend(topOverlap.wastedSpend)} in redundant spend.`}
          action="Review overlap action"
        />
      )}
    </>
  );
}
