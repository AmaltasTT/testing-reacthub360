"use client";

import { useRef, useState } from "react";
import type { ReachOverviewTrendsViewModel } from "@/lib/reach-stats/overview-view-model";
import { P } from "@/lib/reach-stats/data";

interface ReachTrendSectionProps {
  data: ReachOverviewTrendsViewModel;
}

const Card = ({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: P.card,
      borderRadius: 14,
      boxShadow: P.shadow,
      border: `1px solid ${P.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

const AgentIQHint = ({ text, action }: { text: string; action: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      background:
        "linear-gradient(135deg, rgba(124,58,237,0.04) 0%, rgba(139,92,246,0.07) 100%)",
      borderRadius: 8,
      border: "1px solid rgba(124,58,237,0.08)",
      marginTop: 10,
      cursor: "pointer",
    }}
  >
    <span style={{ fontSize: 13, color: P.accent }}>✦</span>
    <span style={{ fontSize: 12, color: P.text2, flex: 1 }}>{text}</span>
    <span style={{ fontSize: 11, fontWeight: 600, color: P.accent, whiteSpace: "nowrap" }}>
      {action} →
    </span>
  </div>
);

const formatCompactMillions = (value: number) => `${(value / 1_000_000).toFixed(1)}M`;

export function ReachTrendSection({ data }: ReachTrendSectionProps) {
  const [trendLines, setTrendLines] = useState({
    reach: false,
    qr: true,
    qrr: false,
    cpqr: true,
    benchmark: true,
  });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const toggleTrend = (key: keyof typeof trendLines) => {
    setTrendLines((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  const width = 860;
  const height = 280;
  const paddingLeft = 52;
  const paddingRight = 56;
  const paddingTop = 12;
  const paddingBottom = 36;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;
  const periods = data.periods.length > 0 ? data.periods : ["-"];
  const points = periods.length;
  const maxReachValue = Math.max(...data.reach, ...data.qr, 1);
  const maxVolumeAxis = Math.max(10, Math.ceil(maxReachValue / 10_000_000) * 10);
  const maxCpqrValue = Math.max(...data.cpqr, ...data.cpqrBenchmark, 1);
  const minCpqrValue = data.cpqr.length || data.cpqrBenchmark.length ? Math.min(...data.cpqr, ...data.cpqrBenchmark) : 0;
  const cpMin = Math.max(0, Math.floor(minCpqrValue - 1));
  const cpMax = Math.ceil(maxCpqrValue + 1);
  const qrrValues = data.qrr.map((value) => value * 100);
  const minQrrValue = qrrValues.length ? Math.min(...qrrValues) : 0;
  const maxQrrValue = qrrValues.length ? Math.max(...qrrValues) : 0;
  const qrrMin = Math.max(0, Math.floor(Math.min(minQrrValue, data.benchmarkBand.min * 100) - 3));
  const qrrMax = Math.min(100, Math.ceil(Math.max(maxQrrValue, data.benchmarkBand.max * 100) + 3));

  const xAt = (index: number) =>
    paddingLeft + (points === 1 ? 0 : (index / (points - 1)) * plotWidth);
  const yVol = (value: number) =>
    paddingTop + plotHeight - ((value / 1_000_000) / maxVolumeAxis) * plotHeight;
  const yCp = (value: number) =>
    paddingTop + plotHeight - ((value - cpMin) / Math.max(cpMax - cpMin, 1)) * plotHeight;
  const yQrr = (value: number) =>
    paddingTop + plotHeight - ((value * 100 - qrrMin) / Math.max(qrrMax - qrrMin, 1)) * plotHeight;

  const pathFor = (values: number[], yFn: (value: number) => number) =>
    values.map((value, index) => `${index === 0 ? "M" : "L"}${xAt(index)},${yFn(value)}`).join(" ");

  const qrPath = pathFor(data.qr, yVol);
  const qrArea = `${qrPath} L${xAt(points - 1)},${paddingTop + plotHeight} L${xAt(0)},${paddingTop + plotHeight} Z`;
  const benchmarkAverage =
    data.cpqrBenchmark.reduce((sum, value) => sum + value, 0) /
    Math.max(data.cpqrBenchmark.length, 1);

  return (
    <Card style={{ marginBottom: 24, padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "24px 28px 16px",
          borderBottom: `1px solid ${P.divider}`,
          background: "linear-gradient(180deg, rgba(250,249,255,0.5) 0%, transparent 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <h3 style={{ fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: -0.3 }}>
              Reach Trend
            </h3>
            <p style={{ fontSize: 13, color: P.text3, margin: "4px 0 0" }}>
              Volume, qualification, and cost efficiency over time
            </p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: P.text3, fontWeight: 500 }}>Latest QR</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>
                {formatCompactMillions(data.qr[data.qr.length - 1] ?? 0)}
              </div>
            </div>
            <div style={{ width: 1, background: P.divider }} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: P.text3, fontWeight: 500 }}>Latest CpQR</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: -0.3,
                  color:
                    (data.cpqr[data.cpqr.length - 1] ?? benchmarkAverage) <= benchmarkAverage
                      ? P.accent
                      : P.caution,
                }}
              >
                ${(data.cpqr[data.cpqr.length - 1] ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { key: "reach" as const, label: "Total Reach", stroke: "#9CA3AF", dash: true },
            { key: "qr" as const, label: "Qualified Reach", stroke: P.accent },
            { key: "qrr" as const, label: "QRR %", stroke: "#10B981" },
            { key: "cpqr" as const, label: "CpQR ($)", stroke: "#F59E0B" },
            { key: "benchmark" as const, label: "CpQR Benchmark", stroke: "#F59E0B", dash: true },
          ].map((line) => {
            const active = trendLines[line.key];
            return (
              <button
                key={line.key}
                onClick={() => toggleTrend(line.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 13px",
                  borderRadius: 20,
                  border: `1.5px solid ${active ? line.stroke : P.border}`,
                  background: active ? `${line.stroke}0A` : "rgba(0,0,0,0.015)",
                  cursor: "pointer",
                  opacity: active ? 1 : 0.35,
                }}
              >
                {line.dash ? (
                  <svg width={12} height={2}>
                    <line
                      x1={0}
                      y1={1}
                      x2={12}
                      y2={1}
                      stroke={active ? line.stroke : P.text3}
                      strokeWidth={1.5}
                      strokeDasharray="3,2"
                    />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: 12,
                      height: 3,
                      borderRadius: 2,
                      background: active ? line.stroke : P.text3,
                    }}
                  />
                )}
                <span style={{ fontSize: 12, color: active ? P.text1 : P.text3, fontWeight: active ? 600 : 400 }}>
                  {line.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={chartRef}
        style={{ position: "relative", padding: "20px 16px 8px" }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxHeight: 300, display: "block" }}>
          <defs>
            <linearGradient id="reach-trend-qr-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.accent} stopOpacity="0.12" />
              <stop offset="100%" stopColor={P.accent} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={paddingLeft}
              y1={paddingTop + plotHeight * (1 - ratio)}
              x2={paddingLeft + plotWidth}
              y2={paddingTop + plotHeight * (1 - ratio)}
              stroke={P.divider}
              strokeWidth={0.5}
            />
          ))}
          <line
            x1={paddingLeft}
            y1={paddingTop + plotHeight}
            x2={paddingLeft + plotWidth}
            y2={paddingTop + plotHeight}
            stroke={P.divider}
            strokeWidth={0.8}
          />

          {trendLines.benchmark && (
            <path
              d={pathFor(data.cpqrBenchmark, yCp)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={1.5}
              strokeDasharray="6,3"
              opacity={hoverIndex !== null ? 0.3 : 0.6}
            />
          )}

          {trendLines.reach && (
            <path
              d={pathFor(data.reach, yVol)}
              fill="none"
              stroke="#C4C4CC"
              strokeWidth={2}
              strokeDasharray="6,4"
              opacity={hoverIndex !== null ? 0.2 : 0.5}
            />
          )}

          {trendLines.qr && (
            <>
              <path d={qrArea} fill="url(#reach-trend-qr-area)" opacity={hoverIndex !== null ? 0.4 : 1} />
              <path
                d={qrPath}
                fill="none"
                stroke={P.accent}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={hoverIndex !== null ? 0.4 : 1}
              />
            </>
          )}

          {trendLines.cpqr && (
            <path
              d={pathFor(data.cpqr, yCp)}
              fill="none"
              stroke="#F59E0B"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={hoverIndex !== null ? 0.35 : 1}
            />
          )}

          {trendLines.qrr && (
            <path
              d={pathFor(data.qrr, yQrr)}
              fill="none"
              stroke="#10B981"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={hoverIndex !== null ? 0.35 : 1}
            />
          )}

          {periods.map((period, index) => {
            const x = xAt(index);
            const isHighlighted = hoverIndex === index;
            const isDimmed = hoverIndex !== null && !isHighlighted;

            return (
              <g key={`${period}-${index}`} opacity={isDimmed ? 0.15 : 1}>
                <rect
                  x={x - plotWidth / Math.max(points, 1) / 2}
                  y={0}
                  width={plotWidth / Math.max(points, 1)}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(index)}
                  style={{ cursor: "pointer" }}
                />
                {isHighlighted && (
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={paddingTop + plotHeight}
                    stroke={P.accent}
                    strokeWidth={1}
                    opacity={0.15}
                  />
                )}
                {trendLines.reach && (
                  <circle cx={x} cy={yVol(data.reach[index] ?? 0)} r={isHighlighted ? 5 : 3} fill="#C4C4CC" stroke="#fff" strokeWidth={2} />
                )}
                {trendLines.qr && (
                  <circle cx={x} cy={yVol(data.qr[index] ?? 0)} r={isHighlighted ? 6 : 4} fill={P.accent} stroke="#fff" strokeWidth={2} />
                )}
                {trendLines.cpqr && (
                  <circle cx={x} cy={yCp(data.cpqr[index] ?? 0)} r={isHighlighted ? 6 : 4} fill="#F59E0B" stroke="#fff" strokeWidth={2} />
                )}
                {trendLines.qrr && (
                  <circle cx={x} cy={yQrr(data.qrr[index] ?? 0)} r={isHighlighted ? 6 : 4} fill="#10B981" stroke="#fff" strokeWidth={2} />
                )}
                <text
                  x={x}
                  y={paddingTop + plotHeight + 20}
                  fontSize={10.5}
                  fill={isHighlighted ? P.text1 : P.text3}
                  textAnchor="middle"
                  fontWeight={isHighlighted ? 700 : 400}
                >
                  {period}
                </text>
              </g>
            );
          })}

          {(trendLines.reach || trendLines.qr) &&
            [0, maxVolumeAxis * 0.5, maxVolumeAxis].map((value, i) => (
              <text
                key={i}
                x={paddingLeft - 8}
                y={yVol(value * 1_000_000) + 3.5}
                fontSize={9}
                fill={P.text3}
                textAnchor="end"
              >
                {value === 0 ? "0" : `${value}M`}
              </text>
            ))}

          {trendLines.cpqr &&
            [cpMin, (cpMin + cpMax) / 2, cpMax].map((value, i) => (
              <text
                key={i}
                x={paddingLeft + plotWidth + 8}
                y={yCp(value) + 3.5}
                fontSize={9}
                fill="#F59E0B"
                textAnchor="start"
              >
                ${value.toFixed(1)}
              </text>
            ))}

          {trendLines.qrr &&
            [qrrMin, (qrrMin + qrrMax) / 2, qrrMax].map((value, i) => (
              <text
                key={i}
                x={paddingLeft + plotWidth + 38}
                y={yQrr(value / 100) + 3.5}
                fontSize={9}
                fill="#10B981"
                textAnchor="start"
              >
                {Math.round(value)}%
              </text>
            ))}
        </svg>

        {hoverIndex !== null && (() => {
          const chartWidth = chartRef.current?.clientWidth || width;
          const x = xAt(hoverIndex);
          const left = (x / width) * chartWidth;
          const placeLeft = hoverIndex <= points / 2;
          const previousQr = hoverIndex > 0 ? data.qr[hoverIndex - 1] : null;
          const previousCpqr = hoverIndex > 0 ? data.cpqr[hoverIndex - 1] : null;

          const qrDelta = previousQr == null ? null : ((data.qr[hoverIndex] - previousQr) / previousQr) * 100;
          const cpqrDelta =
            previousCpqr == null ? null : ((data.cpqr[hoverIndex] - previousCpqr) / previousCpqr) * 100;

          return (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: placeLeft ? left + 20 : "auto",
                right: placeLeft ? "auto" : chartWidth - left + 20,
                width: 260,
                background: "rgba(255,255,255,0.97)",
                borderRadius: 16,
                boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.06)",
                zIndex: 20,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
                  {periods[hoverIndex]}
                </span>
              </div>
              <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: P.text3 }}>Total Reach</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#9CA3AF" }}>
                    {formatCompactMillions(data.reach[hoverIndex])}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: P.text3 }}>Qualified Reach</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: P.accent }}>
                      {formatCompactMillions(data.qr[hoverIndex])}
                    </span>
                    {qrDelta != null && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: qrDelta >= 0 ? P.accent : P.danger,
                        }}
                      >
                        {qrDelta >= 0 ? "+" : ""}
                        {qrDelta.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: P.text3 }}>QRR</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#10B981" }}>
                    {(data.qrr[hoverIndex] * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: P.text3 }}>CpQR</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#F59E0B" }}>
                      ${data.cpqr[hoverIndex].toFixed(2)}
                    </span>
                    {cpqrDelta != null && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: cpqrDelta <= 0 ? P.accent : P.danger,
                        }}
                      >
                        {cpqrDelta >= 0 ? "+" : ""}
                        {cpqrDelta.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 12, color: P.text3 }}>Benchmark</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: P.text3 }}>
                    ${(data.cpqrBenchmark[hoverIndex] ?? benchmarkAverage).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <div style={{ padding: "0 28px 20px" }}>
        <AgentIQHint
          text={`Benchmark CpQR is averaging $${benchmarkAverage.toFixed(
            2
          )} while the latest qualified reach closed at ${formatCompactMillions(
            data.qr[data.qr.length - 1] ?? 0
          )}.`}
          action="Run scenario"
        />
      </div>
    </Card>
  );
}
