"use client";
import React from "react";
import { FormulaTooltip } from "./FormulaTooltip";

const ensurePercent = (value: string): string => {
  const clean = value.trim();
  if (!clean) return "0%";
  if (clean.endsWith("%")) return clean;
  if (clean === "—" || clean.toLowerCase() === "n/a") return clean;
  const numeric = Number(clean.replace(/,/g, ""));
  if (Number.isFinite(numeric)) return `${clean}%`;
  return clean;
};

const formatMetricValue = (label: string, value: string): string => {
  if (label === "Qualification Rate (QRR)") return ensurePercent(value);
  return value;
};

export const MetricCard = ({
  label,
  value,
  delta,
  selected,
  onClick,
  formula,
  formulaDesc,
}: {
  label: string;
  value: string;
  delta?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  formula?: string;
  formulaDesc?: string;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-[110px] text-left p-3 rounded-xl border-[1.5px] transition-all duration-200 ${selected
        ? "border-purple-500 bg-purple-50"
        : "border-gray-200 hover:border-purple-300 hover:-translate-y-0.5 hover:shadow-sm"
      }`}
  >
    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
      {formula ? (
        <FormulaTooltip label={label} formula={formula} description={formulaDesc} />
      ) : (
        label
      )}
    </div>
    <div className={`font-mono text-xl font-bold ${selected ? "text-purple-800" : "text-gray-800"}`}>
      {formatMetricValue(label, value)}
    </div>
    {delta && <div className="text-[10px] font-semibold text-gray-400 mt-0.5">{delta}</div>}
  </button>
);
