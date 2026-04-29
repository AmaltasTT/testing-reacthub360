"use client";
import React, { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Pill } from "./shared/Pill";
import { CustomTooltip } from "./shared/CustomTooltip";
import { SegmentTabs } from "./SegmentTabs";

const ACCENT = "#7652B3";
const ACCENT_MUTED = "#C4B5E3";
const DANGER = "#E11D48";

type CampaignTab = "demographics" | "time" | "interests" | "geography";

const segTabs = [
  { id: "demographics", label: "Demographics" },
  { id: "time", label: "Time Windows" },
  { id: "interests", label: "Interests" },
  { id: "geography", label: "Geography" },
];

interface CampaignAccordionProps {
  title: string;
  healthStatus: "critical" | "growing" | "stable";
  healthLabel: string;
  summary: string;
  spend: string;
  kpis?: { label: string; value: string; valueClassName?: string }[];
  trendData?: { date: string; cpc: number; freq: number }[];
  trendAfterExtra?: boolean;
  insight?: { icon: string; title: string; body: string; variant: "default" | "primary" | "alert" | "warn" };
  hideInsight?: boolean;
  segments?: {
    demographics?: { segment: string; reach: string; purchases: string; cpc: string; cpcColor?: string; verdict: string; v: "default" | "accent" | "alert" }[];
    time?: { window: string; impr: string; purchases: string; cpc: string; cpcColor?: string; pctOfPurchases?: string; pctColor?: string; verdict: string; v: "default" | "accent" | "alert" }[];
    interests?: { interest: string; reach: string; purchases: string; cpc: string; cpcColor?: string; verdict: string; v: "default" | "accent" | "alert" }[];
    geography?: { region: string; reach: string; purchases: string; cpc: string; cpcColor?: string; verdict: string; v: "default" | "accent" | "alert" }[];
  };
  placeholders?: string;
  extraContent?: React.ReactNode;
  extraContentAfterTrend?: React.ReactNode;
  config?: { label: string; value: string }[];
  actions?: { color: string; text: React.ReactNode }[];
  theme?: "default" | "retargeting" | "acquisition" | "awareness" | "video";
  initiallyOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CampaignAccordion = ({
  title,
  healthStatus,
  healthLabel,
  summary,
  spend,
  kpis,
  trendData,
  trendAfterExtra,
  insight,
  hideInsight,
  segments,
  placeholders,
  extraContent,
  extraContentAfterTrend,
  config,
  actions,
  theme = "default",
  initiallyOpen = false,
  open,
  onOpenChange,
}: CampaignAccordionProps) => {
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const [activeTab, setActiveTab] = useState<CampaignTab>("demographics");
  const isOpen = typeof open === "boolean" ? open : internalOpen;
  const setOpen = (nextOpen: boolean) => {
    if (typeof open !== "boolean") {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const borderColor = {
    critical: "border-l-[3px] border-l-red-500",
    growing: "border-l-[3px] border-l-purple-500",
    stable: "",
  }[healthStatus];

  const healthPill = {
    critical: { cls: "bg-red-50 text-[#e11d48]", dot: "bg-red-500 animate-pulse" },
    growing: { cls: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
    stable: { cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
  }[healthStatus];

  const insightStyles = {
    default: "bg-gray-50 border-l-4 border-gray-300",
    primary: "bg-purple-50 border-l-4 border-purple-500",
    alert: "bg-red-50 border-l-4 border-red-500",
    warn: "bg-amber-50 border-l-4 border-amber-400",
  };

  const isRetargetingTheme = theme === "retargeting";
  const isAcquisitionTheme = theme === "acquisition";
  const isAwarenessTheme = theme === "awareness";
  const isVideoTheme = theme === "video";
  const isCustomTheme = isRetargetingTheme || isAcquisitionTheme || isAwarenessTheme || isVideoTheme;
  const shellClass = isRetargetingTheme
    ? `rounded-2xl border mb-2.5 overflow-hidden border-l-[3px] border-l-red-600 ${isOpen ? "border-red-400 shadow-md" : "border-red-300 shadow-sm"}`
    : isAcquisitionTheme
      ? `rounded-2xl border mb-2.5 overflow-hidden border-l-[3px] border-l-purple-600 ${isOpen ? "border-purple-400 shadow-md" : "border-purple-300 shadow-sm"}`
      : isAwarenessTheme
        ? `rounded-2xl border mb-2.5 overflow-hidden border-l-[3px] border-l-gray-300 ${isOpen ? "border-gray-300 shadow-md" : "border-gray-200 shadow-sm"}`
        : isVideoTheme
          ? `rounded-2xl border mb-2.5 overflow-hidden border-l-[3px] border-l-gray-300 ${isOpen ? "border-gray-300 shadow-md" : "border-gray-200 shadow-sm"}`
          : `rounded-xl border border-gray-200 mb-2.5 overflow-hidden ${borderColor}`;
  const headClass = isRetargetingTheme
    ? `w-full text-left grid grid-cols-[1fr_auto_auto_auto_auto_32px] items-center gap-4 px-5 py-4 transition-colors ${isOpen ? "bg-red-50/70 border-b border-red-200/60" : "hover:bg-gray-50"}`
    : isAcquisitionTheme
      ? `w-full text-left grid grid-cols-[1fr_auto_auto_auto_auto_32px] items-center gap-4 px-5 py-4 transition-colors ${isOpen ? "bg-purple-50/70 border-b border-purple-200/60" : "hover:bg-gray-50"}`
      : isAwarenessTheme
        ? `w-full text-left grid grid-cols-[1fr_auto_auto_auto_auto_32px] items-center gap-4 px-5 py-4 transition-colors ${isOpen ? "bg-gray-100 border-b border-gray-200" : "hover:bg-gray-50"}`
        : isVideoTheme
          ? `w-full text-left grid grid-cols-[1fr_auto_auto_auto_auto_32px] items-center gap-4 px-5 py-4 transition-colors ${isOpen ? "bg-gray-100 border-b border-gray-200" : "hover:bg-gray-50"}`
          : "w-full text-left grid grid-cols-[1fr_auto_auto_auto_auto_32px] items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors";

  return (
    <div className={shellClass}>
      {/* Header */}
      <button
        onClick={() => setOpen(!isOpen)}
        className={headClass}
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap text-[13px] font-semibold">
            {!isCustomTheme && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${healthPill.dot}`} />}
            {title}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${healthPill.cls}`}>{healthLabel}</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">{summary}</div>
        </div>
        <div className={`${isCustomTheme ? "text-left" : "text-right"} hidden md:block`}>
          <div className="text-[9px] text-gray-400 uppercase">Spend</div>
          <div className="font-mono text-[13px] font-semibold">{spend}</div>
        </div>
        {kpis?.[0] && (
          <div className={`${isCustomTheme ? "text-left" : "text-right"} hidden md:block`}>
            <div className="text-[9px] text-gray-400 uppercase">{kpis[0].label}</div>
            <div className={`font-mono text-[13px] font-semibold ${kpis[0].valueClassName || ""}`}>{kpis[0].value}</div>
          </div>
        )}
        {kpis?.[1] && (
          <div className={`${isCustomTheme ? "text-left" : "text-right"} hidden md:block`}>
            <div className="text-[9px] text-gray-400 uppercase">{kpis[1].label}</div>
            <div className={`font-mono text-[13px] font-semibold ${kpis[1].valueClassName || ""}`}>{kpis[1].value}</div>
          </div>
        )}
        {kpis?.[2] && (
          <div className={`${isCustomTheme ? "text-left" : "text-right"} hidden md:block`}>
            <div className="text-[9px] text-gray-400 uppercase">{kpis[2].label}</div>
            <div className={`font-mono text-[13px] font-semibold ${kpis[2].valueClassName || ""}`}>{kpis[2].value}</div>
          </div>
        )}
        <div
          className={`camp-chevron transition-transform duration-200 flex items-center justify-center
  ${isOpen ? "rotate-180" : ""} 
  ${isCustomTheme ? "h-7 w-7 rounded-full border border-gray-200 bg-gray-100 text-gray-500" : "text-gray-300"} 
  ${isRetargetingTheme && isOpen ? "border-red-200 bg-red-50 text-[#e11d48]" : ""} 
  ${(isAcquisitionTheme || isAwarenessTheme || isVideoTheme) && isOpen ? "border-purple-200 bg-purple-50 text-purple-700" : ""}`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className="block"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[5000px]" : "max-h-0"} ${isRetargetingTheme ? "border-t border-red-100" : isAcquisitionTheme ? "border-t border-purple-100" : (isAwarenessTheme || isVideoTheme) ? "border-t border-gray-200" : "border-t border-gray-100"}`}>
        <div className="p-6 bg-gray-50">
          {/* Insight */}
          {!hideInsight && insight && (
            <div className={`flex gap-3 p-4 rounded-xl mb-4 ${insightStyles[insight.variant]}`}>
              <span className="text-lg leading-6 flex-shrink-0">{insight.icon}</span>
              <div>
                <h5 className="text-[13px] font-bold mb-0.5">{insight.title}</h5>
                <p className="text-[12px] text-gray-500 leading-relaxed">{insight.body}</p>
              </div>
            </div>
          )}

          {/* Trend chart */}
          {trendData && !trendAfterExtra && (
            <div className="h-48 bg-white rounded-xl p-3 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F4" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="y" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <YAxis yAxisId="y1" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Number(v).toFixed(1)}×`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    yAxisId="y"
                    type="monotone"
                    dataKey="cpc"
                    name="CpC ($)"
                    stroke={DANGER}
                    fill="rgba(225,29,72,0.08)"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: DANGER }}
                  />
                  <Line
                    yAxisId="y1"
                    type="monotone"
                    dataKey="freq"
                    name="Frequency"
                    stroke={ACCENT_MUTED}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {extraContent && <div className="mb-4">{extraContent}</div>}

          {trendData && trendAfterExtra && (
            <div className="h-48 bg-white rounded-xl p-3 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F4" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="y" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                  <YAxis yAxisId="y1" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${Number(v).toFixed(1)}×`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    yAxisId="y"
                    type="monotone"
                    dataKey="cpc"
                    name="CpC ($)"
                    stroke={DANGER}
                    fill="rgba(225,29,72,0.08)"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: DANGER }}
                  />
                  <Line
                    yAxisId="y1"
                    type="monotone"
                    dataKey="freq"
                    name="Frequency"
                    stroke={ACCENT_MUTED}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {extraContentAfterTrend && <div className="mb-4">{extraContentAfterTrend}</div>}

          {/* Segment tabs + data */}
          {segments && (
            <>
              <SegmentTabs tabs={segTabs} activeTab={activeTab} setActiveTab={(id) => setActiveTab(id as CampaignTab)} />

              {activeTab === "demographics" && segments.demographics && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr className="bg-gray-100">{["Segment", "Reach", "Purchases", "CpC", "Verdict"].map((h) => <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">{h}</th>)}</tr></thead>
                  <tbody>
                    {segments.demographics.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-semibold">{r.segment}</td>
                        <td className="px-3 py-2 font-mono">{r.reach}</td>
                        <td className="px-3 py-2 font-mono font-bold">{r.purchases}</td>
                        <td className={`px-3 py-2 font-mono ${r.cpcColor || ""}`}>{r.cpc}</td>
                        <td className="px-3 py-2"><Pill variant={r.v}>{r.verdict}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "time" && segments.time && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr className="bg-gray-100">{["Window", "Impr", "Purchases", "CpC", "% of Purchases", "Verdict"].map((h) => <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">{h}</th>)}</tr></thead>
                  <tbody>
                    {segments.time.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-semibold">{r.window}</td>
                        <td className="px-3 py-2 font-mono">{r.impr}</td>
                        <td className="px-3 py-2 font-mono font-bold">{r.purchases}</td>
                        <td className={`px-3 py-2 font-mono ${r.cpcColor || ""}`}>{r.cpc}</td>
                        <td className={`px-3 py-2 font-mono ${r.pctColor || ""}`}>{r.pctOfPurchases || "—"}</td>
                        <td className="px-3 py-2"><Pill variant={r.v}>{r.verdict}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "interests" && segments.interests && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr className="bg-gray-100">{["Interest", "Reach", "Purchases", "CpC", "Verdict"].map((h) => <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">{h}</th>)}</tr></thead>
                  <tbody>
                    {segments.interests.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-semibold">{r.interest}</td>
                        <td className="px-3 py-2 font-mono">{r.reach}</td>
                        <td className="px-3 py-2 font-mono font-bold">{r.purchases}</td>
                        <td className={`px-3 py-2 font-mono ${r.cpcColor || ""}`}>{r.cpc}</td>
                        <td className="px-3 py-2"><Pill variant={r.v}>{r.verdict}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {activeTab === "geography" && segments.geography && (
                <table className="w-full border-collapse text-[12px]">
                  <thead><tr className="bg-gray-100">{["Region", "Reach", "Purchases", "CpC", "Verdict"].map((h) => <th key={h} className="text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase border-b border-gray-200">{h}</th>)}</tr></thead>
                  <tbody>
                    {segments.geography.map((r, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                        <td className="px-3 py-2 font-semibold">{r.region}</td>
                        <td className="px-3 py-2 font-mono">{r.reach}</td>
                        <td className="px-3 py-2 font-mono font-bold">{r.purchases}</td>
                        <td className={`px-3 py-2 font-mono ${r.cpcColor || ""}`}>{r.cpc}</td>
                        <td className="px-3 py-2"><Pill variant={r.v}>{r.verdict}</Pill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* Fallback for tabs with no data */}
              {activeTab === "demographics" && !segments.demographics && placeholders && (
                <p className="text-[12px] text-gray-400 text-center py-4">{placeholders}</p>
              )}
              {activeTab === "time" && !segments.time && placeholders && (
                <p className="text-[12px] text-gray-400 text-center py-4">{placeholders}</p>
              )}
              {activeTab === "interests" && !segments.interests && placeholders && (
                <p className="text-[12px] text-gray-400 text-center py-4">{placeholders}</p>
              )}
              {activeTab === "geography" && !segments.geography && placeholders && (
                <p className="text-[12px] text-gray-400 text-center py-4">{placeholders}</p>
              )}
            </>
          )}

          {/* Campaign Configuration */}
          {config && (
            <>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-4 mb-2">Campaign Configuration</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {config.map((c, i) => (
                  <div key={i} className="flex-shrink-0 bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[120px]">
                    <div className="text-[8px] font-bold uppercase text-gray-400 tracking-wide">{c.label}</div>
                    <div className="text-[11px] font-semibold text-gray-700 mt-0.5">{c.value}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Action Banners */}
          {actions && actions.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {actions.map((a, i) => (
                <div key={i} className={`px-4 py-2.5 rounded-lg text-[11px] font-semibold ${a.color}`}>
                  {a.text}
                </div>
              ))}
            </div>
          )}

          {/* Close bar */}
        </div>
        <button
          onClick={() => setOpen(false)}
          className={`w-full text-center py-4 border-t border-gray-200 transition-colors ${isRetargetingTheme ? "text-[10px] uppercase tracking-[0.06em] font-semibold text-gray-400 hover:bg-red-50 hover:text-[#e11d48]" : (isAcquisitionTheme || isAwarenessTheme || isVideoTheme) ? "text-[10px] uppercase tracking-[0.06em] font-semibold text-gray-400 hover:bg-purple-50 hover:text-purple-700" : "text-[11px] font-semibold text-gray-400 hover:text-gray-600"}`}
        >
          Collapse ▲
        </button>
      </div>
    </div>
  );
};
