"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────

const channelFlowData = [
  { channel: "Organic Search", color: "#6C3FC7", volume: 18200, explore: 0.22, evaluate: 0.36, commit: 0.42, commitmentPct: 42, acr: 72, dropped: 14, friction: null },
  { channel: "Email",          color: "#7C5CFC", volume: 12600, explore: 0.30, evaluate: 0.42, commit: 0.28, commitmentPct: 28, acr: 58, dropped: 20, friction: null },
  { channel: "LinkedIn Ads",   color: "#9B7DFC", volume: 8400,  explore: 0.18, evaluate: 0.38, commit: 0.44, commitmentPct: 44, acr: 26, dropped: 16, friction: "Form pre-fill failing" },
  { channel: "Google PPC",     color: "#3B82F6", volume: 6900,  explore: 0.35, evaluate: 0.38, commit: 0.27, commitmentPct: 27, acr: 45, dropped: 24, friction: null },
  { channel: "Facebook Ads",   color: "#B8A4FC", volume: 3850,  explore: 0.71, evaluate: 0.21, commit: 0.08, commitmentPct: 8,  acr: 31, dropped: 44, friction: "Low-intent traffic" },
  { channel: "TikTok",         color: "#52526B", volume: 2900,  explore: 0.68, evaluate: 0.24, commit: 0.08, commitmentPct: 8,  acr: 22, dropped: 52, friction: "No mid-funnel path" },
  { channel: "HubSpot Forms",  color: "#E67E22", volume: 4200,  explore: 0.15, evaluate: 0.45, commit: 0.40, commitmentPct: 40, acr: 35, dropped: 35, friction: "Required fields drop-off" },
];

const flowData = [
  { from: "Organic Search", to: "Commitment", volume: 7644,  ofChannel: 42, ofTier: 40 },
  { from: "Organic Search", to: "Evaluation", volume: 6552,  ofChannel: 36, ofTier: 31 },
  { from: "Organic Search", to: "Exploration", volume: 4004, ofChannel: 22, ofTier: 24 },
  { from: "Email",          to: "Commitment", volume: 3528,  ofChannel: 28, ofTier: 19 },
  { from: "Email",          to: "Evaluation", volume: 5292,  ofChannel: 42, ofTier: 25 },
  { from: "Email",          to: "Exploration", volume: 3780, ofChannel: 30, ofTier: 22 },
  { from: "LinkedIn Ads",   to: "Commitment", volume: 3696,  ofChannel: 44, ofTier: 19 },
  { from: "LinkedIn Ads",   to: "Evaluation", volume: 3192,  ofChannel: 38, ofTier: 15 },
  { from: "LinkedIn Ads",   to: "Exploration", volume: 1512, ofChannel: 18, ofTier: 9  },
  { from: "Google PPC",     to: "Commitment", volume: 1863,  ofChannel: 27, ofTier: 10 },
  { from: "Google PPC",     to: "Evaluation", volume: 2622,  ofChannel: 38, ofTier: 12 },
  { from: "Google PPC",     to: "Exploration", volume: 2415, ofChannel: 35, ofTier: 14 },
  { from: "Facebook Ads",   to: "Commitment", volume: 308,   ofChannel: 8,  ofTier: 2  },
  { from: "Facebook Ads",   to: "Evaluation", volume: 809,   ofChannel: 21, ofTier: 4  },
  { from: "Facebook Ads",   to: "Exploration", volume: 2734, ofChannel: 71, ofTier: 16 },
  { from: "TikTok",         to: "Commitment", volume: 232,   ofChannel: 8,  ofTier: 1  },
  { from: "TikTok",         to: "Evaluation", volume: 696,   ofChannel: 24, ofTier: 3  },
  { from: "TikTok",         to: "Exploration", volume: 1972, ofChannel: 68, ofTier: 12 },
  { from: "HubSpot Forms",  to: "Commitment", volume: 1680,  ofChannel: 40, ofTier: 9  },
  { from: "HubSpot Forms",  to: "Evaluation", volume: 1890,  ofChannel: 45, ofTier: 9  },
  { from: "HubSpot Forms",  to: "Exploration", volume: 630,  ofChannel: 15, ofTier: 4  },
];

