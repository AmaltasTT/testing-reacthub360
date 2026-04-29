"use client";

import { useState } from "react";
import type {
  ReachOverviewChannelViewModel,
  ReachOverviewTotalsViewModel,
} from "@/lib/reach-stats/overview-view-model";
import { P, fmt, fmtPct } from "@/lib/reach-stats/data";
import { ReachChannelTray } from "@/components/reach-stats/ReachChannelIcon";

interface TotalReachSectionProps {
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

const qrrColor = (ratio: number) =>
  ratio >= 0.6
    ? P.accent
    : ratio >= 0.45
      ? P.text1
      : ratio >= 0.35
        ? P.caution
        : P.danger;

export function TotalReachSection({
  channels,
  totals,
}: TotalReachSectionProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const sortedChannels = [...channels].sort((a, b) => b.reach - a.reach);
  const maxReach = Math.max(...sortedChannels.map((channel) => channel.reach), 1);
  const bestQrr = [...channels].sort((a, b) => b.qrr - a.qrr)[0];
  const highReachLowQrr = sortedChannels.find((channel) => channel.qrr < 0.4);
  const organicLeaders = channels.filter(
    (channel) => channel.subtype === "organic" && channel.qrr > totals.qrr
  );

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>
          Total Reach vs Qualified Reach
        </h3>
        <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}>
          Volume vs quality across the live channel mix
        </p>

        <div style={{ display: "flex", gap: 18, margin: "12px 0 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: P.barGrey }} />
            Total Reach
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: P.accent, opacity: 0.7 }} />
            Qualified Reach
          </div>
          <div style={{ fontSize: 12, color: P.text3, marginLeft: "auto" }}>QRR</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sortedChannels.map((channel) => (
            <div
              key={channel.id}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 56px",
                alignItems: "center",
                gap: 12,
                padding: "4px 0",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHovered(channel.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                <ReachChannelTray logoUrl={channel.logo} id={channel.id} name={channel.name} pixelSize={36} />
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

              <div style={{ position: "relative", height: 26, display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: `${(channel.reach / maxReach) * 100}%`,
                    background: P.barGrey,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 8,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 500, color: P.text3 }}>
                    {fmt(channel.reach)}
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: `${(channel.qr / maxReach) * 100}%`,
                    background: P.accent,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 8,
                    minWidth: 42,
                    opacity: hovered === channel.id ? 0.85 : 0.65,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>
                    {fmt(channel.qr)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: "right",
                  color: qrrColor(channel.qrr),
                }}
              >
                {fmtPct(channel.qrr)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px solid ${P.divider}`,
          }}
        >
          {bestQrr && (
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "rgba(76,29,149,0.04)",
                borderRadius: 8,
                borderLeft: "2px solid #4C1D95",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: "#4C1D95", marginBottom: 2 }}>
                Highest QRR
              </div>
              <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.45 }}>
                <strong>{bestQrr.name}</strong> qualifies {fmtPct(bestQrr.qrr)} of reach,
                outperforming the blended mix average of {fmtPct(totals.qrr)}.
              </div>
            </div>
          )}

          {highReachLowQrr && (
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: P.dangerBg,
                borderRadius: 8,
                borderLeft: `2px solid ${P.danger}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: P.danger, marginBottom: 2 }}>
                High Reach, Low Qualification
              </div>
              <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.45 }}>
                <strong>{highReachLowQrr.name}</strong> drives {fmt(highReachLowQrr.reach)} reach
                but only {fmtPct(highReachLowQrr.qrr)} qualifies.
              </div>
            </div>
          )}

          {organicLeaders.length > 0 && (
            <div
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "rgba(99,102,241,0.04)",
                borderRadius: 8,
                borderLeft: "2px solid #6366F1",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6366F1", marginBottom: 2 }}>
                Organic QRR Leaders
              </div>
              <div style={{ fontSize: 12, color: P.text2, lineHeight: 1.45 }}>
                {organicLeaders.map((channel) => channel.name).join(", ")} beat the blended QRR
                benchmark at $0 spend.
              </div>
            </div>
          )}
        </div>
      </Card>

      <AgentIQHint
        text={`Your blended CpQR is $${totals.avgCpqr.toFixed(2)} with ${fmtPct(
          totals.qrr
        )} QRR across ${fmt(totals.reach)} total reach.`}
        action="See scenarios"
      />
    </>
  );
}
