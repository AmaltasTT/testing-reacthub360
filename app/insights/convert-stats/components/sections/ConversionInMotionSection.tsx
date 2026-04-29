"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown } from "lucide-react";

const stageData = [
  { name: "TRIAL SIGNUP", subLabel: "Entry", currentVolume: 8420, currentShare: 100, priorShare: 100, color: "#D4C4FF" },
  { name: "ACTIVATED", subLabel: "First value", currentVolume: 5890, currentShare: 69.9, priorShare: 67.9, color: "#B49AFF" },
  { name: "QUALIFIED", subLabel: "ICP match", currentVolume: 3340, currentShare: 39.7, priorShare: 38.6, color: "#9B7AFF" },
  { name: "PURCHASED", subLabel: "First payment", currentVolume: 2830, currentShare: 33.6, priorShare: 31.4, color: "#6B4FD6" },
  { name: "RETAINED", subLabel: "Month 2+", currentVolume: 2180, currentShare: 25.9, priorShare: 23.8, color: "#3D2A7A" },
];

const channelData = [
  { name: "GA4", icon: "GA", color: "#4285F4", trials: 3200, retained: 820, cvr: 25.6, avgDays: 8.3, trend: -1.2 },
  { name: "HubSpot", icon: "HS", color: "#FF7A59", trials: 620, retained: 180, cvr: 29.0, avgDays: 14.5, trend: -0.3 },
  { name: "Shopify", icon: "SH", color: "#96BF48", trials: 350, retained: 110, cvr: 31.4, avgDays: 3.1, trend: -1.8 },
  { name: "TikTok Shop", icon: "TT", color: "#1A1A2E", trials: 210, retained: 40, cvr: 19.0, avgDays: 5.8, trend: 0.4 },
  { name: "Stripe", icon: "ST", color: "#635BFF", trials: 700, retained: 180, cvr: 25.7, avgDays: 1.2, trend: -0.8 },
];

const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

function formatWithCommas(num: number): string {
  return num.toLocaleString();
}

