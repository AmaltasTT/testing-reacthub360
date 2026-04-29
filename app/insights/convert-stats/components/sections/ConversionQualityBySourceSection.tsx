"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { CONVERSION_QUALITY_TIERS } from "@/lib/convert-stats/conversion-quality-by-source-data";

export function ConversionQualityBySourceSection() {
  const [expandedTiers, setExpandedTiers] = useState<Set<number>>(new Set());

  const toggleTier = (index: number) => {
    const next = new Set(expandedTiers);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setExpandedTiers(next);
  };

  return (
    <div className="mt-12 mb-12">
      <div className="mb-7">
        <h2 className="text-[26px] font-bold text-[#1A1A2E] tracking-tight mb-2" style={{ letterSpacing: "-0.5px" }}>
          Conversion quality by source
        </h2>
        <p className="text-[14px] text-[#6E6E85]">
          Which traffic sources drive which subscription tiers — last click attribution
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#D2D2D7] shadow-md p-7">
        <div className="border-t border-b border-[#D2D2D7] py-6 mb-8">
          <div className="grid grid-cols-3 gap-6 divide-x divide-[#D2D2D7]">
            <div className="px-4">
              <div className="text-[10px] font-bold text-[#36B37E] uppercase tracking-[0.06em] mb-3">SCALE</div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: "#0A66C2" }}
                >
                  L
                </div>
                <span className="text-[16px] font-bold text-[#1A1A2E]">LinkedIn</span>
              </div>
              <p className="text-[11px] text-[#5A5A6E] leading-[1.4]">
                Drives 48% of Enterprise, 38% of Pro — highest ARR per acquisition
              </p>
            </div>

            <div className="px-4">
              <div className="text-[10px] font-bold text-[#4285F4] uppercase tracking-[0.06em] mb-3">PROTECT</div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: "#36B37E" }}
                >
                  E
                </div>
                <span className="text-[16px] font-bold text-[#1A1A2E]">Email</span>
              </div>
              <p className="text-[11px] text-[#5A5A6E] leading-[1.4]">
                24–30% share across all tiers — consistent nurture backbone
              </p>
            </div>

            <div className="px-4">
              <div className="text-[10px] font-bold text-[#F44336] uppercase tracking-[0.06em] mb-3">FIX</div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: "#1A1A2E" }}
                >
                  T
                </div>
                <span className="text-[16px] font-bold text-[#1A1A2E]">TikTok</span>
              </div>
              <p className="text-[11px] text-[#5A5A6E] leading-[1.4]">
                8% Starter, 0% Pro, 0% Enterprise — volume without quality
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {CONVERSION_QUALITY_TIERS.map((tier, index) => {
            const isExpanded = expandedTiers.has(index);

            return (
              <div key={tier.name}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleTier(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTier(index);
                    }
                  }}
                  className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                    isExpanded
                      ? "border-[#D8B4FE] bg-[#F5F3FF]/[0.27]"
                      : "border-[#E8E8F0] bg-white hover:border-[#D2D2D7]"
                  }`}
                >
                  <div className="flex items-center gap-4 px-[18px] py-[14px]">
                    <div className="w-2.5 h-2.5 rounded-[3px] flex-shrink-0" style={{ backgroundColor: tier.color }} />

                    <div className="text-[14px] font-bold text-[#1A1A2E] min-w-[140px]">
                      {tier.name} ({tier.price})
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                        style={{ backgroundColor: tier.topSource.color }}
                      >
                        {tier.topSource.badge}
                      </div>
                      <span className="text-[12px] text-[#5A5A6E]">{tier.topSource.name}</span>
                      <span className="text-[12px] font-bold font-mono" style={{ color: tier.topSource.color }}>
                        {tier.topSource.percentage}%
                      </span>
                    </div>

                    <div className="text-[15px] font-bold text-[#1A1A2E] font-mono min-w-[80px] text-right">{tier.arr}</div>

                    <div className="text-[12px] text-[#9494A8] font-mono min-w-[50px] text-right">{tier.volume}</div>

                    <ChevronDown
                      className={`w-3 h-3 text-[#9494A8] transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-[18px] pb-[18px] bg-[#F9FAFB]">
                      <div className="h-7 rounded-md overflow-hidden flex mb-3.5">
                        {tier.sources
                          .filter((s) => s.percentage > 0)
                          .map((source, idx) => (
                            <div
                              key={`${source.name}-${idx}`}
                              className="flex items-center justify-center text-white text-[10px] font-bold font-mono"
                              style={{
                                backgroundColor: source.color,
                                width: `${source.percentage}%`,
                              }}
                            >
                              {source.percentage >= 12 && `${source.percentage}%`}
                            </div>
                          ))}
                      </div>

                      <div className="space-y-2">
                        {tier.sources
                          .filter((s) => s.percentage > 0)
                          .map((source, idx) => {
                            const isTopSource = idx === 0;
                            const calculatedVolume = Math.round(tier.volume * (source.percentage / 100));

                            return (
                              <div key={`${source.name}-row-${idx}`} className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0"
                                  style={{ backgroundColor: source.color }}
                                >
                                  {source.badge}
                                </div>

                                <div className="text-[12px] font-semibold text-[#1F2937] flex-1 min-w-[100px]">{source.name}</div>

                                <div className="w-[100px] h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      backgroundColor: source.color,
                                      width: `${source.percentage}%`,
                                    }}
                                  />
                                </div>

                                <div
                                  className={`text-[12px] font-bold font-mono min-w-[38px] text-right ${
                                    isTopSource ? "" : "text-[#5A5A6E]"
                                  }`}
                                  style={isTopSource ? { color: source.color } : undefined}
                                >
                                  {source.percentage}%
                                </div>

                                <div className="text-[11px] text-[#9494A8] font-mono min-w-[40px] text-right">{calculatedVolume}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-[#D2D2D7]">
          <p className="text-[12px] text-[#5A5A6E] leading-relaxed">
            <strong className="text-[#1D1D1F]">LinkedIn</strong> share grows from 18% at Starter to 48% at Enterprise — scale this channel
            for premium tier acquisition. <strong className="text-[#1D1D1F]">TikTok</strong> drops to 0% above Growth — fix targeting or
            reallocate budget to LinkedIn and Email.
          </p>
        </div>
      </div>
    </div>
  );
}