// ─── Helpers ─────────────────────────────────────────────────

const calculateVerdict = (commitmentPct: number, acr: number, dropped: number): string => {
  if (commitmentPct >= 35 && acr >= 50) return "Scale";
  if (commitmentPct >= 35 && acr < 50) return "Fix Friction";
  if (commitmentPct >= 20 && commitmentPct < 35) return "Maintain";
  if (dropped >= 40) return "Fix";
  return "Optimize";
};

const verdictStyle = (v: string) => {
  if (v === "Scale") return { bg: "#DCFCE7", text: "#15803D" };
  if (v === "Fix Friction") return { bg: "#FEE2E2", text: "#991B1B" };
  if (v === "Fix") return { bg: "#FEE2E2", text: "#991B1B" };
  if (v === "Maintain") return { bg: "#FEF3C7", text: "#92400E" };
  return { bg: "#FEF3C7", text: "#92400E" }; // Optimize
};

function createRibbonPath(x1: number, y1Top: number, y1Bottom: number, x2: number, y2Top: number, y2Bottom: number): string {
  const cx = (x2 - x1) * 0.5;
  return [
    `M ${x1} ${y1Top}`,
    `C ${x1 + cx} ${y1Top}, ${x2 - cx} ${y2Top}, ${x2} ${y2Top}`,
    `L ${x2} ${y2Bottom}`,
    `C ${x2 - cx} ${y2Bottom}, ${x1 + cx} ${y1Bottom}, ${x1} ${y1Bottom}`,
    `Z`,
  ].join(" ");
}

type SortKey = "volume" | "commitmentPct" | "acr" | "dropped" | "friction" | "verdict";

// ─── Tooltip ─────────────────────────────────────────────────

interface TooltipData {
  from: string;
  to: string;
  volume: number;
  ofChannel: number;
  ofTier: number;
  type: "channel-tier" | "tier-outcome";
}

