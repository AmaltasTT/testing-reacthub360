"use client";
import React from "react";
import type { TransformedBudgetPacing } from "@/lib/reach-stats/channel-transforms";

const PacingCard = ({
  label,
  value,
  valueColor,
  sub,
  footer,
  footerColor,
  progress,
  progressLabels,
}: {
  label: string;
  value: string;
  valueColor?: string;
  sub: string;
  footer?: string;
  footerColor?: string;
  progress?: { pct: number; gradient: string };
  progressLabels?: [string, string];
}) => (
  <div className="p-3 border border-gray-200 rounded-xl bg-gray-25">
    <div className="text-[8px] font-bold uppercase tracking-[0.06em] text-gray-400 mb-1.5">{label}</div>
    <div className={`font-mono text-lg font-bold ${valueColor || "text-gray-800"}`}>{value}</div>
    <div className="text-[9px] text-gray-500 mt-0.5">{sub}</div>
    {progress && (
      <>
        <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress.pct}%`, background: progress.gradient }}
          />
        </div>
        {progressLabels && (
          <div className="flex justify-between mt-1">
            <span className="text-[7px] text-gray-400">{progressLabels[0]}</span>
            <span className="text-[7px] text-gray-500">{progressLabels[1]}</span>
          </div>
        )}
      </>
    )}
    {footer && (
      <div className={`text-[9px] font-semibold mt-2 ${footerColor || "text-gray-500"}`}>{footer}</div>
    )}
  </div>
);

export const BudgetPacingSection = ({
  onNavigateCampaigns,
  data,
}: {
  onNavigateCampaigns: () => void;
  data?: TransformedBudgetPacing;
}) => {
  // If API data says unavailable for organic channels
  if (data && !data.available) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 text-center">
        <p className="text-sm text-gray-400">{data.reason || "Budget pacing is not available for this channel."}</p>
      </div>
    );
  }

  const daysElapsed = data?.daysElapsed ?? 21;
  const daysTotal = data?.daysTotal ?? 31;
  const daysRemaining = daysTotal - daysElapsed;
  const totalSpendRaw = data?.totalSpendRaw ?? 18200;
  const totalBudgetRaw = data?.totalBudgetRaw ?? 26000;
  const remainingRaw = totalBudgetRaw - totalSpendRaw;
  const spentPct = totalBudgetRaw > 0 ? Math.round((totalSpendRaw / totalBudgetRaw) * 100) : 0;
  const elapsedPct = daysTotal > 0 ? Math.round((daysElapsed / daysTotal) * 100) : 0;
  const needPerDay = daysRemaining > 0 ? `$${Math.round(remainingRaw / daysRemaining).toLocaleString()}/day to finish` : "Complete";
  const remainingFormatted = remainingRaw >= 1000 ? `$${remainingRaw.toLocaleString()}` : `$${remainingRaw}`;
  const pacingDiff = spentPct - elapsedPct;
  const pacingLabel = data?.pacingStatus || (
    Math.abs(pacingDiff) <= 5
      ? `On track — ${Math.abs(pacingDiff)}% ${pacingDiff <= 0 ? "under" : "over"} pace`
      : `${pacingDiff > 0 ? "Over" : "Under"} pace by ${Math.abs(pacingDiff)}%`
  );
  const pacingColor = pacingDiff > 5 ? "text-[#e11d48]" : "text-green-600";

  return (
  <div className="grid grid-cols-[1fr_auto] gap-4 mb-5 items-stretch">
    {/* Pacing Panel */}
    <div className="bg-white border border-gray-200 rounded-2xl p-4 px-6">
      <div className="flex items-baseline justify-between mb-3.5">
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-gray-400">
          Budget Pacing — Jan 2026
        </div>
        <div className="text-[11px] text-gray-500">
          {daysElapsed} of {daysTotal} days elapsed · <strong className="text-gray-700">{daysRemaining} days remaining</strong>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <PacingCard
          label="Spent"
          value={data?.totalSpend ?? "$18,200"}
          valueColor="text-purple-900"
          sub={`of ${data?.totalBudget ?? "$26,000"} budget`}
          progress={{ pct: spentPct, gradient: "linear-gradient(90deg, #C4B5E3, #4A2F7A)" }}
          progressLabels={[`${spentPct}% spent`, `${elapsedPct}% of month elapsed`]}
        />
        <PacingCard
          label="Remaining"
          value={remainingFormatted}
          valueColor="text-green-600"
          sub={`across ${daysRemaining} days`}
          footer={pacingLabel}
          footerColor={pacingColor}
        />
        <PacingCard
          label="Daily Run Rate"
          value={data?.dailyAvg ?? "$867"}
          sub="avg/day this period"
          footer={needPerDay}
        />
        <PacingCard
          label="vs Prior Period"
          value="↑ 12%"
          valueColor="text-green-600"
          sub="$16,250 Dec 2025"
          footer="ROAS: 3.2× vs 2.9× prior"
        />
      </div>
    </div>

    {/* Campaign Alert */}
    <div className="bg-red-50 border border-red-200/40 rounded-2xl p-4 px-5 min-w-[260px] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-[7px] h-[7px] rounded-full text-[#e11d48] flex-shrink-0 animate-pulse" />
          <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#e11d48]">
            Campaign Needs Attention
          </span>
        </div>
        <div className="text-sm font-bold text-gray-900 mb-2">Retargeting — Engagers</div>
        <div className="flex flex-col gap-1 mb-3">
          {[
            { label: "Frequency", value: "6.25×" },
            { label: "Audience saturation", value: "71%" },
            { label: "CpC trend", value: "↑ 18% WoW" },
          ].map((r) => (
            <div key={r.label} className="flex justify-between text-[11px]">
              <span className="text-gray-500">{r.label}</span>
              <span className="font-mono font-bold text-[#e11d48]">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onNavigateCampaigns}
        className="block text-center py-2 px-3 text-white bg-[#e11d48] rounded-xl text-[12px] font-semibold"
      >
        View campaign →
      </button>
    </div>
  </div>
);
};
