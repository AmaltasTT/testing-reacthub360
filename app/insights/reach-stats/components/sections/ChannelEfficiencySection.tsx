"use client";

import type {
  ReachOverviewChannelViewModel,
  ReachOverviewTotalsViewModel,
} from "@/lib/reach-stats/overview-view-model";
import { P, fmt, fmtMoney, fmtPct } from "@/lib/reach-stats/data";

interface ChannelEfficiencySectionProps {
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

const badge = (
  channel: ReachOverviewChannelViewModel,
  mixCpqr: number
) => {
  if (channel.spend === 0) {
    return { label: "Organic", background: P.accentFaint, color: P.accent };
  }

  const ratio = mixCpqr > 0 ? channel.cpqr / mixCpqr : 1;
  if (ratio <= 0.6) return { label: "Efficient", background: P.accentSoft, color: P.accent };
  if (ratio <= 1) return { label: "On mix", background: "rgba(0,0,0,0.03)", color: P.text2 };
  if (ratio <= 1.35) return { label: "Watch", background: P.warnBg, color: P.warn };
  return { label: "Expensive", background: P.dangerBg, color: P.danger };
};

export function ChannelEfficiencySection({
  channels,
  totals,
}: ChannelEfficiencySectionProps) {
  const paidChannels = channels.filter((channel) => channel.subtype === "paid" && channel.spend > 0);
  const organicChannels = channels.filter((channel) => channel.subtype === "organic");
  const rankedChannels = [...paidChannels].sort((a, b) => a.cpqr - b.cpqr);
  const maxCpqr = Math.max(...rankedChannels.map((channel) => channel.cpqr), totals.avgCpqr, 1);
  const maxQrr = Math.max(...channels.map((channel) => channel.qrr), totals.qrr, 1);
  const bestPaidChannel = rankedChannels[0];
  const bestOrganicChannel = [...organicChannels].sort((a, b) => b.qrr - a.qrr)[0];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card>
          <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 2px" }}>
            Channel Efficiency Ranking
          </h3>
          <p style={{ fontSize: 13, color: P.text3, margin: "0 0 14px" }}>
            CpQR versus QRR for the current filtered reach mix
          </p>

          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: P.text3 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #EDE9FE, #7C3AED)",
                }}
              />
              CpQR (lower = better)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: P.text3 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #C4B5FD, #4C1D95)",
                }}
              />
              QRR
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rankedChannels.map((channel) => {
              const channelBadge = badge(channel, totals.avgCpqr);

              return (
                <div
                  key={channel.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr 70px",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 4px",
                    borderRadius: 8,
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
                      <div style={{ fontSize: 11, color: P.text3 }}>{fmt(channel.qr)} qualified reach</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 42, fontSize: 11, color: P.text3 }}>CpQR</span>
                      <div style={{ flex: 1, height: 10, borderRadius: 999, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(channel.cpqr / maxCpqr) * 100}%`,
                            borderRadius: 999,
                            background: "linear-gradient(90deg, #EDE9FE, #7C3AED)",
                          }}
                        />
                      </div>
                      <span style={{ width: 52, textAlign: "right", fontSize: 11, fontWeight: 600 }}>
                        {fmtMoney(channel.cpqr)}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 42, fontSize: 11, color: P.text3 }}>QRR</span>
                      <div style={{ flex: 1, height: 10, borderRadius: 999, background: "rgba(0,0,0,0.05)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${(channel.qrr / maxQrr) * 100}%`,
                            borderRadius: 999,
                            background: "linear-gradient(90deg, #C4B5FD, #4C1D95)",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 46,
                          textAlign: "right",
                          fontSize: 11,
                          fontWeight: 600,
                          color: qrrColor(channel.qrr),
                        }}
                      >
                        {fmtPct(channel.qrr)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: channelBadge.color,
                        background: channelBadge.background,
                        padding: "4px 8px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                      }}
                    >
                      {channelBadge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Mix Readout</h4>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(124,58,237,0.04)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.accent, marginBottom: 4 }}>
                Blended CpQR
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{fmtMoney(totals.avgCpqr)}</div>
              <div style={{ fontSize: 11, color: P.text3 }}>Across {fmt(totals.qr)} qualified reach</div>
            </div>

            {bestPaidChannel && (
              <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(16,185,129,0.06)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                  Best paid performer
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{bestPaidChannel.name}</div>
                <div style={{ fontSize: 11, color: P.text3 }}>
                  {fmtMoney(bestPaidChannel.cpqr)} CpQR at {fmtPct(bestPaidChannel.qrr)} QRR
                </div>
              </div>
            )}

            {bestOrganicChannel && (
              <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(99,102,241,0.06)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6366F1", marginBottom: 4 }}>
                  Strongest organic lift
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{bestOrganicChannel.name}</div>
                <div style={{ fontSize: 11, color: P.text3 }}>
                  {fmtPct(bestOrganicChannel.qrr)} QRR without media spend
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {(bestPaidChannel || bestOrganicChannel) && (
        <AgentIQHint
          text={`${bestPaidChannel?.name ?? "Top paid channel"} is leading paid efficiency, while ${
            bestOrganicChannel?.name ?? "your strongest organic channel"
          } is setting the best no-spend QRR benchmark.`}
          action="Compare scenarios"
        />
      )}
    </>
  );
}
