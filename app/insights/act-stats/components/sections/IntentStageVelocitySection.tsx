"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { P } from "@/lib/act-stats/data";

interface StageData {
  name: string;
  label: string;
  subLabel: string;
  color: string;
  currentVolume: number;
  currentPercentage: number;
  previousVolume: number;
  previousPercentage: number;
  delta: number;
}

const stageData: StageData[] = [
  {
    name: "Exploration",
    label: "EXPLORATION",
    subLabel: "Low-intent",
    color: "#B8A4FC",
    currentVolume: 30096,
    currentPercentage: 57.0,
    previousVolume: 30848,
    previousPercentage: 64.0,
    delta: -7.0,
  },
  {
    name: "Evaluation",
    label: "EVALUATION",
    subLabel: "Mid-intent",
    color: "#7C5CFC",
    currentVolume: 16262,
    currentPercentage: 30.8,
    previousVolume: 13496,
    previousPercentage: 28.0,
    delta: 2.8,
  },
  {
    name: "Commitment",
    label: "COMMITMENT",
    subLabel: "High-intent",
    color: "#4A2D8A",
    currentVolume: 6442,
    currentPercentage: 12.2,
    previousVolume: 3856,
    previousPercentage: 8.0,
    delta: 4.2,
  },
];

const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString());
const fmtCommas = (n: number) => n.toLocaleString();

const generateFunnelPath = (
  centerY: number,
  halfHeights: number[],
  stageWidth: number,
  padLeft: number,
  padRight: number,
  totalWidth: number
): string => {
  const stageXs = [
    padLeft + stageWidth / 2,
    padLeft + stageWidth + stageWidth / 2,
    padLeft + 2 * stageWidth + stageWidth / 2,
  ];
  const [h1, h2, h3] = halfHeights;
  const ctrl = stageWidth * 0.45;
  const leftEdge = padLeft;
  const rightEdge = totalWidth - padRight;

  let top = `M${leftEdge},${centerY - h1}`;
  top += ` C${stageXs[0] - ctrl},${centerY - h1} ${stageXs[0] - ctrl},${centerY - h1} ${stageXs[0]},${centerY - h1}`;
  top += ` C${stageXs[0] + ctrl},${centerY - h1} ${stageXs[1] - ctrl},${centerY - h2} ${stageXs[1]},${centerY - h2}`;
  top += ` C${stageXs[1] + ctrl},${centerY - h2} ${stageXs[2] - ctrl},${centerY - h3} ${stageXs[2]},${centerY - h3}`;
  top += ` L${rightEdge},${centerY - h3}`;

  let bottom = `L${rightEdge},${centerY + h3}`;
  bottom += ` L${stageXs[2]},${centerY + h3}`;
  bottom += ` C${stageXs[2] - ctrl},${centerY + h3} ${stageXs[1] + ctrl},${centerY + h2} ${stageXs[1]},${centerY + h2}`;
  bottom += ` C${stageXs[1] - ctrl},${centerY + h2} ${stageXs[0] + ctrl},${centerY + h1} ${stageXs[0]},${centerY + h1}`;
  bottom += ` C${stageXs[0] - ctrl},${centerY + h1} ${leftEdge},${centerY + h1} ${leftEdge},${centerY + h1}`;

  return top + bottom + " Z";
};

