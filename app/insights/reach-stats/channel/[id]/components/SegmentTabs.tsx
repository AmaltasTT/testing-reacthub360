"use client";
import React from "react";

export const SegmentTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}) => (
  <div className="flex gap-0 border-b-2 border-gray-100 mb-4">
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => setActiveTab(t.id)}
        className={`px-4 py-2 text-[12px] font-semibold border-b-2 -mb-0.5 transition-colors ${activeTab === t.id
            ? "text-[#7652b3] border-purple-500"
            : "text-gray-400 border-transparent hover:text-gray-700"
          }`}
      >
        {t.label}
      </button>
    ))}
  </div>
);
