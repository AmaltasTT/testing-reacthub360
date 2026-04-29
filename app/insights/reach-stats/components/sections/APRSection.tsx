"use client";

import type {
  ReachOverviewChannelViewModel,
  ReachOverviewTotalsViewModel,
} from "@/lib/reach-stats/overview-view-model";
import { P, fmtPct } from "@/lib/reach-stats/data";

interface APRSectionProps {
  channels: ReachOverviewChannelViewModel[];
  totals: ReachOverviewTotalsViewModel;
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

const tierForPenetration = (penetration: number) => {
  if (penetration >= 0.65) {
    return { label: "Saturated", color: "#6D28D9", background: "rgba(109,40,217,0.08)" };
  }
  if (penetration >= 0.3) {
    return { label: "Scaling", color: "#8B5CF6", background: "rgba(139,92,246,0.08)" };
  }
  return { label: "Untapped", color: "#C084FC", background: "rgba(192,132,252,0.10)" };
};

export function APRSection({ channels, totals }: APRSectionProps) {
  const sortedChannels = [...channels].sort((a, b) => b.penetration - a.penetration);
  const targetApr = totals.aprTarget ?? 0.6;
  const strongestChannel = sortedChannels[0];
  const weakestChannel = [...sortedChannels].reverse().find((channel) => channel.penetration > 0);

  return (
    <>
      <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: `1px solid ${P.divider}` }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: P.accent,
                    textTransform: "uppercase",
                    padding: "2px 6px",
                    background: P.accentSoft,
                    borderRadius: 4,
                  }}
                >
                  KPI
                </span>
                <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: -0.3 }}>
                  Audience Penetration Rate
                </h3>
              </div>
              <p style={{ fontSize: 13, color: P.text3, margin: 0 }}>
                How deeply each channel reaches your target audience
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: P.text3, fontWeight: 500, marginBottom: 2 }}>
                  Mix Average
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5 }}>
                  {fmtPct(totals.apr)}
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: P.divider }} />
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: P.text3, fontWeight: 500, marginBottom: 2 }}>
                  Target
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: -0.5,
                    color: P.accent,
                  }}
                >
                  {fmtPct(targetApr)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "22px 28px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedChannels.map((channel) => {
              const tier = tierForPenetration(channel.penetration);
              const progress = Math.min(channel.penetration / Math.max(targetApr, 0.01), 1);

              return (
                <div
                  key={channel.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr 90px 80px",
                    gap: 12,
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
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {channel.name}
                    </span>
                  </div>

                  <div
                    style={{
                      position: "relative",
                      height: 12,
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: `${channel.penetration * 100}%`,
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${tier.color}88, ${tier.color})`,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: -4,
                        left: `${progress * 100}%`,
                        width: 2,
                        height: 20,
                        background: P.text3,
                        opacity: 0.45,
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>
                    {fmtPct(channel.penetration)}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: tier.color,
                        background: tier.background,
                        padding: "4px 8px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                      }}
                    >
                      {tier.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {(strongestChannel || weakestChannel) && (
            <div
              style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: `1px solid ${P.divider}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {strongestChannel && (
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(124,58,237,0.04)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.accent, marginBottom: 2 }}>
                    Best penetration
                  </div>
                  <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.45 }}>
                    <strong>{strongestChannel.name}</strong> is reaching {fmtPct(
                      strongestChannel.penetration
                    )} of target audience coverage.
                  </div>
                </div>
              )}

              {weakestChannel && (
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.05)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: P.danger, marginBottom: 2 }}>
                    Biggest headroom
                  </div>
                  <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.45 }}>
                    <strong>{weakestChannel.name}</strong> is still below {fmtPct(targetApr)}, which
                    makes it the clearest penetration upside candidate.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <AgentIQHint
        text={`APR is ${fmtPct(totals.apr)} versus a target of ${fmtPct(
          targetApr
        )}; prioritize channels still below the mix average for incremental reach.`}
        action="Model penetration lift"
      />
    </>
  );
}