export function ConversionInMotionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });

  const ourVelocity = 6.6;
  const industryVelocity = 7.0;
  const velocityDiff = ((ourVelocity - industryVelocity) / industryVelocity * 100).toFixed(0);

  const aboveBenchmark = channelData.filter((c) => c.avgDays < ourVelocity).sort((a, b) => a.avgDays - b.avgDays);
  const belowBenchmark = channelData.filter((c) => c.avgDays >= ourVelocity).sort((a, b) => a.avgDays - b.avgDays);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ marginTop: 48, marginBottom: 48 }}
    >
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1A1A2E",
            letterSpacing: "-0.5px",
            margin: "0 0 8px",
          }}
        >
          Conversion in motion
        </h2>
        <p style={{ fontSize: 14, color: "#6E6E85", margin: 0 }}>Every stage is an opportunity to accelerate.</p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EDEDF4",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        }}
      >
        <div style={{ padding: "28px 32px 32px" }}>
          <div style={{ borderTop: "1px solid #E5E5E7", borderBottom: "1px solid #E5E5E7", padding: "20px 0", marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {[
                { label: "TOTAL TRIALS", big: formatWithCommas(8420), sub: "+10.1%", subMono: true },
                { label: "OVERALL CVR", big: "33.6%", sub: "+1.8 pts", subMono: true },
                { label: "MEDIAN VELOCITY", big: "8.2 days", sub: "−1.1d", subMono: true },
                { label: "RETAINED", big: formatWithCommas(2180), sub: "+19.8%", subMono: true },
              ].map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    borderRight: i < 3 ? "1px solid #E5E5E7" : "none",
                    paddingRight: i < 3 ? 24 : 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9A9AAA",
                      letterSpacing: "0.8px",
                      marginBottom: 6,
                    }}
                  >
                    {m.label}
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#1A1A2E",
                      lineHeight: 1,
                      marginBottom: 4,
                      fontFamily: mono,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {m.big}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#36B37E",
                      fontFamily: m.subMono ? mono : "inherit",
                    }}
                  >
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {stageData.map((stage, idx) => {
              const isDarkBar = idx >= 3;
              const textColor = isDarkBar ? "#fff" : "#1A1A2E";
              return (
                <div key={stage.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 120, textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#5A5A6E", letterSpacing: "0.5px" }}>{stage.name}</div>
                    <div style={{ fontSize: 10, color: "#9A9AAA" }}>{stage.subLabel}</div>
                  </div>
                  <div style={{ flex: 1, position: "relative", height: 36 }}>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${stage.priorShare}%`,
                        border: "1.5px dashed #D2D2D7",
                        borderRadius: 8,
                        opacity: 0.5,
                        boxSizing: "border-box",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${stage.currentShare}%`,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${stage.color} 0%, ${stage.color}cc 100%)`,
                        boxShadow: `0 2px 6px ${stage.color}4d`,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: textColor, paddingLeft: 16 }}>
                        {formatWithCommas(stage.currentVolume)}
                      </span>
                    </div>
                  </div>
                  <div style={{ width: 52, textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#5A5A6E", fontFamily: mono }}>{stage.currentShare}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 136, paddingTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 20, height: 10, borderRadius: 4, backgroundColor: "#9B7AFF" }} />
              <span style={{ fontSize: 11, color: "#6E6E85" }}>Current</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 20,
                  height: 10,
                  borderRadius: 4,
                  border: "1.5px dashed #9A9AAA",
                  backgroundColor: "transparent",
                }}
              />
              <span style={{ fontSize: 11, color: "#6E6E85" }}>Prior period</span>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "#EDEDF4" }} />

        <div style={{ padding: "16px 32px 24px" }}>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>Channel conversion velocity</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#36B37E", fontFamily: mono }}>{ourVelocity}d</span>
              <span style={{ fontSize: 11, color: "#9A9AAA" }}>
                vs {industryVelocity}d industry ({velocityDiff}%)
              </span>
            </div>
            <div style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <ChevronDown size={16} color="#9A9AAA" />
            </div>
          </button>

          {isExpanded && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  borderTop: "1px solid #F5F5F7",
                  borderBottom: "1px solid #F5F5F7",
                  padding: "16px 0",
                  marginBottom: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 24,
                }}
              >
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#36B37E", letterSpacing: "0.8px", marginBottom: 8 }}>
                    ABOVE BENCHMARK
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {aboveBenchmark.map((ch) => (
                      <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: ch.color,
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {ch.icon.charAt(0)}
                        </div>
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>{ch.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#36B37E", fontFamily: mono }}>{ch.avgDays}d</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid #E5E5E7", paddingLeft: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#E24B4A", letterSpacing: "0.8px", marginBottom: 8 }}>
                    BELOW BENCHMARK
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {belowBenchmark.map((ch) => (
                      <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            backgroundColor: ch.color,
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {ch.icon.charAt(0)}
                        </div>
                        <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#1A1A2E" }}>{ch.name}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#E24B4A", fontFamily: mono }}>{ch.avgDays}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #E5E5E7" }}>
                      {["CHANNEL", "TRIALS", "RETAINED", "CVR", "AVG DAYS", "TREND"].map((h, i) => (
                        <th
                          key={h}
                          style={{
                            textAlign: i === 0 || i === 3 ? "left" : "right",
                            padding: "8px 12px",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#9A9AAA",
                            letterSpacing: "0.8px",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {channelData.map((ch) => {
                      const barColor = ch.cvr > 25 ? "#36B37E" : ch.cvr > 20 ? "#7C5CFC" : "#EF4444";
                      const barWidth = (ch.cvr / 35) * 100;
                      const daysColor = ch.avgDays <= 5 ? "#36B37E" : ch.avgDays <= 10 ? "#5A5A6E" : "#E24B4A";
                      const trendColor = ch.trend < 0 ? "#36B37E" : "#E24B4A";
                      const trendArrow = ch.trend < 0 ? "↓" : "↑";
                      return (
                        <tr key={ch.name} style={{ borderBottom: "1px solid #F5F5F7" }}>
                          <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  backgroundColor: ch.color,
                                  color: "#fff",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {ch.icon.charAt(0)}
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{ch.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right", fontSize: 13, color: "#5A5A6E", fontFamily: mono }}>
                            {formatWithCommas(ch.trials)}
                          </td>
                          <td style={{ padding: "12px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "#1A1A2E", fontFamily: mono }}>
                            {formatWithCommas(ch.retained)}
                          </td>
                          <td style={{ padding: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 40, height: 6, background: "#F5F5F7", borderRadius: 9999, overflow: "hidden" }}>
                                <div style={{ width: `${barWidth}%`, height: "100%", borderRadius: 9999, backgroundColor: barColor }} />
                              </div>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E", fontFamily: mono }}>{ch.cvr}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: daysColor }}>{ch.avgDays}</span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 600, color: trendColor }}>{trendArrow}</span>
                              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: trendColor }}>
                                {Math.abs(ch.trend)}d
                              </span>
                              {Math.abs(ch.trend) > 1 && (
                                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: trendColor }} />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
