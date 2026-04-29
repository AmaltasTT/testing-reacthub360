"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import {
  TALK_ADVOCACY_KPI_DATA,
  TALK_KPI_DATA,
  type TalkKpiDatum,
} from "@/lib/talk-stats/data";

type TalkView = "retention" | "advocacy";

interface KpiCardsProps {
  activeView: TalkView;
  period: string;
  onOpenAgentIQ?: (prompt: string) => void;
}

function metricPrompt(kpi: TalkKpiDatum, activeView: TalkView) {
  const goal = activeView === "advocacy" ? "advocacy" : "retention";
  return `Explain the current ${kpi.label} signal and tell me what to do next to improve ${goal}.`;
}

export function KpiCards({ activeView, period, onOpenAgentIQ }: KpiCardsProps) {
  const [trendsExpanded, setTrendsExpanded] = useState(false);

  const data = useMemo(
    () => (activeView === "advocacy" ? TALK_ADVOCACY_KPI_DATA : TALK_KPI_DATA),
    [activeView]
  );

  return (
    <div className="mb-6">
      <div className="grid grid-cols-4 gap-4">
        {data.map((kpi) => {
          const isOmtm = kpi.badge === "OMTM";
          const trendColor =
            kpi.trend === "up" || kpi.trend === "down-good" ? "var(--green)" : "var(--red)";
          const statusColor =
            kpi.status === "On Track"
              ? "var(--blue)"
              : kpi.status === "Accelerating" ||
                  kpi.status === "Improving" ||
                  kpi.status === "Efficient" ||
                  kpi.status === "Above Benchmark" ||
                  kpi.status === "Recovering"
                ? "var(--green)"
                : "var(--red)";

          const historicalCount =
            kpi.trendData.length >= 3 ? kpi.trendData.length - 2 : kpi.trendData.length;
          const chartData = kpi.trendData.map((point, index) => ({
            value: point.value,
            hist: index < historicalCount ? point.value : undefined,
            forecastLine: index >= historicalCount - 1 ? point.value : undefined,
          }));

          const currentNumber = Number.parseFloat(kpi.value.replace(/[$%,]/g, ""));
          const targetNumber = kpi.targetValue
            ? Number.parseFloat(kpi.targetValue.replace(/[$%,]/g, ""))
            : null;
          const progressPercent =
            targetNumber && targetNumber > 0
              ? Math.min((currentNumber / targetNumber) * 100, 100)
              : null;

          return (
            <div
              key={`${activeView}-${kpi.label}`}
              className="overflow-hidden rounded-2xl border bg-white"
              style={{
                borderColor: isOmtm ? "var(--purple)" : "var(--border)",
                borderWidth: isOmtm ? "1.5px" : "1px",
                boxShadow: isOmtm
                  ? "0 4px 16px rgba(124,92,252,0.12), 0 1px 3px rgba(124,92,252,0.08)"
                  : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {isOmtm && (
                <div
                  style={{
                    height: "3px",
                    background: "linear-gradient(90deg, #7C5CFC, #9B7FFF)",
                  }}
                />
              )}

              <div className="p-5 pb-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded px-2 py-0.5"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        backgroundColor: isOmtm
                          ? activeView === "advocacy"
                            ? "var(--green)"
                            : "var(--purple)"
                          : "rgba(124,92,252,0.08)",
                        color: isOmtm ? "white" : "var(--purple)",
                      }}
                    >
                      {kpi.badge}
                    </span>
                    <span
                      style={{ fontSize: "12px", color: "var(--neutral-500)", fontWeight: 500 }}
                    >
                      {kpi.shortLabel}
                    </span>
                  </div>
                  <span
                    className="rounded px-2 py-0.5"
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      backgroundColor: `${statusColor}12`,
                      color: statusColor,
                    }}
                  >
                    {kpi.status}
                  </span>
                </div>

                <div className="mb-1 flex items-baseline gap-2.5">
                  <span
                    style={{
                      fontSize: isOmtm ? "38px" : "34px",
                      fontWeight: 700,
                      color: "var(--neutral-900)",
                      fontFamily: "var(--font-mono)",
                      lineHeight: 1,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {kpi.value}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: trendColor,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {kpi.delta}
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "var(--neutral-500)", marginBottom: 12 }}>
                  {kpi.label}
                </div>

                <div style={{ height: "48px", marginBottom: 12 }}>
                  <ResponsiveContainer width="100%" height={48}>
                    <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                      <YAxis hide domain={["dataMin - 3", "dataMax + 3"]} />
                      <Line
                        type="monotone"
                        dataKey="hist"
                        stroke={trendColor}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive
                        animationDuration={850}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecastLine"
                        stroke={trendColor}
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                        strokeOpacity={0.45}
                        dot={false}
                        isAnimationActive
                        animationDuration={850}
                        connectNulls
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3" style={{ borderTop: "1px solid var(--border)" }}>
                  {targetNumber && progressPercent !== null ? (
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          TARGET
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--neutral-900)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {kpi.targetValue}
                        </span>
                      </div>
                      <div
                        className="relative h-1.5 overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--neutral-100)" }}
                      >
                        <div
                          className="absolute h-full rounded-full"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor:
                              progressPercent >= 90
                                ? "var(--green)"
                                : progressPercent >= 70
                                  ? "var(--blue)"
                                  : "var(--amber)",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            width: "14px",
                            height: "1.5px",
                            backgroundImage: `repeating-linear-gradient(90deg, ${trendColor} 0px, ${trendColor} 3px, transparent 3px, transparent 6px)`,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "10px",
                            color: "var(--neutral-500)",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {kpi.forecastLabel}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: trendColor,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {kpi.forecastValue}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--neutral-500)",
                      marginTop: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {kpi.insight}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--neutral-300)",
                      marginTop: 4,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {kpi.benchmark}
                  </div>

                  <button
                    onClick={() => setTrendsExpanded((current) => !current)}
                    className="mt-3 flex items-center gap-1"
                    style={{
                      border: "none",
                      background: "none",
                      color: "var(--purple)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    {trendsExpanded ? "Hide trend" : "Show trend"}
                    <span
                      style={{
                        display: "inline-block",
                        transform: trendsExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      ▾
                    </span>
                  </button>

                  {trendsExpanded && (
                    <div
                      className="mt-4 rounded-xl border p-4"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--neutral-50)",
                      }}
                    >
                      <div style={{ height: 148, marginBottom: 10 }}>
                        <ResponsiveContainer width="100%" height={148}>
                          <AreaChart
                            key={`${activeView}-${period}-${kpi.label}-expanded`}
                            data={chartData}
                            margin={{ top: 10, right: 4, bottom: 0, left: 0 }}
                          >
                            <defs>
                              <linearGradient id={`kpi-grad-${kpi.shortLabel}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={trendColor} stopOpacity={0.25} />
                                <stop offset="100%" stopColor={trendColor} stopOpacity={0.03} />
                              </linearGradient>
                            </defs>
                            <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                            <Area
                              type="monotone"
                              dataKey="hist"
                              stroke={trendColor}
                              strokeWidth={2}
                              fill={`url(#kpi-grad-${kpi.shortLabel})`}
                              isAnimationActive
                              animationDuration={950}
                              dot={false}
                              connectNulls={false}
                            />
                            <Area
                              type="monotone"
                              dataKey="forecastLine"
                              stroke={trendColor}
                              strokeWidth={1.8}
                              strokeDasharray="5 4"
                              fill="none"
                              isAnimationActive
                              animationDuration={950}
                              dot={false}
                              connectNulls
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <button
                        onClick={() => onOpenAgentIQ?.(metricPrompt(kpi, activeView))}
                        style={{
                          border: "none",
                          background: "none",
                          color: "var(--purple)",
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 700,
                          padding: 0,
                        }}
                      >
                        Explore forecast →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
