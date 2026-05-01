"use client";

import { useState } from "react";
import {
  P,
  GEO_COUNTRIES,
  enrichedChannels,
  paidChannels,
  fmt,
  fmtPct,
  fmtMoney,
  fmtSpend,
  type GeoCountry,
} from "@/lib/reach-stats/data";
import { BubbleHeatmap } from "@/components/reach-stats/BubbleHeatmap";
import { HeatmapLegend } from "@/components/reach-stats/HeatmapLegend";
import { CountryFlag } from "@/components/reach-stats/CountryFlag";
import { AnimatedNumber } from "@/components/reach-stats/AnimatedNumber";

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

export function GeographyTab() {
  const [selectedCountry, setSelectedCountry] = useState<GeoCountry | null>(null);

  return (
    <>

            {selectedCountry && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <button
                  onClick={() => setSelectedCountry(null)}
                  style={{
                    color: P.accent,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                  }}
                >
                  ← All Markets
                </button>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CountryFlag
                    code={selectedCountry.code}
                    name={selectedCountry.name}
                    size={22}
                  />{" "}
                  {selectedCountry.name}
                </span>
              </div>
            )}

            {!selectedCountry && (() => {
              const geoEnriched = GEO_COUNTRIES.map(c => ({
                ...c,
                qrr: c.engaged / c.reach,
                cpqr: c.spend > 0 ? c.spend / (c.engaged / 1000) : 0,
              }));
              const maxR = Math.max(...geoEnriched.map(c => c.reach));

              return (
                <Card style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Market QRR Quality</h3>
                  <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}>Qualified Reach Rate and cost by country · Click to drill into cities</p>
                  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 56px 66px 64px", gap: 12, margin: "12px 0 6px", padding: "0 4px" }}>
                    <div style={{ display: "flex", gap: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}>
                        <div style={{ width: 9, height: 9, borderRadius: 2, background: P.barGrey }} /> Reach
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: P.text3 }}>
                        <div style={{ width: 9, height: 9, borderRadius: 2, background: P.accent, opacity: 0.6 }} /> QR
                      </div>
                    </div>
                    <div />
                    <div style={{ fontSize: 10, color: P.text3, textAlign: "right", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>QRR</div>
                    <div style={{ fontSize: 10, color: P.text3, textAlign: "right", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>CpQR</div>
                    <div style={{ fontSize: 10, color: P.text3, textAlign: "right", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Spend</div>
                  </div>
                  {[...geoEnriched].sort((a, b) => b.qrr - a.qrr).map((c) => (
                    <div
                      key={c.code}
                      onClick={() => setSelectedCountry(c)}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr 56px 66px 64px",
                        alignItems: "center",
                        gap: 12,
                        padding: "8px 4px",
                        cursor: "pointer",
                        borderRadius: 8,
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = P.bg}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CountryFlag code={c.code} name={c.name} size={28} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: P.text3 }}>{c.cities.length} cities</div>
                        </div>
                      </div>
                      <div style={{ position: "relative", height: 24 }}>
                        <div style={{
                          position: "absolute",
                          height: "100%",
                          width: `${(c.reach / maxR) * 100}%`,
                          background: P.barGrey,
                          borderRadius: 5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 8
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 500, color: P.text3 }}>{fmt(c.reach)}</span>
                        </div>
                        <div style={{
                          position: "absolute",
                          height: "100%",
                          width: `${(c.engaged / maxR) * 100}%`,
                          background: P.accent,
                          borderRadius: 5,
                          opacity: 0.6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: 8,
                          minWidth: 42
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#fff" }}>{fmt(c.engaged)}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, textAlign: "right", color: qrrColor(c.qrr) }}>
                        {fmtPct(c.qrr)}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, textAlign: "right", color: c.cpqr <= 3 ? P.text2 : P.danger }}>
                        {fmtMoney(c.cpqr)}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, textAlign: "right", color: P.text3 }}>
                        {fmtSpend(c.spend)}
                      </div>
                    </div>
                  ))}
                </Card>
              );
            })()}

            {/* Market × Channel QRR Section */}
            {!selectedCountry && (() => {
              const geoEnriched = GEO_COUNTRIES.map(c => ({
                ...c,
                qrr: c.engaged / c.reach,
                cpqr: c.spend > 0 ? c.spend / (c.engaged / 1000) : 0,
              }));

              return (
                <Card style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
                  <div style={{ padding: "22px 24px 16px" }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Market × Channel QRR</h3>
                    <p style={{ fontSize: 13, color: P.text3, margin: "3px 0 0" }}>Which channels qualify attention in each market · scroll →</p>
                  </div>

                  <BubbleHeatmap
                    rowLabels={{
                      header: "Mkt",
                      items: [...geoEnriched].sort((a, b) => b.qrr - a.qrr).map((c) => ({ ...c, onClick: () => setSelectedCountry(c) })),
                    }}
                    rowRender={(item) => (
                      <CountryFlag code={item.code} name={item.name} size={28} style={{ cursor: "pointer" }} />
                    )}
                    channelList={paidChannels.filter((ch) => geoEnriched.some((c) => (c.channels[ch.name] || 0) > 0))}
                    getData={(item, ch) => item.channels?.[ch.name] || 0}
                  />

                  <HeatmapLegend />

                  {/* Dynamic insights */}
                  <div style={{ margin: "0 24px 20px", padding: "14px 16px", background: P.accentFaint, borderRadius: 10, fontSize: 12.5, color: P.text2, lineHeight: 1.6 }}>
                    {(() => {
                      const sorted = [...geoEnriched].sort((a, b) => b.qrr - a.qrr);
                      const chNames = paidChannels.map(c => c.name);
                      let bestCombo = { market: "", code: "", ch: "", val: 0 };
                      let worstCombo = { market: "", code: "", ch: "", val: 1 };
                      let hotSpots = 0, coldSpots = 0;
                      const marketAvgs: Record<string, { name: string; code: string; avg: number; qrr: number; cpqr: number }> = {};

                      sorted.forEach(mkt => {
                        let sum = 0, count = 0;
                        chNames.forEach(ch => {
                          const v = mkt.channels?.[ch] || 0;
                          if (v > 0) { sum += v; count++; }
                          if (v > bestCombo.val) bestCombo = { market: mkt.name, code: mkt.code, ch, val: v };
                          if (v > 0 && v < worstCombo.val) worstCombo = { market: mkt.name, code: mkt.code, ch, val: v };
                          if (v >= 0.6) hotSpots++;
                          if (v > 0 && v < 0.25) coldSpots++;
                        });
                        marketAvgs[mkt.code] = { name: mkt.name, code: mkt.code, avg: count > 0 ? sum / count : 0, qrr: mkt.qrr, cpqr: mkt.cpqr };
                      });

                      const mktSorted = Object.values(marketAvgs).sort((a, b) => b.avg - a.avg);
                      const topMkt = mktSorted[0];
                      const bottomMkt = mktSorted[mktSorted.length - 1];
                      const totalSpend = sorted.reduce((s, m) => s + m.spend, 0);
                      const underMkts = sorted.filter(m => m.qrr < 0.45);
                      const underSpend = underMkts.reduce((s, m) => s + m.spend, 0);

                      return (
                        <>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: P.accent }} />
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: P.accent }}>Market × Channel · Key Findings</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                            <div>
                              <CountryFlag code={bestCombo.code} name={bestCombo.market} size={16} style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }} />
                              <span style={{ fontWeight: 700, color: P.accent }}>{bestCombo.market}</span> on <span style={{ fontWeight: 700 }}>{bestCombo.ch}</span> is the strongest cell at {Math.round(bestCombo.val * 100)}% QRR.
                              <span style={{ fontWeight: 700, color: P.accent }}>{hotSpots} hot spots</span> (≥60%) across {sorted.length} markets — your proven combinations.
                            </div>
                            <div>
                              <CountryFlag code={topMkt.code} name={topMkt.name} size={16} style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }} />
                              <span style={{ fontWeight: 700, color: P.accent }}>{topMkt.name}</span> averages {Math.round(topMkt.avg * 100)}% QRR at {fmtMoney(topMkt.cpqr)} CpQR.
                              <CountryFlag code={bottomMkt.code} name={bottomMkt.name} size={16} style={{ display: "inline-flex", verticalAlign: "middle", marginRight: 4 }} />
                              <span style={{ fontWeight: 700, color: P.danger }}>{bottomMkt.name}</span> averages just {Math.round(bottomMkt.avg * 100)}% at {fmtMoney(bottomMkt.cpqr)} — {Math.round(bottomMkt.cpqr / topMkt.cpqr)}× the cost.
                            </div>
                            {underMkts.length > 0 && (
                              <div style={{ gridColumn: "1 / -1", paddingTop: 6, borderTop: `1px solid ${P.accent}15`, marginTop: 4 }}>
                                <span style={{ fontWeight: 700, color: P.danger }}>{coldSpots} cold spots</span> (&lt;25% QRR) and
                                <span style={{ fontWeight: 700 }}> {underMkts.length} underperforming market{underMkts.length > 1 ? "s" : ""}</span> ({underMkts.map(m => m.name).join(", ")}) absorb
                                <span style={{ fontWeight: 700 }}> ${((underSpend ?? 0) / 1000).toFixed(1)}K</span> ({Math.round(underSpend / totalSpend * 100)}% of geo spend).
                                Reallocate to {topMkt.name} or scale {bestCombo.ch} across top-performing markets.
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              );
            })()}

            {selectedCountry && (
              <Card>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>
                  City Performance · {selectedCountry.name}
                </h3>
                <p
                  style={{ fontSize: 13, color: P.text3, margin: "3px 0 18px" }}
                >
                  Reach breakdown by city
                </p>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {selectedCountry.cities.map((city, i) => {
                    const qrr = city.engaged / city.reach;
                    return (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "160px 1fr 100px 80px",
                          alignItems: "center",
                          gap: 16,
                          padding: 12,
                          background: "#F9FAFB",
                          borderRadius: 8,
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600 }}>
                          {city.name}
                        </div>

                        <div style={{ position: "relative", height: 24 }}>
                          <div
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: `${(city.reach / selectedCountry.cities[0].reach) * 100}%`,
                              background: "#E5E7EB",
                              borderRadius: 4,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                paddingLeft: 8,
                                lineHeight: "24px",
                              }}
                            >
                              {fmt(city.reach)}
                            </span>
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              height: "100%",
                              width: `${(city.engaged / selectedCountry.cities[0].reach) * 100}%`,
                              background: P.accent,
                              borderRadius: 4,
                              opacity: 0.7,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: qrr >= 0.6 ? P.accent : P.text2,
                          }}
                        >
                          {fmtPct(qrr)} QRR
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: P.text3,
                            textAlign: "right",
                          }}
                        >
                          ${fmtSpend(city.spend)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
    </>
  );
}
