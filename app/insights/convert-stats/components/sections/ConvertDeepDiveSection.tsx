"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  DEEP_DIVE_STAGE_DROPOFF,
  DEEP_DIVE_CONVERSION_EVENTS,
  DEEP_DIVE_REVENUE_AT_RISK,
} from "@/lib/convert-stats/convert-deep-dive-data";

interface InnerAccordionProps {
  title: string;
  subtitle: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function InnerAccordion({ title, subtitle, isExpanded, onToggle, children }: InnerAccordionProps) {
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`cursor-pointer transition-all duration-200 ${
          isExpanded
            ? "rounded-t-xl bg-[#F5F3FF]/[0.4] border border-[#D8B4FE]"
            : "rounded-xl bg-[#F9FAFB] border border-[#E8E8F0] hover:border-[#D2D2D7]"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div>
            <h3 className="text-[14px] font-bold text-[#1A1A2E] mb-0.5">{title}</h3>
            <p className="text-[12px] text-[#5A5A6E]">{subtitle}</p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#9494A8] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="rounded-b-xl bg-white border border-t-0 border-[#D8B4FE] px-5 py-5 pb-6">{children}</div>
      )}
    </div>
  );
}

function getRiskStyles(risk: string) {
  switch (risk) {
    case "HIGH":
      return { bg: "bg-[#FEF2F2]", text: "text-[#EF4444]", border: "border-[#FECACA]" };
    case "MID":
      return { bg: "bg-[#FEF3C7]", text: "text-[#F59E0B]", border: "border-[#FDE68A]" };
    case "LOW":
      return { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", border: "border-[#E5E7EB]" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
  }
}

function getWeightStyles(weight: string) {
  switch (weight) {
    case "HIGH":
      return "text-[#7C3AED]";
    case "MID":
      return "text-[#3B82F6]";
    case "LOW":
      return "text-[#6B7280]";
    default:
      return "text-gray-500";
  }
}

export function ConvertDeepDiveSection() {
  const [isOuterExpanded, setIsOuterExpanded] = useState(false);
  const [expandedInner, setExpandedInner] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isOuterExpanded && expandedInner.size === 0) {
      setExpandedInner(new Set([0]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when outer opens; avoid reopening first accordion when user closed all inners
  }, [isOuterExpanded]);

  const toggleOuter = () => {
    setIsOuterExpanded(!isOuterExpanded);
    if (isOuterExpanded) {
      setExpandedInner(new Set());
    }
  };

  const toggleInner = (index: number) => {
    const next = new Set(expandedInner);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setExpandedInner(next);
  };

  return (
    <div className="mt-12 mb-12">
      <div className={`bg-white shadow-sm ${isOuterExpanded ? "" : "rounded-2xl border border-[#E8E8F0]"}`}>
        <div
          role="button"
          tabIndex={0}
          className={`cursor-pointer px-6 py-4 flex items-center justify-between ${
            isOuterExpanded ? "rounded-t-2xl border-x border-t border-[#E8E8F0]" : ""
          }`}
          onClick={toggleOuter}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleOuter();
            }
          }}
        >
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`w-[18px] h-[18px] text-[#8B5CF6] transition-transform duration-300 ${
                isOuterExpanded ? "rotate-90" : ""
              }`}
            />
            <div>
              <h2 className="text-[15px] font-bold text-[#1A1A2E]">Deep Dive</h2>
              <p className="text-[12px] text-[#5A5A6E]">Stage drop-off, conversion events, revenue at risk</p>
            </div>
          </div>
          <span className="text-[12px] font-semibold text-[#9494A8] uppercase tracking-wide">
            {isOuterExpanded ? "COLLAPSE" : "EXPAND"}
          </span>
        </div>

        {isOuterExpanded && (
          <div className="border-x border-b border-[#E8E8F0] rounded-b-2xl bg-white px-5 pt-4 pb-5">
            <div className="border-b border-[#F3F4F6] pb-3.5 mb-4">
              <div className="grid grid-cols-3 gap-6 divide-x divide-[#E8E8F0]">
                <div className="pr-4">
                  <div className="text-[10px] font-bold text-[#EF4444] uppercase tracking-[0.05em] mb-1">BIGGEST LEAK</div>
                  <div className="text-[14px] font-bold text-[#1A1A2E] font-mono mt-1 mb-0.5">Qualified → Purchased</div>
                  <div className="text-[10px] text-[#5A5A6E]">15.3% drop-off, costing ~$92K</div>
                </div>

                <div className="px-4">
                  <div className="text-[10px] font-bold text-[#36B37E] uppercase tracking-[0.05em] mb-1">TOP EVENT</div>
                  <div className="text-[14px] font-bold text-[#1A1A2E] font-mono mt-1 mb-0.5">MQL → Closed Won</div>
                  <div className="text-[10px] text-[#5A5A6E]">$195K revenue, 42.4% CVR</div>
                </div>

                <div className="pl-4">
                  <div className="text-[10px] font-bold text-[#EF4444] uppercase tracking-[0.05em] mb-1">TOTAL ARR AT RISK</div>
                  <div className="text-[14px] font-bold text-[#1A1A2E] font-mono mt-1 mb-0.5">$399K</div>
                  <div className="text-[10px] text-[#5A5A6E]">1,307 accounts across 6 signals</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <InnerAccordion
                title="Stage Drop-off Analysis"
                subtitle="Where are conversions leaking?"
                isExpanded={expandedInner.has(0)}
                onToggle={() => toggleInner(0)}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8E8F0]">
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 pr-4">
                          Stage Transition
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-4">
                          Drop-off %
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-4">
                          Δ vs Prior
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-4">
                          Primary Driver
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 pl-4">
                          Channel Signal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEEP_DIVE_STAGE_DROPOFF.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#F3F4F6] last:border-0">
                          <td className="py-3 pr-4">
                            <span className="text-[12px] font-semibold text-[#1F2937]">{row.transition}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-20 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    backgroundColor: row.color,
                                    width: `${row.dropoff}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[12px] font-bold text-[#1F2937] font-mono">{row.dropoff}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-bold font-mono" style={{ color: row.deltaColor }}>
                                {row.delta > 0 ? "↑" : row.delta < 0 ? "↓" : ""}
                                {row.delta > 0 ? "+" : ""}
                                {row.delta} pts
                              </span>
                              {Math.abs(row.delta) > 1 && (
                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: row.deltaColor }} />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] text-[#5A5A6E]">{row.primaryDriver}</span>
                          </td>
                          <td className="py-3 pl-4">
                            <span className="text-[11px] text-[#5A5A6E]">{row.channelSignal}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </InnerAccordion>

              <InnerAccordion
                title="Conversion Event Breakdown"
                subtitle="All events sorted by revenue impact"
                isExpanded={expandedInner.has(1)}
                onToggle={() => toggleInner(1)}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8E8F0]">
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 pr-4">
                          Event
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Channel
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Revenue ↓
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Volume
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          CVR
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Trend
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 pl-3">
                          WT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEEP_DIVE_CONVERSION_EVENTS.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#F3F4F6] last:border-0">
                          <td className="py-3 pr-4">
                            <span className="text-[12px] font-medium text-[#1F2937]">{row.event}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                style={{ backgroundColor: row.channelColor }}
                              >
                                {row.channelBadge}
                              </div>
                              <span className="text-[12px] text-[#5A5A6E]">{row.channel}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[13px] font-bold text-[#1A1A2E] font-mono">{row.revenue}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[12px] text-[#5A5A6E] font-mono">{row.volume}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[12px] font-semibold text-[#1F2937] font-mono">{row.cvr}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="text-[12px] font-bold font-mono"
                              style={{ color: row.trendUp ? "#36B37E" : "#EF4444" }}
                            >
                              {row.trend}
                            </span>
                          </td>
                          <td className="py-3 pl-3">
                            <span className={`text-[10px] font-bold uppercase tracking-[0.05em] ${getWeightStyles(row.weight)}`}>
                              {row.weight}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </InnerAccordion>

              <InnerAccordion
                title="Revenue at Risk"
                subtitle="AgentIQ-detected churn patterns within 90 days"
                isExpanded={expandedInner.has(2)}
                onToggle={() => toggleInner(2)}
              >
                <div className="overflow-x-auto mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8E8F0]">
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 pr-4">
                          Signal
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Risk
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Affected
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-left pb-3 px-3">
                          Channel
                        </th>
                        <th className="text-[10px] font-bold text-[#86868B] uppercase tracking-wide text-right pb-3 pl-3">
                          Impact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEEP_DIVE_REVENUE_AT_RISK.map((row, idx) => {
                        const riskStyles = getRiskStyles(row.risk);
                        return (
                          <tr key={idx} className="border-b border-[#F3F4F6] last:border-0">
                            <td className="py-3 pr-4">
                              <span className="text-[12px] font-medium text-[#1F2937]">{row.signal}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${riskStyles.bg} ${riskStyles.text} ${riskStyles.border}`}
                              >
                                {row.risk}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-[12px] text-[#5A5A6E] font-mono">{row.affected}</span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                                  style={{ backgroundColor: row.channelColor }}
                                >
                                  {row.channelBadge}
                                </div>
                                <span className="text-[12px] text-[#5A5A6E]">{row.channel}</span>
                              </div>
                            </td>
                            <td className="py-3 pl-3 text-right">
                              <span className="text-[13px] font-bold text-[#EF4444] font-mono">{row.impact}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div
                  className="rounded-xl px-4 py-3.5 border"
                  style={{
                    background: "linear-gradient(90deg, rgba(239, 68, 68, 0.08) 0%, rgba(239, 68, 68, 0.04) 100%)",
                    borderColor: "rgba(239, 68, 68, 0.1)",
                  }}
                >
                  <div className="text-[13px] font-bold text-[#EF4444] mb-1">
                    Total ARR at Risk: $399K across 1,307 accounts
                  </div>
                  <div className="text-[12px] text-[#4B5563]">47% concentrated in TikTok Shop and GA4 non-activators.</div>
                </div>
              </InnerAccordion>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
