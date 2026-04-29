"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Info, ChevronDown } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  P, ATTENTION_DECAY_DATA, FORMAT_DECAY_DATA,
  CHANNEL_DECAY_COLORS, FORMAT_DECAY_COLORS,
} from "@/lib/engage-stats/data";

type ViewMode = "channel" | "format";

interface WhatNextItem {
  label: string;
  title: string;
  text: string;
  borderColor: string;
}

const WHAT_NEXT: Record<ViewMode, WhatNextItem[]> = {
  channel: [
    {
      label: "ALLOCATE MORE",
      title: "LinkedIn",
      text: "Retains 78% at 75% mark. Strong midpoint performance. Increase budget allocation.",
      borderColor: "rgba(5, 150, 105, 0.9)",
    },
    {
      label: "CORRECT DISTORTION",
      title: "Instagram",
      text: "Drops 56% at 3s. Weak hook retention. Redesign opening frame immediately.",
      borderColor: "rgba(245, 158, 11, 0.9)",
    },
    {
      label: "VALIDATE TRAFFIC",
      title: "GDN",
      text: "Loses 91% before 3s. Early drop-off. Pause or reallocate to video.",
      borderColor: "rgba(220, 38, 38, 0.9)",
    },
  ],
  format: [
    {
      label: "ALLOCATE MORE",
      title: "Video",
      text: "Retains 60% at midpoint. Strong performance. Increase budget allocation.",
      borderColor: "rgba(5, 150, 105, 0.9)",
    },
    {
      label: "CORRECT DISTORTION",
      title: "Static",
      text: "Drops 32% at 3s. Weak hook retention. Redesign opening frame immediately.",
      borderColor: "rgba(245, 158, 11, 0.9)",
    },
    {
      label: "VALIDATE TRAFFIC",
      title: "Stories",
      text: "Loses 91% before 3s. Early drop-off. Pause or reallocate to video.",
      borderColor: "rgba(220, 38, 38, 0.9)",
    },
  ],
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const sorted = [...payload].sort((a, b) => b.value - a.value);
  return (
    <div style={{
      background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "10px 12px",
      maxWidth: 220, fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, marginBottom: 8, color: "#111" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {sorted.map((entry: any, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.stroke, flexShrink: 0 }} />
              <span style={{ color: "#374151" }}>{entry.dataKey}</span>
            </div>
            <span style={{ fontWeight: 700, color: "#111", fontVariantNumeric: "tabular-nums" }}>
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttentionDecaySection() {
  const [viewMode, setViewMode] = useState<ViewMode>("channel");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const channelKeys = useMemo(() => Object.keys(CHANNEL_DECAY_COLORS), []);
  const formatKeys = useMemo(() => Object.keys(FORMAT_DECAY_COLORS), []);

  const [selectedChannels, setSelectedChannels] = useState<string[]>(channelKeys);
  const [selectedFormats, setSelectedFormats] = useState<string[]>(formatKeys);

  const data = viewMode === "channel" ? ATTENTION_DECAY_DATA : FORMAT_DECAY_DATA;
  const colors = viewMode === "channel" ? CHANNEL_DECAY_COLORS : FORMAT_DECAY_COLORS;
  const currentKeys = viewMode === "channel" ? channelKeys : formatKeys;
  const selected = viewMode === "channel" ? selectedChannels : selectedFormats;
  const setSelected = viewMode === "channel" ? setSelectedChannels : setSelectedFormats;

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
    setShowDropdown(false);
    setHoveredLine(null);
  };

  const toggleItem = (key: string) => {
    setSelected((prev) => {
      if (prev.includes(key)) {
        return prev.length === 1 ? prev : prev.filter((k) => k !== key);
      }
      if (prev.length >= 8) return prev;
      return [...prev, key];
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div style={{
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(4px)",
      borderRadius: 16,
      border: "1px solid rgba(229,231,235,0.6)",
      padding: 40,
      marginBottom: 48,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: P.text1, margin: 0 }}>
              Attention Decay — Where You Lose Your Audience
            </h2>
            <span title="Retention is normalized by relative content duration. Bubble size reflects relative audience drop-off at each stage."
              style={{ color: P.text3, cursor: "help", display: "inline-flex" }}>
              <Info style={{ width: 16, height: 16 }} />
            </span>
          </div>
          <p style={{ fontSize: 13, color: P.text3, lineHeight: 1.6, margin: 0 }}>
            Retention curve showing where audience attention weakens over time.
          </p>
        </div>

        {/* Toggle: By Channel / By Format */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {(["channel", "format"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewChange(mode)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: viewMode === mode ? "#5B4FE9" : "#F3F4F6",
                color: viewMode === mode ? "#fff" : P.text2,
              }}
            >
              By {mode === "channel" ? "Channel" : "Format"}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Remove selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: P.text2 }}>
          Add/Remove {viewMode === "channel" ? "Channels" : "Formats"}
        </span>
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: "#fff", border: "1px solid #D1D5DB", color: P.text2,
              cursor: "pointer",
            }}
          >
            <span>
              {selected.length} {viewMode === "channel"
                ? (selected.length === 1 ? "Channel" : "Channels")
                : (selected.length === 1 ? "Format" : "Formats")}
            </span>
            <ChevronDown style={{ width: 16, height: 16 }} />
          </button>

          {showDropdown && (
            <div style={{
              position: "absolute", left: 0, top: "calc(100% + 8px)",
              width: 240, background: "#fff", borderRadius: 8,
              border: "1px solid #E5E7EB", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              zIndex: 50, padding: 8,
            }}>
              <div style={{ fontSize: 10, color: P.text3, textTransform: "uppercase", letterSpacing: 0.8, padding: "4px 8px 8px", fontWeight: 600 }}>
                Select {viewMode === "channel" ? "Channels" : "Formats"} (Max 8)
              </div>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                {currentKeys.map((key) => {
                  const isSelected = selected.includes(key);
                  const atMax = !isSelected && selected.length >= 8;
                  return (
                    <label
                      key={key}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "7px 8px", borderRadius: 6, cursor: atMax ? "not-allowed" : "pointer",
                        background: isSelected ? "rgba(91,79,233,0.06)" : "transparent",
                        opacity: atMax ? 0.5 : 1,
                        transition: "background 0.15s",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !atMax && toggleItem(key)}
                        disabled={atMax}
                        style={{ width: 14, height: 14, accentColor: "#5B4FE9" }}
                      />
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors[key], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: P.text1 }}>{key}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        {currentKeys.filter((k) => selected.includes(k)).map((key) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: P.text2 }}>
            <div style={{ width: 16, height: 3, borderRadius: 2, background: colors[key] }} />
            <span>{key}</span>
          </div>
        ))}
      </div>

      {/* Tier labels */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: 16, paddingRight: 16, marginBottom: 8 }}>
        {[
          { label: "Low Depth", tooltip: "Early engagement and short interactions." },
          { label: "Medium Depth", tooltip: "Sustained interaction beyond initial exposure. Signals developing interest." },
          { label: "High Depth", tooltip: "Advanced engagement and prolonged attention. Signals developing intent." },
        ].map(({ label, tooltip }) => (
          <div key={label} style={{ flex: 1, textAlign: "center" }}>
            <span
              title={tooltip}
              style={{
                fontSize: 11, color: P.text3, opacity: 0.6,
                display: "inline-flex", alignItems: "center", gap: 4, cursor: "help",
              }}
            >
              {label}
              <Info style={{ width: 11, height: 11 }} />
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: "#F3F0FF",
        borderRadius: 10,
        padding: 16,
        marginBottom: 24,
        height: 320,
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: P.text3 }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: P.text3 }}
              domain={[0, 110]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} animationDuration={150} />
            {currentKeys.filter((k) => selected.includes(k)).map((key) => {
              const isHovered = hoveredLine === key;
              const isOtherHovered = hoveredLine && hoveredLine !== key;
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[key]}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeOpacity={isOtherHovered ? 0.35 : 1}
                  dot={{ r: 4, fill: colors[key] }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                  onMouseEnter={() => setHoveredLine(key)}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* What Next */}
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: P.text3, textTransform: "uppercase", marginBottom: 16 }}>
        What Next?
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {WHAT_NEXT[viewMode].map((item) => (
          <div
            key={item.label}
            style={{ borderLeft: `2px solid ${item.borderColor}`, paddingLeft: 16 }}
          >
            <div style={{ fontSize: 10, color: P.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6, fontWeight: 600 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: P.text1, marginBottom: 6 }}>
              {item.title}
            </div>
            <p style={{ fontSize: 13, color: P.text2, lineHeight: 1.5, margin: 0 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
