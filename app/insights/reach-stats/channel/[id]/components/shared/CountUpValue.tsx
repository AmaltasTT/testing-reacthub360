"use client";
import React, { useRef, useEffect, useState } from "react";

function parseValue(str: string): { prefix: string; number: number; suffix: string; decimals: number } {
  const match = str.match(/^([^0-9]*?)([\d,]+\.?\d*)(.*?)$/);
  if (!match) return { prefix: "", number: 0, suffix: str, decimals: 0 };
  const numStr = match[2].replace(/,/g, "");
  const num = parseFloat(numStr);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix: match[1], number: num, suffix: match[3], decimals };
}

function formatNum(n: number, decimals: number, original: string): string {
  const formatted = n.toFixed(decimals);
  if (original.includes(",")) {
    const parts = formatted.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  return formatted;
}

export const CountUpValue = ({
  value,
  duration = 800,
  className = "",
}: {
  value: string;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const { prefix, number: target, suffix, decimals } = parseValue(value);
          if (target === 0) { setDisplay(value); return; }
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            setDisplay(`${prefix}${formatNum(current, decimals, value)}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplay(value);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return <span ref={ref} className={className}>{display}</span>;
};
