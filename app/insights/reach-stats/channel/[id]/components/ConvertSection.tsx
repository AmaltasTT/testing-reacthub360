"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "./shared/Card";
import { InsightRibbon } from "./shared/InsightRibbon";
import { MetricCard } from "./shared/MetricCard";
import { DynamicInsightPanel } from "./shared/DynamicInsightPanel";
import { YourNextMove } from "./shared/YourNextMove";
import type { TransformedConvert } from "@/lib/reach-stats/channel-transforms";

const ACCENT = "#7652B3";
const ACCENT_MUTED = "#C4B5E3";
const DAYS = ["Jan 1", "Jan 5", "Jan 9", "Jan 13", "Jan 17", "Jan 21", "Jan 25", "Jan 31"];

const convertData = DAYS.map((d, i) => ({
  date: d,
  convrate: [10.2, 11.0, 11.8, 12.4, 13.0, 13.5, 13.9, 14.4][i],
  cpc: [38.4, 35.2, 33.1, 31.8, 30.6, 29.9, 29.5, 29.21][i],
  revenue: [5200, 11800, 19400, 28600, 38200, 45800, 52400, 58200][i],
  aov: [108.0, 109.0, 105.0, 104.0, 104.0, 104.0, 102.0, 93.42][i],
  roas: [2.4, 2.6, 2.8, 2.9, 3.0, 3.1, 3.15, 3.2][i],
}));

type ConvertMetric = "convrate" | "cpc" | "revenue" | "aov" | "roas";

type Series = {
  key: "convrate" | "cpc" | "revenue" | "aov" | "roas";
  name: string;
  color: string;
  yAxisId?: "y" | "y1";
  dashed?: boolean;
};

const seriesByMetric: Record<ConvertMetric, Series[]> = {
  convrate: [
    { key: "convrate", name: "Conversion Rate (%)", color: ACCENT, yAxisId: "y" },
    { key: "roas", name: "ROAS", color: ACCENT_MUTED, yAxisId: "y1", dashed: true },
  ],
  cpc: [{ key: "cpc", name: "CpC ($)", color: ACCENT, yAxisId: "y" }],
  revenue: [{ key: "revenue", name: "Revenue ($)", color: ACCENT, yAxisId: "y" }],
  aov: [{ key: "aov", name: "AOV ($)", color: ACCENT, yAxisId: "y" }],
  roas: [{ key: "roas", name: "ROAS (x)", color: ACCENT, yAxisId: "y" }],
};

const insightItems = [
  {
    key: "convrate",
    title: "Conversion Rate",
    body: "56% add-to-cart drop-off is the first leak; 67% checkout drop-off is the bigger one. 1,267 high-intent abandoners at current AOV = ~$38K sitting on the table.",
  },
  {
    key: "roas",
    title: "ROAS",
    body: "Both audiences above 1.8x breakeven - healthy. Retargeting frequency at 6.25x will erode ROAS within 2 weeks without audience refresh.",
  },
  {
    key: "aov",
    title: "Average Order Value",
    body: "DPA Best Sellers $108 vs New Arrivals $72 - a 33% AOV gap driven purely by catalog allocation. High-Margin at $96 with 3.6x ROAS is the sweet spot.",
  },
  {
    key: "cpc",
    title: "Cost per Conversion",
    body: "Retargeting CpC up 18% WoW as frequency climbed - a leading indicator. If frequency isn't capped, CpC will keep rising while conversion rate falls.",
  },
  {
    key: "revenue",
    title: "Revenue",
    body: "$58.2K from 623 purchases - but checkout abandoners represent another ~$38K at zero incremental spend. Retargeting that segment is the fastest revenue lever.",
  },
];

