"use client";

import { useState } from "react";
import {
  P,
  ATTENTION_GAPS,
  enrichedChannels,
  INTEREST_SEGMENTS,
  SEGMENT_INSIGHTS,
  AGE_SEGMENTS,
  AGE_BY_GENDER,
  GENDER_DATA,
  HEATMAP_DATA,
  paidChannels,
  totals,
  fmt,
  fmtPct,
  fmtMoney,
  fmtSpend,
} from "@/lib/reach-stats/data";
import { BubbleHeatmap } from "@/components/reach-stats/BubbleHeatmap";
import { HeatmapLegend } from "@/components/reach-stats/HeatmapLegend";

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

const qrrColor = (r: number) =>
  r >= 0.6
    ? P.accent
    : r >= 0.45
      ? P.text1
      : r >= 0.35
        ? P.caution
        : P.danger;

export function DemographicsTab() {
  const [expandedSeg, setExpandedSeg] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState("all");
  const [heatmapView, setHeatmapView] = useState<"age" | "interest">("age");

  return (
    <>

            {/* LEAD: QRR Gap Analysis — promoted to top */}
            <Card style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 18,
                }}
              >
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>
                    QRR Gap Analysis
                  </h3>
                  <p
                    style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}
                  >
                    Where you're overspending for low qualified reach — with
                    better alternatives
                  </p>
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    background: P.dangerBg,
                    color: P.danger,
                  }}
                >
                  Action Required
                </span>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {ATTENTION_GAPS.map((gap, i) => {
                  const currentCh = enrichedChannels.find(
                    (c) => c.name === gap.current.channel,
                  );
                  const betterCh = enrichedChannels.find(
                    (c) => c.name === gap.better.channel,
                  );

                  return (
                    <div
                      key={i}
                      style={{
                        border: `1px solid ${P.divider}`,
                        borderRadius: 10,
                        overflow: "hidden",
                        transition: "all 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.06)";
                        e.currentTarget.style.borderColor = P.accent + "30";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = P.divider;
                      }}
                    >
                      <div
                        style={{
                          padding: "14px 18px",
                          display: "grid",
                          gridTemplateColumns: "1fr auto 1fr",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        {/* CURRENT - Problem State */}
                        <div
                          style={{
                            padding: "12px 16px",
                            background: P.dangerBg,
                            borderRadius: 8,
                            borderLeft: `3px solid ${P.danger}`,
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              textTransform: "uppercase",
                              letterSpacing: 0.4,
                              color: P.danger,
                              fontWeight: 600,
                              marginBottom: 4,
                            }}
                          >
                            Current
                          </div>

                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              marginBottom: 6,
                              color: P.text1,
                            }}
                          >
                            {gap.segment}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 4,
                            }}
                          >
                            {currentCh && (
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 4,
                                  background: currentCh.color,
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 8,
                                  fontWeight: 700,
                                }}
                              >
                                {currentCh.icon}
                              </div>
                            )}
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              {gap.current.channel}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              fontSize: 12,
                              color: P.text2,
                              marginBottom: 4,
                            }}
                          >
                            <span>
                              QRR:{" "}
                              <span
                                style={{ fontWeight: 600, color: P.danger }}
                              >
                                {fmtPct(gap.current.qrr)}
                              </span>
                            </span>
                            <span>
                              CpQR:{" "}
                              <span
                                style={{ fontWeight: 600, color: P.danger }}
                              >
                                {fmtMoney(gap.current.cpqr)}
                              </span>
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              color: P.text3,
                              marginTop: 4,
                            }}
                          >
                            Spend: {fmtSpend(gap.current.spend)}/mo
                          </div>
                        </div>

                        {/* ARROW - Improvement Indicator */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span style={{ fontSize: 18, color: P.accent }}>
                            →
                          </span>
                          <span
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: P.accent,
                            }}
                          >
                            -{gap.savingsPercent}%
                          </span>
                          <span style={{ fontSize: 10, color: P.text3 }}>
                            CpQR drop
                          </span>
                        </div>

                        {/* RECOMMENDED - Better Alternative */}
                        <div
                          style={{
                            padding: "12px 16px",
                            background: P.accentFaint,
                            borderRadius: 8,
                            borderLeft: `3px solid ${P.accent}`,
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 10,
                              textTransform: "uppercase",
                              letterSpacing: 0.4,
                              color: P.accent,
                              fontWeight: 600,
                              marginBottom: 4,
                            }}
                          >
                            Recommended
                          </div>

                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              marginBottom: 6,
                              color: P.text1,
                            }}
                          >
                            Shift to
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 4,
                            }}
                          >
                            {betterCh && (
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: 4,
                                  background: betterCh.color,
                                  color: "#fff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 8,
                                  fontWeight: 700,
                                }}
                              >
                                {betterCh.icon}
                              </div>
                            )}
                            <span style={{ fontSize: 13, fontWeight: 500 }}>
                              {gap.better.channel}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 14,
                              fontSize: 12,
                              color: P.text2,
                              marginBottom: 4,
                            }}
                          >
                            <span>
                              QRR:{" "}
                              <span
                                style={{ fontWeight: 600, color: P.accent }}
                              >
                                {fmtPct(gap.better.qrr)}
                              </span>
                            </span>
                            <span>
                              CpQR:{" "}
                              <span
                                style={{ fontWeight: 600, color: P.accent }}
                              >
                                {fmtMoney(gap.better.cpqr)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <AgentIQHint
                text="Reallocating $8.4K from DV360 to TikTok for 18–24 Females would increase QR by ~12K at 80% lower CpQR."
                action="Run scenario"
              />
            </Card>

            {/* Top 5 Segments by QRR × Efficiency */}
            <Card style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Top 5 Segments by QRR × Efficiency</h3>
              <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 14px" }}>Highest qualified reach per dollar · <span style={{ color: P.accent, fontWeight: 500 }}>Click any card to explore</span></p>
              {(() => {
                const top5 = [...INTEREST_SEGMENTS]
                  .map(s => ({ ...s, qrr: s.engaged / s.reach, score: (s.engaged / s.reach) * (1 / (s.cper || 1)) * 100 }))
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 5);

                return (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                      {top5.map((seg, i) => {
                        const isExpanded = expandedSeg === seg.name;
                        const ins = SEGMENT_INSIGHTS[seg.name];
                        const isTop = i === 0;
                        return (
                          <div key={seg.name}
                            onClick={() => setExpandedSeg(isExpanded ? null : seg.name)}
                            style={{
                              padding: "14px 16px 12px", borderRadius: 12, textAlign: "center",
                              background: isTop ? P.accent : isExpanded ? P.accentFaint : P.card,
                              border: isTop ? `2px solid ${P.accent}` : isExpanded ? `2px solid ${P.accent}60` : `1.5px solid ${P.divider}`,
                              color: isTop ? "#fff" : P.text1,
                              cursor: "pointer",
                              transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                              transform: isExpanded ? "translateY(-3px)" : "none",
                              boxShadow: isExpanded ? `0 6px 20px ${P.accent}18` : "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                            onMouseEnter={e => { if (!isExpanded && !isTop) e.currentTarget.style.borderColor = P.accent + "40"; }}
                            onMouseLeave={e => { if (!isExpanded && !isTop) e.currentTarget.style.borderColor = P.divider; }}
                          >
                            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3, opacity: isTop ? 1 : 0.5 }}>#{i + 1}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, minHeight: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{seg.name}</div>
                            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
                              <div><div style={{ fontSize: 16, fontWeight: 700 }}>{fmtPct(seg.qrr)}</div><div style={{ fontSize: 9, textTransform: "uppercase", opacity: 0.6 }}>QRR</div></div>
                              <div><div style={{ fontSize: 16, fontWeight: 700 }}>{fmtMoney(seg.cper)}</div><div style={{ fontSize: 9, textTransform: "uppercase", opacity: 0.6 }}>CpQR</div></div>
                            </div>
                            <div style={{
                              marginTop: 10, paddingTop: 8, borderTop: `1px solid ${isTop ? "rgba(255,255,255,0.2)" : P.divider}`,
                              fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
                              color: isTop ? "rgba(255,255,255,0.8)" : P.accent,
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            }}>
                              <span>{isExpanded ? "▲ Hide" : "▼ Explore"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Expanded segment details panel */}
                    {expandedSeg && (() => {
                      const seg = top5.find(s => s.name === expandedSeg);
                      const ins = SEGMENT_INSIGHTS[expandedSeg];
                      if (!seg || !ins) return null;
                      const topChEntries = Object.entries(seg.channels).sort((a, b) => b[1] - a[1]).slice(0, 5);

                      return (
                        <div style={{
                          marginTop: 14, padding: 0, borderRadius: 14, overflow: "hidden",
                          background: "linear-gradient(135deg, rgba(124,58,237,0.02) 0%, rgba(139,92,246,0.04) 100%)",
                          border: `1.5px solid ${P.accent}18`,
                          boxShadow: `0 2px 12px ${P.accent}08`,
                        }}>
                          <div style={{ padding: "14px 22px", borderBottom: `1px solid ${P.accent}10`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: P.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                                #{top5.findIndex(s => s.name === expandedSeg) + 1}
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>{expandedSeg}</div>
                                <div style={{ fontSize: 11, color: P.text3 }}>{fmt(seg.reach)} reach · {fmt(seg.engaged)} qualified</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                              <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: P.accent }}>{fmtPct(seg.qrr)}</div><div style={{ fontSize: 9, color: P.text3, textTransform: "uppercase" }}>QRR</div></div>
                              <div style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 700, color: P.accent }}>{fmtMoney(seg.cper)}</div><div style={{ fontSize: 9, color: P.text3, textTransform: "uppercase" }}>CpQR</div></div>
                            </div>
                          </div>

                          <div style={{ padding: "16px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.accent, marginBottom: 8 }}>Why This Segment</div>
                              <p style={{ fontSize: 12.5, color: P.text2, lineHeight: 1.6, margin: "0 0 12px" }}>{ins.why}</p>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: `${P.accent}08`, borderRadius: 8, border: `1px solid ${P.accent}12` }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: P.accent }}>→</span>
                                <span style={{ fontSize: 11.5, fontWeight: 600, color: P.accent }}>{ins.action}</span>
                              </div>
                            </div>

                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.text3, marginBottom: 8 }}>Top Channels for This Segment</div>
                              {topChEntries.map(([chName, qrr]) => {
                                const ch = enrichedChannels.find(c => c.name === chName);
                                return (
                                  <div key={chName} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    {ch && <div style={{ width: 16, height: 16, borderRadius: 4, background: ch.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, flexShrink: 0 }}>{ch.icon}</div>}
                                    <span style={{ fontSize: 11, fontWeight: 500, width: 90, flexShrink: 0 }}>{chName}</span>
                                    <div style={{ flex: 1, height: 6, background: P.barGrey, borderRadius: 4 }}>
                                      <div style={{ width: `${qrr * 100}%`, height: "100%", borderRadius: 4, background: `linear-gradient(90deg, #C4B5FD, ${P.accent})`, transition: "width 0.4s ease" }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: P.accent, width: 32 }}>{Math.round(qrr * 100)}%</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                );
              })()}
            </Card>

            {/* QRR by Age Segment */}
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>QRR by Age Segment</h3>
                  <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}>Who's qualifying — not just receiving impressions</p>
                </div>
                {/* Gender filter */}
                <div style={{ display: "flex", gap: 4 }}>
                  {["all", "Female", "Male"].map((g) => (
                    <button key={g} onClick={() => setGenderFilter(g)} style={{
                      padding: "4px 10px", fontSize: 11, fontWeight: 500, borderRadius: 5,
                      border: `1px solid ${genderFilter === g ? P.accent : P.divider}`,
                      background: genderFilter === g ? P.accentSoft : "transparent",
                      color: genderFilter === g ? P.accent : P.text3, cursor: "pointer"
                    }}>{g === "all" ? "All" : g}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 18, margin: "12px 0 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: P.barGrey }} /> Reach</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: P.accent, opacity: 0.6 }} /> Qualified Reach</div>
                <div style={{ fontSize: 12, color: P.text3, marginLeft: "auto" }}>QRR · CpQR →</div>
              </div>
              {(() => {
                const activeData = genderFilter === "all" ? AGE_SEGMENTS : AGE_BY_GENDER[genderFilter] || AGE_SEGMENTS;
                const maxR = Math.max(...activeData.map((s) => s.reach));
                const withMetrics = activeData.map(seg => ({
                  ...seg,
                  qrr: seg.engaged / seg.reach,
                  cpqr: seg.spend > 0 ? seg.spend / (seg.engaged / 1000) : 0,
                }));
                const best = withMetrics.reduce((a, b) => (a.qrr > b.qrr ? a : b));
                const worst = withMetrics.reduce((a, b) => (a.qrr < b.qrr ? a : b));
                const cheapest = withMetrics.reduce((a, b) => (a.cpqr < b.cpqr ? a : b));
                const totalSpend = withMetrics.reduce((s, m) => s + m.spend, 0);
                const underperformers = withMetrics.filter(m => m.qrr < 0.35);
                const underSpend = underperformers.reduce((s, m) => s + m.spend, 0);
                const gLabel = genderFilter === "all" ? "All genders" : genderFilter;

                return (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {withMetrics.map((seg) => (
                        <div key={seg.label} style={{ display: "grid", gridTemplateColumns: "70px 1fr 54px 62px", alignItems: "center", gap: 12, padding: "5px 0" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, background: "linear-gradient(135deg, #F3F4F6 0%, #E8E9EC 100%)", padding: "6px 10px", borderRadius: 8, textAlign: "center" }}>{seg.label}</span>
                          <div style={{ position: "relative", height: 26 }}>
                            <div style={{ position: "absolute", height: "100%", width: `${(seg.reach / maxR) * 100}%`, background: P.barGrey, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8 }}>
                              <span style={{ fontSize: 10, fontWeight: 500, color: P.text3 }}>{fmt(seg.reach)}</span>
                            </div>
                            <div style={{ position: "absolute", height: "100%", width: `${(seg.engaged / maxR) * 100}%`, background: seg.color, borderRadius: 5, opacity: 0.65, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8, minWidth: 42 }}>
                              <span style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{fmt(seg.engaged)}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, textAlign: "right", color: seg.qrr >= 0.6 ? P.accent : seg.qrr >= 0.4 ? P.text1 : P.danger }}>{fmtPct(seg.qrr)}</div>
                          <div style={{ fontSize: 12, fontWeight: 500, textAlign: "right", color: P.text2 }}>{fmtMoney(seg.cpqr)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Dynamic insights */}
                    <div style={{ marginTop: 14, padding: "14px 16px", background: P.accentFaint, borderRadius: 10, fontSize: 12.5, color: P.text2, lineHeight: 1.6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.accent }} />
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.accent }}>{gLabel} · Key Findings</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                        <div>
                          <span style={{ fontWeight: 700, color: P.accent }}>{best.label}</span> is the most efficient — {fmtPct(best.qrr)} QRR at {fmtMoney(best.cpqr)} CpQR.
                          {cheapest.label !== best.label && <> Cheapest per QR is <span style={{ fontWeight: 700 }}>{cheapest.label}</span> at {fmtMoney(cheapest.cpqr)}.</>}
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, color: P.danger }}>{worst.label}</span> converts only {fmtPct(worst.qrr)} at {fmtMoney(worst.cpqr)} CpQR — {Math.round(worst.cpqr / cheapest.cpqr)}× the cost of {cheapest.label}.
                        </div>
                        {underperformers.length > 0 && (
                          <div style={{ gridColumn: "1 / -1", paddingTop: 6, borderTop: `1px solid ${P.accent}15`, marginTop: 4 }}>
                            <span style={{ fontWeight: 700, color: P.caution }}>{underperformers.length} segment{underperformers.length > 1 ? "s" : ""}</span> below 35% QRR ({underperformers.map(u => u.label).join(", ")}) absorb <span style={{ fontWeight: 700 }}>${((underSpend ?? 0) / 1000).toFixed(1)}K</span> ({Math.round(underSpend / totalSpend * 100)}% of {gLabel.toLowerCase()} spend) — reallocate to {best.label} or {withMetrics.filter(m => m.qrr >= 0.5)[1]?.label || cheapest.label} for better yield.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>

            {/* Segment × Channel QRR */}
            <Card style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "22px 24px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Segment × Channel QRR</h3>
                    <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}>Where each segment qualifies attention · scroll →</p>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {([{ key: "age" as const, label: "By Age" }, { key: "interest" as const, label: "By Interest" }] as const).map((v) => (
                      <button key={v.key} onClick={() => setHeatmapView(v.key)} style={{
                        padding: "5px 12px", fontSize: 12, fontWeight: 500, borderRadius: 6,
                        border: `1px solid ${heatmapView === v.key ? P.accent : P.divider}`,
                        background: heatmapView === v.key ? P.accentSoft : "transparent",
                        color: heatmapView === v.key ? P.accent : P.text3, cursor: "pointer",
                      }}>{v.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              {heatmapView === "age" ? (
                <BubbleHeatmap
                  rowLabels={{
                    header: "Age",
                    items: Object.keys(HEATMAP_DATA).map((age) => ({ label: age })),
                  }}
                  rowRender={(item) => (
                    <span style={{ fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg, #F3F4F6 0%, #E8E9EC 100%)", padding: "5px 10px", borderRadius: 7 }}>{item.label}</span>
                  )}
                  channelList={paidChannels.filter((ch) => Object.values(HEATMAP_DATA).some((row) => (row[ch.name] || 0) > 0))}
                  getData={(item, ch) => HEATMAP_DATA[item.label]?.[ch.name] || 0}
                />
              ) : (
                <BubbleHeatmap
                  rowLabels={{
                    header: "Segment",
                    items: [...INTEREST_SEGMENTS].sort((a, b) => (b.engaged / b.reach) - (a.engaged / a.reach)).map((seg, i) => ({ ...seg, rank: i })),
                  }}
                  rowRender={(item, i) => (
                    <>
                      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i < 3 ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "linear-gradient(135deg, #F3F4F6 0%, #E8E9EC 100%)", color: i < 3 ? "#fff" : P.text3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                      <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</span>
                    </>
                  )}
                  stickyWidth={170}
                  channelList={paidChannels.filter((ch) => INTEREST_SEGMENTS.some((seg) => (seg.channels[ch.name] || 0) > 0))}
                  getData={(item, ch) => item.channels?.[ch.name] || 0}
                />
              )}

              <HeatmapLegend />

              {/* Dynamic insights based on selected view */}
              <div style={{ margin: "0 24px 20px", padding: "14px 16px", background: P.accentFaint, borderRadius: 10, fontSize: 12.5, color: P.text2, lineHeight: 1.6 }}>
                {(() => {
                  if (heatmapView === "age") {
                    const ages = Object.keys(HEATMAP_DATA);
                    const chNames = paidChannels.map(c => c.name);
                    let bestCombo = { age: "", ch: "", val: 0 };
                    let worstCombo = { age: "", ch: "", val: 1 };
                    const ageTotals = {};
                    ages.forEach(age => {
                      let sum = 0, count = 0;
                      chNames.forEach(ch => {
                        const v = HEATMAP_DATA[age]?.[ch] || 0;
                        if (v > 0) { sum += v; count++; }
                        if (v > bestCombo.val) bestCombo = { age, ch, val: v };
                        if (v > 0 && v < worstCombo.val) worstCombo = { age, ch, val: v };
                      });
                      ageTotals[age] = count > 0 ? sum / count : 0;
                    });
                    const ageEntries = Object.entries(ageTotals).filter(([_, val]) => (val as number) > 0);
                    const strongestAge = ageEntries.sort((a, b) => (b[1] as number) - (a[1] as number))[0] || ["N/A", 0];
                    const weakestAge = ageEntries.sort((a, b) => (a[1] as number) - (b[1] as number))[0] || ["N/A", 0];

                    if (!bestCombo.age || !strongestAge[0]) {
                      return <div style={{ textAlign: "center", color: P.text3 }}>No data available for age analysis</div>;
                    }

                    return (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.accent }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.accent }}>Age × Channel · Key Findings</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                          <div>
                            <span style={{ fontWeight: 700, color: P.accent }}>{bestCombo.age}</span> on <span style={{ fontWeight: 700 }}>{bestCombo.ch}</span> is the strongest cell at {Math.round(bestCombo.val * 100)}% QRR — your highest-converting age×channel combination.
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, color: P.accent }}>{strongestAge[0]}</span> averages {Math.round((strongestAge[1] as number) * 100)}% QRR across all channels. <span style={{ fontWeight: 700, color: P.danger }}>{weakestAge[0]}</span> averages just {Math.round((weakestAge[1] as number) * 100)}% — consider reducing allocation.
                          </div>
                          {worstCombo.age && (
                            <div style={{ gridColumn: "1 / -1", paddingTop: 6, borderTop: `1px solid ${P.accent}15`, marginTop: 4 }}>
                              <span style={{ fontWeight: 700, color: P.danger }}>{worstCombo.age} × {worstCombo.ch}</span> is the weakest active cell at {Math.round(worstCombo.val * 100)}% — {Math.round(bestCombo.val / worstCombo.val)}× lower than the best. Reallocating this spend to {bestCombo.age} on {bestCombo.ch} would significantly improve QRR.
                            </div>
                          )}
                        </div>
                      </>
                    );
                  } else {
                    const sorted = [...INTEREST_SEGMENTS].sort((a, b) => (b.engaged / b.reach) - (a.engaged / a.reach));
                    const chNames = paidChannels.map(c => c.name);
                    let bestCombo = { seg: "", ch: "", val: 0 };
                    let worstCombo = { seg: "", ch: "", val: 1 };
                    let coldSpots = 0;
                    sorted.forEach(seg => {
                      chNames.forEach(ch => {
                        const v = seg.channels?.[ch] || 0;
                        if (v > bestCombo.val) bestCombo = { seg: seg.name, ch, val: v };
                        if (v > 0 && v < worstCombo.val) worstCombo = { seg: seg.name, ch, val: v };
                        if (v > 0 && v < 0.25) coldSpots++;
                      });
                    });
                    const hotSpots = sorted.reduce((count, seg) => count + chNames.filter(ch => (seg.channels?.[ch] || 0) >= 0.7).length, 0);
                    const topSeg = sorted[0];
                    const bottomSeg = sorted[sorted.length - 1];

                    if (!topSeg || !bottomSeg || !bestCombo.seg) {
                      return <div style={{ textAlign: "center", color: P.text3 }}>No data available for segment analysis</div>;
                    }

                    return (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.accent }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.accent }}>Segment × Channel · Key Findings</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                          <div>
                            <span style={{ fontWeight: 700, color: P.accent }}>{bestCombo.seg}</span> on <span style={{ fontWeight: 700 }}>{bestCombo.ch}</span> is the hottest cell at {Math.round(bestCombo.val * 100)}% QRR. There are <span style={{ fontWeight: 700, color: P.accent }}>{hotSpots} hot spots</span> (≥70%) across the matrix — concentrate spend here.
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, color: P.danger }}>{coldSpots} cold spots</span> (&lt;25% QRR) are absorbing budget with minimal qualification. <span style={{ fontWeight: 700 }}>{bottomSeg.name}</span> is the weakest segment overall — consider brand-only allocation.
                          </div>
                          <div style={{ gridColumn: "1 / -1", paddingTop: 6, borderTop: `1px solid ${P.accent}15`, marginTop: 4 }}>
                            <span style={{ fontWeight: 700 }}>{topSeg.name}</span> qualifies {fmtPct(topSeg.engaged / topSeg.reach)} across channels at {fmtMoney(topSeg.cper)} CpQR vs <span style={{ fontWeight: 700, color: P.danger }}>{bottomSeg.name}</span> at {fmtPct(bottomSeg.engaged / bottomSeg.reach)} and {fmtMoney(bottomSeg.cper)} — a {Math.round(bottomSeg.cper / topSeg.cper)}× efficiency gap. Shift budget from cold spots to the {hotSpots} proven combinations.
                          </div>
                        </div>
                      </>
                    );
                  }
                })()}
              </div>
            </Card>
    </>
  );
}
