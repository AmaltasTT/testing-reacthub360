"use client";
import React from "react";
import type { TransformedCrossCampaign } from "@/lib/reach-stats/channel-transforms";

const staticSignals = [
  {
    label: "Audience",
    title: "25–34 Female wins across all 4",
    stats: "↓ $18 CpC · 58% conv share · 8.8% eng rate · 88% VR",
  },
  {
    label: "Timing",
    title: "Thu–Sun 6pm–12am dominates",
    stats: "73% retargeting conv · 68% acq conv · $9.80 CPM",
  },
  {
    label: "Interests",
    title: "Home Improvement + DIY top everywhere",
    stats: "60% below avg CpC · 71% VCR · 0:42 avg watch",
  },
  {
    label: "Geography",
    title: "CA + TX lead every objective",
    stats: "41% of purchases · 7.4% eng rate · 72% VCR",
  },
];

export const CrossCampaignSignals = ({ data }: { data?: TransformedCrossCampaign }) => {
  // If API data says unavailable for organic channels
  if (data && !data.available) {
    return (
      <div className="bg-white border border-purple-100 rounded-2xl p-6 mb-5 text-center">
        <p className="text-sm text-gray-400">{data.reason || "Cross-campaign signals are not available for this channel."}</p>
      </div>
    );
  }

  const displaySignals = data
    ? data.signals.map((s) => ({ label: s.category, title: s.title, stats: s.stats }))
    : staticSignals;

  const campaignCount = data?.campaignCount ?? 4;

  return (
    <div className="bg-white border border-purple-100 rounded-2xl p-4 px-6 mb-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7652b3]">
          Cross-Campaign Signals — Patterns holding across all {campaignCount} campaigns
        </div>
        <a href="#campaigns" className="text-[11px] font-semibold text-[#7652b3] no-underline">
          See detail →
        </a>
      </div>
      <div className={`grid gap-3 ${displaySignals.length <= 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {displaySignals.map((s) => (
          <div
            key={s.label}
            className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl"
          >
            <div className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#7652b3] mb-1">
              {s.label}
            </div>
            <div className="text-[13px] font-bold text-gray-900 leading-snug mb-1">
              {s.title}
            </div>
            <div className="text-[11px] text-gray-500">{s.stats}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