function SankeyTooltip({ data, position }: { data: TooltipData; position: { x: number; y: number } }) {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 50,
        left: position.x + 14,
        top: position.y - 10,
        transform: "translateY(-100%)",
        background: "#fff",
        border: "1px solid #EDE8FF",
        borderRadius: 10,
        padding: "12px 16px",
        minWidth: 220,
        boxShadow: "0 8px 30px rgba(74,45,138,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E", marginBottom: 8 }}>
        {data.from} → {data.to}
      </div>
      <div style={{ borderTop: "1px solid #EDEDF4", marginBottom: 8 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#9494A8" }}>Volume</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", fontFamily: "monospace" }}>{data.volume.toLocaleString()}</span>
      </div>
      <div style={{ borderTop: "1px solid #EDEDF4", marginBottom: 6 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#9494A8" }}>{data.type === "channel-tier" ? "% of channel total" : "% of tier volume"}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#6C3FC7", fontFamily: "monospace" }}>{data.ofChannel}%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#9494A8" }}>{data.type === "channel-tier" ? "% of tier intake" : "% of outcome total"}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#3D3D56", fontFamily: "monospace" }}>{data.ofTier}%</span>
      </div>
    </div>
  );
}

// ─── Sankey Diagram ──────────────────────────────────────────

function SankeyDiagram() {
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const svgWidth = 960;
  const svgHeight = 580;
  const colX = [60, 400, 740];
  const colW = 120;
  const nodeGap = 10;
  const startY = 50;
  const usableHeight = svgHeight - 100;
  const totalVolume = channelFlowData.reduce((s, d) => s + d.volume, 0);
  const scale = usableHeight / totalVolume;

  // Channel nodes
  const channelNodes = channelFlowData.map((ch, i) => {
    const height = ch.volume * scale;
    const y = i === 0 ? startY : startY + channelFlowData.slice(0, i).reduce((s, d) => s + d.volume * scale + nodeGap, 0);
    return { ...ch, x: colX[0], y, height, width: colW };
  });

  // Tier totals
  const tierOrder = ["commitment", "evaluation", "exploration"] as const;
  const tierColors = { commitment: "#4A2D8A", evaluation: "#7C5CFC", exploration: "#B8A4FC" };
  const tierLabels = { commitment: "Commitment", evaluation: "Evaluation", exploration: "Exploration" };
  const tierTotals = {
    commitment: channelFlowData.reduce((s, d) => s + d.volume * d.commit, 0),
    evaluation: channelFlowData.reduce((s, d) => s + d.volume * d.evaluate, 0),
    exploration: channelFlowData.reduce((s, d) => s + d.volume * d.explore, 0),
  };

  let tierY = startY;
  const tierNodes = tierOrder.map((tier) => {
    const total = tierTotals[tier];
    const height = total * scale;
    const node = { id: tier, label: tierLabels[tier], color: tierColors[tier], total, pct: Math.round((total / totalVolume) * 100), x: colX[1], y: tierY, height, width: colW };
    tierY += height + nodeGap;
    return node;
  });

  // Outcome nodes
  const outcomeTotals = { completed: totalVolume * 0.50, inFunnel: totalVolume * 0.25, dropped: totalVolume * 0.25 };
  const outcomeOrder = ["completed", "inFunnel", "dropped"] as const;
  const outcomeColors = { completed: "#22C55E", inFunnel: "#F59E0B", dropped: "#EF4444" };
  const outcomeLabels = { completed: "Completed", inFunnel: "In Funnel", dropped: "Dropped" };

  let outcomeY = startY;
  const outcomeNodes = outcomeOrder.map((outcome) => {
    const total = outcomeTotals[outcome];
    const height = total * scale;
    const node = { id: outcome, label: outcomeLabels[outcome], color: outcomeColors[outcome], total, pct: Math.round((total / totalVolume) * 100), x: colX[2], y: outcomeY, height, width: colW };
    outcomeY += height + nodeGap;
    return node;
  });

  // Channel → Tier flows
  const tierOffsets: Record<string, number> = { commitment: 0, evaluation: 0, exploration: 0 };
  const channelToTierFlows: React.ReactElement[] = [];

  channelNodes.forEach((ch, chIdx) => {
    let srcY = 0;
    tierOrder.forEach((tier) => {
      const tierNode = tierNodes.find((t) => t.id === tier)!;
      const prop = tier === "commitment" ? ch.commit : tier === "evaluation" ? ch.evaluate : ch.explore;
      const fh = prop * ch.volume * scale;
      if (fh > 1) {
        const x1 = ch.x + ch.width, x2 = tierNode.x;
        const path = createRibbonPath(x1, ch.y + srcY, ch.y + srcY + fh, x2, tierNode.y + tierOffsets[tier], tierNode.y + tierOffsets[tier] + fh);
        const flowId = `ch${chIdx}-${tier}`;
        const gradId = `grad-${flowId}`;
        const isHov = hoveredFlow === flowId;
        const fd = flowData.find((f) => f.from === ch.channel && f.to.toLowerCase() === tier);
        channelToTierFlows.push(
          <g key={flowId}>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={ch.color} stopOpacity={isHov ? 0.7 : 0.35} />
                <stop offset="100%" stopColor={tierColors[tier]} stopOpacity={isHov ? 0.7 : 0.35} />
              </linearGradient>
            </defs>
            <path
              d={path}
              fill={`url(#${gradId})`}
              stroke="none"
              style={{ cursor: "pointer", transition: "all 150ms ease" }}
              onMouseEnter={(e) => {
                setHoveredFlow(flowId);
                if (fd) setTooltipData({ from: fd.from, to: fd.to, volume: fd.volume, ofChannel: fd.ofChannel, ofTier: fd.ofTier, type: "channel-tier" });
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => { setHoveredFlow(null); setTooltipData(null); }}
            />
          </g>
        );
        srcY += fh;
        tierOffsets[tier] += fh;
      }
    });
  });

  // Tier → Outcome flows
  const outcomeOffsets: Record<string, number> = { completed: 0, inFunnel: 0, dropped: 0 };
  const tierToOutcomeFlows: React.ReactElement[] = [];

  tierNodes.forEach((tier, tierIdx) => {
    let srcY = 0;
    outcomeOrder.forEach((outcome) => {
      const outcomeNode = outcomeNodes.find((o) => o.id === outcome)!;
      const prop = outcome === "completed" ? 0.50 : 0.25;
      const fh = tier.total * prop * scale;
      if (fh > 1) {
        const x1 = tier.x + tier.width, x2 = outcomeNode.x;
        const path = createRibbonPath(x1, tier.y + srcY, tier.y + srcY + fh, x2, outcomeNode.y + outcomeOffsets[outcome], outcomeNode.y + outcomeOffsets[outcome] + fh);
        const flowId = `tier${tierIdx}-${outcome}`;
        const gradId = `grad-${flowId}`;
        const isHov = hoveredFlow === flowId;
        const ofTierPct = Math.round((fh / (tier.height || 1)) * 100);
        const ofOutcomePct = Math.round((fh / (outcomeNode.height || 1)) * 100);
        tierToOutcomeFlows.push(
          <g key={flowId}>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={tier.color} stopOpacity={isHov ? 0.7 : 0.3} />
                <stop offset="100%" stopColor={outcomeColors[outcome]} stopOpacity={isHov ? 0.7 : 0.3} />
              </linearGradient>
            </defs>
            <path
              d={path}
              fill={`url(#${gradId})`}
              stroke="none"
              style={{ cursor: "pointer", transition: "all 150ms ease" }}
              onMouseEnter={(e) => {
                setHoveredFlow(flowId);
                setTooltipData({ from: tier.label, to: outcomeNode.label, volume: Math.round(tier.total * prop), ofChannel: ofTierPct, ofTier: ofOutcomePct, type: "tier-outcome" });
                setTooltipPos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => { setHoveredFlow(null); setTooltipData(null); }}
            />
          </g>
        );
        srcY += fh;
        outcomeOffsets[outcome] += fh;
      }
    });
  });

  return (
    <motion.div
      ref={ref}
      style={{ background: "#F5F3FA", borderRadius: 12, overflow: "hidden", position: "relative" }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Column headers */}
        {[
          { label: "Entry Channel", x: colX[0] + colW / 2, delay: 0.2 },
          { label: "Intent Tier",   x: colX[1] + colW / 2, delay: 0.5 },
          { label: "Outcome",       x: colX[2] + colW / 2, delay: 0.8 },
        ].map(({ label, x, delay }) => (
          <motion.text key={label} x={x} y={24} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9494A8" letterSpacing="0.5"
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.6, delay }}>
            {label}
          </motion.text>
        ))}

        {/* Flow paths */}
        {channelToTierFlows}
        {tierToOutcomeFlows}

        {/* Channel nodes */}
        {channelNodes.map((ch, idx) => (
          <g key={`ch-${idx}`}>
            <rect x={ch.x} y={ch.y} width={ch.width} height={ch.height} rx={4} fill={ch.color} opacity={0.9} />
            {ch.height > 30 ? (
              <>
                <text x={ch.x + ch.width / 2} y={ch.y + ch.height / 2 - 2} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="white">{ch.channel}</text>
                <text x={ch.x + ch.width / 2} y={ch.y + ch.height / 2 + 11} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.75)" style={{ fontFamily: "monospace" }}>{ch.volume.toLocaleString()}</text>
              </>
            ) : ch.height > 18 && (
              <text x={ch.x + ch.width / 2} y={ch.y + ch.height / 2 + 3} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="white">{ch.channel}</text>
            )}
          </g>
        ))}

        {/* Tier nodes */}
        {tierNodes.map((tier, idx) => (
          <g key={`tier-${idx}`}>
            <rect x={tier.x} y={tier.y} width={tier.width} height={tier.height} rx={4} fill={tier.color} opacity={0.9} />
            {tier.height > 35 ? (
              <>
                <text x={tier.x + tier.width / 2} y={tier.y + tier.height / 2 - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">{tier.label}</text>
                <text x={tier.x + tier.width / 2} y={tier.y + tier.height / 2 + 6} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="rgba(255,255,255,0.9)" style={{ fontFamily: "monospace" }}>{Math.round(tier.total).toLocaleString()}</text>
                <text x={tier.x + tier.width / 2} y={tier.y + tier.height / 2 + 19} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.65)" style={{ fontFamily: "monospace" }}>{tier.pct}% of total</text>
              </>
            ) : tier.height > 22 && (
              <>
                <text x={tier.x + tier.width / 2} y={tier.y + tier.height / 2 - 2} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">{tier.label}</text>
                <text x={tier.x + tier.width / 2} y={tier.y + tier.height / 2 + 10} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)" style={{ fontFamily: "monospace" }}>{Math.round(tier.total).toLocaleString()} · {tier.pct}%</text>
              </>
            )}
          </g>
        ))}

        {/* Outcome nodes */}
        {outcomeNodes.map((outcome, idx) => (
          <g key={`outcome-${idx}`}>
            <rect x={outcome.x} y={outcome.y} width={outcome.width} height={outcome.height} rx={4} fill={outcome.color} opacity={0.85} />
            {outcome.height > 35 ? (
              <>
                <text x={outcome.x + outcome.width / 2} y={outcome.y + outcome.height / 2 - 8} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">{outcome.label}</text>
                <text x={outcome.x + outcome.width / 2} y={outcome.y + outcome.height / 2 + 6} textAnchor="middle" fontSize="9.5" fontWeight="600" fill="rgba(255,255,255,0.9)" style={{ fontFamily: "monospace" }}>{Math.round(outcome.total).toLocaleString()}</text>
                <text x={outcome.x + outcome.width / 2} y={outcome.y + outcome.height / 2 + 19} textAnchor="middle" fontSize="8.5" fill="rgba(255,255,255,0.65)" style={{ fontFamily: "monospace" }}>{outcome.pct}% of total</text>
              </>
            ) : outcome.height > 22 && (
              <>
                <text x={outcome.x + outcome.width / 2} y={outcome.y + outcome.height / 2 - 2} textAnchor="middle" fontSize="10" fontWeight="600" fill="white">{outcome.label}</text>
                <text x={outcome.x + outcome.width / 2} y={outcome.y + outcome.height / 2 + 10} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)" style={{ fontFamily: "monospace" }}>{Math.round(outcome.total).toLocaleString()} · {outcome.pct}%</text>
              </>
            )}
          </g>
        ))}
      </svg>

      {tooltipData && <SankeyTooltip data={tooltipData} position={tooltipPos} />}
    </motion.div>
  );
}

