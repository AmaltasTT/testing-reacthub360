"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import {
  P,
  CONTENT_INTEL_TOP,
  CONTENT_INTEL_LOW,
  FORMAT_TOP,
  FORMAT_LOW,
} from "@/lib/engage-stats/data";

type ContentToggle = "content" | "format";

// ─── Platform channel dot indicator ────────────────────────────
const CHANNEL_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  youtube:   "#FF0000",
  linkedin:  "#0A66C2",
  tiktok:    "#010101",
  facebook:  "#1877F2",
};

function ChannelDots({ channels }: { channels: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, opacity: 0.65 }}>
      {channels.map((ch, i) => (
        <div
          key={i}
          title={ch.charAt(0).toUpperCase() + ch.slice(1)}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: CHANNEL_COLORS[ch] ?? "#9CA3AF",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared row for content items ────────────────────────────
function ContentRow({
  item,
  isLow,
  hovered,
  onEnter,
  onLeave,
}: {
  item: (typeof CONTENT_INTEL_TOP)[number];
  isLow: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const eisColor      = isLow ? "#EF4444" : "#7C3AED";
  const borderBase    = isLow ? "#F6EAEA" : "#EDEAF6";
  const borderHover   = isLow ? "#FCA5A5" : "#7C3AED";
  const stripBg       = isLow ? "rgba(239,68,68,0.04)" : "rgba(139,92,246,0.05)";
  const liftColor     = isLow ? "#EF4444" : "#059669";

  const isPause = item.action === "PAUSE";
  const actionBorder = isPause
    ? "rgba(220,38,38,0.4)"
    : isLow
    ? "rgba(245,158,11,0.4)"
    : "rgba(124,58,237,0.3)";
  const actionText = isPause ? "#DC2626" : isLow ? "#B45309" : "#7C3AED";

  const hoverText =
    item.action === "PAUSE"
      ? "Stop budget allocation immediately and audit creative messaging for audience mismatch"
      : item.action === "REPURPOSE"
      ? "Adapt this content structure for LinkedIn, YouTube, and email sequences"
      : "Increase budget allocation by 30% and test similar messaging frameworks";

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "#fff",
        borderRadius: 10,
        border: `1px solid ${hovered ? borderHover : borderBase}`,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        transition: "border-color 0.2s",
        // Prevent flex-shrink from collapsing rows in a scrollable flex container
        flexShrink: 0,
      }}
    >
      {/* Main row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: 16,
        }}
      >
        {/* Title + meta — flex-1 with min-width 0 for truncation */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: P.text1,
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 5,
              fontSize: 11,
              color: P.text3,
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>{item.platform}</span>
            <span>·</span>
            <span style={{ whiteSpace: "nowrap" }}>{item.format}</span>
            <span>·</span>
            <span style={{ color: isLow ? P.accent : "#059669", whiteSpace: "nowrap" }}>{item.type}</span>
            <span>·</span>
            <ChannelDots channels={item.channels} />
          </div>
        </div>

        {/* EIS — w-24 = 96px */}
        <div style={{ width: 96, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: eisColor,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {item.eis.toFixed(1)}
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: liftColor }}>
              {item.lift}
            </span>
          </div>
          <div style={{ width: 60, height: 2, background: P.barGrey, borderRadius: 2, marginBottom: 2 }}>
            <div
              style={{
                width: `${(item.eis / 10) * 100}%`,
                height: "100%",
                background: eisColor,
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: P.text3 }}>EIS</div>
        </div>

        {/* ESR — w-16 = 64px */}
        <div style={{ width: 64, flexShrink: 0, textAlign: "center", opacity: 0.75 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: isLow ? "#EF4444" : P.text2, fontVariantNumeric: "tabular-nums" }}>
            {item.esr}
          </div>
          <div style={{ fontSize: 10, color: P.text3 }}>ESR</div>
        </div>

        {/* EQS — w-16 = 64px */}
        <div style={{ width: 64, flexShrink: 0, textAlign: "center", opacity: 0.75 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: isLow ? "#EF4444" : P.text2, fontVariantNumeric: "tabular-nums" }}>
            {item.eqs.toFixed(1)}
          </div>
          <div style={{ fontSize: 10, color: P.text3 }}>EQS</div>
        </div>

        {/* Action badge — w-32 = 128px */}
        <div style={{ width: 128, flexShrink: 0 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 500,
              border: `1px solid ${actionBorder}`,
              color: actionText,
              letterSpacing: 0.2,
            }}
          >
            {item.action}
          </span>
        </div>
      </div>

      {/* Hover action strip */}
      <motion.div
        initial={{ height: 0, opacity: 0, y: 6 }}
        animate={
          hovered
            ? { height: 44, opacity: 1, y: 0 }
            : { height: 0, opacity: 0, y: 6 }
        }
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          borderTop: "1px solid #F3F4F6",
          background: stripBg,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            fontSize: 13,
            color: P.text2,
          }}
        >
          {hoverText}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Format row ───────────────────────────────────────────────
function FormatRow({
  item,
  isLow,
}: {
  item: (typeof FORMAT_TOP)[number];
  isLow: boolean;
}) {
  const eisColor    = isLow ? "#EF4444" : "#7C3AED";
  const borderColor = isLow ? "#F6EAEA" : "#EDEAF6";
  const liftColor   = isLow ? "#EF4444" : "#059669";

  const isPause = item.action === "PAUSE";
  const actionBorder = isPause
    ? "rgba(220,38,38,0.4)"
    : isLow
    ? "rgba(245,158,11,0.4)"
    : "rgba(124,58,237,0.3)";
  const actionText = isPause ? "#DC2626" : isLow ? "#B45309" : "#7C3AED";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: 16,
        background: "#fff",
        borderRadius: 10,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Icon + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 24, width: 36, flexShrink: 0, lineHeight: 1 }}>{item.icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: P.text1, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.name}
          </div>
          <div style={{ fontSize: 11, color: P.text3 }}>{item.subtitle}</div>
        </div>
      </div>

      {/* EIS */}
      <div style={{ width: 96, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: eisColor, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {item.eis.toFixed(1)}
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: liftColor }}>
            {item.lift}
          </span>
        </div>
        <div style={{ width: 60, height: 2, background: P.barGrey, borderRadius: 2, marginBottom: 2 }}>
          <div style={{ width: `${(item.eis / 10) * 100}%`, height: "100%", background: eisColor, borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: 10, color: P.text3 }}>EIS</div>
      </div>

      {/* ESR */}
      <div style={{ width: 64, flexShrink: 0, textAlign: "center", opacity: 0.75 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: isLow ? "#EF4444" : P.text2, fontVariantNumeric: "tabular-nums" }}>{item.esr}</div>
        <div style={{ fontSize: 10, color: P.text3 }}>ESR</div>
      </div>

      {/* EQS */}
      <div style={{ width: 64, flexShrink: 0, textAlign: "center", opacity: 0.75 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: isLow ? "#EF4444" : P.text2, fontVariantNumeric: "tabular-nums" }}>{item.eqs.toFixed(1)}</div>
        <div style={{ fontSize: 10, color: P.text3 }}>EQS</div>
      </div>

      {/* Channel dots */}
      <div style={{ width: 80, flexShrink: 0, display: "flex", justifyContent: "center", opacity: 0.5 }}>
        <ChannelDots channels={item.channels} />
      </div>

      {/* Action */}
      <div style={{ width: 140, flexShrink: 0 }}>
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 500,
            border: `1px solid ${actionBorder}`,
            color: actionText,
            letterSpacing: 0.2,
            textTransform: "uppercase",
          }}
        >
          {item.action}
        </span>
      </div>
    </div>
  );
}

