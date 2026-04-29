"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  P,
  enrichedChannels,
  totals,
  fmt,
  fmtPct,
  fmtMoney,
  type Channel,
} from "@/lib/reach-stats/data";
import { useChannelsList, type ChannelListItem } from "@/hooks/use-channel-drilldown";
import { pathWithCampaignSearchParam } from "@/lib/insights-campaign-url";
import { Skeleton } from "@/components/ui/skeleton";

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

const qrrColor = (r: number) =>
  r >= 0.6
    ? P.accent
    : r >= 0.45
      ? P.text1
      : r >= 0.35
        ? P.caution
        : P.danger;

const badge = (_ch: Channel) => null;

// Convert period key + custom range to ISO date strings
function periodToDates(period: string, customRange: { from: string; to: string }) {
  if (period === "custom") return { date_from: customRange.from, date_to: customRange.to };
  const days = parseInt(period); // "7d"→7, "14d"→14, "30d"→30, "90d"→90
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - days);
  const toIso = (d: Date) => d.toISOString().slice(0, 10);
  return { date_from: toIso(from), date_to: toIso(to) };
}

function firstPositiveNumber(...vals: Array<number | undefined | null>): number | null {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  }
  return null;
}

/**
 * Qualified reach for the channel grid. Prefer explicit API fields; if all are zero,
 * approximate from reach × engagement rate (%) so QRR / CpQR are not stuck at 0 when
 * the backend omits ICP reach (common when `icp_reach` is not populated yet).
 */
function qualifiedReachFromListMetrics(m: NonNullable<ChannelListItem["metrics"]>): number {
  const direct = firstPositiveNumber(
    m.qualified_reach,
    m.qr,
    m.icp_reach
  );
  if (direct != null) return direct;

  const reach = m.reach ?? 0;
  const er = m.engagement_rate ?? 0;
  if (reach <= 0 || er <= 0) return 0;
  // Treat engagement_rate as 0–100%+ ; cap effective share at 100% for this proxy.
  const share = Math.min(Math.max(er / 100, 0), 1);
  return Math.round(reach * share);
}

// Adapter: API channel → Channel-like shape for display
function apiChannelToDisplay(ch: ChannelListItem) {
  const m = ch.metrics;
  const icon = ch.name.charAt(0).toUpperCase();
  const colorMap: Record<string, string> = {
    "Facebook": "#1877F2", "Instagram": "#E4405F", "Google": "#4285F4",
    "TikTok": "#010101", "YouTube": "#FF0000", "Youtube": "#FF0000",
    "LinkedIn": "#0A66C2", "Pinterest": "#E60023", "Snapchat": "#F7D731",
    "Bing": "#00A4EF", "Microsoft": "#00A4EF", "Mailchimp": "#FFE01B",
  };
  const colorKey = Object.keys(colorMap).find((k) => ch.name.includes(k) || ch.provider_name.includes(k));
  const color = colorKey ? colorMap[colorKey] : "#7C3AED";

  const reach = m?.reach ?? 0;
  const qr = m ? qualifiedReachFromListMetrics(m) : 0;
  const spend = m?.spend ?? 0;
  const qrr = reach > 0 ? qr / reach : 0;
  const cpqr = qr > 0 ? spend / (qr / 1000) : 0;
  const logoUrl = typeof ch.logo === "string" ? ch.logo : ch.logo?.url ?? null;

  return {
    id: String(ch.id),
    name: ch.name,
    icon,
    color,
    logoUrl,
    type: ch.provider_name,
    subtype: ch.type as "paid" | "organic",
    reach,
    qr,
    spend,
    viewability: 0,
    penetration: 0,
    campaigns: 0,
    trend: 0,
    account: ch.provider_name,
    accountId: "",
    accountLabel: "",
    idLabel: "",
    qrr,
    cpqr,
    status: ch.status,
    _formatted: {
      reach: fmt(reach),
      qr: fmt(qr),
      qrr: fmtPct(qrr),
      cpqr: qr > 0 && spend > 0 ? fmtMoney(cpqr) : "—",
    },
  };
}

interface ChannelPerformanceTabProps {
  selectedCampaigns?: string[];
  selectedPeriod?: string;
  customDateRange?: { from: string; to: string };
}

