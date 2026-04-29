"use client";
import React from "react";

const rows = [
  {
    tag: "REALLOCATE",
    amount: "$3,640",
    tagColor: "bg-green-100 text-green-800",
    desc: (
      <>
        <strong>Static Image Ads → Video</strong> (Demo + Testimonial) — video engagement 2.4× higher
      </>
    ),
  },
  {
    tag: "REALLOCATE",
    amount: "$1,820",
    tagColor: "bg-green-100 text-green-800",
    desc: (
      <>
        <strong>Retargeting → Prospecting</strong> — retargeting 71% saturated, prospecting at 4.5%
      </>
    ),
  },
  {
    tag: "SHIFT",
    amount: "Daypart",
    tagColor: "bg-blue-100 text-blue-800",
    desc: (
      <>
        <strong>Off-peak → Thu–Sun 6pm–12am</strong> — 73% of conversions in this window
      </>
    ),
  },
];

export const BudgetReallocation = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
    <div className="flex items-baseline gap-2 px-6 py-3 border-b border-gray-100">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
        Budget Reallocation
      </span>
      <span className="text-[9px] text-gray-400">
        $5,460 to reallocate · 30% of total spend
      </span>
    </div>
    <div className="px-6 py-4 flex flex-col gap-2">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg text-[11px] text-gray-500"
        >
          <span className={`font-mono text-[9px] font-bold px-1.5 py-px rounded ${r.tagColor}`}>
            {r.tag}
          </span>
          <span className="font-mono text-[11px] font-bold text-purple-900 min-w-[52px]">
            {r.amount}
          </span>
          <span>{r.desc}</span>
        </div>
      ))}
    </div>
  </div>
);
