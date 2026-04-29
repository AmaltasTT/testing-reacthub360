"use client";

import { useState, useEffect, useRef } from "react";
import { P } from "@/lib/reach-stats/data";

interface HBarProps {
  value: number;
  max: number;
  height?: number;
}

export function HBar({ value, max, height = 5 }: HBarProps) {
  const [w, setW] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setW((value / max) * 100);
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, max]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height,
        background: P.barGrey,
        borderRadius: height,
      }}
    >
      <div
        style={{
          width: `${w}%`,
          height: "100%",
          background: P.accent,
          borderRadius: height,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          opacity: 0.65,
        }}
      />
    </div>
  );
}
