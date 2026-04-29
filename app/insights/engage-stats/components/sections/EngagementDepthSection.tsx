"use client";

import { motion } from "motion/react";
import { P, DEPTH_CHANNELS, fmt } from "@/lib/engage-stats/data";

export function EngagementDepthSection() {
  const totalEngagements = DEPTH_CHANNELS.reduce((s, ch) => s + ch.t1 + ch.t2 + ch.t3, 0);
  const totalT1 = DEPTH_CHANNELS.reduce((s, ch) => s + ch.t1, 0);
  const totalT2 = DEPTH_CHANNELS.reduce((s, ch) => s + ch.t2, 0);
  const totalT3 = DEPTH_CHANNELS.reduce((s, ch) => s + ch.t3, 0);
  const highDepthShare = (totalT3 / totalEngagements * 100).toFixed(1);
  const highDepthPrior = (parseFloat(highDepthShare) - 2.1).toFixed(1);

  const topContributor = [...DEPTH_CHANNELS].sort((a, b) => (b.t3 / (b.t1 + b.t2 + b.t3)) - (a.t3 / (a.t1 + a.t2 + a.t3)))[0];
  const highestLowDepth = [...DEPTH_CHANNELS].sort((a, b) => (b.t1 / (b.t1 + b.t2 + b.t3)) - (a.t1 / (a.t1 + a.t2 + a.t3)))[0];

  const topT3Vol = topContributor.t3;
  const topT3Pct = Math.round((topContributor.t3 / (topContributor.t1 + topContributor.t2 + topContributor.t3)) * 100);
  const worstT1Pct = Math.round((highestLowDepth.t1 / (highestLowDepth.t1 + highestLowDepth.t2 + highestLowDepth.t3)) * 100);
  const worstT3Pct = 100 - worstT1Pct - Math.round((highestLowDepth.t2 / (highestLowDepth.t1 + highestLowDepth.t2 + highestLowDepth.t3)) * 100);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid rgba(229,231,235,0.8)",
      padding: 32,
      marginBottom: 48,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: P.text1, margin: 0 }}>
            Engagement Depth by Channel
          </h2>
        </div>
        <p style={{ fontSize: 13, color: P.text3, lineHeight: 1.6, opacity: 0.7 }}>
          Depth expectations vary by campaign objective. High depth signals stronger consideration. Low depth may be appropriate for awareness campaigns.
        </p>
      </div>

      {/* 4 Highlight Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Total Engagements */}
        <div style={{
          background: "linear-gradient(135deg, rgba(243,240,255,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Total Engagements</div>
          <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: -0.4, marginBottom: 12, fontVariantNumeric: "tabular-nums" }}>
            {fmt(totalEngagements)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Low Depth:", value: fmt(totalT1), color: P.text1 },
              { label: "Medium Depth:", value: fmt(totalT2), color: P.text1 },
              { label: "High Depth:", value: fmt(totalT3), color: "#6D28D9" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
                <span style={{ color: P.text3 }}>{label}</span>
                <span style={{ fontWeight: 600, color }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(totalT1 / totalEngagements) * 100}%`, background: "#E9D5FF" }} />
            <div style={{ width: `${(totalT2 / totalEngagements) * 100}%`, background: "#A78BFA" }} />
            <div style={{ width: `${(totalT3 / totalEngagements) * 100}%`, background: "#6D28D9" }} />
          </div>
        </div>

        {/* High Depth Share */}
        <div style={{
          background: "linear-gradient(135deg, rgba(243,240,255,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>High Depth Share</div>
          <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: -0.4, marginBottom: 4, color: "#6D28D9", fontVariantNumeric: "tabular-nums" }}>
            {highDepthShare}%
          </div>
          <div style={{ fontSize: 11, color: P.text2, marginBottom: 8 }}>Blended across all channels</div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 8px", background: "rgba(34,197,94,0.1)",
            color: "#059669", borderRadius: 6, fontSize: 11, fontWeight: 700,
          }}>
            +2.1pp
            <span style={{ fontSize: 10, fontWeight: 400 }}>vs prior period</span>
          </div>
        </div>

        {/* Top High Depth Contributor */}
        <div style={{
          background: "linear-gradient(135deg, rgba(243,240,255,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>Top High Depth Contributor</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff",
              background: topContributor.color, flexShrink: 0,
            }}>{topContributor.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: P.text1 }}>{topContributor.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: P.text3 }}>High Depth Vol:</span>
              <span style={{ fontWeight: 600, color: "#6D28D9" }}>{fmt(topT3Vol)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: P.text3 }}>High Depth Share:</span>
              <span style={{ fontWeight: 600 }}>{topT3Pct}%</span>
            </div>
          </div>
        </div>

        {/* Highest Low Depth Concentration */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,241,242,1) 0%, rgba(255,255,255,1) 100%)",
          border: "1px solid rgba(252,165,165,0.3)",
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase", marginBottom: 8, whiteSpace: "nowrap" }}>Highest Low Depth Concentration</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700, color: "#fff",
              background: highestLowDepth.color, flexShrink: 0,
            }}>{highestLowDepth.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: P.text1 }}>{highestLowDepth.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: P.text3 }}>High Depth Share:</span>
              <span style={{ fontWeight: 600, color: "#E11D48" }}>{worstT3Pct}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              <span style={{ color: P.text3 }}>Low Depth:</span>
              <span style={{ fontWeight: 600 }}>{worstT1Pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend + column headers */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 16, paddingLeft: 176 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16 }}>
          {[
            { color: "#E9D5FF", label: "T1 Low Depth" },
            { color: "#A78BFA", label: "T2 Medium Depth" },
            { color: "#6D28D9", label: "T3 High Depth" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: P.text2 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: 128, textAlign: "right", fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase" }}>Alignment</div>
        <div style={{ width: 96, textAlign: "right", fontSize: 11, fontWeight: 500, color: P.text3, textTransform: "uppercase" }}>Action</div>
      </div>

      {/* Channel rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
        {DEPTH_CHANNELS.map((ch) => {
          const total = ch.t1 + ch.t2 + ch.t3;
          const t1Pct = Math.round((ch.t1 / total) * 100);
          const t2Pct = Math.round((ch.t2 / total) * 100);
          const t3Pct = 100 - t1Pct - t2Pct;

          return (
            <div
              key={ch.name}
              style={{ display: "flex", alignItems: "center", gap: 24, borderBottom: `1px solid rgba(243,244,246,1)`, paddingBottom: 20 }}
              className="hover:bg-gray-50/30 rounded-lg px-2 py-2 -mx-2 transition-colors"
            >
              {/* Channel info */}
              <div style={{ width: 176, flexShrink: 0, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 6, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#fff", background: ch.color, flexShrink: 0,
                }}>{ch.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: P.text1 }}>{ch.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: ch.type === "Search" || ch.type === "B2B Social" ? "#7652B3" : "#059669", fontWeight: 600 }}>
                      {ch.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 11, color: P.text3, fontVariantNumeric: "tabular-nums" }}>
                      {(ch.t1 + ch.t2 + ch.t3).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stacked bar */}
              <div style={{ flex: 1, position: "relative" }}>
                <div style={{ height: 40, background: "#F3F4F6", borderRadius: 8, overflow: "hidden", display: "flex" }}>
                  {/* T1 */}
                  <div
                    style={{ width: `${t1Pct}%`, background: "#E9D5FF", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                  >
                    {t1Pct >= 8 && (
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#6B21A8", textAlign: "center", padding: "0 4px", fontVariantNumeric: "tabular-nums" }}>
                        <div>Low Depth</div>
                        <div style={{ fontWeight: 700 }}>{ch.t1.toLocaleString()} ({t1Pct}%)</div>
                      </div>
                    )}
                  </div>
                  {/* T2 */}
                  <div
                    style={{ width: `${t2Pct}%`, background: "#A78BFA", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                  >
                    {t2Pct >= 8 && (
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#fff", textAlign: "center", padding: "0 4px", fontVariantNumeric: "tabular-nums" }}>
                        <div>Mid Depth</div>
                        <div style={{ fontWeight: 700 }}>{ch.t2.toLocaleString()} ({t2Pct}%)</div>
                      </div>
                    )}
                  </div>
                  {/* T3 */}
                  <div
                    style={{ width: `${t3Pct}%`, background: "#6D28D9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
                  >
                    {t3Pct >= 8 && (
                      <div style={{ fontSize: 10, fontWeight: 500, color: "#fff", textAlign: "center", padding: "0 4px", fontVariantNumeric: "tabular-nums" }}>
                        <div>High Depth</div>
                        <div style={{ fontWeight: 700 }}>{ch.t3.toLocaleString()} ({t3Pct}%)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Alignment */}
              <div style={{ width: 128, textAlign: "right" }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "4px 12px",
                  borderRadius: 10, color: ch.alignColor,
                  background: `${ch.alignColor}15`,
                }}>
                  {ch.alignment}
                </span>
              </div>

              {/* Action */}
              <div style={{ width: 96, textAlign: "right" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: P.text3, textTransform: "uppercase" }}>
                  {ch.action}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* What Next footer */}
      <div>
        <div style={{ fontSize: 11, color: P.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 16 }}>
          What Next?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            {
              delay: 0.4,
              borderColor: "rgba(5, 150, 105, 0.9)",
              label: "ALLOCATE MORE",
              title: "LinkedIn · TikTok",
              text: "Strong high depth density (25–36%). Increase distribution.",
            },
            {
              delay: 0.5,
              borderColor: "rgba(245, 158, 11, 0.9)",
              label: "CORRECT DISTORTION",
              title: "Instagram · Facebook Paid",
              text: "High low-depth concentration. Improve creative alignment before scaling.",
            },
            {
              delay: 0.6,
              borderColor: "rgba(220, 38, 38, 0.9)",
              label: "VALIDATE TRAFFIC",
              title: "GDN",
              text: "93% low depth. Validate downstream conversion quality before pausing.",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{ borderLeft: `2px solid ${item.borderColor}`, paddingLeft: 16 }}
            >
              <div style={{ fontSize: 10, color: P.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: P.text1, marginBottom: 8 }}>
                {item.title}
              </div>
              <p style={{ fontSize: 14, color: P.text2, lineHeight: 1.5, margin: 0 }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
