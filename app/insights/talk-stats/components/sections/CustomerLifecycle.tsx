"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  TALK_LIFECYCLE_FLOWS,
  TALK_LIFECYCLE_STAGES,
  type LifecycleStage,
} from "@/lib/talk-stats/data";
import { ActionCard } from "../shared/ActionCard";
import { YourNextMoveAccordion } from "../shared/YourNextMoveAccordion";

interface AnimatedMetrics {
  returnRate?: number;
  entering?: number;
  progressing?: number;
  lost?: number;
}

export function CustomerLifecycle() {
  const [selectedStage, setSelectedStage] = useState<LifecycleStage | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState<AnimatedMetrics>({});
  const [showForecast, setShowForecast] = useState(true);

  const chartWidth = 1000;
  const chartHeight = 280;
  const marginX = 60;
  const stageCount = 5;
  const spacing = (chartWidth - 2 * marginX) / (stageCount - 1);

  const pctToY = (percentage: number) =>
    chartHeight - 20 - (percentage / 40) * (chartHeight - 60);

  const dataPoints = useMemo(
    () => [
      { x: marginX, y: pctToY(TALK_LIFECYCLE_STAGES[0].percentage), stage: TALK_LIFECYCLE_STAGES[0] },
      {
        x: marginX + spacing,
        y: pctToY(TALK_LIFECYCLE_STAGES[1].percentage),
        stage: TALK_LIFECYCLE_STAGES[1],
      },
      {
        x: marginX + spacing * 2,
        y: pctToY(TALK_LIFECYCLE_STAGES[2].percentage),
        stage: TALK_LIFECYCLE_STAGES[2],
      },
      {
        x: marginX + spacing * 3,
        y: pctToY(TALK_LIFECYCLE_STAGES[3].percentage),
        stage: TALK_LIFECYCLE_STAGES[3],
      },
      {
        x: marginX + spacing * 4,
        y: pctToY(TALK_LIFECYCLE_STAGES[4].percentage),
        stage: TALK_LIFECYCLE_STAGES[4],
      },
    ],
    [spacing]
  );

  const forecastPoints = useMemo(
    () =>
      TALK_LIFECYCLE_STAGES.map((stage, index) => ({
        x: dataPoints[index].x,
        y: pctToY(stage.forecast30d.percentage),
        stage,
      })),
    [dataPoints]
  );

  useEffect(() => {
    if (!selectedStage) return undefined;

    const metrics = {
      returnRate: selectedStage.returnRate,
      entering: selectedStage.entering,
      progressing: selectedStage.progressing,
      lost: selectedStage.lost,
    };

    setAnimatedMetrics({});

    const intervals = Object.entries(metrics).map(([key, target]) => {
      let current = 0;
      const steps = 30;
      const increment = target / steps;

      return window.setInterval(() => {
        current += increment;

        if (current >= target) {
          setAnimatedMetrics((previous) => ({ ...previous, [key]: target }));
        } else {
          setAnimatedMetrics((previous) => ({
            ...previous,
            [key]: Math.floor(current),
          }));
        }
      }, 26);
    });

    const cleanupTimeout = window.setTimeout(() => {
      intervals.forEach((intervalId) => window.clearInterval(intervalId));
    }, 30 * 26 + 50);

    return () => {
      intervals.forEach((intervalId) => window.clearInterval(intervalId));
      window.clearTimeout(cleanupTimeout);
    };
  }, [selectedStage]);

  const handleStageClick = (stage: LifecycleStage) => {
    setSelectedStage(selectedStage?.name === stage.name ? null : stage);
  };

  const getWavePath = () => {
    const points = dataPoints;
    let path = `M 15,${points[0].y + 12}`;
    path += ` Q ${points[0].x - 30},${points[0].y + 6} ${points[0].x},${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      path += ` C ${current.x + (next.x - current.x) * 0.42},${current.y} ${next.x - (next.x - current.x) * 0.42},${next.y} ${next.x},${next.y}`;
    }

    const last = points[points.length - 1];
    path += ` Q ${last.x + 30},${last.y + 6} ${chartWidth - 15},${last.y + 12}`;
    return path;
  };

  const getGhostWavePath = () => {
    const points = dataPoints.map((point) => ({ x: point.x, y: point.y + 6 }));
    let path = `M 15,${points[0].y + 12}`;
    path += ` Q ${points[0].x - 30},${points[0].y + 6} ${points[0].x},${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      path += ` C ${current.x + (next.x - current.x) * 0.42},${current.y} ${next.x - (next.x - current.x) * 0.42},${next.y} ${next.x},${next.y}`;
    }

    const last = points[points.length - 1];
    path += ` Q ${last.x + 30},${last.y + 6} ${chartWidth - 15},${last.y + 12}`;
    return path;
  };

  const getForecastWavePath = () => {
    const points = forecastPoints;
    let path = `M 15,${points[0].y + 12}`;
    path += ` Q ${points[0].x - 30},${points[0].y + 6} ${points[0].x},${points[0].y}`;

    for (let index = 0; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      path += ` C ${current.x + (next.x - current.x) * 0.42},${current.y} ${next.x - (next.x - current.x) * 0.42},${next.y} ${next.x},${next.y}`;
    }

    const last = points[points.length - 1];
    path += ` Q ${last.x + 30},${last.y + 6} ${chartWidth - 15},${last.y + 12}`;
    return path;
  };

  return (
    <div
      className="mb-8 rounded-2xl border bg-white p-8"
      style={{ borderColor: "var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              marginBottom: 6,
            }}
          >
            Customer lifecycle
          </h3>
          <p style={{ fontSize: "13px", color: "var(--neutral-500)" }}>
            How customers enter, stay, fade, and return — powered by behavioral signals
          </p>
        </div>
        <button
          onClick={() => setShowForecast(!showForecast)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: showForecast ? "rgba(124,92,252,0.08)" : "white",
            color: showForecast ? "var(--purple)" : "var(--neutral-500)",
            border: `1px solid ${showForecast ? "var(--purple)" : "var(--border)"}`,
            cursor: "pointer",
          }}
        >
          <div
            className="h-0.5 w-3 rounded-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${
                showForecast ? "var(--purple)" : "var(--neutral-400)"
              } 0px, ${showForecast ? "var(--purple)" : "var(--neutral-400)"} 3px, transparent 3px, transparent 6px)`,
            }}
          />
          30d forecast
        </button>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-5">
        <div
          className="cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:shadow-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(196,181,253,0.04) 50%, rgba(255,255,255,0.98) 100%)",
            borderColor: "rgba(167,139,250,0.2)",
          }}
          onClick={() => handleStageClick(TALK_LIFECYCLE_STAGES[0])}
        >
          <div
            style={{
              fontSize: "11px",
              color: "rgba(109,40,217,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 10,
              fontWeight: 600,
            }}
          >
            TOTAL CUSTOMERS
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
              marginBottom: 6,
            }}
          >
            7,500
          </div>
          <div style={{ fontSize: "13px", color: "rgba(109,40,217,0.65)", fontWeight: 500 }}>
            $2.65M ARR
          </div>
        </div>

        <div
          className="cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: "rgba(124,92,252,0.03)",
            borderColor: "rgba(124,92,252,0.2)",
          }}
          onClick={() => handleStageClick(TALK_LIFECYCLE_STAGES[1])}
        >
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 size={14} style={{ color: "var(--purple)" }} />
            <div
              style={{
                fontSize: "11px",
                color: "var(--purple)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 600,
              }}
            >
              RETAINED (HIGH MOMENTUM)
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--purple)",
                fontFamily: "var(--font-mono)",
              }}
            >
              35%
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              +2 pts
            </span>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--purple)",
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            2,625 customers · $1.55M ARR
          </div>
        </div>

        <div
          className="cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: "rgba(239,68,68,0.03)",
            borderColor: "rgba(239,68,68,0.2)",
          }}
          onClick={() => handleStageClick(TALK_LIFECYCLE_STAGES[2])}
        >
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle size={14} style={{ color: "var(--red)" }} />
            <div
              style={{
                fontSize: "11px",
                color: "var(--red)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 600,
              }}
            >
              AT RISK (DRIFTING + LAPSED)
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--red)",
                fontFamily: "var(--font-mono)",
              }}
            >
              42%
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--red)" }}>
              +4 pts
            </span>
          </div>
          <div style={{ fontSize: "13px", color: "var(--red)", fontWeight: 500, marginTop: 4 }}>
            3,150 customers · $780K ARR at risk
          </div>
        </div>

        <div
          className="cursor-pointer rounded-xl border p-5 transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: "rgba(54,179,126,0.03)",
            borderColor: "rgba(54,179,126,0.2)",
          }}
          onClick={() => handleStageClick(TALK_LIFECYCLE_STAGES[4])}
        >
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp size={14} style={{ color: "var(--green)" }} />
            <div
              style={{
                fontSize: "11px",
                color: "var(--green)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontWeight: 600,
              }}
            >
              REACTIVATED
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--green)",
                fontFamily: "var(--font-mono)",
              }}
            >
              6%
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              +1.2 pts
            </span>
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--green)",
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            450 customers · $110K ARR recovered
          </div>
        </div>
      </div>

      <div
        className="mb-8 grid grid-cols-3 gap-4 rounded-lg p-4"
        style={{
          backgroundColor: "rgba(54,179,126,0.04)",
          borderTop: "1.5px solid rgba(54,179,126,0.2)",
          borderBottom: "1.5px solid rgba(54,179,126,0.2)",
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
            REACTIVATION RATE
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
              24%
            </span>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--green)" }}>
              +4 pts
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
            TIME TO REACTIVATION
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--neutral-900)",
              fontFamily: "var(--font-mono)",
            }}
          >
            8.7 days
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
            RECOVERED ARR
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--green)",
              fontFamily: "var(--font-mono)",
            }}
          >
            $110K
          </div>
        </div>
      </div>

      <div className="relative mb-4" style={{ height: "330px" }}>
        <svg width="100%" height="310" viewBox={`0 0 ${chartWidth} 310`}>
          <defs>
            <linearGradient id="lcWaveGrad5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A7AE0" />
              <stop offset="25%" stopColor="#7C5CFC" />
              <stop offset="55%" stopColor="#FFA726" />
              <stop offset="75%" stopColor="#E04A4A" />
              <stop offset="100%" stopColor="#36B37E" />
            </linearGradient>
            <linearGradient id="lcWaveFill5" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A7AE0" stopOpacity="0.05" />
              <stop offset="25%" stopColor="#7C5CFC" stopOpacity="0.07" />
              <stop offset="55%" stopColor="#FFA726" stopOpacity="0.05" />
              <stop offset="75%" stopColor="#E04A4A" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#36B37E" stopOpacity="0.05" />
            </linearGradient>
            <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000" floodOpacity="0.12" />
            </filter>
          </defs>

          <path
            d={getGhostWavePath()}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            opacity="0.4"
          />

          <path
            d={`${getWavePath()} L ${chartWidth - 15},250 L 15,250 Z`}
            fill="url(#lcWaveFill5)"
          />

          <path
            d={getWavePath()}
            fill="none"
            stroke="url(#lcWaveGrad5)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {showForecast && (
            <g>
              <path
                d={getForecastWavePath()}
                fill="none"
                stroke="url(#lcWaveGrad5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="6,4"
                opacity="0.45"
              />
              {forecastPoints.map((forecastPoint, index) => {
                const current = dataPoints[index].stage;
                const percentageDelta = current.forecast30d.percentage - current.percentage;
                const arrDelta = current.forecast30d.arr - current.arr;
                const isNegative = percentageDelta < 0;

                return (
                  <g key={`fc-${current.name}`}>
                    <circle
                      cx={forecastPoint.x}
                      cy={forecastPoint.y}
                      r="4"
                      fill="white"
                      stroke={current.color}
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                      opacity="0.6"
                    />
                    <line
                      x1={dataPoints[index].x}
                      y1={dataPoints[index].y}
                      x2={forecastPoint.x}
                      y2={forecastPoint.y}
                      stroke={current.color}
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      opacity="0.25"
                    />
                    <text
                      x={forecastPoint.x}
                      y={
                        forecastPoint.y > dataPoints[index].y
                          ? forecastPoint.y + 18
                          : forecastPoint.y - 12
                      }
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fill: isNegative
                          ? "var(--green)"
                          : percentageDelta > 0
                            ? "var(--red)"
                            : "var(--neutral-500)",
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {percentageDelta > 0 ? "+" : ""}
                      {percentageDelta}%
                    </text>
                    <text
                      x={forecastPoint.x}
                      y={
                        forecastPoint.y > dataPoints[index].y
                          ? forecastPoint.y + 28
                          : forecastPoint.y - 2
                      }
                      textAnchor="middle"
                      style={{
                        fontSize: "8px",
                        fill: "var(--neutral-400)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {arrDelta >= 0 ? "+" : ""}${Math.round(arrDelta / 1000)}K
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {(() => {
            const lapsed = dataPoints[3];
            const reactivated = dataPoints[4];
            const midX = (lapsed.x + reactivated.x) / 2;
            const midY = Math.max(lapsed.y, reactivated.y) + 42;

            return (
              <g opacity="0.35">
                <path
                  d={`M ${lapsed.x + 10},${lapsed.y + 20} Q ${midX},${midY} ${reactivated.x - 10},${reactivated.y + 20}`}
                  fill="none"
                  stroke="#36B37E"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
                <polygon
                  points={`${reactivated.x - 14},${reactivated.y + 16} ${reactivated.x - 10},${reactivated.y + 22} ${reactivated.x - 6},${reactivated.y + 16}`}
                  fill="#36B37E"
                />
              </g>
            );
          })()}

          {dataPoints.map((point) => {
            const isSelected = selectedStage?.name === point.stage.name;
            const isHovered = hoveredStage === point.stage.name;
            const dimmed = Boolean(selectedStage) && !isSelected;
            const elevated = isHovered || isSelected;

            return (
              <g
                key={point.stage.name}
                opacity={dimmed ? 0.18 : 1}
                style={{ transition: "opacity 0.3s ease" }}
              >
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  style={{
                    fontSize: "30px",
                    fontWeight: 700,
                    fill: elevated ? point.stage.color : "var(--neutral-900)",
                    fontFamily: "var(--font-mono)",
                    transition: "fill 0.2s ease",
                  }}
                >
                  {point.stage.percentage}%
                </text>

                <g
                  style={{ cursor: "pointer" }}
                  onClick={() => handleStageClick(point.stage)}
                  onMouseEnter={() => setHoveredStage(point.stage.name)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <rect x={point.x - 60} y={point.y - 60} width={120} height={180} fill="transparent" />

                  {!isSelected && !isHovered && (
                    <circle
                      cx={point.x}
                      cy={point.y + 18}
                      r={10}
                      fill="none"
                      stroke={point.stage.color}
                      strokeWidth="1"
                      opacity="0.15"
                    >
                      <animate attributeName="r" values="10;13;10" dur="3s" repeatCount="indefinite" />
                      <animate
                        attributeName="opacity"
                        values="0.15;0.3;0.15"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  <circle
                    cx={point.x}
                    cy={point.y + 18}
                    r={isSelected ? 9 : isHovered ? 8 : 5}
                    fill={elevated ? point.stage.color : "white"}
                    stroke={point.stage.color}
                    strokeWidth={isSelected ? 3 : elevated ? 2.5 : 2}
                    style={{
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      filter: elevated ? "drop-shadow(0 2px 8px rgba(0,0,0,0.18))" : "none",
                    }}
                  />

                  {elevated && !isSelected && (
                    <circle
                      cx={point.x}
                      cy={point.y + 18}
                      r={2.5}
                      fill="white"
                      style={{ transition: "all 0.2s" }}
                    />
                  )}

                  {isSelected && (
                    <circle
                      cx={point.x}
                      cy={point.y + 18}
                      r={14}
                      fill="none"
                      stroke={point.stage.color}
                      strokeWidth="2"
                      opacity="0.3"
                    >
                      <animate attributeName="r" from="10" to="22" dur="1.5s" repeatCount="indefinite" />
                      <animate
                        attributeName="opacity"
                        from="0.4"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>

                <text
                  x={point.x}
                  y={262}
                  textAnchor="middle"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    fill: elevated ? point.stage.color : "var(--neutral-900)",
                    transition: "fill 0.2s ease",
                  }}
                >
                  {point.stage.name}
                </text>

                <text
                  x={point.x}
                  y={280}
                  textAnchor="middle"
                  style={{
                    fontSize: "12px",
                    fill: "var(--neutral-500)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                  }}
                >
                  {point.stage.count.toLocaleString()}
                </text>

                {isHovered && !isSelected && (
                  <g style={{ pointerEvents: "none" }}>
                    <rect
                      x={point.x - 82}
                      y={point.y - 110}
                      width={164}
                      height={80}
                      rx="10"
                      fill="white"
                      filter="url(#tooltipShadow)"
                      stroke={point.stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                    />
                    <text
                      x={point.x}
                      y={point.y - 88}
                      textAnchor="middle"
                      style={{ fontSize: "10px", fill: point.stage.color, fontWeight: 600 }}
                    >
                      {point.stage.usage.length > 34
                        ? `${point.stage.usage.substring(0, 32)}…`
                        : point.stage.usage}
                    </text>
                    <text
                      x={point.x - 30}
                      y={point.y - 68}
                      textAnchor="middle"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        fill: point.stage.deltaType === "positive" ? "#36B37E" : "#E04A4A",
                      }}
                    >
                      {point.stage.delta}
                    </text>
                    <text
                      x={point.x + 30}
                      y={point.y - 68}
                      textAnchor="middle"
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        fill: "var(--neutral-900)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ${(point.stage.arr / 1000).toFixed(0)}K
                    </text>
                    <text
                      x={point.x - 30}
                      y={point.y - 55}
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fill: "var(--neutral-500)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      TREND
                    </text>
                    <text
                      x={point.x + 30}
                      y={point.y - 55}
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fill: "var(--neutral-500)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                      }}
                    >
                      ARR
                    </text>
                    <text
                      x={point.x}
                      y={point.y - 38}
                      textAnchor="middle"
                      style={{
                        fontSize: "9px",
                        fill: "var(--neutral-300)",
                        fontWeight: 500,
                      }}
                    >
                      Click to explore →
                    </text>
                    <polygon
                      points={`${point.x - 6},${point.y - 30} ${point.x + 6},${point.y - 30} ${point.x},${point.y - 24}`}
                      fill="white"
                      stroke={point.stage.color}
                      strokeWidth="1.5"
                      strokeOpacity="0.3"
                    />
                    <line
                      x1={point.x - 5}
                      y1={point.y - 30}
                      x2={point.x + 5}
                      y2={point.y - 30}
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </g>
            );
          })}

          {!selectedStage &&
            TALK_LIFECYCLE_FLOWS.map((flow, index) => {
              const fromPoint = dataPoints[index];
              const toPoint = dataPoints[index + 1];
              const middleX = (fromPoint.x + toPoint.x) / 2;
              const middleY = (fromPoint.y + toPoint.y) / 2 + 36;

              return (
                <g key={`${flow.from}-${flow.to}`} opacity="0.4">
                  <text
                    x={middleX}
                    y={middleY}
                    textAnchor="middle"
                    style={{
                      fontSize: "10px",
                      fill: "var(--neutral-500)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 500,
                    }}
                  >
                    → {flow.count}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>

      {!selectedStage && (
        <div
          className="mb-4 rounded-lg p-3"
          style={{
            backgroundColor: "rgba(124,92,252,0.04)",
            border: "1px solid rgba(124,92,252,0.12)",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--neutral-700)", textAlign: "center" }}>
            Retained customers generate{" "}
            <strong style={{ color: "var(--purple)" }}>2.6×</strong> higher CLV than
            Drifting customers · Average Engagement Lifetime (ELT):{" "}
            <strong style={{ color: "var(--neutral-900)", fontFamily: "var(--font-mono)" }}>
              5.1 months
            </strong>
          </p>
        </div>
      )}

      {selectedStage && (
        <div
          className="mb-4 overflow-hidden rounded-xl border"
          style={{
            borderColor: selectedStage.color,
            borderWidth: "1.5px",
            boxShadow: `0 2px 12px ${selectedStage.color}12`,
          }}
        >
          <div className="flex items-stretch" style={{ borderBottom: `1px solid ${selectedStage.color}15` }}>
            <div
              className="flex min-w-[200px] items-center gap-3 px-5 py-4"
              style={{
                backgroundColor: `${selectedStage.color}08`,
                borderRight: `1px solid ${selectedStage.color}15`,
              }}
            >
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: selectedStage.color }}
              >
                <span style={{ fontSize: "14px", color: "white", fontWeight: 700 }}>
                  {selectedStage.percentage}%
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--neutral-900)",
                    lineHeight: 1.2,
                  }}
                >
                  {selectedStage.name}
                </div>
                <div
                  className="mt-0.5 flex items-center gap-1"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: selectedStage.deltaType === "positive" ? "var(--green)" : "var(--red)",
                  }}
                >
                  {selectedStage.deltaType === "positive" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {selectedStage.delta}
                </div>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-4 divide-x" style={{ borderColor: "var(--border)" }}>
              <div className="px-4 py-3">
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--neutral-500)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: 4,
                  }}
                >
                  RETURN RATE
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color:
                        selectedStage.returnRate < selectedStage.returnRateBench
                          ? "var(--red)"
                          : "var(--green)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {animatedMetrics.returnRate ?? 0}%
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--neutral-400)" }}>
                    / {selectedStage.returnRateBench}%
                  </span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--neutral-500)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: 4,
                  }}
                >
                  SESSION GAP
                </div>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: selectedStage.sessionGap.startsWith("+")
                      ? "var(--red)"
                      : selectedStage.sessionGap === "N/A"
                        ? "var(--neutral-400)"
                        : "var(--green)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {selectedStage.sessionGap}
                </span>
              </div>
              <div className="px-4 py-3">
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--neutral-500)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: 4,
                  }}
                >
                  CHURN RISK
                </div>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    color:
                      selectedStage.churnRisk === "Critical" || selectedStage.churnRisk === "High"
                        ? "var(--red)"
                        : selectedStage.churnRisk === "Moderate"
                          ? "var(--amber)"
                          : "var(--green)",
                  }}
                >
                  {selectedStage.churnRisk}
                </span>
              </div>
              <div className="px-4 py-3">
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--neutral-500)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    marginBottom: 4,
                  }}
                >
                  {selectedStage.name === "Reactivated"
                    ? "ARR RECOVERED"
                    : selectedStage.name === "Retained" || selectedStage.name === "Activated"
                      ? "ARR"
                      : "ARR AT RISK"}
                </div>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color:
                      selectedStage.name === "Reactivated"
                        ? "var(--green)"
                        : "var(--neutral-900)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ${(selectedStage.arr / 1000).toFixed(0)}K
                </span>
              </div>
            </div>

            <div className="flex items-center px-3" style={{ borderLeft: `1px solid ${selectedStage.color}10` }}>
              <button
                onClick={() => setSelectedStage(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{
                  fontSize: "14px",
                  color: "var(--neutral-500)",
                  backgroundColor: "var(--neutral-50)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex items-stretch" style={{ fontSize: "12px" }}>
            <div
              className="flex min-w-[280px] items-center gap-5 px-5 py-3"
              style={{
                backgroundColor: "var(--neutral-50)",
                borderRight: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp size={12} style={{ color: "var(--green)" }} />
                <span style={{ color: "var(--neutral-500)", fontSize: "10px", fontWeight: 600 }}>
                  IN
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--green)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                  }}
                >
                  {animatedMetrics.entering ?? 0}
                </span>
                <span style={{ color: "var(--neutral-400)", fontSize: "10px" }}>
                  from {selectedStage.enteringFrom}
                </span>
              </div>
              <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)" }} />
              <div className="flex items-center gap-1.5">
                <span style={{ color: "var(--purple)", fontSize: "12px" }}>→</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--purple)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                  }}
                >
                  {animatedMetrics.progressing ?? 0}
                </span>
                <span style={{ color: "var(--neutral-400)", fontSize: "10px" }}>
                  to {selectedStage.progressingTo}
                </span>
              </div>
              <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border)" }} />
              <div className="flex items-center gap-1.5">
                <TrendingDown size={12} style={{ color: "var(--red)" }} />
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--red)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "14px",
                  }}
                >
                  {animatedMetrics.lost ?? 0}
                </span>
                <span style={{ color: "var(--neutral-400)", fontSize: "10px" }}>
                  to {selectedStage.lostTo}
                </span>
              </div>
            </div>

            <div
              className="flex items-center px-4 py-3"
              style={{
                borderRight: "1px solid var(--border)",
                backgroundColor: "var(--neutral-50)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "var(--neutral-500)",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.4px",
                    marginBottom: 2,
                  }}
                >
                  LIFECYCLE
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--neutral-900)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {selectedStage.lifecycleDuration}
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-4 px-4 py-3"
              style={{
                borderRight: "1px solid var(--border)",
                backgroundColor: "var(--neutral-50)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp size={10} style={{ color: "var(--green)" }} />
                <span style={{ fontSize: "10px", color: "var(--neutral-500)", fontWeight: 600 }}>
                  EXPAND
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--green)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {selectedStage.expanding}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingDown size={10} style={{ color: "var(--red)" }} />
                <span style={{ fontSize: "10px", color: "var(--neutral-500)", fontWeight: 600 }}>
                  CONTRACT
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: selectedStage.contracting > 10 ? "var(--red)" : "var(--neutral-700)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {selectedStage.contracting}%
                </span>
              </div>
            </div>

            <div
              className="flex flex-1 items-center px-5 py-3"
              style={{ backgroundColor: `${selectedStage.color}04` }}
            >
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: selectedStage.color,
                    textTransform: "uppercase",
                    fontWeight: 700,
                    letterSpacing: "0.4px",
                    marginBottom: 2,
                  }}
                >
                  EXPECTED IMPACT
                </div>
                <span style={{ fontSize: "12px", color: "var(--neutral-700)", fontWeight: 500 }}>
                  {selectedStage.expectedImpact}
                </span>
              </div>
            </div>
          </div>

          <details style={{ borderTop: "1px solid var(--border)" }}>
            <summary
              className="flex cursor-pointer items-center justify-between px-5 py-3"
              style={{
                backgroundColor: "white",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--neutral-600)",
                listStyle: "none",
              }}
            >
              <span>Signal & Recommended Intervention</span>
              <ChevronDown size={14} style={{ color: "var(--neutral-400)" }} />
            </summary>
            <div className="grid grid-cols-2 gap-6 bg-white px-5 pb-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-3 w-1 rounded-full"
                    style={{ backgroundColor: selectedStage.color }}
                  />
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--neutral-500)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    STRONGEST SIGNAL
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--neutral-700)", lineHeight: "1.55" }}>
                  {selectedStage.signal}
                </p>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="h-3 w-1 rounded-full"
                    style={{ backgroundColor: "var(--purple)" }}
                  />
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--neutral-500)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    INTERVENTION
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "var(--neutral-700)", lineHeight: "1.55" }}>
                  {selectedStage.nextMove}
                </p>
              </div>
            </div>
          </details>
        </div>
      )}

      <YourNextMoveAccordion count={3} subtitle="3 interventions prioritized by AgentIQ">
        <ActionCard
          tagColor="var(--red)"
          tagBg="rgba(224,74,74,0.15)"
          tag="FIX DECAY"
          title="Trigger re-engagement within 3–5 days of session decline"
          description="2,100 Drifting customers, $520K ARR at risk, 48% return rate. Deploy behavioral email triggers and in-app nudges when session frequency drops ≥25% vs baseline."
        />
        <ActionCard
          tagColor="var(--amber)"
          tagBg="rgba(255,167,38,0.15)"
          tag="RESCUE LAPSED"
          title="Personal outreach for high-CLV Lapsed within 7 days"
          description="1,050 Lapsed customers, $260K ARR exposed. Prioritize top 30% by CLV for CSM video calls. Deploy lifecycle emails for the rest within the 7–10 day reactivation window."
        />
        <ActionCard
          tagColor="var(--green)"
          tagBg="rgba(54,179,126,0.15)"
          tag="SCALE REACTIVATION"
          title="Expand email reactivation — 1.9× channel lift"
          description="450 Reactivated customers proving the model works. Email shows 1.9× lift vs other channels. Increasing reactivation rate by +5 pts could recover ~$35K ARR."
        />
      </YourNextMoveAccordion>
    </div>
  );
}
