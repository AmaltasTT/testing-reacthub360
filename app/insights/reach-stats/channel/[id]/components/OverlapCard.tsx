"use client";
import React from "react";

export const OverlapCard = ({
  pair,
  pct,
  note,
}: {
  pair: string;
  pct: string;
  note: string;
}) => {
  const val = parseFloat(pct);
  const color = val > 30 ? "text-amber-600" : val > 15 ? "text-[#e11d48]" : "text-[#7652b3]";
  return (
    <div className="p-3 border border-gray-200 rounded-xl text-center bg-white">
      <div className="text-[10px] font-semibold text-gray-400 mb-1">{pair}</div>
      <div className={`font-mono text-lg font-bold ${color}`}>{pct}%</div>
      <div className="text-[10px] text-gray-400 mt-0.5">{note}</div>
    </div>
  );
};
