"use client";
import React from "react";

interface InsightItem {
  key: string;
  title: string;
  body: string;
}

export const DynamicInsightPanel = ({
  items,
  activeKey,
}: {
  items: InsightItem[];
  activeKey: string;
}) => {
  const active = items.find((i) => i.key === activeKey) || items[0];
  if (!active) return null;
  return (
    <div className="mb-1">
      <div key={active.key}>
        <h3 className="text-sm font-bold mb-1.5">{active.title}</h3>
        <p
          className="text-[12px] text-gray-500 mb-3 leading-relaxed [&>strong]:text-gray-700 [&>strong]:font-semibold"
          dangerouslySetInnerHTML={{ __html: active.body }}
        />
      </div>
    </div>
  );
};
