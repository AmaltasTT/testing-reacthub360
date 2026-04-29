"use client";

import { useState } from "react";
import { TALK_RETENTION_CHANNELS } from "@/lib/talk-stats/data";
import { ActionCard } from "../shared/ActionCard";
import { YourNextMoveAccordion } from "../shared/YourNextMoveAccordion";

type ViewMode = "CRR" | "CLV" | "Efficiency";

export function RetentionByChannel() {
  const [viewMode, setViewMode] = useState<ViewMode>("CRR");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const sortedData = [...TALK_RETENTION_CHANNELS].sort((left, right) => {
    if (viewMode === "CRR") return right.crr - left.crr;
    if (viewMode === "CLV") return right.clv - left.clv;
    return right.clv / right.cac - left.clv / left.cac;
  });

  const getBarValue = (item: (typeof TALK_RETENTION_CHANNELS)[number]) => {
    if (viewMode === "CRR") return item.crr;
    if (viewMode === "CLV") return item.clv;
    return Math.round((item.clv / item.cac) * 10) / 10;
  };

  const getSecondaryValue = (item: (typeof TALK_RETENTION_CHANNELS)[number]) => {
    if (viewMode === "CRR") return `$${item.clv}`;
    if (viewMode === "CLV") return `${item.crr}%`;
    return `CAC $${item.cac}`;
  };

  const getBarColor = (item: (typeof TALK_RETENTION_CHANNELS)[number]) => {
    if (viewMode === "Efficiency") {
      const ratio = item.clv / item.cac;
      if (ratio >= 10) return "var(--green)";
      if (ratio >= 5) return "var(--purple)";
      return "var(--red)";
    }

    return "var(--purple)";
  };

  const selectedData = sortedData.find((item) => item.channel === selectedChannel);

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
          Retention by acquisition channel
        </h3>
        <p style={{ fontSize: "13px", color: "var(--neutral-500)" }}>
          Which channels bring customers who stay and grow in value?
        </p>
      </div>

      <div
        className="mb-4 grid grid-cols-4 gap-4 rounded-lg p-4"
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
            WEIGHTED AVG CAC
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
              $42
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              −8%
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
            WEIGHTED AVG CLV
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
              $522
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              +14%
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
            ARR RETAINED
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
              $7.57M
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              +11%
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
            ARR CHURNED
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--red)",
                fontFamily: "var(--font-mono)",
              }}
            >
              $2.86M
            </span>
            <span style={{ fontSize: "12px", color: "var(--neutral-500)" }}>Revenue lost</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {(["CRR", "CLV", "Efficiency"] as const).map((mode) => (
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
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mb-4 space-y-2">
        {sortedData.map((item) => (
          <div key={item.channel}>
            <button
              onClick={() =>
                setSelectedChannel(selectedChannel === item.channel ? null : item.channel)
              }
              className="w-full rounded-lg border p-3 transition-all hover:bg-gray-50"
              style={{
                borderColor:
                  selectedChannel === item.channel ? "var(--purple)" : "var(--border)",
                backgroundColor:
                  selectedChannel === item.channel
                    ? "rgba(124,92,252,0.04)"
                    : "white",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-32 text-left">
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--neutral-900)",
                    }}
                  >
                    {item.channel}
                  </span>
                  <div style={{ fontSize: "10px", color: "var(--neutral-400)", marginTop: 1 }}>
                    {item.bestSegment !== "None" ? item.bestSegment : "No strong segment"}
                  </div>
                </div>
                <div className="flex-1">
                  <div
                    className="relative h-7 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--neutral-100)" }}
                  >
                    <div
                      className="absolute flex h-full items-center justify-center rounded-full"
                      style={{
                        width: `${
                          viewMode === "Efficiency"
                            ? Math.min((item.clv / item.cac / 45) * 100, 100)
                            : (getBarValue(item) / (viewMode === "CRR" ? 100 : 700)) * 100
                        }%`,
                        backgroundColor: getBarColor(item),
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "white",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {viewMode === "CLV"
                          ? `$${getBarValue(item)}`
                          : viewMode === "Efficiency"
                            ? `${getBarValue(item)}×`
                            : `${getBarValue(item)}%`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--neutral-700)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {getSecondaryValue(item)}
                  </span>
                </div>
                <div className="w-16">
                  <span
                    className="rounded px-2 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor:
                        item.signal === "SCALE"
                          ? "var(--green)"
                          : item.signal === "WATCH"
                            ? "var(--amber)"
                            : "var(--red)",
                      color: "white",
                      fontSize: "11px",
                    }}
                  >
                    {item.move}
                  </span>
                </div>
              </div>
            </button>

            {selectedChannel === item.channel && selectedData && (
              <div
                className="mt-2 rounded-lg border p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--neutral-50)" }}
              >
                <div className="mb-4 grid grid-cols-5 gap-4">
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--neutral-500)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      CRR
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {selectedData.crr}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--neutral-500)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      CAC
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${selectedData.cac}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--neutral-500)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      CLV
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${selectedData.clv}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--neutral-500)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      LTV/CAC
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: getBarColor(selectedData),
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {(selectedData.clv / selectedData.cac).toFixed(1)}×
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--neutral-500)",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      ARR CHURNED
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "var(--red)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${(selectedData.churned / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "var(--neutral-50)" }}>
        <p style={{ fontSize: "13px", color: "var(--neutral-700)" }}>
          {viewMode === "CRR" && (
            <>
              <strong>Google Search leads at 82%</strong> — 34 pts above Outbrain. Focus
              retention efforts on high-CRR channels.
            </>
          )}
          {viewMode === "CLV" && (
            <>
              <strong>Google Search and LinkedIn customers worth 2× more</strong> — $622 vs
              $256 avg. Prioritize these channels.
            </>
          )}
          {viewMode === "Efficiency" && (
            <>
              <strong>Email Nurture returns 40.5× CLV per CAC dollar</strong> — lowest
              acquisition cost ($12) with strong CLV ($486). Google Search close behind at
              16.4×. Redirect spend from low-efficiency channels.
            </>
          )}
        </p>
      </div>

      <YourNextMoveAccordion count={3} subtitle="3 channels prioritized by AgentIQ">
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE HIGH-RETENTION"
          title="Google Search acquisition"
          description='82% CRR, $622 CLV, 296× LTV/CAC. Highest retention channel. Increase budget by 40%, optimize for "retention intent" queries.'
        />
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE EFFICIENCY"
          title="Email Nurture spend"
          description="74% CRR, $486 CLV, 238× LTV/CAC. Best efficiency at scale. Double nurture sequences, add behavioral triggers."
        />
        <ActionCard
          tagColor="var(--red)"
          tagBg="rgba(224,74,74,0.15)"
          tag="REDIRECT OR CUT"
          title="Pause Instagram Ads & Outbrain"
          description="52% and 48% CRR. High churn risk, low retention quality. Redirect budget to Google Search and Email Nurture."
        />
      </YourNextMoveAccordion>
    </div>
  );
}