// ─── Scrollable list wrapper that prevents flex-shrink collapse ──
function ScrollList({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxHeight: 480, overflowY: "auto", paddingRight: 4 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Section header labels ────────────────────────────────────
function ListHeader({ label, count, isLow }: { label: string; count: number; isLow: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          color: isLow ? "#DC2626" : "#7652B3",
          marginBottom: 6,
        }}
      >
        {isLow ? `◆ NEEDS ATTENTION · SEE AT RISK · ${count} PIECES` : `+ TOP PERFORMING CONTENT · ${count} PIECES`}
      </div>
      <p style={{ fontSize: 12, fontStyle: "italic", color: P.text3, opacity: 0.7, margin: 0 }}>
        {isLow
          ? "These formats fail to convert exposure into sustained engagement."
          : "These assets compound high-depth engagement across channels."}
      </p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────
export function ContentIntelligenceSection() {
  const [toggle, setToggle] = useState<ContentToggle>("content");
  const [hoveredTop, setHoveredTop] = useState<number | null>(null);
  const [hoveredLow, setHoveredLow] = useState<number | null>(null);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(4px)",
        borderRadius: 16,
        border: "1px solid rgba(229,231,235,0.6)",
        padding: 40,
        marginBottom: 48,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          marginBottom: 28,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: P.text1, margin: "0 0 4px" }}>
            Content Intelligence
          </h2>
          <p style={{ fontSize: 13, color: P.text3, margin: "0 0 6px" }}>
            Top and lowest content performers across channels
          </p>
          <p style={{ fontSize: 11, color: P.text3, opacity: 0.6, margin: 0 }}>
            Scores are cross-channel normalized using weighted engagement signals. Change vs prior period.
          </p>
        </div>

        {/* Content / Format toggle */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {(["content", "format"] as ContentToggle[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setToggle(mode)}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: toggle === mode ? "#5B4FE9" : "#F3F4F6",
                color: toggle === mode ? "#fff" : P.text2,
              }}
            >
              {mode === "content" ? "Content" : "Format"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content view ──────────────────────────────────────── */}
      {toggle === "content" && (
        <>
          {/* Top Performing */}
          <div style={{ marginBottom: 32 }}>
            <ListHeader label="top" count={CONTENT_INTEL_TOP.length} isLow={false} />
            <ScrollList>
              {CONTENT_INTEL_TOP.map((item, idx) => (
                <ContentRow
                  key={idx}
                  item={item}
                  isLow={false}
                  hovered={hoveredTop === idx}
                  onEnter={() => setHoveredTop(idx)}
                  onLeave={() => setHoveredTop(null)}
                />
              ))}
            </ScrollList>
          </div>

          {/* Needs Attention */}
          <div>
            <ListHeader label="low" count={CONTENT_INTEL_LOW.length} isLow={true} />
            <ScrollList>
              {CONTENT_INTEL_LOW.map((item, idx) => (
                <ContentRow
                  key={idx}
                  item={item}
                  isLow={true}
                  hovered={hoveredLow === idx}
                  onEnter={() => setHoveredLow(idx)}
                  onLeave={() => setHoveredLow(null)}
                />
              ))}
            </ScrollList>
          </div>
        </>
      )}

      {/* ── Format view ───────────────────────────────────────── */}
      {toggle === "format" && (
        <>
          {/* Top formats */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#7652B3", marginBottom: 6 }}>
                + TOP PERFORMING FORMATS · {FORMAT_TOP.length}
              </div>
              <p style={{ fontSize: 12, fontStyle: "italic", color: P.text3, opacity: 0.7, margin: 0 }}>
                These assets compound high-depth engagement across channels.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FORMAT_TOP.map((item, idx) => (
                <FormatRow key={idx} item={item} isLow={false} />
              ))}
            </div>
          </div>

          {/* Low formats */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#DC2626", marginBottom: 6 }}>
                ◆ LOW PERFORMING FORMATS · {FORMAT_LOW.length}
              </div>
              <p style={{ fontSize: 12, fontStyle: "italic", color: P.text3, opacity: 0.7, margin: 0 }}>
                These formats fail to convert exposure into sustained engagement.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FORMAT_LOW.map((item, idx) => (
                <FormatRow key={idx} item={item} isLow={true} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer CTA */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 24,
          borderTop: `1px solid ${P.divider}`,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "#5B4FE9",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <Sparkles style={{ width: 15, height: 15 }} />
          Optimize with AgentIQ
        </button>
      </div>
    </div>
  );
}