const rows = [
  {
    name: "Best Sellers",
    meta: "Top 20% by revenue",
    impressions: "245K",
    clicks: "12.4K",
    atc: "2,100",
    purchases: "298",
    purchasesHighlight: true,
    roas: "4.2×",
    roasColor: "#7652B3",
    roasBold: true,
    prev: "↑ 8%",
    prevColor: "#059669",
    verdict: "Maintain",
    verdictStyle: { background: "#F0F1F4", color: "#4F5664" },
  },
  {
    name: "New Arrivals",
    meta: "Added last 30 days",
    impressions: "189K",
    clicks: "9.8K",
    atc: "1,560",
    purchases: "245",
    purchasesHighlight: false,
    roas: "2.8×",
    roasColor: "#363C47",
    roasBold: false,
    prev: "↑ 22%",
    prevColor: "#059669",
    verdict: "Scale ↑",
    verdictStyle: { background: "#EDE8F7", color: "#7652B3", border: "1px solid #EDE8F7" },
  },
  {
    name: "High-Margin Products",
    meta: "Custom product set",
    impressions: "78K",
    clicks: "3.2K",
    atc: "661",
    purchases: "80",
    purchasesHighlight: false,
    roas: "3.6×",
    roasColor: "#7652B3",
    roasBold: false,
    prev: "↑ 15%",
    prevColor: "#059669",
    verdict: "Scale ↑",
    verdictStyle: { background: "#EDE8F7", color: "#7652B3", border: "1px solid #EDE8F7" },
  },
];

const mono = { fontFamily: "'JetBrains Mono', monospace" };

