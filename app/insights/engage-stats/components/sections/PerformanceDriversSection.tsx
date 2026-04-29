"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  P, EIS_TREND_DATA, EIS_CHANNEL_DATA, EQS_CHANNEL_DATA, ESR_CHANNEL_DATA,
  ENGAGE_TOTALS,
} from "@/lib/engage-stats/data";

type MetricKey = "EIS" | "EQS" | "ESR";

const METRIC_CONFIG = {
  EIS: {
    label: "EIS",
    fullName: "Engagement Impact Score (EIS)",
    description: <>EIS is above benchmark and accelerating. <strong>LinkedIn and TikTok are driving composite quality.</strong></>,
    value: ENGAGE_TOTALS.eis,
    change: "+0.3 vs prior",
    tooltip: {
      title: "EIS – Engagement Impact Score",
      desc: "Composite impact score reflecting both engagement quality and stickiness.",
      thresholds: ["> 7.0 → Strong, scalable engagement impact", "5.0–7.0 → Developing impact", "< 5.0 → Limited effectiveness"],
    },
    channels: EIS_CHANNEL_DATA,
    chartKey: "eis",
    yDomain: [0, 10] as [number, number],
    yTicks: [0, 2, 4, 6, 8, 10],
  },
  EQS: {
    label: "EQS",
    fullName: "Engagement Quality Score (EQS)",
    description: <>EQS crossed 7.0 — highest recorded. <strong>Tier 3 signals (saves, shares, reposts) driving the lift.</strong></>,
    value: ENGAGE_TOTALS.eqs,
    change: "+3% vs prior",
    tooltip: {
      title: "EQS – Engagement Quality Score",
      desc: "Measures interaction depth by weighting high-intent engagement signals.",
      thresholds: ["> 7.0 → Strong depth of engagement", "5.0–7.0 → Moderate interaction depth", "< 5.0 → Shallow engagement"],
    },
    channels: EQS_CHANNEL_DATA,
    chartKey: "eqs",
    yDomain: [0, 10] as [number, number],
    yTicks: [0, 2, 4, 6, 8, 10],
  },
  ESR: {
    label: "ESR",
    fullName: "Engagement Stickiness Rate (ESR)",
    description: <>ESR trending positive. <strong>Cost per qualified engagement improving across top channels.</strong></>,
    value: ENGAGE_TOTALS.esr,
    change: "+3pp vs prior",
    tooltip: {
      title: "ESR – Engagement Stickiness Rate",
      desc: "Measures Brand Recall Potential based on the share of deep, memory-forming engagement.",
      thresholds: ["> 70% → High recall formation", "50–70% → Moderate recall potential", "< 50% → Weak memory encoding"],
    },
    channels: ESR_CHANNEL_DATA,
    chartKey: "esr",
    yDomain: [0, 100] as [number, number],
    yTicks: [0, 20, 40, 60, 80, 100],
  },
};

const WHAT_NEXT: Record<MetricKey, Array<{ label: string; title: string; text: string; color: string }>> = {
  EIS: [
    { label: "ALLOCATE MORE", title: "LinkedIn · TikTok", text: "CPQE improving. High EIS efficiency. Prioritize incremental budget.", color: "rgba(5,150,105,0.9)" },
    { label: "CORRECT DISTORTION", title: "YouTube · Google · Instagram · Facebook", text: "High CPQE gap. Optimize creative before scaling.", color: "rgba(245,158,11,0.9)" },
    { label: "VALIDATE TRAFFIC", title: "GDN Display", text: "Low EIS relative to cost. Confirm downstream quality before spend expansion.", color: "rgba(220,38,38,0.9)" },
  ],
  EQS: [
    { label: "ALLOCATE MORE", title: "LinkedIn · TikTok", text: "High-depth formats driving T3 signals. Increase production.", color: "rgba(5,150,105,0.9)" },
    { label: "CORRECT DISTORTION", title: "Instagram", text: "EQS declining. Refresh creative format and test content depth variations.", color: "rgba(245,158,11,0.9)" },
    { label: "VALIDATE TRAFFIC", title: "Signal weighting", text: "T3 actions (saves, shares) weighted 3x. Prioritize signal-rich formats.", color: "rgba(220,38,38,0.9)" },
  ],
  ESR: [
    { label: "ALLOCATE MORE", title: "LinkedIn · TikTok", text: "Strong stickiness and retention. Increase frequency and budget allocation.", color: "rgba(5,150,105,0.9)" },
    { label: "CORRECT DISTORTION", title: "Mid-tier channels", text: "Stickiness narrowing. Test new distribution windows and creative variations.", color: "rgba(245,158,11,0.9)" },
    { label: "VALIDATE TRAFFIC", title: "Frequency cap", text: "ESR declines at 7+ impressions/user/week. Monitor saturation thresholds.", color: "rgba(220,38,38,0.9)" },
  ],
};

const DIAGNOSTIC: Record<MetricKey, string> = {
  EIS: "EIS growth is currently driven by strengthening ESR while EQS remains stable.",
  EQS: "Depth of engagement improving across top-performing channels.",
  ESR: "Stickiness expanding on LinkedIn and TikTok, increasing recall potential.",
};