// ─── Your Next Move Strip ─────────────────────────────────────
function YourNextMoveStrip() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {/* Toggle bar */}
      <div
        onClick={() => setIsExpanded((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          cursor: "pointer",
          backgroundColor: isExpanded ? "#EDE8FF" : "#F6F3FF",
          borderTop: "2px solid #B8A4FC",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#EDE8FF"; }}
        onMouseLeave={(e) => { if (!isExpanded) (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F6F3FF"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* +/- icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#4A2D8A" strokeWidth="1.5" fill="none" />
            {isExpanded ? (
              <line x1="5" y1="9" x2="13" y2="9" stroke="#4A2D8A" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <line x1="9" y1="5" x2="9" y2="13" stroke="#4A2D8A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="5" y1="9" x2="13" y2="9" stroke="#4A2D8A" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#4A2D8A" }}>Your Next Move</span>
          <span style={{ fontSize: 12, color: "#9B7DFC", marginLeft: 4 }}>3 actions from AgentIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: "#fff", background: "#7C5CFC", padding: "4px 12px", borderRadius: 999, letterSpacing: "0.3px" }}>
            3 ACTIONS
          </span>
          {isExpanded ? <ChevronUp size={18} color="#4A2D8A" /> : <ChevronDown size={18} color="#4A2D8A" />}
        </div>
      </div>

      {/* Expandable body */}
      <div
        style={{
          maxHeight: isExpanded ? 500 : 0,
          overflow: "hidden",
          transition: "max-height 400ms cubic-bezier(0.25,0.46,0.45,0.94), padding 300ms ease",
          padding: isExpanded ? "8px 24px 20px" : "0 24px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
          {[
            {
              label: "SCALE COMMITMENT",
              labelColor: "#6C3FC7",
              title: "+4.2 pts growth",
              desc: "Commitment share is accelerating. Double down on ROI Calculator and Case Study distribution — they're driving Evaluation → Commitment.",
            },
            {
              label: "FEED THE MIDDLE",
              labelColor: "#0284C7",
              title: "Evaluation +2.8 pts",
              desc: "Mid-funnel content is pulling users from Exploration into Evaluation. Expand comparison pages and demo content to keep momentum.",
            },
            {
              label: "WATCH EXPLORATION",
              labelColor: "#F59E0B",
              title: "−7.0 pts share drop",
              desc: "Exploration is shrinking. Healthy if users are progressing — but monitor that total volume (52.8K, +9.5%) stays stable.",
            },
          ].map((card) => (
            <div
              key={card.label}
              style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #EDEDF4", background: "#F7F7FA", transition: "border-color 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#D4C8FD"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(124,92,252,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "#EDEDF4"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", color: card.labelColor, marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", marginBottom: 4, letterSpacing: -0.1 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "#6E6E85", lineHeight: 1.45 }}>{card.desc}</div>
            </div>
          ))}
        </div>
        <button
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(135deg, #7C5CFC 0%, #9B7DFC 100%)",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(124,92,252,0.3)",
            marginLeft: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(124,92,252,0.4)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(124,92,252,0.3)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
        >
          Show Me More From AgentIQ →
        </button>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────
export function IntentStageVelocitySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [tooltipData, setTooltipData] = useState<{ stage: StageData; x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG dimensions — match reference exactly
  const W = 960;
  const H = 380;
  const pad = { top: 60, right: 40, bottom: 30, left: 40 };
  const chartAreaH = H - pad.top - pad.bottom; // 290
  const centerY = pad.top + chartAreaH / 2;     // 205
  const maxHalfH = chartAreaH / 2 - 5;          // 140
  const stageWidth = (W - pad.left - pad.right) / 3;

  // Volume-based half-heights (same as reference)
  const maxVol = Math.max(...stageData.map((s) => s.currentVolume), ...stageData.map((s) => s.previousVolume));
  const halfH = (vol: number) => (vol / maxVol) * maxHalfH * 0.8;
  const currentHalves = stageData.map((s) => halfH(s.currentVolume));
  const prevHalves = stageData.map((s) => halfH(s.previousVolume));

  const currentPath = generateFunnelPath(centerY, currentHalves, stageWidth, pad.left, pad.right, W);
  const previousPath = generateFunnelPath(centerY, prevHalves, stageWidth, pad.left, pad.right, W);

  const stageXs = [
    pad.left + stageWidth / 2,
    pad.left + stageWidth + stageWidth / 2,
    pad.left + 2 * stageWidth + stageWidth / 2,
  ];

  const handleHover = (idx: number | null, e?: React.MouseEvent) => {
    if (idx === null || !e || !containerRef.current) { setTooltipData(null); return; }
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipData({ stage: stageData[idx], x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginBottom: 32 }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text1, margin: 0, letterSpacing: -0.3 }}>
          Intent Stage Velocity
        </h2>
        <p style={{ fontSize: 13, color: P.text3, margin: "4px 0 0" }}>
          How fast is intent deepening?
        </p>
      </div>

      {/* Card */}
      <div style={{ background: "#fff", border: `1px solid ${P.border}`, borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
        <div style={{ padding: "28px 32px 32px" }}>
          {/* Card header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E" }}>
              Compare the shift. Scale what&apos;s deepening. Fix what&apos;s stalling.
            </div>
          </div>

          {/* Funnel container */}
          <div
            ref={containerRef}
            style={{ position: "relative", background: "#F5F3FA", borderRadius: 12, overflow: "hidden", aspectRatio: "960/420" }}
            onMouseLeave={() => setTooltipData(null)}
          >
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{ width: "100%", height: "100%", display: "block" }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="isv-grad-current" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B8A4FC" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#7C5CFC" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#4A2D8A" stopOpacity="0.75" />
                </linearGradient>
                <linearGradient id="isv-grad-prev" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B8A4FC" stopOpacity="0.15" />
                  <stop offset="45%" stopColor="#7C5CFC" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4A2D8A" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Previous period ghost */}
              <path d={previousPath} fill="url(#isv-grad-prev)" />
              <path d={previousPath} fill="none" stroke="#9494A8" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5" />

              {/* Current period */}
              <path d={currentPath} fill="url(#isv-grad-current)" />

              {/* Stage dividers */}
              <line x1={pad.left + stageWidth}   y1={pad.top - 10} x2={pad.left + stageWidth}   y2={H - pad.bottom + 10} stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1={pad.left + 2 * stageWidth} y1={pad.top - 10} x2={pad.left + 2 * stageWidth} y2={H - pad.bottom + 10} stroke="white" strokeWidth="1" opacity="0.3" />

              {/* Stage labels — ABOVE funnel */}
              {stageData.map((stage, i) => (
                <g key={`lbl-${i}`}>
                  <text x={stageXs[i]} y={30}  fontSize="12" fontWeight="600" fill={stage.color} textAnchor="middle" letterSpacing="0.3">{stage.label}</text>
                  <text x={stageXs[i]} y={46}  fontSize="10" fill="#9494A8"  textAnchor="middle">{stage.subLabel}</text>
                </g>
              ))}

              {/* Inside funnel: volume (large) + percentage (small) */}
              {stageData.map((stage, i) => (
                <g key={`data-${i}`}>
                  <text x={stageXs[i]} y={centerY - 6}  fontSize="24" fontWeight="700" fill="white" fillOpacity="0.95" textAnchor="middle" fontFamily="monospace">
                    {fmtK(stage.currentVolume)}
                  </text>
                  <text x={stageXs[i]} y={centerY + 16} fontSize="13" fontWeight="600" fill="rgba(255,255,252,0.8)" textAnchor="middle" fontFamily="monospace">
                    {stage.currentPercentage.toFixed(1)}%
                  </text>
                </g>
              ))}

              {/* Delta badges — inside SVG, below funnel content */}
              {stageData.map((stage, i) => {
                let badgeY: number;
                if (i === 0) badgeY = centerY + currentHalves[i] + 35;
                else if (i === 1) badgeY = centerY + currentHalves[i] + 18;
                else badgeY = centerY + 20;

                return (
                  <text
                    key={`delta-${i}`}
                    x={stageXs[i]}
                    y={badgeY}
                    fontSize="11.5"
                    fontWeight="700"
                    fill={stage.delta < 0 ? "#EF4444" : "#7C5CFC"}
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {stage.delta >= 0 ? "+" : ""}{stage.delta.toFixed(1)} pts
                  </text>
                );
              })}

              {/* Total volume callout — top right */}
              <g>
                <text x={W - pad.right} y={30} fontSize="11" fill="#9494A8" textAnchor="end">Total:</text>
                <text x={W - pad.right} y={45} fontSize="13" fontWeight="700" fill="#1A1A2E" textAnchor="end" fontFamily="monospace">52,800</text>
                <text x={W - pad.right} y={60} fontSize="11" fill="#6C3FC7" textAnchor="end" fontFamily="monospace">↑ +9.5%</text>
              </g>

              {/* Hover targets */}
              {stageData.map((_, i) => (
                <rect
                  key={`hit-${i}`}
                  x={pad.left + i * stageWidth}
                  y={0}
                  width={stageWidth}
                  height={H}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => handleHover(i, e)}
                  onMouseLeave={() => handleHover(null)}
                  onMouseMove={(e) => handleHover(i, e)}
                />
              ))}
            </svg>

            {/* Tooltip */}
            {tooltipData && (
              <div
                style={{
                  position: "absolute",
                  left: tooltipData.x + 14,
                  top: tooltipData.y - 10,
                  transform: "translateY(-100%)",
                  pointerEvents: "none",
                  zIndex: 50,
                  background: "#F6F3FF",
                  border: "1px solid #E5DEFF",
                  borderRadius: 12,
                  padding: "12px 16px",
                  minWidth: 210,
                  boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2D1B69", marginBottom: 8 }}>
                  {tooltipData.stage.name} · {tooltipData.stage.subLabel}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12 }}>
                  {[
                    { label: "Current volume",  value: fmtCommas(tooltipData.stage.currentVolume) },
                    { label: "Current share",   value: `${tooltipData.stage.currentPercentage.toFixed(1)}%` },
                    { label: "Previous volume", value: fmtCommas(tooltipData.stage.previousVolume) },
                    { label: "Previous share",  value: `${tooltipData.stage.previousPercentage.toFixed(1)}%` },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <span style={{ color: "#6E6E85" }}>{row.label}</span>
                      <span style={{ fontWeight: 500, fontFamily: "monospace", color: "#1A1A2E" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: "#D4C8FD", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "#6E6E85" }}>Shift</span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: tooltipData.stage.delta >= 0 ? "#22C55E" : "#EF4444" }}>
                    {tooltipData.stage.delta >= 0 ? "+" : ""}{tooltipData.stage.delta.toFixed(1)} pts
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Legend row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, paddingTop: 16, paddingBottom: 4 }}>
            {stageData.map((stage) => (
              <div key={stage.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: stage.color }} />
                <span style={{ fontSize: 11.5, color: "#6E6E85" }}>{stage.name} ({stage.subLabel})</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 12, marginLeft: 4, borderLeft: "1px solid #DDDDE8" }}>
              <div style={{ width: 20, height: 0, borderTop: "2px dashed #9494A8" }} />
              <span style={{ fontSize: 11.5, color: "#6E6E85" }}>Previous period</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EDEDF4" }} />

        {/* Your Next Move strip */}
        <YourNextMoveStrip />
      </div>
    </motion.div>
  );
}
