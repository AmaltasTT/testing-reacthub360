"use client";
import React from "react";
import { SectionLabel } from "./shared/SectionLabel";
import { type Channel } from "@/lib/reach-stats/data";
import type { TransformedFunnel } from "@/lib/reach-stats/channel-transforms";

const FunnelCell = ({
  phase,
  value,
  sub,
  delta,
  convRate,
  convRateWarning,
  isFirst,
  isLast,
  onClick,
}: {
  phase: string;
  value: string;
  sub: string;
  delta: string;
  convRate?: string;
  convRateWarning?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 text-center px-2.5 py-3.5 border border-gray-200 hover:bg-purple-50 transition-colors relative group focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-inset min-w-0 ${isFirst ? "rounded-l-xl" : ""} ${isLast ? "rounded-r-xl" : "border-r-0"}`}
  >
    <div className="text-[9px] font-bold uppercase tracking-widest text-[#7652b3] mb-1">{phase}</div>
    <div className="font-mono text-xl font-semibold text-gray-800">{value}</div>
    <div className="text-[9px] text-gray-400 mt-0.5 leading-snug break-words">{sub}</div>
    <div className="text-[10px] font-semibold text-gray-500 mt-1">{delta}</div>
    {convRate && (
      <div
        className={`inline-block mt-1 font-mono text-[8px] font-bold tracking-wide rounded-full px-1.5 py-0.5 ${convRateWarning ? "text-[#e11d48] bg-red-50" : "text-gray-400 bg-gray-75"}`}
      >
        {convRate}
      </div>
    )}
  </button>
);

export const FunnelSection = ({
  channel,
  onNavigate,
  data,
}: {
  channel: Channel | null;
  onNavigate: (id: string) => void;
  data?: TransformedFunnel;
}) => {
  // API data available -> use it
  if (data) {
    const navMap = ["reach", "engage", "act", "convert", "talk"];
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <SectionLabel>REACT Framework</SectionLabel>
        <div className="flex flex-col sm:flex-row">
          {data.phases.map((p, i) => (
            <FunnelCell
              key={p.phase}
              phase={p.phase}
              value={p.value}
              sub={p.sub}
              delta={p.delta}
              convRate={p.convRate}
              convRateWarning={p.convRateWarning}
              isFirst={i === 0}
              isLast={i === data.phases.length - 1}
              onClick={() => onNavigate(navMap[i] ?? p.phase.toLowerCase())}
            />
          ))}
        </div>
      </div>
    );
  }

  // No API data available: show neutral placeholders to avoid misleading demo values.
  const navMap = ["reach", "engage", "act", "convert", "talk"];
  const fallbackPhases = [
    { phase: "Reach", value: "0", sub: "N/A", delta: "-", convRate: "N/A" },
    { phase: "Engage", value: "0", sub: "N/A", delta: "-", convRate: "N/A" },
    { phase: "Act", value: "0", sub: "N/A", delta: "-", convRate: "N/A" },
    { phase: "Convert", value: "0", sub: "N/A", delta: "-" },
    { phase: "Talk", value: "0", sub: "N/A", delta: "-" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
      <SectionLabel>REACT Framework</SectionLabel>
      <div className="flex flex-col sm:flex-row">
        {fallbackPhases.map((p, i) => (
          <FunnelCell
            key={p.phase}
            phase={p.phase}
            value={p.value}
            sub={p.sub}
            delta={p.delta}
            convRate={p.convRate}
            isFirst={i === 0}
            isLast={i === fallbackPhases.length - 1}
            onClick={() => onNavigate(navMap[i])}
          />
        ))}
      </div>
    </div>
  );
};
