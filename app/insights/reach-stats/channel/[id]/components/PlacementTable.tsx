"use client";
import React from "react";
import { Pill } from "./shared/Pill";

type MetricLike = number | string | { value?: number | null; formatted?: string } | null | undefined;

function fmtK(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return String(n);
}

function metricValue(metric: MetricLike): number | null {
  if (typeof metric === "number") return Number.isFinite(metric) ? metric : null;
  if (typeof metric === "string") {
    const parsed = Number(metric.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (metric && typeof metric === "object" && typeof metric.value === "number") {
    return Number.isFinite(metric.value) ? metric.value : null;
  }
  return null;
}

function metricFormatted(metric: MetricLike): string | null {
  if (typeof metric === "string") return metric;
  if (metric && typeof metric === "object" && typeof metric.formatted === "string") return metric.formatted;
  return null;
}

function mapApiPlacements(apiData: any[]) {
  return apiData.map((p) => {
    const impressionsValue = metricValue(p.impressions);
    const reachValue = metricValue(p.reach);
    const frequencyValue = metricValue(p.frequency);
    const freq = frequencyValue ?? (impressionsValue != null && reachValue ? (impressionsValue / reachValue) : 0);
    const ratio = `${(freq ?? 0).toFixed(1)}x`;
    const isHigh = freq >= 5;
    const isWarning = freq >= 4;
    const reachLabel = metricFormatted(p.reach) ?? (reachValue != null ? fmtK(reachValue) : String(p.reach ?? "-"));
    const impressionsLabel = metricFormatted(p.impressions) ?? (impressionsValue != null ? fmtK(impressionsValue) : String(p.impressions ?? "-"));
    return {
      name: p.name ?? p.placement ?? "Unknown",
      ratio,
      reach: reachLabel,
      impressions: impressionsLabel,
      verdict: isHigh ? "Low viewability" : isWarning ? "Monitor" : "Healthy",
      vd: (isHigh ? "alert" : "default") as "alert" | "default" | "accent",
      ratioColor: isHigh ? "text-[#e11d48] font-bold" : isWarning ? "text-[#e11d48]" : "",
    };
  });
}

export const PlacementTable = ({ data }: { data?: any[] }) => {
  const placements = data && data.length > 0 ? mapApiPlacements(data) : [];
  return (
    <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden">
      <div className="px-6 py-3.5 border-b border-gray-200 bg-gray-50/80">
        <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-gray-400">
          Placement Quality - Impr/Reach Ratio
        </div>
      </div>
      <div className="px-6 py-3 pb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left font-bold text-gray-400 uppercase tracking-wide pb-2 text-[8px]">Placement</th>
              <th className="text-right font-bold text-gray-400 uppercase tracking-wide pb-2 text-[8px]">Impr/Reach</th>
              <th className="text-right font-bold text-gray-400 uppercase tracking-wide pb-2 text-[8px]">Reach</th>
              <th className="text-right font-bold text-gray-400 uppercase tracking-wide pb-2 text-[8px]">Impressions</th>
              <th className="text-right pb-2 text-[8px]" />
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {placements.length > 0 ? (
              placements.map((p, i) => (
                <tr key={p.name} className={i < placements.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-2 font-semibold text-gray-700">{p.name}</td>
                  <td className={`text-right font-mono text-gray-700 ${p.ratioColor}`}>{p.ratio}</td>
                  <td className="text-right font-mono text-gray-500">{p.reach}</td>
                  <td className="text-right font-mono text-gray-500">{p.impressions}</td>
                  <td className="text-right">
                    <Pill variant={p.vd}>{p.verdict}</Pill>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-[11px] font-medium text-gray-400">
                  No placement data for selected range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
