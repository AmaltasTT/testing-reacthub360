"use client";
import React from "react";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 mb-5 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-px ${className}`}>
    {children}
  </div>
);
