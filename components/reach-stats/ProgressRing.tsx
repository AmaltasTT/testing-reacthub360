"use client";

import { P } from "@/lib/reach-stats/data";

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
}

export function ProgressRing({ value, size = 58, stroke = 4, color = P.accent }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = r * 2 * Math.PI;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={P.barGrey}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={c - value * c}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}
