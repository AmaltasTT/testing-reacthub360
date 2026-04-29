"use client";
import React from "react";

export const Pill = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "alert";
}) => {
  const colors = {
    default: "bg-gray-100 text-gray-600",
    accent: "bg-purple-100 text-purple-700",
    alert: "bg-red-50 text-[#e11d48]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors[variant]}`}>
      {children}
    </span>
  );
};
