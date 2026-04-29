"use client";

import { ArrowRight } from "lucide-react";
import { P, CONVERT_CHANNEL_METRICS } from "@/lib/convert-stats/data";

export function ConversionByChannelSection() {
  const maxCvr = Math.max(...CONVERT_CHANNEL_METRICS.map((c) => c.cvr));
  const maxConversions = Math.max(...CONVERT_CHANNEL_METRICS.map((c) => c.conversions));

  return (
    <div style={{ marginTop: 40, marginBottom: 48 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: P.text1, letterSpacing: -0.5, margin: "0 0 8px" }}>
          Conversion by channel
        </h2>
        <p style={{ fontSize: 14, color: P.text3, margin: 0 }}>
          Performance scorecard across all channels — continuing from overview
        </p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: `1px solid ${P.border}`,
          boxShadow: "0 2px 14px rgba(124,92,252,0.12)",
          padding: 28,
        }}
      >
        <div style={{ borderTop: `1px solid ${P.border}`, borderBottom: `1px solid ${P.border}`, padding: "16px 0", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Total Revenue</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: P.text1 }}>$847K</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981", marginTop: 4 }}>+22% vs prior</div>
            </div>
            <div style={{ borderLeft: `1px solid ${P.border}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Total Conversions</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: P.text1 }}>3K</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981", marginTop: 4 }}>+18% vs prior</div>
            </div>
            <div style={{ borderLeft: `1px solid ${P.border}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Avg AOV</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: P.text1 }}>$302</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981", marginTop: 4 }}>+9.8% vs prior</div>
            </div>
            <div style={{ borderLeft: `1px solid ${P.border}`, paddingLeft: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Top Channel</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C5CFC" }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: P.text1 }}>Email</span>
              </div>
              <div style={{ fontSize: 12, color: P.text3, marginTop: 4 }}>5.8% CVR · strong ROAS</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            {/* Match InsightsIQ ConvertExpandedContent: title + OMTM inline, subtitle below */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: P.text1, letterSpacing: "-0.01em", margin: 0 }}>
                  Conversion Rate
                </h4>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: "rgba(168, 85, 247, 0.1)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#7e22ce",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    lineHeight: 1.2,
                  }}
                >
                  OMTM
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", fontWeight: 500, margin: 0 }}>% of visitors who convert</p>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: P.text1, marginBottom: 8 }}>3.2%</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981", marginBottom: 24 }}>+12.5% vs prior</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONVERT_CHANNEL_METRICS.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 96, fontSize: 12, color: P.text3 }}>{ch.name}</span>
                  <div style={{ flex: 1, height: 24, background: "#F1F5F9", borderRadius: 9999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(ch.cvr / maxCvr) * 100}%`,
                        background: ch.color,
                        borderRadius: 9999,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span style={{ width: 40, textAlign: "right", fontSize: 13, fontWeight: 700, color: P.text1 }}>{ch.cvr.toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: P.text3, marginTop: 16 }}>+0.5% vs last period — Benchmark 2.8%</p>
          </div>

          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: P.text1, margin: "0 0 4px" }}>Conversions by channel</h4>
            <p style={{ fontSize: 12, color: P.text3, margin: "0 0 16px" }}>Total conversion volume</p>
            <div style={{ fontSize: 36, fontWeight: 700, color: P.text1, marginBottom: 8 }}>3K</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#10B981", marginBottom: 24 }}>+18% vs last period</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CONVERT_CHANNEL_METRICS.map((ch) => (
                <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 96, fontSize: 12, color: P.text3 }}>{ch.name}</span>
                  <div style={{ flex: 1, height: 24, background: "#F1F5F9", borderRadius: 9999, overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${(ch.conversions / maxConversions) * 100}%`,
                        background: ch.color,
                        borderRadius: 9999,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span style={{ width: 40, textAlign: "right", fontSize: 13, fontWeight: 700, color: P.text1 }}>{ch.conversions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${P.border}` }}>
          <div
            style={{
              background: `linear-gradient(90deg, ${P.accentSoft} 0%, #fff 100%)`,
              border: `1px solid ${P.accent}33`,
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: P.text1, margin: "0 0 4px" }}>Your Next Move</p>
              <p style={{ fontSize: 12, color: P.text3, margin: 0 }}>
                Email is outperforming by 2x. Consider reallocating budget from lowest-ROAS social toward Email journeys.
              </p>
            </div>
            <ArrowRight style={{ width: 20, height: 20, color: P.accent, flexShrink: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
