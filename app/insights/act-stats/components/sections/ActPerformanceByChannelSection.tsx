"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Search, Mail, Linkedin, Twitter, Youtube, Instagram } from "lucide-react";
import { P, ACT_CHANNELS, getSignalStyle, getMoveStyle } from "@/lib/act-stats/data";

type SortKey = "actionValue" | "acpa" | "ais" | "actionSignal" | "recommendedMove";
type SortDir = "asc" | "desc";

const ChannelIcon = ({ icon, size = 10 }: { icon: string; size?: number }) => {
  const s = { width: size, height: size, color: "#fff" };
  if (icon === "search") return <Search style={s} />;
  if (icon === "mail") return <Mail style={s} />;
  if (icon === "linkedin") return <Linkedin style={s} />;
  if (icon === "twitter") return <Twitter style={s} />;
  if (icon === "youtube") return <Youtube style={s} />;
  if (icon === "instagram") return <Instagram style={s} />;
  return (
    <span style={{ fontSize: size - 2, color: "#fff", fontWeight: 700, lineHeight: 1 }}>
      {icon.slice(0, 2).toUpperCase()}
    </span>
  );
};

export function ActPerformanceByChannelSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const chartRef = useRef<HTMLDivElement>(null);

  const [sortKey, setSortKey] = useState<SortKey>("ais");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    ch: (typeof ACT_CHANNELS)[0];
    x: number;
    y: number;
  } | null>(null);
  const [ctaShadow, setCtaShadow] = useState("0 4px 12px rgba(124, 92, 252, 0.25)");

  // Sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };
  const sortIcon = (key: SortKey) =>
    sortKey === key ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕";

  const sorted = [...ACT_CHANNELS].sort((a, b) => {
    const aVal = a[sortKey as keyof typeof a];
    const bVal = b[sortKey as keyof typeof b];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    }
    const aStr = String(aVal);
    const bStr = String(bVal);
    return sortDir === "desc" ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
  });

  // Chart dimensions
  const chartWidth = 960;
  const chartHeight = 480;
  const padding = { top: 44, right: 30, bottom: 50, left: 55 };
  const xMin = 0, xMax = 58;
  const yMin = 2.0, yMax = 8.5;

  const xScale = (v: number) =>
    padding.left + ((v - xMin) / (xMax - xMin)) * (chartWidth - padding.left - padding.right);
  const yScale = (v: number) =>
    chartHeight - padding.bottom - ((v - yMin) / (yMax - yMin)) * (chartHeight - padding.top - padding.bottom);

  const xMid = xScale(29);
  const yMid = yScale(5.0);

  const minVol = Math.min(...ACT_CHANNELS.map((c) => c.volume));
  const maxVol = Math.max(...ACT_CHANNELS.map((c) => c.volume));
  const bubbleR = (vol: number) =>
    14 + Math.sqrt((vol - minVol) / (maxVol - minVol)) * 26;

  // Sort channels by AIS descending for animation stagger
  const channelsByAIS = [...ACT_CHANNELS].sort((a, b) => b.ais - a.ais);

  // Tooltip handling (position relative to chartRef div)
  const handleBubbleHover = (
    e: React.MouseEvent,
    ch: (typeof ACT_CHANNELS)[0]
  ) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    setTooltipData({
      ch,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginBottom: 32 }}
    >
      {/* Section Header */}
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1A1A2E",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          Act Performance by Channel
        </h2>
        <p style={{ fontSize: 14, color: "#6E6E85", margin: "4px 0 0" }}>
          How your spend translates into meaningful actions across channels.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* ── LEFT CARD ── */}
        <div
          style={{
            flex: 1,
            background: "#fff",
            border: "1px solid #EDEDF4",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
            borderRadius: "16px 0 0 16px",
            overflow: "hidden",
          }}
        >
          {/* Chart Section */}
          <div style={{ padding: "28px 32px 20px" }}>
            {/* Chart section header */}
            <h3
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#1A1A2E",
                margin: "0 0 16px",
              }}
            >
              Which channels deliver quality actions efficiently?
            </h3>

            {/* KPI Strip (4 cards) */}
            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 24,
              }}
            >
              {/* Card 1: Channels Tracked */}
              <div
                style={{
                  flex: 1,
                  background: "#F7F7FA",
                  border: "1px solid #EDEDF4",
                  borderRadius: 10,
                  padding: "18px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#9494A8",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 5,
                  }}
                >
                  CHANNELS TRACKED
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    fontFamily: "monospace",
                    letterSpacing: "-0.5px",
                    marginBottom: 3,
                  }}
                >
                  12
                </div>
                <div style={{ fontSize: 10.5, color: "#9494A8" }}>
                  across paid, organic &amp; offsite
                </div>
              </div>

              {/* Card 2: Avg AIS */}
              <div
                style={{
                  flex: 1,
                  background: "#F7F7FA",
                  border: "1px solid #EDEDF4",
                  borderRadius: 10,
                  padding: "18px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6C3FC7",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 5,
                  }}
                >
                  AVG AIS
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#6C3FC7",
                      fontFamily: "monospace",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    4.8
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#6C3FC7",
                      fontFamily: "monospace",
                    }}
                  >
                    ↑ +0.6
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: "#9494A8" }}>
                  action quality across channels
                </div>
              </div>

              {/* Card 3: Avg aCPA */}
              <div
                style={{
                  flex: 1,
                  background: "#F7F7FA",
                  border: "1px solid #EDEDF4",
                  borderRadius: 10,
                  padding: "18px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#9494A8",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    marginBottom: 5,
                  }}
                >
                  AVG ACPA
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: "#1A1A2E",
                      fontFamily: "monospace",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    $34
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#22C55E",
                      fontFamily: "monospace",
                    }}
                  >
                    ↓ −$3
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: "#9494A8" }}>
                  cost per action improving
                </div>
              </div>

              {/* Card 4: Scale vs Fix (split) */}
              <div
                style={{
                  flex: 1,
                  background: "#F6F3FF",
                  border: "1px solid #EDE8FF",
                  borderRadius: 10,
                  padding: "18px 14px",
                }}
              >
                <div style={{ display: "flex" }}>
                  {/* Left: Scale */}
                  <div style={{ flex: 1, paddingRight: 14 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#6C3FC7",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        marginBottom: 5,
                      }}
                    >
                      SCALE
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#4A2D8A",
                        fontFamily: "monospace",
                        letterSpacing: "-0.5px",
                        marginBottom: 3,
                      }}
                    >
                      3
                    </div>
                    <div style={{ fontSize: 10.5, color: "#9B7DFC" }}>
                      ready to grow
                    </div>
                  </div>
                  {/* Divider */}
                  <div
                    style={{ width: 1, background: "#EDE8FF", flexShrink: 0 }}
                  />
                  {/* Right: Fix */}
                  <div style={{ flex: 1, paddingLeft: 14 }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#EF4444",
                        textTransform: "uppercase",
                        letterSpacing: "0.6px",
                        marginBottom: 5,
                      }}
                    >
                      FIX
                    </div>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#991B1B",
                        fontFamily: "monospace",
                        letterSpacing: "-0.5px",
                        marginBottom: 3,
                      }}
                    >
                      5
                    </div>
                    <div style={{ fontSize: 10.5, color: "#9494A8" }}>
                      need attention
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div
              ref={chartRef}
              style={{
                position: "relative",
                background: "#F5F3FA",
                borderRadius: 12,
                overflow: "hidden",
                aspectRatio: "960/480",
              }}
              onMouseLeave={() => setTooltipData(null)}
            >
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                style={{ width: "100%", height: "100%", display: "block" }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Defs: glow filter */}
                <defs>
                  <filter
                    id="apbc-bubble-glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="1" result="offsetblur" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Gridlines */}
                {[0, 10, 20, 30, 40, 50].map((val) => (
                  <line
                    key={`grid-x-${val}`}
                    x1={xScale(val)}
                    x2={xScale(val)}
                    y1={padding.top}
                    y2={chartHeight - padding.bottom}
                    stroke="#E8E5F0"
                    strokeWidth="0.4"
                  />
                ))}
                {[3.0, 4.0, 5.0, 6.0, 7.0, 8.0].map((val) => (
                  <line
                    key={`grid-y-${val}`}
                    x1={padding.left}
                    x2={chartWidth - padding.right}
                    y1={yScale(val)}
                    y2={yScale(val)}
                    stroke="#E8E5F0"
                    strokeWidth="0.4"
                  />
                ))}

                {/* Zone backgrounds */}
                {/* Top-left: Scale Winners */}
                <rect
                  x={padding.left}
                  y={padding.top}
                  width={xMid - padding.left}
                  height={yMid - padding.top}
                  fill="rgba(124,92,252,0.05)"
                />
                {/* Top-right: Efficient but Under-utilized */}
                <rect
                  x={xMid}
                  y={padding.top}
                  width={chartWidth - padding.right - xMid}
                  height={yMid - padding.top}
                  fill="rgba(155,125,252,0.03)"
                />
                {/* Bottom-left: Watch & Grow */}
                <rect
                  x={padding.left}
                  y={yMid}
                  width={xMid - padding.left}
                  height={chartHeight - padding.bottom - yMid}
                  fill="rgba(200,200,216,0.04)"
                />
                {/* Bottom-right: High Cost / Low Yield */}
                <rect
                  x={xMid}
                  y={yMid}
                  width={chartWidth - padding.right - xMid}
                  height={chartHeight - padding.bottom - yMid}
                  fill="rgba(239,68,68,0.025)"
                />

                {/* Midlines */}
                <line
                  x1={padding.left}
                  x2={chartWidth - padding.right}
                  y1={yMid}
                  y2={yMid}
                  stroke="#D8D4E8"
                  strokeWidth="1"
                  strokeDasharray="5 4"
                />
                <line
                  x1={xMid}
                  x2={xMid}
                  y1={padding.top}
                  y2={chartHeight - padding.bottom}
                  stroke="#D8D4E8"
                  strokeWidth="1"
                  strokeDasharray="5 4"
                />

                {/* Zone labels */}
                {/* Top-left */}
                <text
                  x={padding.left + 12}
                  y={padding.top + 10}
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#6C3FC7"
                  letterSpacing="0.6"
                >
                  SCALE WINNERS
                </text>
                <text
                  x={padding.left + 12}
                  y={padding.top + 22}
                  fontSize="9"
                  fill="#9494A8"
                >
                  High AIS, low cost. Increase investment.
                </text>
                {/* Top-right */}
                <text
                  x={chartWidth - padding.right - 12}
                  y={padding.top + 10}
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#9B7DFC"
                  letterSpacing="0.5"
                  textAnchor="end"
                >
                  EFFICIENT BUT UNDER-UTILIZED
                </text>
                <text
                  x={chartWidth - padding.right - 12}
                  y={padding.top + 22}
                  fontSize="9"
                  fill="#9494A8"
                  textAnchor="end"
                >
                  Untapped growth potential.
                </text>
                {/* Bottom-left */}
                <text
                  x={padding.left + 12}
                  y={chartHeight - padding.bottom - 16}
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#9494A8"
                  letterSpacing="0.5"
                >
                  WATCH &amp; GROW
                </text>
                {/* Bottom-right */}
                <text
                  x={chartWidth - padding.right - 12}
                  y={chartHeight - padding.bottom - 28}
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#EF4444"
                  fillOpacity="0.55"
                  letterSpacing="0.5"
                  textAnchor="end"
                >
                  HIGH COST / LOW YIELD
                </text>
                <text
                  x={chartWidth - padding.right - 12}
                  y={chartHeight - padding.bottom - 16}
                  fontSize="9"
                  fill="#9494A8"
                  textAnchor="end"
                >
                  Investigate targeting or creative.
                </text>

                {/* X-Axis ticks */}
                {[0, 10, 20, 30, 40, 50].map((val) => (
                  <text
                    key={`x-tick-${val}`}
                    x={xScale(val)}
                    y={chartHeight - padding.bottom + 18}
                    fontSize="10"
                    fill="#9494A8"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    ${val}
                  </text>
                ))}
                {/* X-Axis center label */}
                <text
                  x={(padding.left + chartWidth - padding.right) / 2}
                  y={chartHeight - 18}
                  fontSize="11"
                  fill="#6E6E85"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  aCPA (Cost per Action) →
                </text>

                {/* Y-Axis ticks */}
                {[3.0, 4.0, 5.0, 6.0, 7.0, 8.0].map((val) => (
                  <text
                    key={`y-tick-${val}`}
                    x={padding.left - 10}
                    y={yScale(val) + 4}
                    fontSize="10"
                    fill="#9494A8"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {val.toFixed(1)}
                  </text>
                ))}
                {/* Y-Axis center label */}
                <text
                  x={22}
                  y={(padding.top + chartHeight - padding.bottom) / 2}
                  fontSize="11"
                  fill="#6E6E85"
                  textAnchor="middle"
                  fontWeight="500"
                  transform={`rotate(-90 22 ${(padding.top + chartHeight - padding.bottom) / 2})`}
                >
                  AIS (Action Impact) →
                </text>

                {/* Bubbles (sorted by AIS desc for stagger) */}
                {channelsByAIS.map((ch, idx) => {
                  const cx = xScale(ch.acpa);
                  const cy = yScale(ch.ais);
                  const r = bubbleR(ch.volume);
                  const opacity =
                    selectedChannel && selectedChannel !== ch.id ? 0.2 : 1;

                  return (
                    <g
                      key={ch.id}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedChannel((prev) =>
                          prev === ch.id ? null : ch.id
                        )
                      }
                      onMouseEnter={(e) => handleBubbleHover(e, ch)}
                      onMouseLeave={() => setTooltipData(null)}
                    >
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill={ch.color}
                        fillOpacity={opacity * 0.85}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: isInView ? 1 : 0,
                          opacity: isInView ? opacity : 0,
                        }}
                        transition={{
                          duration: 0.65,
                          delay: isInView ? idx * 0.07 : 0,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                        style={{
                          filter: "url(#apbc-bubble-glow)",
                          transformOrigin: `${cx}px ${cy}px`,
                        }}
                      />
                      {/* Channel icon inside bubble */}
                      <g transform={`translate(${cx}, ${cy})`}>
                        <foreignObject
                          x={-r / 2}
                          y={-r / 2}
                          width={r}
                          height={r}
                          style={{ pointerEvents: "none" }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ChannelIcon
                              icon={ch.icon}
                              size={Math.max(10, r / 2.5)}
                            />
                          </div>
                        </foreignObject>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {tooltipData && chartRef.current && (() => {
                const tooltipWidth = 190;
                const tooltipHeight = 140;
                const chartRect = chartRef.current!.getBoundingClientRect();
                let left = tooltipData.x + 14;
                let top = tooltipData.y - 10;
                let transformY = "-100%";
                let transformX = "0";
                if (left + tooltipWidth > chartRect.width) {
                  left = tooltipData.x - tooltipWidth - 14;
                  transformX = "0";
                }
                if (top - tooltipHeight < 0) {
                  top = tooltipData.y + 14;
                  transformY = "0";
                }
                if (top + tooltipHeight > chartRect.height && transformY === "0") {
                  top = tooltipData.y - 10;
                  transformY = "-100%";
                }
                return (
                  <div
                    style={{
                      position: "absolute",
                      left,
                      top,
                      transform: `translate(${transformX}, ${transformY})`,
                      pointerEvents: "none",
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        background: "#F5F3FA",
                        border: "1px solid #E8E5F0",
                        boxShadow:
                          "0 10px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        minWidth: 190,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1A1A2E",
                          marginBottom: 8,
                        }}
                      >
                        {tooltipData.ch.name}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {[
                          { label: "AIS", value: tooltipData.ch.ais.toFixed(1) },
                          { label: "aCPA", value: `$${tooltipData.ch.acpa}` },
                          {
                            label: "Action Value",
                            value: `$${tooltipData.ch.actionValue.toLocaleString()}`,
                          },
                        ].map((row) => (
                          <div
                            key={row.label}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 16,
                              fontSize: 11,
                            }}
                          >
                            <span style={{ color: "#6E6E85" }}>{row.label}</span>
                            <span
                              style={{
                                color: "#1A1A2E",
                                fontWeight: 500,
                                fontFamily: "monospace",
                              }}
                            >
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          height: 1,
                          background: "#D8D4E8",
                          margin: "8px 0",
                        }}
                      />
                      <div
                        style={{
                          display: "inline-block",
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: getMoveStyle(tooltipData.ch.recommendedMove).bg,
                          color: getMoveStyle(tooltipData.ch.recommendedMove).text,
                          textAlign: "center",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        {tooltipData.ch.recommendedMove}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid #F0F0F4",
              }}
            >
              {ACT_CHANNELS.map((ch) => (
                <div
                  key={ch.id}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: ch.color,
                    }}
                  />
                  <span style={{ fontSize: 11, color: "#6E6E85" }}>{ch.name}</span>
                </div>
              ))}
              {/* Volume indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingLeft: 16,
                  borderLeft: "1px solid #DDDDE8",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      border: "1px solid #B8B8C8",
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "1px solid #B8B8C8",
                      marginLeft: -4,
                    }}
                  />
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: "50%",
                      border: "1px solid #B8B8C8",
                      marginLeft: -6,
                    }}
                  />
                </div>
                <span style={{ fontSize: 10.5, color: "#9494A8" }}>Volume</span>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div style={{ padding: "20px 32px 28px" }}>
            {/* Table header block */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1A1A2E",
                    margin: 0,
                  }}
                >
                  Channel Performance Detail
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9494A8",
                    margin: "2px 0 0",
                  }}
                >
                  Click a column header to sort · Click a row to highlight on
                  chart
                </p>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#9494A8",
                  background: "#F7F7FA",
                  padding: "2px 10px",
                  borderRadius: 999,
                }}
              >
                {ACT_CHANNELS.length} channels
              </div>
            </div>

            {/* Scrollable table container */}
            <div
              className="channel-table-scroll"
              style={{
                border: "1px solid #EDEDF4",
                borderRadius: 10,
                overflow: "auto",
                maxHeight: 380,
              }}
            >
              <style>{`
                .channel-table-scroll::-webkit-scrollbar { width: 5px; }
                .channel-table-scroll::-webkit-scrollbar-track { background: transparent; }
                .channel-table-scroll::-webkit-scrollbar-thumb { background: #D4C8FD; border-radius: 3px; }
                .channel-table-scroll::-webkit-scrollbar-thumb:hover { background: #B8A4FC; }
              `}</style>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#fff",
                    borderBottom: "1px solid #EDEDF4",
                  }}
                >
                  <tr>
                    {/* Channel (not sortable label) */}
                    <th
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color: "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Channel
                    </th>
                    {/* Sortable: Action Value */}
                    <th
                      onClick={() => handleSort("actionValue")}
                      style={{
                        padding: "10px 10px",
                        textAlign: "right",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color:
                          sortKey === "actionValue" ? "#6C3FC7" : "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      Action Value{sortIcon("actionValue")}
                    </th>
                    {/* Sortable: aCPA */}
                    <th
                      onClick={() => handleSort("acpa")}
                      style={{
                        padding: "10px 10px",
                        textAlign: "right",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color: sortKey === "acpa" ? "#6C3FC7" : "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      aCPA{sortIcon("acpa")}
                    </th>
                    {/* Sortable: AIS */}
                    <th
                      onClick={() => handleSort("ais")}
                      style={{
                        padding: "10px 10px",
                        textAlign: "left",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color: sortKey === "ais" ? "#6C3FC7" : "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      AIS{sortIcon("ais")}
                    </th>
                    {/* Sortable: Action Signal */}
                    <th
                      onClick={() => handleSort("actionSignal")}
                      style={{
                        padding: "10px 10px",
                        textAlign: "left",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color:
                          sortKey === "actionSignal" ? "#6C3FC7" : "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      Action Signal{sortIcon("actionSignal")}
                    </th>
                    {/* Sortable: Recommended Move */}
                    <th
                      onClick={() => handleSort("recommendedMove")}
                      style={{
                        padding: "10px 14px",
                        textAlign: "left",
                        fontSize: 10.5,
                        fontWeight: 500,
                        color:
                          sortKey === "recommendedMove" ? "#6C3FC7" : "#9494A8",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      Recommended Move{sortIcon("recommendedMove")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((ch) => {
                    const isActive = selectedChannel === ch.id;
                    const ss = getSignalStyle(ch.actionSignal);
                    const ms = getMoveStyle(ch.recommendedMove);
                    const aisBarWidth =
                      ((ch.ais - 2.0) / (8.5 - 2.0)) * 100;
                    const aisBarColor =
                      ch.ais >= 5.5
                        ? "#7C5CFC"
                        : ch.ais >= 4.5
                        ? "#B8A4FC"
                        : "#B8B8C8";

                    return (
                      <tr
                        key={ch.id}
                        onClick={() =>
                          setSelectedChannel((prev) =>
                            prev === ch.id ? null : ch.id
                          )
                        }
                        style={{
                          borderBottom: "1px solid #F7F7FA",
                          cursor: "pointer",
                          backgroundColor: isActive ? "#F6F3FF" : "transparent",
                          borderLeft: isActive
                            ? "3px solid #7C5CFC"
                            : "3px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            e.currentTarget.style.backgroundColor = "#F6F3FF";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                        }}
                      >
                        {/* Channel */}
                        <td style={{ padding: "10px 14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                background: ch.color,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <ChannelIcon icon={ch.icon} size={12} />
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "#1A1A2E",
                              }}
                            >
                              {ch.name}
                            </span>
                          </div>
                        </td>

                        {/* Action Value */}
                        <td
                          style={{
                            padding: "10px 10px",
                            textAlign: "right",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#3D3D56",
                              fontFamily: "monospace",
                            }}
                          >
                            ${ch.actionValue.toLocaleString()}
                          </span>
                        </td>

                        {/* aCPA */}
                        <td
                          style={{
                            padding: "10px 10px",
                            textAlign: "right",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#3D3D56",
                              fontFamily: "monospace",
                            }}
                          >
                            ${ch.acpa}
                          </span>
                        </td>

                        {/* AIS — visual bar */}
                        <td style={{ padding: "10px 10px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              minWidth: 110,
                            }}
                          >
                            <div
                              style={{
                                flex: 1,
                                height: 5,
                                borderRadius: 2,
                                background: "#EDEDF4",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${aisBarWidth}%`,
                                  height: "100%",
                                  borderRadius: 2,
                                  background: aisBarColor,
                                  transition: "width 0.3s",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: "#3D3D56",
                                fontFamily: "monospace",
                                minWidth: 22,
                              }}
                            >
                              {ch.ais}
                            </span>
                          </div>
                        </td>

                        {/* Action Signal */}
                        <td style={{ padding: "10px 10px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: 11,
                              fontWeight: 500,
                              padding: "2px 8px",
                              borderRadius: 999,
                              background: ss.bg,
                              color: ss.text,
                            }}
                          >
                            {ch.actionSignal}
                          </span>
                        </td>

                        {/* Recommended Move */}
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              fontSize: 11,
                              fontWeight: 600,
                              padding: "2px 10px",
                              borderRadius: 4,
                              background: ms.bg,
                              color: ms.text,
                              letterSpacing: "0.2px",
                            }}
                          >
                            {ch.recommendedMove}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Insight footer */}
            <div
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid #EDEDF4",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "#6E6E85",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Top 3 channels by AIS contribute{" "}
                <strong style={{ fontWeight: 600, color: "#3D3D56" }}>
                  68%
                </strong>{" "}
                of total action value —{" "}
                <strong style={{ fontWeight: 600, color: "#3D3D56" }}>
                  Organic Search
                </strong>{" "}
                alone drives 28%. Focus reallocation on{" "}
                <strong style={{ fontWeight: 600, color: "#3D3D56" }}>
                  Scale Winners
                </strong>{" "}
                and investigate high-cost channels.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: Your Next Move ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#fff",
            border: "1px solid #EDEDF4",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
            borderRadius: "0 16px 16px 0",
            width: 270,
            flexShrink: 0,
            padding: "28px 24px",
          }}
        >
          {/* Panel header */}
          <h4
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
              letterSpacing: "-0.2px",
              margin: "0 0 24px",
            }}
          >
            Your Next Move
          </h4>

          <div style={{ flex: 1 }}>
            {/* Item 1: Allocate More */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#6C3FC7",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  marginBottom: 6,
                }}
              >
                ALLOCATE MORE
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1A1A2E",
                  letterSpacing: "-0.1px",
                  marginBottom: 4,
                }}
              >
                Organic Search · Email
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#6E6E85",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Highest AIS with lowest aCPA. Scale Winners quadrant — increase
                budget allocation.
              </p>
            </div>

            <div style={{ height: 1, background: "#EDEDF4", margin: "20px 0" }} />

            {/* Item 2: Correct Distortion */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#E67E22",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  marginBottom: 6,
                }}
              >
                CORRECT DISTORTION
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1A1A2E",
                  letterSpacing: "-0.1px",
                  marginBottom: 4,
                }}
              >
                Facebook Ads
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#6E6E85",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Traffic volume high but weak intent formation. Refine audience
                targeting or creative.
              </p>
            </div>

            <div style={{ height: 1, background: "#EDEDF4", margin: "20px 0" }} />

            {/* Item 3: Validate Traffic */}
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: "#9B7DFC",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  marginBottom: 6,
                }}
              >
                VALIDATE TRAFFIC
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1A1A2E",
                  letterSpacing: "-0.1px",
                  marginBottom: 4,
                }}
              >
                GDN Display · YouTube
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#6E6E85",
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                Low AIS relative to cost. Confirm downstream quality before
                renewing spend.
              </p>
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: "100%",
                marginTop: 24,
                padding: "14px 24px",
                background: "#7C5CFC",
                borderRadius: 40,
                border: "none",
                color: "#fff",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: ctaShadow,
                whiteSpace: "nowrap",
                textAlign: "center",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={() =>
                setCtaShadow("0 6px 16px rgba(124, 92, 252, 0.35)")
              }
              onMouseLeave={() =>
                setCtaShadow("0 4px 12px rgba(124, 92, 252, 0.25)")
              }
            >
              Show Me More From AgentIQ →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
