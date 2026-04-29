"use client";
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "./shared/Card";
import { InsightRibbon } from "./shared/InsightRibbon";
import { MetricCard } from "./shared/MetricCard";
import { DynamicInsightPanel } from "./shared/DynamicInsightPanel";
import { YourNextMove } from "./shared/YourNextMove";
import type { TransformedTalk } from "@/lib/reach-stats/channel-transforms";

const ACCENT = "#7652B3";
const DAYS = ["Jan 1", "Jan 5", "Jan 9", "Jan 13", "Jan 17", "Jan 21", "Jan 25", "Jan 31"];

const talkData = DAYS.map((d, i) => ({
  date: d,
  aar: [2.42, 2.64, 2.86, 3.08, 3.28, 3.48, 3.72, 3.97][i],
  cpaa: [2.18, 2.04, 1.92, 1.82, 1.72, 1.64, 1.56, 1.47][i],
  shareRate: [1.62, 1.71, 1.83, 1.98, 2.14, 2.31, 2.52, 2.63][i],
  sentiment: [68, 70, 71, 72, 74, 75, 76, 78][i],
}));

type TalkMetric = "aar" | "cpaa" | "shareRate" | "sentiment";

const metricSeries = {
  aar: { key: "aar", name: "AAR (%)", color: ACCENT },
  cpaa: { key: "cpaa", name: "CpAA ($)", color: ACCENT },
  shareRate: { key: "shareRate", name: "Share Rate (%)", color: ACCENT },
  sentiment: { key: "sentiment", name: "Positive Sentiment (%)", color: ACCENT },
} as const;

const insightItems = [
  {
    key: "aar",
    title: "Advocacy Action Rate",
    body: "Testimonials at 6.1% AAR vs product content at 2.8% - a 2x gap driven purely by content type, not audience. Format is the lever.",
  },
  {
    key: "cpaa",
    title: "Cost per Advocacy Action",
    body: "$0.92 testimonial CpAA vs $2.14 product - social proof generates earned distribution at less than half the cost. Every dollar shifted to testimonials compounds organically.",
  },
  {
    key: "shareRate",
    title: "Share Rate",
    body: "8.2K shares x ~150 organic impressions = 1.23M free impressions this period. At current CPM ($11.52), that's ~$14K in earned media value.",
  },
  {
    key: "sentiment",
    title: "Positive Sentiment Rate",
    body: "Testimonials and behind-the-scenes at 92% positive vs brand content at ~65%. Content mix is what's driving the 78% average - protect it.",
  },
];

const advocacyBreakdown = [
  { action: "Shares", volume: "1,847", pctOfTotal: "34%", cpAction: "$6.80", trend: "↑ 22%", trendColor: "text-green-600", verdict: "Scale ↑", v: "accent" as const },
  { action: "Saves", volume: "2,134", pctOfTotal: "39%", cpAction: "$8.40", trend: "↑ 18%", trendColor: "text-green-600", verdict: "Healthy", v: "default" as const },
  { action: "Positive Comments", volume: "982", pctOfTotal: "18%", cpAction: "$14.20", trend: "↑ 8%", trendColor: "text-green-600", verdict: "Monitor", v: "default" as const },
  { action: "UGC Mentions", volume: "489", pctOfTotal: "9%", cpAction: "$22.10", trend: "↑ 34%", trendColor: "text-green-600", verdict: "Growing", v: "accent" as const },
];

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const rows = [
  {
    thumbClass: "thumb-1",
    thumbType: "video",
    name: "Sarah's Transformation Story",
    meta: "Video · 30s · Feed",
    type: "Testimonial",
    typeStyle: { background: "#EDE8F7", color: "#7652B3" },
    shares: "1,420",
    sharesBold: true,
    shareRate: "6.1%",
    shareRateColor: "#7652B3",
    shareRateBold: true,
    reactions: "4,200",
    reactRate: "18.0%",
    verdict: "Boost ↑",
    verdictStyle: { background: "#EDE8F7", color: "#7652B3", border: "1px solid #EDE8F7" },
  },
  {
    thumbClass: "thumb-1",
    thumbType: "video",
    name: "Product Demo — 45s",
    meta: "Video · Feed · Mobile",
    type: "Product",
    typeStyle: { background: "#F0F1F4", color: "#4F5664" },
    shares: "1,340",
    sharesBold: false,
    shareRate: "4.8%",
    shareRateColor: "#7652B3",
    shareRateBold: false,
    reactions: "6,200",
    reactRate: "22.1%",
    verdict: "Boost ↑",
    verdictStyle: { background: "#EDE8F7", color: "#7652B3", border: "1px solid #EDE8F7" },
  },
  {
    thumbClass: "thumb-6",
    thumbType: "static",
    name: "Static Image — Generic Brand",
    meta: "Static · Feed · Desktop",
    type: "Static",
    typeStyle: { background: "#FFF1F2", color: "#E11D48" },
    shares: "280",
    sharesBold: false,
    shareRate: "0.9%",
    shareRateColor: "#E11D48",
    shareRateBold: false,
    reactions: "2,400",
    reactRate: "7.5%",
    reactRateColor: "#E11D48",
    verdict: "Pause",
    verdictStyle: { background: "#FFF1F2", color: "#E11D48", border: "1px solid #FECDD3" },
  },
];

