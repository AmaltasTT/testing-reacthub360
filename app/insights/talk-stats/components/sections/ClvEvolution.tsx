"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  TALK_ACV_COHORTS,
  TALK_CLV_FIX_LEAKS,
  TALK_CLV_SCALE_DRIVERS,
  TALK_CLV_TIERS,
  TALK_PERIOD_CONFIG,
  generateTalkClvTrendData,
  type AcvCohort,
  type TalkPeriodKey,
} from "@/lib/talk-stats/data";
import { ActionCard } from "../shared/ActionCard";
import { YourNextMoveAccordion } from "../shared/YourNextMoveAccordion";

interface ClvEvolutionProps {
  period: string;
}

export function ClvEvolution({ period }: ClvEvolutionProps) {
  const [selectedTier, setSelectedTier] = useState(TALK_CLV_TIERS[1]);
  const [viewMode, setViewMode] = useState<"scale" | "fix">("scale");
  const [expandedDriver, setExpandedDriver] = useState<number | null>(null);
  const [expandedLeak, setExpandedLeak] = useState<number | null>(null);
  const [chartMode, setChartMode] = useState<"tier" | "cohort">("tier");
  const [selectedAcv, setSelectedAcv] = useState<AcvCohort | null>(null);

  const periodKey =
    (Object.keys(TALK_PERIOD_CONFIG).includes(period) ? period : "30d") as TalkPeriodKey;
  const config = TALK_PERIOD_CONFIG[periodKey];
  const trendData = generateTalkClvTrendData(selectedTier, periodKey);

  const activeAcv = selectedAcv ?? TALK_ACV_COHORTS[1];
  const acvTrendData = generateTalkClvTrendData(
    { clv: activeAcv.clv, name: activeAcv.label },
    periodKey
  );
  const acvForecastEnd = acvTrendData[acvTrendData.length - 1]?.forecastLine ?? activeAcv.clv;
  const forecastEndValue =
    trendData[trendData.length - 1]?.forecastLine ?? selectedTier.clv;

  return (
    <div
      className="mb-6 rounded-2xl border bg-white p-7"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              marginBottom: 4,
            }}
          >
            CLV evolution
          </h3>
          <p style={{ fontSize: "13px", color: "var(--neutral-500)" }}>
            How is customer lifetime value trending across segments — and where is it heading?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => setChartMode("tier")}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                backgroundColor: chartMode === "tier" ? "var(--purple)" : "white",
                color: chartMode === "tier" ? "white" : "var(--neutral-500)",
                border: "none",
                cursor: "pointer",
              }}
            >
              By behavior
            </button>
            <button
              onClick={() => setChartMode("cohort")}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "4px 10px",
                backgroundColor: chartMode === "cohort" ? "var(--purple)" : "white",
                color: chartMode === "cohort" ? "white" : "var(--neutral-500)",
                border: "none",
                cursor: "pointer",
                borderLeft: "1px solid var(--border)",
              }}
            >
              By ACV
            </button>
          </div>
          <div
            className="rounded-md px-2.5 py-1"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              backgroundColor: "var(--neutral-50)",
              color: "var(--neutral-700)",
              border: "1px solid var(--border)",
            }}
          >
            {period} · {config.intervalDays === 1 ? "daily" : `${config.intervalDays}-day intervals`}
          </div>
        </div>
      </div>

      <div
        className="mb-4 grid grid-cols-5 gap-4 rounded-lg p-4"
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
            AVERAGE CLV
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
            }}
          >
            $486
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
            POTENTIAL CLV
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
            }}
          >
            $669
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
            CLV GAP
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--red)",
              fontFamily: "var(--font-mono)",
            }}
          >
            $183
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
            EXPANSION RATE
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--green)",
                fontFamily: "var(--font-mono)",
              }}
            >
              8.2%
            </span>
            <span style={{ fontSize: "11px", color: "var(--neutral-400)" }}>of base</span>
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
            CONTRACTION RATE
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
              5.6%
            </span>
            <span style={{ fontSize: "11px", color: "var(--neutral-400)" }}>of base</span>
          </div>
        </div>
      </div>

      {chartMode === "tier" && (
        <>
          <div className="mb-4">
            <div
              className="relative h-8 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--neutral-100)" }}
            >
              {TALK_CLV_TIERS.map((tier, index) => {
                const previous = TALK_CLV_TIERS.slice(0, index).reduce(
                  (sum, current) => sum + current.percentage,
                  0
                );
                return (
                  <div
                    key={tier.name}
                    className="absolute h-full"
                    style={{
                      left: `${previous}%`,
                      width: `${tier.percentage}%`,
                      backgroundColor: tier.color,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex gap-2">
              {TALK_CLV_TIERS.map((tier) => (
                <button
                  key={tier.name}
                  onClick={() => setSelectedTier(tier)}
                  className="flex-1 rounded-lg border p-3 transition-all"
                  style={{
                    borderColor:
                      selectedTier.name === tier.name ? tier.color : "var(--border)",
                    backgroundColor:
                      selectedTier.name === tier.name ? `${tier.color}08` : "white",
                    borderWidth: selectedTier.name === tier.name ? "2px" : "1px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: tier.color,
                      marginBottom: 2,
                    }}
                  >
                    {tier.name}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {tier.percentage}%
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: tier.trend.startsWith("+") ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {tier.trend}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--neutral-500)", marginTop: 2 }}>
                    ${tier.clv} CLV · {tier.customers} customers
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: tier.color,
                      marginTop: 4,
                      opacity: 0.8,
                    }}
                  >
                    → {tier.microAction}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "256px" }} className="mb-2">
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={trendData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id={`grad-${selectedTier.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={selectedTier.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={selectedTier.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--neutral-500)" }}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--neutral-500)" }}
                  tickFormatter={(value) => `$${Math.round(value as number)}`}
                  domain={["dataMin - 15", "dataMax + 15"]}
                  width={52}
                />
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke={selectedTier.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-${selectedTier.name})`}
                  isAnimationActive={false}
                  connectNulls={false}
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecastLine"
                  stroke={selectedTier.color}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  strokeOpacity={0.5}
                  fill="none"
                  isAnimationActive={false}
                  connectNulls
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-6 flex items-center justify-between px-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundColor: selectedTier.color,
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                  Historical
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundImage: `repeating-linear-gradient(90deg, ${selectedTier.color} 0px, ${selectedTier.color} 4px, transparent 4px, transparent 8px)`,
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                  Forecast
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundColor: "#E2E8F0",
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #E2E8F0 0px, #E2E8F0 3px, transparent 3px, transparent 6px)",
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                  Prior period
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>Projected:</span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color:
                    forecastEndValue >= selectedTier.clv ? "var(--green)" : "var(--red)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ${Math.round(forecastEndValue)}
              </span>
              <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                in {config.forecastTicks * config.intervalDays}d
              </span>
            </div>
          </div>
        </>
      )}

      {chartMode === "cohort" && (
        <>
          <div className="mb-4">
            <div className="mb-4 grid grid-cols-4 gap-4">
              {TALK_ACV_COHORTS.map((cohort) => (
                <button
                  key={cohort.band}
                  onClick={() => setSelectedAcv(cohort)}
                  className="rounded-lg border p-4 text-left transition-all"
                  style={{
                    borderColor:
                      (selectedAcv ?? TALK_ACV_COHORTS[1]).label === cohort.label
                        ? cohort.color
                        : "var(--border)",
                    borderWidth:
                      (selectedAcv ?? TALK_ACV_COHORTS[1]).label === cohort.label
                        ? "2px"
                        : "1px",
                    borderTopWidth: "3px",
                    borderTopColor: cohort.color,
                    backgroundColor:
                      (selectedAcv ?? TALK_ACV_COHORTS[1]).label === cohort.label
                        ? `${cohort.color}06`
                        : "white",
                  }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: cohort.color }}>
                        {cohort.label}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--neutral-400)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {cohort.band} ACV
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--neutral-400)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {cohort.customers.toLocaleString()}
                    </div>
                  </div>
                  <div className="mb-3 grid grid-cols-2 gap-3">
                    <div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "var(--neutral-500)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        CLV
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color: "var(--neutral-900)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        ${cohort.clv}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "var(--neutral-500)",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: 2,
                        }}
                      >
                        RETENTION
                      </div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 700,
                          color:
                            cohort.retention >= 80
                              ? "var(--green)"
                              : cohort.retention >= 65
                                ? "var(--purple)"
                                : cohort.retention >= 50
                                  ? "var(--amber)"
                                  : "var(--red)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {cohort.retention}%
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} style={{ color: "var(--green)" }} />
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--green)" }}>
                        {cohort.expanding}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown size={10} style={{ color: "var(--red)" }} />
                      <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--red)" }}>
                        {cohort.churnRate}%
                      </span>
                    </div>
                  </div>
                  <div
                    className="relative h-1.5 overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--neutral-100)" }}
                  >
                    <div
                      className="absolute h-full rounded-full"
                      style={{ width: `${cohort.retention}%`, backgroundColor: cohort.color }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "256px" }} className="mb-2">
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={acvTrendData} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient
                    id={`grad-acv-${activeAcv.label}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={activeAcv.color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={activeAcv.color} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--neutral-500)" }}
                  interval={0}
                />
                <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
                <Area
                  type="monotone"
                  dataKey="historical"
                  stroke={activeAcv.color}
                  strokeWidth={2.5}
                  fill={`url(#grad-acv-${activeAcv.label})`}
                  dot={false}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecastLine"
                  stroke={activeAcv.color}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  fill="none"
                  dot={false}
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundColor: activeAcv.color,
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                  Historical
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundImage: `repeating-linear-gradient(90deg, ${activeAcv.color} 0px, ${activeAcv.color} 4px, transparent 4px, transparent 8px)`,
                  }}
                />
                <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                  Forecast
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>Projected:</span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: acvForecastEnd >= activeAcv.clv ? "var(--green)" : "var(--red)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ${Math.round(acvForecastEnd)}
              </span>
              <span style={{ fontSize: "11px", color: "var(--neutral-500)" }}>
                in {config.forecastTicks * config.intervalDays}d
              </span>
            </div>
          </div>

          <div
            className="mb-4 rounded-lg p-3"
            style={{
              backgroundColor: "rgba(124,92,252,0.04)",
              border: "1px solid rgba(124,92,252,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "var(--neutral-700)",
                textAlign: "center",
              }}
            >
              Enterprise ACV ($1.2K+) retains at{" "}
              <strong style={{ color: "var(--green)" }}>94%</strong> with 32% expanding —
              protect at all costs. Starter ACV ($0-$300) churns at{" "}
              <strong style={{ color: "var(--red)" }}>48%</strong> with only 4% expanding —
              focus on upgrading to Growth tier before retention efforts.
            </p>
          </div>
        </>
      )}

      <div className="mb-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setViewMode("scale")}
            className="flex-1 rounded-lg px-4 py-2 transition-all"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor:
                viewMode === "scale" ? "rgba(54,179,126,0.1)" : "transparent",
              color: viewMode === "scale" ? "var(--green)" : "var(--neutral-500)",
              border: `1px solid ${
                viewMode === "scale" ? "var(--green)" : "var(--border)"
              }`,
            }}
          >
            Scale — what drives CLV up
          </button>
          <button
            onClick={() => setViewMode("fix")}
            className="flex-1 rounded-lg px-4 py-2 transition-all"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: viewMode === "fix" ? "rgba(224,74,74,0.1)" : "transparent",
              color: viewMode === "fix" ? "var(--red)" : "var(--neutral-500)",
              border: `1px solid ${viewMode === "fix" ? "var(--red)" : "var(--border)"}`,
            }}
          >
            Fix — where CLV leaks
          </button>
        </div>

        {viewMode === "scale" && (
          <div className="space-y-2">
            {TALK_CLV_SCALE_DRIVERS.map((driver, index) => (
              <div key={index}>
                <button
                  onClick={() => setExpandedDriver(expandedDriver === index ? null : index)}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all hover:bg-gray-50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                      }}
                    >
                      {driver.lever}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--green)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {driver.impact}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--neutral-500)" }}>
                      Current: {driver.current}
                    </span>
                  </div>
                  {expandedDriver === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedDriver === index && (
                  <div
                    className="mt-2 rounded-lg p-4"
                    style={{
                      backgroundColor: "var(--neutral-50)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          GAP TO BENCHMARK
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--neutral-900)" }}>
                          {driver.benchmark} (vs {driver.current})
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
                          ACTION
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--neutral-700)" }}>
                          Implement engagement program
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {viewMode === "fix" && (
          <div className="space-y-2">
            {TALK_CLV_FIX_LEAKS.map((leak, index) => (
              <div key={index}>
                <button
                  onClick={() => setExpandedLeak(expandedLeak === index ? null : index)}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all hover:bg-gray-50"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--neutral-900)",
                      }}
                    >
                      {leak.leak}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--neutral-500)" }}>
                      {leak.accounts} accounts
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--red)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${(leak.valueLeaking / 1000).toFixed(0)}K leaking
                    </span>
                  </div>
                  {expandedLeak === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedLeak === index && (
                  <div
                    className="mt-2 rounded-lg p-4"
                    style={{
                      backgroundColor: "rgba(224,74,74,0.05)",
                      border: "1px solid var(--red)",
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--neutral-500)",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          ROOT CAUSE
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--neutral-700)" }}>
                          Low engagement leading to churn
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
                          FIX
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--neutral-700)" }}>
                          Trigger usage decline alerts earlier
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: "var(--neutral-50)" }}>
        <p style={{ fontSize: "13px", color: "var(--neutral-700)" }}>
          <strong>$183 CLV gap identified.</strong> High-Velocity tier accelerating at +2.1%,
          but Declining segment eroding at −3.2%. Expansion rate (8.2%) outpaces contraction
          (5.6%) — net positive, but below the 10%+ needed for NRR &gt;100%. Focus: prevent
          Plateauing → Declining transitions and accelerate upsell in Stable tier.
        </p>
      </div>

      <YourNextMoveAccordion count={4} subtitle="4 levers prioritized by AgentIQ">
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE HIGH-INTENT"
          title="Increase usage frequency"
          description="+$82 CLV. Gap: 2.3×/week → 4.1×/week. Trigger habit-forming prompts, email nudges on usage milestones, gamify core workflows."
        />
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE UPSELL"
          title="Expand to premium tiers"
          description="+$64 CLV. 18% → 32% adoption. Surface premium features in-app, show value prop based on usage patterns, trial unlocks."
        />
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE CROSS-SELL"
          title="Cross-sell adjacent products"
          description="+$46 CLV. 1.2 → 2.4 products. Bundle recommendations, contextual cross-sells at power user milestones."
        />
        <ActionCard
          tagColor="var(--amber)"
          tagBg="rgba(255,167,38,0.15)"
          tag="FIX ONBOARDING"
          title="Reduce time to value"
          description="+$28 CLV. 14 days → 6 days. Simplify first-run, in-app checklists, automated setup assist, early win moments."
        />
      </YourNextMoveAccordion>
    </div>
  );
}
