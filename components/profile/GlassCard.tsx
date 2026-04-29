"use client";

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div
      className={`
        relative rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-white/20
        shadow-lg shadow-violet-500/5
        ${className}
      `}
    >
      {children}
    </div>
  );
}
