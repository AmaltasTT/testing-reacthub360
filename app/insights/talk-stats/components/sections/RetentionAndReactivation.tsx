"use client";

import { useMemo, useState } from "react";
import {
  TALK_RETENTION_INTERVENTIONS,
  TALK_RETENTION_TOTALS,
  type RetentionIntervention,
} from "@/lib/talk-stats/data";
import { ActionCard } from "../shared/ActionCard";
import { YourNextMoveAccordion } from "../shared/YourNextMoveAccordion";

type ViewMode = "All" | "Nurture" | "Reactivation";
type SortMode = "efficiency" | "lift" | "cost" | "arr";

export function RetentionAndReactivation() {
  const [viewMode, setViewMode] = useState<ViewMode>("All");
  const [sortBy, setSortBy] = useState<SortMode>("efficiency");
  const [selectedItem, setSelectedItem] = useState<RetentionIntervention | null>(null);

  const filtered = useMemo(
    () =>
      viewMode === "All"
        ? TALK_RETENTION_INTERVENTIONS
        : TALK_RETENTION_INTERVENTIONS.filter((item) => item.category === viewMode),
    [viewMode]
  );

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => {
      if (sortBy === "efficiency") {
        const efficiencyLeft = left.costPerUser === 0 ? Infinity : left.lift / left.costPerUser;
        const efficiencyRight =
          right.costPerUser === 0 ? Infinity : right.lift / right.costPerUser;
        return efficiencyRight - efficiencyLeft;
      }

      if (sortBy === "lift") return right.lift - left.lift;
      if (sortBy === "cost") return left.costPerUser - right.costPerUser;
      return right.arrProtected - left.arrProtected;
    });
  }, [filtered, sortBy]);

  const getDecisionColor = (decision: RetentionIntervention["decision"]) => {
    if (decision === "Kill") return "var(--red)";
    if (decision === "Test" || decision === "Optimize") return "var(--amber)";
    if (decision === "Maintain") return "var(--blue)";
    return "var(--green)";
  };

  const getDecisionBackground = (decision: RetentionIntervention["decision"]) => {
    if (decision === "Kill") return "rgba(224,74,74,0.08)";
    if (decision === "Test" || decision === "Optimize") return "rgba(255,167,38,0.08)";
    if (decision === "Maintain") return "rgba(74,122,224,0.08)";
    return "rgba(54,179,126,0.08)";
  };

  const getCprcColor = (costPerUser: number) => {
    if (costPerUser <= 1) return "var(--green)";
    if (costPerUser <= 10) return "var(--blue)";
    if (costPerUser <= 50) return "var(--amber)";
    return "var(--red)";
  };

  return (
    <div
      className="mb-6 rounded-2xl border bg-white p-7"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="mb-4">
        <h3
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--neutral-900)",
            marginBottom: 4,
          }}
        >
          Retention & reactivation
        </h3>
        <p style={{ fontSize: "13px", color: "var(--neutral-500)" }}>
          What does it cost to retain and recover customers — and where is spend most efficient?
        </p>
      </div>

      <div
        className="mb-5 grid grid-cols-5 gap-4 rounded-lg p-4"
        style={{
          backgroundColor: "var(--neutral-50)",
          borderTop: "1.5px solid var(--border)",
          borderBottom: "1.5px solid var(--border)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            BLENDED CpRC
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--neutral-900)",
                fontFamily: "var(--font-mono)",
              }}
            >
              $8.40
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              −12%
            </span>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            NURTURE SPEND
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--neutral-900)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ${(TALK_RETENTION_TOTALS.nurtureSpend / 1000).toFixed(1)}K
            </span>
            <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
              ${(TALK_RETENTION_TOTALS.nurtureArr / 1000).toFixed(0)}K protected
            </span>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            REACTIVATION SPEND
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--neutral-900)",
                fontFamily: "var(--font-mono)",
              }}
            >
              ${(TALK_RETENTION_TOTALS.reactivationSpend / 1000).toFixed(1)}K
            </span>
            <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
              ${(TALK_RETENTION_TOTALS.reactivationArr / 1000).toFixed(0)}K recovered
            </span>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            NET REVENUE RETENTION
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--amber)",
                fontFamily: "var(--font-mono)",
              }}
            >
              74%
            </span>
            <span style={{ fontSize: "11px", color: "var(--neutral-400)", fontFamily: "var(--font-mono)" }}>
              90–110%
            </span>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 4,
            }}
          >
            BLENDED ROI
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--green)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {(TALK_RETENTION_TOTALS.totalArrProtected / TALK_RETENTION_TOTALS.totalRetentionSpend).toFixed(1)}×
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-2">
          {(["All", "Nurture", "Reactivation"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="rounded-lg px-4 py-2 transition-all"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: viewMode === mode ? "var(--purple)" : "transparent",
                color: viewMode === mode ? "white" : "var(--neutral-500)",
                border: viewMode === mode ? "none" : "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>Sort:</span>
          {[
            { key: "efficiency", label: "Efficiency" },
            { key: "lift", label: "Lift" },
            { key: "cost", label: "Cost" },
            { key: "arr", label: "ARR" },
          ].map((sortOption) => (
            <button
              key={sortOption.key}
              onClick={() => setSortBy(sortOption.key as SortMode)}
              className="rounded px-2.5 py-1"
              style={{
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: sortBy === sortOption.key ? "var(--neutral-100)" : "transparent",
                color: sortBy === sortOption.key ? "var(--neutral-900)" : "var(--neutral-500)",
                cursor: "pointer",
                border: "none",
              }}
            >
              {sortOption.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex items-center gap-3 px-3">
        <div style={{ width: "200px" }} />
        <div className="flex-1" />
        <div className="flex items-center gap-4 pr-2">
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              width: "55px",
              textAlign: "right",
            }}
          >
            LIFT
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              width: "55px",
              textAlign: "right",
            }}
          >
            CpRC
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              width: "65px",
              textAlign: "right",
            }}
          >
            ARR PROT.
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--neutral-500)",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              width: "55px",
              textAlign: "right",
            }}
          >
            DECISION
          </div>
        </div>
      </div>

      <style jsx global>{`
        .lavender-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .lavender-scroll::-webkit-scrollbar-track {
          background: rgba(124, 92, 252, 0.04);
          border-radius: 3px;
        }

        .lavender-scroll::-webkit-scrollbar-thumb {
          background: rgba(124, 92, 252, 0.18);
          border-radius: 3px;
        }

        .lavender-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 92, 252, 0.35);
        }
      `}</style>

      <div className="relative mb-5">
        <div
          className="lavender-scroll space-y-2 overflow-y-auto pr-1"
          style={{
            maxHeight: "372px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(124,92,252,0.2) rgba(124,92,252,0.04)",
          }}
        >
          {sorted.map((item) => {
            const efficiency =
              item.costPerUser === 0 ? 100 : Math.min((item.lift / item.costPerUser) * 2, 100);
            const isSelected = selectedItem?.name === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() => setSelectedItem(isSelected ? null : item)}
                  className="w-full rounded-lg border p-3 transition-all hover:bg-gray-50"
                  style={{
                    borderColor: isSelected ? item.color : "var(--border)",
                    backgroundColor: isSelected ? `${item.color}04` : "white",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: "200px" }}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "var(--neutral-900)",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="ml-4 mt-1 flex items-center gap-2">
                        <span
                          className="rounded px-1.5 py-0.5"
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.3px",
                            backgroundColor:
                              item.category === "Nurture"
                                ? "rgba(124,92,252,0.08)"
                                : "rgba(54,179,126,0.08)",
                            color:
                              item.category === "Nurture" ? "var(--purple)" : "var(--green)",
                          }}
                        >
                          {item.category.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--neutral-400)" }}>
                          {item.stage} · {item.channel}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div
                        className="relative h-6 overflow-hidden rounded-lg"
                        style={{ backgroundColor: "var(--neutral-100)" }}
                      >
                        <div
                          className="absolute inset-y-0 left-0 rounded-lg"
                          style={{
                            width: `${efficiency}%`,
                            background: `linear-gradient(90deg, ${item.color} 0%, ${item.color}80 100%)`,
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pr-2">
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--green)",
                          fontFamily: "var(--font-mono)",
                          width: "55px",
                          textAlign: "right",
                        }}
                      >
                        +{item.lift}%
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: getCprcColor(item.costPerUser),
                          fontFamily: "var(--font-mono)",
                          width: "55px",
                          textAlign: "right",
                        }}
                      >
                        {item.costPerUser === 0
                          ? "$0"
                          : `$${item.costPerUser < 1 ? item.costPerUser.toFixed(2) : item.costPerUser.toFixed(0)}`}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--neutral-900)",
                          fontFamily: "var(--font-mono)",
                          width: "65px",
                          textAlign: "right",
                        }}
                      >
                        ${(item.arrProtected / 1000).toFixed(0)}K
                      </span>
                      <span
                        className="rounded px-2 py-0.5"
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.3px",
                          width: "55px",
                          textAlign: "center",
                          backgroundColor: getDecisionBackground(item.decision),
                          color: getDecisionColor(item.decision),
                        }}
                      >
                        {item.decision === "Best efficiency" ? "BEST" : item.decision.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </button>

                {isSelected && (
                  <div
                    className="mt-2 rounded-lg border p-4"
                    style={{
                      borderColor: item.color,
                      borderWidth: "1px",
                      backgroundColor: `${item.color}04`,
                    }}
                  >
                    <div className="mb-3 grid grid-cols-4 gap-4">
                      <div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          REACH
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "var(--neutral-900)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {item.reach.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          TOTAL SPEND
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "var(--neutral-900)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          ${item.totalSpend < 1000 ? item.totalSpend : `${(item.totalSpend / 1000).toFixed(1)}K`}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          COST PER USER
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: getCprcColor(item.costPerUser),
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          ${item.costPerUser < 1 ? item.costPerUser.toFixed(2) : item.costPerUser.toFixed(0)}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          ROI
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "var(--green)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {item.totalSpend === 0 ? "∞" : `${(item.arrProtected / item.totalSpend).toFixed(1)}×`}
                        </div>
                      </div>
                    </div>

                    {item.winRate && (
                      <div
                        className="flex items-center gap-4 pt-3"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontSize: "10px", color: "var(--neutral-500)", fontWeight: 600 }}>
                            WIN RATE
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "var(--neutral-900)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {item.winRate}%
                          </span>
                        </div>
                        <div style={{ width: "1px", height: "14px", backgroundColor: "var(--border)" }} />
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontSize: "10px", color: "var(--neutral-500)", fontWeight: 600 }}>
                            RE-CHURN
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: item.reChurn && item.reChurn > 20 ? "var(--red)" : "var(--green)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {item.reChurn}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {sorted.length > 6 && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-10"
            style={{ background: "linear-gradient(transparent, rgba(255,255,255,0.9))" }}
          />
        )}
      </div>

      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "var(--neutral-50)" }}>
        <p style={{ fontSize: "13px", color: "var(--neutral-700)", lineHeight: "1.6" }}>
          <strong>
            Nurture programs protect ${(TALK_RETENTION_TOTALS.nurtureArr / 1000).toFixed(0)}K ARR
            at ${(TALK_RETENTION_TOTALS.nurtureSpend / 1000).toFixed(1)}K spend
          </strong>{" "}
          — {(TALK_RETENTION_TOTALS.nurtureArr / TALK_RETENTION_TOTALS.nurtureSpend).toFixed(0)}×
          ROI. Reactivation recovers ${(TALK_RETENTION_TOTALS.reactivationArr / 1000).toFixed(0)}K
          at ${(TALK_RETENTION_TOTALS.reactivationSpend / 1000).toFixed(1)}K —{" "}
          {(TALK_RETENTION_TOTALS.reactivationArr / TALK_RETENTION_TOTALS.reactivationSpend).toFixed(1)}×
          ROI. <strong style={{ color: "var(--red)" }}>Kill discount offers</strong> — 42%
          re-churn destroys unit economics.{" "}
          <strong style={{ color: "var(--green)" }}>Scale in-app tooltips</strong> — best
          efficiency at $0.20/user.
        </p>
      </div>

      <div
        className="mb-4 rounded-lg px-4 py-2.5"
        style={{
          backgroundColor: "rgba(54,179,126,0.04)",
          border: "1px solid rgba(54,179,126,0.12)",
        }}
      >
        <p style={{ fontSize: "12px", color: "var(--neutral-700)", textAlign: "center" }}>
          Reactivated users contribute <strong style={{ color: "var(--green)" }}>18%</strong> of
          retained revenue · Nurture programs prevent{" "}
          <strong style={{ color: "var(--purple)" }}>3.2×</strong> more churn than reactivation
          recovers
        </p>
      </div>

      <YourNextMoveAccordion count={3} subtitle="3 interventions prioritized by AgentIQ">
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE BEST EFFICIENCY"
          title="In-app tooltips & feature discovery"
          description="$0.15–$0.20/user, +32–46% lift, protecting $116K ARR. Highest ROI across both nurture and reactivation. Deploy to all Activated and returning Lapsed users."
        />
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE HIGH-IMPACT"
          title="QBR for high-CLV Drifting accounts"
          description="+35% lift, $95K ARR protected. Highest absolute impact but $120/user cost. Target top 180 accounts by CLV only — +$60K ARR potential."
        />
        <ActionCard
          tagColor="var(--red)"
          tagBg="rgba(224,74,74,0.15)"
          tag="KILL"
          title="Discount reactivation offers"
          description="$35/user, 30% win rate, 42% re-churn. Negative unit economics — every $1 spent recovers $0.86 that churns again. Redirect budget to behavioral email triggers (52% win, 16% re-churn)."
        />
      </YourNextMoveAccordion>
    </div>
  );
}
