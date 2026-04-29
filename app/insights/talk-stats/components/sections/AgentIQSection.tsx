"use client";

import { ChevronRight, RefreshCw } from "lucide-react";
import { TALK_AGENT_ACTIONS } from "@/lib/talk-stats/data";

interface AgentIQSectionProps {
  onOpenAgentIQ?: () => void;
}

export function AgentIQSection({ onOpenAgentIQ }: AgentIQSectionProps) {
  return (
    <div
      className="mb-6 rounded-2xl border bg-white p-7"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        backgroundColor: "#F8F9FC",
      }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            style={{
              width: "4px",
              height: "48px",
              backgroundColor: "var(--purple)",
              borderRadius: "2px",
            }}
          />
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--neutral-900)",
                marginBottom: 4,
              }}
            >
              AgentIQ - Your Marketing Co-Pilot
            </h2>
            <p style={{ fontSize: "13px", color: "var(--neutral-500)" }}>
              Unlock Insights. Drive Winning Actions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
            style={{
              fontSize: "12px",
              color: "var(--neutral-600)",
              backgroundColor: "white",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
            REFRESH
          </button>
          <button
            className="rounded-lg px-3 py-1.5"
            style={{
              fontSize: "12px",
              color: "var(--neutral-600)",
              backgroundColor: "white",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}
          >
            7h ago
          </button>
        </div>
      </div>

      <div
        className="mb-4 rounded-xl p-4"
        style={{ backgroundColor: "white", border: "1px solid var(--border)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--blue)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            YOUR NEXT MOVE
          </span>
          <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
            Prioritized by impact × urgency
          </span>
        </div>
        <div className="space-y-0">
          {TALK_AGENT_ACTIONS.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b py-4 last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center" style={{ minWidth: "32px" }}>
                <ChevronRight
                  size={18}
                  style={{
                    color: action.type === "FIX" ? "var(--red)" : "var(--blue)",
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span
                    style={{ fontSize: "13px", fontWeight: 600, color: "var(--neutral-900)" }}
                  >
                    {action.title}
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5"
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.3px",
                      backgroundColor:
                        action.deadline === "Immediate" || action.deadline === "This week"
                          ? "rgba(224,74,74,0.08)"
                          : action.deadline === "Next 7 days"
                            ? "rgba(255,167,38,0.08)"
                            : "rgba(74,122,224,0.08)",
                      color:
                        action.deadline === "Immediate" || action.deadline === "This week"
                          ? "var(--red)"
                          : action.deadline === "Next 7 days"
                            ? "var(--amber)"
                            : "var(--blue)",
                    }}
                  >
                    {action.deadline}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--neutral-500)", lineHeight: 1.4 }}>
                  {action.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="rounded-lg px-3 py-1.5"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color: action.type === "FIX" ? "var(--red)" : "var(--green)",
                    backgroundColor:
                      action.type === "FIX"
                        ? "rgba(224,74,74,0.06)"
                        : "rgba(54,179,126,0.06)",
                    border: `1px solid ${
                      action.type === "FIX"
                        ? "rgba(224,74,74,0.15)"
                        : "rgba(54,179,126,0.15)"
                    }`,
                  }}
                >
                  {action.arrImpact}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex items-center justify-end border-t pt-4"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            style={{
              fontSize: "12px",
              color: "var(--blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            + 4 ACTIONS
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={onOpenAgentIQ}
          className="flex items-center justify-center gap-2 rounded-full px-5 py-2.5 transition-all hover:opacity-90"
          style={{
            background: "var(--purple)",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Show Me More From AgentIQ →
        </button>
      </div>
    </div>
  );
}