export function ChannelPerformanceTab({
  selectedCampaigns = ["all"],
  selectedPeriod = "30d",
  customDateRange = { from: "", to: "" },
}: ChannelPerformanceTabProps) {
  const router = useRouter();
  const [drilldownFilter, setDrilldownFilter] = useState("all");
  const campaignId = selectedCampaigns[0] !== "all"
    ? parseInt(selectedCampaigns[0])
    : undefined;
  const { date_from, date_to } = periodToDates(selectedPeriod, customDateRange);

  // API data for non-demo users
  const { data: apiChannels, isLoading: isApiLoading } = useChannelsList({
    date_from,
    date_to,
    campaign_id: campaignId,
  });

  // Determine data source
  const channels = useMemo(() => {
    if (!apiChannels) {
      return enrichedChannels.map((ch) => ({
        ...ch,
        _formatted: {
          reach: fmt(ch.reach),
          qr: fmt(ch.qr),
          qrr: fmtPct(ch.qrr ?? 0),
          cpqr: fmtMoney(ch.cpqr ?? 0),
        },
      }));
    }
    return apiChannels.map(apiChannelToDisplay);
  }, [apiChannels]);

  const filteredChannels = channels
    .filter((c) => drilldownFilter === "all" ? true : c.subtype === drilldownFilter)
    .sort((a, b) => b.qr - a.qr);

  const totalQr = channels.reduce((s, c) => s + c.qr, 0);
  const totalSpend = channels.reduce((s, c) => s + c.spend, 0);
  const avgCpqr = totalQr > 0 ? totalSpend / (totalQr / 1000) : 0;
  const totalCampaigns = filteredChannels.reduce((s, c) => s + c.campaigns, 0);

  const isLoading = isApiLoading;

  return (
    <>
      {/* ═══════════════ FILTER BAR ═══════════════ */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        {[
          { key: "all", label: "All Channels" },
          { key: "paid", label: "Paid" },
          { key: "organic", label: "Organic" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setDrilldownFilter(f.key)}
            style={{
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 6,
              border: `1px solid ${drilldownFilter === f.key ? P.accent : P.divider}`,
              background: drilldownFilter === f.key ? P.accentSoft : P.card,
              color: drilldownFilter === f.key ? P.accent : P.text2,
              cursor: "pointer",
            }}
          >
            {f.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: P.text3 }}>
          {filteredChannels.length} channels · {totalCampaigns} active campaigns
        </div>
      </div>

      {/* ═══════════════ CHANNEL PERFORMANCE TABLE ═══════════════ */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Channel", "QR Contribution", "QRR", "CpQR", "Campaigns", "Account", ""].map((h, hi) => (
                    <th
                      key={h + hi}
                      style={{
                        padding: "12px 14px",
                        textAlign: hi === 0 || hi === 5 ? "left" : hi >= 6 ? "center" : "right",
                        fontSize: 10,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        color: P.text3,
                        fontWeight: 600,
                        borderBottom: `1px solid ${P.divider}`,
                        background: P.bg,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredChannels.map((ch) => {
                  const qrShare = totalQr > 0 ? ch.qr / totalQr : 0;
                  return (
                    <tr
                      key={ch.id}
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = P.bg}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Channel name & icon */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {(ch as any).logoUrl ? (
                            <img
                              src={(ch as any).logoUrl}
                              alt={ch.name}
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 7,
                                objectFit: "contain",
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div style={{
                              width: 30,
                              height: 30,
                              borderRadius: 7,
                              background: ch.color,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 700,
                              flexShrink: 0
                            }}>
                              {ch.icon}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{ch.name}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 11, color: P.text3 }}>{ch._formatted.reach} reach</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* QR Contribution */}
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                          <div style={{
                            width: 60,
                            height: 6,
                            background: P.barGrey,
                            borderRadius: 3,
                            overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${qrShare * 100}%`,
                              height: "100%",
                              background: P.accent,
                              borderRadius: 3,
                              opacity: 0.6
                            }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{ch._formatted.qr}</span>
                          <span style={{ fontSize: 10, color: P.text3 }}>{fmtPct(qrShare)}</span>
                        </div>
                      </td>

                      {/* QRR */}
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: qrrColor(ch.qrr ?? 0) }}>
                          {ch._formatted.qrr}
                        </span>
                      </td>

                      {/* CpQR */}
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        {(ch.cpqr ?? 0) > 0 ? (
                          <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: (ch.cpqr ?? 0) <= 3 ? P.text1 : (ch.cpqr ?? 0) <= 6 ? P.caution : P.danger
                          }}>
                            {ch._formatted.cpqr}
                          </span>
                        ) : (
                          <span style={{ fontSize: 12, color: P.text3 }}>—</span>
                        )}
                      </td>

                      {/* Campaigns */}
                      <td style={{ padding: "12px 14px", textAlign: "right" }}>
                        {ch.campaigns > 0 ? (
                          <span style={{ fontSize: 14, fontWeight: 700 }}>{ch.campaigns}</span>
                        ) : (
                          <span style={{ fontSize: 12, color: P.text3 }}>—</span>
                        )}
                      </td>

                      {/* Account info */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>{ch.account}</div>
                        <div style={{
                          fontSize: 10,
                          color: P.text3,
                          fontFamily: "SF Mono, Menlo, monospace"
                        }}>
                          {ch.accountId}
                        </div>
                      </td>

                      {/* Drill down button */}
                      <td style={{ padding: "12px 14px", textAlign: "center" }}>
                        <button
                          onClick={() =>
                            router.push(
                              pathWithCampaignSearchParam(
                                `/insights/reach-stats/channel/${ch.id}`,
                                selectedCampaigns[0]
                              )
                            )
                          }
                          style={{
                            padding: "6px 14px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: P.accent,
                            color: "#fff",
                            border: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Drill Down →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table footer with totals */}
            <div style={{
              padding: "12px 18px",
              borderTop: `1px solid ${P.divider}`,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 12,
              color: P.text3
            }}>
              <span>
                Total QR: <strong style={{ color: P.text1 }}>{fmt(totalQr)}</strong> across {channels.length} channels
              </span>
              <span>
                Channel Mix CpQR: <strong style={{ color: "#6366F1" }}>{fmtMoney(avgCpqr)}</strong>
              </span>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
