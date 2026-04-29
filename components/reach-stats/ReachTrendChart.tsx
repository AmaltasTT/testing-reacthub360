'use client';

import { useState, useRef, useEffect } from 'react';

interface ReachTrendChartProps {
  trendDays: string[];
  trendReach: number[];
  trendQR: number[];
  trendCpqr: number[];
  trendQRR: number[];
  benchmarkBand: { min: number; max: number };
}

const P = {
  text1: "#1d1d1f",
  text2: "#6e6e73",
  text3: "#aeaeb2",
  accent: "#7C3AED",
  divider: "rgba(0,0,0,0.06)",
};

export function ReachTrendChart({
  trendDays,
  trendReach,
  trendQR,
  trendCpqr,
  trendQRR,
  benchmarkBand,
}: ReachTrendChartProps) {
  const [visibleLines, setVisibleLines] = useState({
    reach: true,
    qr: true,
    cpqr: true,
    qrr: false,
    benchmark: true,
  });
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const width = 900;
  const height = 280;
  const padding = { top: 20, right: 80, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale functions
  const maxReach = Math.max(...trendReach);
  const maxQR = Math.max(...trendQR);
  const maxVolume = Math.max(maxReach, maxQR);
  const minVolume = Math.min(...trendReach, ...trendQR) * 0.95;

  const maxCpqr = Math.max(...trendCpqr);
  const minCpqr = Math.min(...trendCpqr) * 0.95;

  const maxQRR = 1.0;
  const minQRR = 0.5;

  const scaleX = (i: number) => padding.left + (i / (trendDays.length - 1)) * chartWidth;
  const scaleVolume = (v: number) => padding.top + chartHeight - ((v - minVolume) / (maxVolume - minVolume)) * chartHeight;
  const scaleCpqr = (v: number) => padding.top + chartHeight - ((v - minCpqr) / (maxCpqr - minCpqr)) * chartHeight;
  const scaleQRR = (v: number) => padding.top + chartHeight - ((v - minQRR) / (maxQRR - minQRR)) * chartHeight;

  // Generate path
  const makePath = (data: number[], scaleY: (v: number) => number) => {
    return data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)},${scaleY(v)}`).join(' ');
  };

  const fmt = (n: number) => {
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toFixed(0);
  };

  const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
  const fmtMoney = (n: number) => `$${n.toFixed(2)}`;

  // Toggle line visibility
  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  // Calculate deltas for tooltip
  const getDelta = (data: number[], idx: number) => {
    if (idx === 0) return null;
    const change = data[idx] - data[idx - 1];
    const pct = (change / data[idx - 1]) * 100;
    return { change, pct };
  };

  return (
    <div ref={chartRef} style={{ position: 'relative' }}>
      {/* Toggle Pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'reach' as const, label: 'Total Reach', color: '#94A3B8' },
          { key: 'qr' as const, label: 'Qualified Reach', color: P.accent },
          { key: 'cpqr' as const, label: 'CpQR', color: '#F59E0B' },
          { key: 'qrr' as const, label: 'QRR', color: '#10B981' },
          { key: 'benchmark' as const, label: 'Benchmark', color: '#E5E7EB' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleLine(key)}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              background: visibleLines[key] ? color : 'transparent',
              color: visibleLines[key] ? '#fff' : P.text3,
              border: `1px solid ${visibleLines[key] ? color : P.divider}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart SVG */}
      <div style={{ position: 'relative' }}>
        <svg width={width} height={height} style={{ display: 'block' }}>
          {/* Benchmark band (gray area) */}
          {visibleLines.benchmark && (
            <path
              d={`M ${padding.left},${scaleQRR(benchmarkBand.max)} L ${padding.left + chartWidth},${scaleQRR(benchmarkBand.max)} L ${padding.left + chartWidth},${scaleQRR(benchmarkBand.min)} L ${padding.left},${scaleQRR(benchmarkBand.min)} Z`}
              fill="#E5E7EB"
              opacity={0.3}
            />
          )}

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding.left}
              y1={padding.top + chartHeight * ratio}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight * ratio}
              stroke={P.divider}
              strokeWidth={1}
              strokeDasharray="2,3"
            />
          ))}

          {/* Gradient area for QR */}
          {visibleLines.qr && (
            <defs>
              <linearGradient id="qrGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={P.accent} stopOpacity={0.1} />
                <stop offset="100%" stopColor={P.accent} stopOpacity={0.01} />
              </linearGradient>
            </defs>
          )}
          {visibleLines.qr && (
            <path
              d={`${makePath(trendQR, scaleVolume)} L ${scaleX(trendQR.length - 1)},${padding.top + chartHeight} L ${scaleX(0)},${padding.top + chartHeight} Z`}
              fill="url(#qrGradient)"
            />
          )}

          {/* Lines */}
          {visibleLines.reach && (
            <path d={makePath(trendReach, scaleVolume)} fill="none" stroke="#94A3B8" strokeWidth={2} />
          )}
          {visibleLines.qr && (
            <path d={makePath(trendQR, scaleVolume)} fill="none" stroke={P.accent} strokeWidth={2.5} />
          )}
          {visibleLines.cpqr && (
            <path d={makePath(trendCpqr, scaleCpqr)} fill="none" stroke="#F59E0B" strokeWidth={2} />
          )}
          {visibleLines.qrr && (
            <path d={makePath(trendQRR, scaleQRR)} fill="none" stroke="#10B981" strokeWidth={2} />
          )}

          {/* Hover points */}
          {hoverIdx !== null && (
            <>
              <line
                x1={scaleX(hoverIdx)}
                y1={padding.top}
                x2={scaleX(hoverIdx)}
                y2={padding.top + chartHeight}
                stroke={P.accent}
                strokeWidth={1}
                strokeDasharray="4,2"
                opacity={0.5}
              />
              {visibleLines.reach && (
                <circle cx={scaleX(hoverIdx)} cy={scaleVolume(trendReach[hoverIdx])} r={4} fill="#94A3B8" />
              )}
              {visibleLines.qr && (
                <circle cx={scaleX(hoverIdx)} cy={scaleVolume(trendQR[hoverIdx])} r={5} fill={P.accent} />
              )}
              {visibleLines.cpqr && (
                <circle cx={scaleX(hoverIdx)} cy={scaleCpqr(trendCpqr[hoverIdx])} r={4} fill="#F59E0B" />
              )}
              {visibleLines.qrr && (
                <circle cx={scaleX(hoverIdx)} cy={scaleQRR(trendQRR[hoverIdx])} r={4} fill="#10B981" />
              )}
            </>
          )}

          {/* X-axis labels */}
          {trendDays.map((day, i) => (
            <text
              key={i}
              x={scaleX(i)}
              y={height - 10}
              textAnchor="middle"
              fontSize={11}
              fill={P.text3}
            >
              {day}
            </text>
          ))}

          {/* Y-axis labels (left - volume) */}
          {[minVolume, (minVolume + maxVolume) / 2, maxVolume].map((val, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={scaleVolume(val)}
              textAnchor="end"
              fontSize={10}
              fill={P.text3}
              alignmentBaseline="middle"
            >
              {fmt(val)}
            </text>
          ))}

          {/* Y-axis labels (right - CpQR) */}
          {visibleLines.cpqr && [minCpqr, (minCpqr + maxCpqr) / 2, maxCpqr].map((val, i) => (
            <text
              key={i}
              x={width - padding.right + 10}
              y={scaleCpqr(val)}
              textAnchor="start"
              fontSize={10}
              fill="#F59E0B"
              alignmentBaseline="middle"
            >
              {fmtMoney(val)}
            </text>
          ))}

          {/* Y-axis labels (far right - QRR) */}
          {visibleLines.qrr && [0.5, 0.75, 1.0].map((val, i) => (
            <text
              key={i}
              x={width - 10}
              y={scaleQRR(val)}
              textAnchor="start"
              fontSize={10}
              fill="#10B981"
              alignmentBaseline="middle"
            >
              {fmtPct(val)}
            </text>
          ))}

          {/* Axis labels */}
          <text x={padding.left - 50} y={padding.top + chartHeight / 2} textAnchor="middle" fontSize={11} fill={P.text2} transform={`rotate(-90, ${padding.left - 50}, ${padding.top + chartHeight / 2})`}>
            Reach (Volume)
          </text>
          {visibleLines.cpqr && (
            <text x={width - padding.right + 50} y={padding.top + chartHeight / 2} textAnchor="middle" fontSize={11} fill="#F59E0B" transform={`rotate(90, ${width - padding.right + 50}, ${padding.top + chartHeight / 2})`}>
              CpQR ($)
            </text>
          )}
          {visibleLines.qrr && (
            <text x={width - 5} y={padding.top + chartHeight / 2} textAnchor="middle" fontSize={11} fill="#10B981" transform={`rotate(90, ${width - 5}, ${padding.top + chartHeight / 2})`}>
              QRR (%)
            </text>
          )}
        </svg>

        {/* Hover overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: padding.left,
            width: chartWidth,
            height: chartHeight,
            cursor: 'crosshair',
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const idx = Math.round((x / chartWidth) * (trendDays.length - 1));
            setHoverIdx(Math.max(0, Math.min(idx, trendDays.length - 1)));
          }}
          onMouseLeave={() => setHoverIdx(null)}
        />

        {/* Tooltip */}
        {hoverIdx !== null && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: Math.min(scaleX(hoverIdx) - 80, width - 200),
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${P.divider}`,
              borderRadius: 10,
              padding: '12px 14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              fontSize: 12,
              minWidth: 180,
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8, color: P.text1 }}>
              {trendDays[hoverIdx]}
            </div>
            {visibleLines.reach && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#94A3B8' }}>Reach:</span>
                <span style={{ fontWeight: 600 }}>{fmt(trendReach[hoverIdx])}</span>
              </div>
            )}
            {visibleLines.qr && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: P.accent }}>QR:</span>
                <span style={{ fontWeight: 600 }}>{fmt(trendQR[hoverIdx])}</span>
              </div>
            )}
            {visibleLines.cpqr && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#F59E0B' }}>CpQR:</span>
                <span style={{ fontWeight: 600 }}>{fmtMoney(trendCpqr[hoverIdx])}</span>
              </div>
            )}
            {visibleLines.qrr && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: '#10B981' }}>QRR:</span>
                <span style={{ fontWeight: 600 }}>{fmtPct(trendQRR[hoverIdx])}</span>
              </div>
            )}
            {hoverIdx > 0 && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${P.divider}`, fontSize: 11, color: P.text3 }}>
                {(() => {
                  const qrDelta = getDelta(trendQR, hoverIdx);
                  const cpqrDelta = getDelta(trendCpqr, hoverIdx);
                  if (qrDelta && cpqrDelta) {
                    return (
                      <>
                        QR {qrDelta.pct > 0 ? '+' : ''}{qrDelta.pct.toFixed(1)}% ·
                        CpQR {cpqrDelta.pct > 0 ? '+' : ''}{cpqrDelta.pct.toFixed(1)}%
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
