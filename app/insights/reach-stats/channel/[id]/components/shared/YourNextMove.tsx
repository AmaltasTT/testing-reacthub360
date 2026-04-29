"use client";
import React from "react";

interface MoveItem {
  tag: string;
  text: React.ReactNode;
}

interface YourNextMoveProps {
  scale: MoveItem[];
  fix: MoveItem[];
  watch: MoveItem[];
  impact?: string;
  impactLabel?: string;
}

const MoveColumn = ({
  title,
  dotColor,
  tagBg,
  tagBorder,
  tagColor,
  items,
  borderRight = true,
}: {
  title: string;
  dotColor: string;
  tagBg: string;
  tagBorder: string;
  tagColor: string;
  items: MoveItem[];
  borderRight?: boolean;
}) => (
  <div className={`p-[1.125rem] ${borderRight ? "border-r border-gray-200" : ""}`}>
    <div className="flex items-center gap-1.5 mb-3">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
      <span className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: dotColor }}>
        {title}
      </span>
    </div>
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span
            className="flex-shrink-0 mt-0.5 text-[7px] font-bold uppercase px-1.5 py-px rounded"
            style={{ color: tagColor, background: tagBg, border: `1px solid ${tagBorder}`, lineHeight: "1.5" }}
          >
            {item.tag}
          </span>
          <span className="text-[12px] text-gray-500 leading-[1.45] [&>strong]:text-gray-900 [&>strong]:font-semibold">
            {item.text}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const YourNextMove = ({ scale, fix, watch, impact, impactLabel = "Expected impact" }: YourNextMoveProps) => (
  <div className="mb-5 border border-gray-200 rounded-2xl overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-200 bg-gray-50/80">
      <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-700">Your Next Move</div>
    </div>
    <div className="grid grid-cols-3 bg-white">
      <MoveColumn
        title="Scale"
        dotColor="#059669"
        tagBg="#ECFDF5"
        tagBorder="#A7F3D0"
        tagColor="#059669"
        items={scale}
      />
      <MoveColumn
        title="Fix"
        dotColor="#E11D48"
        tagBg="#FFF1F2"
        tagBorder="#FECDD3"
        tagColor="#E11D48"
        items={fix}
      />
      <MoveColumn
        title="Watch"
        dotColor="#9BA3B0"
        tagBg="#F0F1F4"
        tagBorder="#DFE2E8"
        tagColor="#6E7787"
        items={watch}
        borderRight={false}
      />
    </div>
    {impact && (
      <div className="px-5 py-3 border-t border-gray-200 bg-green-50 flex items-center gap-2">
        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-green-700">{impactLabel}</span>
        <span className="text-[8px] text-gray-400">Â·</span>
        <span className="text-[12px] font-semibold text-green-900">{impact}</span>
      </div>
    )}
  </div>
);