export function PerformanceDriversSection() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("EIS");
  const [showTooltip, setShowTooltip] = useState<MetricKey | null>(null);
  const config = METRIC_CONFIG[selectedMetric];

  // Normalize all three metrics to the same 0–100 scale so they can be plotted together.
  // EIS/EQS are on a 0–10 scale → multiply by 10. ESR is already 0–100 (integer %).
  const normalizedTrendData = EIS_TREND_DATA.map(d => ({
    week: d.week,
    eis: Math.round(d.eis * 10),
    eqs: Math.round(d.eqs * 10),
    esr: d.esr,
  }));

  const formatValue = (v: number) => {
    if (selectedMetric === "ESR") return `${(v * 100).toFixed(0)}%`; // ENGAGE_TOTALS.esr is still 0-1
    return v.toFixed(1);
  };

  const formatChannelValue = (v: number) => {
    if (selectedMetric === "ESR") return `${v}%`; // ESR channel values are already integers (86, 78…)
    return v.toFixed(1);
  };

  const channelValueColor = (v: number) => {
    if (selectedMetric === "ESR") {
      return v > 70 ? "#059669" : v > 50 ? "#7652B3" : "#EF4444";
    }
    return v > 7 ? "#059669" : v > 5 ? "#7652B3" : "#EF4444";
  };

  const barWidth = (v: number) => {
    if (selectedMetric === "ESR") return `${v}%`; // already 0-100
    return `${(v / 10) * 100}%`;
  };

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Section header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5, marginBottom: 8, color: P.text1 }}>
          Engagement Performance Drivers
        </h1>
        <p style={{ fontSize: 14, color: P.text3, lineHeight: 1.6 }}>
          Identify what is powering engagement and where weaknesses are emerging.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        {/* Left: Purple gradient chart panel */}
        <div style={{
          borderRadius: 12,
          border: "1px solid rgba(167,139,250,0.2)",
          padding: 32,
          background: "linear-gradient(135deg, #F3F0FF 0%, #FAF8FF 100%)",
        }}>
          {/* Header row: title + metric toggle buttons */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: P.text1 }}>
                {config.fullName}
              </h2>
              <p style={{ fontSize: 12, color: P.text2, lineHeight: 1.5, maxWidth: 400 }}>
                {config.description}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {(["EIS", "EQS", "ESR"] as MetricKey[]).map((m) => {
                const mc = METRIC_CONFIG[m];
                return (
                  <div key={m} style={{ position: "relative" }}>
                    <button
                      onClick={() => setSelectedMetric(m)}
                      onMouseEnter={() => setShowTooltip(m)}
                      onMouseLeave={() => setShowTooltip(null)}
                      style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                        border: selectedMetric === m ? "none" : "1px solid rgba(229,231,235,0.8)",
                        background: selectedMetric === m ? "#7652B3" : "#fff",
                        color: selectedMetric === m ? "#fff" : P.text2,
                        cursor: "pointer", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 5,
                      }}
                    >
                      {m}
                      <Info style={{ width: 12, height: 12, opacity: 0.6 }} />
                    </button>
                    {/* Tooltip */}
                    {showTooltip === m && (
                      <div style={{
                        position: "absolute", left: 0, top: "calc(100% + 8px)",
                        width: 280, background: "#fff", borderRadius: 12,
                        border: "1px solid rgba(229,231,235,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        padding: 16, zIndex: 50,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: P.text1 }}>{mc.tooltip.title}</div>
                        <p style={{ fontSize: 11, color: P.text2, lineHeight: 1.6, marginBottom: 12 }}>{mc.tooltip.desc}</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                          {mc.tooltip.thresholds.map((t, i) => (
                            <li key={i} style={{ fontSize: 11, color: P.text3, fontFamily: "monospace" }}>• {t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score display */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 30, fontWeight: 600, color: P.text1, letterSpacing: -0.6, fontVariantNumeric: "tabular-nums" }}>
              {formatValue(config.value)}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#059669", marginTop: 4 }}>
              {config.change}
            </div>
          </div>

          {/* Trend chart — all three metrics on a unified 0–100 scale */}
          <div style={{ height: 180, marginBottom: 12 }}>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={normalizedTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}`}
                  width={30}
                />
                <Tooltip
                  contentStyle={{ fontFamily: "sans-serif", fontSize: 11, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: 6, padding: "6px 10px" }}
                  formatter={(value: number, name: string) => {
                    if (name === "eis" || name === "eqs") return [`${(value / 10).toFixed(1)}`, name.toUpperCase()];
                    return [`${value}%`, name.toUpperCase()];
                  }}
                />
                {/* Ghost lines for non-active metrics */}
                <Line
                  type="monotone" dataKey="eis"
                  stroke="#7652B3"
                  strokeWidth={selectedMetric === "EIS" ? 2.5 : 1.5}
                  strokeOpacity={selectedMetric === "EIS" ? 1 : 0.25}
                  strokeDasharray={selectedMetric === "EIS" ? undefined : "4 4"}
                  dot={selectedMetric === "EIS" ? { fill: "#7652B3", r: 4 } : false}
                  activeDot={selectedMetric === "EIS" ? { r: 6 } : false}
                />
                <Line
                  type="monotone" dataKey="eqs"
                  stroke="#8B5FD6"
                  strokeWidth={selectedMetric === "EQS" ? 2.5 : 1.5}
                  strokeOpacity={selectedMetric === "EQS" ? 1 : 0.25}
                  strokeDasharray={selectedMetric === "EQS" ? undefined : "4 4"}
                  dot={selectedMetric === "EQS" ? { fill: "#8B5FD6", r: 4 } : false}
                  activeDot={selectedMetric === "EQS" ? { r: 6 } : false}
                />
                <Line
                  type="monotone" dataKey="esr"
                  stroke="#6B4FA3"
                  strokeWidth={selectedMetric === "ESR" ? 2.5 : 1.5}
                  strokeOpacity={selectedMetric === "ESR" ? 1 : 0.25}
                  strokeDasharray={selectedMetric === "ESR" ? undefined : "4 4"}
                  dot={selectedMetric === "ESR" ? { fill: "#6B4FA3", r: 4 } : false}
                  activeDot={selectedMetric === "ESR" ? { r: 6 } : false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 11, color: P.text3, marginBottom: 12 }}>
            {[
              { label: "EIS", color: "#7652B3", active: selectedMetric === "EIS" },
              { label: "EQS", color: "#8B5FD6", active: selectedMetric === "EQS" },
              { label: "ESR", color: "#6B4FA3", active: selectedMetric === "ESR" },
            ].map(({ label, color, active }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, opacity: active ? 1 : 0.5 }}>
                <div style={{ width: 24, height: 2, background: color, borderRadius: 2 }} />
                <span style={{ fontWeight: active ? 600 : 400, color: active ? color : P.text3 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Diagnostic sentence */}
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 24,
            background: "rgba(255,255,255,0.6)", border: "1px solid rgba(167,139,250,0.2)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: P.text1 }}>{DIAGNOSTIC[selectedMetric]}</p>
          </div>

          {/* Channel bars with column headers */}
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 60px 90px 140px",
              columnGap: 8,
              fontSize: 10, fontWeight: 500, color: P.text3, textTransform: "uppercase",
              marginBottom: 12,
            }}>
              <span>Channel</span>
              <span style={{ textAlign: "right", paddingRight: 12 }}>
                {selectedMetric === "EIS" ? "EIS" : selectedMetric === "EQS" ? "EQS" : "ESR"}
              </span>
              <span style={{ textAlign: "right" }}>Value</span>
              <span style={{ textAlign: "right", paddingRight: 32 }}>Change</span>
              <span>Drivers</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {config.channels.map((ch, idx) => (
                <div
                  key={ch.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 60px 90px 140px",
                    alignItems: "center",
                    columnGap: 8,
                  }}
                >
                  {/* Channel icon + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 500 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 4, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "#fff", background: ch.color, flexShrink: 0,
                    }}>{ch.icon}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 11 }}>{ch.name}</span>
                  </div>
                  {/* Bar */}
                  <div style={{ paddingRight: 12 }}>
                    <div style={{ height: 24, background: "rgba(255,255,255,0.4)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", background: (ch as any).barColor ?? ch.color,
                        width: barWidth(ch.value), borderRadius: 4,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                  {/* Value */}
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: channelValueColor(ch.value) }}>
                      {formatChannelValue(ch.value)}
                    </span>
                  </div>
                  {/* Change */}
                  <div style={{ textAlign: "right", paddingRight: 32 }}>
                    {ch.change !== 0 && (
                      <span style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: ch.change > 0 ? "#059669" : "#EF4444" }}>
                        {ch.change > 0 ? "+" : ""}{ch.change.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {/* Drivers — cross-metric context */}
                  <div>
                    <span style={{ fontSize: 11, color: P.text3, opacity: 0.75, fontVariantNumeric: "tabular-nums" }}>
                      {selectedMetric === "EIS" && (ch as any).eqs != null && (ch as any).esr != null
                        ? `EQS ${((ch as any).eqs).toFixed(1)} · ESR ${(ch as any).esr}%`
                        : selectedMetric === "EQS" && (ch as any).esr != null && (ch as any).eis != null
                        ? `ESR ${(ch as any).esr}% · EIS ${((ch as any).eis).toFixed(1)}`
                        : selectedMetric === "ESR" && (ch as any).eqs != null && (ch as any).eis != null
                        ? `EQS ${((ch as any).eqs).toFixed(1)} · EIS ${((ch as any).eis).toFixed(1)}`
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: What Next? sidebar */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid rgba(229,231,235,0.8)",
          padding: 24,
        }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: P.text1 }}>What Next?</h3>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 16 }}>
            Actions by {selectedMetric} rank
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {WHAT_NEXT[selectedMetric].map((item, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${item.color}`, paddingLeft: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, color: P.text3, textTransform: "uppercase", marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: P.text1, marginBottom: 4 }}>{item.title}</div>
                <p style={{ fontSize: 11, color: P.text2, lineHeight: 1.5, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
