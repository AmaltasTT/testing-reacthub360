"use client";

import { P, BUDGET_DATA, fmtSpend } from "@/lib/engage-stats/data";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid rgba(229,231,235,0.6)", ...style }}>
    {children}
  </div>
);

export function BudgetPacingSection() {
  const d = BUDGET_DATA;
  const roasVariance = ((d.roas - d.roasTarget) / d.roasTarget * 100).toFixed(0);
  const budgetPct = Math.round((d.spent / d.total) * 100);
  const periodPct = Math.round((d.daysElapsed / d.totalDays) * 100);
  const daysRemaining = d.totalDays - d.daysElapsed;

  return (
    <Card style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
        {/* Left: Budget metrics */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.2, color: P.text3, textTransform: "uppercase", marginBottom: 24 }}>
            ENGAGE BUDGET PACING
          </div>

          {/* 4-column metrics row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 40 }}>
            {/* SPENT */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>SPENT</div>
              <div style={{ fontSize: 21, fontWeight: 600, color: P.text1, letterSpacing: -0.4, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                {fmtSpend(d.spent)}
              </div>
              <div style={{ fontSize: 11, color: P.text3, marginBottom: 16 }}>of {fmtSpend(d.total)} campaign budget</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: P.text3, marginBottom: 6, fontWeight: 500 }}>{budgetPct}% of budget</div>
                  <div style={{ height: 8, background: "rgba(209,213,219,0.5)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${budgetPct}%`, height: "100%", background: `linear-gradient(90deg, #10B981, #34D399)`, borderRadius: 999, transition: "width 1.5s ease" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: P.text3, marginBottom: 6, fontWeight: 500 }}>{periodPct}% of period elapsed</div>
                  <div style={{ height: 8, background: "rgba(209,213,219,0.5)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${periodPct}%`, height: "100%", background: "rgba(209,213,219,0.8)", borderRadius: 999, transition: "width 1.5s ease" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* REMAINING */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>REMAINING</div>
              <div style={{ fontSize: 21, fontWeight: 600, color: P.text1, letterSpacing: -0.4, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                {fmtSpend(d.remaining)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>On track — 2% under pace</div>
            </div>

            {/* DAILY RUN RATE */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>DAILY RUN RATE</div>
              <div style={{ fontSize: 21, fontWeight: 600, color: P.text1, letterSpacing: -0.4, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                ${d.dailyRunRate.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: P.text3, fontWeight: 500 }}>avg/day this period</div>
            </div>

            {/* PHASE SHARE */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>PHASE SHARE</div>
              <div style={{ fontSize: 21, fontWeight: 600, color: P.text1, letterSpacing: -0.4, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                {(d.phaseShare * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Highest allocation</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 20, fontSize: 11, color: P.text3, fontWeight: 500 }}>
            <span style={{ color: "#059669", fontWeight: 700 }}>▲ 12%</span>
            <span>${(d.spent * 0.89).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} prior period</span>
            <span>{d.daysElapsed} of {d.totalDays} days elapsed · {daysRemaining} days remaining</span>
          </div>
        </div>

        {/* Right: ROAS sidebar */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(254,242,242,1) 0%, rgba(254,242,242,0.5) 100%)",
            border: "1px solid rgba(254,202,202,0.6)",
            borderRadius: 16,
            padding: "20px 24px",
            width: 300,
            flexShrink: 0,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, letterSpacing: -0.2 }}>ROAS Status: Under Pressure</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Overall ROAS:", value: `${d.roas}x` },
              { label: "Target ROAS:", value: `${d.roasTarget}x` },
              { label: "Variance:", value: `${roasVariance}% vs target` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <span style={{ color: P.text2, fontWeight: 500 }}>{label}</span>
                <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.4 }}>Primary Drag</div>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {d.primaryDrags.map((drag, i) => (
                <li key={i} style={{ fontSize: 11, color: P.text2, fontWeight: 500 }}>{drag}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, letterSpacing: 0.4 }}>Primary Strength</div>
            <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {d.strengths.map((s, i) => (
                <li key={i} style={{ fontSize: 11, color: P.text2, fontWeight: 500 }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
