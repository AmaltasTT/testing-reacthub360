"use client";

import { useState, useEffect, useRef } from "react";
import { fmt, fmtMoney, fmtPct, fmtSpend } from "@/lib/reach-stats/data";

interface AnimatedNumberProps {
  value: number;
  format?: "number" | "money" | "percent" | "spend";
  duration?: number;
}

export function AnimatedNumber({ value, format = "number", duration = 1200 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ran.current) {
          ran.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            const e2 = 1 - Math.pow(1 - p, 3);
            const v = value * e2;
            if (format === "money") setDisplay(fmtMoney(v));
            else if (format === "percent") setDisplay(fmtPct(v));
            else if (format === "spend") setDisplay(fmtSpend(v));
            else setDisplay(fmt(v));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, format, duration]);

  return <span ref={ref}>{display}</span>;
}
