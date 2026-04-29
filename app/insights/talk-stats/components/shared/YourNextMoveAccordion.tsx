"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface YourNextMoveAccordionProps {
  count: number;
  subtitle: string;
  children: React.ReactNode;
}

export function YourNextMoveAccordion({
  count,
  subtitle,
  children,
}: YourNextMoveAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between rounded-full px-4 py-3 transition-all hover:opacity-90"
        aria-label={`Your Next Move. ${count} actions. ${subtitle}`}
        title={subtitle}
        style={{
          backgroundColor: "rgba(124,92,252,0.08)",
          border: "1px solid rgba(124,92,252,0.2)",
        }}
      >
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--purple)" }}>
          Your Next Move
        </div>
        <div className="flex items-center gap-2">
          <div
            className="rounded-full px-2 py-1"
            style={{
              backgroundColor: "var(--purple)",
              color: "white",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.3px",
            }}
          >
            {count} ACTIONS
          </div>
          {expanded ? (
            <ChevronUp size={16} style={{ color: "var(--purple)" }} />
          ) : (
            <ChevronDown size={16} style={{ color: "var(--purple)" }} />
          )}
        </div>
      </button>
      {expanded && <div className="mt-3 space-y-3">{children}</div>}
    </>
  );
}
