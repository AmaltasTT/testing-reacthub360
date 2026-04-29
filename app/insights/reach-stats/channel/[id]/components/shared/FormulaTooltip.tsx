"use client";
import React from "react";

export const FormulaTooltip = ({
  label,
  formula,
  description,
}: {
  label: string;
  formula: string;
  description?: string;
}) => (
  <span className="relative group/formula inline border-b border-dotted border-gray-300 cursor-help">
    {label}
    <span className="hidden group-hover/formula:block absolute bottom-full left-0 mb-1.5 bg-gray-800 text-white text-[10px] font-normal leading-relaxed px-3 py-2 rounded-md whitespace-nowrap z-10 pointer-events-none">
      <strong className="text-purple-300 font-semibold block">{formula}</strong>
      {description && <span className="text-white/80">{description}</span>}
    </span>
  </span>
);
