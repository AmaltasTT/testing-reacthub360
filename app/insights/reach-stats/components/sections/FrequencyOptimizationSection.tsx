"use client";

import type { ReachOverviewFrequencyViewModel } from "@/lib/reach-stats/overview-view-model";
import { P, fmt, fmtMoney, fmtSpend } from "@/lib/reach-stats/data";
import { FrequencyStatusCard } from "@/components/reach-stats/FrequencyStatusCard";
import { FrequencyEfficiencyChart } from "@/components/reach-stats/FrequencyEfficiencyChart";

interface FrequencyOptimizationSectionProps {
  data: ReachOverviewFrequencyViewModel;
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

export function FrequencyOptimizationSection({
  data,
}: FrequencyOptimizationSectionProps) {
  const sortedChannels = [...data.channels].sort((a, b) => b.wastedSpend - a.wastedSpend);
  const insights = Object.fromEntries(
    sortedChannels.map((channel) => [channel.id, channel.insight])
  );
  const topOpportunity = sortedChannels[0];

  return (
    <>
      <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "26px 30px 20px",
            borderBottom: `1px solid ${P.divider}`,
            background:
              "linear-gradient(180deg, rgba(250,249,255,0.6) 0%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: -0.3 }}>
                CPM & Frequency Efficiency
              </h3>
              <p style={{ fontSize: 13, color: P.text3, margin: "4px 0 0", lineHeight: 1.5 }}>
                Spot channels where frequency is exceeding its efficient range and inflating CPM.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: P.text3, fontWeight: 500, marginBottom: 2 }}>
                Recoverable Spend
              </div>
              <div style={{ fontSize: 22, fontWeight: 600, color: P.danger, letterSpacing: -0.5 }}>
                ${((data.totalFreqWaste ?? 0) / 1000).toFixed(1)}K
                <span style={{ fontSize: 12, fontWeight: 400, color: P.text3 }}>/mo</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 30px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {sortedChannels.slice(0, 4).map((channel) => (
              <FrequencyStatusCard
                key={channel.id}
                channel={{
                  ...channel,
                  avgFreq: channel.avgFreq,
                  optimalFreq: channel.optimalFreq,
                  wastedSpend: channel.wastedSpend,
                }}
              />
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <FrequencyEfficiencyChart
              channels={sortedChannels.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: channel.icon,
                color: channel.color,
                impressions: channel.impressions,
                uniqueReach: channel.uniqueReach,
                avgFreq: channel.avgFreq,
                optimalFreq: channel.optimalFreq,
                cpm: channel.cpm,
              }))}
              insights={insights}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
            <div
              style={{
                border: `1px solid ${P.divider}`,
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr .8fr .8fr .8fr 1fr",
                  gap: 12,
                  padding: "12px 14px",
                  background: P.bg,
                  borderBottom: `1px solid ${P.divider}`,
                  fontSize: 10,
                  fontWeight: 700,
                  color: P.text3,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                }}
              >
                <span>Channel</span>
                <span style={{ textAlign: "right" }}>Avg / Optimal</span>
                <span style={{ textAlign: "right" }}>Excess</span>
                <span style={{ textAlign: "right" }}>CpQR</span>
                <span style={{ textAlign: "right" }}>Recoverable</span>
              </div>

              {sortedChannels.map((channel) => (
                <div
                  key={channel.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr .8fr .8fr .8fr 1fr",
                    gap: 12,
                    padding: "12px 14px",
                    borderBottom: `1px solid ${P.divider}`,
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: channel.color,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {channel.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {channel.name}
                      </div>
                      <div style={{ fontSize: 11, color: P.text3 }}>{fmt(channel.impressions)} impressions</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, textAlign: "right", color: P.text2 }}>
                    {(channel.avgFreq ?? 0).toFixed(1)}x / {(channel.optimalFreq ?? 0).toFixed(1)}x
                  </div>
                  <div style={{ fontSize: 12, textAlign: "right", color: (channel.excessFreq ?? 0) > 0 ? P.danger : P.accent }}>
                    {(channel.excessFreq ?? 0) > 0 ? `+${(channel.excessFreq ?? 0).toFixed(1)}x` : "On target"}
                  </div>
                  <div style={{ fontSize: 12, textAlign: "right", color: P.text2 }}>
                    {fmtMoney(channel.cpqr)}
                  </div>
                  <div style={{ fontSize: 12, textAlign: "right", fontWeight: 600, color: P.danger }}>
                    {channel.wastedSpend > 0 ? fmtSpend(channel.wastedSpend) : "—"}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sortedChannels.slice(0, 3).map((channel) => (
                <div
                  key={channel.id}
                  style={{
                    border: `1px solid ${P.divider}`,
                    borderRadius: 14,
                    padding: 16,
                    background: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{channel.name}</div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: P.accent,
                        background: P.accentSoft,
                        padding: "4px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {channel.insight.verdict}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.5, marginBottom: 10 }}>
                    {channel.insight.detail}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: P.text3 }}>
                    <span>Unique reach: {fmt(channel.uniqueReach)}</span>
                    <span>CPM: ${(channel.cpm ?? 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {topOpportunity && (
        <AgentIQHint
          text={`${topOpportunity.name} has the largest recoverable frequency waste at ${fmtSpend(
            topOpportunity.wastedSpend
          )}.`}
          action="Reallocate budget"
        />
      )}
    </>
  );
}
