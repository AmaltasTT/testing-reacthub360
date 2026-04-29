"use client";
import React from "react";

export const InsightRibbon = ({ children }: { children: React.ReactNode }) => (
  <div className="border-t border-purple-100 border-b border-b-gray-100 px-7 py-2.5 bg-purple-50/60">
    <p className="text-[12px] font-medium text-gray-500 leading-relaxed [&>strong]:font-bold [&>strong]:text-purple-900">
      {children}
    </p>
  </div>
);
