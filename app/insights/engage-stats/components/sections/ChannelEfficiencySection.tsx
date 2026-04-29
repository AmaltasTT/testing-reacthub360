"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { P, ENGAGE_CHANNELS, ACTION_RECS } from "@/lib/engage-stats/data";
import type { EngageChannel } from "@/lib/engage-stats/data";

type SortKey = "name" | "cpe" | "cpqe" | "cpqeGap" | "eis" | "action";
type SortDir = "asc" | "desc";

function ActionCard({ title, color, bgColor, borderColor, channels, recommendation }: {
  title: string; color: string; bgColor: string; borderColor: string; channels: string[]; recommendation: string;
}) {
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 16,
      padding: "16px 20px",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: color, opacity: 0.6,
      }} />
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 0.6, color: P.text3, textTransform: "uppercase", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: P.text1, marginBottom: 6 }}>
        {channels.join(" · ")}
      </div>
      <div style={{ fontSize: 13, color: P.text2, lineHeight: 1.5, opacity: 0.7 }}>
        {recommendation}
      </div>
    </div>
  );
}

const SortIcon = ({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) => {
  if (sortKey !== col) return <ArrowUpDown style={{ width: 13, height: 13, opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-40" />;
  return sortDir === "asc"
    ? <ArrowUp style={{ width: 13, height: 13 }} />
    : <ArrowDown style={{ width: 13, height: 13 }} />;
};

export function ChannelEfficiencySection() {
  const [sortKey, setSortKey] = useState<SortKey>("eis");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const paidChannels = useMemo(
    () => ENGAGE_CHANNELS.filter((c) => c.subtype === "paid"),
    []
  );

  const sorted = useMemo(() => {
    const arr = [...paidChannels];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "action") cmp = a.action.localeCompare(b.action);
      else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [paidChannels, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const maxCpe = Math.max(...paidChannels.map((c) => c.cpe));
  const maxCpqe = Math.max(...paidChannels.map((c) => c.cpqe));

  const gapColor = (gap: number) => {
    if (gap < 30) return "#10B981";
    if (gap < 80) return "#F59E0B";
    return "#EF4444";
  };

  const cpqeGapRatio = (ch: EngageChannel) => {
    if (ch.cpe === 0) return 0;
    return ch.cpqe / ch.cpe;
  };

  const actionBadgeStyle = (action: string, actionColor: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: actionColor,
    background: `${actionColor}18`,
    textTransform: "uppercase",
  });

  const thStyle = (align: "left" | "right" | "center" = "left"): React.CSSProperties => ({
    padding: "0 12px 16px",
    fontSize: 11,
    fontWeight: 600,
    color: P.text3,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    cursor: "pointer",
    textAlign: align,
    userSelect: "none",
    borderBottom: `1px solid rgba(229,231,235,0.3)`,
    background: "#fff",
    whiteSpace: "nowrap",
  });

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
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.4, marginBottom: 8, color: P.text1 }}>
          Engagement Efficiency by Channel
        </h2>
        <p style={{ fontSize: 13, color: P.text3, lineHeight: 1.6 }}>
          Compare native cost to normalized qualified cost to identify economic distortion.
        </p>
      </div>

      {/* 3 action recommendation cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <ActionCard {...ACTION_RECS.allocateMore} />
        <ActionCard {...ACTION_RECS.correctDistortion} />
        <ActionCard {...ACTION_RECS.validateTraffic} />
      </div>

      {/* Sortable table */}
      <div style={{
        maxHeight: 480,
        overflowY: "auto",
        borderRadius: 8,
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db #f9fafb",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
            <tr>
              {/* Channel */}
              <th
                className="group"
                onClick={() => handleSort("name")}
                style={{ ...thStyle("left"), paddingLeft: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>Channel</span>
                  <SortIcon col="name" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              {/* CPE */}
              <th
                className="group"
                onClick={() => handleSort("cpe")}
                style={thStyle("left")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>CPE</div>
                    <div style={{ fontSize: 10, color: P.text3, fontWeight: 400, textTransform: "none", marginTop: 2 }}>Platform baseline</div>
                  </div>
                  <SortIcon col="cpe" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              {/* CPQE */}
              <th
                className="group"
                onClick={() => handleSort("cpqe")}
                style={thStyle("left")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>CPQE</div>
                    <div style={{ fontSize: 10, color: P.text3, fontWeight: 400, textTransform: "none", marginTop: 2 }}>Normalized</div>
                  </div>
                  <SortIcon col="cpqe" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              {/* CPQE Gap */}
              <th
                className="group"
                onClick={() => handleSort("cpqeGap")}
                style={thStyle("center")}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontWeight: 700 }}>CPQE Gap</span>
                  <SortIcon col="cpqeGap" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              {/* EIS */}
              <th
                className="group"
                onClick={() => handleSort("eis")}
                style={thStyle("center")}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span>EIS</span>
                  <SortIcon col="eis" sortKey={sortKey} sortDir={sortDir} />
                </div>
              </th>
              {/* Action */}
              <th
                className="group"
                onClick={() => handleSort("action")}
                style={{ ...thStyle("right"), paddingRight: 0 }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ch) => {
              const ratio = cpqeGapRatio(ch);
              const ratioColor = ratio >= 2.0 ? "#F97316" : ratio >= 1.5 ? "#F59E0B" : "#10B981";

              return (
                <tr
                  key={ch.id}
                  style={{ borderBottom: `1px solid rgba(243,244,246,0.8)` }}
                  className="hover:bg-gray-50/30"
                >
                  {/* Channel name */}
                  <td style={{ padding: "16px 12px 16px 0", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 6, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff",
                      background: ch.color, flexShrink: 0,
                    }}>
                      {ch.icon}
                    </span>
                    <span style={{ fontWeight: 500, color: P.text1, fontSize: 13 }}>{ch.name}</span>
                  </td>
                  {/* CPE with bar */}
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, position: "relative", height: 28, background: "#F3F4F6", borderRadius: 4, maxWidth: 120, overflow: "hidden" }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, height: "100%",
                          width: `${(ch.cpe / maxCpe) * 100}%`,
                          background: "linear-gradient(90deg, rgba(139,92,246,0.7) 0%, rgba(124,58,237,0.6) 100%)",
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontVariantNumeric: "tabular-nums", opacity: 0.7, width: 48, textAlign: "right" }}>
                        ${ch.cpe.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  {/* CPQE with bar */}
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, position: "relative", height: 28, background: "#F3F4F6", borderRadius: 4, maxWidth: 120, overflow: "hidden" }}>
                        <div style={{
                          position: "absolute", left: 0, top: 0, height: "100%",
                          width: `${Math.min((ch.cpqe / maxCpqe) * 110, 100)}%`,
                          background: "linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)",
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", width: 48, textAlign: "right" }}>
                        ${ch.cpqe.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  {/* CPQE Gap */}
                  <td style={{ padding: "16px 12px", textAlign: "center" }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      position: "relative", width: 100, height: 32,
                      background: `${ratioColor}22`, borderRadius: 8, overflow: "hidden",
                    }}>
                      <div style={{
                        position: "absolute", left: 0, top: 0, height: "100%",
                        width: `${Math.min((ratio / 4) * 100, 100)}%`,
                        background: `${ratioColor}18`,
                      }} />
                      <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: ratioColor, position: "relative", zIndex: 1 }}>
                        {ratio > 0 ? `${ratio.toFixed(1)}x` : "—"}
                      </span>
                    </div>
                  </td>
                  {/* EIS */}
                  <td style={{ padding: "16px 12px", textAlign: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: P.text1 }}>
                      {ch.eis.toFixed(1)}
                    </span>
                  </td>
                  {/* Action badge */}
                  <td style={{ padding: "16px 0 16px 12px", textAlign: "right" }}>
                    <span style={actionBadgeStyle(ch.action, ch.actionColor)}>
                      {ch.action}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