const ConvertTooltip = ({
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

export const ConvertSection = ({ data }: { data?: TransformedConvert }) => {
  const chartData = data?.timeSeries ?? convertData;
  const [metric, setMetric] = useState<ConvertMetric>("convrate");
  const [switching, setSwitching] = useState(false);

  const activeSeries = seriesByMetric[metric];
  const hasRightAxis = activeSeries.some((series) => series.yAxisId === "y1");

  const switchMetric = (next: ConvertMetric) => {
    if (next === metric) return;
    setSwitching(true);
    setTimeout(() => {
      setMetric(next);
      setSwitching(false);
    }, 180);
  };

  const yFormatter = (value: number) => {
    if (metric === "convrate") return `${value}%`;
    if (metric === "roas") return `${Number(value).toFixed(1)}x`;
    if (metric === "cpc" || metric === "aov") return `$${Number(value).toFixed(2)}`;
    if (metric === "revenue") return value >= 1000 ? `$${(value / 1000).toFixed(0)}K` : `$${value}`;
    return `${value}`;
  };

  return (
    <Card>
      <div className="px-7 py-5">
        <h2 className="text-base font-bold tracking-tight">Convert - Purchases, Revenue &amp; Conversion Efficiency</h2>
      </div>
      <InsightRibbon>
        Direct-response performance - <strong>{data?.summary.purchases ?? "623"} purchases at {data?.summary.conversionRate ?? "14.4%"} CR · {data?.summary.revenue ?? "$58.2K"} revenue · {data?.summary.roas ?? "3.2×"} ROAS</strong> · {data?.summary.cartAbandonmentRate ?? "67%"} checkout drop-off is the biggest leak · <strong>retarget abandoners, fix checkout friction</strong>
      </InsightRibbon>
      <div className="p-6">
        <div className="flex gap-3 flex-wrap mb-4">
          <MetricCard label="Conversion Rate" value={data?.summary.conversionRate ?? "14.4%"} delta={data?.summary.conversionRateDelta ? `${data.summary.conversionRateDelta} · Cart to Purchase · OMTM` : "Cart to Purchase · OMTM"} selected={metric === "convrate"} onClick={() => switchMetric("convrate")} formula="CR = Conversions ÷ Opportunities × 100" />
          <MetricCard label="Cost per Conversion (CpC)" value={data?.summary.costPerConversion ?? "$29.21"} delta={data?.summary.costPerConversionDelta ?? "Down 6%"} selected={metric === "cpc"} onClick={() => switchMetric("cpc")} formula="CpC = Ad Spend ÷ Total Conversions" />
          <MetricCard label="Revenue" value={data?.summary.revenue ?? "$58.2K"} delta={data?.summary.revenueDelta ? `${data.summary.revenueDelta} · ${data?.summary.purchases ?? "623"} purchases` : "Up 31% · 623 purchases"} selected={metric === "revenue"} onClick={() => switchMetric("revenue")} formula="Revenue = Σ(Purchase Values)" />
          <MetricCard label="Avg. Order Value (AOV)" value={data?.summary.aov ?? "$93.42"} delta={data?.summary.aovDelta ? `${data.summary.aovDelta}` : "$58.2K ÷ 623 purchases"} selected={metric === "aov"} onClick={() => switchMetric("aov")} formula="AOV = Total Revenue ÷ Number of Purchases" />
          <MetricCard label="ROAS" value={data?.summary.roas ?? "3.2×"} delta={data?.summary.roasDelta ?? "Up 8%"} selected={metric === "roas"} onClick={() => switchMetric("roas")} formula="ROAS = Revenue ÷ Ad Spend" />
        </div>

        <DynamicInsightPanel items={data?.insights?.length ? data.insights : insightItems} activeKey={metric} />

        <div className={`h-64 rounded-xl bg-[#FDFDFE] p-3 mb-5 transition-opacity duration-200 ${switching ? "opacity-20" : "opacity-100"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#DFE2E8" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans", fill: "#6E7787" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="y" tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#9BA3B0" }} tickFormatter={yFormatter} />
              <YAxis
                yAxisId="y1"
                orientation="right"
                hide={!hasRightAxis}
                tick={{ fontSize: 10, fontFamily: "JetBrains Mono", fill: "#9BA3B0" }}
                tickFormatter={(v) => `${Number(v).toFixed(1)}x`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ConvertTooltip />} cursor={false} />
              <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", paddingBottom: 10 }} />
              {activeSeries.map((series) => (
                <Line
                  key={series.key}
                  yAxisId={series.yAxisId || "y"}
                  dataKey={series.key}
                  name={series.name}
                  type="monotone"
                  stroke={series.color}
                  strokeWidth={series.key === "convrate" ? 2.5 : 2.25}
                  strokeDasharray={series.dashed ? "4 3" : undefined}
                  dot={{ r: 4, fill: series.color }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <YourNextMove
          scale={[
            { tag: "Scale", text: <><strong>Checkout abandoner retargeting</strong> - 1,267 high-intent users dropped off · 7-day window dynamic product ads</> },
            { tag: "Scale", text: <><strong>25-34 Female budget +30%</strong> - 58% of revenue, lowest CpC at $18.21</> },
          ]}
          fix={[
            { tag: "Fix", text: <><strong>Checkout flow friction</strong> - 67% drop-off suggests UX issues · A/B test simplified checkout</> },
            { tag: "Fix", text: <><strong>AOV decline</strong> - $93.42 from $108.33 · add upsell/cross-sell at cart</> },
          ]}
          watch={[
            { tag: "Track", text: <><strong>ROAS by campaign</strong> - Retargeting 3.1x at 71% saturation may decline · New Audiences 2.8x with headroom</> },
            { tag: "Track", text: <><strong>CpC trend post-checkout fix</strong> - expect $29.21 to $24 with reduced abandonment</> },
          ]}
        />

        <div className="w-full mb-5">
          <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-0">
            <div
              style={{
                background: "#F5F6F8",
                border: "1px solid #DFE2E8",
                borderRadius: "12px 0 0 12px",
                padding: "0.875rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.5rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9BA3B0", marginBottom: "0.375rem" }}>
                Add to Cart
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 700, color: "#242830" }}>
                4,321
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#9BA3B0", marginTop: "0.25rem" }}>
                100% of funnel
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 0.125rem",
                background: "#FAFBFC",
                borderTop: "1px solid #DFE2E8",
                borderBottom: "1px solid #DFE2E8",
                minWidth: 72,
              }}
            >
              <div style={{ fontSize: "0.875rem", color: "#E11D48" }}>→</div>
              <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "#E11D48", marginTop: "0.1rem" }}>−2,431 lost</div>
              <div style={{ fontSize: "0.5rem", color: "#9BA3B0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "0.1rem" }}>
                56% drop-off
              </div>
            </div>

            <div
              style={{
                background: "#F5F6F8",
                border: "1px solid #DFE2E8",
                padding: "0.875rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.5rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9BA3B0", marginBottom: "0.375rem" }}>
                Checkout Initiated
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 700, color: "#242830" }}>
                1,890
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#9BA3B0", marginTop: "0.25rem" }}>
                44% of funnel
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 0.125rem",
                background: "#FAFBFC",
                borderTop: "1px solid #DFE2E8",
                borderBottom: "1px solid #DFE2E8",
                minWidth: 72,
              }}
            >
              <div style={{ fontSize: "0.875rem", color: "#E11D48" }}>→</div>
              <div style={{ fontSize: "0.625rem", fontWeight: 700, color: "#E11D48", marginTop: "0.1rem" }}>−1,267 lost</div>
              <div style={{ fontSize: "0.5rem", color: "#9BA3B0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: "0.1rem" }}>
                67% drop-off
              </div>
            </div>

            <div
              style={{
                background: "#F8F6FC",
                border: "1px solid #EDE8F7",
                borderRadius: "0 12px 12px 0",
                padding: "0.875rem 1rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "0.5rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7652B3", marginBottom: "0.375rem" }}>
                Purchase
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.25rem", fontWeight: 700, color: "#7652B3" }}>
                {data?.summary.purchases ?? "623"}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#7652B3", opacity: 0.7, marginTop: "0.25rem" }}>
                {data?.summary.conversionRate ?? "14.4%"} of funnel
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <div className="flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">!</span>
            <div>
              <h5 className="text-[13px] font-bold mb-0.5">67% drop-off between Checkout Initiated to Purchase</h5>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                1,890 started checkout, only 623 completed. 1,267 high-intent users abandoned.
                Action: Build a custom audience of checkout abandoners (7-day window) and retarget with dynamic product ads.
              </p>
            </div>
          </div>
        </div> */}

        <div style={{ marginTop: "1.25rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem", color: "#14171D" }}>
            Product Catalog Ads (DPA)
          </div>

          <div style={{ background: "#fff", border: "1px solid #E8EAF0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Catalog Segment", "Impressions", "Clicks", "ATC", "Purchases", "ROAS", "vs Prev", "Verdict"].map((h, i) => (
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
                    <td style={{ padding: "0.6875rem 0.75rem", fontSize: "0.8125rem", verticalAlign: "middle" }}>
                      <div style={{ fontWeight: 600, color: "#14171D" }}>{row.name}</div>
                      <div style={{ fontSize: "0.6875rem", color: "#9BA3B0", marginTop: 2 }}>{row.meta}</div>
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", color: "#363C47" }}>
                      {row.impressions}
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", color: "#363C47" }}>
                      {row.clicks}
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", color: "#363C47" }}>
                      {row.atc}
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", fontWeight: row.purchasesHighlight ? 600 : 400, color: "#363C47" }}>
                      {row.purchases}
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem", fontWeight: row.roasBold ? 600 : 400, color: row.roasColor }}>
                      {row.roas}
                    </td>

                    <td style={{ padding: "0.6875rem 0.75rem", textAlign: "right", verticalAlign: "middle", ...mono, fontSize: "0.8125rem" }}>
                      <span style={{ fontSize: "0.5625rem", fontWeight: 600, color: row.prevColor }}>
                        {row.prev}
                      </span>
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
      </div>
    </Card>
  );
};