// ─── Verdict Pill ────────────────────────────────────────────

function VerdictPill({ verdict }: { verdict: string }) {
  const s = verdictStyle(verdict);
  return (
    <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: s.bg, color: s.text }}>
      {verdict}
    </span>
  );
}

// ─── Your Next Move ──────────────────────────────────────────

function YourNextMoveStrip({ isExpanded, onToggle }: { isExpanded: boolean; onToggle: () => void }) {
  const nextMoveCards = [
    { tag: "SCALE HIGH-INTENT", tagColor: "#6C3FC7", title: "Organic Search",  body: "42% Commitment + 72% ACR. Highest quality path end-to-end. Protect SEO rankings on pricing, ROI calculator, and case study pages." },
    { tag: "FIX FRICTION",      tagColor: "#EF4444", title: "LinkedIn Ads",    body: "44% Commitment but only 26% ACR — users want to convert but can't. Fix form pre-fill (Work Email blank for 64%)." },
    { tag: "FIX OFFSITE FORMS", tagColor: "#F59E0B", title: "HubSpot Forms",   body: "40% Commitment, 35% ACR. Required fields causing drop-off. Cut form length and add step indicators." },
    { tag: "REDIRECT OR CUT",   tagColor: "#EF4444", title: "Facebook · TikTok", body: "70%+ Exploration, sub-25% ACR. No mid-funnel path. Add intent qualifiers to creative or cut spend." },
  ];

  return (
    <div>
      {/* Toggle bar */}
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          cursor: "pointer",
          background: isExpanded ? "#EDE8FF" : "#F6F3FF",
          borderTop: "2px solid #B8A4FC",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "#EDE8FF"; }}
        onMouseLeave={(e) => { if (!isExpanded) (e.currentTarget as HTMLElement).style.background = "#F6F3FF"; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
          <span style={{ fontSize: 12, color: "#9B7DFC", marginLeft: 4 }}>4 actions prioritized by AgentIQ</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10.5, fontWeight: 600, padding: "4px 12px", borderRadius: 999, background: "#7C5CFC", color: "#fff", letterSpacing: "0.3px" }}>4 ACTIONS</span>
          {isExpanded ? <ChevronUp size={18} color="#4A2D8A" /> : <ChevronDown size={18} color="#4A2D8A" />}
        </div>
      </div>

      {/* Expandable body */}
      <div style={{ maxHeight: isExpanded ? 500 : 0, overflow: "hidden", transition: "max-height 400ms cubic-bezier(0.25,0.46,0.45,0.94), padding 300ms ease", padding: isExpanded ? "8px 24px 20px" : "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
          {nextMoveCards.map((card, i) => (
            <div
              key={i}
              style={{ padding: "14px 16px", borderRadius: 10, border: "1px solid #EDEDF4", background: "#F7F7FA", transition: "border-color 150ms, box-shadow 150ms" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#D4C8FD"; el.style.boxShadow = "0 2px 8px rgba(124,92,252,0.08)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#EDEDF4"; el.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px", color: card.tagColor, marginBottom: 4 }}>{card.tag}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", letterSpacing: "-0.1px", marginBottom: 4 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: "#6E6E85", lineHeight: 1.45 }}>{card.body}</div>
            </div>
          ))}
        </div>
        <button
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", background: "linear-gradient(135deg,#7C5CFC 0%,#9B7DFC 100%)", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(124,92,252,0.3)", transition: "transform 150ms, box-shadow 150ms", marginLeft: 6 }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-1px)"; el.style.boxShadow = "0 6px 20px rgba(124,92,252,0.4)"; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "0 4px 14px rgba(124,92,252,0.3)"; }}
        >
          Show Me More From AgentIQ →
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export function IntentFlowByChannelSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [sortKey, setSortKey] = useState<SortKey>("commitmentPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sortIcon = (key: SortKey) => sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕";

  const tableData = channelFlowData
    .map((ch) => ({
      ...ch,
      explore: ch.explore * 100,
      evaluate: ch.evaluate * 100,
      commit: ch.commit * 100,
      verdict: calculateVerdict(ch.commitmentPct, ch.acr, ch.dropped),
    }))
    .sort((a, b) => {
      const av = sortKey === "friction" ? (a.friction || "") : (a[sortKey] as number);
      const bv = sortKey === "friction" ? (b.friction || "") : (b[sortKey] as number);
      return sortDir === "desc" ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1);
    });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginBottom: 32 }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1A1A2E", margin: 0, letterSpacing: "-0.5px" }}>
          See where intent is flowing and where it is leaking
        </h2>
        <p style={{ fontSize: 14, color: "#6E6E85", margin: "8px 0 0" }}>
          Track how each channel&apos;s traffic progresses through intent stages — and where it drops off
        </p>
      </div>

      {/* Card */}
      <div style={{ background: "#fff", border: "1px solid #EDEDF4", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>

        {/* Chart section */}
        <div style={{ padding: "28px 32px 20px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1A1A2E", margin: "0 0 16px" }}>Intent Flow by Channel</h3>

          {/* KPI cards */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            {/* Total Actions */}
            <div style={{ flex: 1, background: "#F7F7FA", border: "1px solid #EDEDF4", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#6C3FC7", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Total Actions</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#1A1A2E", fontFamily: "monospace", letterSpacing: "-0.5px" }}>57.1K</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6C3FC7", fontFamily: "monospace" }}>↑ +9.6%</span>
              </div>
              <div style={{ fontSize: 11, color: "#9494A8" }}>across 7 channels</div>
            </div>
            {/* Commitment Rate */}
            <div style={{ flex: 1, background: "#F7F7FA", border: "1px solid #EDEDF4", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#4A2D8A", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Commitment Rate</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#4A2D8A", fontFamily: "monospace", letterSpacing: "-0.5px" }}>33%</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6C3FC7", fontFamily: "monospace" }}>↑ +4.2 pts</span>
              </div>
              <div style={{ fontSize: 11, color: "#9494A8" }}>19K actions reached high-intent</div>
            </div>
            {/* Completed */}
            <div style={{ flex: 1, background: "#F7F7FA", border: "1px solid #EDEDF4", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#22C55E", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Completed</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#15803D", fontFamily: "monospace", letterSpacing: "-0.5px" }}>50%</span>
              </div>
              <div style={{ fontSize: 11, color: "#9494A8" }}>28.5K actions completed</div>
            </div>
            {/* Dropped */}
            <div style={{ flex: 1, background: "#F7F7FA", border: "1px solid #EDEDF4", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>Dropped</div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#991B1B", fontFamily: "monospace", letterSpacing: "-0.5px" }}>25%</span>
              </div>
              <div style={{ fontSize: 11, color: "#9494A8" }}>14.3K actions lost</div>
            </div>
          </div>

          {/* Sankey */}
          <SankeyDiagram />

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "16px 0 6px", flexWrap: "wrap" }}>
            {[
              { label: "Commitment", color: "#4A2D8A" },
              { label: "Evaluation", color: "#7C5CFC" },
              { label: "Exploration", color: "#B8A4FC" },
              { label: "Completed",  color: "#22C55E" },
              { label: "In Funnel",  color: "#F59E0B" },
              { label: "Dropped",    color: "#EF4444" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                <span style={{ fontSize: 11, color: "#6E6E85" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EDEDF4" }} />

        {/* Table section */}
        <div style={{ padding: "20px 32px 28px" }}>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", margin: "0 0 2px" }}>Channel Intent &amp; Completion Breakdown</h3>
            <p style={{ fontSize: 12, color: "#9494A8", margin: "0 0 14px" }}>Intent tier distribution, outcome rates, and action completion health per channel</p>
          </div>

          {/* Table with border + scroll */}
          <div style={{ border: "1px solid #EDEDF4", borderRadius: 10, overflow: "auto", maxHeight: 300 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
                <tr style={{ borderBottom: "1px solid #EDEDF4" }}>
                  <th style={{ padding: "10px 10px 10px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 500, color: "#9494A8", textTransform: "uppercase", letterSpacing: "0.5px", userSelect: "none" as const }}>Channel</th>
                  <th style={{ padding: "10px", textAlign: "left", fontSize: 10.5, fontWeight: 500, color: "#9494A8", textTransform: "uppercase", letterSpacing: "0.5px", userSelect: "none" as const }}>Intent Distribution</th>
                  {(["volume", "commitmentPct", "acr", "dropped", "friction", "verdict"] as SortKey[]).map((key) => {
                    const labels: Record<SortKey, string> = { volume: "Volume", commitmentPct: "Commitment %", acr: "ACR", dropped: "Dropped", friction: "Friction", verdict: "Verdict" };
                    const isRight = key !== "friction" && key !== "verdict";
                    return (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        style={{ padding: "10px 10px 10px " + (key === "verdict" ? "14px" : "10px"), textAlign: isRight ? "right" : "left", fontSize: 10.5, fontWeight: 500, color: sortKey === key ? "#6C3FC7" : "#9494A8", textTransform: "uppercase", letterSpacing: "0.5px", cursor: "pointer", userSelect: "none" as const }}
                      >
                        {labels[key]}{sortIcon(key)}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => {
                  return (
                    <tr
                      key={row.channel}
                      style={{ borderBottom: idx < tableData.length - 1 ? "1px solid #F7F7FA" : "none", transition: "background 100ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#F6F3FF")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Channel */}
                      <td style={{ padding: "10px 10px 10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A2E" }}>{row.channel}</span>
                        </div>
                      </td>
                      {/* Intent Distribution bar */}
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, height: 18, minWidth: 120 }}>
                          <div style={{ height: "100%", borderRadius: 2, background: "#4A2D8A", width: `${row.commit}%`, minWidth: row.commit > 0 ? 2 : 0 }} />
                          <div style={{ height: "100%", borderRadius: 2, background: "#7C5CFC", width: `${row.evaluate}%`, minWidth: row.evaluate > 0 ? 2 : 0 }} />
                          <div style={{ height: "100%", borderRadius: 2, background: "#B8A4FC", width: `${row.explore}%`, minWidth: row.explore > 0 ? 2 : 0 }} />
                        </div>
                      </td>
                      {/* Volume */}
                      <td style={{ padding: 10, textAlign: "right", fontSize: 12, fontWeight: 500, color: "#3D3D56", fontFamily: "monospace" }}>{row.volume.toLocaleString()}</td>
                      {/* Commitment % */}
                      <td style={{ padding: 10, textAlign: "right", fontSize: 12, fontFamily: "monospace", color: row.commitmentPct >= 30 ? "#6C3FC7" : "#3D3D56", fontWeight: row.commitmentPct >= 30 ? 700 : 500 }}>{row.commitmentPct}%</td>
                      {/* ACR */}
                      <td style={{ padding: 10, textAlign: "right", fontSize: 12, fontFamily: "monospace", color: row.acr >= 60 ? "#22C55E" : row.acr < 40 ? "#EF4444" : "#3D3D56", fontWeight: row.acr >= 60 ? 700 : 500 }}>{row.acr}%</td>
                      {/* Dropped */}
                      <td style={{ padding: 10, textAlign: "right", fontSize: 12, fontFamily: "monospace", fontWeight: 500, color: row.dropped >= 35 ? "#EF4444" : "#3D3D56" }}>{row.dropped}%</td>
                      {/* Friction */}
                      <td style={{ padding: 10 }}>
                        {row.friction ? (
                          <span style={{ display: "inline-block", fontSize: 10.5, padding: "2px 8px", borderRadius: 4, background: "#FEE2E2", color: "#991B1B", whiteSpace: "nowrap" }}>
                            ⚠ {row.friction}
                          </span>
                        ) : (
                          <span style={{ fontSize: 10.5, color: "#15803D" }}>—</span>
                        )}
                      </td>
                      {/* Verdict */}
                      <td style={{ padding: "10px 14px 10px 10px" }}>
                        <VerdictPill verdict={row.verdict} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Insight footer */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #EDEDF4", fontSize: 12, color: "#6E6E85", lineHeight: 1.5 }}>
            <strong style={{ fontWeight: 600, color: "#3D3D56" }}>LinkedIn Ads</strong> has the highest Commitment rate (44%) but the lowest ACR (26%) — high-intent users are hitting form friction.{" "}
            <strong style={{ fontWeight: 600, color: "#3D3D56" }}>HubSpot Forms</strong> shows 40% Commitment but only 35% completion — offsite form UX is the bottleneck.{" "}
            <strong style={{ fontWeight: 600, color: "#3D3D56" }}>Organic Search</strong> leads both Commitment (42%) and ACR (72%) — protect these pages at all costs.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#EDEDF4" }} />

        {/* Your Next Move */}
        <YourNextMoveStrip isExpanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />
      </div>
    </motion.div>
  );
}