const Thumb = ({
  thumbClass,
  type,
}: {
  thumbClass: string;
  type: string;
}) => <div className={`thumb ${thumbClass} ${type === "video" ? "video" : ""}`} />;

const TalkTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pointer-events-none max-w-[220px] rounded-lg bg-[#2D1B4E] px-3.5 py-2.5 text-white shadow-xl">
      <div className="mb-1 text-[11px] font-semibold text-white/65">{label}</div>
      <div className="space-y-1">
        {payload.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color || ACCENT }} />
            <span className="text-white/80">{item.name}</span>
            <span className="ml-auto font-mono text-[13px] font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TalkSection = ({ data }: { data?: TransformedTalk }) => {
  const chartData = data?.timeSeries ?? talkData;
  const [metric, setMetric] = useState<TalkMetric>("aar");
  const [switching, setSwitching] = useState(false);

  const switchMetric = (next: TalkMetric) => {
    if (next === metric) return;
    setSwitching(true);
    setTimeout(() => {
      setMetric(next);
      setSwitching(false);
    }, 180);
  };

  const yFormatter = (value: number) => {
    if (metric === "cpaa") return `$${Number(value).toFixed(2)}`;
    return `${value}%`;
  };

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Talk - Advocacy &amp; Earned Amplification</h2>
      </div>
      <InsightRibbon>
        Advocacy performance - <strong>{data?.summary.aar ?? "3.97%"} AAR · {data?.summary.advocacyActions ?? "12.4K"} advocacy actions · {data?.summary.cpaa ?? "$1.47"} CpAA</strong> · Shares generate 1.23M earned impressions · <strong>double testimonials and UGC mix</strong>
      </InsightRibbon>
      <div className="p-6">
        <div className="flex gap-3 flex-wrap mb-4">
          <MetricCard label="Advocacy Action Rate (AAR)" value={data?.summary.aar ?? "3.97%"} delta={data?.summary.aarDelta ? `${data.summary.aarDelta} · ${data?.summary.advocacyActions ?? "12.4K"} actions · OMTM` : "12.4K actions of 312K reached · OMTM"} selected={metric === "aar"} onClick={() => switchMetric("aar")} formula="AAR = (Shares + Comments + Saves) ÷ Reached × 100" />
          <MetricCard label="Cost per Advocacy Action (CpAA)" value={data?.summary.cpaa ?? "$1.47"} delta={data?.summary.cpaaDelta ?? "$18.2K ÷ 12.4K actions"} selected={metric === "cpaa"} onClick={() => switchMetric("cpaa")} formula="CpAA = Ad Spend ÷ Total Advocacy Actions" />
          <MetricCard label="Share Rate" value={data?.summary.shareRate ?? "2.63%"} delta={data?.summary.shareRateDelta ? `${data.summary.shareRateDelta} · highest-value signal` : "8.2K shares · highest-value signal"} selected={metric === "shareRate"} onClick={() => switchMetric("shareRate")} formula="Share Rate = Shares ÷ Reached × 100" />
          <MetricCard label="Positive Sentiment Rate" value={data?.sentiment?.formatted ?? "78%"} delta="↑ from 71% · 1.6K positive of 2.1K" selected={metric === "sentiment"} onClick={() => switchMetric("sentiment")} formula="PSR = Positive Comments ÷ Total Comments × 100" />
        </div>

        <DynamicInsightPanel items={data?.insights?.length ? data.insights : insightItems} activeKey={metric} />

        <div className={`h-52 bg-[#FDFDFE] rounded-xl p-3 mb-5 transition-opacity duration-200 ${switching ? "opacity-20" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#DFE2E8" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans", fill: "#6E7787" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#9BA3B0" }} tickFormatter={yFormatter} />
              <Tooltip content={<TalkTooltip />} cursor={false} />
              <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingBottom: 10 }} />
              <Line
                dataKey={metricSeries[metric].key}
                name={metricSeries[metric].name}
                stroke={metricSeries[metric].color}
                type="monotone"
                strokeWidth={2.5}
                dot={{ r: 4, fill: metricSeries[metric].color }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <YourNextMove
          scale={[
            { tag: "Scale", text: <><strong>Reels content budget ×2</strong> - 62% of advocacy volume, 3.8% share rate vs 1.2% Feed</> },
            { tag: "Scale", text: <><strong>UGC repurposing program</strong> - 489 mentions, 34% growth WoW, highest earned media value</> },
          ]}
          fix={[
            { tag: "Fix", text: <><strong>Feed static share rate</strong> - 1.2% vs 3.8% Reels · test interactive formats or carousel stories</> },
            { tag: "Fix", text: <><strong>Comment CpAA</strong> - $14.20 per positive comment · optimize CTA copy to encourage saves instead</> },
          ]}
          watch={[
            { tag: "Track", text: <><strong>Sentiment ratio</strong> - 82% positive stable but shipping complaints (8%) could grow during peak season</> },
            { tag: "Track", text: <><strong>Earned media value per share</strong> - 340 organic users/share · monitor for declining amplification</> },
          ]}
          impactLabel="Earned media value"
          impact="1.23M earned impressions ≈ $14.2K at $11.52 CPM - advocacy this period offset 78% of channel spend"
        />

        <div style={{ background: "#fff", border: "1px solid #E8EAF0", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Asset", "Type", "Shares", "Share Rate", "Reactions", "React. Rate", "Verdict"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 0 ? "left" : "right",
                      padding: "0.5625rem 0.75rem",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      color: "#9BA3B0",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      borderBottom: "2px solid #E8EAF0",
                      background: "#FAFBFC",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={row.name}
                  style={{ borderBottom: ri < rows.length - 1 ? "1px solid #F0F1F4" : "none", transition: "background 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FAFBFC"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <td style={{ padding: "0.6875rem 0.75rem", verticalAlign: "middle" }}>
                    <div className="creative-row">
                      <Thumb thumbClass={row.thumbClass} type={row.thumbType} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.8125rem", color: "#14171D", lineHeight: 1.3 }}>
                          {row.name}
                        </div>
                        <div style={{ fontSize: "0.6875rem", color: "#9BA3B0", marginTop: 2 }}>
                          {row.meta}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.125rem 0.5rem",
                        borderRadius: 999,
                        fontSize: "0.5625rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        ...row.typeStyle,
                      }}
                    >
                      {row.type}
                    </span>
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", fontWeight: row.sharesBold ? 600 : 400, color: "#363C47" }}>
                    {row.shares}
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.125rem 0.5rem",
                        borderRadius: 999,
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        background: row.shareRateColor === "#E11D48" ? "#FFF1F2" : "#EDE8F7",
                        color: row.shareRateColor,
                      }}
                    >
                      {row.shareRate}
                    </span>
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", color: "#363C47" }}>
                    {row.reactions}
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", color: row.reactRateColor || "#363C47" }}>
                    {row.reactRate}
                  </td>

                  <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.125rem 0.5rem",
                        borderRadius: 999,
                        fontSize: "0.625rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        ...row.verdictStyle,
                      }}
                    >
                      {row.verdict}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx global>{`
        .creative-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .thumb {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          flex-shrink: 0;
          overflow: hidden;
          position: relative;
        }

        .thumb.video::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 9px solid #fff;
          transform: translate(-42%, -50%);
        }

        .thumb-1 {
          background:
            linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
            linear-gradient(135deg, #ede8f7, #c4b5e3);
        }

        .thumb-3 {
          background: linear-gradient(135deg, #f8f6fc, #ede8f7);
        }

        .thumb-6 {
          background: linear-gradient(135deg, #f8f6fc, #ede8f7);
        }

      `}</style>
    </Card>
  );
};
