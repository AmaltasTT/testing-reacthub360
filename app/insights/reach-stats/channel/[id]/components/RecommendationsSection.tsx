"use client";
import React from "react";
import type { TransformedRecommendations } from "@/lib/reach-stats/channel-transforms";

const categoryConfig = {
  scale: { label: "Scale", color: "#059669", bg: "rgba(5,150,105,0.06)", border: "rgba(5,150,105,0.15)" },
  fix: { label: "Fix", color: "#E11D48", bg: "rgba(225,29,72,0.06)", border: "rgba(225,29,72,0.15)" },
  watch: { label: "Watch", color: "#D97706", bg: "rgba(217,119,6,0.06)", border: "rgba(217,119,6,0.15)" },
} as const;

export const RecommendationsSection = ({ data }: { data?: TransformedRecommendations }) => {
  if (!data) return null;

  const isEmpty = data.scale.length === 0 && data.fix.length === 0 && data.watch.length === 0;

  if (isEmpty) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100 text-center">
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7652b3] mb-3">
          Recommendations
        </div>
        <p className="text-sm text-gray-400">No recommendations for this period</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
      <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7652b3] mb-4">
        Recommendations
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["scale", "fix", "watch"] as const).map((category) => {
          const config = categoryConfig[category];
          const items = data[category];
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.06em] mb-2 px-1"
                style={{ color: config.color }}
              >
                {config.label}
              </div>
              <div className="space-y-2">
                {items
                  .sort((a, b) => a.priority - b.priority)
                  .map((rec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl text-[12px] leading-relaxed text-gray-700"
                      style={{
                        background: config.bg,
                        border: `1px solid ${config.border}`,
                      }}
                    >
                      {rec.text}
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
